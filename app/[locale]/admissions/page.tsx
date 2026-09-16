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
import { getDictionary } from "@/lib/i18n/get-dictionary"
import type { Locale } from "@/lib/i18n/config"

const processIcons = [UserPlus, CalendarCheck2, FileCheck2, ClipboardCheck] as const

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const dict = getDictionary(locale)
  return { title: dict.meta.admissions.title, description: dict.meta.admissions.description }
}

export default async function AdmissionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ program?: string }>
}) {
  const { locale } = await params
  const { program } = await searchParams
  const dict = getDictionary(locale)
  const ad = dict.admissions

  return (
    <>
      <PageHero
        eyebrow={ad.hero.eyebrow}
        title={ad.hero.title}
        description={ad.hero.description}
      />

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:max-w-xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-teal uppercase">
              {ad.process.eyebrow}
            </p>
            <h2 className="font-heading text-[clamp(1.75rem,1.5rem+1.2vw,2.75rem)] font-semibold tracking-tight text-foreground">
              {ad.process.title}
            </h2>
          </div>

          <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ad.process.steps.map((step, index) => {
              const Icon = processIcons[index]
              return (
                <li
                  key={step.title}
                  className="flex flex-col gap-4 border border-border bg-card p-6"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="size-7 text-primary" />
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
              )
            })}
          </ol>
        </div>
      </section>

      <section className="border-b border-border bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:max-w-xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-teal uppercase">
              {ad.requirements.eyebrow}
            </p>
            <h2 className="font-heading text-[clamp(1.75rem,1.5rem+1.2vw,2.75rem)] font-semibold tracking-tight text-foreground">
              {ad.requirements.title}
            </h2>
            <p className="text-sm/relaxed text-muted-foreground">
              {ad.requirements.description}
            </p>
          </div>

          <Tabs defaultValue={ad.requirements.levels[0].value} className="mt-10">
            <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
              {ad.requirements.levels.map((level) => (
                <TabsTrigger
                  key={level.value}
                  value={level.value}
                  className="border border-border bg-card px-3 py-2 text-xs data-active:bg-primary data-active:text-primary-foreground"
                >
                  {level.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {ad.requirements.levels.map((level) => (
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
              {ad.form.eyebrow}
            </p>
            <h2 className="mt-3 font-heading text-[clamp(1.75rem,1.5rem+1.2vw,2.75rem)] font-semibold tracking-tight text-foreground">
              {ad.form.title}
            </h2>
            <p className="mt-3 max-w-xl text-sm/relaxed text-muted-foreground">
              {ad.form.description}
            </p>
            <div className="mt-8">
              <AdmissionInquiryForm locale={locale} dict={dict} defaultProgram={program} />
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            <div className="border border-border bg-ink p-6 text-ink-foreground">
              <h3 className="font-heading text-base font-semibold">
                {ad.sidebar.talkTitle}
              </h3>
              <p className="mt-2 text-xs/relaxed text-ink-foreground/75">
                {ad.sidebar.talkParagraph}
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <a
                  href={`https://wa.me/${siteConfig.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gold px-3.5 py-2.5 text-xs font-semibold text-gold-foreground hover:bg-gold/85"
                >
                  <WhatsAppIcon className="size-4" />
                  {ad.sidebar.whatsapp}
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
                {ad.sidebar.goodToKnowTitle}
              </h3>
              <ul className="mt-3 flex flex-col gap-2.5 text-xs/relaxed text-muted-foreground">
                {ad.sidebar.goodToKnow.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
