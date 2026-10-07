CREATE TABLE `cms_image` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`mime_type` text DEFAULT 'image/webp' NOT NULL,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	`size_bytes` integer NOT NULL,
	`data` blob NOT NULL,
	`uploaded_by_user_id` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`uploaded_by_user_id`) REFERENCES `user_profile`(`user_id`) ON UPDATE no action ON DELETE set null
);
