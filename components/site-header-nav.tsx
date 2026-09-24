"use client"

import * as React from "react"
import Link from "@/components/locale-link"
import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
import { Menu, ArrowRight } from "lucide-react"

import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Button } from "@/components/ui/button"
import { stripLocale } from "@/lib/i18n/config"
import { navLinks } from "@/lib/site-config"
import type { Dictionary } from "@/lib/i18n/get-dictionary"
import { cn } from "@/lib/utils"

const loadMobileMenu = () => import("@/components/site-mobile-menu")
const MobileMenu = dynamic(() => loadMobileMenu().then((m) => m.MobileMenu), {
  ssr: false,
  loading: () => <MenuButton />,
})

// The hamburger button, shared by the placeholder shown before the Sheet
// has loaded and the Sheet's own trigger so the swap is invisible.
export function MenuButton({
  dict,
  ...props
}: React.ComponentProps<typeof Button> & { dict?: Dictionary }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-11 text-ink-foreground hover:bg-white/10 hover:text-ink-foreground"
      {...props}
    >
      <Menu />
      {dict && <span className="sr-only">{dict.nav.openMenu}</span>}
    </Button>
  )
}

// Everything here needs usePathname() (active-link styling) or the mobile
// Sheet's open state, which is why it's split out of the server-rendered
// SiteHeader shell into its own client island.
export function SiteHeaderNav({ dict }: { dict: Dictionary }) {
  // Locale prefix stripped so "/fr/about" still matches the "/about" link.
  const pathname = stripLocale(usePathname())
  const [open, setOpen] = React.useState(false)
  // Mount (and so download) the Sheet on the first tap of the menu button.
  const [menuWanted, setMenuWanted] = React.useState(false)

  return (
    <>
      <nav
        className="hidden items-center lg:flex xl:gap-1"
        aria-label={dict.nav.primaryLabel}
      >
        {navLinks.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href)
          return (
            <Link
              key={link.key}
              href={link.href}
              prefetch={false}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative px-1.5 py-2 text-[11px] font-medium uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold xl:px-3 xl:text-xs xl:tracking-wide",
                isActive
                  ? "text-gold"
                  : "text-ink-foreground/75 hover:text-ink-foreground"
              )}
            >
              {dict.nav[link.key]}
              <span
                className={cn(
                  "absolute inset-x-1.5 -bottom-0.5 h-0.5 bg-gold transition-transform duration-200 xl:inset-x-3",
                  isActive ? "scale-x-100" : "scale-x-0"
                )}
                aria-hidden="true"
              />
            </Link>
          )
        })}
      </nav>

      <div className="hidden items-center gap-2 lg:flex">
        <LanguageSwitcher dict={dict} />
        <ThemeToggle
          dict={dict}
          className="text-ink-foreground hover:bg-white/10 hover:text-ink-foreground"
        />
        <Button
          render={<Link href="/admissions" prefetch={false} />}
          className="bg-gold text-gold-foreground hover:bg-gold/85"
        >
          {dict.nav.applyNow}
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>

      <div className="flex items-center gap-1 lg:hidden">
        <LanguageSwitcher dict={dict} />
        <ThemeToggle
          dict={dict}
          className="text-ink-foreground hover:bg-white/10 hover:text-ink-foreground"
        />
        {menuWanted ? (
          <MobileMenu
            dict={dict}
            pathname={pathname}
            open={open}
            onOpenChange={setOpen}
          />
        ) : (
          <MenuButton
            dict={dict}
            // Only a click swaps this button for the Sheet (swapping on
            // hover/focus would eat the tap on touch and drop keyboard
            // focus); hover/focus just warm the chunk.
            onPointerEnter={loadMobileMenu}
            onFocus={loadMobileMenu}
            onClick={() => {
              setMenuWanted(true)
              setOpen(true)
            }}
          />
        )}
      </div>
    </>
  )
}
