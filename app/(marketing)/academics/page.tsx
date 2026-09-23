import type { Metadata } from "next"
import Link from "next/link"
import {
  Globe2,
  BookOpen,
  Calculator,
  Microscope,
  Languages,
  Palette,
  Trophy,
  ArrowRight,
  HeartHandshake,
} from "lucide-react"

import { PageHero } from "@/components/page-hero"
import { ProgramsGrid } from "@/components/programs-grid"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { JsonLd } from "@/components/json-ld"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"
import { getPublishedPrograms } from "@/lib/programs"
import { siteConfig } from "@/lib/site-config"

const curriculumIcons = [Globe2, BookOpen] as const
const subjectIcons = [Calculator, Languages, Microscope, Palette] as const

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  return {
    title: dict.meta.academics.title,
    description: dict.meta.academics.description,
    alternates: { canonical: `${siteConfig.url}/academics` },
    openGraph: {
      title: dict.meta.academics.title,
      description: dict.meta.academics.description,
      url: `${siteConfig.url}/academics`,
    },
  }
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
    {
      "@type": "ListItem",
      position: 2,
      name: "Academics",
      item: `${siteConfig.url}/academics`,
    },
  ],
}

export default async function AcademicsPage() {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  const ac = dict.academics
  const publishedPrograms = await getPublishedPrograms(locale)

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <PageHero
        eyebrow={ac.hero.eyebrow}
        title={ac.hero.title}
        description={ac.hero.description}
      />

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {ac.curricula.map((track, index) => {
              const Icon = curriculumIcons[index]
              return (
                <div
                  key={track.slug}
                  className="flex flex-col gap-5 border border-border bg-card p-8"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="size-9 text-primary" />
                    <Badge variant="secondary" className="uppercase">
                      {track.tagline}
                    </Badge>
                  </div>
                  <div>
                    <h2 className="font-heading text-2xl font-semibold text-foreground">
                      {track.name}
                    </h2>
                    <p className="mt-1 text-[0.7rem] font-medium tracking-wide text-teal uppercase">
                      {track.range}
                    </p>
                  </div>
                  <p className="text-sm/relaxed text-muted-foreground">
                    {track.description}
                  </p>
                  <div className="flex flex-wrap gap-2 border-t border-border pt-5">
                    {track.subjects.map((subject) => (
                      <span
                        key={subject}
                        className="border border-border px-2.5 py-1 text-[0.7rem] text-muted-foreground"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/academics/${track.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-primary uppercase hover:underline"
                  >
                    {dict.common.viewFullProgramPage}
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              )
            })}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden border border-border bg-border sm:grid-cols-4">
            {ac.subjectHighlights.map((label, index) => {
              const Icon = subjectIcons[index]
              return (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 bg-card px-4 py-6 text-center"
                >
                  <Icon className="size-5 text-teal" />
                  <p className="text-[0.7rem] font-medium text-foreground">
                    {label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-ink py-16 text-ink-foreground sm:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="lg:col-span-1">
            <HeartHandshake className="size-10 text-gold" />
            <h2 className="mt-4 font-heading text-2xl font-semibold sm:text-3xl">
              {ac.specialNeeds.title}
            </h2>
          </div>
          <div className="lg:col-span-2">
            <p className="text-sm/relaxed text-ink-foreground/80">
              {ac.specialNeeds.paragraph}
            </p>
            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {ac.specialNeeds.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-xs text-ink-foreground/85"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/academics/special-needs"
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-gold uppercase hover:underline"
            >
              {dict.common.viewFullProgramPage}
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <ProgramsGrid
        eyebrow={ac.allPrograms.eyebrow}
        title={ac.allPrograms.title}
        description={ac.allPrograms.description}
        items={publishedPrograms}
      />

      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-start gap-4">
            <Trophy className="size-8 shrink-0 text-primary" />
            <p className="max-w-lg text-sm/relaxed text-muted-foreground">
              {ac.closing.paragraph}
            </p>
          </div>
          <Button
            size="lg"
            render={<Link href="/admissions" />}
            className="h-11 shrink-0 px-6 text-sm"
          >
            {ac.closing.cta}
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </section>
    </>
  )
}
