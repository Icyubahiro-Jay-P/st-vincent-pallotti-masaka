import type { Metadata } from "next"
import Link from "@/components/locale-link"
import { notFound } from "next/navigation"
import { ArrowRight, CheckCircle2 } from "lucide-react"

import { Breadcrumb } from "@/components/breadcrumb"
import { PageHero } from "@/components/page-hero"
import { Button } from "@/components/ui/button"
import { iconMap } from "@/components/icon-map"
import { helpCardClasses } from "@/components/programs-grid"
import { programHref } from "@/lib/site-config"
import { getPublishedPrograms } from "@/lib/programs"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { localeAlternates } from "@/lib/i18n/alternates"
import { getLocale } from "@/lib/i18n/get-locale"

export async function generateStaticParams() {
  const allPrograms = await getPublishedPrograms("en")
  return allPrograms
    .filter((program) => program.slug !== "tvet")
    .map((program) => ({ slug: program.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  const allPrograms = await getPublishedPrograms(locale)
  const program = allPrograms.find(
    (item) => item.slug === slug && item.slug !== "tvet"
  )
  if (!program) return {}

  return {
    title: program.name,
    description: program.description,
    alternates: await localeAlternates(`/academics/${slug}`),
  }
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const locale = await getLocale()
  const dict = getDictionary(locale)
  const allPrograms = await getPublishedPrograms(locale)
  const program = allPrograms.find(
    (item) => item.slug === slug && item.slug !== "tvet"
  )

  if (!program) {
    notFound()
  }

  const Icon = iconMap[program.icon]
  const otherPrograms = allPrograms.filter((item) => item.slug !== program.slug)

  return (
    <>
      <PageHero
        eyebrow={dict.academics.hero.eyebrow}
        title={program.name}
        description={program.description}
      />
      <Breadcrumb
        items={[
          { label: dict.nav.home, href: "/" },
          { label: dict.nav.academics, href: "/academics" },
          { label: program.name, href: programHref(program.slug) },
        ]}
      />

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="flex flex-col gap-4 lg:col-span-1">
            <span className="flex size-14 items-center justify-center border border-border bg-accent text-accent-foreground">
              {Icon ? <Icon className="size-7" /> : null}
            </span>
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-teal uppercase">
                {dict.academics.detail.ageRangeLabel}
              </p>
              <p className="mt-1 font-heading text-2xl font-semibold text-foreground">
                {program.ageRange}
              </p>
            </div>
            <Button
              render={
                <Link
                  href={`/admissions?program=${encodeURIComponent(program.slug)}`}
                />
              }
              className="mt-2 h-10 self-start px-5 text-xs"
            >
              {dict.common.applyTo} {program.name}
              <ArrowRight data-icon="inline-end" className="size-3.5" />
            </Button>
          </div>

          <div className="lg:col-span-2">
            <p className="text-sm/relaxed text-muted-foreground">
              {program.overview}
            </p>
            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {program.highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 border border-border bg-card px-4 py-3 text-xs text-foreground"
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:max-w-xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-teal uppercase">
              {dict.academics.detail.exploreMoreEyebrow}
            </p>
            <h2 className="font-heading text-[clamp(1.5rem,1.3rem+1vw,2.25rem)] font-semibold tracking-tight text-foreground">
              {dict.academics.detail.exploreMoreTitle}
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {otherPrograms.map((other) => {
              const OtherIcon = iconMap[other.icon]
              return (
                <Link
                  key={other.slug}
                  href={programHref(other.slug)}
                  className="group flex items-center gap-3 bg-card p-5 transition-colors hover:bg-muted"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center border border-border bg-accent text-accent-foreground">
                    {OtherIcon ? <OtherIcon className="size-4" /> : null}
                  </span>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary">
                    {other.name}
                  </span>
                </Link>
              )
            })}
            {helpCardClasses(otherPrograms.length) ? (
              <Link
                href="/admissions"
                className={`group flex items-center justify-between gap-3 bg-muted p-5 transition-colors hover:bg-accent ${helpCardClasses(otherPrograms.length)}`}
              >
                <span className="text-sm font-medium text-primary group-hover:underline">
                  {dict.common.programsHelp.cta}
                </span>
                <ArrowRight className="size-4 text-primary" />
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
