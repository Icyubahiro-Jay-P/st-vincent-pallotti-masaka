CREATE TABLE "rate_limit_attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "rate_limit_attempts_key_createdAt_idx" ON "rate_limit_attempts" USING btree ("key","created_at");