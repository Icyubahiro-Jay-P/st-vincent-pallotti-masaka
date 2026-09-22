import { pathwaySteps } from "@/lib/site-config"
import type { Dictionary } from "@/lib/i18n/get-dictionary"

export function Pathway({ dict }: { dict: Dictionary }) {
  const p = dict.home.pathway

  return (
    <section className="border-b border-border bg-muted/40 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:max-w-xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-teal uppercase">
            {p.eyebrow}
          </p>
          <h2 className="font-heading text-[clamp(1.75rem,1.5rem+1.2vw,2.75rem)] font-semibold tracking-tight text-foreground">
            {p.title}
          </h2>
        </div>

        <div className="relative mt-12">
          <div
            className="absolute top-6 right-[10%] left-[10%] hidden h-px bg-border sm:block"
            aria-hidden="true"
          />
          <ol className="grid grid-cols-1 gap-8 sm:grid-cols-5 sm:gap-4">
            {p.steps.map((item, index) => (
              <li key={item.stage} className="relative flex flex-col gap-3">
                <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-4">
                  <span className="relative z-10 flex size-12 shrink-0 items-center justify-center border-2 border-primary bg-background font-heading text-sm font-semibold text-primary">
                    {pathwaySteps[index]}
                  </span>
                  <h3 className="font-heading text-base font-semibold text-foreground sm:mt-1">
                    {item.stage}
                  </h3>
                </div>
                <p className="text-[0.7rem] font-medium tracking-wide text-teal uppercase">
                  {item.range}
                </p>
                <p className="text-xs/relaxed text-muted-foreground">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
