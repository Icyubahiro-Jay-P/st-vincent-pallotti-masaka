"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { Loader2, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  subscribeToNewsletter,
  type NewsletterState,
} from "@/app/[locale]/newsletter/actions"
import type { Dictionary } from "@/lib/i18n/get-dictionary"

const initialState: NewsletterState = { status: "idle" }

export function SubscribeForm({ dict }: { dict: Dictionary }) {
  const n = dict.newsletter
  const [state, formAction, pending] = useActionState(
    subscribeToNewsletter,
    initialState
  )
  // This form sits in the footer of every public page, so it uses the
  // browser's own type="email" check to enable the button instead of zod
  // (~95KB gzipped). subscribeToNewsletter still validates with zod.
  const formRef = useRef<HTMLFormElement>(null)
  const [valid, setValid] = useState(false)

  useEffect(() => {
    if (state.status === "success" && formRef.current) {
      formRef.current.reset()
      setValid(false)
    }
  }, [state.status])

  return (
    <form
      ref={formRef}
      action={formAction}
      onChange={(e) => setValid(e.currentTarget.checkValidity())}
      noValidate
      className="flex flex-col gap-2"
    >
      <div className="flex gap-2">
        <Input
          type="email"
          name="email"
          required
          maxLength={320}
          placeholder={n.placeholder}
          aria-label={n.placeholder}
          className="bg-card pl-2 text-card-foreground"
        />
        <Button
          type="submit"
          disabled={pending || !valid}
          size="default"
          className="shrink-0 px-4"
        >
          {pending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              {n.button}
              <Mail data-icon="inline-end" />
            </>
          )}
        </Button>
      </div>
      {state.message && (
        <p
          role="status"
          className={
            state.status === "error"
              ? "text-xs text-destructive"
              : "text-xs text-teal"
          }
        >
          {state.message}
        </p>
      )}
    </form>
  )
}
