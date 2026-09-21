"use client"

import { useRouter } from "next/navigation"
import { Languages } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { locales, localeNames } from "@/lib/i18n/config"
import { LOCALE_COOKIE } from "@/lib/i18n/locale-cookie"
import type { Dictionary } from "@/lib/i18n/get-dictionary"

// Switches language via a cookie instead of a URL segment, so pages stay at
// plain paths like /about. Setting the cookie client-side and refreshing
// re-runs the server components with the new value, no page navigation or
// full reload needed. To add Kinyarwanda later, no changes are needed here:
// it shows up automatically once "rw" is added to lib/i18n/config.ts.
export function LanguageSwitcher({
  dict,
  className,
}: {
  dict: Dictionary
  className?: string
}) {
  const router = useRouter()

  function switchTo(nextLocale: string | null) {
    if (!nextLocale) return
    const secure = location.protocol === "https:" ? "; Secure" : ""
    document.cookie = `${LOCALE_COOKIE}=${encodeURIComponent(nextLocale)}; path=/; max-age=31536000; SameSite=Lax${secure}`
    router.refresh()
  }

  return (
    <Select value={dict.locale} onValueChange={switchTo}>
      <SelectTrigger
        aria-label={dict.languageSwitcher.label}
        className={className ?? "h-9 gap-1.5 border-white/20 bg-transparent text-ink-foreground hover:bg-white/10"}
      >
        <Languages className="size-3.5" data-icon="inline-start" />
        <SelectValue>{dict.locale.toUpperCase()}</SelectValue>
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
