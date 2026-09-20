CREATE TABLE "homepage_content" (
	"id" integer PRIMARY KEY NOT NULL,
	"eyebrow_en" text NOT NULL,
	"eyebrow_fr" text NOT NULL,
	"headline_en" text NOT NULL,
	"headline_fr" text NOT NULL,
	"headline_emphasis_en" text NOT NULL,
	"headline_emphasis_fr" text NOT NULL,
	"paragraph_en" text NOT NULL,
	"paragraph_fr" text NOT NULL,
	"callout_value_en" text NOT NULL,
	"callout_value_fr" text NOT NULL,
	"callout_text_en" text NOT NULL,
	"callout_text_fr" text NOT NULL,
	"panel_established_en" text NOT NULL,
	"panel_established_fr" text NOT NULL,
	"stats" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
