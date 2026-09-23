import { requireAdmin } from "@/lib/require-admin"
import { ProfileForm } from "@/components/admin/profile-form"
import { ChangeEmailForm } from "@/components/admin/change-email-form"
import { ChangePasswordForm } from "@/components/admin/change-password-form"

export default async function AdminProfilePage() {
  const { user } = await requireAdmin()

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-10">
      <div className="flex flex-col gap-5">
        <h1 className="font-heading text-xl font-semibold text-foreground">
          Profile
        </h1>
        {/* Separate forms (email change has its own server flow), laid out
            as one row. */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <ProfileForm defaults={{ name: user.name }} />
          <ChangeEmailForm defaultEmail={user.email} />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Change password
        </h2>
        <ChangePasswordForm />
      </div>
    </div>
  )
}
