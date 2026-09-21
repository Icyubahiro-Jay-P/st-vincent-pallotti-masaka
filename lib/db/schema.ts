import { relations } from "drizzle-orm"
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

export const events = pgTable(
  "events",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    titleEn: text("title_en").notNull(),
    titleFr: text("title_fr").notNull(),
    excerptEn: text("excerpt_en").notNull(),
    excerptFr: text("excerpt_fr").notNull(),
    bodyEn: text("body_en").notNull(),
    bodyFr: text("body_fr").notNull(),
    category: text("category").notNull(),
    coverImageUrl: text("cover_image_url"),
    // Set once the cover photo goes through the Cloudinary + object-storage
    // pipeline (see lib/media/); null for older events still on @vercel/blob.
    coverImagePublicId: text("cover_image_public_id"),
    coverImageBackupKey: text("cover_image_backup_key"),
    status: text("status").notNull().default("draft"), // "draft" | "published"
    publishedAt: timestamp("published_at", { withTimezone: true }),
    newsletterSentAt: timestamp("newsletter_sent_at", { withTimezone: true }),
    createdBy: text("created_by"),
    // True when a DeepL translation call failed and the FR/EN counterpart
    // field was filled with a verbatim copy of the source text as a
    // fallback (see lib/translate.ts) rather than an actual translation.
    needsTranslationReview: boolean("needs_translation_review")
      .notNull()
      .default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("events_status_publishedAt_idx").on(table.status, table.publishedAt),
  ]
)

export const eventMedia = pgTable(
  "event_media",
  {
    id: serial("id").primaryKey(),
    eventId: integer("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(), // "photo" | "video"
    cloudinaryPublicId: text("cloudinary_public_id").notNull(),
    cloudinaryUrl: text("cloudinary_url").notNull(),
    backupObjectKey: text("backup_object_key").notNull(),
    bytes: integer("bytes"),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("event_media_eventId_idx").on(table.eventId)]
)

export const eventMediaRelations = relations(eventMedia, ({ one }) => ({
  event: one(events, {
    fields: [eventMedia.eventId],
    references: [events.id],
  }),
}))

// Backend-driven replacement for the programs that used to be hardcoded in
// lib/site-config.ts + lib/i18n/dictionaries/{en,fr}.ts. Flat EN/FR columns
// mirror the `events` table convention above rather than a separate
// translations table, since there are only ever two locales.
export const programs = pgTable(
  "programs",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    icon: text("icon").notNull(), // lucide-react icon name, e.g. "Baby"
    position: integer("position").notNull().default(0),
    isPublished: boolean("is_published").notNull().default(true),
    nameEn: text("name_en").notNull(),
    nameFr: text("name_fr").notNull(),
    ageRangeEn: text("age_range_en").notNull(),
    ageRangeFr: text("age_range_fr").notNull(),
    descriptionEn: text("description_en").notNull(),
    descriptionFr: text("description_fr").notNull(),
    overviewEn: text("overview_en").notNull(),
    overviewFr: text("overview_fr").notNull(),
    highlightsEn: text("highlights_en").array().notNull().default([]),
    highlightsFr: text("highlights_fr").array().notNull().default([]),
    needsTranslationReview: boolean("needs_translation_review")
      .notNull()
      .default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("programs_isPublished_position_idx").on(
      table.isPublished,
      table.position
    ),
  ]
)

// Backend-driven replacement for the milestones timeline that used to be
// hardcoded in lib/i18n/dictionaries/{en,fr}.ts's about.milestones.items.
// No slug: milestones are only ever listed on /about, never individually
// routed.
export const milestones = pgTable(
  "milestones",
  {
    id: serial("id").primaryKey(),
    icon: text("icon").notNull(), // lucide-react icon name, e.g. "Sprout"
    position: integer("position").notNull().default(0),
    isPublished: boolean("is_published").notNull().default(true),
    yearEn: text("year_en").notNull(),
    yearFr: text("year_fr").notNull(),
    titleEn: text("title_en").notNull(),
    titleFr: text("title_fr").notNull(),
    descriptionEn: text("description_en").notNull(),
    descriptionFr: text("description_fr").notNull(),
    needsTranslationReview: boolean("needs_translation_review")
      .notNull()
      .default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("milestones_isPublished_position_idx").on(
      table.isPublished,
      table.position
    ),
  ]
)

// Backend-driven replacement for the "What We Stand For" value cards that
// used to be hardcoded in lib/i18n/dictionaries/{en,fr}.ts's
// about.values.items. Same shape as `milestones` minus the year field.
export const values = pgTable(
  "values",
  {
    id: serial("id").primaryKey(),
    icon: text("icon").notNull(), // lucide-react icon name, e.g. "Church"
    position: integer("position").notNull().default(0),
    isPublished: boolean("is_published").notNull().default(true),
    titleEn: text("title_en").notNull(),
    titleFr: text("title_fr").notNull(),
    descriptionEn: text("description_en").notNull(),
    descriptionFr: text("description_fr").notNull(),
    needsTranslationReview: boolean("needs_translation_review")
      .notNull()
      .default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("values_isPublished_position_idx").on(
      table.isPublished,
      table.position
    ),
  ]
)

// Singleton settings row (always id = 1, enforced in the server action, not
// a DB constraint) replacing the locale-independent contact/social fields
// that used to live in lib/site-config.ts's `siteConfig`/`socialLinks`. No
// En/Fr columns: this data doesn't vary between languages (see that file's
// own header comment).
export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey(),
  phoneDisplay: text("phone_display").notNull(),
  phoneHref: text("phone_href").notNull(),
  whatsappNumber: text("whatsapp_number").notNull(),
  email: text("email").notNull(),
  mapsQuery: text("maps_query").notNull(),
  location: text("location").notNull(),
  motto: text("motto").notNull(),
  spiritualMottoLatin: text("spiritual_motto_latin").notNull(),
  instagramUrl: text("instagram_url").notNull(),
  youtubeUrl: text("youtube_url").notNull(),
  facebookUrl: text("facebook_url").notNull(),
  // Nullable, unlike the other social links: not every school has an X
  // account, and there's no seeded value for the existing row.
  xUrl: text("x_url"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export type HomepageStat = {
  valueEn: string
  valueFr: string
  labelEn: string
  labelFr: string
}

// Singleton row (always id = 1, same convention as `siteSettings`)
// replacing the homepage hero copy and stat counters that used to live in
// lib/i18n/dictionaries/{en,fr}.ts's home.hero. applyNow/ourStory stay in
// the dictionary as button-label UI chrome, not admin content.
export const homepageContent = pgTable("homepage_content", {
  id: integer("id").primaryKey(),
  eyebrowEn: text("eyebrow_en").notNull(),
  eyebrowFr: text("eyebrow_fr").notNull(),
  headlineEn: text("headline_en").notNull(),
  headlineFr: text("headline_fr").notNull(),
  headlineEmphasisEn: text("headline_emphasis_en").notNull(),
  headlineEmphasisFr: text("headline_emphasis_fr").notNull(),
  paragraphEn: text("paragraph_en").notNull(),
  paragraphFr: text("paragraph_fr").notNull(),
  calloutValueEn: text("callout_value_en").notNull(),
  calloutValueFr: text("callout_value_fr").notNull(),
  calloutTextEn: text("callout_text_en").notNull(),
  calloutTextFr: text("callout_text_fr").notNull(),
  panelEstablishedEn: text("panel_established_en").notNull(),
  panelEstablishedFr: text("panel_established_fr").notNull(),
  stats: jsonb("stats").$type<HomepageStat[]>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  preferredLocale: text("preferred_locale").notNull().default("en"),
  unsubscribeToken: text("unsubscribe_token").notNull().unique(),
  subscribedAt: timestamp("subscribed_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
})

export const admissionsInquiries = pgTable("admissions_inquiries", {
  id: serial("id").primaryKey(),
  parentName: text("parent_name").notNull(),
  childName: text("child_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  program: text("program").notNull(),
  preferredTerm: text("preferred_term"),
  message: text("message"),
  locale: text("locale").notNull(),
  status: text("status").notNull().default("new"), // "new" | "contacted" | "archived"
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
})

// Shared rate-limit counter for unauthenticated entry points (admin login,
// password reset, public forms) — see lib/rate-limit.ts. Admin CRUD actions
// don't use this: they already require a valid session, so the threat model
// there is "the one trusted admin," not an anonymous attacker.
export const rateLimitAttempts = pgTable(
  "rate_limit_attempts",
  {
    id: serial("id").primaryKey(),
    key: text("key").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("rate_limit_attempts_key_createdAt_idx").on(
      table.key,
      table.createdAt
    ),
  ]
)

// Everything below this line is generated by the Better Auth CLI
// (`npx @better-auth/cli generate --config lib/auth.ts --output
// lib/db/schema.ts`). That command overwrites the whole file rather than
// merging, so re-running it means re-pasting the three app tables above
// back in afterward: a known quirk of this CLI version, not a bug here.
export const admin = pgTable("admin", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => admin.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)]
)

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => admin.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)]
)

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
)

export const adminRelations = relations(admin, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  admin: one(admin, {
    fields: [session.userId],
    references: [admin.id],
  }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  admin: one(admin, {
    fields: [account.userId],
    references: [admin.id],
  }),
}))
