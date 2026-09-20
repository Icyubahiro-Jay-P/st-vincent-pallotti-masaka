import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { homepageContent } from "@/lib/db/schema"

// Mirrors the homepage hero copy that used to live in
// lib/i18n/dictionaries/{en,fr}.ts's home.hero, inlined here so this
// one-time migration script keeps working after those fields are removed
// from the public site's code path.
const CONTENT_ID = 1

async function main() {
  const existing = await db
    .select({ id: homepageContent.id })
    .from(homepageContent)
    .where(eq(homepageContent.id, CONTENT_ID))

  if (existing.length > 0) {
    console.log("[seed-homepage-content] skipping, row already exists")
    return
  }

  await db.insert(homepageContent).values({
    id: CONTENT_ID,
    eyebrowEn: "Pallottine Missionary Sisters · Masaka, Kigali",
    eyebrowFr: "Sœurs Missionnaires Pallottines · Masaka, Kigali",
    headlineEn: "Strive",
    headlineFr: "Strive",
    headlineEmphasisEn: "Beyond.",
    headlineEmphasisFr: "Beyond.",
    paragraphEn:
      "From Day Care to Secondary and TVET, Saint Vincent Pallotti School Masaka forms confident, capable graduates on a new campus built for over 1,400 students: Cambridge and National curricula, Special Needs Education, and hands-on vocational training, all rooted in Catholic values.",
    paragraphFr:
      "De la garderie au secondaire et à la formation professionnelle (TVET), Saint Vincent Pallotti School Masaka forme des diplômés confiants et compétents sur un nouveau campus conçu pour plus de 1 400 élèves : programmes Cambridge et national, éducation spécialisée et formation professionnelle pratique, le tout enraciné dans les valeurs catholiques.",
    calloutValueEn: "1,200+",
    calloutValueFr: "1 200+",
    calloutTextEn:
      "seats added when our new campus opened, blessed by Cardinal Antoine Kambanda",
    calloutTextFr:
      "places ajoutées à l'ouverture de notre nouveau campus, béni par le cardinal Antoine Kambanda",
    panelEstablishedEn: "Est. by the Pallottine Sisters",
    panelEstablishedFr: "Fondée par les Sœurs Pallottines",
    stats: [
      {
        valueEn: "1,400+",
        valueFr: "1 400+",
        labelEn: "Students",
        labelFr: "Élèves",
      },
      {
        valueEn: "2022",
        valueFr: "2022",
        labelEn: "New Campus",
        labelFr: "Nouveau campus",
      },
      {
        valueEn: "2",
        valueFr: "2",
        labelEn: "Curricula",
        labelFr: "Programmes",
      },
      {
        valueEn: "5",
        valueFr: "5",
        labelEn: "TVET Trades",
        labelFr: "Filières TVET",
      },
    ],
  })

  console.log("[seed-homepage-content] created homepage content row")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("[seed-homepage-content] failed:", error)
    process.exit(1)
  })
