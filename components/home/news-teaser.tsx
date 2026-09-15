import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { InstagramGlyph, YoutubeGlyph } from "@/components/icons/social-icons"
import { newsItems, socialLinks } from "@/lib/site-config"

export function NewsTeaser() {
  return (
    <section className="border-t border-border bg-muted/40 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-3 sm:max-w-xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-teal uppercase">
              School Life
            </p>
            <h2 className="font-heading text-[clamp(1.75rem,1.5rem+1.2vw,2.75rem)] font-semibold tracking-tight text-foreground">
              Latest from Pallotti
            </h2>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-primary uppercase hover:underline"
          >
            View all news
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {newsItems.map((item) => (
            <Link
              key={item.slug}
              href={`/news#${item.slug}`}
              className="group flex flex-col gap-4 border border-border bg-card p-6 transition-colors hover:border-primary"
            >
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="uppercase">
                  {item.category}
                </Badge>
                <span className="text-[0.7rem] text-muted-foreground">
                  {item.date}
                </span>
              </div>
              <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-primary">
                {item.title}
              </h3>
              <p className="text-xs/relaxed text-muted-foreground">
                {item.excerpt}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            Follow daily life on campus on Instagram and YouTube.
          </p>
          <div className="flex items-center gap-3">
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <InstagramGlyph className="size-4" />
              @saintvincentpallottimasaka
            </a>
            <a
              href={socialLinks.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-border p-2 text-foreground transition-colors hover:border-primary hover:text-primary"
              aria-label="YouTube"
            >
              <YoutubeGlyph className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
