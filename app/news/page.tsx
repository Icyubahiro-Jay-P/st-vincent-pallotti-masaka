import type { Metadata } from "next"

import { PageHero } from "@/components/page-hero"
import { Badge } from "@/components/ui/badge"
import { InstagramGlyph, YoutubeGlyph } from "@/components/icons/social-icons"
import { newsItems, socialLinks } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "News & School Life",
  description:
    "News, achievements and school life updates from Saint Vincent Pallotti School Masaka.",
}

export default function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="School Life"
        title="News & Updates"
        description="What's happening on campus: academics, TVET and community life at Pallotti."
      />

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8">
            {newsItems.map((item) => (
              <article
                key={item.slug}
                id={item.slug}
                className="scroll-mt-24 border border-border bg-card p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="uppercase">{item.category}</Badge>
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
                <h2 className="mt-4 font-heading text-xl font-semibold text-foreground sm:text-2xl">
                  {item.title}
                </h2>
                <p className="mt-3 max-w-2xl text-sm/relaxed text-muted-foreground">
                  {item.excerpt}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] text-teal uppercase">
            Follow Along
          </p>
          <h2 className="font-heading text-[clamp(1.5rem,1.3rem+1vw,2.25rem)] font-semibold tracking-tight text-foreground">
            More school life on Instagram &amp; YouTube
          </h2>
          <div className="flex items-center gap-3">
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <InstagramGlyph className="size-4" />
              Instagram
            </a>
            <a
              href={socialLinks.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <YoutubeGlyph className="size-4" />
              YouTube
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
