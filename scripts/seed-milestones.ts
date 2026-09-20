import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { milestones } from "@/lib/db/schema"

// One-time migration: inlines the exact milestone timeline that used to
// live hardcoded in lib/i18n/dictionaries/{en,fr}.ts's about.milestones.items
// (now removed from those files) plus the icons that used to live in
// app/(marketing)/about/page.tsx's milestoneIcons array (same order), so
// this script keeps working after both of those were deleted.
const structuralMilestones = [
  {
    icon: "Sprout",
    yearEn: "Founding",
    yearFr: "Fondation",
    titleEn: "A Mission Begins",
    titleFr: "Une mission commence",
    descriptionEn:
      "The Pallottine Missionary Sisters of Our Lady of Kibeho Region establish a school in Masaka, Kigali, rooted in the charism of St. Vincent Pallotti.",
    descriptionFr:
      "Les Sœurs Missionnaires Pallottines de la Région Notre-Dame de Kibeho fondent une école à Masaka, Kigali, enracinée dans le charisme de saint Vincent Pallotti.",
  },
  {
    icon: "TrendingUp",
    yearEn: "Growth",
    yearFr: "Croissance",
    titleEn: "Expanding Programs",
    titleFr: "Extension des programmes",
    descriptionEn:
      "Day Care, Kindergarten, National Nursery, Primary and Secondary, and Special Needs Education grow alongside the surrounding community.",
    descriptionFr:
      "La garderie, la maternelle, le primaire et le secondaire nationaux, ainsi que l'éducation spécialisée, se développent avec la communauté environnante.",
  },
  {
    icon: "Building2",
    yearEn: "2022",
    yearFr: "2022",
    titleEn: "New Campus Inaugurated",
    titleFr: "Inauguration du nouveau campus",
    descriptionEn:
      "A major campus expansion is officially inaugurated by Cardinal Antoine Kambanda together with the Ministry of Education, adding capacity for 1,200+ students.",
    descriptionFr:
      "Une importante extension du campus est officiellement inaugurée par le cardinal Antoine Kambanda et le ministère de l'Éducation, portant la capacité à plus de 1 200 élèves supplémentaires.",
  },
  {
    icon: "Rocket",
    yearEn: "Today",
    yearFr: "Aujourd'hui",
    titleEn: "Striving Beyond",
    titleFr: "Toujours plus loin",
    descriptionEn:
      "Over 1,400 students now study across Cambridge, National and TVET pathways on one growing campus.",
    descriptionFr:
      "Plus de 1 400 élèves étudient désormais dans les filières Cambridge, nationale et TVET sur un campus en pleine croissance.",
  },
] as const

async function main() {
  for (const [index, item] of structuralMilestones.entries()) {
    const existing = await db
      .select({ id: milestones.id })
      .from(milestones)
      .where(eq(milestones.titleEn, item.titleEn))

    if (existing.length > 0) {
      console.log(
        `[seed-milestones] skipping existing milestone "${item.titleEn}"`
      )
      continue
    }

    await db.insert(milestones).values({
      icon: item.icon,
      position: index,
      yearEn: item.yearEn,
      yearFr: item.yearFr,
      titleEn: item.titleEn,
      titleFr: item.titleFr,
      descriptionEn: item.descriptionEn,
      descriptionFr: item.descriptionFr,
    })

    console.log(`[seed-milestones] created milestone "${item.titleEn}"`)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[seed-milestones] failed:", error)
    process.exit(1)
  })
