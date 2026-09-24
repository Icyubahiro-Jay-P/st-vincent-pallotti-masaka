"use client"

import * as React from "react"
import Link from "@/components/locale-link"

import { Button } from "@/components/ui/button"
import type { Dictionary } from "@/lib/i18n/get-dictionary"

// Only "necessary" cookies exist on this site today (the locale cookie and
// the admin session cookie) - there is no analytics/marketing script to
// gate on consent. This still records a choice (rather than a plain notice)
// so that if an analytics cookie is ever added, existing visitors' consent
// state is already meaningful instead of retrofitted.
const STORAGE_KEY = "cookie-consent"

const noopSubscribe = () => () => {}

function readNeedsChoice() {
  try {
    return !window.localStorage.getItem(STORAGE_KEY)
  } catch {
    // Private browsing / blocked storage: default to showing the notice
    // rather than crashing the banner.
    return true
  }
}

export function CookieConsentBanner({ dict }: { dict: Dictionary }) {
  // Read after hydration (server snapshot hides the banner).
  const needsChoice = React.useSyncExternalStore(
    noopSubscribe,
    readNeedsChoice,
    () => false
  )
  const [dismissed, setDismissed] = React.useState(false)
  const visible = needsChoice && !dismissed
  const c = dict.cookieConsent

  function choose(value: "accepted" | "necessary-only") {
    try {
      window.localStorage.setItem(STORAGE_KEY, value)
    } catch {
      // Storage blocked - nothing to persist, just dismiss for this visit.
    }
    setDismissed(true)
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label={c.acceptAll}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-xs/relaxed text-muted-foreground">
          {c.message}{" "}
          <Link
            href="/privacy-policy"
            className="underline underline-offset-2 hover:text-foreground"
          >
            {c.privacyLink}
          </Link>
        </p>
        <div className="flex shrink-0 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => choose("necessary-only")}
          >
            {c.necessaryOnly}
          </Button>
          <Button size="sm" onClick={() => choose("accepted")}>
            {c.acceptAll}
          </Button>
        </div>
      </div>
    </div>
  )
}
