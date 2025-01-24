CREATE TABLE `albums` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`artist` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`cover_url` text
);
--> statement-breakpoint
DROP TABLE `tests`;--> statement-breakpoint
/*
 SQLite does not support "Drop not null from column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
/*
You're trying to add PRIMARY KEY(artist_id,genre_id) to 'artist_genres' table
SQLite does not support adding primary key to an already created table
You can do it in 3 steps with drizzle orm:
 - create new mirror table with needed pk, rename current table to old_table, generate SQL
 - migrate old data from one table to another
 - delete old_table in schema, generate sql

or create manual migration like below:

ALTER TABLE table_name RENAME TO old_table;
CREATE TABLE table_name (
	column1 datatype [ NULL | NOT NULL ],
	column2 datatype [ NULL | NOT NULL ],
	...
	PRIMARY KEY (pk_col1, pk_col2, ... pk_col_n)
 );
INSERT INTO table_name SELECT * FROM old_table;

Due to that we don't generate migration automatically and it has to be done manually
*/
--> statement-breakpoint
ALTER TABLE genres ADD `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `albums_name_unique` ON `albums` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `artist_genres_id_unique` ON `artist_genres` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `artists_name_unique` ON `artists` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `genres_name_unique` ON `genres` (`name`);