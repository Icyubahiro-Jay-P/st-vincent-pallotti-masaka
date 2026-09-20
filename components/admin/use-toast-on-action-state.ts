"use client"

import { useEffect, useRef } from "react"
import { toast } from "sonner"

// Fires a toast when a useActionState result settles into "success" or
// "error" (some forms, like the singleton settings/homepage editors, return
// "success" and stay in place; others, like events/programs, only ever
// return "error" here because a success redirects away before this would
// run). No-ops on "idle" and on repeat renders with the same result, since
// useActionState keeps returning the same object across re-renders that
// aren't a new submission.
export function useToastOnActionState(
  status: "idle" | "error" | "success" | string,
  message?: string
) {
  const lastKey = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (status !== "success" && status !== "error") return
    if (!message) return

    const key = `${status}:${message}`
    if (lastKey.current === key) return
    lastKey.current = key

    if (status === "success") toast.success(message)
    else toast.error(message)
  }, [status, message])
}
