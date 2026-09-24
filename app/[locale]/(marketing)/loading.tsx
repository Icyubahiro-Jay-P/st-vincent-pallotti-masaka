import { Crest } from "@/components/crest"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"
import { siteConfig } from "@/lib/site-config"

export default async function Loading() {
  const dict = getDictionary(await getLocale())

  return (
    <div
      role="status"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-5 bg-background px-4"
    >
      <Crest size={72} className="animate-pulse" />
      <p className="font-heading text-sm font-semibold tracking-[0.2em] text-foreground uppercase">
        {siteConfig.shortName}
      </p>
      <div className="h-0.5 w-40 overflow-hidden bg-border">
        <div className="h-full w-2/5 animate-[loader-slide_1.2s_ease-in-out_infinite] bg-gold" />
      </div>
      <span className="sr-only">{dict.common.loading}</span>
    </div>
  )
}
