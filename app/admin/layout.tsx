import type { Metadata } from "next"

import { RootShell } from "@/components/root-shell"

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
}

// A root layout of its own (the public site's is app/[locale]/layout.tsx):
// admin has no locale segment and is English only.
// The dashboard sidebar/header shell lives in app/admin/(dashboard)/layout.tsx
// instead of here, so /admin/login renders standalone rather than showing
// working nav links to pages the visitor isn't signed in to reach yet.
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <RootShell lang="en">
      <div className="min-h-svh bg-background">{children}</div>
    </RootShell>
  )
}
