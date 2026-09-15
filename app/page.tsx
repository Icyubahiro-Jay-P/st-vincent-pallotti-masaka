import { Hero } from "@/components/home/hero"
import { ProgramsGrid } from "@/components/home/programs-grid"
import { Pathway } from "@/components/home/pathway"
import { WhyPallotti } from "@/components/home/why-pallotti"
import { NewsTeaser } from "@/components/home/news-teaser"
import { CtaBand } from "@/components/home/cta-band"

export default function Page() {
  return (
    <>
      <Hero />
      <ProgramsGrid />
      <Pathway />
      <WhyPallotti />
      <NewsTeaser />
      <CtaBand />
    </>
  )
}
