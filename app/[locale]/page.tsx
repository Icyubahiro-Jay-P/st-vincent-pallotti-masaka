import { Hero } from "@/components/home/hero"
import { ProgramsGrid } from "@/components/programs-grid"
import { Pathway } from "@/components/home/pathway"
import { WhyPallotti } from "@/components/home/why-pallotti"
import { NewsTeaser } from "@/components/home/news-teaser"
import { CtaBand } from "@/components/home/cta-band"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import type { Locale } from "@/lib/i18n/config"

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const dict = getDictionary(locale)

  return (
    <>
      <Hero locale={locale} dict={dict} />
      <ProgramsGrid
        locale={locale}
        dict={dict}
        eyebrow={dict.home.programs.eyebrow}
        title={dict.home.programs.title}
        description={dict.home.programs.description}
      />
      <Pathway dict={dict} />
      <WhyPallotti dict={dict} />
      <NewsTeaser locale={locale} dict={dict} />
      <CtaBand locale={locale} dict={dict} />
    </>
  )
}
