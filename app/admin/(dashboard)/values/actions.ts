"use server"

import { revalidatePath, updateTag } from "next/cache"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { values } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/require-admin"
import { zodFieldErrors } from "@/lib/validation"
import { valueSchema } from "@/app/admin/(dashboard)/values/schema"

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
  const isPublished = formData.get("isPublished") === "true"
  const needsTranslationReview =
    formData.get("needsTranslationReview") === "true"

  const parsed = valueSchema.safeParse({
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

  const { titleEn, titleFr, descriptionEn, descriptionFr, icon, position } =
    parsed.data

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

  updateTag("values")
  revalidatePath("/[locale]/about", "page")
  redirect("/admin/values?toast=value-saved")
}

export async function deleteValue(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get("id"))
  await db.delete(values).where(eq(values.id, id))
  revalidatePath("/admin/values")
  updateTag("values")
  revalidatePath("/[locale]/about", "page")
  redirect("/admin/values?toast=value-deleted")
}
