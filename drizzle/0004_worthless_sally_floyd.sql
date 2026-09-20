CREATE TABLE "values" (
	"id" serial PRIMARY KEY NOT NULL,
	"icon" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"title_en" text NOT NULL,
	"title_fr" text NOT NULL,
	"description_en" text NOT NULL,
	"description_fr" text NOT NULL,
	"needs_translation_review" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
