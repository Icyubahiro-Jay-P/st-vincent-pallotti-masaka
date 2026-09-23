CREATE INDEX "events_status_publishedAt_idx" ON "events" USING btree ("status","published_at");--> statement-breakpoint
CREATE INDEX "milestones_isPublished_position_idx" ON "milestones" USING btree ("is_published","position");--> statement-breakpoint
CREATE INDEX "programs_isPublished_position_idx" ON "programs" USING btree ("is_published","position");--> statement-breakpoint
CREATE INDEX "values_isPublished_position_idx" ON "values" USING btree ("is_published","position");