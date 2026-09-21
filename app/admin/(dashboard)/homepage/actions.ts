"use server"

import { revalidatePath, updateTag } from "next/cache"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/lib/db"
import { homepageContent, type HomepageStat } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/require-admin"
import { nonEmptyString, zodFieldErrors } from "@/lib/validation"

const CONTENT_ID = 1

const homepageTextSchema = z.object({
  eyebrowEn: nonEmptyString(200, "an English eyebrow"),
  eyebrowFr: nonEmptyString(200, "a French eyebrow"),
  headlineEn: nonEmptyString(200, "an English headline"),
  headlineFr: nonEmptyString(200, "a French headline"),
  headlineEmphasisEn: nonEmptyString(200, "an English headline emphasis"),
  headlineEmphasisFr: nonEmptyString(200, "a French headline emphasis"),
  paragraphEn: nonEmptyString(2000, "English paragraph text"),
  paragraphFr: nonEmptyString(2000, "French paragraph text"),
  calloutValueEn: nonEmptyString(200, "an English callout value"),
  calloutValueFr: nonEmptyString(200, "a French callout value"),
  calloutTextEn: nonEmptyString(200, "English callout text"),
  calloutTextFr: nonEmptyString(200, "French callout text"),
  panelEstablishedEn: nonEmptyString(200, "English panel text"),
  panelEstablishedFr: nonEmptyString(200, "French panel text"),
})

const statSchema = z.object({
  valueEn: nonEmptyString(50, "a value"),
  valueFr: nonEmptyString(50, "a value"),
  labelEn: nonEmptyString(50, "a label"),
  labelFr: nonEmptyString(50, "a label"),
})

export type HomepageContentFormState = {
  status: "idle" | "error" | "success"
  message?: string
  fieldErrors?: Partial<
    Record<
      | "eyebrowEn"
      | "eyebrowFr"
      | "headlineEn"
      | "headlineFr"
      | "headlineEmphasisEn"
      | "headlineEmphasisFr"
      | "paragraphEn"
      | "paragraphFr"
      | "calloutValueEn"
      | "calloutValueFr"
      | "calloutTextEn"
      | "calloutTextFr"
      | "panelEstablishedEn"
      | "panelEstablishedFr"
      | "stats",
      string
    >
  >
}

function parseStats(formData: FormData): HomepageStat[] {
  const valueEn = formData.getAll("statValueEn").map((v) => String(v).trim())
  const valueFr = formData.getAll("statValueFr").map((v) => String(v).trim())
  const labelEn = formData.getAll("statLabelEn").map((v) => String(v).trim())
  const labelFr = formData.getAll("statLabelFr").map((v) => String(v).trim())
  const length = Math.max(
    valueEn.length,
    valueFr.length,
    labelEn.length,
    labelFr.length
  )

  const stats: HomepageStat[] = []
  for (let i = 0; i < length; i++) {
    const row = {
      valueEn: valueEn[i] ?? "",
      valueFr: valueFr[i] ?? "",
      labelEn: labelEn[i] ?? "",
      labelFr: labelFr[i] ?? "",
    }
    if (row.valueEn || row.valueFr || row.labelEn || row.labelFr) {
      stats.push(row)
    }
  }
  return stats
}

export async function updateHomepageContent(
  _prevState: HomepageContentFormState,
  formData: FormData
): Promise<HomepageContentFormState> {
  await requireAdmin()

  const stats = parseStats(formData)

  const parsed = homepageTextSchema.safeParse({
    eyebrowEn: String(formData.get("eyebrowEn") ?? ""),
    eyebrowFr: String(formData.get("eyebrowFr") ?? ""),
    headlineEn: String(formData.get("headlineEn") ?? ""),
    headlineFr: String(formData.get("headlineFr") ?? ""),
    headlineEmphasisEn: String(formData.get("headlineEmphasisEn") ?? ""),
    headlineEmphasisFr: String(formData.get("headlineEmphasisFr") ?? ""),
    paragraphEn: String(formData.get("paragraphEn") ?? ""),
    paragraphFr: String(formData.get("paragraphFr") ?? ""),
    calloutValueEn: String(formData.get("calloutValueEn") ?? ""),
    calloutValueFr: String(formData.get("calloutValueFr") ?? ""),
    calloutTextEn: String(formData.get("calloutTextEn") ?? ""),
    calloutTextFr: String(formData.get("calloutTextFr") ?? ""),
    panelEstablishedEn: String(formData.get("panelEstablishedEn") ?? ""),
    panelEstablishedFr: String(formData.get("panelEstablishedFr") ?? ""),
  })

  const fieldErrors: HomepageContentFormState["fieldErrors"] = parsed.success
    ? {}
    : zodFieldErrors(parsed.error)

  if (stats.length === 0) {
    fieldErrors.stats = "Add at least one stat."
  } else if (!stats.every((s) => statSchema.safeParse(s).success)) {
    fieldErrors.stats = "Fill in every field for each stat row."
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please fix the fields below.",
      fieldErrors,
    }
  }

  const {
    eyebrowEn,
    eyebrowFr,
    headlineEn,
    headlineFr,
    headlineEmphasisEn,
    headlineEmphasisFr,
    paragraphEn,
    paragraphFr,
    calloutValueEn,
    calloutValueFr,
    calloutTextEn,
    calloutTextFr,
    panelEstablishedEn,
    panelEstablishedFr,
  } = parsed.data!

  await db
    .update(homepageContent)
    .set({
      eyebrowEn,
      eyebrowFr,
      headlineEn,
      headlineFr,
      headlineEmphasisEn,
      headlineEmphasisFr,
      paragraphEn,
      paragraphFr,
      calloutValueEn,
      calloutValueFr,
      calloutTextEn,
      calloutTextFr,
      panelEstablishedEn,
      panelEstablishedFr,
      stats,
      updatedAt: new Date(),
    })
    .where(eq(homepageContent.id, CONTENT_ID))

  updateTag("homepage-content")
  revalidatePath("/")

  return { status: "success", message: "Homepage content saved." }
}
