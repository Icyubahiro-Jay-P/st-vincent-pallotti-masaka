import type { Metadata } from "next"
import { UserPlus, CalendarCheck2, FileCheck2, ClipboardCheck, Phone, Mail } from "lucide-react"

import { PageHero } from "@/components/page-hero"
import { AdmissionInquiryForm } from "@/components/admissions/inquiry-form"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Admissions",
  description:
    "Start an admissions inquiry at Saint Vincent Pallotti School Masaka — Day Care, Kindergarten, Cambridge and National Primary & Secondary, Special Needs Education, and TVET.",
}

const processSteps = [
  {
    icon: UserPlus,
    title: "Submit an Inquiry",
    description:
      "Complete the form below with your child's details and program of interest.",
  },
  {
    icon: CalendarCheck2,
    title: "Campus Visit & Assessment",
    description:
      "Our admissions team schedules a campus tour and, where applicable, a simple placement assessment.",
  },
  {
    icon: FileCheck2,
    title: "Submit Documents",
    description:
      "Bring the required documents for your child's program (see the checklist below).",
  },
  {
    icon: ClipboardCheck,
    title: "Enrollment Confirmed",
    description:
      "Once documents are verified, you'll receive confirmation and fee information to secure the place.",
  },
] as const

const requirementsByLevel = [
  {
    value: "early-years",
    label: "Day Care & Kindergarten",
    items: [
      "Child's birth certificate (copy)",
      "Immunization / health record",
      "4 passport-size photos of the child",
      "Copy of parent/guardian national ID or passport",
    ],
  },
  {
    value: "primary",
    label: "Primary (Cambridge & National)",
    items: [
      "Birth certificate (copy)",
      "Report form / transcript from previous school",
      "Transfer letter, if changing schools",
      "4 passport-size photos of the student",
      "Immunization record",
    ],
  },
  {
    value: "secondary",
    label: "Secondary (O-Level & A-Level)",
    items: [
      "Primary Leaving / previous school certificate",
      "Most recent report card or transcript",
      "Transfer letter from previous school",
      "4 passport-size photos of the student",
      "Copy of student and parent/guardian ID",
    ],
  },
  {
    value: "tvet",
    label: "TVET / Vocational",
    items: [
      "Highest academic certificate obtained",
      "National ID or passport copy",
      "4 passport-size photos",
      "Statement of the trade of interest",
    ],
  },
] as const

export default function AdmissionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Admissions"
        title="Join the Pallotti Family"
        description="Seats are open across Day Care, Kindergarten, Cambridge and National Primary & Secondary, Special Needs Education, and TVET. Here's how to apply — and a form to get started today."
      />

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:max-w-xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-teal uppercase">
              How It Works
            </p>
            <h2 className="font-heading text-[clamp(1.75rem,1.5rem+1.2vw,2.75rem)] font-semibold tracking-tight text-foreground">
              A simple, four-step process
            </h2>
          </div>

          <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <li
                key={step.title}
                className="flex flex-col gap-4 border border-border bg-card p-6"
              >
                <div className="flex items-center justify-between">
                  <step.icon className="size-7 text-primary" />
                  <span className="font-heading text-2xl font-semibold text-muted-foreground/40">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="font-heading text-sm font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-xs/relaxed text-muted-foreground">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-border bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:max-w-xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-teal uppercase">
              Requirements
            </p>
            <h2 className="font-heading text-[clamp(1.75rem,1.5rem+1.2vw,2.75rem)] font-semibold tracking-tight text-foreground">
              What to bring, by level
            </h2>
            <p className="text-sm/relaxed text-muted-foreground">
              A general guide &mdash; our admissions team will confirm the exact
              documents for your child during your campus visit.
            </p>
          </div>

          <Tabs defaultValue="early-years" className="mt-10">
            <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
              {requirementsByLevel.map((level) => (
                <TabsTrigger
                  key={level.value}
                  value={level.value}
                  className="border border-border bg-card px-3 py-2 text-xs data-active:bg-primary data-active:text-primary-foreground"
                >
                  {level.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {requirementsByLevel.map((level) => (
              <TabsContent key={level.value} value={level.value} className="mt-6">
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {level.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 border border-border bg-card px-4 py-3 text-xs text-foreground"
                    >
                      <ClipboardCheck className="mt-0.5 size-4 shrink-0 text-teal" />
                      {item}
                    </li>
                  ))}
                </ul>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold tracking-[0.2em] text-teal uppercase">
              Start Now
            </p>
            <h2 className="mt-3 font-heading text-[clamp(1.75rem,1.5rem+1.2vw,2.75rem)] font-semibold tracking-tight text-foreground">
              Admissions Inquiry Form
            </h2>
            <p className="mt-3 max-w-xl text-sm/relaxed text-muted-foreground">
              Tell us about your child and we&rsquo;ll reach out to arrange a
              campus visit.
            </p>
            <div className="mt-8">
              <AdmissionInquiryForm />
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            <div className="border border-border bg-ink p-6 text-ink-foreground">
              <h3 className="font-heading text-base font-semibold">
                Prefer to talk to someone?
              </h3>
              <p className="mt-2 text-xs/relaxed text-ink-foreground/75">
                Our admissions office is happy to answer questions directly.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <a
                  href={`https://wa.me/${siteConfig.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gold px-3.5 py-2.5 text-xs font-semibold text-gold-foreground hover:bg-gold/85"
                >
                  <WhatsAppIcon className="size-4" />
                  WhatsApp Us
                </a>
                <a
                  href={`tel:${siteConfig.phoneHref}`}
                  className="inline-flex items-center gap-2 border border-white/20 px-3.5 py-2.5 text-xs font-medium hover:bg-white/10"
                >
                  <Phone className="size-4" />
                  {siteConfig.phoneDisplay}
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex items-center gap-2 border border-white/20 px-3.5 py-2.5 text-xs font-medium hover:bg-white/10"
                >
                  <Mail className="size-4" />
                  {siteConfig.email}
                </a>
              </div>
            </div>

            <div className="border border-border bg-muted/40 p-6">
              <h3 className="font-heading text-sm font-semibold text-foreground">
                Good to know
              </h3>
              <ul className="mt-3 flex flex-col gap-2.5 text-xs/relaxed text-muted-foreground">
                <li>Rolling admissions across three terms.</li>
                <li>Assessments are age-appropriate and stress-free.</li>
                <li>Special Needs Education places are available at every level.</li>
                <li>Sibling and staff-family inquiries are welcome.</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
