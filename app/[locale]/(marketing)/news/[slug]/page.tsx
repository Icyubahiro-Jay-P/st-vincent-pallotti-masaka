import type { Metadata } from "next"
import Link from "@/components/locale-link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

import { Breadcrumb } from "@/components/breadcrumb"
import { JsonLd } from "@/components/json-ld"
import { EventGallery } from "@/components/news/event-gallery"
import { PageHero } from "@/components/page-hero"
import { Badge } from "@/components/ui/badge"
import { getPublishedEventBySlug, getEventMedia } from "@/lib/events"
import { getLocale } from "@/lib/i18n/get-locale"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { cloudinaryUrl } from "@/lib/media/cloudinary-url"
import { localeAlternates, localeUrl, ogImages } from "@/lib/i18n/alternates"
import { siteConfig } from "@/lib/site-config"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const event = await getPublishedEventBySlug(slug)
  if (!event) return {}

  const locale = await getLocale()
  const isFrench = locale === "fr"
  const title = isFrench ? event.titleFr : event.titleEn
  const description = isFrench ? event.excerptFr : event.excerptEn
  const url = await localeUrl(`/news/${slug}`)
  return {
    title,
    description,
    alternates: await localeAlternates(`/news/${slug}`),
    openGraph: {
      title,
      description,
      url,
      images: event.coverImageUrl
        ? [cloudinaryUrl(event.coverImageUrl, 1200)]
        : await ogImages(),
    },
  }
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const event = await getPublishedEventBySlug(slug)

  if (!event) {
    notFound()
  }

  const locale = await getLocale()
  const dict = getDictionary(locale)
  const isFrench = locale === "fr"
  const title = isFrench ? event.titleFr : event.titleEn
  const body = isFrench ? event.bodyFr : event.bodyEn

  const media = await getEventMedia(event.id)
  // Cover leads the slideshow instead of sitting above the body on its own.
  const photos = [
    ...(event.coverImageUrl
      ? [{ id: "cover", cloudinaryUrl: event.coverImageUrl }]
      : []),
    ...media.filter((item) => item.kind === "photo"),
  ]
  const videos = media.filter((item) => item.kind === "video")

  const school = {
    "@type": "EducationalOrganization",
    name: siteConfig.name,
    url: await localeUrl("/"),
    logo: `${siteConfig.url}/badge.jpg`,
  }
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description: isFrench ? event.excerptFr : event.excerptEn,
    // Already ISO strings: lib/events.ts serializes dates for unstable_cache.
    datePublished: event.publishedAt ?? event.createdAt,
    dateModified: event.updatedAt,
    ...(photos.length > 0 && {
      image: photos.map((photo) => cloudinaryUrl(photo.cloudinaryUrl, 1200)),
    }),
    author: school,
    publisher: school,
    mainEntityOfPage: `${siteConfig.url}/${locale}/news/${slug}`,
    inLanguage: locale,
  }

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <PageHero eyebrow={event.category} title={title} />
      <Breadcrumb
        items={[
          { label: dict.nav.home, href: "/" },
          { label: dict.nav.news, href: "/news" },
          { label: title, href: `/news/${slug}` },
        ]}
      />

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/news"
            className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            {dict.news.backToNews}
          </Link>
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

          <div className="mt-8 flex flex-col gap-4 text-sm/relaxed text-muted-foreground">
            {body.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {(photos.length > 0 || videos.length > 0) && (
            <div className="mt-10">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                {dict.news.galleryHeading}
              </h2>
              {photos.length > 0 && (
                <div className="mt-4">
                  <EventGallery
                    photos={photos}
                    alt={title}
                    labels={{
                      carousel: dict.news.galleryCarousel,
                      prev: dict.news.galleryPrev,
                      next: dict.news.galleryNext,
                      goTo: dict.news.galleryGoTo,
                      slideOf: dict.news.gallerySlideOf,
                    }}
                  />
                </div>
              )}
              {videos.length > 0 && (
                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {videos.map((video) => (
                    <video
                      key={video.id}
                      controls
                      className="aspect-video w-full border border-border object-cover"
                    >
                      <source src={video.cloudinaryUrl} />
                    </video>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
