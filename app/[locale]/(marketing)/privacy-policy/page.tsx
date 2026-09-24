import type { Metadata } from "next"

import { PageHero } from "@/components/page-hero"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { localeAlternates } from "@/lib/i18n/alternates"
import { getLocale } from "@/lib/i18n/get-locale"
import { siteConfig } from "@/lib/site-config"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  return {
    title: dict.meta.privacy.title,
    description: dict.meta.privacy.description,
    alternates: await localeAlternates("/privacy-policy"),
  }
}

// Kept in English only, deliberately: this is the canonical legal text, and
// running it through the bilingual dictionary system risks a translation
// drifting from what the school can actually stand behind. The page chrome
// (title, nav/footer labels) is still translated via dict.meta.privacy.
const EFFECTIVE_DATE = "22 September 2026"

export default async function PrivacyPolicyPage() {
  const locale = await getLocale()
  const dict = getDictionary(locale)

  return (
    <>
      <PageHero
        eyebrow={dict.meta.privacy.title}
        title="Privacy Policy"
        description={`Effective ${EFFECTIVE_DATE}`}
      />

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Prose>
            <p>
              Saint Vincent Pallotti School Masaka (&ldquo;the School,&rdquo;
              &ldquo;we,&rdquo; &ldquo;us&rdquo;) is run by the Pallottine
              Missionary Sisters, Our Lady of Kibeho Region, in Masaka, Kigali,
              Rwanda. This policy explains what personal data this website (
              {siteConfig.url}) collects, why, and how it is handled. It applies
              to this website only, not to email, phone, WhatsApp, or in-person
              conversations you have with the School directly.
            </p>

            <H2>1. Information we collect</H2>
            <H3>Admissions inquiries</H3>
            <p>
              When you submit the admissions inquiry form, we collect the
              parent/guardian&rsquo;s name, email address and phone number, the
              child&rsquo;s name, the program you are interested in, your
              preferred intake term, an optional message, and the language you
              submitted the form in. We use this solely to respond to your
              inquiry and process admissions.
            </p>
            <H3>Newsletter</H3>
            <p>
              If you subscribe to our newsletter, we store your email address
              and preferred language so we can send you school news and updates.
              Every email includes an unsubscribe link, and you can also
              unsubscribe at any time at <code>/newsletter/unsubscribe</code>.
            </p>
            <H3>Cookies and local storage</H3>
            <p>
              We use a small number of strictly necessary cookies and one piece
              of browser local storage:
            </p>
            <ul>
              <li>
                <strong>locale</strong> (cookie) remembers whether you are
                viewing the site in English or French.
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
            </ul>
            <p>
              We do <strong>not</strong> use analytics, advertising, or
              third-party tracking cookies of any kind.
            </p>
            <H3>Security and rate-limiting data</H3>
            <p>
              To stop spam and automated abuse of our forms, we briefly record a
              hash of your IP address against the form you submitted. These
              records are automatically deleted after 24 hours and are never
              used for any other purpose, including analytics or profiling.
            </p>

            <H2>2. Why we process this data</H2>
            <p>
              We process the data above to: respond to admissions inquiries;
              send newsletter updates you asked to receive; remember your
              language preference; keep the admin portal secure; and prevent
              abuse of our public forms. We do not use your data for
              advertising, and we do not sell or rent personal data to anyone.
            </p>

            <H2>3. Who we share data with</H2>
            <p>
              We use a small number of service providers to run this website,
              each acting on our instructions:
            </p>
            <ul>
              <li>
                <strong>Vercel</strong> hosts the website and its serverless
                functions.
              </li>
              <li>
                <strong>Neon</strong> hosts our PostgreSQL database, where form
                submissions and site content are stored.
              </li>
              <li>
                <strong>Resend</strong> delivers transactional emails (password
                resets) and newsletter emails on our behalf.
              </li>
              <li>
                <strong>Cloudinary and related cloud storage</strong> host
                photos and media that school staff publish on the site. This
                does not involve visitor personal data.
              </li>
            </ul>
            <p>
              We do not share your data with any other third party except where
              required by law.
            </p>

            <H2>4. Children&rsquo;s data</H2>
            <p>
              Our admissions form is intended to be completed by a parent or
              guardian on behalf of a prospective student, not by a child
              directly. We do not knowingly collect personal data submitted
              directly by a child through this website. If you believe a child
              has submitted data to us directly, please contact us and we will
              delete it.
            </p>

            <H2>5. How long we keep data</H2>
            <ul>
              <li>
                Admissions inquiries are kept for as long as reasonably needed
                to process your enrollment and respond to you, and are
                periodically reviewed and archived or deleted by admissions
                staff.
              </li>
              <li>Newsletter data is kept until you unsubscribe.</li>
              <li>Rate-limiting records are kept for 24 hours.</li>
            </ul>

            <H2>6. Your rights</H2>
            <p>
              Under Rwanda&rsquo;s Law N° 058/2021 of 13/10/2021 relating to the
              protection of personal data and privacy, you have the right to
              access, correct, or request deletion of your personal data, and to
              object to how it is processed. To exercise any of these rights,
              contact us using the details below. You may also lodge a complaint
              with Rwanda&rsquo;s National Cyber Security Authority (NCSA), the
              supervisory authority for data protection in Rwanda.
            </p>

            <H2>7. Security</H2>
            <p>
              We use reasonable technical and organizational measures to protect
              your data, including encrypted connections (HTTPS), hashed
              passwords, rate-limiting on public forms, and restricted,
              credentialed access to the admin portal. No method of transmission
              or storage is completely secure, and we cannot guarantee absolute
              security.
            </p>

            <H2>8. Changes to this policy</H2>
            <p>
              We may update this policy from time to time. Changes will be
              posted on this page with a new effective date above.
            </p>

            <H2>9. Contact us</H2>
            <p>
              For questions about this policy or to exercise your data rights,
              contact us at{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or{" "}
              {siteConfig.phoneDisplay}.
            </p>

            <p className="text-xs text-muted-foreground italic">
              This page is provided for transparency and is not a substitute for
              independent legal advice specific to your circumstances.
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

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-6 font-heading text-base font-semibold text-foreground">
      {children}
    </h3>
  )
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 text-sm/relaxed text-muted-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-2 [&_code]:rounded-none [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-xs [&_h2]:mb-3 [&_h2]:text-foreground [&_h3]:mb-2 [&_h3]:text-foreground [&_li]:ml-5 [&_li]:list-disc [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2">
      {children}
    </div>
  )
}
