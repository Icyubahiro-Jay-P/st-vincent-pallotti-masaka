import { Hero } from "@/components/home/hero"
import { ProgramsGrid } from "@/components/programs-grid"
import { Pathway } from "@/components/home/pathway"
import { WhyPallotti } from "@/components/home/why-pallotti"
import { NewsTeaser } from "@/components/home/news-teaser"
import { CtaBand } from "@/components/home/cta-band"

export default function Page() {
  return (
    <>
      <Hero />
      <ProgramsGrid
        eyebrow="What We Offer"
        title="One campus, every stage of the journey"
        description="Seven programs under one roof, from a child's first day of care through to a trade certificate or university placement."
      />
      <Pathway />
      <WhyPallotti />
      <NewsTeaser />
      <CtaBand />
    </>
  )
}
