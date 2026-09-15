import { Building2, Award, Church, HeartHandshake } from "lucide-react"

import { ImigongoDivider } from "@/components/patterns/imigongo-divider"

const features = [
  {
    icon: Building2,
    title: "A Campus Built to Last",
    description:
      "Expanded in 2022 and inaugurated by Cardinal Antoine Kambanda with the Ministry of Education, our campus now holds over 1,200 additional seats — modern classrooms, workshops and grounds designed for growth.",
    size: "lg",
  },
  {
    icon: Award,
    title: "Cambridge & National, Side by Side",
    description:
      "Families choose the internationally benchmarked Cambridge curriculum or the Rwandan National curriculum, both delivered to a high standard.",
    size: "sm",
  },
  {
    icon: Church,
    title: "Formed in Catholic Values",
    description:
      "Guided by the Pallottine Missionary Sisters, character and faith formation sit alongside academics.",
    size: "sm",
  },
  {
    icon: HeartHandshake,
    title: "An Inclusive Classroom",
    description:
      "Dedicated Special Needs Education means every learner, regardless of ability, has a place at Pallotti.",
    size: "sm",
  },
] as const

export function WhyPallotti() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:max-w-xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-teal uppercase">
            Why Families Choose Pallotti
          </p>
          <h2 className="font-heading text-[clamp(1.75rem,1.5rem+1.2vw,2.75rem)] font-semibold tracking-tight text-foreground">
            Built for growth, rooted in values
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={
                feature.size === "lg"
                  ? "flex flex-col justify-between gap-6 bg-ink p-8 text-ink-foreground lg:col-span-2 lg:row-span-2"
                  : "flex flex-col gap-4 bg-card p-6"
              }
            >
              <feature.icon
                className={
                  feature.size === "lg"
                    ? "size-9 text-gold"
                    : "size-7 text-primary"
                }
              />
              <div>
                <h3
                  className={
                    feature.size === "lg"
                      ? "font-heading text-2xl font-semibold"
                      : "font-heading text-base font-semibold text-foreground"
                  }
                >
                  {feature.title}
                </h3>
                <p
                  className={
                    feature.size === "lg"
                      ? "mt-3 text-sm/relaxed text-ink-foreground/75"
                      : "mt-2 text-xs/relaxed text-muted-foreground"
                  }
                >
                  {feature.description}
                </p>
              </div>
              {feature.size === "lg" && (
                <ImigongoDivider className="h-2 w-24 text-gold" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
