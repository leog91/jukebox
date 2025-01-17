import { sql } from "drizzle-orm";
import { text, sqliteTable, integer, primaryKey } from "drizzle-orm/sqlite-core";

const foo = sqliteTable("foo", {
    bar: text("bar").notNull().default("Hey!"),
});


export const users = sqliteTable('users', {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').unique().notNull(),
});


export const posts = sqliteTable('posts', {
    id: integer('id').primaryKey(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    userId: integer('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: text('created_at')
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
});




export const tests = sqliteTable('tests', {
    id: integer('id').primaryKey(),
    text: text('text').notNull(),

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





export const genres = sqliteTable('genres', {
    id: integer('id').primaryKey(),
    name: text('name').notNull().unique(),
    createdAt: text('created_at')
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
});

export const artistGenres = sqliteTable('artist_genres', {
    id: integer('id').unique(),
    artistId: integer('artist_id')
        .notNull()
        .references(() => artists.id, { onDelete: 'cascade' }),
    genreId: integer('genre_id')
        .notNull()
        .references(() => genres.id)
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.artistId, table.genreId] }),
    };
});








export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;
export type SelectPost = typeof posts.$inferSelect;

