import { Building2, Award, Church, HeartHandshake } from "lucide-react"

import { WhatsAppIcon } from "@/components/icons/whatsapp-icon"

import type { Dictionary } from "@/lib/i18n/get-dictionary"

const icons = [Building2, Award, Church, HeartHandshake] as const
const sizes = ["lg", "sm", "sm", "sm"] as const

export function WhyPallotti({
  dict,
  whatsappNumber,
}: {
  dict: Dictionary
  whatsappNumber: string
}) {
  const w = dict.home.why

  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:max-w-xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-teal uppercase">
            {w.eyebrow}
          </p>
          <h2 className="font-heading text-[clamp(1.75rem,1.5rem+1.2vw,2.75rem)] font-semibold tracking-tight text-foreground">
            {w.title}
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {w.features.map((feature, index) => {
            const Icon = icons[index]
            const size = sizes[index]
            return (
              <div
                key={feature.title}
                className={
                  size === "lg"
                    ? "flex flex-col gap-6 bg-ink p-8 text-ink-foreground lg:col-span-2 lg:row-span-2"
                    : "flex flex-col gap-4 bg-card p-6"
                }
              >
                <Icon
                  aria-hidden="true"
                  className={
                    size === "lg" ? "size-9 text-gold" : "size-7 text-primary"
                  }
                />
                <div>
                  <h3
                    className={
                      size === "lg"
                        ? "font-heading text-2xl font-semibold"
                        : "font-heading text-base font-semibold text-foreground"
                    }
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={
                      size === "lg"
                        ? "mt-3 text-sm/relaxed text-ink-foreground/75"
                        : "mt-2 text-xs/relaxed text-muted-foreground"
                    }
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
          {/* Fills the one cell the 2x2 feature leaves empty on desktop; the
              1- and 2-column layouts are already full without it. */}
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              dict.whatsapp.bookTourMessage
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group hidden flex-col gap-4 bg-muted p-6 transition-colors hover:bg-accent lg:flex"
          >
            <WhatsAppIcon className="size-7 text-primary" />
            <div>
              <h3 className="font-heading text-base font-semibold text-foreground">
                {w.visitCard.title}
              </h3>
              <p className="mt-2 text-xs/relaxed text-muted-foreground">
                {w.visitCard.description}
              </p>
            </div>
            <span className="mt-auto text-xs font-semibold tracking-wide text-primary uppercase group-hover:underline">
              {dict.whatsapp.bookTourLabel}
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
