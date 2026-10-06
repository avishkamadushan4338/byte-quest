CREATE TYPE "volunteer_application_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
ALTER TYPE "user_role" ADD VALUE 'volunteer';--> statement-breakpoint
CREATE TABLE "volunteer_application" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"teams" text[] NOT NULL,
	"full_name" text NOT NULL,
	"school" text NOT NULL,
	"admission_number" text,
	"grade" text NOT NULL,
	"class_name" text NOT NULL,
	"contact_number" text NOT NULL,
	"email" text,
	"guardian_name" text NOT NULL,
	"guardian_relationship" text,
	"guardian_contact_number" text NOT NULL,
	"guardian_alternate_contact_number" text,
	"status" "volunteer_application_status" DEFAULT 'pending'::"volunteer_application_status" NOT NULL,
	"user_id" text,
	"reviewed_by_user_id" text,
	"reviewed_at" timestamp,
	"review_note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "volunteer_application" ADD CONSTRAINT "volunteer_application_user_id_user_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profile"("user_id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "volunteer_application" ADD CONSTRAINT "volunteer_application_ak3pu6EsBbv5_fkey" FOREIGN KEY ("reviewed_by_user_id") REFERENCES "user_profile"("user_id") ON DELETE SET NULL;