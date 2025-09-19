DROP INDEX "artists_name_unique";--> statement-breakpoint
DROP INDEX "genres_name_unique";--> statement-breakpoint
DROP INDEX "lists_name_unique";--> statement-breakpoint
DROP INDEX "tags_name_unique";--> statement-breakpoint
DROP INDEX "videos_youtube_id_unique";--> statement-breakpoint
ALTER TABLE `albums` ALTER COLUMN "created_at" TO "created_at" text NOT NULL DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
CREATE UNIQUE INDEX `artists_name_unique` ON `artists` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `genres_name_unique` ON `genres` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `lists_name_unique` ON `lists` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_unique` ON `tags` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `videos_youtube_id_unique` ON `videos` (`youtube_id`);--> statement-breakpoint
ALTER TABLE `videos` ADD `visible` integer DEFAULT 1 NOT NULL;