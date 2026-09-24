"use client"

import * as React from "react"
import { ChevronDownIcon, Languages } from "lucide-react"

import { selectTriggerClassName } from "@/components/ui/select-trigger-class"
import type { Dictionary } from "@/lib/i18n/get-dictionary"
import { cn } from "@/lib/utils"

const loadSelect = () => import("@/components/language-switcher-select")
const LazySelect = React.lazy(() =>
  loadSelect().then((m) => ({ default: m.LanguageSwitcherSelect }))
)

// Base UI's Select (and its floating/focus-trap code) is the heaviest thing
// in the header, so every page first renders this look-alike button and
// only mounts the real Select, already open, on the first click. Hover and
// focus just warm the chunk.
export function LanguageSwitcher({
  dict,
  className = "h-9 gap-1.5 border-white/20 bg-transparent text-ink-foreground hover:bg-white/10",
}: {
  dict: Dictionary
  className?: string
}) {
  const [wanted, setWanted] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  const standIn = (props: React.ComponentProps<"button">) => (
    <button
      type="button"
      data-slot="select-trigger"
      data-size="default"
      aria-label={dict.languageSwitcher.label}
      aria-haspopup="listbox"
      className={cn(selectTriggerClassName, className)}
      {...props}
    >
      <Languages className="size-3.5" data-icon="inline-start" />
      <span data-slot="select-value">{dict.locale.toUpperCase()}</span>
      <ChevronDownIcon className="pointer-events-none size-3.5 text-muted-foreground" />
    </button>
  )

  if (!wanted) {
    return standIn({
      onPointerEnter: loadSelect,
      onFocus: loadSelect,
      onClick: () => {
        setWanted(true)
        setOpen(true)
      },
    })
  }
  return (
    <React.Suspense fallback={standIn({})}>
      <LazySelect
        dict={dict}
        className={className}
        open={open}
        onOpenChange={setOpen}
      />
    </React.Suspense>
  )
}
