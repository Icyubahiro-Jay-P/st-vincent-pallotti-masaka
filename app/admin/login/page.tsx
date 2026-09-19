import { AdminLoginForm } from "@/components/admin/login-form"

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 pt-10">
      <h1 className="font-heading text-xl font-semibold text-foreground">
        Admin sign in
      </h1>
      <AdminLoginForm />
    </div>
  )
}
