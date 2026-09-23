import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import {
  AdminMobileNavTrigger,
  AdminPageTitle,
  AdminSidebar,
  AdminSidebarProvider,
} from "@/components/admin/admin-sidebar"
import { AdminThemeToggle } from "@/components/admin/admin-theme-toggle"
import { AdminToastRuntime } from "@/components/admin/admin-toast-runtime"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { requireAdmin } from "@/lib/require-admin"

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Defense in depth: proxy.ts already gates navigation to /admin/**, but
  // this guarantees every page under this layout requires a session even
  // if the proxy matcher is ever misconfigured (RSC payload fetches don't
  // always go through the same middleware path as a full navigation).
  const { user } = await requireAdmin()
  const displayName = user.name || user.email
  const initials =
    displayName
      .split(/[\s@]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("") || "A"

  return (
    <AdminSidebarProvider>
      <AdminToastRuntime />
      <div className="flex h-svh flex-col bg-background">
        <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <AdminMobileNavTrigger />
            <Link
              href="/admin/events"
              className="text-sm font-semibold tracking-wide uppercase"
            >
              Pallotti Admin
            </Link>
            <span aria-hidden className="text-muted-foreground">
              /
            </span>
            <AdminPageTitle className="truncate text-sm text-muted-foreground" />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              View site
              <ArrowUpRight className="size-4" />
            </Link>
            <AdminThemeToggle />
            <div className="flex items-center gap-2">
              <Avatar size="sm">
                {user.image && <AvatarImage src={user.image} alt="" />}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden max-w-40 truncate text-sm font-medium sm:inline">
                {displayName}
              </span>
            </div>
          </div>
        </header>
        <div className="flex min-h-0 flex-1">
          <AdminSidebar />
          <main className="min-w-0 flex-1 overflow-y-auto px-4 py-8 sm:px-6">
            {children}
          </main>
        </div>
      </div>
    </AdminSidebarProvider>
  )
}
