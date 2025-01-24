"use server";
// import { eq, sql } from "drizzle-orm";



import { db } from "@/src/db/db";
import { albums } from "@/src/db/schema";


// Fisher-Yates Shuffle
function shuffleAlbums(albums: {
    id: number;
    name: string;
    artist: string;
    createdAt: string;
    coverUrl: string | null;
}[]) {
    for (let i = albums.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [albums[i], albums[j]] = [albums[j], albums[i]];
    }
    return albums;
}


export async function getAlbums() {

    // const itemsPerPage = 50


    const result = await db.select()
        .from(albums)
    // .orderBy(sql`${artists.name} COLLATE NOCASE asc`)
    // .limit(itemsPerPage)
    // .offset(page * itemsPerPage)

    //


    return shuffleAlbums(result)
    // return result
}
