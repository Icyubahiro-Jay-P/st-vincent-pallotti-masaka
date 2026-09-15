import { WhatsAppIcon } from "@/components/icons/whatsapp-icon"
import { siteConfig } from "@/lib/site-config"

export function WhatsAppFab() {
  return (
    <a
      href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
        "Hello Saint Vincent Pallotti School Masaka, I would like to ask about admissions."
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed right-4 bottom-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg ring-2 ring-white/40 transition-all hover:scale-105 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-95 sm:right-6 sm:bottom-6"
      aria-label="Chat with us on WhatsApp"
    >
      <WhatsAppIcon className="size-7" />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-none bg-ink px-2.5 py-1.5 text-xs font-medium text-ink-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100 sm:block">
        Chat with Admissions
      </span>
    </a>
  )
}
