import type { Metadata } from "next"
import { Church, Compass, HeartHandshake, Sparkles } from "lucide-react"

import { PageHero } from "@/components/page-hero"
import { ImigongoDivider } from "@/components/patterns/imigongo-divider"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The story of Saint Vincent Pallotti School Masaka — run by the Pallottine Missionary Sisters in Masaka, Kigali, Rwanda.",
}

const values = [
  {
    icon: Church,
    title: "Faith",
    description:
      "Catholic identity and the Pallottine charism shape daily life on campus, present but never overwhelming for families of all backgrounds.",
  },
  {
    icon: Sparkles,
    title: "Excellence",
    description:
      "High expectations across Cambridge and National curricula, backed by disciplined teaching and consistent assessment.",
  },
  {
    icon: HeartHandshake,
    title: "Inclusion",
    description:
      "Dedicated Special Needs Education ensures every learner, whatever their starting point, has a place to belong and grow.",
  },
  {
    icon: Compass,
    title: "Opportunity",
    description:
      "From TVET trades to university-track Secondary, every graduate leaves with a real path forward.",
  },
] as const

const milestones = [
  {
    year: "Founding",
    title: "A Mission Begins",
    description:
      "The Pallottine Missionary Sisters of Our Lady of Kibeho Region establish a school in Masaka, Kigali, rooted in the charism of St. Vincent Pallotti.",
  },
  {
    year: "Growth",
    title: "Expanding Programs",
    description:
      "Day Care, Kindergarten, National Nursery, Primary and Secondary, and Special Needs Education grow alongside the surrounding community.",
  },
  {
    year: "2022",
    title: "New Campus Inaugurated",
    description:
      "A major campus expansion is officially inaugurated by Cardinal Antoine Kambanda together with the Ministry of Education, adding capacity for 1,200+ students.",
  },
  {
    year: "Today",
    title: "Striving Beyond",
    description:
      "Over 1,400 students now study across Cambridge, National and TVET pathways on one growing campus.",
  },
] as const

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Our Story"
        description="Saint Vincent Pallotti School Masaka is run by the Pallottine Missionary Sisters, Our Lady of Kibeho Region — a mission of faith, academics and opportunity in Masaka, Kigali."
      />

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-teal uppercase">
              Our Charism
            </p>
            <h2 className="mt-3 font-heading text-[clamp(1.75rem,1.5rem+1.2vw,2.75rem)] font-semibold tracking-tight text-foreground">
              &ldquo;{"The love of Christ urges us on"}&rdquo;
            </h2>
            <p className="mt-2 text-sm italic text-muted-foreground">
              Caritas Christi urget nos &mdash; 2 Corinthians 5:14
            </p>
            <p className="mt-6 text-sm/relaxed text-muted-foreground">
              We are run by the Pallottine Missionary Sisters, part of the
              Union of Catholic Apostolate founded on the vision of St.
              Vincent Pallotti. That charism &mdash; that Christ&rsquo;s love
              compels us to act &mdash; shapes how our staff teach, how our
              Sisters care for students, and why Special Needs Education and
              TVET sit alongside our academic curricula: everyone deserves a
              path to strive beyond their circumstances.
            </p>
          </div>
          <div className="border border-border bg-muted/40 p-8">
            <p className="font-heading text-lg font-semibold text-foreground">
              At a glance
            </p>
            <dl className="mt-6 flex flex-col gap-5">
              <div className="flex items-baseline justify-between border-b border-border pb-3">
                <dt className="text-xs text-muted-foreground uppercase tracking-wide">Run by</dt>
                <dd className="text-right text-sm font-medium text-foreground">
                  Pallottine Missionary Sisters
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-b border-border pb-3">
                <dt className="text-xs text-muted-foreground uppercase tracking-wide">Region</dt>
                <dd className="text-sm font-medium text-foreground">Our Lady of Kibeho</dd>
              </div>
              <div className="flex items-baseline justify-between border-b border-border pb-3">
                <dt className="text-xs text-muted-foreground uppercase tracking-wide">Location</dt>
                <dd className="text-sm font-medium text-foreground">Masaka, Kigali, Rwanda</dd>
              </div>
              <div className="flex items-baseline justify-between">
                <dt className="text-xs text-muted-foreground uppercase tracking-wide">Motto</dt>
                <dd className="text-sm font-medium text-foreground">Strive Beyond</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:max-w-xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-teal uppercase">
              What We Stand For
            </p>
            <h2 className="font-heading text-[clamp(1.75rem,1.5rem+1.2vw,2.75rem)] font-semibold tracking-tight text-foreground">
              Faith, excellence, inclusion, opportunity
            </h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="flex flex-col gap-4 border border-border bg-card p-6">
                <value.icon className="size-7 text-primary" />
                <h3 className="font-heading text-base font-semibold text-foreground">
                  {value.title}
                </h3>
                <p className="text-xs/relaxed text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:max-w-xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-teal uppercase">
              Our Journey
            </p>
            <h2 className="font-heading text-[clamp(1.75rem,1.5rem+1.2vw,2.75rem)] font-semibold tracking-tight text-foreground">
              Milestones
            </h2>
          </div>

          <ol className="mt-12 flex flex-col">
            {milestones.map((milestone, index) => (
              <li key={milestone.title} className="relative flex gap-6 pb-10 last:pb-0">
                <div className="flex flex-col items-center">
                  <span className="flex size-11 shrink-0 items-center justify-center border-2 border-primary bg-background font-heading text-xs font-semibold text-primary">
                    {milestone.year}
                  </span>
                  {index < milestones.length - 1 && (
                    <span className="mt-1 w-px flex-1 bg-border" aria-hidden="true" />
                  )}
                </div>
                <div className="pb-2">
                  <h3 className="font-heading text-base font-semibold text-foreground">
                    {milestone.title}
                  </h3>
                  <p className="mt-1.5 max-w-xl text-xs/relaxed text-muted-foreground">
                    {milestone.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <ImigongoDivider className="mt-8 h-2.5 w-32 text-gold" />
        </div>
      </section>
    </>
  )
}
