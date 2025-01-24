"use server";
import { eq, sql } from "drizzle-orm";
import { db } from "../db/db";
import { artists, genres } from "../db/schema"
import { redirect } from "next/navigation";


export async function submit(form: FormData) {

    const name = form.get("text") + "";
    // console.log(text)
    // if (!/^[\p{Emoji}]+$/u.test(text)) return;
    // await db.insert(todosTable).values({ text });


    try {
        await db.insert(artists).values({ name })
    } catch (e) {
        console.log("addArtist =>", e)
        //fix msg
        return { msg: "maybe not unique" }
    }

    //revalidate?
    redirect("/pick");
}


export async function addGenre(form: FormData) {

    const name = form.get("genre") + "";
    // console.log(text)
    // if (!/^[\p{Emoji}]+$/u.test(text)) return;
    // await db.insert(todosTable).values({ text });


    try {
        await db.insert(genres).values({ name })
    } catch (e) {
        console.log("addGenre =>", e)
        //fix msg
        return { msg: "maybe not unique" }
    }

    //revalidate?
    redirect("/pick/add");
}


export async function addArtistWithGenre(form: FormData) {



    const name = form.get("name") + ""
    const genresInput = form.getAll("genre") + "";




    // try {
    //     await db.insert(artists).values({ name })
    // } catch (e) {
    //     console.log("addArtist =>", e)
    //     //fix msg
    //     return { msg: "maybe not unique" }
    // }

    // TO_+DO split 
    const genresArr = genresInput.split(",")

    genresArr.forEach(async (g) => {
        try {
            await db.insert(genres).values({ name })
        } catch (e) {
            console.log("addGenre =>", e, " elem =>", g)
            //fix msg
            return { msg: "maybe not unique" }
        }

    });

    // try {
    //     await db.insert(genres).values({ name })
    // } catch (e) {
    //     console.log("addGenre =>", e)
    //     //fix msg
    //     return { msg: "maybe not unique" }
    // }

    //revalidate?
    // redirect("/pick/add");
}





export async function getArtists(page = 0) {

    const itemsPerPage = 50


    const result = await db.select()
        .from(artists)
        .orderBy(sql`${artists.name} COLLATE NOCASE asc`)
        .limit(itemsPerPage)
        .offset(page * itemsPerPage)



    return result
}


export async function getGenres() {
    const result = await db.select()
        .from(genres)

    return result
}




export async function getArtist(artistName: string) {

    return await db.select().from(artists).where(eq(artists.name, artistName))

}