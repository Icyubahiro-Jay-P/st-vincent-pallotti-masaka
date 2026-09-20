import { Crest } from "@/components/crest"
import { ImigongoSpiral } from "@/components/patterns/imigongo-spiral"
import { siteConfig } from "@/lib/site-config"

// Shared branded frame for /admin/login, /admin/login/forgot-password, and
// /admin/reset-password — reuses the same crest/imigongo visual language as
// the public site's hero panel (components/home/hero.tsx) instead of a
// generic auth-card look.
export function AdminAuthShell({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-svh grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden flex-col items-center justify-center gap-6 overflow-hidden border-r border-ink bg-ink px-12 text-ink-foreground lg:flex">
        <ImigongoSpiral className="pointer-events-none absolute -top-10 -right-10 size-56 text-ink-foreground/20" />
        <ImigongoSpiral className="pointer-events-none absolute -bottom-10 -left-10 size-56 rotate-180 text-ink-foreground/20" />
        <Crest size={96} ringClassName="ring-4" />
        <div className="text-center">
          <p className="font-heading text-xl font-semibold">
            {siteConfig.name}
          </p>
          <p className="mt-2 text-xs tracking-[0.2em] text-ink-foreground/70 uppercase">
            Admin Portal
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-6">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <div className="lg:hidden">
            <Crest size={40} />
          </div>
          <div className="flex flex-col gap-1.5">
            <h1 className="font-heading text-2xl font-semibold text-foreground">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
