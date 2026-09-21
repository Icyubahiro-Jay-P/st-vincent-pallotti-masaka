import { desc, eq } from "drizzle-orm"

import { Hero } from "@/components/home/hero"
import { ProgramsGrid } from "@/components/programs-grid"
import { Pathway } from "@/components/home/pathway"
import { WhyPallotti } from "@/components/home/why-pallotti"
import { NewsTeaser } from "@/components/home/news-teaser"
import { CtaBand } from "@/components/home/cta-band"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"
import { getPublishedPrograms } from "@/lib/programs"
import { getSiteSettings } from "@/lib/site-settings"
import { getHomepageContent } from "@/lib/homepage-content"
import { db } from "@/lib/db"
import { events } from "@/lib/db/schema"

export default async function Page() {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  const [latestEvents, publishedPrograms, settings, homepageContent] =
    await Promise.all([
      db
        .select()
        .from(events)
        .where(eq(events.status, "published"))
        .orderBy(desc(events.publishedAt))
        .limit(3),
      getPublishedPrograms(locale),
      getSiteSettings(),
      getHomepageContent(locale),
    ])

  return (
    <>
      <Hero dict={dict} content={homepageContent} />
      <ProgramsGrid
        eyebrow={dict.home.programs.eyebrow}
        title={dict.home.programs.title}
        description={dict.home.programs.description}
        items={publishedPrograms}
      />
      <Pathway dict={dict} />
      <WhyPallotti dict={dict} />
      <NewsTeaser
        dict={dict}
        locale={locale}
        events={latestEvents}
        instagramUrl={settings.instagramUrl}
        youtubeUrl={settings.youtubeUrl}
        xUrl={settings.xUrl}
      />
      <CtaBand dict={dict} whatsappNumber={settings.whatsappNumber} />
    </>
  )
}
