"use client"

import { useActionState, useEffect } from "react"
import { Loader2, Mail } from "lucide-react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  subscribeToNewsletter,
  type NewsletterState,
} from "@/app/newsletter/actions"
import type { Dictionary } from "@/lib/i18n/get-dictionary"
import { emailSchema } from "@/lib/validation"
import { useFormValid } from "@/hooks/use-form-valid"

const initialState: NewsletterState = { status: "idle" }

// Same rule subscribeToNewsletter checks.
const subscribeSchema = z.object({ email: emailSchema.max(320) })

export function SubscribeForm({ dict }: { dict: Dictionary }) {
  const n = dict.newsletter
  const [state, formAction, pending] = useActionState(
    subscribeToNewsletter,
    initialState
  )
  const { formRef, valid, onChange, reset } = useFormValid(subscribeSchema)

  useEffect(() => {
    if (state.status === "success") {
      reset()
    }
  }, [state.status, reset])

  return (
    <form
      ref={formRef}
      action={formAction}
      onChange={onChange}
      noValidate
      className="flex flex-col gap-2"
    >
      <div className="flex gap-2">
        <Input
          type="email"
          name="email"
          required
          placeholder={n.placeholder}
          aria-label={n.placeholder}
          className="bg-card pl-2"
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
