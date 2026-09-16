import { Building2, Award, Church, HeartHandshake } from "lucide-react"

import { ImigongoDivider } from "@/components/patterns/imigongo-divider"
import type { Dictionary } from "@/lib/i18n/get-dictionary"

const icons = [Building2, Award, Church, HeartHandshake] as const
const sizes = ["lg", "sm", "sm", "sm"] as const

export function WhyPallotti({ dict }: { dict: Dictionary }) {
  const w = dict.home.why

  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:max-w-xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-teal uppercase">
            {w.eyebrow}
          </p>
          <h2 className="font-heading text-[clamp(1.75rem,1.5rem+1.2vw,2.75rem)] font-semibold tracking-tight text-foreground">
            {w.title}
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {w.features.map((feature, index) => {
            const Icon = icons[index]
            const size = sizes[index]
            return (
              <div
                key={feature.title}
                className={
                  size === "lg"
                    ? "flex flex-col justify-between gap-6 bg-ink p-8 text-ink-foreground lg:col-span-2 lg:row-span-2"
                    : "flex flex-col gap-4 bg-card p-6"
                }
              >
                <Icon className={size === "lg" ? "size-9 text-gold" : "size-7 text-primary"} />
                <div>
                  <h3
                    className={
                      size === "lg"
                        ? "font-heading text-2xl font-semibold"
                        : "font-heading text-base font-semibold text-foreground"
                    }
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={
                      size === "lg"
                        ? "mt-3 text-sm/relaxed text-ink-foreground/75"
                        : "mt-2 text-xs/relaxed text-muted-foreground"
                    }
                  >
                    {feature.description}
                  </p>
                </div>
                {size === "lg" && (
                  <ImigongoDivider className="h-2 w-24 text-ink-foreground" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
