import { unstable_cache } from "next/cache"
import { asc, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { values } from "@/lib/db/schema"
import type { Locale } from "@/lib/i18n/config"

// Called once per request (about/page.tsx), so no React cache() wrapper is
// needed here - unstable_cache alone covers the real win, which is not
// re-querying the DB on every request.
export const getPublishedValues = unstable_cache(
  async (locale: Locale) => {
    const rows = await db
      .select()
      .from(values)
      .where(eq(values.isPublished, true))
      .orderBy(asc(values.position))

    return rows.map((row) => ({
      icon: row.icon,
      title: locale === "en" ? row.titleEn : row.titleFr,
      description: locale === "en" ? row.descriptionEn : row.descriptionFr,
    }))
  },
  ["published-values"],
  { revalidate: 3600, tags: ["values"] }
)
