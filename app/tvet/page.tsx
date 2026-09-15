import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Award, Briefcase, Wrench } from "lucide-react"

import { PageHero } from "@/components/page-hero"
import { Button } from "@/components/ui/button"
import { iconMap } from "@/components/icon-map"
import { tvetTrades } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "TVET / Vocational Programs",
  description:
    "Hands-on trade training at Saint Vincent Pallotti School Masaka — Welding, Tailoring, Hairdressing, Carpentry and Culinary Arts.",
}

const reasons = [
  {
    icon: Wrench,
    title: "Hands-On From Day One",
    description: "Real workshop equipment and practical assessments, not just theory.",
  },
  {
    icon: Award,
    title: "Certification-Track Training",
    description: "Curriculum built toward recognised trade certification standards.",
  },
  {
    icon: Briefcase,
    title: "A Direct Path to Work",
    description: "Graduates leave ready to employ themselves or join Rwanda's growing trades sector.",
  },
] as const

export default function TvetPage() {
  return (
    <>
      <PageHero
        eyebrow="TVET / Vocational"
        title="A Trade Is a Future"
        description="Alongside our academic tracks, Pallotti offers Technical and Vocational Education and Training in five hands-on trades — a real, certifiable path to work."
      />

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tvetTrades.map((trade) => {
              const Icon = iconMap[trade.icon]
              return (
                <div key={trade.name} className="flex flex-col gap-4 border border-border bg-card p-6">
                  <span className="flex size-11 items-center justify-center border border-border bg-accent text-accent-foreground">
                    {Icon ? <Icon className="size-5" /> : null}
                  </span>
                  <h2 className="font-heading text-base font-semibold text-foreground">
                    {trade.name}
                  </h2>
                  <p className="text-xs/relaxed text-muted-foreground">{trade.description}</p>
                </div>
              )
            })}
            <div className="flex flex-col justify-center gap-3 border border-dashed border-border bg-muted/40 p-6">
              <p className="text-xs font-semibold tracking-[0.15em] text-teal uppercase">
                Ready to enrol?
              </p>
              <p className="text-sm/relaxed text-foreground">
                Speak to our admissions team about placement, workshop tours
                and entry requirements for each trade.
              </p>
              <Button
                render={<Link href="/admissions" />}
                className="mt-2 h-10 self-start px-5 text-xs"
              >
                Apply to TVET
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
              Why TVET at Pallotti
            </p>
            <h2 className="font-heading text-[clamp(1.75rem,1.5rem+1.2vw,2.75rem)] font-semibold tracking-tight">
              Skills that put students to work
            </h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {reasons.map((reason) => (
              <div key={reason.title} className="flex flex-col gap-4 border border-white/15 p-6">
                <reason.icon className="size-7 text-gold" />
                <h3 className="font-heading text-base font-semibold">{reason.title}</h3>
                <p className="text-xs/relaxed text-ink-foreground/75">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
