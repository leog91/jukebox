"use server";
import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { artists, tests, users } from "../db/schema"
import { redirect } from "next/navigation";


export async function submit(form: FormData) {

    const name = form.get("text") + "";
    // console.log(text)
    // if (!/^[\p{Emoji}]+$/u.test(text)) return;
    // await db.insert(todosTable).values({ text });


    try {
        await db.insert(artists).values({ name })
    } catch (e) {
        console.log("qwe")
        return { msg: "maybe not unique" }
    }

    //revalidate?
    redirect("/pick");
}


export async function addGenre(form: FormData) {

    const name = form.get("text") + "";
    // console.log(text)
    // if (!/^[\p{Emoji}]+$/u.test(text)) return;
    // await db.insert(todosTable).values({ text });


    // try {
    //     await db.insert(artists).values({ name })
    // } catch (e) {
    //     console.log("qwe")
    //     return { msg: "maybe not unique" }
    // }

    //revalidate?
    // redirect("/pick");
}



export async function getArtists() {




    const result = await db.select()
        .from(artists)
        .limit(50)


    return result


}



export async function getArtist(artistName: string) {

    return await db.select().from(artists).where(eq(artists.name, artistName))

}