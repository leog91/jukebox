"use server"


import { db } from "@/src/db/db";
import { artists } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from 'next/navigation'



export interface ActionResponse {
    success: boolean;
    message: string;
    artist: Artist
}


export type Artist = {
    id: number;
    name: string;
    createdAt: string;
};



export async function deleteArtist(artistParam: Artist): Promise<ActionResponse> {

    try {
        //limit not working
        const deletedArtist = await db.delete(artists).where(eq(artists.id, artistParam.id))
            .returning()
        console.log(deletedArtist)
        // return {
        //     success: true,
        //     message: 'Artist deleted!',
        //     artist: deletedArtist[0]
        // }
    } catch (e: any) {

        //refresh, or show error, etc
        console.log(e)
        return {
            success: false,
            message: 'error deleting artist',
            artist: artistParam
        }


    }

    redirect('/pick')

}

