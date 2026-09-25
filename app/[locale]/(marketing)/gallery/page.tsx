import type { Metadata } from "next"
import Image from "next/image"
import Link from "@/components/locale-link"

import { PageHero } from "@/components/page-hero"
import { PaginationNav } from "@/components/pagination-nav"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"
import { getPublishedPhotosPage } from "@/lib/events"
import { cloudinaryUrl } from "@/lib/media/cloudinary-url"
import { parsePage, totalPages } from "@/lib/pagination"
import { localeAlternates, localeUrl, ogImages } from "@/lib/i18n/alternates"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  return {
    title: dict.meta.gallery.title,
    description: dict.meta.gallery.description,
    alternates: await localeAlternates("/gallery"),
    openGraph: {
      title: dict.meta.gallery.title,
      description: dict.meta.gallery.description,
      url: await localeUrl("/gallery"),
      images: await ogImages(),
    },
  }
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const locale = await getLocale()
  const g = getDictionary(locale).gallery
  const isFrench = locale === "fr"

  const page = parsePage((await searchParams).page)
  const { rows: photos, total } = await getPublishedPhotosPage(page)

  return (
    <>
      <PageHero
        eyebrow={g.hero.eyebrow}
        title={g.hero.title}
        description={g.hero.description}
      />

      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {photos.length === 0 ? (
            <p className="text-sm text-muted-foreground">{g.empty}</p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {photos.map((photo) => (
                <li key={photo.id}>
                  <Link
                    href={`/news/${photo.slug}`}
                    className="group relative block aspect-square overflow-hidden border border-border bg-muted transition-colors hover:border-primary"
                  >
                    {/* Originals can be HEIC, which the Next optimizer can't
                        decode, so Cloudinary converts and resizes instead. */}
                    <Image
                      src={cloudinaryUrl(photo.url, 640)}
                      unoptimized
                      alt={isFrench ? photo.titleFr : photo.titleEn}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <PaginationNav
            page={page}
            totalPages={totalPages(total)}
            buildHref={(p) => (p <= 1 ? "/gallery" : `/gallery?page=${p}`)}
          />
        </div>
      </section>
    </>
  )
}
