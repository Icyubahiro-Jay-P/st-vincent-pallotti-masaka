"use server"

import { revalidatePath, updateTag } from "next/cache"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/lib/db"
import { events, eventMedia } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/require-admin"
import { sendNewsletterForEvent } from "@/lib/newsletter/send-event-newsletter"
import { zodFieldErrors } from "@/lib/validation"
import { MAX_UPLOAD_BYTES } from "@/lib/media/upload-limits"
import { generateUniqueSlug } from "@/lib/slug"

// Length caps only, applied regardless of draft/publish — whether each
// field is actually *required* still depends on intent, handled below with
// the existing imperative logic so draft-with-just-a-title keeps working.
const eventCapsSchema = z.object({
  titleEn: z.string().trim().max(200, "Title must be 200 characters or fewer."),
  titleFr: z.string().trim().max(200, "Title must be 200 characters or fewer."),
  excerptEn: z
    .string()
    .trim()
    .max(500, "Excerpt must be 500 characters or fewer."),
  excerptFr: z
    .string()
    .trim()
    .max(500, "Excerpt must be 500 characters or fewer."),
  bodyEn: z
    .string()
    .trim()
    .max(20000, "Body text must be 20,000 characters or fewer."),
  bodyFr: z
    .string()
    .trim()
    .max(20000, "Body text must be 20,000 characters or fewer."),
  category: z
    .string()
    .trim()
    .max(100, "Category must be 100 characters or fewer."),
})

export type EventFormState = {
  status: "idle" | "error"
  message?: string
  fieldErrors?: Partial<
    Record<
      | "titleEn"
      | "titleFr"
      | "excerptEn"
      | "excerptFr"
      | "bodyEn"
      | "bodyFr"
      | "category",
      string
    >
  >
}

const galleryMediaItemSchema = z.object({
  kind: z.enum(["photo", "video"]),
  cloudinaryPublicId: z.string().trim().min(1).max(300),
  cloudinaryUrl: z.string().trim().url(),
  backupObjectKey: z.string().trim().min(1).max(300),
  bytes: z.number().int().nonnegative().max(MAX_UPLOAD_BYTES),
})

type GalleryMediaInput = z.infer<typeof galleryMediaItemSchema>

// ponytail: hard cap so a tampered/runaway payload can't force a
// huge single INSERT — 50 is generous for one event's gallery.
const MAX_GALLERY_ITEMS = 50

const coverImageSchema = z.object({
  coverImageUrl: z.string().trim().url(),
  coverImagePublicId: z.string().trim().min(1).max(300).nullable(),
  coverImageBackupKey: z.string().trim().min(1).max(300).nullable(),
})

// Returns null fields (not a validation error) when no cover image was
// uploaded - the form field is optional, so an empty/malformed value here
// means "no cover image", same as before this validation existed. `dropped`
// distinguishes that from a cover image that WAS provided but failed
// validation, so the admin gets a toast (same pattern as gallery items)
// instead of a silent no-op.
function parseCoverImage(formData: FormData): {
  coverImageUrl: string | null
  coverImagePublicId: string | null
  coverImageBackupKey: string | null
  dropped: boolean
} {
  const coverImageUrl = formData.get("coverImageUrl")
  if (typeof coverImageUrl !== "string" || !coverImageUrl) {
    return {
      coverImageUrl: null,
      coverImagePublicId: null,
      coverImageBackupKey: null,
      dropped: false,
    }
  }

  const coverImagePublicId = formData.get("coverImagePublicId")
  const coverImageBackupKey = formData.get("coverImageBackupKey")
  const result = coverImageSchema.safeParse({
    coverImageUrl,
    coverImagePublicId:
      typeof coverImagePublicId === "string" ? coverImagePublicId : null,
    coverImageBackupKey:
      typeof coverImageBackupKey === "string" ? coverImageBackupKey : null,
  })

  return result.success
    ? { ...result.data, dropped: false }
    : {
        coverImageUrl: null,
        coverImagePublicId: null,
        coverImageBackupKey: null,
        dropped: true,
      }
}

function parseGalleryMedia(raw: FormDataEntryValue | null): {
  items: GalleryMediaInput[]
  droppedCount: number
} {
  if (typeof raw !== "string" || !raw) return { items: [], droppedCount: 0 }
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return { items: [], droppedCount: 0 }
    const capped = parsed.slice(0, MAX_GALLERY_ITEMS)
    // Drop any item that doesn't match the expected shape rather than
    // rejecting the whole save - this field is populated by our own
    // upload widget, so a malformed item means a stale/tampered payload,
    // not a form the admin needs to be told to fix. The admin still gets
    // a toast naming how many were skipped (see the redirect below), so
    // it isn't a silent partial save.
    const items = capped.flatMap((item) => {
      const result = galleryMediaItemSchema.safeParse(item)
      return result.success ? [result.data] : []
    })
    return { items, droppedCount: parsed.length - items.length }
  } catch {
    return { items: [], droppedCount: 0 }
  }
}

export async function saveEvent(
  _prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  const { user } = await requireAdmin()

  const id = formData.get("id") ? Number(formData.get("id")) : null
  const intent = formData.get("intent") === "publish" ? "publish" : "draft"
  const needsTranslationReview =
    formData.get("needsTranslationReview") === "true"
  const coverImage = parseCoverImage(formData)
  const { items: galleryMedia, droppedCount: galleryDropped } =
    parseGalleryMedia(formData.get("galleryMediaJson"))

  const caps = eventCapsSchema.safeParse({
    titleEn: String(formData.get("titleEn") ?? ""),
    titleFr: String(formData.get("titleFr") ?? ""),
    excerptEn: String(formData.get("excerptEn") ?? ""),
    excerptFr: String(formData.get("excerptFr") ?? ""),
    bodyEn: String(formData.get("bodyEn") ?? ""),
    bodyFr: String(formData.get("bodyFr") ?? ""),
    category: String(formData.get("category") ?? ""),
  })

  if (!caps.success) {
    return {
      status: "error",
      message: "Please fix the fields below.",
      fieldErrors: zodFieldErrors(caps.error),
    }
  }

  const { titleEn, titleFr, excerptEn, excerptFr, bodyEn, bodyFr, category } =
    caps.data

  // Publishing needs a complete bilingual event; a draft only needs enough
  // of a title to identify it later, so every other field can stay blank.
  const fieldErrors: EventFormState["fieldErrors"] = {}
  if (intent === "publish") {
    if (!titleEn) fieldErrors.titleEn = "Enter an English title."
    if (!titleFr) fieldErrors.titleFr = "Enter a French title."
    if (!excerptEn) fieldErrors.excerptEn = "Enter an English excerpt."
    if (!excerptFr) fieldErrors.excerptFr = "Enter a French excerpt."
    if (!bodyEn) fieldErrors.bodyEn = "Enter English body text."
    if (!bodyFr) fieldErrors.bodyFr = "Enter French body text."
    if (!category) fieldErrors.category = "Enter a category."
  } else if (!titleEn && !titleFr) {
    fieldErrors.titleEn = "Enter a title to save a draft."
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please fix the fields below.",
      fieldErrors,
    }
  }

  // The browser already uploaded the (compressed) file straight to
  // Cloudinary and the backup bucket via upload-actions.ts; this action
  // only ever receives the resulting URLs/keys, never the file itself.
  // parseCoverImage validates the shape (real URL, bounded key lengths)
  // and returns all-null fields if anything's missing/malformed, same
  // as "no cover image was set". `dropped` is stripped here since it's
  // not a DB column - it only feeds the redirect's toast param below.
  const { dropped: coverDropped, ...coverImageParsed } = coverImage
  const coverImageFields = coverImageParsed.coverImageUrl
    ? coverImageParsed
    : {}

  let eventId: number

  if (id) {
    const [existing] = await db.select().from(events).where(eq(events.id, id))
    if (!existing) {
      return { status: "error", message: "Event not found." }
    }

    const shouldSendNewsletter =
      intent === "publish" && !existing.newsletterSentAt

    await db
      .update(events)
      .set({
        titleEn,
        titleFr,
        excerptEn,
        excerptFr,
        bodyEn,
        bodyFr,
        category,
        ...coverImageFields,
        needsTranslationReview,
        status: intent === "publish" ? "published" : "draft",
        publishedAt:
          intent === "publish"
            ? (existing.publishedAt ?? new Date())
            : existing.publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(events.id, id))

    eventId = id

    if (shouldSendNewsletter) {
      await sendNewsletterForEvent(id)
      await db
        .update(events)
        .set({ newsletterSentAt: new Date() })
        .where(eq(events.id, id))
    }
  } else {
    const slug = await generateUniqueSlug(
      events,
      events.slug,
      titleEn || titleFr,
      "event"
    )
    const [created] = await db
      .insert(events)
      .values({
        slug,
        titleEn,
        titleFr,
        excerptEn,
        excerptFr,
        bodyEn,
        bodyFr,
        category,
        ...coverImageFields,
        needsTranslationReview,
        status: intent === "publish" ? "published" : "draft",
        publishedAt: intent === "publish" ? new Date() : null,
        createdBy: user.id,
      })
      .returning()

    eventId = created.id

    if (intent === "publish") {
      await sendNewsletterForEvent(created.id)
      await db
        .update(events)
        .set({ newsletterSentAt: new Date() })
        .where(eq(events.id, created.id))
    }
  }

  if (galleryMedia.length > 0) {
    // Offset by what's already saved so re-saving an edited event (adding
    // more items in a later pass) doesn't collide with existing positions.
    const existingMedia = await db
      .select({ id: eventMedia.id })
      .from(eventMedia)
      .where(eq(eventMedia.eventId, eventId))
    const positionOffset = existingMedia.length

    // v1 only supports adding gallery items on save; deleting individual
    // already-saved items through this form is scoped out for later.
    await db.insert(eventMedia).values(
      galleryMedia.map((item, index) => ({
        eventId,
        kind: item.kind,
        cloudinaryPublicId: item.cloudinaryPublicId,
        cloudinaryUrl: item.cloudinaryUrl,
        backupObjectKey: item.backupObjectKey,
        bytes: item.bytes,
        position: positionOffset + index,
      }))
    )
  }

  updateTag("events")
  revalidatePath("/news")
  const toastKey =
    intent === "publish" ? "event-published" : "event-draft-saved"
  const galleryDroppedParam =
    galleryDropped > 0 ? `&galleryDropped=${galleryDropped}` : ""
  const coverDroppedParam = coverDropped ? "&coverDropped=1" : ""
  redirect(
    `/admin/events?toast=${toastKey}${galleryDroppedParam}${coverDroppedParam}`
  )
}

export async function deleteEvent(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get("id"))
  await db.delete(events).where(eq(events.id, id))
  updateTag("events")
  revalidatePath("/admin/events")
  revalidatePath("/news")
  redirect("/admin/events?toast=event-deleted")
}
