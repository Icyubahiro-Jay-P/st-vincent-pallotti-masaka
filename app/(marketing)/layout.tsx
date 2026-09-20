import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { WhatsAppFab } from "@/components/whatsapp-fab"
import { getDictionary } from "@/lib/i18n/get-dictionary"
import { getLocale } from "@/lib/i18n/get-locale"
import { getSiteSettings } from "@/lib/site-settings"

export default async function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const dict = getDictionary(locale)
  const settings = await getSiteSettings()

  return (
    <>
      <SiteHeader dict={dict} />
      <main className="flex-1">{children}</main>
      <SiteFooter dict={dict} locale={locale} />
      <WhatsAppFab dict={dict} whatsappNumber={settings.whatsappNumber} />
    </>
  )
}
