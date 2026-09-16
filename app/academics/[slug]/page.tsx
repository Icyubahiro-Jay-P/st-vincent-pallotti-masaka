import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, CheckCircle2 } from "lucide-react"

import { PageHero } from "@/components/page-hero"
import { Button } from "@/components/ui/button"
import { iconMap } from "@/components/icon-map"
import { programs, programHref, type ProgramSlug } from "@/lib/site-config"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"

const detailPrograms = programs.filter((program) => program.slug !== "tvet")

export function generateStaticParams() {
  return detailPrograms.map((program) => ({ slug: program.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const program = detailPrograms.find((item) => item.slug === slug)
  if (!program) return {}

  const locale = await getLocale()
  const dict = getDictionary(locale)
  const text = dict.programs[program.slug]
  return { title: text.name, description: text.description }
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const program = detailPrograms.find((item) => item.slug === slug)

  if (!program) {
    notFound()
  }

  const locale = await getLocale()
  const dict = getDictionary(locale)
  const text = dict.programs[program.slug]
  const Icon = iconMap[program.icon]
  const otherPrograms = programs.filter((item) => item.slug !== program.slug)

  return (
    <>
      <PageHero
        eyebrow={dict.academics.hero.eyebrow}
        title={text.name}
        description={text.description}
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
                {text.ageRange}
              </p>
            </div>
            <Button
              render={
                <Link href={`/admissions?program=${encodeURIComponent(text.name)}`} />
              }
              className="mt-2 h-10 self-start px-5 text-xs"
            >
              {dict.common.applyTo} {text.name}
              <ArrowRight data-icon="inline-end" className="size-3.5" />
            </Button>
          </div>

          <div className="lg:col-span-2">
            <p className="text-sm/relaxed text-muted-foreground">{text.overview}</p>
            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {text.highlights.map((item) => (
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
              const otherText = dict.programs[other.slug]
              return (
                <Link
                  key={other.slug}
                  href={programHref(other.slug as ProgramSlug)}
                  className="group flex items-center gap-3 bg-card p-5 transition-colors hover:bg-muted"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center border border-border bg-accent text-accent-foreground">
                    {OtherIcon ? <OtherIcon className="size-4" /> : null}
                  </span>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary">
                    {otherText.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
