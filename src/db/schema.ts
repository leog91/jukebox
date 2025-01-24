import { sql } from "drizzle-orm";
import { text, sqliteTable, integer, primaryKey } from "drizzle-orm/sqlite-core";

const foo = sqliteTable("foo", {
    bar: text("bar").notNull().default("Hey!"),
});




export const artists = sqliteTable('artists', {
    id: integer('id').primaryKey(),
    name: text('name')
        .notNull(),
    // .unique(),
    createdAt: text('created_at')
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
});






export const albums = sqliteTable("albums", {
    id: integer()
        .primaryKey()
        .notNull(),
    name: text()
        .notNull(),
    artist: text()
        .notNull(),
    createdAt: text("created_at")
        .default("sql`(CURRENT_TIMESTAMP)`")
        .notNull(),
    coverUrl: text("cover_url"),
});



export const genres = sqliteTable('genres', {
    id: integer('id').primaryKey(),
    name: text('name').notNull().unique(),
    createdAt: text('created_at')
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
});



