import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

import { Crest } from "@/components/crest"
import {
  InstagramGlyph,
  YoutubeGlyph,
  FacebookGlyph,
  XGlyph,
} from "@/components/icons/social-icons"
import { navLinks, programHref, siteConfig } from "@/lib/site-config"
import type { Dictionary } from "@/lib/i18n/get-dictionary"
import type { Locale } from "@/lib/i18n/config"
import { getPublishedPrograms } from "@/lib/programs"
import { getSiteSettings } from "@/lib/site-settings"
import { SubscribeForm } from "@/components/newsletter/subscribe-form"

export async function SiteFooter({
  dict,
  locale,
}: {
  dict: Dictionary
  locale: Locale
}) {
  const [programs, settings] = await Promise.all([
    getPublishedPrograms(locale),
    getSiteSettings(),
  ])
  return (
    <footer className="border-t border-white/20 bg-ink text-ink-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <Crest size={44} />
              <div className="flex flex-col leading-tight">
                <span className="font-heading text-sm font-semibold">
                  St. Vincent Pallotti
                </span>
                <span className="text-[0.65rem] tracking-[0.2em] text-ink-foreground/70 uppercase">
                  School Masaka
                </span>
              </div>
            </div>
            <p className="text-xs/relaxed text-ink-foreground/70">
              &ldquo;{dict.site.spiritualMotto}&rdquo;
              <span className="block italic">
                {settings.spiritualMottoLatin}
              </span>
            </p>
            <div className="flex items-center gap-3 pt-1">
              <SocialLink href={settings.instagramUrl} label="Instagram">
                <InstagramGlyph className="size-4" />
              </SocialLink>
              <SocialLink href={settings.youtubeUrl} label="YouTube">
                <YoutubeGlyph className="size-4" />
              </SocialLink>
              <SocialLink href={settings.facebookUrl} label="Facebook">
                <FacebookGlyph className="size-4" />
              </SocialLink>
              {settings.xUrl && (
                <SocialLink href={settings.xUrl} label="X">
                  <XGlyph className="size-4" />
                </SocialLink>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.15em] text-gold uppercase">
              {dict.footer.exploreHeading}
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    prefetch={false}
                    className="text-xs text-ink-foreground/75 transition-colors hover:text-ink-foreground"
                  >
                    {dict.nav[link.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.15em] text-gold uppercase">
              {dict.footer.programsHeading}
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {programs.slice(0, 5).map((program) => (
                <li key={program.slug}>
                  <Link
                    href={programHref(program.slug)}
                    prefetch={false}
                    className="text-xs text-ink-foreground/75 transition-colors hover:text-ink-foreground"
                  >
                    {program.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.15em] text-gold uppercase">
              {dict.footer.contactHeading}
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-xs text-ink-foreground/75">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-gold" />
                <a
                  href={settings.mapsQuery}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink-foreground"
                >
                  {settings.location}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-3.5 shrink-0 text-gold" />
                <a
                  href={`tel:${settings.phoneHref}`}
                  className="hover:text-ink-foreground"
                >
                  {settings.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-3.5 shrink-0 text-gold" />
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-ink-foreground"
                >
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-white/20 pt-10 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <div className="flex flex-col gap-2">
            <h3 className="font-heading text-xl font-semibold text-ink-foreground sm:text-2xl">
              {dict.newsletter.footerHeading}
            </h3>
            <p className="max-w-sm text-xs/relaxed text-ink-foreground/70">
              {dict.newsletter.footerDescription}
            </p>
          </div>
          <div className="w-full sm:w-auto sm:min-w-88">
            <SubscribeForm dict={dict} />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/20 pt-6 text-[0.7rem] text-ink-foreground/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}.{" "}
            {dict.footer.runByPrefix} {dict.site.foundedBy}.
          </p>
          <p className="tracking-[0.15em] uppercase">{settings.motto}</p>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex size-8 items-center justify-center rounded-full border border-white/15 text-ink-foreground/80 transition-colors hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
    >
      {children}
    </a>
  )
}
