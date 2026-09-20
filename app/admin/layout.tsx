import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
}

// The dashboard sidebar/header shell lives in app/admin/(dashboard)/layout.tsx
// instead of here, so /admin/login renders standalone rather than showing
// working nav links to pages the visitor isn't signed in to reach yet.
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="min-h-svh bg-background">{children}</div>
}
