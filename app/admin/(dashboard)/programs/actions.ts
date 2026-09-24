"use server"

import { revalidatePath, updateTag } from "next/cache"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { programs } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/require-admin"
import { zodFieldErrors } from "@/lib/validation"
import { programSchema } from "@/app/admin/(dashboard)/programs/schema"
import { generateUniqueSlug } from "@/lib/slug"

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

export async function saveProgram(
  _prevState: ProgramFormState,
  formData: FormData
): Promise<ProgramFormState> {
  await requireAdmin()

  const id = formData.get("id") ? Number(formData.get("id")) : null
  const isPublished = formData.get("isPublished") === "true"
  const needsTranslationReview =
    formData.get("needsTranslationReview") === "true"
  // ponytail: hard cap so a tampered/runaway payload can't force a
  // huge jsonb write  30 highlights is generous for one program.
  const MAX_HIGHLIGHTS = 30
  const highlightsEn = formData
    .getAll("highlightsEn")
    .slice(0, MAX_HIGHLIGHTS)
    .map((value) => String(value).trim())
    .filter(Boolean)
  const highlightsFr = formData
    .getAll("highlightsFr")
    .slice(0, MAX_HIGHLIGHTS)
    .map((value) => String(value).trim())
    .filter(Boolean)

  const parsed = programSchema.safeParse({
    nameEn: String(formData.get("nameEn") ?? ""),
    nameFr: String(formData.get("nameFr") ?? ""),
    ageRangeEn: String(formData.get("ageRangeEn") ?? ""),
    ageRangeFr: String(formData.get("ageRangeFr") ?? ""),
    descriptionEn: String(formData.get("descriptionEn") ?? ""),
    descriptionFr: String(formData.get("descriptionFr") ?? ""),
    overviewEn: String(formData.get("overviewEn") ?? ""),
    overviewFr: String(formData.get("overviewFr") ?? ""),
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
    nameEn,
    nameFr,
    ageRangeEn,
    ageRangeFr,
    descriptionEn,
    descriptionFr,
    overviewEn,
    overviewFr,
    icon,
    position,
  } = parsed.data

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
    const slug = await generateUniqueSlug(
      programs,
      programs.slug,
      nameEn,
      "program"
    )
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

  updateTag("programs")
  revalidatePath("/[locale]/academics", "page")
  revalidatePath("/[locale]/tvet", "page")
  revalidatePath("/[locale]/academics/[slug]", "page")
  revalidatePath("/[locale]/admissions", "page")
  redirect("/admin/programs?toast=program-saved")
}

export async function deleteProgram(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get("id"))
  await db.delete(programs).where(eq(programs.id, id))
  revalidatePath("/admin/programs")
  updateTag("programs")
  revalidatePath("/[locale]/academics", "page")
  revalidatePath("/[locale]/tvet", "page")
  revalidatePath("/[locale]/academics/[slug]", "page")
  revalidatePath("/[locale]/admissions", "page")
  redirect("/admin/programs?toast=program-deleted")
}
