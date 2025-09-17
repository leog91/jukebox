CREATE TABLE `tags` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_unique` ON `tags` (`name`);--> statement-breakpoint
CREATE TABLE `video_tags` (
	`video_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	PRIMARY KEY(`video_id`, `tag_id`),
	FOREIGN KEY (`video_id`) REFERENCES `videos`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `videos` (
	`id` integer PRIMARY KEY NOT NULL,
	`youtube_id` text NOT NULL,
	`title` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `videos_youtube_id_unique` ON `videos` (`youtube_id`);