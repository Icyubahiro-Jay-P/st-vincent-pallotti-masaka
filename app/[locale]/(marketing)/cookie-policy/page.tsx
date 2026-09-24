import type { Metadata } from "next"

import { PageHero } from "@/components/page-hero"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"
import { localeAlternates, localeUrl } from "@/lib/i18n/alternates"
import { siteConfig } from "@/lib/site-config"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  const url = await localeUrl("/cookie-policy")
  return {
    title: dict.meta.cookiePolicy.title,
    description: dict.meta.cookiePolicy.description,
    alternates: await localeAlternates("/cookie-policy"),
    openGraph: {
      title: dict.meta.cookiePolicy.title,
      description: dict.meta.cookiePolicy.description,
      url,
    },
  }
}

// Kept in English only, deliberately: same reasoning as the privacy policy
// and terms of service pages this mirrors.
const EFFECTIVE_DATE = "22 September 2026"

export default async function CookiePolicyPage() {
  const locale = await getLocale()
  const dict = getDictionary(locale)

  return (
    <>
      <PageHero
        eyebrow={dict.meta.cookiePolicy.title}
        title="Cookie Policy"
        description={`Effective ${EFFECTIVE_DATE}`}
      />

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Prose>
            <p>
              This page explains the cookies and browser storage used on the
              Saint Vincent Pallotti School Masaka website ({siteConfig.url}
              ), run by the Pallottine Missionary Sisters, Our Lady of Kibeho
              Region. For how we handle personal data more generally, see our{" "}
              <a href={`/${locale}/privacy-policy`}>Privacy Policy</a>.
            </p>

            <H2>1. What we use</H2>
            <ul>
              <li>
                <strong>locale</strong> (cookie) remembers whether you are
                viewing the site in English or French. Set as soon as you pick a
                language or visit the site.
              </li>
              <li>
                <strong>admin session</strong> (cookie) keeps school staff
                signed in to the admin portal. This is only ever set for
                authorized staff accounts, never for site visitors.
              </li>
              <li>
                <strong>theme</strong> (browser local storage, not a cookie)
                remembers your light/dark mode preference on this device.
              </li>
              <li>
                <strong>cookie-consent</strong> (browser local storage, not a
                cookie) remembers the choice you make in the cookie banner so it
                doesn&rsquo;t reappear on every visit.
              </li>
            </ul>
            <p>
              All of the above are strictly necessary for the site to work as
              intended, so they are set regardless of the choice you make in the
              cookie banner.
            </p>

            <H2>2. Analytics</H2>
            <p>
              We use Vercel Analytics and Vercel Speed Insights to understand
              how the site is used and to catch performance problems. These are
              cookieless: they do not set any cookie or persistent identifier on
              your device, and the data they collect is aggregated rather than
              tied to you personally.
            </p>

            <H2>3. No advertising or third-party tracking</H2>
            <p>
              We do not use any advertising network, ad-tracking pixel, or
              third-party marketing script on this website. The only outside
              services this site talks to are the ones listed in our{" "}
              <a href={`/${locale}/privacy-policy`}>Privacy Policy</a>, none of
              which are used for advertising.
            </p>

            <H2>4. Controlling cookies</H2>
            <p>
              You can choose &ldquo;Necessary only&rdquo; in the cookie banner,
              or clear cookies and site data for this website at any time
              through your browser&rsquo;s settings. Because the cookies here
              are strictly necessary, turning them off may affect basic
              functionality such as staying signed in to the admin portal or
              keeping your language preference.
            </p>

            <H2>5. Changes to this policy</H2>
            <p>
              We may update this policy from time to time. Changes will be
              posted on this page with a new effective date above.
            </p>

            <H2>6. Contact us</H2>
            <p>
              Questions about this policy can be sent to{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or{" "}
              {siteConfig.phoneDisplay}.
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
    <div className="flex flex-col gap-4 text-sm/relaxed text-muted-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mb-3 [&_h2]:text-foreground [&_li]:ml-5 [&_li]:list-disc [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2">
      {children}
    </div>
  )
}
