import { ForgotPasswordForm } from "@/components/admin/forgot-password-form"
import { AdminAuthShell } from "@/components/admin/auth-shell"

export default function ForgotPasswordPage() {
  return (
    <AdminAuthShell
      title="Reset your password"
      description="Enter your admin email and we'll send you a reset link."
    >
      <ForgotPasswordForm />
    </AdminAuthShell>
  )
}
