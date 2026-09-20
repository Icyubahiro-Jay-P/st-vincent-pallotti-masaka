import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { programs } from "@/lib/db/schema"
import en from "@/lib/i18n/dictionaries/en"
import fr from "@/lib/i18n/dictionaries/fr"

// Mirrors the structural program list that used to live in
// lib/site-config.ts's `programs` export (slug + icon), inlined here so
// this one-time migration script keeps working after that export is
// removed from the public site's code path.
const structuralPrograms = [
  { slug: "day-care", icon: "Baby" },
  { slug: "kindergarten", icon: "Blocks" },
  { slug: "special-needs", icon: "HeartHandshake" },
  { slug: "cambridge-primary", icon: "Globe2" },
  { slug: "national-primary", icon: "BookOpen" },
  { slug: "national-secondary", icon: "GraduationCap" },
  { slug: "tvet", icon: "Hammer" },
] as const

async function main() {
  for (const [index, { slug, icon }] of structuralPrograms.entries()) {
    const existing = await db
      .select({ id: programs.id })
      .from(programs)
      .where(eq(programs.slug, slug))

    if (existing.length > 0) {
      console.log(`[seed-programs] skipping existing program "${slug}"`)
      continue
    }

    const textEn = en.programs[slug]
    const textFr = fr.programs[slug]

    await db.insert(programs).values({
      slug,
      icon,
      position: index,
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

    console.log(`[seed-programs] created program "${slug}"`)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[seed-programs] failed:", error)
    process.exit(1)
  })
