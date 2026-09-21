import Link from "next/link"

import {
  AdminMobileNavTrigger,
  AdminSidebar,
  AdminSidebarProvider,
} from "@/components/admin/admin-sidebar"
import { AdminThemeToggle } from "@/components/admin/admin-theme-toggle"
import { AdminToastRuntime } from "@/components/admin/admin-toast-runtime"
import { SignOutButton } from "@/components/admin/sign-out-button"
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
  await requireAdmin()

  return (
    <AdminSidebarProvider>
      <AdminToastRuntime />
      <div className="flex min-h-svh flex-col bg-background">
        <header className="flex h-14 items-center justify-between border-b border-border px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <AdminMobileNavTrigger />
            <Link
              href="/admin/events"
              className="text-sm font-semibold tracking-wide uppercase"
            >
              Pallotti Admin
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <AdminThemeToggle />
            <SignOutButton />
          </div>
        </header>
        <div className="flex flex-1">
          <AdminSidebar />
          <main className="min-w-0 flex-1 px-4 py-8 sm:px-6">{children}</main>
        </div>
      </div>
    </AdminSidebarProvider>
  )
}
