"use client"

import { useActionState, useRef, useState } from "react"
import {
  FileVideo,
  ImagePlus,
  Languages,
  Loader2,
  Upload,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  saveEvent,
  type EventFormState,
} from "@/app/admin/(dashboard)/events/actions"
import { useToastOnActionState } from "@/components/admin/use-toast-on-action-state"
import { translateField } from "@/lib/translate-action"
import { getUploadCredentials } from "@/app/admin/(dashboard)/events/upload-actions"
import { compressImage } from "@/lib/media/compress-image"
import { compressVideo } from "@/lib/media/compress-video"

const initialState: EventFormState = { status: "idle" }

export type EventFormDefaults = {
  id: number
  slug: string
  titleEn: string
  titleFr: string
  excerptEn: string
  excerptFr: string
  bodyEn: string
  bodyFr: string
  category: string
  coverImageUrl?: string | null
}

export type ExistingEventMedia = {
  id: number
  kind: string
  cloudinaryUrl: string
}

type LocalizedFields = {
  titleEn: string
  titleFr: string
  excerptEn: string
  excerptFr: string
  bodyEn: string
  bodyFr: string
}

type FieldPair = "title" | "excerpt" | "body"

type UploadedMedia = {
  kind: "photo" | "video"
  cloudinaryPublicId: string
  cloudinaryUrl: string
  backupObjectKey: string
  bytes: number
}

type UploadStatus = "compressing" | "uploading" | "done" | "error"

type CoverUpload = {
  file: File
  status: UploadStatus
  progress: number
  result?: UploadedMedia
  error?: string
}

type GalleryItem = {
  id: string
  file: File
  status: UploadStatus
  progress: number
  result?: UploadedMedia
  error?: string
}

function xhrUpload(
  url: string,
  formData: FormData,
  onProgress: (ratio: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", url)
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(event.loaded / event.total)
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.responseText)
      } else {
        reject(new Error(`Upload failed (${xhr.status})`))
      }
    }
    xhr.onerror = () => reject(new Error("Upload failed"))
    xhr.send(formData)
  })
}

async function uploadAndCompress(
  file: File,
  eventFolder: string,
  onProgress: (status: UploadStatus, progress: number) => void
): Promise<UploadedMedia> {
  const isVideo = file.type.startsWith("video/")

  onProgress("compressing", 0)
  const compressed = isVideo
    ? await compressVideo(file, (ratio) => onProgress("compressing", ratio))
    : await compressImage(file)

  const credentials = await getUploadCredentials(
    compressed.name,
    compressed.type,
    eventFolder,
    compressed.size
  )

  let cloudinaryRatio = 0
  let backupRatio = 0
  const reportUploadProgress = () =>
    onProgress("uploading", (cloudinaryRatio + backupRatio) / 2)
  onProgress("uploading", 0)

  const cloudinaryForm = new FormData()
  cloudinaryForm.append("file", compressed)
  cloudinaryForm.append("api_key", credentials.cloudinary.apiKey)
  cloudinaryForm.append("timestamp", String(credentials.cloudinary.timestamp))
  cloudinaryForm.append("signature", credentials.cloudinary.signature)
  cloudinaryForm.append("folder", credentials.cloudinary.folder)

  const backupForm = new FormData()
  for (const [key, value] of Object.entries(credentials.backup.fields)) {
    backupForm.append(key, value)
  }
  backupForm.append("file", compressed)

  const [cloudinaryResponse] = await Promise.all([
    xhrUpload(
      `https://api.cloudinary.com/v1_1/${credentials.cloudinary.cloudName}/auto/upload`,
      cloudinaryForm,
      (ratio) => {
        cloudinaryRatio = ratio
        reportUploadProgress()
      }
    ),
    xhrUpload(credentials.backup.url, backupForm, (ratio) => {
      backupRatio = ratio
      reportUploadProgress()
    }),
  ])

  const cloudinaryResult = JSON.parse(cloudinaryResponse) as {
    secure_url: string
    public_id: string
  }

  return {
    kind: isVideo ? "video" : "photo",
    cloudinaryPublicId: cloudinaryResult.public_id,
    cloudinaryUrl: cloudinaryResult.secure_url,
    backupObjectKey: credentials.backup.key,
    bytes: compressed.size,
  }
}

export function EventForm({
  defaultEvent,
  existingMedia,
}: {
  defaultEvent?: EventFormDefaults
  existingMedia?: ExistingEventMedia[]
}) {
  const [state, formAction, pending] = useActionState(saveEvent, initialState)
  useToastOnActionState(state.status, state.message)

  const [fields, setFields] = useState<LocalizedFields>({
    titleEn: defaultEvent?.titleEn ?? "",
    titleFr: defaultEvent?.titleFr ?? "",
    excerptEn: defaultEvent?.excerptEn ?? "",
    excerptFr: defaultEvent?.excerptFr ?? "",
    bodyEn: defaultEvent?.bodyEn ?? "",
    bodyFr: defaultEvent?.bodyFr ?? "",
  })
  const [category, setCategory] = useState(defaultEvent?.category ?? "")

  // Snapshot of the originally-fetched values, captured once on mount and
  // never re-synced - used to disable Save/Publish until something actually
  // changes from what's in the database.
  const original = useRef({
    fields: {
      titleEn: defaultEvent?.titleEn ?? "",
      titleFr: defaultEvent?.titleFr ?? "",
      excerptEn: defaultEvent?.excerptEn ?? "",
      excerptFr: defaultEvent?.excerptFr ?? "",
      bodyEn: defaultEvent?.bodyEn ?? "",
      bodyFr: defaultEvent?.bodyFr ?? "",
    },
    category: defaultEvent?.category ?? "",
  }).current
  const [translating, setTranslating] = useState<
    Partial<Record<keyof LocalizedFields, boolean>>
  >({})
  const [needsTranslationReview, setNeedsTranslationReview] = useState(false)

  const coverInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const [cover, setCover] = useState<CoverUpload | null>(null)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])

  // A saved event already has a stable slug; use it so re-uploads land in
  // the same Cloudinary folder. A new event doesn't have one yet, so derive
  // one from the title once (on the first upload) and stick with it for the
  // rest of this form session, even if the title changes afterwards.
  const newEventFolderRef = useRef<string | null>(null)
  function getEventFolder() {
    if (defaultEvent?.slug) return defaultEvent.slug
    if (!newEventFolderRef.current) {
      const base = fields.titleEn.trim() || "untitled-event"
      newEventFolderRef.current = `${base}-${Date.now().toString(36)}`
    }
    return newEventFolderRef.current
  }

  function setField(key: keyof LocalizedFields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }))
  }

  async function runTranslate(
    pair: FieldPair,
    source: "en" | "fr",
    force = false
  ) {
    const target = source === "en" ? "fr" : "en"
    const sourceKey =
      `${pair}${source === "en" ? "En" : "Fr"}` as keyof LocalizedFields
    const targetKey =
      `${pair}${target === "en" ? "En" : "Fr"}` as keyof LocalizedFields
    const sourceValue = fields[sourceKey].trim()
    if (!sourceValue) return
    if (!force && fields[targetKey].trim()) return

    setTranslating((prev) => ({ ...prev, [targetKey]: true }))
    try {
      const result = await translateField(sourceValue, source, target)
      setField(targetKey, result.text)
      if (result.usedFallback) setNeedsTranslationReview(true)
    } finally {
      setTranslating((prev) => ({ ...prev, [targetKey]: false }))
    }
  }

  function handleCoverChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return

    setCover({ file, status: "compressing", progress: 0 })
    uploadAndCompress(file, getEventFolder(), (status, progress) =>
      setCover((prev) =>
        prev && prev.file === file ? { ...prev, status, progress } : prev
      )
    )
      .then((result) => {
        setCover((prev) =>
          prev && prev.file === file
            ? { ...prev, status: "done", result }
            : prev
        )
      })
      .catch((error: Error) => {
        setCover((prev) =>
          prev && prev.file === file
            ? { ...prev, status: "error", error: error.message }
            : prev
        )
      })
  }

  function handleGalleryChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ""
    if (files.length === 0) return

    const newItems: GalleryItem[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      status: "compressing",
      progress: 0,
    }))
    setGalleryItems((prev) => [...prev, ...newItems])

    const eventFolder = getEventFolder()
    for (const item of newItems) {
      uploadAndCompress(item.file, eventFolder, (status, progress) =>
        setGalleryItems((prev) =>
          prev.map((it) =>
            it.id === item.id ? { ...it, status, progress } : it
          )
        )
      )
        .then((result) => {
          setGalleryItems((prev) =>
            prev.map((it) =>
              it.id === item.id ? { ...it, status: "done", result } : it
            )
          )
        })
        .catch((error: Error) => {
          setGalleryItems((prev) =>
            prev.map((it) =>
              it.id === item.id
                ? { ...it, status: "error", error: error.message }
                : it
            )
          )
        })
    }
  }

  function removeGalleryItem(id: string) {
    setGalleryItems((prev) => prev.filter((item) => item.id !== id))
  }

  const uploadsInFlight =
    cover?.status === "compressing" ||
    cover?.status === "uploading" ||
    galleryItems.some(
      (item) => item.status === "compressing" || item.status === "uploading"
    )

  const galleryMediaJson = JSON.stringify(
    galleryItems
      .filter((item) => item.result)
      .map((item) => item.result as UploadedMedia)
  )

  const isEditMode = Boolean(defaultEvent)
  const isDirty =
    fields.titleEn !== original.fields.titleEn ||
    fields.titleFr !== original.fields.titleFr ||
    fields.excerptEn !== original.fields.excerptEn ||
    fields.excerptFr !== original.fields.excerptFr ||
    fields.bodyEn !== original.fields.bodyEn ||
    fields.bodyFr !== original.fields.bodyFr ||
    category !== original.category ||
    cover !== null ||
    galleryItems.length > 0
  const saveDisabled = pending || uploadsInFlight || (isEditMode && !isDirty)

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      {defaultEvent && (
        <input type="hidden" name="id" value={defaultEvent.id} />
      )}

      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive"
        >
          {state.message}
        </p>
      )}

      {needsTranslationReview && (
        <>
          <p
            role="alert"
            className="border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive"
          >
            Automatic translation was not available for at least one field.
            Double-check the other language&apos;s text before publishing.
          </p>
          <input type="hidden" name="needsTranslationReview" value="true" />
        </>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <LocalizedField
          label="Title (English)"
          htmlFor="titleEn"
          value={fields.titleEn}
          onChange={(value) => setField("titleEn", value)}
          onBlur={() => runTranslate("title", "en")}
          onTranslate={() => runTranslate("title", "en", true)}
          translating={translating.titleEn}
          error={state.fieldErrors?.titleEn}
        />
        <LocalizedField
          label="Title (French)"
          htmlFor="titleFr"
          value={fields.titleFr}
          onChange={(value) => setField("titleFr", value)}
          onBlur={() => runTranslate("title", "fr")}
          onTranslate={() => runTranslate("title", "fr", true)}
          translating={translating.titleFr}
          error={state.fieldErrors?.titleFr}
        />
        <LocalizedField
          label="Excerpt (English)"
          htmlFor="excerptEn"
          value={fields.excerptEn}
          onChange={(value) => setField("excerptEn", value)}
          onBlur={() => runTranslate("excerpt", "en")}
          onTranslate={() => runTranslate("excerpt", "en", true)}
          translating={translating.excerptEn}
          error={state.fieldErrors?.excerptEn}
        />
        <LocalizedField
          label="Excerpt (French)"
          htmlFor="excerptFr"
          value={fields.excerptFr}
          onChange={(value) => setField("excerptFr", value)}
          onBlur={() => runTranslate("excerpt", "fr")}
          onTranslate={() => runTranslate("excerpt", "fr", true)}
          translating={translating.excerptFr}
          error={state.fieldErrors?.excerptFr}
        />
        <Field
          label="Category"
          htmlFor="category"
          error={state.fieldErrors?.category}
        >
          <Input
            id="category"
            name="category"
            placeholder="School Life, Academics, TVET…"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          />
        </Field>

        <Field label="Cover image (optional)" htmlFor="coverImage">
          <div className="flex flex-col gap-2">
            <input
              ref={coverInputRef}
              id="coverImage"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleCoverChange}
            />
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => coverInputRef.current?.click()}
              >
                <ImagePlus />
                {cover ? "Replace cover image" : "Choose cover image"}
              </Button>
              {(cover?.status === "compressing" ||
                cover?.status === "uploading") && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin" />
                  {cover.status === "compressing"
                    ? "Compressing…"
                    : `Uploading ${Math.round(cover.progress * 100)}%`}
                </span>
              )}
            </div>
            {cover && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="max-w-48 truncate">{cover.file.name}</span>
                {cover.status === "error" && (
                  <span className="text-destructive">{cover.error}</span>
                )}
                <button
                  type="button"
                  onClick={() => setCover(null)}
                  aria-label="Remove cover image"
                  className="hover:text-destructive"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            )}
            {!cover && defaultEvent?.coverImageUrl && (
              <p className="text-xs text-muted-foreground">
                Keeping the current cover image unless a new one is chosen.
              </p>
            )}
          </div>
        </Field>
      </div>

      <LocalizedField
        label="Body (English)"
        htmlFor="bodyEn"
        value={fields.bodyEn}
        onChange={(value) => setField("bodyEn", value)}
        onBlur={() => runTranslate("body", "en")}
        onTranslate={() => runTranslate("body", "en", true)}
        translating={translating.bodyEn}
        error={state.fieldErrors?.bodyEn}
        multiline
      />
      <LocalizedField
        label="Body (French)"
        htmlFor="bodyFr"
        value={fields.bodyFr}
        onChange={(value) => setField("bodyFr", value)}
        onBlur={() => runTranslate("body", "fr")}
        onTranslate={() => runTranslate("body", "fr", true)}
        translating={translating.bodyFr}
        error={state.fieldErrors?.bodyFr}
        multiline
      />

      <Field label="Gallery (optional)" htmlFor="galleryMedia">
        <div className="flex flex-col gap-3">
          <input
            ref={galleryInputRef}
            id="galleryMedia"
            type="file"
            multiple
            accept="image/*,video/*"
            className="sr-only"
            onChange={handleGalleryChange}
          />
          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => galleryInputRef.current?.click()}
            >
              <Upload />
              Add photos or videos
            </Button>
          </div>

          {existingMedia && existingMedia.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {existingMedia.map((item) => (
                <div
                  key={item.id}
                  className="flex size-16 items-center justify-center overflow-hidden border border-border bg-muted/40"
                >
                  {item.kind === "video" ? (
                    <FileVideo className="size-5 text-muted-foreground" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.cloudinaryUrl}
                      alt=""
                      className="size-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {galleryItems.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 border border-border px-2 py-1.5 text-xs"
                >
                  <span className="max-w-32 truncate">{item.file.name}</span>
                  {(item.status === "compressing" ||
                    item.status === "uploading") && (
                    <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
                  )}
                  {item.status === "error" && (
                    <span className="text-destructive">Failed</span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeGalleryItem(item.id)}
                    aria-label={`Remove ${item.file.name}`}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Field>
      <input type="hidden" name="galleryMediaJson" value={galleryMediaJson} />
      {cover?.result && (
        <>
          <input
            type="hidden"
            name="coverImagePublicId"
            value={cover.result.cloudinaryPublicId}
          />
          <input
            type="hidden"
            name="coverImageUrl"
            value={cover.result.cloudinaryUrl}
          />
          <input
            type="hidden"
            name="coverImageBackupKey"
            value={cover.result.backupObjectKey}
          />
        </>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex gap-3">
          <Button
            type="submit"
            name="intent"
            value="draft"
            variant="outline"
            disabled={saveDisabled}
            className="h-11 px-6 text-sm"
          >
            {pending ? <Loader2 className="animate-spin" /> : null}
            Save draft
          </Button>
          <Button
            type="submit"
            name="intent"
            value="publish"
            disabled={saveDisabled}
            className="h-11 px-6 text-sm"
          >
            {pending ? <Loader2 className="animate-spin" /> : null}
            Publish
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          A draft only needs a title: every other field can stay empty until
          you&rsquo;re ready to publish.
        </p>
      </div>
    </form>
  )
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? <p className="text-[0.7rem] text-destructive">{error}</p> : null}
    </div>
  )
}

function LocalizedField({
  label,
  htmlFor,
  value,
  onChange,
  onBlur,
  onTranslate,
  translating,
  error,
  multiline,
}: {
  label: string
  htmlFor: string
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  onTranslate: () => void
  translating?: boolean
  error?: string
  multiline?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={htmlFor}>{label}</Label>
        <div className="flex items-center gap-1.5">
          {translating && (
            <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onTranslate}
            aria-label={`Translate ${label}`}
            title="Translate"
          >
            <Languages />
          </Button>
        </div>
      </div>
      {multiline ? (
        <Textarea
          id={htmlFor}
          name={htmlFor}
          rows={8}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
        />
      ) : (
        <Input
          id={htmlFor}
          name={htmlFor}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
        />
      )}
      {error ? <p className="text-[0.7rem] text-destructive">{error}</p> : null}
    </div>
  )
}
