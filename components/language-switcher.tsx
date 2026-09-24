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
import {
  isLocale,
  localeNames,
  localePath,
  locales,
  stripLocale,
} from "@/lib/i18n/config"
import { LOCALE_COOKIE } from "@/lib/i18n/locale-cookie"
import type { Dictionary } from "@/lib/i18n/get-dictionary"

// Switches language by moving to the same page under the other locale
// segment (/en/about -> /fr/about), keeping any query string. Also saves the
// choice in a cookie so proxy.ts sends later unprefixed visits (/, old
// links) to that language. To add Kinyarwanda later, no changes are needed
// here: it shows up automatically once "rw" is added to lib/i18n/config.ts.
export function LanguageSwitcher({
  dict,
  className,
}: {
  dict: Dictionary
  className?: string
}) {
  const router = useRouter()
  const pathname = usePathname()

  function switchTo(nextLocale: string | null) {
    if (!nextLocale || !isLocale(nextLocale)) return
    const secure = location.protocol === "https:" ? "; Secure" : ""
    document.cookie = `${LOCALE_COOKIE}=${encodeURIComponent(nextLocale)}; path=/; max-age=31536000; SameSite=Lax${secure}`
    router.push(localePath(nextLocale, stripLocale(pathname)) + location.search)
  }

  return (
    <Select value={dict.locale} onValueChange={switchTo}>
      <SelectTrigger
        aria-label={dict.languageSwitcher.label}
        className={
          className ??
          "h-9 gap-1.5 border-white/20 bg-transparent text-ink-foreground hover:bg-white/10"
        }
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
