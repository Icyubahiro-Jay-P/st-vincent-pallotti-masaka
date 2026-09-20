import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { homepageContent } from "@/lib/db/schema"
import type { Locale } from "@/lib/i18n/config"

const CONTENT_ID = 1

export type ResolvedHomepageContent = {
  eyebrow: string
  headline: string
  headlineEmphasis: string
  paragraph: string
  calloutValue: string
  calloutText: string
  panelEstablished: string
  stats: { value: string; label: string }[]
}

function resolve(
  row: typeof homepageContent.$inferSelect,
  locale: Locale
): ResolvedHomepageContent {
  const isEn = locale === "en"
  return {
    eyebrow: isEn ? row.eyebrowEn : row.eyebrowFr,
    headline: isEn ? row.headlineEn : row.headlineFr,
    headlineEmphasis: isEn ? row.headlineEmphasisEn : row.headlineEmphasisFr,
    paragraph: isEn ? row.paragraphEn : row.paragraphFr,
    calloutValue: isEn ? row.calloutValueEn : row.calloutValueFr,
    calloutText: isEn ? row.calloutTextEn : row.calloutTextFr,
    panelEstablished: isEn ? row.panelEstablishedEn : row.panelEstablishedFr,
    stats: row.stats.map((stat) => ({
      value: isEn ? stat.valueEn : stat.valueFr,
      label: isEn ? stat.labelEn : stat.labelFr,
    })),
  }
}

export async function getHomepageContent(
  locale: Locale
): Promise<ResolvedHomepageContent> {
  const [row] = await db
    .select()
    .from(homepageContent)
    .where(eq(homepageContent.id, CONTENT_ID))

  if (!row) {
    throw new Error(
      "homepage_content row is missing; run `npm run seed:homepage-content`"
    )
  }

  return resolve(row, locale)
}
