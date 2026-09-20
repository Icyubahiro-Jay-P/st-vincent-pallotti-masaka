CREATE TABLE "event_media" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"kind" text NOT NULL,
	"cloudinary_public_id" text NOT NULL,
	"cloudinary_url" text NOT NULL,
	"backup_object_key" text NOT NULL,
	"bytes" integer,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "programs" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"icon" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"name_en" text NOT NULL,
	"name_fr" text NOT NULL,
	"age_range_en" text NOT NULL,
	"age_range_fr" text NOT NULL,
	"description_en" text NOT NULL,
	"description_fr" text NOT NULL,
	"overview_en" text NOT NULL,
	"overview_fr" text NOT NULL,
	"highlights_en" text[] DEFAULT '{}' NOT NULL,
	"highlights_fr" text[] DEFAULT '{}' NOT NULL,
	"needs_translation_review" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "programs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "cover_image_public_id" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "cover_image_backup_key" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "needs_translation_review" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "event_media" ADD CONSTRAINT "event_media_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "event_media_eventId_idx" ON "event_media" USING btree ("event_id");