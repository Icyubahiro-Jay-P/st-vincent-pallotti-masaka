"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { programs } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/require-admin"
import { iconMap } from "@/components/icon-map"

export type ProgramFormState = {
  status: "idle" | "error"
  message?: string
  fieldErrors?: Partial<
    Record<
      | "nameEn"
      | "nameFr"
      | "ageRangeEn"
      | "ageRangeFr"
      | "descriptionEn"
      | "descriptionFr"
      | "overviewEn"
      | "overviewFr"
      | "icon",
      string
    >
  >
}

async function generateUniqueSlug(name: string) {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "program"

  let slug = base
  let suffix = 1
  while (true) {
    const existing = await db
      .select({ id: programs.id })
      .from(programs)
      .where(eq(programs.slug, slug))
    if (existing.length === 0) return slug
    slug = `${base}-${suffix++}`
  }
}

export async function saveProgram(
  _prevState: ProgramFormState,
  formData: FormData
): Promise<ProgramFormState> {
  await requireAdmin()

  const id = formData.get("id") ? Number(formData.get("id")) : null
  const nameEn = String(formData.get("nameEn") ?? "").trim()
  const nameFr = String(formData.get("nameFr") ?? "").trim()
  const ageRangeEn = String(formData.get("ageRangeEn") ?? "").trim()
  const ageRangeFr = String(formData.get("ageRangeFr") ?? "").trim()
  const descriptionEn = String(formData.get("descriptionEn") ?? "").trim()
  const descriptionFr = String(formData.get("descriptionFr") ?? "").trim()
  const overviewEn = String(formData.get("overviewEn") ?? "").trim()
  const overviewFr = String(formData.get("overviewFr") ?? "").trim()
  const icon = String(formData.get("icon") ?? "").trim()
  const isPublished = formData.get("isPublished") === "true"
  const needsTranslationReview =
    formData.get("needsTranslationReview") === "true"
  const position = Number(formData.get("position") ?? 0)
  const highlightsEn = formData
    .getAll("highlightsEn")
    .map((value) => String(value).trim())
    .filter(Boolean)
  const highlightsFr = formData
    .getAll("highlightsFr")
    .map((value) => String(value).trim())
    .filter(Boolean)

  const fieldErrors: ProgramFormState["fieldErrors"] = {}
  if (!nameEn) fieldErrors.nameEn = "Enter an English name."
  if (!nameFr) fieldErrors.nameFr = "Enter a French name."
  if (!ageRangeEn) fieldErrors.ageRangeEn = "Enter an English age range."
  if (!ageRangeFr) fieldErrors.ageRangeFr = "Enter a French age range."
  if (!descriptionEn)
    fieldErrors.descriptionEn = "Enter an English description."
  if (!descriptionFr) fieldErrors.descriptionFr = "Enter a French description."
  if (!overviewEn) fieldErrors.overviewEn = "Enter English overview text."
  if (!overviewFr) fieldErrors.overviewFr = "Enter French overview text."
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
      .from(programs)
      .where(eq(programs.id, id))
    if (!existing) {
      return { status: "error", message: "Program not found." }
    }

    await db
      .update(programs)
      .set({
        icon,
        position,
        isPublished,
        nameEn,
        nameFr,
        ageRangeEn,
        ageRangeFr,
        descriptionEn,
        descriptionFr,
        overviewEn,
        overviewFr,
        highlightsEn,
        highlightsFr,
        needsTranslationReview,
        updatedAt: new Date(),
      })
      .where(eq(programs.id, id))
  } else {
    const slug = await generateUniqueSlug(nameEn)
    await db.insert(programs).values({
      slug,
      icon,
      position,
      isPublished,
      nameEn,
      nameFr,
      ageRangeEn,
      ageRangeFr,
      descriptionEn,
      descriptionFr,
      overviewEn,
      overviewFr,
      highlightsEn,
      highlightsFr,
      needsTranslationReview,
    })
  }

  revalidatePath("/academics")
  revalidatePath("/tvet")
  revalidatePath("/academics/[slug]", "page")
  revalidatePath("/admissions")
  redirect("/admin/programs?toast=program-saved")
}

export async function deleteProgram(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get("id"))
  await db.delete(programs).where(eq(programs.id, id))
  revalidatePath("/admin/programs")
  revalidatePath("/academics")
  revalidatePath("/tvet")
  revalidatePath("/academics/[slug]", "page")
  revalidatePath("/admissions")
  redirect("/admin/programs?toast=program-deleted")
}
