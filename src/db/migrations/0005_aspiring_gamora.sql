CREATE TABLE `posts` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`user_id` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tests` (
	`id` integer PRIMARY KEY NOT NULL,
	`text` text NOT NULL
);
--> statement-breakpoint
DROP INDEX `albums_name_unique`;--> statement-breakpoint
DROP INDEX "artist_genres_id_unique";--> statement-breakpoint
DROP INDEX "genres_name_unique";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
ALTER TABLE `albums` ALTER COLUMN "created_at" TO "created_at" text NOT NULL DEFAULT 'sql`(CURRENT_TIMESTAMP)`';--> statement-breakpoint
CREATE UNIQUE INDEX `artist_genres_id_unique` ON `artist_genres` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `genres_name_unique` ON `genres` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
DROP INDEX `artists_name_unique`;