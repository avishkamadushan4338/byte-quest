ALTER TABLE "team" ADD COLUMN "edit_token" text;--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_edit_token_key" UNIQUE("edit_token");