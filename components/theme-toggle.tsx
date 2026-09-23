"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Dictionary } from "@/lib/i18n/get-dictionary"
import { useMounted } from "@/hooks/use-mounted"

export function ThemeToggle({
  dict,
  className,
}: {
  dict: Dictionary
  className?: string
}) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn("size-11", className)}
      aria-label={
        mounted
          ? isDark
            ? dict.themeToggle.switchToLight
            : dict.themeToggle.switchToDark
          : dict.themeToggle.toggle
      }
    >
      {mounted ? (
        isDark ? <Sun /> : <Moon />
      ) : (
        <Sun className="opacity-0" aria-hidden="true" />
      )}
    </Button>
  )
}
