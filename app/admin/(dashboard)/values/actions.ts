"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { values } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/require-admin"
import { iconMap } from "@/components/icon-map"

export type ValueFormState = {
  status: "idle" | "error"
  message?: string
  fieldErrors?: Partial<
    Record<
      "titleEn" | "titleFr" | "descriptionEn" | "descriptionFr" | "icon",
      string
    >
  >
}

export async function saveValue(
  _prevState: ValueFormState,
  formData: FormData
): Promise<ValueFormState> {
  await requireAdmin()

  const id = formData.get("id") ? Number(formData.get("id")) : null
  const titleEn = String(formData.get("titleEn") ?? "").trim()
  const titleFr = String(formData.get("titleFr") ?? "").trim()
  const descriptionEn = String(formData.get("descriptionEn") ?? "").trim()
  const descriptionFr = String(formData.get("descriptionFr") ?? "").trim()
  const icon = String(formData.get("icon") ?? "").trim()
  const isPublished = formData.get("isPublished") === "true"
  const needsTranslationReview =
    formData.get("needsTranslationReview") === "true"
  const position = Number(formData.get("position") ?? 0)

  const fieldErrors: ValueFormState["fieldErrors"] = {}
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
    const [existing] = await db.select().from(values).where(eq(values.id, id))
    if (!existing) {
      return { status: "error", message: "Value not found." }
    }

    await db
      .update(values)
      .set({
        icon,
        position,
        isPublished,
        titleEn,
        titleFr,
        descriptionEn,
        descriptionFr,
        needsTranslationReview,
        updatedAt: new Date(),
      })
      .where(eq(values.id, id))
  } else {
    await db.insert(values).values({
      icon,
      position,
      isPublished,
      titleEn,
      titleFr,
      descriptionEn,
      descriptionFr,
      needsTranslationReview,
    })
  }

  revalidatePath("/about")
  redirect("/admin/values?toast=value-saved")
}

export async function deleteValue(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get("id"))
  await db.delete(values).where(eq(values.id, id))
  revalidatePath("/admin/values")
  revalidatePath("/about")
  redirect("/admin/values?toast=value-deleted")
}
