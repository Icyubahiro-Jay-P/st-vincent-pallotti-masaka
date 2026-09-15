import type { Metadata } from "next"
import Link from "next/link"
import {
  Globe2,
  BookOpen,
  Calculator,
  Microscope,
  Languages,
  Palette,
  Trophy,
  ArrowRight,
  HeartHandshake,
} from "lucide-react"

import { PageHero } from "@/components/page-hero"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Academics",
  description:
    "Cambridge and National curricula, plus Special Needs Education, at Saint Vincent Pallotti School Masaka.",
}

const curricula = [
  {
    id: "cambridge-primary",
    name: "Cambridge Curriculum",
    tagline: "Internationally benchmarked",
    description:
      "Our Cambridge stream follows the Cambridge Primary framework in English, Mathematics and Science, preparing students for globally recognised progression.",
    subjects: ["English", "Mathematics", "Science", "ICT", "Global Perspectives"],
    icon: Globe2,
  },
  {
    id: "national-primary",
    name: "National Curriculum",
    tagline: "Rwanda's competence-based curriculum",
    description:
      "National Nursery, Primary and Secondary follow Rwanda's official competence-based curriculum, taught in a disciplined, values-led classroom.",
    subjects: ["Kinyarwanda", "English", "Mathematics", "Social Studies", "Sciences"],
    icon: BookOpen,
  },
] as const

const subjectHighlights = [
  { icon: Calculator, label: "Mathematics & Sciences" },
  { icon: Languages, label: "English & Kinyarwanda" },
  { icon: Microscope, label: "Integrated Science" },
  { icon: Palette, label: "Creative & Performing Arts" },
] as const

export default function AcademicsPage() {
  return (
    <>
      <PageHero
        eyebrow="Academics"
        title="Two Curricula. One Standard of Excellence."
        description="Families choose between the Cambridge and National curricula at Pallotti — both taught to the same high standard, from Nursery through Secondary."
      />

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {curricula.map((track) => (
              <div key={track.id} id={track.id} className="flex flex-col gap-5 border border-border bg-card p-8">
                <div className="flex items-center justify-between">
                  <track.icon className="size-9 text-primary" />
                  <Badge variant="secondary" className="uppercase">
                    {track.tagline}
                  </Badge>
                </div>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  {track.name}
                </h2>
                <p className="text-sm/relaxed text-muted-foreground">{track.description}</p>
                <div className="flex flex-wrap gap-2 border-t border-border pt-5">
                  {track.subjects.map((subject) => (
                    <span
                      key={subject}
                      className="border border-border px-2.5 py-1 text-[0.7rem] text-muted-foreground"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden border border-border bg-border sm:grid-cols-4">
            {subjectHighlights.map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2 bg-card px-4 py-6 text-center">
                <item.icon className="size-5 text-teal" />
                <p className="text-[0.7rem] font-medium text-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="special-needs"
        className="border-b border-border bg-ink py-16 text-ink-foreground sm:py-20"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="lg:col-span-1">
            <HeartHandshake className="size-10 text-gold" />
            <h2 className="mt-4 font-heading text-2xl font-semibold sm:text-3xl">
              Special Needs Education
            </h2>
          </div>
          <div className="lg:col-span-2">
            <p className="text-sm/relaxed text-ink-foreground/80">
              Every child deserves a classroom built around them. Our Special
              Needs Education program provides individualised learning plans,
              trained support staff and an inclusive environment where
              students with a range of abilities learn alongside their peers
              &mdash; consistent with the Pallottine belief that no learner
              should be left behind.
            </p>
            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                "Individualised support plans",
                "Trained special needs educators",
                "Inclusive, mixed-ability classrooms",
                "Available across Day Care to Secondary",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-xs text-ink-foreground/85">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-start gap-4">
            <Trophy className="size-8 shrink-0 text-primary" />
            <p className="max-w-lg text-sm/relaxed text-muted-foreground">
              Pallotti students are consistently among the stronger-performing
              cohorts in the Kigali area, across both the Cambridge and
              National streams &mdash; a track record our teachers work hard
              to build on every term.
            </p>
          </div>
          <Button size="lg" render={<Link href="/admissions" />} className="h-11 shrink-0 px-6 text-sm">
            Apply for a Place
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </section>
    </>
  )
}
