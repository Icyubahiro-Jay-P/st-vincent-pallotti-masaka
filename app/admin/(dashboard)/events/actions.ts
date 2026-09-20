"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/lib/db"
import { events, eventMedia } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/require-admin"
import { sendNewsletterForEvent } from "@/lib/newsletter/send-event-newsletter"
import { zodFieldErrors } from "@/lib/validation"

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

type GalleryMediaInput = {
  kind: "photo" | "video"
  cloudinaryPublicId: string
  cloudinaryUrl: string
  backupObjectKey: string
  bytes: number
}

function parseGalleryMedia(
  raw: FormDataEntryValue | null
): GalleryMediaInput[] {
  if (typeof raw !== "string" || !raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as GalleryMediaInput[]) : []
  } catch {
    return []
  }
}

async function generateUniqueSlug(title: string) {
  const base =
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "event"

  let slug = base
  let suffix = 1
  while (true) {
    const existing = await db
      .select({ id: events.id })
      .from(events)
      .where(eq(events.slug, slug))
    if (existing.length === 0) return slug
    slug = `${base}-${suffix++}`
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
  const coverImagePublicId = formData.get("coverImagePublicId")
  const coverImageUrl = formData.get("coverImageUrl")
  const coverImageBackupKey = formData.get("coverImageBackupKey")
  const galleryMedia = parseGalleryMedia(formData.get("galleryMediaJson"))

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
  const coverImageFields =
    typeof coverImageUrl === "string" && coverImageUrl
      ? {
          coverImageUrl,
          coverImagePublicId:
            typeof coverImagePublicId === "string" ? coverImagePublicId : null,
          coverImageBackupKey:
            typeof coverImageBackupKey === "string"
              ? coverImageBackupKey
              : null,
        }
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
    const slug = await generateUniqueSlug(titleEn || titleFr)
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

  revalidatePath("/news")
  redirect(
    intent === "publish"
      ? "/admin/events?toast=event-published"
      : "/admin/events?toast=event-draft-saved"
  )
}

export async function deleteEvent(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get("id"))
  await db.delete(events).where(eq(events.id, id))
  revalidatePath("/admin/events")
  revalidatePath("/news")
  redirect("/admin/events?toast=event-deleted")
}
