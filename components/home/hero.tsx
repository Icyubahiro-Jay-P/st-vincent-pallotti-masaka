import Link from "next/link"
import { ArrowRight, PlayCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Crest } from "@/components/crest"
import { ImigongoSpiral } from "@/components/patterns/imigongo-spiral"
import { siteConfig } from "@/lib/site-config"
import type { Dictionary } from "@/lib/i18n/get-dictionary"

export function Hero({ dict }: { dict: Dictionary }) {
  const h = dict.home.hero

  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-20 lg:grid-cols-12 lg:items-center lg:gap-8 lg:px-8 lg:pt-20 lg:pb-24">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 border border-border bg-muted px-3 py-1.5 text-[0.65rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            <span className="size-1.5 rounded-full bg-teal" />
            {h.eyebrow}
          </div>

          <h1 className="mt-6 font-heading text-[clamp(2.75rem,2.1rem+3vw,5rem)] leading-[1.02] font-semibold tracking-tight text-foreground">
            {h.headline}{" "}
            <span className="relative inline-block italic text-primary">
              {h.headlineEmphasis}
              <svg
                viewBox="0 0 200 12"
                className="absolute inset-x-0 -bottom-2 h-3 w-full text-gold"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M2 9c40-8 156-8 196 0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base/relaxed text-muted-foreground sm:text-lg/relaxed">
            {h.paragraph}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              size="lg"
              render={<Link href="/admissions" />}
              className="h-11 bg-primary px-6 text-sm text-primary-foreground hover:bg-primary/85"
            >
              {h.applyNow}
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link href="/about" />}
              className="h-11 px-6 text-sm"
            >
              <PlayCircle data-icon="inline-start" />
              {h.ourStory}
            </Button>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6 sm:grid-cols-4">
            {h.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-heading text-xl font-semibold text-foreground">
                  {stat.value}
                </dd>
                <dd className="text-[0.7rem] text-muted-foreground uppercase tracking-wide">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative lg:col-span-5">
          <div className="relative overflow-hidden border border-ink bg-ink text-ink-foreground">
            <ImigongoSpiral className="pointer-events-none absolute -top-6 -right-6 size-36 text-ink-foreground/30" />
            <div className="relative flex flex-col items-center gap-5 px-8 py-14 text-center sm:py-16">
              <Crest size={128} ringClassName="ring-4" />
              <div>
                <p className="font-heading text-lg font-semibold">
                  {siteConfig.name}
                </p>
                <p className="mt-1 text-xs tracking-[0.15em] text-ink-foreground/70 uppercase">
                  {h.panelEstablished}
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-4 max-w-52 border border-border bg-card p-4 shadow-lg sm:-left-8">
            <p className="font-heading text-2xl font-semibold text-primary">
              {h.calloutValue}
            </p>
            <p className="text-xs text-muted-foreground">{h.calloutText}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
