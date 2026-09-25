import { Suspense } from "react"
import type { Metadata } from "next"

import { Hero } from "@/components/home/hero"
import { ProgramsGrid } from "@/components/programs-grid"
import { Pathway } from "@/components/home/pathway"
import { WhyPallotti } from "@/components/home/why-pallotti"
import { NewsTeaser } from "@/components/home/news-teaser"
import { CtaBand } from "@/components/home/cta-band"
import { getDictionary, type Dictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"
import type { Locale } from "@/lib/i18n/config"
import { getPublishedPrograms } from "@/lib/programs"
import { getSiteSettings } from "@/lib/site-settings"
import { getHomepageContent } from "@/lib/homepage-content"
import { getLatestPublishedEvents } from "@/lib/events"
import { localeAlternates, localeUrl } from "@/lib/i18n/alternates"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  return {
    title: dict.meta.home.title,
    description: dict.meta.home.description,
    alternates: await localeAlternates("/"),
    openGraph: {
      title: dict.meta.home.title,
      description: dict.meta.home.ogDescription,
      url: await localeUrl("/"),
    },
  }
}

// Split out so Suspense can actually suspend on its own query instead of
// blocking the whole page behind the slowest of four unrelated fetches.
async function ProgramsGridSection({
  locale,
  dict,
}: {
  locale: Locale
  dict: Dictionary
}) {
  const publishedPrograms = await getPublishedPrograms(locale)
  return (
    <ProgramsGrid
      eyebrow={dict.home.programs.eyebrow}
      title={dict.home.programs.title}
      description={dict.home.programs.description}
      items={publishedPrograms}
      help={dict.common.programsHelp}
    />
  )
}

async function NewsTeaserSection({
  dict,
  locale,
  instagramUrl,
  youtubeUrl,
  xUrl,
}: {
  dict: Dictionary
  locale: Locale
  instagramUrl: string
  youtubeUrl: string
  xUrl: string | null
}) {
  const latestEvents = await getLatestPublishedEvents(3)

  return (
    <NewsTeaser
      dict={dict}
      locale={locale}
      events={latestEvents}
      instagramUrl={instagramUrl}
      youtubeUrl={youtubeUrl}
      xUrl={xUrl}
    />
  )
}

function ProgramsGridSkeleton() {
  return (
    <section className="border-b border-border bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-64 animate-pulse rounded-none bg-muted" />
      </div>
    </section>
  )
}

function NewsTeaserSkeleton() {
  return (
    <section className="border-t border-border bg-muted/40 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-64 animate-pulse rounded-none bg-muted" />
      </div>
    </section>
  )
}

export default async function Page() {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  const [settings, homepageContent] = await Promise.all([
    getSiteSettings(),
    getHomepageContent(locale),
  ])

  return (
    <>
      <Hero dict={dict} content={homepageContent} />
      <Suspense fallback={<ProgramsGridSkeleton />}>
        <ProgramsGridSection locale={locale} dict={dict} />
      </Suspense>
      <Pathway dict={dict} />
      <WhyPallotti dict={dict} whatsappNumber={settings.whatsappNumber} />
      <Suspense fallback={<NewsTeaserSkeleton />}>
        <NewsTeaserSection
          dict={dict}
          locale={locale}
          instagramUrl={settings.instagramUrl}
          youtubeUrl={settings.youtubeUrl}
          xUrl={settings.xUrl}
        />
      </Suspense>
      <CtaBand dict={dict} whatsappNumber={settings.whatsappNumber} />
    </>
  )
}
