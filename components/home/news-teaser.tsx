import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  InstagramGlyph,
  YoutubeGlyph,
  XLogo,
} from "@/components/icons/social-icons"
import type { Dictionary } from "@/lib/i18n/get-dictionary"
import type { Locale } from "@/lib/i18n/config"
import type { getLatestPublishedEvents } from "@/lib/events"

type Event = Awaited<ReturnType<typeof getLatestPublishedEvents>>[number]

export function NewsTeaser({
  dict,
  locale,
  events,
  instagramUrl,
  youtubeUrl,
  xUrl,
}: {
  dict: Dictionary
  locale: Locale
  events: Event[]
  instagramUrl: string
  youtubeUrl: string
  xUrl: string | null
}) {
  const n = dict.home.news
  const isFrench = locale === "fr"

  return (
    <section className="border-t border-border bg-muted/40 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-3 sm:max-w-xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-teal uppercase">
              {n.eyebrow}
            </p>
            <h2 className="font-heading text-[clamp(1.75rem,1.5rem+1.2vw,2.75rem)] font-semibold tracking-tight text-foreground">
              {n.title}
            </h2>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-primary uppercase hover:underline"
          >
            {n.viewAll}
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {events.map((event) => (
            <Link
              key={event.slug}
              href={`/news/${event.slug}`}
              className="group flex flex-col gap-4 border border-border bg-card p-6 transition-colors hover:border-primary"
            >
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="uppercase">
                  {event.category}
                </Badge>
                <span className="text-[0.7rem] text-muted-foreground">
                  {new Date(
                    event.publishedAt ?? event.createdAt
                  ).toLocaleDateString(isFrench ? "fr-RW" : "en-RW", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-primary">
                {isFrench ? event.titleFr : event.titleEn}
              </h3>
              <p className="text-xs/relaxed text-muted-foreground">
                {isFrench ? event.excerptFr : event.excerptEn}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">{n.followText}</p>
          <div className="flex items-center gap-3">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <InstagramGlyph className="size-4" />
              @saintvincentpallottimasaka
            </a>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-border p-2 text-foreground transition-colors hover:border-primary hover:text-primary"
              aria-label={n.youtubeAriaLabel}
            >
              <YoutubeGlyph className="size-4" />
            </a>
            {xUrl && (
              <a
                href={xUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center border border-border p-2 text-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="X"
              >
                <XLogo className="size-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
