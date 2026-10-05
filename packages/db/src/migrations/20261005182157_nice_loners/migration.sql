ALTER TABLE "school" ADD COLUMN "province" text;--> statement-breakpoint
ALTER TABLE "school" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "idea" text;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "teacher_name" text;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "teacher_designation" text;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "teacher_phone" text;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "teacher_email" text;--> statement-breakpoint
ALTER TABLE "team" ADD COLUMN "principal_name" text;--> statement-breakpoint
ALTER TABLE "team_member" ADD COLUMN "class_name" text;--> statement-breakpoint
ALTER TABLE "team_member" ADD COLUMN "admission_number" text;--> statement-breakpoint
ALTER TABLE "team_member" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "team_member" ALTER COLUMN "national_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "team_member" ALTER COLUMN "birthday" DROP NOT NULL;