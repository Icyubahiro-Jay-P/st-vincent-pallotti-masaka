import Link from "@/components/locale-link"

import { Crest } from "@/components/crest"
import { SiteHeaderNav } from "@/components/site-header-nav"
import type { Dictionary } from "@/lib/i18n/get-dictionary"

// Server component: only the logo/wrapper is static. Everything that needs
// usePathname() or the mobile Sheet's open state lives in the SiteHeaderNav
// client island instead, so this shell (and the always-visible priority
// logo image) don't force the whole header into the client bundle.
export function SiteHeader({ dict }: { dict: Dictionary }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-ink text-ink-foreground">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          <Crest size={40} priority />
          <span className="flex flex-col leading-tight">
            <span className="font-heading text-sm font-semibold tracking-tight sm:text-base">
              St. Vincent Pallotti
            </span>
            <span className="text-[0.65rem] tracking-[0.2em] text-ink-foreground/70 uppercase">
              School Masaka
            </span>
          </span>
        </Link>

        <SiteHeaderNav dict={dict} />
      </div>
    </header>
  )
}
