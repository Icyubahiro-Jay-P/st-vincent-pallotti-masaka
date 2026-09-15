import Link from "next/link"
import { ArrowRight, PlayCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Crest } from "@/components/crest"
import { ImigongoField } from "@/components/patterns/imigongo-field"
import { siteConfig } from "@/lib/site-config"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-20 lg:grid-cols-12 lg:items-center lg:gap-8 lg:px-8 lg:pt-20 lg:pb-24">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 border border-border bg-muted px-3 py-1.5 text-[0.65rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            <span className="size-1.5 rounded-full bg-teal" />
            Pallottine Missionary Sisters &middot; Masaka, Kigali
          </div>

          <h1 className="mt-6 font-heading text-[clamp(2.75rem,2.1rem+3vw,5rem)] leading-[1.02] font-semibold tracking-tight text-foreground">
            Strive{" "}
            <span className="relative inline-block italic text-primary">
              Beyond.
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
            From Day Care to Secondary and TVET, Saint Vincent Pallotti School
            Masaka forms confident, capable graduates on a new campus built for
            over 1,400 students: Cambridge and National curricula, Special
            Needs Education, and hands-on vocational training, all rooted in
            Catholic values.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              size="lg"
              render={<Link href="/admissions" />}
              className="h-11 bg-primary px-6 text-sm text-primary-foreground hover:bg-primary/85"
            >
              Apply Now
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link href="/about" />}
              className="h-11 px-6 text-sm"
            >
              <PlayCircle data-icon="inline-start" />
              Our Story
            </Button>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6 sm:grid-cols-4">
            {[
              ["1,400+", "Students"],
              ["2022", "New Campus"],
              ["2", "Curricula"],
              ["5", "TVET Trades"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-heading text-xl font-semibold text-foreground">
                  {value}
                </dd>
                <dd className="text-[0.7rem] text-muted-foreground uppercase tracking-wide">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative lg:col-span-5">
          <div className="relative overflow-hidden border border-ink bg-ink text-ink-foreground">
            <ImigongoField className="absolute inset-0 h-full w-full text-gold/40" />
            <div className="relative flex flex-col items-center gap-5 px-8 py-14 text-center sm:py-16">
              <Crest size={128} ringClassName="ring-4" />
              <div>
                <p className="font-heading text-lg font-semibold">
                  {siteConfig.name}
                </p>
                <p className="mt-1 text-xs tracking-[0.15em] text-ink-foreground/70 uppercase">
                  Est. by the Pallottine Sisters
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-4 max-w-[13rem] border border-border bg-card p-4 shadow-lg sm:-left-8">
            <p className="font-heading text-2xl font-semibold text-primary">
              1,200+
            </p>
            <p className="text-xs text-muted-foreground">
              seats added when our new campus opened, blessed by Cardinal
              Antoine Kambanda
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
