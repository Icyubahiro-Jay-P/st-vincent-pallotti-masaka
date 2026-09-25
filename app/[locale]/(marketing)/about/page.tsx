import type { Metadata } from "next"
import Image from "next/image"

import { PageHero } from "@/components/page-hero"
import { iconMap } from "@/components/icon-map"
import { Breadcrumb } from "@/components/breadcrumb"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"
import { getSiteSettings } from "@/lib/site-settings"
import { getPublishedMilestones } from "@/lib/milestones"
import { getPublishedValues } from "@/lib/values"
import { localeAlternates, localeUrl, ogImages } from "@/lib/i18n/alternates"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  return {
    title: dict.meta.about.title,
    description: dict.meta.about.description,
    alternates: await localeAlternates("/about"),
    openGraph: {
      title: dict.meta.about.title,
      description: dict.meta.about.description,
      url: await localeUrl("/about"),
      images: await ogImages(),
    },
  }
}

// Deterministic URL written by scripts/import-assets.ts (npm run import:assets).
const cloudName = process.env.CLOUDINARY_CLOUD_NAME
const HEADMISTRESS_PHOTO_URL = cloudName
  ? `https://res.cloudinary.com/${cloudName}/image/upload/about/headmistress/EK4A0573.jpg`
  : null

export default async function AboutPage() {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  const a = dict.about
  const [milestoneItems, valueItems, settings] = await Promise.all([
    getPublishedMilestones(locale),
    getPublishedValues(locale),
    getSiteSettings(),
  ])

  return (
    <>
      <PageHero
        eyebrow={a.hero.eyebrow}
        title={a.hero.title}
        description={a.hero.description}
      />
      <Breadcrumb
        items={[
          { label: dict.nav.home, href: "/" },
          { label: dict.nav.about, href: "/about" },
        ]}
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
            <p className="mt-2 text-sm text-muted-foreground italic">
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
                <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                  {a.charism.runBy}
                </dt>
                <dd className="text-right text-sm font-medium text-foreground">
                  {a.charism.runByValue}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-b border-border pb-3">
                <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                  {a.charism.region}
                </dt>
                <dd className="text-sm font-medium text-foreground">
                  {a.charism.regionValue}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-b border-border pb-3">
                <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                  {a.charism.location}
                </dt>
                <dd className="text-sm font-medium text-foreground">
                  {settings.location}
                </dd>
              </div>
              <div className="flex items-baseline justify-between">
                <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                  {a.charism.motto}
                </dt>
                <dd className="text-sm font-medium text-foreground">
                  {settings.motto}
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
            {valueItems.map((value) => {
              const Icon = iconMap[value.icon]
              return (
                <div
                  key={value.title}
                  className="flex flex-col gap-4 border border-border bg-card p-6"
                >
                  <Icon className="size-7 text-primary" />
                  <h3 className="font-heading text-base font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-xs/relaxed text-muted-foreground">
                    {value.description}
                  </p>
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
            {milestoneItems.map((milestone, index) => {
              const Icon = iconMap[milestone.icon]
              return (
                <li
                  key={milestone.title}
                  className="relative flex gap-6 pb-10 last:pb-0"
                >
                  <div className="flex flex-col items-center">
                    <span className="flex size-11 shrink-0 items-center justify-center border-2 border-primary bg-background text-primary">
                      <Icon className="size-5" />
                    </span>
                    {index < milestoneItems.length - 1 && (
                      <span
                        className="mt-1 w-px flex-1 bg-border"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="pb-2">
                    <p className="text-[0.7rem] font-semibold tracking-wide text-teal uppercase">
                      {milestone.year}
                    </p>
                    <h3 className="mt-0.5 font-heading text-base font-semibold text-foreground">
                      {milestone.title}
                    </h3>
                    <p className="mt-1.5 max-w-xl text-xs/relaxed text-muted-foreground">
                      {milestone.description}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </section>
      <section className="border-t border-border bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {HEADMISTRESS_PHOTO_URL && (
            <div className="relative aspect-4/5 overflow-hidden border border-border bg-card">
              <Image
                src={HEADMISTRESS_PHOTO_URL}
                alt={a.headmistress.photoAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          )}
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-teal uppercase">
              {a.headmistress.eyebrow}
            </p>
            <h2 className="mt-3 font-heading text-[clamp(1.75rem,1.5rem+1.2vw,2.75rem)] font-semibold tracking-tight text-foreground">
              {a.headmistress.title}
            </h2>
            <p className="mt-6 text-sm/relaxed text-muted-foreground">
              {a.headmistress.message}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
