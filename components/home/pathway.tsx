import { educationPathway } from "@/lib/site-config"

export function Pathway() {
  return (
    <section className="border-b border-border bg-muted/40 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:max-w-xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-teal uppercase">
            The Pallotti Pathway
          </p>
          <h2 className="font-heading text-[clamp(1.75rem,1.5rem+1.2vw,2.75rem)] font-semibold tracking-tight text-foreground">
            Your child&rsquo;s journey, stage by stage
          </h2>
        </div>

        <ol className="relative mt-12 grid grid-cols-1 gap-8 sm:grid-cols-5 sm:gap-4">
          <div
            className="absolute top-6 right-[10%] left-[10%] hidden h-px bg-border sm:block"
            aria-hidden="true"
          />
          {educationPathway.map((item) => (
            <li key={item.step} className="relative flex flex-col gap-3">
              <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-4">
                <span className="relative z-10 flex size-12 shrink-0 items-center justify-center border-2 border-primary bg-background font-heading text-sm font-semibold text-primary">
                  {item.step}
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
    </section>
  )
}
