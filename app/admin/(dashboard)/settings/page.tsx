import { SiteSettingsForm } from "@/components/admin/site-settings-form"
import { getSiteSettings } from "@/lib/site-settings"

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings()

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <h1 className="font-heading text-xl font-semibold text-foreground">
        Site settings
      </h1>
      <SiteSettingsForm defaults={settings} />
    </div>
  )
}
