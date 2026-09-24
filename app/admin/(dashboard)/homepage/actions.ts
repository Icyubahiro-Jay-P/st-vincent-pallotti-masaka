"use server"

import { revalidatePath, updateTag } from "next/cache"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { homepageContent, type HomepageStat } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/require-admin"
import { zodFieldErrors } from "@/lib/validation"
import {
  homepageTextSchema,
  statsError,
} from "@/app/admin/(dashboard)/homepage/schema"

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

// ponytail: hard cap so a tampered/runaway payload can't force an
// oversized jsonb write  20 stats is generous for a homepage strip.
const MAX_STATS = 20

function parseStats(formData: FormData): HomepageStat[] {
  const valueEn = formData.getAll("statValueEn").map((v) => String(v).trim())
  const valueFr = formData.getAll("statValueFr").map((v) => String(v).trim())
  const labelEn = formData.getAll("statLabelEn").map((v) => String(v).trim())
  const labelFr = formData.getAll("statLabelFr").map((v) => String(v).trim())
  const length = Math.min(
    Math.max(valueEn.length, valueFr.length, labelEn.length, labelFr.length),
    MAX_STATS
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

  const statsMessage = statsError(stats)
  if (statsMessage) fieldErrors.stats = statsMessage

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
  revalidatePath("/[locale]", "page")

  return { status: "success", message: "Homepage content saved." }
}
