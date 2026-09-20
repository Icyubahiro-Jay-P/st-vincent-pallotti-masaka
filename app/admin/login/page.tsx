import { AdminLoginForm } from "@/components/admin/login-form"
import { AdminAuthShell } from "@/components/admin/auth-shell"

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string }>
}) {
  const { reset } = await searchParams

  return (
    <AdminAuthShell
      title="Admin sign in"
      description="Sign in to manage events, programs, and admissions."
    >
      {reset === "success" && (
        <p
          role="status"
          className="border border-border bg-muted/40 px-4 py-3 text-xs text-foreground"
        >
          Your password has been reset. Sign in with your new password.
        </p>
      )}
      <AdminLoginForm />
    </AdminAuthShell>
  )
}
