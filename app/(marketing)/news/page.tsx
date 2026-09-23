import type { Metadata } from "next"
import Link from "next/link"

import { PageHero } from "@/components/page-hero"
import { Badge } from "@/components/ui/badge"
import { PaginationNav } from "@/components/pagination-nav"
import { SubscribeForm } from "@/components/newsletter/subscribe-form"
import {
  FacebookGlyph,
  InstagramGlyph,
  YoutubeGlyph,
  XLogo,
} from "@/components/icons/social-icons"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"
import { getSiteSettings } from "@/lib/site-settings"
import { getPublishedEventsPage } from "@/lib/events"
import { parsePage, totalPages } from "@/lib/pagination"
import { siteConfig } from "@/lib/site-config"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  return {
    title: dict.meta.news.title,
    description: dict.meta.news.description,
    alternates: { canonical: `${siteConfig.url}/news` },
    openGraph: {
      title: dict.meta.news.title,
      description: dict.meta.news.description,
      url: `${siteConfig.url}/news`,
    },
  }
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  const n = dict.news
  const isFrench = locale === "fr"

  const page = parsePage((await searchParams).page)

  const [{ rows: publishedEvents, total }, settings] = await Promise.all([
    getPublishedEventsPage(page),
    getSiteSettings(),
  ])
  const pages = totalPages(total)

  return (
    <>
      <PageHero
        eyebrow={n.hero.eyebrow}
        title={n.hero.title}
        description={n.hero.description}
      />

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8">
            {publishedEvents.map((event) => (
              <Link
                key={event.slug}
                href={`/news/${event.slug}`}
                className="block scroll-mt-24 border border-border bg-card p-6 transition-colors hover:border-primary sm:p-8"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="uppercase">{event.category}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(
                      event.publishedAt ?? event.createdAt
                    ).toLocaleDateString(isFrench ? "fr-RW" : "en-RW", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <h2 className="mt-4 font-heading text-xl font-semibold text-foreground sm:text-2xl">
                  {isFrench ? event.titleFr : event.titleEn}
                </h2>
                <p className="mt-3 max-w-2xl text-sm/relaxed text-muted-foreground">
                  {isFrench ? event.excerptFr : event.excerptEn}
                </p>
              </Link>
            ))}
            {publishedEvents.length === 0 && (
              <p className="text-sm text-muted-foreground">{n.empty}</p>
            )}
          </div>
          <PaginationNav
            page={page}
            totalPages={pages}
            buildHref={(p) => (p <= 1 ? "/news" : `/news?page=${p}`)}
          />
        </div>
      </section>

      <section className="bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] text-teal uppercase">
            {n.follow.eyebrow}
          </p>
          <h2 className="font-heading text-[clamp(1.5rem,1.3rem+1vw,2.25rem)] font-semibold tracking-tight text-foreground">
            {n.follow.title}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <InstagramGlyph className="size-4" />
              {n.follow.instagram}
            </a>
            <a
              href={settings.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <YoutubeGlyph className="size-4" />
              {n.follow.youtube}
            </a>
            <a
              href={settings.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <FacebookGlyph className="size-4" />
              {n.follow.facebook}
            </a>
            {settings.xUrl && (
              <a
                href={settings.xUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <XLogo className="size-4" />X
              </a>
            )}
          </div>
          <div className="w-full max-w-sm pt-4">
            <SubscribeForm dict={dict} />
          </div>
        </div>
      </section>
    </>
  )
}
