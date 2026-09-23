import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { programs } from "@/lib/db/schema"
import en from "@/lib/i18n/dictionaries/en"
import fr from "@/lib/i18n/dictionaries/fr"

// One-off: copies the corrected dictionary text for Cambridge (Grade 1 -
// Grade 8) and O'Level (S1 - S3, stored under the existing
// "national-secondary" slug) onto the live program rows. seed-programs.ts
// skips existing slugs, so it can't apply these edits itself.
const slugs = ["cambridge-primary", "national-secondary"] as const

async function main() {
  for (const slug of slugs) {
    const textEn = en.programs[slug]
    const textFr = fr.programs[slug]

    const updated = await db
      .update(programs)
      .set({
        nameEn: textEn.name,
        nameFr: textFr.name,
        ageRangeEn: textEn.ageRange,
        ageRangeFr: textFr.ageRange,
        descriptionEn: textEn.description,
        descriptionFr: textFr.description,
        overviewEn: textEn.overview,
        overviewFr: textFr.overview,
        highlightsEn: [...textEn.highlights],
        highlightsFr: [...textFr.highlights],
      })
      .where(eq(programs.slug, slug))
      .returning({ id: programs.id })

    console.log(
      `[update-program-levels] "${slug}": ${updated.length} row(s) updated`
    )
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[update-program-levels] failed:", error)
    process.exit(1)
  })
