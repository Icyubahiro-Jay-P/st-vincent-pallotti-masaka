import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon"
import { siteConfig, localeHref } from "@/lib/site-config"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/get-dictionary"

export function CtaBand({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const c = dict.home.cta

  return (
    <section className="bg-ink py-16 text-ink-foreground sm:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">
          {c.eyebrow}
        </p>
        <h2 className="mt-4 font-heading text-[clamp(1.75rem,1.4rem+1.8vw,3rem)] font-semibold tracking-tight">
          {c.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm/relaxed text-ink-foreground/75">
          {c.paragraph}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            render={<Link href={localeHref(locale, "/admissions")} />}
            className="h-11 bg-gold px-6 text-sm text-gold-foreground hover:bg-gold/85"
          >
            {c.startApplication}
            <ArrowRight data-icon="inline-end" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            render={
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
            className="h-11 border-white/25 bg-transparent px-6 text-sm text-ink-foreground hover:bg-white/10"
          >
            <WhatsAppIcon className="size-4" data-icon="inline-start" />
            {c.chatWhatsapp}
          </Button>
        </div>
      </div>
    </section>
  )
}
