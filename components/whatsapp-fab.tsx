import { WhatsAppIcon } from "@/components/icons/whatsapp-icon"
import type { Dictionary } from "@/lib/i18n/get-dictionary"

export function WhatsAppFab({
  dict,
  whatsappNumber,
}: {
  dict: Dictionary
  whatsappNumber: string
}) {
  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        dict.whatsapp.prefillMessage
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed right-4 bottom-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg ring-2 ring-white/40 transition-all hover:scale-105 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-95 sm:right-6 sm:bottom-6"
      aria-label={dict.whatsapp.ariaLabel}
    >
      <WhatsAppIcon className="size-7" />
      <span className="pointer-events-none absolute right-full mr-3 hidden rounded-none bg-ink px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-ink-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100 sm:block">
        {dict.whatsapp.tooltip}
      </span>
    </a>
  )
}
