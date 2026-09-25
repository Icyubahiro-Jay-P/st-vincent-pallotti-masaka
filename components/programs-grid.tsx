import Link from "@/components/locale-link"
import { ArrowRight, ArrowUpRight } from "lucide-react"

import { iconMap } from "@/components/icon-map"
import { programHref } from "@/lib/site-config"
import type { getPublishedPrograms } from "@/lib/programs"

// Classes for the help card that fills the grid's leftover cells, so a
// partial last row never shows the grey bg-border through empty cells.
// Returns null when the count fills every row at both breakpoints.
export function helpCardClasses(count: number) {
  const smEmpty = count % 2
  const lgEmpty = (3 - (count % 3)) % 3
  if (!smEmpty && !lgEmpty) return null
  return [
    smEmpty ? "" : "sm:hidden",
    ["lg:hidden", "lg:flex", "lg:flex lg:col-span-2"][lgEmpty],
  ].join(" ")
}

export function ProgramsGrid({
  eyebrow,
  title,
  description,
  items,
  help,
}: {
  eyebrow: string
  title: string
  description: string
  items: Awaited<ReturnType<typeof getPublishedPrograms>>
  help: { title: string; description: string; cta: string }
}) {
  const helpClasses = helpCardClasses(items.length)
  return (
    <section className="border-b border-border bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:max-w-xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-teal uppercase">
            {eyebrow}
          </p>
          <h2 className="font-heading text-[clamp(1.75rem,1.5rem+1.2vw,2.75rem)] font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="text-sm/relaxed text-muted-foreground">{description}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {items.map((program) => {
            const Icon = iconMap[program.icon]
            return (
              <Link
                key={program.slug}
                href={programHref(program.slug)}
                className="group relative flex flex-col gap-3 bg-card p-6 transition-colors hover:bg-muted focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
              >
                <div className="flex items-start justify-between">
                  <span className="flex size-10 items-center justify-center border border-border bg-accent text-accent-foreground">
                    {Icon ? <Icon className="size-5" /> : null}
                  </span>
                  <ArrowUpRight className="size-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold text-foreground">
                    {program.name}
                  </h3>
                  <p className="mt-0.5 text-[0.7rem] font-medium tracking-wide text-teal uppercase">
                    {program.ageRange}
                  </p>
                </div>
                <p className="text-xs/relaxed text-muted-foreground">
                  {program.description}
                </p>
              </Link>
            )
          })}
          {helpClasses ? (
            <Link
              href="/admissions"
              className={`group flex flex-col justify-center gap-3 bg-muted p-6 transition-colors hover:bg-accent focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring ${helpClasses}`}
            >
              <h3 className="font-heading text-base font-semibold text-foreground">
                {help.title}
              </h3>
              <p className="text-xs/relaxed text-muted-foreground">
                {help.description}
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-primary uppercase group-hover:underline">
                {help.cta}
                <ArrowRight className="size-3.5" />
              </span>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  )
}
