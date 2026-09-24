import Link from "@/components/locale-link"
import { ChevronRight } from "lucide-react"

import { JsonLd } from "@/components/json-ld"
import { localePath } from "@/lib/i18n/config"
import { getLocale } from "@/lib/i18n/get-locale"
import { siteConfig } from "@/lib/site-config"

// Public counterpart of AdminBreadcrumb. The last item is the current page.
// Also emits the matching BreadcrumbList JSON-LD so pages don't hand-write it.
export async function Breadcrumb({
  items,
}: {
  items: { label: string; href: string }[]
}) {
  const locale = await getLocale()
  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.label,
            item: `${siteConfig.url}${localePath(locale, item.href)}`,
          })),
        }}
      />
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight aria-hidden className="size-3 shrink-0" />
              )}
              {index === items.length - 1 ? (
                <span className="text-foreground" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-foreground">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}
