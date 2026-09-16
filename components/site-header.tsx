"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, ArrowRight } from "lucide-react"

import { Crest } from "@/components/crest"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Button } from "@/components/ui/button"
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

export function SiteHeader({ dict }: { dict: Dictionary }) {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-ink text-ink-foreground">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          <Crest size={40} />
          <span className="flex flex-col leading-tight">
            <span className="font-heading text-sm font-semibold tracking-tight sm:text-base">
              St. Vincent Pallotti
            </span>
            <span className="text-[0.65rem] tracking-[0.2em] text-ink-foreground/70 uppercase">
              School Masaka
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label={dict.nav.primaryLabel}>
          {navLinks.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
            return (
              <Link
                key={link.key}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative px-3 py-2 text-xs font-medium tracking-wide uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
                  isActive
                    ? "text-gold"
                    : "text-ink-foreground/75 hover:text-ink-foreground"
                )}
              >
                {dict.nav[link.key]}
                <span
                  className={cn(
                    "absolute inset-x-3 -bottom-0.5 h-0.5 bg-gold transition-transform duration-200",
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
          <ThemeToggle dict={dict} className="text-ink-foreground hover:bg-white/10 hover:text-ink-foreground" />
          <Button
            render={<Link href="/admissions" />}
            className="bg-gold text-gold-foreground hover:bg-gold/85"
          >
            {dict.nav.applyNow}
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <LanguageSwitcher dict={dict} />
          <ThemeToggle dict={dict} className="text-ink-foreground hover:bg-white/10 hover:text-ink-foreground" />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-11 text-ink-foreground hover:bg-white/10 hover:text-ink-foreground"
                />
              }
            >
              <Menu />
              <span className="sr-only">{dict.nav.openMenu}</span>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-full flex-col sm:max-w-xs">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Crest size={32} />
                  St. Vincent Pallotti
                </SheetTitle>
                <SheetDescription>{dict.nav.sheetDescription}</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4" aria-label={dict.nav.primaryLabel}>
                {navLinks.map((link) => {
                  const isActive =
                    link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
                  return (
                    <SheetClose
                      key={link.key}
                      render={<Link href={link.href} />}
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
                  render={<Link href="/admissions" />}
                  className="flex w-full items-center justify-center gap-1.5 bg-gold px-4 py-2.5 text-xs font-semibold text-gold-foreground uppercase transition-colors hover:bg-gold/85"
                >
                  {dict.nav.applyNow}
                  <ArrowRight className="size-3.5" />
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
