"use client"

import Link from "@/components/locale-link"
import { ArrowRight } from "lucide-react"

import { Crest } from "@/components/crest"
import { MenuButton } from "@/components/site-header-nav"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { navLinks } from "@/lib/site-config"
import type { Dictionary } from "@/lib/i18n/get-dictionary"
import { cn } from "@/lib/utils"

// The mobile nav Sheet, split out so SiteHeaderNav can load it (and Base
// UI's dialog/focus-trap code with it) only once a visitor reaches for the
// menu, instead of on every page load.
export function MobileMenu({
  dict,
  pathname,
  open,
  onOpenChange,
}: {
  dict: Dictionary
  pathname: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger render={<MenuButton dict={dict} />} />
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-xs">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Crest size={32} />
            St. Vincent Pallotti
          </SheetTitle>
          <SheetDescription>{dict.nav.sheetDescription}</SheetDescription>
        </SheetHeader>
        <nav
          className="flex flex-col gap-1 px-4"
          aria-label={dict.nav.primaryLabel}
        >
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href)
            return (
              <SheetClose
                key={link.key}
                render={<Link href={link.href} prefetch={false} />}
                className={cn(
                  "border-b border-border py-3 text-sm font-medium",
                  isActive ? "text-primary" : "text-foreground/80"
                )}
              >
                {dict.nav[link.key]}
              </SheetClose>
            )
          })}
        </nav>
        <SheetFooter>
          <SheetClose
            render={<Link href="/admissions" prefetch={false} />}
            className="flex w-full items-center justify-center gap-1.5 bg-gold px-4 py-2.5 text-xs font-semibold text-gold-foreground uppercase transition-colors hover:bg-gold/85"
          >
            {dict.nav.applyNow}
            <ArrowRight className="size-3.5" />
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
