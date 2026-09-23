"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cloudinaryLoader } from "@/lib/media/cloudinary-url"
import { cn } from "@/lib/utils"

// id is a string for the cover, which isn't an event_media row.
type Photo = { id: number | string; cloudinaryUrl: string }

type Labels = {
  carousel: string
  prev: string
  next: string
  // "{n}" is replaced with the slide number
  goTo: string
  // "{n}" and "{total}" are replaced
  slideOf: string
}

const AUTOPLAY_MS = 5000
const SIZES = "(min-width: 1024px) 768px, 100vw"

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)")
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange)
  return () => document.removeEventListener("visibilitychange", onChange)
}

export function EventGallery({
  photos,
  alt,
  labels,
}: {
  photos: Photo[]
  alt: string
  labels: Labels
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [touching, setTouching] = useState(false)

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true
  )
  const hidden = useSyncExternalStore(
    subscribeVisibility,
    () => document.hidden,
    () => true
  )

  const count = photos.length
  const autoplay =
    count > 1 && !reducedMotion && !hidden && !hovered && !focused && !touching

  function goTo(i: number) {
    const track = trackRef.current
    if (!track) return
    track.scrollTo({
      left: i * track.clientWidth,
      behavior: reducedMotion ? "auto" : "smooth",
    })
  }

  // Timer restarts on every slide change, so manual navigation or a swipe
  // also gives the new slide a full 5s.
  useEffect(() => {
    if (!autoplay) return
    const id = setTimeout(() => {
      const track = trackRef.current
      if (!track) return
      track.scrollTo({
        left: ((index + 1) % count) * track.clientWidth,
        behavior: "smooth",
      })
    }, AUTOPLAY_MS)
    return () => clearTimeout(id)
  }, [autoplay, index, count])

  if (count === 0) return null

  if (count === 1) {
    return (
      <div className="relative aspect-video w-full overflow-hidden border border-border">
        <Image
          src={photos[0].cloudinaryUrl}
          alt={alt}
          fill
          priority
          loader={cloudinaryLoader}
          className="object-cover"
          sizes={SIZES}
        />
      </div>
    )
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label={labels.carousel}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false)
      }}
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse") setTouching(true)
      }}
      onPointerUp={() => setTouching(false)}
      onPointerCancel={() => setTouching(false)}
    >
      <div className="relative">
        <div
          ref={trackRef}
          aria-live={autoplay ? "off" : "polite"}
          onScroll={(e) => {
            const track = e.currentTarget
            setIndex(Math.round(track.scrollLeft / track.clientWidth))
          }}
          className="flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto border border-border [&::-webkit-scrollbar]:hidden"
        >
          {photos.map((photo, i) => (
            <div
              key={photo.id}
              role="group"
              aria-roledescription="slide"
              aria-label={labels.slideOf
                .replace("{n}", String(i + 1))
                .replace("{total}", String(count))}
              className="relative aspect-video w-full shrink-0 snap-center"
            >
              <Image
                src={photo.cloudinaryUrl}
                alt={alt}
                fill
                priority={i === 0}
                loader={cloudinaryLoader}
                className="object-cover"
                sizes={SIZES}
              />
            </div>
          ))}
        </div>

        <Button
          variant="secondary"
          size="icon"
          aria-label={labels.prev}
          onClick={() => goTo((index - 1 + count) % count)}
          className="absolute top-1/2 left-2 -translate-y-1/2 opacity-90"
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          aria-label={labels.next}
          onClick={() => goTo((index + 1) % count)}
          className="absolute top-1/2 right-2 -translate-y-1/2 opacity-90"
        >
          <ChevronRight />
        </Button>
      </div>

      <div className="mt-2 flex flex-wrap justify-center gap-1">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            aria-label={labels.goTo.replace("{n}", String(i + 1))}
            aria-current={i === index ? "true" : undefined}
            onClick={() => goTo(i)}
            className="group/dot p-1.5 outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            <span
              className={cn(
                "block size-2.5 border border-foreground/40 transition-colors",
                i === index
                  ? "bg-primary"
                  : "bg-transparent group-hover/dot:bg-muted"
              )}
            />
          </button>
        ))}
      </div>
    </section>
  )
}
