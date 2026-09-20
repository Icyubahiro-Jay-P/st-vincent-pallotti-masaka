CREATE TABLE "site_settings" (
	"id" integer PRIMARY KEY NOT NULL,
	"phone_display" text NOT NULL,
	"phone_href" text NOT NULL,
	"whatsapp_number" text NOT NULL,
	"email" text NOT NULL,
	"maps_query" text NOT NULL,
	"location" text NOT NULL,
	"motto" text NOT NULL,
	"spiritual_motto_latin" text NOT NULL,
	"instagram_url" text NOT NULL,
	"youtube_url" text NOT NULL,
	"facebook_url" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
