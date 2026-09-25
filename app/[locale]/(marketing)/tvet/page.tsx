import type { Metadata } from "next"
import Link from "@/components/locale-link"
import { ArrowRight, Award, Briefcase, Wrench } from "lucide-react"

import { PageHero } from "@/components/page-hero"
import { Button } from "@/components/ui/button"
import { iconMap } from "@/components/icon-map"
import { Breadcrumb } from "@/components/breadcrumb"
import { tvetTradeIcons } from "@/lib/site-config"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { localeAlternates, localeUrl, ogImages } from "@/lib/i18n/alternates"
import { getLocale } from "@/lib/i18n/get-locale"

const reasonIcons = [Wrench, Award, Briefcase] as const

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  return {
    title: dict.meta.tvet.title,
    description: dict.meta.tvet.description,
    alternates: await localeAlternates("/tvet"),
    openGraph: {
      title: dict.meta.tvet.title,
      description: dict.meta.tvet.description,
      url: await localeUrl("/tvet"),
      images: await ogImages(),
    },
  }
}

export default async function TvetPage() {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  const t = dict.tvet

  return (
    <>
      <PageHero
        eyebrow={t.hero.eyebrow}
        title={t.hero.title}
        description={t.hero.description}
      />
      <Breadcrumb
        items={[
          { label: dict.nav.home, href: "/" },
          { label: dict.nav.tvet, href: "/tvet" },
        ]}
      />

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.trades.map((trade, index) => {
              const Icon = iconMap[tvetTradeIcons[index]]
              return (
                <div
                  key={trade.name}
                  className="flex flex-col gap-4 border border-border bg-card p-6"
                >
                  <span className="flex size-11 items-center justify-center border border-border bg-accent text-accent-foreground">
                    {Icon ? <Icon className="size-5" /> : null}
                  </span>
                  <h2 className="font-heading text-base font-semibold text-foreground">
                    {trade.name}
                  </h2>
                  <p className="text-xs/relaxed text-muted-foreground">
                    {trade.description}
                  </p>
                </div>
              )
            })}
            <div className="flex flex-col justify-center gap-3 border border-dashed border-border bg-muted/40 p-6">
              <p className="text-xs font-semibold tracking-[0.15em] text-teal uppercase">
                {t.enrolCard.eyebrow}
              </p>
              <p className="text-sm/relaxed text-foreground">
                {t.enrolCard.paragraph}
              </p>
              <Button
                render={<Link href="/admissions" />}
                className="mt-2 h-10 self-start px-5 text-xs"
              >
                {t.enrolCard.cta}
                <ArrowRight data-icon="inline-end" className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-ink py-16 text-ink-foreground sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:max-w-xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">
              {t.reasons.eyebrow}
            </p>
            <h2 className="font-heading text-[clamp(1.75rem,1.5rem+1.2vw,2.75rem)] font-semibold tracking-tight">
              {t.reasons.title}
            </h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {t.reasons.items.map((reason, index) => {
              const Icon = reasonIcons[index]
              return (
                <div
                  key={reason.title}
                  className="flex flex-col gap-4 border border-white/15 p-6"
                >
                  <Icon className="size-7 text-gold" />
                  <h3 className="font-heading text-base font-semibold">
                    {reason.title}
                  </h3>
                  <p className="text-xs/relaxed text-ink-foreground/75">
                    {reason.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
