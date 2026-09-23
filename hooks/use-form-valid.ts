"use client"

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react"
import type { z } from "zod"

// Tracks whether a form's current values pass `schema`, so the submit button
// can stay disabled until the form is valid. Fields stay uncontrolled: attach
// `onChange` to the <form> and `formRef` to it. UX only, the server action
// still validates with the same schema.
export function useFormValid(schema: z.ZodType, initialValid = false) {
  const formRef = useRef<HTMLFormElement>(null)
  const [valid, setValid] = useState(initialValid)

  const check = useCallback(
    (form: HTMLFormElement) => {
      setValid(schema.safeParse(Object.fromEntries(new FormData(form))).success)
    },
    [schema]
  )

  // Also re-check after every render: on mount (prefilled edit forms), and
  // when values change without a change event (auto-translate, controlled
  // Selects). setValid bails out when
  // the result is unchanged, so this doesn't loop.
  useEffect(() => {
    if (formRef.current) check(formRef.current)
  })

  const onChange = useCallback(
    (event: FormEvent<HTMLFormElement>) => check(event.currentTarget),
    [check]
  )

  // form.reset() fires no change event and the per-render check above has
  // already run by the time a caller's reset effect does, so re-check here.
  const reset = useCallback(() => {
    const form = formRef.current
    if (!form) return
    form.reset()
    check(form)
  }, [check])

  return { formRef, valid, onChange, reset }
}
