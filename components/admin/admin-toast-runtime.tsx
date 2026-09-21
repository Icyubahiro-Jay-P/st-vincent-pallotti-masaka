"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"
import { Toaster, toast } from "sonner"

// Central lookup so every admin mutation redirects with `?toast=<key>` and
// this is the one place that decides the type/copy for each key, instead of
// duplicating message strings across every action file.
export const TOAST_MESSAGES = {
  "event-published": { type: "success", message: "Event published." },
  "event-draft-saved": {
    type: "info",
    message:
      "Draft saved. It won't appear on the public site until you publish it.",
  },
  "event-deleted": { type: "warning", message: "Event deleted." },
  "program-saved": { type: "success", message: "Program saved." },
  "program-deleted": { type: "warning", message: "Program deleted." },
  "milestone-saved": { type: "success", message: "Milestone saved." },
  "milestone-deleted": { type: "warning", message: "Milestone deleted." },
  "value-saved": { type: "success", message: "Value saved." },
  "value-deleted": { type: "warning", message: "Value deleted." },
  "inquiry-status-updated": {
    type: "success",
    message: "Inquiry status updated.",
  },
} as const satisfies Record<
  string,
  { type: "success" | "info" | "warning" | "error"; message: string }
>

export type ToastKey = keyof typeof TOAST_MESSAGES

// Split out because useSearchParams() requires a Suspense boundary in the
// App Router; the Toaster itself doesn't need to be inside it.
function ToastFromQuery() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const key = searchParams.get("toast")
  const galleryDropped = searchParams.get("galleryDropped")

  React.useEffect(() => {
    if (!key && !galleryDropped) return
    const entry = key ? TOAST_MESSAGES[key as ToastKey] : undefined
    if (entry) toast[entry.type](entry.message)
    if (galleryDropped) {
      const count = Number(galleryDropped)
      if (count > 0) {
        toast.warning(
          `${count} gallery item${count === 1 ? "" : "s"} couldn't be saved and ${count === 1 ? "was" : "were"} skipped.`
        )
      }
    }

    // Strip the one-shot signal(s) so a refresh doesn't replay the toast,
    // and use replace (not a full navigation) so it doesn't add a history
    // entry.
    const params = new URLSearchParams(searchParams)
    params.delete("toast")
    params.delete("galleryDropped")
    const search = params.toString()
    router.replace(`${pathname}${search ? `?${search}` : ""}`, {
      scroll: false,
    })
    // Only re-run when the signal itself changes, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, galleryDropped])

  return null
}

export function AdminToastRuntime() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <React.Suspense fallback={null}>
        <ToastFromQuery />
      </React.Suspense>
      <Toaster
        theme={mounted && resolvedTheme === "dark" ? "dark" : "light"}
        richColors
        closeButton
        position="bottom-right"
      />
    </>
  )
}
