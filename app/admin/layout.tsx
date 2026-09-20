import type { Metadata } from "next"
import Link from "next/link"

import {
  AdminMobileNavTrigger,
  AdminSidebar,
  AdminSidebarProvider,
} from "@/components/admin/admin-sidebar"
import { SignOutButton } from "@/components/admin/sign-out-button"

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AdminSidebarProvider>
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
          <SignOutButton />
        </header>
        <div className="flex flex-1">
          <AdminSidebar />
          <main className="min-w-0 flex-1 px-4 py-8 sm:px-6">{children}</main>
        </div>
      </div>
    </AdminSidebarProvider>
  )
}
