import { unstable_cache } from "next/cache"
import { asc, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { milestones } from "@/lib/db/schema"
import type { Locale } from "@/lib/i18n/config"

// Called once per request (about/page.tsx), so no React cache() wrapper is
// needed here - unstable_cache alone covers the real win, which is not
// re-querying the DB on every request.
export const getPublishedMilestones = unstable_cache(
  async (locale: Locale) => {
    const rows = await db
      .select()
      .from(milestones)
      .where(eq(milestones.isPublished, true))
      .orderBy(asc(milestones.position))

    return rows.map((row) => ({
      icon: row.icon,
      year: locale === "en" ? row.yearEn : row.yearFr,
      title: locale === "en" ? row.titleEn : row.titleFr,
      description: locale === "en" ? row.descriptionEn : row.descriptionFr,
    }))
  },
  ["published-milestones"],
  { revalidate: 3600, tags: ["milestones"] }
)
