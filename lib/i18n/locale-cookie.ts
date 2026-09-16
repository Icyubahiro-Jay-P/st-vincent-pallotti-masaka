// Split out from get-locale.ts because that file imports next/headers
// (server-only); this constant alone needs to be importable from client
// components too (see components/language-switcher.tsx).
export const LOCALE_COOKIE = "locale"
