"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { put } from "@vercel/blob"

import { db } from "@/lib/db"
import { events } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/require-admin"
import { sendNewsletterForEvent } from "@/lib/newsletter/send-event-newsletter"

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
  const titleEn = String(formData.get("titleEn") ?? "").trim()
  const titleFr = String(formData.get("titleFr") ?? "").trim()
  const excerptEn = String(formData.get("excerptEn") ?? "").trim()
  const excerptFr = String(formData.get("excerptFr") ?? "").trim()
  const bodyEn = String(formData.get("bodyEn") ?? "").trim()
  const bodyFr = String(formData.get("bodyFr") ?? "").trim()
  const category = String(formData.get("category") ?? "").trim()
  const intent = formData.get("intent") === "publish" ? "publish" : "draft"
  const coverImage = formData.get("coverImage")

  const fieldErrors: EventFormState["fieldErrors"] = {}
  if (!titleEn) fieldErrors.titleEn = "Enter an English title."
  if (!titleFr) fieldErrors.titleFr = "Enter a French title."
  if (!excerptEn) fieldErrors.excerptEn = "Enter an English excerpt."
  if (!excerptFr) fieldErrors.excerptFr = "Enter a French excerpt."
  if (!bodyEn) fieldErrors.bodyEn = "Enter English body text."
  if (!bodyFr) fieldErrors.bodyFr = "Enter French body text."
  if (!category) fieldErrors.category = "Enter a category."

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please fix the fields below.",
      fieldErrors,
    }
  }

  let coverImageUrl: string | undefined
  if (coverImage instanceof File && coverImage.size > 0) {
    const blob = await put(
      `events/${Date.now()}-${coverImage.name}`,
      coverImage,
      {
        access: "public",
      }
    )
    coverImageUrl = blob.url
  }

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
        ...(coverImageUrl ? { coverImageUrl } : {}),
        status: intent,
        publishedAt:
          intent === "publish"
            ? (existing.publishedAt ?? new Date())
            : existing.publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(events.id, id))

    if (shouldSendNewsletter) {
      await sendNewsletterForEvent(id)
      await db
        .update(events)
        .set({ newsletterSentAt: new Date() })
        .where(eq(events.id, id))
    }
  } else {
    const slug = await generateUniqueSlug(titleEn)
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
        coverImageUrl,
        status: intent,
        publishedAt: intent === "publish" ? new Date() : null,
        createdBy: user.id,
      })
      .returning()

    if (intent === "publish") {
      await sendNewsletterForEvent(created.id)
      await db
        .update(events)
        .set({ newsletterSentAt: new Date() })
        .where(eq(events.id, created.id))
    }
  }

  revalidatePath("/news")
  redirect("/admin/events")
}

export async function deleteEvent(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get("id"))
  await db.delete(events).where(eq(events.id, id))
  revalidatePath("/admin/events")
  revalidatePath("/news")
}
