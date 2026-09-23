import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { values } from "@/lib/db/schema"

// One-time migration: inlines the exact "What We Stand For" value cards that
// used to live hardcoded in lib/i18n/dictionaries/{en,fr}.ts's
// about.values.items (now removed from those files) plus the icons that
// used to live in app/(marketing)/about/page.tsx's valueIcons array (same
// order), so this script keeps working after both of those were deleted.
const structuralValues = [
  {
    icon: "Church",
    titleEn: "Faith",
    titleFr: "Foi",
    descriptionEn:
      "Catholic identity and the Pallottine charism shape daily life on campus, present but never overwhelming for families of all backgrounds.",
    descriptionFr:
      "L'identité catholique et le charisme pallottin façonnent la vie quotidienne du campus, présents sans jamais s'imposer aux familles de tous horizons.",
  },
  {
    icon: "Sparkles",
    titleEn: "Excellence",
    titleFr: "Excellence",
    descriptionEn:
      "High expectations across Cambridge and National curricula, backed by disciplined teaching and consistent assessment.",
    descriptionFr:
      "Des exigences élevées dans les programmes Cambridge et national, soutenues par un enseignement rigoureux et une évaluation constante.",
  },
  {
    icon: "HeartHandshake",
    titleEn: "Inclusion",
    titleFr: "Inclusion",
    descriptionEn:
      "Dedicated Special Needs Education ensures every learner, whatever their starting point, has a place to belong and grow.",
    descriptionFr:
      "Notre programme dédié d'éducation spécialisée garantit à chaque élève, quel que soit son point de départ, une place pour s'épanouir et grandir.",
  },
  {
    icon: "Compass",
    titleEn: "Opportunity",
    titleFr: "Opportunité",
    descriptionEn:
      "From TVET trades to O'Level Secondary, every graduate leaves with a real path forward.",
    descriptionFr:
      "Des filières TVET au tronc commun (O'Level), chaque diplômé repart avec un véritable chemin d'avenir.",
  },
] as const

async function main() {
  for (const [index, item] of structuralValues.entries()) {
    const existing = await db
      .select({ id: values.id })
      .from(values)
      .where(eq(values.titleEn, item.titleEn))

    if (existing.length > 0) {
      console.log(`[seed-values] skipping existing value "${item.titleEn}"`)
      continue
    }

    await db.insert(values).values({
      icon: item.icon,
      position: index,
      titleEn: item.titleEn,
      titleFr: item.titleFr,
      descriptionEn: item.descriptionEn,
      descriptionFr: item.descriptionFr,
    })

    console.log(`[seed-values] created value "${item.titleEn}"`)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[seed-values] failed:", error)
    process.exit(1)
  })
