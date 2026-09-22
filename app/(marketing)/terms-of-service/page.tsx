import type { Metadata } from "next"

import { PageHero } from "@/components/page-hero"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"
import { siteConfig } from "@/lib/site-config"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  return {
    title: dict.meta.terms.title,
    description: dict.meta.terms.description,
  }
}

// English-only for the same reason as the privacy policy: this is the
// canonical legal text, kept out of the bilingual dictionary so a
// translation can't drift from what the School can stand behind.
const EFFECTIVE_DATE = "22 September 2026"

export default async function TermsOfServicePage() {
  const locale = await getLocale()
  const dict = getDictionary(locale)

  return (
    <>
      <PageHero
        eyebrow={dict.meta.terms.title}
        title="Terms of Service"
        description={`Effective ${EFFECTIVE_DATE}`}
      />

      <section className="border-b border-border bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Prose>
            <p>
              These terms govern your use of the Saint Vincent Pallotti School
              Masaka website ({siteConfig.url}), run by the Pallottine
              Missionary Sisters, Our Lady of Kibeho Region (&ldquo;the
              School,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;). By using this
              website, you agree to these terms. If you do not agree, please do
              not use the website.
            </p>

            <H2>1. Use of this website</H2>
            <p>
              This website is provided for informational purposes: to share
              information about the School&rsquo;s programs, to accept
              admissions inquiries, and to let you subscribe to our newsletter.
              You agree to use it only for its intended purpose, and not to:
            </p>
            <ul>
              <li>submit false, misleading, or fraudulent information;</li>
              <li>
                use the admissions, newsletter, or other forms to send spam or
                unsolicited content;
              </li>
              <li>
                attempt to gain unauthorized access to the admin portal or any
                part of the website not intended for public use;
              </li>
              <li>
                interfere with the normal operation of the website, for example
                through automated scraping or denial-of-service activity.
              </li>
            </ul>

            <H2>2. Admissions inquiries</H2>
            <p>
              Submitting an admissions inquiry through this website is an
              expression of interest only. It does not guarantee a place at the
              School. Admissions decisions are made by the School according to
              its own criteria and capacity, and will be communicated to you
              directly by admissions staff.
            </p>

            <H2>3. Newsletter</H2>
            <p>
              Subscribing to our newsletter is optional and opt-in. You may
              unsubscribe at any time using the link in any newsletter email or
              via <code>/newsletter/unsubscribe</code>.
            </p>

            <H2>4. Intellectual property</H2>
            <p>
              The School&rsquo;s name, crest, logo, photographs, and the text
              and design of this website are owned by, or licensed to, Saint
              Vincent Pallotti School Masaka, unless otherwise noted. You may
              view and share pages of this website for personal, non-commercial
              purposes. You may not reproduce, redistribute, or use our name,
              crest, or photographs for any commercial purpose without our prior
              written permission.
            </p>

            <H2>5. Third-party links and services</H2>
            <p>
              This website links to third-party services, including WhatsApp,
              Instagram, YouTube, Facebook, and Google Maps. These services are
              operated independently of the School and are governed by their own
              terms and privacy policies. We are not responsible for the
              content, availability, or practices of any third-party service we
              link to.
            </p>

            <H2>6. No warranty</H2>
            <p>
              We make reasonable efforts to keep information on this website
              accurate and up to date, but we do not guarantee that it is
              complete, current, or error-free. Program details, fees, and term
              dates are subject to change; for authoritative, up-to-date
              admissions and fee information, please contact the School directly
              at the details below. This website is provided &ldquo;as is&rdquo;
              without warranties of any kind, to the fullest extent permitted by
              law.
            </p>

            <H2>7. Limitation of liability</H2>
            <p>
              To the fullest extent permitted by applicable law, the School is
              not liable for any indirect, incidental, or consequential loss or
              damage arising from your use of, or inability to use, this
              website.
            </p>

            <H2>8. Changes to these terms</H2>
            <p>
              We may update these terms from time to time. Continued use of the
              website after changes are posted means you accept the updated
              terms. Changes will be posted on this page with a new effective
              date above.
            </p>

            <H2>9. Governing law</H2>
            <p>
              These terms are governed by the laws of the Republic of Rwanda.
              Any dispute arising from your use of this website will be subject
              to the exclusive jurisdiction of the courts of Rwanda, after a
              good-faith attempt to resolve the matter directly with us.
            </p>

            <H2>10. Contact us</H2>
            <p>
              Questions about these terms can be sent to{" "}
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

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 text-sm/relaxed text-muted-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-2 [&_code]:rounded-none [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-xs [&_h2]:mb-3 [&_h2]:text-foreground [&_li]:ml-5 [&_li]:list-disc [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2">
      {children}
    </div>
  )
}
