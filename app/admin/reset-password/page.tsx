import { ResetPasswordForm } from "@/components/admin/reset-password-form"
import { AdminAuthShell } from "@/components/admin/auth-shell"

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  return (
    <AdminAuthShell
      title="Set a new password"
      description="Choose a new password for your admin account."
    >
      <ResetPasswordForm token={token} />
    </AdminAuthShell>
  )
}
