import type { Metadata } from "next"
import Link from "next/link"
import { Mail, MapPin, Phone, Clock, ArrowRight } from "lucide-react"

import { PageHero } from "@/components/page-hero"
import { Button } from "@/components/ui/button"
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon"
import {
  InstagramGlyph,
  YoutubeGlyph,
  FacebookGlyph,
} from "@/components/icons/social-icons"
import { siteConfig, socialLinks } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Saint Vincent Pallotti School Masaka: phone, WhatsApp, email and campus location in Masaka, Kigali.",
}

const contactCards = [
  {
    icon: Phone,
    label: "Call Us",
    value: siteConfig.phoneDisplay,
    href: `tel:${siteConfig.phoneHref}`,
  },
  {
    icon: WhatsAppIcon,
    label: "WhatsApp",
    value: "Chat with Admissions",
    href: `https://wa.me/${siteConfig.whatsappNumber}`,
  },
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
  {
    icon: MapPin,
    label: "Visit Us",
    value: siteConfig.location,
    href: siteConfig.mapsQuery,
  },
] as const

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="We'd Love to Hear From You"
        description="Call, WhatsApp, email or visit our campus in Masaka, Kigali, whichever is easiest for your family."
      />

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {contactCards.map((card) => (
              <a
                key={card.label}
                href={card.href}
                target={card.href.startsWith("http") ? "_blank" : undefined}
                rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex flex-col gap-4 bg-card p-6 transition-colors hover:bg-muted"
              >
                <card.icon className="size-7 text-primary" />
                <div>
                  <p className="text-[0.7rem] font-semibold tracking-[0.15em] text-muted-foreground uppercase">
                    {card.label}
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground group-hover:text-primary">
                    {card.value}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-teal uppercase">
              Find Us
            </p>
            <h2 className="mt-3 font-heading text-[clamp(1.75rem,1.5rem+1.2vw,2.5rem)] font-semibold tracking-tight text-foreground">
              Masaka, Kigali, Rwanda
            </h2>
            <p className="mt-4 max-w-md text-sm/relaxed text-muted-foreground">
              Our campus sits in Masaka, on the outskirts of Kigali. Tap the
              map to open directions in Google Maps.
            </p>
            <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6">
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-teal" />
                <div>
                  <p className="text-sm font-medium text-foreground">Office Hours</p>
                  <p className="text-xs text-muted-foreground">
                    Monday &ndash; Friday, 7:30 AM &ndash; 4:30 PM
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex size-9 items-center justify-center border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <InstagramGlyph className="size-4" />
              </a>
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex size-9 items-center justify-center border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <YoutubeGlyph className="size-4" />
              </a>
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex size-9 items-center justify-center border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <FacebookGlyph className="size-4" />
              </a>
            </div>
            <Button
              size="lg"
              render={<Link href="/admissions" />}
              className="mt-8 h-11 px-6 text-sm"
            >
              Go to Admissions
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>

          <div className="aspect-4/3 overflow-hidden border border-border bg-card lg:aspect-auto">
            <iframe
              title="Map showing Saint Vincent Pallotti School Masaka"
              src="https://www.google.com/maps?q=Saint+Vincent+Pallotti+School+Masaka,+Kigali,+Rwanda&output=embed"
              className="h-full min-h-[320px] w-full grayscale-[15%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  )
}
