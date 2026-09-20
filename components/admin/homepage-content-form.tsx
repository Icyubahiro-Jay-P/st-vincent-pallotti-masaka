"use client"

import { useState } from "react"
import { useActionState } from "react"
import { Loader2, Languages, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { translateField } from "@/lib/translate-action"
import {
  updateHomepageContent,
  type HomepageContentFormState,
} from "@/app/admin/(dashboard)/homepage/actions"
import { useToastOnActionState } from "@/components/admin/use-toast-on-action-state"
import type { HomepageStat } from "@/lib/db/schema"

const initialState: HomepageContentFormState = { status: "idle" }

type LangKey = "en" | "fr"

export type HomepageContentDefaults = {
  eyebrowEn: string
  eyebrowFr: string
  headlineEn: string
  headlineFr: string
  headlineEmphasisEn: string
  headlineEmphasisFr: string
  paragraphEn: string
  paragraphFr: string
  calloutValueEn: string
  calloutValueFr: string
  calloutTextEn: string
  calloutTextFr: string
  panelEstablishedEn: string
  panelEstablishedFr: string
  stats: HomepageStat[]
  updatedAt: Date
}

function useTranslatedPair(initialEn: string, initialFr: string) {
  const [en, setEn] = useState(initialEn)
  const [fr, setFr] = useState(initialFr)
  const [translating, setTranslating] = useState<LangKey | null>(null)

  async function translate(source: LangKey) {
    const text = source === "en" ? en : fr
    if (!text.trim()) return
    setTranslating(source)
    try {
      const result = await translateField(
        text,
        source,
        source === "en" ? "fr" : "en"
      )
      if (source === "en") setFr(result.text)
      else setEn(result.text)
    } finally {
      setTranslating(null)
    }
  }

  function handleBlur(source: LangKey) {
    const targetIsEmpty = source === "en" ? !fr.trim() : !en.trim()
    if (targetIsEmpty) translate(source)
  }

  return { en, setEn, fr, setFr, translating, translate, handleBlur }
}

export function HomepageContentForm({
  defaults,
}: {
  defaults: HomepageContentDefaults
}) {
  const [state, formAction, pending] = useActionState(
    updateHomepageContent,
    initialState
  )
  useToastOnActionState(state.status, state.message)

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive"
        >
          {state.message}
        </p>
      )}

      {state.status === "success" && state.message && (
        <p
          role="status"
          className="border border-primary/30 bg-primary/10 px-4 py-3 text-xs text-foreground"
        >
          {state.message}
        </p>
      )}

      {/* Keyed on updatedAt so a successful save (which doesn't navigate
          away) remounts these fields with fresh defaults instead of the
          local useState/useTranslatedPair hooks silently keeping their
          pre-save values. useActionState/the toast above stay outside this
          key, so they're unaffected by the remount. */}
      <HomepageFields
        key={defaults.updatedAt.toISOString()}
        defaults={defaults}
        fieldErrors={state.fieldErrors}
      />

      <Button
        type="submit"
        disabled={pending}
        className="h-11 self-start px-6 text-sm"
      >
        {pending ? <Loader2 className="animate-spin" /> : null}
        Save homepage content
      </Button>
    </form>
  )
}

function HomepageFields({
  defaults,
  fieldErrors,
}: {
  defaults: HomepageContentDefaults
  fieldErrors?: HomepageContentFormState["fieldErrors"]
}) {
  const eyebrow = useTranslatedPair(defaults.eyebrowEn, defaults.eyebrowFr)
  const headline = useTranslatedPair(defaults.headlineEn, defaults.headlineFr)
  const headlineEmphasis = useTranslatedPair(
    defaults.headlineEmphasisEn,
    defaults.headlineEmphasisFr
  )
  const paragraph = useTranslatedPair(
    defaults.paragraphEn,
    defaults.paragraphFr
  )
  const calloutValue = useTranslatedPair(
    defaults.calloutValueEn,
    defaults.calloutValueFr
  )
  const calloutText = useTranslatedPair(
    defaults.calloutTextEn,
    defaults.calloutTextFr
  )
  const panelEstablished = useTranslatedPair(
    defaults.panelEstablishedEn,
    defaults.panelEstablishedFr
  )

  const [stats, setStats] = useState(() => {
    const length = Math.max(defaults.stats.length, 1)
    return Array.from({ length }, (_, index) => ({
      valueEn: defaults.stats[index]?.valueEn ?? "",
      valueFr: defaults.stats[index]?.valueFr ?? "",
      labelEn: defaults.stats[index]?.labelEn ?? "",
      labelFr: defaults.stats[index]?.labelFr ?? "",
    }))
  })

  function updateStat(index: number, field: keyof HomepageStat, value: string) {
    setStats((rows) =>
      rows.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    )
  }

  function addStat() {
    setStats((rows) => [
      ...rows,
      { valueEn: "", valueFr: "", labelEn: "", labelFr: "" },
    ])
  }

  function removeStat(index: number) {
    setStats((rows) => rows.filter((_, i) => i !== index))
  }

  return (
    <>
      <TranslatedField
        label="Eyebrow"
        idPrefix="eyebrow"
        nameEn="eyebrowEn"
        nameFr="eyebrowFr"
        pair={eyebrow}
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TranslatedField
          label="Headline"
          idPrefix="headline"
          nameEn="headlineEn"
          nameFr="headlineFr"
          pair={headline}
        />
        <TranslatedField
          label="Headline emphasis"
          idPrefix="headlineEmphasis"
          nameEn="headlineEmphasisEn"
          nameFr="headlineEmphasisFr"
          pair={headlineEmphasis}
        />
      </div>
      <TranslatedField
        label="Paragraph"
        idPrefix="paragraph"
        nameEn="paragraphEn"
        nameFr="paragraphFr"
        pair={paragraph}
        multiline
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TranslatedField
          label="Callout value"
          idPrefix="calloutValue"
          nameEn="calloutValueEn"
          nameFr="calloutValueFr"
          pair={calloutValue}
        />
        <TranslatedField
          label="Callout text"
          idPrefix="calloutText"
          nameEn="calloutTextEn"
          nameFr="calloutTextFr"
          pair={calloutText}
        />
      </div>
      <TranslatedField
        label="Panel established text"
        idPrefix="panelEstablished"
        nameEn="panelEstablishedEn"
        nameFr="panelEstablishedFr"
        pair={panelEstablished}
      />

      <div className="flex flex-col gap-3">
        <Label>Stats</Label>
        {stats.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-1 gap-2 border border-border p-3 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]"
          >
            <Input
              name="statValueEn"
              placeholder="Value (English)"
              value={row.valueEn}
              onChange={(e) => updateStat(index, "valueEn", e.target.value)}
            />
            <Input
              name="statValueFr"
              placeholder="Value (French)"
              value={row.valueFr}
              onChange={(e) => updateStat(index, "valueFr", e.target.value)}
            />
            <Input
              name="statLabelEn"
              placeholder="Label (English)"
              value={row.labelEn}
              onChange={(e) => updateStat(index, "labelEn", e.target.value)}
            />
            <Input
              name="statLabelFr"
              placeholder="Label (French)"
              value={row.labelFr}
              onChange={(e) => updateStat(index, "labelFr", e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              size="icon-xs"
              onClick={() => removeStat(index)}
              aria-label="Remove stat"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
        {fieldErrors?.stats ? (
          <p className="text-[0.7rem] text-destructive">{fieldErrors.stats}</p>
        ) : null}
        <Button
          type="button"
          variant="outline"
          size="xs"
          onClick={addStat}
          className="self-start"
        >
          <Plus className="size-3.5" />
          Add stat
        </Button>
      </div>
    </>
  )
}

function TranslatedField({
  label,
  idPrefix,
  nameEn,
  nameFr,
  pair,
  multiline,
  rows = 4,
}: {
  label: string
  idPrefix: string
  nameEn: string
  nameFr: string
  pair: ReturnType<typeof useTranslatedPair>
  multiline?: boolean
  rows?: number
}) {
  const FieldControl = multiline ? Textarea : Input
  const controlProps = multiline ? { rows } : {}

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:*:flex-1">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}En`}>{label} (English)</Label>
        <FieldControl
          id={`${idPrefix}En`}
          name={nameEn}
          value={pair.en}
          onChange={(event) => pair.setEn(event.target.value)}
          onBlur={() => pair.handleBlur("en")}
          {...controlProps}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor={`${idPrefix}Fr`}>{label} (French)</Label>
          <button
            type="button"
            onClick={() => pair.translate("en")}
            className="flex items-center gap-1 text-[0.65rem] text-muted-foreground hover:text-foreground"
            aria-label={`Retranslate ${label} from English`}
          >
            {pair.translating ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <Languages className="size-3" />
            )}
            Retranslate
          </button>
        </div>
        <FieldControl
          id={`${idPrefix}Fr`}
          name={nameFr}
          value={pair.fr}
          onChange={(event) => pair.setFr(event.target.value)}
          onBlur={() => pair.handleBlur("fr")}
          {...controlProps}
        />
      </div>
    </div>
  )
}
