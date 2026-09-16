import type { Metadata } from "next"
import { Church, Compass, HeartHandshake, Sparkles } from "lucide-react"

import { PageHero } from "@/components/page-hero"
import { ImigongoDivider } from "@/components/patterns/imigongo-divider"
import { siteConfig } from "@/lib/site-config"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import type { Locale } from "@/lib/i18n/config"

const valueIcons = [Church, Sparkles, HeartHandshake, Compass] as const

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const dict = getDictionary(locale)
  return { title: dict.meta.about.title, description: dict.meta.about.description }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const dict = getDictionary(locale)
  const a = dict.about

  return (
    <>
      <PageHero
        eyebrow={a.hero.eyebrow}
        title={a.hero.title}
        description={a.hero.description}
      />

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-teal uppercase">
              {a.charism.eyebrow}
            </p>
            <h2 className="mt-3 font-heading text-[clamp(1.75rem,1.5rem+1.2vw,2.75rem)] font-semibold tracking-tight text-foreground">
              &ldquo;{a.charism.quote}&rdquo;
            </h2>
            <p className="mt-2 text-sm italic text-muted-foreground">
              {a.charism.citation}
            </p>
            <p className="mt-6 text-sm/relaxed text-muted-foreground">
              {a.charism.paragraph}
            </p>
          </div>
          <div className="border border-border bg-muted/40 p-8">
            <p className="font-heading text-lg font-semibold text-foreground">
              {a.charism.glanceTitle}
            </p>
            <dl className="mt-6 flex flex-col gap-5">
              <div className="flex items-baseline justify-between border-b border-border pb-3">
                <dt className="text-xs text-muted-foreground uppercase tracking-wide">
                  {a.charism.runBy}
                </dt>
                <dd className="text-right text-sm font-medium text-foreground">
                  {a.charism.runByValue}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-b border-border pb-3">
                <dt className="text-xs text-muted-foreground uppercase tracking-wide">
                  {a.charism.region}
                </dt>
                <dd className="text-sm font-medium text-foreground">
                  {a.charism.regionValue}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-b border-border pb-3">
                <dt className="text-xs text-muted-foreground uppercase tracking-wide">
                  {a.charism.location}
                </dt>
                <dd className="text-sm font-medium text-foreground">
                  {siteConfig.location}
                </dd>
              </div>
              <div className="flex items-baseline justify-between">
                <dt className="text-xs text-muted-foreground uppercase tracking-wide">
                  {a.charism.motto}
                </dt>
                <dd className="text-sm font-medium text-foreground">
                  {siteConfig.motto}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:max-w-xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-teal uppercase">
              {a.values.eyebrow}
            </p>
            <h2 className="font-heading text-[clamp(1.75rem,1.5rem+1.2vw,2.75rem)] font-semibold tracking-tight text-foreground">
              {a.values.title}
            </h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {a.values.items.map((value, index) => {
              const Icon = valueIcons[index]
              return (
                <div key={value.title} className="flex flex-col gap-4 border border-border bg-card p-6">
                  <Icon className="size-7 text-primary" />
                  <h3 className="font-heading text-base font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-xs/relaxed text-muted-foreground">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:max-w-xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-teal uppercase">
              {a.milestones.eyebrow}
            </p>
            <h2 className="font-heading text-[clamp(1.75rem,1.5rem+1.2vw,2.75rem)] font-semibold tracking-tight text-foreground">
              {a.milestones.title}
            </h2>
          </div>

          <ol className="mt-12 flex flex-col">
            {a.milestones.items.map((milestone, index) => (
              <li key={milestone.title} className="relative flex gap-6 pb-10 last:pb-0">
                <div className="flex flex-col items-center">
                  <span className="flex size-11 shrink-0 items-center justify-center border-2 border-primary bg-background font-heading text-xs font-semibold text-primary">
                    {milestone.year}
                  </span>
                  {index < a.milestones.items.length - 1 && (
                    <span className="mt-1 w-px flex-1 bg-border" aria-hidden="true" />
                  )}
                </div>
                <div className="pb-2">
                  <h3 className="font-heading text-base font-semibold text-foreground">
                    {milestone.title}
                  </h3>
                  <p className="mt-1.5 max-w-xl text-xs/relaxed text-muted-foreground">
                    {milestone.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <ImigongoDivider className="mt-8 h-2.5 w-32 text-foreground" />
        </div>
      </section>
    </>
  )
}
