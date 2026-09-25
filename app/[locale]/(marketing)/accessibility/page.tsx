import type { Metadata } from "next"

import { PageHero } from "@/components/page-hero"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"
import { localeAlternates, localeUrl, ogImages } from "@/lib/i18n/alternates"
import { siteConfig } from "@/lib/site-config"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  const url = await localeUrl("/accessibility")
  return {
    title: dict.meta.accessibility.title,
    description: dict.meta.accessibility.description,
    alternates: await localeAlternates("/accessibility"),
    openGraph: {
      title: dict.meta.accessibility.title,
      description: dict.meta.accessibility.description,
      url,
      images: await ogImages(),
    },
  }
}

// Kept in English only, deliberately: same reasoning as the privacy policy
// and terms of service pages this mirrors.
const EFFECTIVE_DATE = "22 September 2026"

export default async function AccessibilityPage() {
  const locale = await getLocale()
  const dict = getDictionary(locale)

  return (
    <>
      <PageHero
        eyebrow={dict.meta.accessibility.title}
        title="Accessibility Statement"
        description={`Effective ${EFFECTIVE_DATE}`}
      />

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Prose>
            <p>
              Saint Vincent Pallotti School Masaka wants this website (
              {siteConfig.url}) to be usable by as many people as possible,
              including people using assistive technology such as screen readers
              or keyboard-only navigation.
            </p>

            <H2>1. Our target</H2>
            <p>
              We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1
              at Level AA. This is a target we are working towards, not a claim
              of full or certified compliance: some pages or features may not
              yet fully meet every guideline.
            </p>

            <H2>2. What we have done so far</H2>
            <ul>
              <li>
                A skip-to-content link for keyboard and screen reader users.
              </li>
              <li>
                Keyboard-navigable forms, including the admissions inquiry form.
              </li>
              <li>Alt text on informational images.</li>
              <li>
                Semantic HTML landmarks (header, main, footer, navigation)
                throughout the site.
              </li>
            </ul>
            <p>
              Accessibility is an ongoing process, and we continue to review and
              improve the site as we find issues.
            </p>

            <H2>3. Known limitations</H2>
            <p>
              Some third-party embeds we link to (for example Google Maps,
              Instagram, YouTube, WhatsApp) are outside our control and may not
              meet the same accessibility standard as the rest of this site.
            </p>

            <H2>4. Reporting an issue</H2>
            <p>
              If you have trouble accessing any part of this website, please
              tell us so we can fix it. Contact us at{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or{" "}
              {siteConfig.phoneDisplay}, and include the page you were on and
              the device or assistive technology you were using, if possible.
            </p>

            <H2>5. Changes to this statement</H2>
            <p>
              We may update this statement from time to time as the site
              changes. Changes will be posted on this page with a new effective
              date above.
            </p>
          </Prose>
        </div>
      </section>
    </>
  )
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-10 font-heading text-xl font-semibold text-foreground first:mt-0">
      {children}
    </h2>
  )
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 text-sm/relaxed text-muted-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mb-3 [&_h2]:text-foreground [&_li]:ml-5 [&_li]:list-disc [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2">
      {children}
    </div>
  )
}
