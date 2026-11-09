ALTER TABLE `team` ADD `reference_code` text;--> statement-breakpoint
ALTER TABLE `team` ADD `leader_email` text;--> statement-breakpoint
CREATE UNIQUE INDEX `team_reference_code_unique` ON `team` (`reference_code`);--> statement-breakpoint
ALTER TABLE `team_member` ADD `whatsapp` text;--> statement-breakpoint
ALTER TABLE `team_member` ADD `address` text;--> statement-breakpoint
ALTER TABLE `team_member` ADD `guardian_name` text;--> statement-breakpoint
ALTER TABLE `team_member` ADD `guardian_phone` text;--> statement-breakpoint
ALTER TABLE `team_member` ADD `is_presenter` integer DEFAULT false NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `team_member_presenter_unique` ON `team_member` (`team_id`) WHERE "team_member"."is_presenter" = 1;