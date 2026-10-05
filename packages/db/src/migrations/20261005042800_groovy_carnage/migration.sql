CREATE TYPE "admin_application_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
ALTER TYPE "user_role" ADD VALUE 'mic' BEFORE 'student';--> statement-breakpoint
ALTER TYPE "user_role" ADD VALUE 'leader' BEFORE 'student';--> statement-breakpoint
CREATE TABLE "admin_application" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"username" text NOT NULL,
	"organization" text NOT NULL,
	"role" text NOT NULL,
	"experience" text NOT NULL,
	"status" "admin_application_status" DEFAULT 'pending'::"admin_application_status" NOT NULL,
	"reviewed_by_user_id" text,
	"reviewed_at" timestamp,
	"review_note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "username" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "display_username" text;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_username_key" UNIQUE("username");--> statement-breakpoint
CREATE INDEX "user_username_idx" ON "user" ("username");--> statement-breakpoint
CREATE UNIQUE INDEX "admin_application_username_unique" ON "admin_application" ("username");--> statement-breakpoint
CREATE INDEX "admin_application_status_idx" ON "admin_application" ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "admin_application_pending_unique" ON "admin_application" ("email") WHERE "status" = 'pending';--> statement-breakpoint
ALTER TABLE "admin_application" ADD CONSTRAINT "admin_application_reviewed_by_user_id_user_profile_user_id_fkey" FOREIGN KEY ("reviewed_by_user_id") REFERENCES "user_profile"("user_id") ON DELETE SET NULL;