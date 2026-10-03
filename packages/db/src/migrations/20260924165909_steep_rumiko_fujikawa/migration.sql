CREATE TYPE "user_role" AS ENUM('admin', 'student');--> statement-breakpoint
CREATE TYPE "division" AS ENUM('primary', 'secondary');--> statement-breakpoint
CREATE TYPE "join_request_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "member_specialty" AS ENUM('ui', 'architecture', 'business');--> statement-breakpoint
CREATE TYPE "team_role" AS ENUM('leader', 'developer');--> statement-breakpoint
CREATE TYPE "submission_status" AS ENUM('draft', 'submitted', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL UNIQUE,
	"role" "user_role" DEFAULT 'student'::"user_role" NOT NULL,
	"full_name" text NOT NULL,
	"national_id" text NOT NULL,
	"birthday" date NOT NULL,
	"grade" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "school" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"city" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "join_request" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"team_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"status" "join_request_status" DEFAULT 'pending'::"join_request_status" NOT NULL,
	"grade" text NOT NULL,
	"specialty" "member_specialty",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "join_request_team_user_unique" UNIQUE("team_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "team" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"division" "division" NOT NULL,
	"school_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "team_school_division_unique" UNIQUE("school_id","division")
);
--> statement-breakpoint
CREATE TABLE "team_member" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"team_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"team_role" "team_role" DEFAULT 'developer'::"team_role" NOT NULL,
	"specialty" "member_specialty",
	"grade" text NOT NULL,
	"full_name" text NOT NULL,
	"national_id" text NOT NULL,
	"birthday" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "team_member_team_user_unique" UNIQUE("team_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "submission" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"team_id" uuid NOT NULL CONSTRAINT "submission_team_unique" UNIQUE,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"repo_url" text,
	"status" "submission_status" DEFAULT 'draft'::"submission_status" NOT NULL,
	"school_id" uuid,
	"forwarded_by_user_id" text,
	"forwarded_at" timestamp,
	"reviewed_by_user_id" text,
	"reviewed_at" timestamp,
	"review_note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");--> statement-breakpoint
CREATE UNIQUE INDEX "team_member_leader_unique" ON "team_member" ("team_id") WHERE "team_role" = 'leader';--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "join_request" ADD CONSTRAINT "join_request_team_id_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "join_request" ADD CONSTRAINT "join_request_user_id_user_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profile"("user_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_school_id_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_team_id_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_user_id_user_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profile"("user_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_team_id_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_school_id_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_forwarded_by_user_id_user_profile_user_id_fkey" FOREIGN KEY ("forwarded_by_user_id") REFERENCES "user_profile"("user_id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_reviewed_by_user_id_user_profile_user_id_fkey" FOREIGN KEY ("reviewed_by_user_id") REFERENCES "user_profile"("user_id") ON DELETE SET NULL;