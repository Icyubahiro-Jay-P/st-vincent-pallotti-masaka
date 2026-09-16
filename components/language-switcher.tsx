"use client"

import { usePathname, useRouter } from "next/navigation"
import { Languages } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { locales, localeNames, type Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/get-dictionary"

// Swaps the locale segment in the current URL and navigates there, so
// switching language keeps you on the same page instead of bouncing to the
// homepage. To add Kinyarwanda, no changes are needed here: it will show up
// automatically once "rw" is added to lib/i18n/config.ts's `locales` array.
export function LanguageSwitcher({
  locale,
  dict,
  className,
}: {
  locale: Locale
  dict: Dictionary
  className?: string
}) {
  const router = useRouter()
  const pathname = usePathname()

  function switchTo(nextLocale: string) {
    const segments = pathname.split("/")
    segments[1] = nextLocale
    router.push(segments.join("/"))
  }

  return (
    <Select value={locale} onValueChange={switchTo}>
      <SelectTrigger
        aria-label={dict.languageSwitcher.label}
        className={className ?? "h-9 gap-1.5 border-white/20 bg-transparent text-ink-foreground hover:bg-white/10"}
      >
        <Languages className="size-3.5" data-icon="inline-start" />
        <SelectValue>{locale.toUpperCase()}</SelectValue>
      </SelectTrigger>
      <SelectContent align="end">
        {locales.map((code) => (
          <SelectItem key={code} value={code}>
            {localeNames[code]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
