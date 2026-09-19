import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { and, eq } from "drizzle-orm"

import { PageHero } from "@/components/page-hero"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/db"
import { events } from "@/lib/db/schema"
import { getLocale } from "@/lib/i18n/get-locale"

async function getPublishedEventBySlug(slug: string) {
  const [event] = await db
    .select()
    .from(events)
    .where(and(eq(events.slug, slug), eq(events.status, "published")))
  return event
}

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
  return {
    title: isFrench ? event.titleFr : event.titleEn,
    description: isFrench ? event.excerptFr : event.excerptEn,
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
  const isFrench = locale === "fr"
  const title = isFrench ? event.titleFr : event.titleEn
  const body = isFrench ? event.bodyFr : event.bodyEn

  return (
    <>
      <PageHero eyebrow={event.category} title={title} />

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="uppercase">{event.category}</Badge>
            <span className="text-xs text-muted-foreground">
              {(event.publishedAt ?? event.createdAt).toLocaleDateString(
                isFrench ? "fr-RW" : "en-RW",
                { year: "numeric", month: "long", day: "numeric" }
              )}
            </span>
          </div>

          {event.coverImageUrl && (
            <div className="relative mt-6 aspect-video w-full overflow-hidden border border-border">
              <Image
                src={event.coverImageUrl}
                alt={title}
                fill
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
        </div>
      </section>
    </>
  )
}
