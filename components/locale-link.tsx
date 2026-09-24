"use client"

import NextLink from "next/link"
import { useParams } from "next/navigation"

import { isLocale, localePath } from "@/lib/i18n/config"

// Drop-in for next/link on public pages: prefixes internal paths with the
// current page's locale ("/about" -> "/fr/about"), so links stay in the
// visitor's language without every call site knowing about locales. Paths
// that already carry a locale, /admin, anchors and external URLs pass
// through unchanged.
export default function Link(props: React.ComponentProps<typeof NextLink>) {
  const { locale } = useParams<{ locale?: string }>()
  const { href } = props
  if (
    typeof href !== "string" ||
    !href.startsWith("/") ||
    href.startsWith("/admin") ||
    !locale ||
    !isLocale(locale) ||
    isLocale(href.split(/[/?#]/)[1] ?? "")
  ) {
    return <NextLink {...props} />
  }
  return <NextLink {...props} href={localePath(locale, href)} />
}
