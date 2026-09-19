import { desc, eq } from "drizzle-orm"

import { Hero } from "@/components/home/hero"
import { ProgramsGrid } from "@/components/programs-grid"
import { Pathway } from "@/components/home/pathway"
import { WhyPallotti } from "@/components/home/why-pallotti"
import { NewsTeaser } from "@/components/home/news-teaser"
import { CtaBand } from "@/components/home/cta-band"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"
import { db } from "@/lib/db"
import { events } from "@/lib/db/schema"

export default async function Page() {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  const latestEvents = await db
    .select()
    .from(events)
    .where(eq(events.status, "published"))
    .orderBy(desc(events.publishedAt))
    .limit(3)

  return (
    <>
      <Hero dict={dict} />
      <ProgramsGrid
        dict={dict}
        eyebrow={dict.home.programs.eyebrow}
        title={dict.home.programs.title}
        description={dict.home.programs.description}
      />
      <Pathway dict={dict} />
      <WhyPallotti dict={dict} />
      <NewsTeaser dict={dict} locale={locale} events={latestEvents} />
      <CtaBand dict={dict} />
    </>
  )
}
