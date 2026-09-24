"use server"

import { revalidatePath, updateTag } from "next/cache"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { milestones } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/require-admin"
import { zodFieldErrors } from "@/lib/validation"
import { milestoneSchema } from "@/app/admin/(dashboard)/milestones/schema"

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
  const isPublished = formData.get("isPublished") === "true"
  const needsTranslationReview =
    formData.get("needsTranslationReview") === "true"

  const parsed = milestoneSchema.safeParse({
    yearEn: String(formData.get("yearEn") ?? ""),
    yearFr: String(formData.get("yearFr") ?? ""),
    titleEn: String(formData.get("titleEn") ?? ""),
    titleFr: String(formData.get("titleFr") ?? ""),
    descriptionEn: String(formData.get("descriptionEn") ?? ""),
    descriptionFr: String(formData.get("descriptionFr") ?? ""),
    icon: String(formData.get("icon") ?? ""),
    position: formData.get("position") ?? 0,
  })

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the fields below.",
      fieldErrors: zodFieldErrors(parsed.error),
    }
  }

  const {
    yearEn,
    yearFr,
    titleEn,
    titleFr,
    descriptionEn,
    descriptionFr,
    icon,
    position,
  } = parsed.data

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

  updateTag("milestones")
  revalidatePath("/[locale]/about", "page")
  redirect("/admin/milestones?toast=milestone-saved")
}

export async function deleteMilestone(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get("id"))
  await db.delete(milestones).where(eq(milestones.id, id))
  revalidatePath("/admin/milestones")
  updateTag("milestones")
  revalidatePath("/[locale]/about", "page")
  redirect("/admin/milestones?toast=milestone-deleted")
}
