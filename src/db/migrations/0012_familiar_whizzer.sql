DROP INDEX `lists_name_unique`;--> statement-breakpoint
ALTER TABLE `lists` ADD `owner_id` text NOT NULL;--> statement-breakpoint
ALTER TABLE `lists` ADD `is_shared` integer DEFAULT false NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `lists_owner_name_unique` ON `lists` (`owner_id`,`name`);
