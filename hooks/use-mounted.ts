"use client"

import { useSyncExternalStore } from "react"

const subscribe = () => () => {}

// False during SSR and hydration, true once running on the client. Avoids a
// hydration mismatch for UI that depends on client-only state (e.g. theme).
export function useMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false)
}
