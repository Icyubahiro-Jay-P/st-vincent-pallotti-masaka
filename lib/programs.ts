import { cache } from "react"
import { and, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { programs } from "@/lib/db/schema"
import type { Locale } from "@/lib/i18n/config"

export type ResolvedProgram = {
  slug: string
  icon: string
  name: string
  ageRange: string
  description: string
  overview: string
  highlights: string[]
}

function resolveProgram(
  row: typeof programs.$inferSelect,
  locale: Locale
): ResolvedProgram {
  return {
    slug: row.slug,
    icon: row.icon,
    name: locale === "en" ? row.nameEn : row.nameFr,
    ageRange: locale === "en" ? row.ageRangeEn : row.ageRangeFr,
    description: locale === "en" ? row.descriptionEn : row.descriptionFr,
    overview: locale === "en" ? row.overviewEn : row.overviewFr,
    highlights: locale === "en" ? row.highlightsEn : row.highlightsFr,
  }
}

// cache() dedupes repeat calls with the same args within a single request,
// so generateStaticParams/generateMetadata/the page component sharing this
// function only hit the DB once per render instead of three times.
export const getPublishedPrograms = cache(
  async (locale: Locale): Promise<ResolvedProgram[]> => {
    const rows = await db
      .select()
      .from(programs)
      .where(eq(programs.isPublished, true))
      .orderBy(programs.position)

    return rows.map((row) => resolveProgram(row, locale))
  }
)

export async function getProgramBySlug(
  slug: string,
  locale: Locale
): Promise<ResolvedProgram | undefined> {
  const [row] = await db
    .select()
    .from(programs)
    .where(and(eq(programs.slug, slug), eq(programs.isPublished, true)))
    .limit(1)

  return row ? resolveProgram(row, locale) : undefined
}
