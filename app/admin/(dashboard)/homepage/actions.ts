"use server"

import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { homepageContent, type HomepageStat } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/require-admin"

const CONTENT_ID = 1

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

  const eyebrowEn = String(formData.get("eyebrowEn") ?? "").trim()
  const eyebrowFr = String(formData.get("eyebrowFr") ?? "").trim()
  const headlineEn = String(formData.get("headlineEn") ?? "").trim()
  const headlineFr = String(formData.get("headlineFr") ?? "").trim()
  const headlineEmphasisEn = String(
    formData.get("headlineEmphasisEn") ?? ""
  ).trim()
  const headlineEmphasisFr = String(
    formData.get("headlineEmphasisFr") ?? ""
  ).trim()
  const paragraphEn = String(formData.get("paragraphEn") ?? "").trim()
  const paragraphFr = String(formData.get("paragraphFr") ?? "").trim()
  const calloutValueEn = String(formData.get("calloutValueEn") ?? "").trim()
  const calloutValueFr = String(formData.get("calloutValueFr") ?? "").trim()
  const calloutTextEn = String(formData.get("calloutTextEn") ?? "").trim()
  const calloutTextFr = String(formData.get("calloutTextFr") ?? "").trim()
  const panelEstablishedEn = String(
    formData.get("panelEstablishedEn") ?? ""
  ).trim()
  const panelEstablishedFr = String(
    formData.get("panelEstablishedFr") ?? ""
  ).trim()
  const stats = parseStats(formData)

  const fieldErrors: HomepageContentFormState["fieldErrors"] = {}
  if (!eyebrowEn) fieldErrors.eyebrowEn = "Enter an English eyebrow."
  if (!eyebrowFr) fieldErrors.eyebrowFr = "Enter a French eyebrow."
  if (!headlineEn) fieldErrors.headlineEn = "Enter an English headline."
  if (!headlineFr) fieldErrors.headlineFr = "Enter a French headline."
  if (!headlineEmphasisEn)
    fieldErrors.headlineEmphasisEn = "Enter an English headline emphasis."
  if (!headlineEmphasisFr)
    fieldErrors.headlineEmphasisFr = "Enter a French headline emphasis."
  if (!paragraphEn) fieldErrors.paragraphEn = "Enter English paragraph text."
  if (!paragraphFr) fieldErrors.paragraphFr = "Enter French paragraph text."
  if (!calloutValueEn)
    fieldErrors.calloutValueEn = "Enter an English callout value."
  if (!calloutValueFr)
    fieldErrors.calloutValueFr = "Enter a French callout value."
  if (!calloutTextEn) fieldErrors.calloutTextEn = "Enter English callout text."
  if (!calloutTextFr) fieldErrors.calloutTextFr = "Enter French callout text."
  if (!panelEstablishedEn)
    fieldErrors.panelEstablishedEn = "Enter English panel text."
  if (!panelEstablishedFr)
    fieldErrors.panelEstablishedFr = "Enter French panel text."
  if (stats.length === 0) fieldErrors.stats = "Add at least one stat."
  else if (
    stats.some((s) => !s.valueEn || !s.valueFr || !s.labelEn || !s.labelFr)
  )
    fieldErrors.stats = "Fill in every field for each stat row."

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please fix the fields below.",
      fieldErrors,
    }
  }

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

  revalidatePath("/")

  return { status: "success", message: "Homepage content saved." }
}
