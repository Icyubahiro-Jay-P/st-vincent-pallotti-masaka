import { and, eq, gte, ne, sql } from "drizzle-orm"

import { db } from "@/lib/db"
import { programs } from "@/lib/db/schema"
import en from "@/lib/i18n/dictionaries/en"
import fr from "@/lib/i18n/dictionaries/fr"

// One-off: switches program ranges from ages to class ranges and splits
// National Nursery (N1 - N3) out of "national-primary" (now P1 - P6).
// seed-programs.ts skips existing slugs, so it can't apply these edits
// itself. Safe to re-run: updates are idempotent and the insert is skipped
// once "national-nursery" exists.
const slugs = [
  "kindergarten",
  "special-needs",
  "cambridge-primary",
  "national-primary",
  "national-secondary",
] as const

function textFor(slug: keyof typeof en.programs) {
  const textEn = en.programs[slug]
  const textFr = fr.programs[slug]
  return {
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
  }
}

async function main() {
  for (const slug of slugs) {
    const updated = await db
      .update(programs)
      .set(textFor(slug))
      .where(eq(programs.slug, slug))
      .returning({ id: programs.id })

    console.log(
      `[update-program-levels] "${slug}": ${updated.length} row(s) updated`
    )
  }

  const [nursery] = await db
    .select({ id: programs.id })
    .from(programs)
    .where(eq(programs.slug, "national-nursery"))
  if (nursery) {
    console.log(`[update-program-levels] "national-nursery" already exists`)
    return
  }

  // Slot the new row in just before National Primary, shifting the rest.
  const [primary] = await db
    .select({ position: programs.position })
    .from(programs)
    .where(eq(programs.slug, "national-primary"))
  const position = primary?.position ?? 0

  // neon-http has no interactive transactions; batch() runs both atomically.
  await db.batch([
    db
      .update(programs)
      .set({ position: sql`${programs.position} + 1` })
      .where(
        and(
          gte(programs.position, position),
          ne(programs.slug, "national-nursery")
        )
      ),
    db.insert(programs).values({
      slug: "national-nursery",
      icon: "Sprout",
      position,
      ...textFor("national-nursery"),
    }),
  ])

  console.log(
    `[update-program-levels] "national-nursery": inserted at position ${position}`
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[update-program-levels] failed:", error)
    process.exit(1)
  })
