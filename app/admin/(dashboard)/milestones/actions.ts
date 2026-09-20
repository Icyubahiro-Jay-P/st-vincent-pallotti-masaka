"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { milestones } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/require-admin"
import { iconMap } from "@/components/icon-map"

export type MilestoneFormState = {
  status: "idle" | "error"
  message?: string
  fieldErrors?: Partial<
    Record<
      | "yearEn"
      | "yearFr"
      | "titleEn"
      | "titleFr"
      | "descriptionEn"
      | "descriptionFr"
      | "icon",
      string
    >
  >
}

export async function saveMilestone(
  _prevState: MilestoneFormState,
  formData: FormData
): Promise<MilestoneFormState> {
  await requireAdmin()

  const id = formData.get("id") ? Number(formData.get("id")) : null
  const yearEn = String(formData.get("yearEn") ?? "").trim()
  const yearFr = String(formData.get("yearFr") ?? "").trim()
  const titleEn = String(formData.get("titleEn") ?? "").trim()
  const titleFr = String(formData.get("titleFr") ?? "").trim()
  const descriptionEn = String(formData.get("descriptionEn") ?? "").trim()
  const descriptionFr = String(formData.get("descriptionFr") ?? "").trim()
  const icon = String(formData.get("icon") ?? "").trim()
  const isPublished = formData.get("isPublished") === "true"
  const needsTranslationReview =
    formData.get("needsTranslationReview") === "true"
  const position = Number(formData.get("position") ?? 0)

  const fieldErrors: MilestoneFormState["fieldErrors"] = {}
  if (!yearEn) fieldErrors.yearEn = "Enter an English year/period label."
  if (!yearFr) fieldErrors.yearFr = "Enter a French year/period label."
  if (!titleEn) fieldErrors.titleEn = "Enter an English title."
  if (!titleFr) fieldErrors.titleFr = "Enter a French title."
  if (!descriptionEn)
    fieldErrors.descriptionEn = "Enter an English description."
  if (!descriptionFr) fieldErrors.descriptionFr = "Enter a French description."
  if (!icon || !(icon in iconMap)) fieldErrors.icon = "Choose an icon."

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please fix the fields below.",
      fieldErrors,
    }
  }

  if (id) {
    const [existing] = await db
      .select()
      .from(milestones)
      .where(eq(milestones.id, id))
    if (!existing) {
      return { status: "error", message: "Milestone not found." }
    }

    await db
      .update(milestones)
      .set({
        icon,
        position,
        isPublished,
        yearEn,
        yearFr,
        titleEn,
        titleFr,
        descriptionEn,
        descriptionFr,
        needsTranslationReview,
        updatedAt: new Date(),
      })
      .where(eq(milestones.id, id))
  } else {
    await db.insert(milestones).values({
      icon,
      position,
      isPublished,
      yearEn,
      yearFr,
      titleEn,
      titleFr,
      descriptionEn,
      descriptionFr,
      needsTranslationReview,
    })
  }

  revalidatePath("/about")
  redirect("/admin/milestones?toast=milestone-saved")
}

export async function deleteMilestone(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get("id"))
  await db.delete(milestones).where(eq(milestones.id, id))
  revalidatePath("/admin/milestones")
  revalidatePath("/about")
  redirect("/admin/milestones?toast=milestone-deleted")
}
