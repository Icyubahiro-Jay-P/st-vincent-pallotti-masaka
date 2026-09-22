import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"

import { PageHero } from "@/components/page-hero"
import { Badge } from "@/components/ui/badge"
import { getPublishedEventBySlug, getEventMedia } from "@/lib/events"
import { getLocale } from "@/lib/i18n/get-locale"
import { getDictionary } from "@/lib/i18n/get-dictionary"
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
  const url = `${siteConfig.url}/news/${slug}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
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
  const photos = media.filter((item) => item.kind === "photo")
  const videos = media.filter((item) => item.kind === "video")

  return (
    <>
      <PageHero eyebrow={event.category} title={title} />

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
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

          {event.coverImageUrl && (
            <div className="relative mt-6 aspect-video w-full overflow-hidden border border-border">
              <Image
                src={event.coverImageUrl}
                alt={title}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 768px, 100vw"
              />
            </div>
          )}

          <div className="mt-8 flex flex-col gap-4 text-sm/relaxed text-muted-foreground">
            {body.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {photos.length > 0 && (
            <div className="mt-10">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                {dict.news.galleryHeading}
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {photos.map((photo) => (
                  <a
                    key={photo.id}
                    href={photo.cloudinaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative aspect-video w-full overflow-hidden border border-border"
                  >
                    <Image
                      src={photo.cloudinaryUrl}
                      alt={title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 640px) 33vw, 50vw"
                    />
                  </a>
                ))}
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
            </div>
          )}
        </div>
      </section>
    </>
  )
}
