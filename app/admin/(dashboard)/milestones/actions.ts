"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/lib/db"
import { milestones } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/require-admin"
import { iconMap } from "@/components/icon-map"
import {
  nonEmptyString,
  positionSchema,
  zodFieldErrors,
} from "@/lib/validation"

const milestoneSchema = z.object({
  yearEn: nonEmptyString(100, "an English year/period label"),
  yearFr: nonEmptyString(100, "a French year/period label"),
  titleEn: nonEmptyString(200, "an English title"),
  titleFr: nonEmptyString(200, "a French title"),
  descriptionEn: nonEmptyString(1000, "an English description"),
  descriptionFr: nonEmptyString(1000, "a French description"),
  icon: z.string().refine((v) => v in iconMap, "Choose an icon."),
  position: positionSchema,
})

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
