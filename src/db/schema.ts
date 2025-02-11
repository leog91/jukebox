import { sql } from "drizzle-orm";
import { text, sqliteTable, integer, primaryKey } from "drizzle-orm/sqlite-core";

const foo = sqliteTable("foo", {
    bar: text("bar").notNull().default("Hey!"),
});




export const artists = sqliteTable('artists', {
    id: integer('id').primaryKey(),
    name: text('name')
        .notNull()
        .unique(),
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


export const lists = sqliteTable('lists', {
    id: integer()
        .primaryKey(),
    name: text('name')
        .notNull()
        .unique(),
    createdAt: text('created_at')
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
});


export const artistList = sqliteTable("artist_list", {
    artistId: integer("artist_id")
        .notNull()
        .references(() => artists.id, { onDelete: 'cascade' }),
    listId: integer("list_id")
        .notNull()
        .references(() => lists.id, { onDelete: 'cascade' }),
}, (table) => [
    primaryKey({ columns: [table.artistId, table.listId] }),
]);




export const genres = sqliteTable('genres', {
    id: integer('id').primaryKey(),
    name: text('name').notNull().unique(),
    createdAt: text('created_at')
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
});



