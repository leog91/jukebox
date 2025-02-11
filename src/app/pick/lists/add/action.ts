'use server'

import { z } from 'zod'
import { db } from '@/src/db/db';
import { artists, lists } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { idText } from 'typescript';



export interface CollectionFormData {
    name: string;
}


export interface ActionResponse {
    success: boolean;
    message: string;
    errors?: {
        [K in keyof CollectionFormData]?: string[];
    };
    inputs?: CollectionFormData;
}


const collectionSchema = z.object({
    name: z.string().min(1, "Collection name is required"),
})

export async function submitCollection(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> {

    let artist: {
        name: string;
        id: number;
        createdAt: string;
    }
    //to-do
    console.log("prev", prevState)
    console.log("formData", formData)
    try {
        const rawData: CollectionFormData = {
            name: formData.get('name') as string,
        }
        const validatedData = collectionSchema.safeParse(rawData)

        if (!validatedData.success) {
            return {
                success: false,
                message: 'Please fix the errors in the form',
                errors: validatedData.error.flatten().fieldErrors,
                inputs: rawData
            }
        }


        //get from db
        try {
            const res = ((await db.select().from(artists).where(eq(artists.name, validatedData.data.name))))
            if (res.length > 1) {
                return {
                    success: false,
                    message: 'Must be unique',
                }
            }


            if (res.length === 0) {
                console.log("artist not found")
                return {
                    success: false,
                    message: 'Artist not found',
                }
            }
            artist = res[0]
            console.log("artist from db", artist)

        } catch (e: any) {
            if (e.code === 'SQLITE_CONSTRAINT') {
                return {
                    success: false,
                    message: 'Must be??unique',
                }
            }
            return {
                success: false,
                message: 'An unexpected error occurred on DB',
            }
        }


        // return {
        //     success: true,
        //     message: 'Artist saved successfully!',
        // }

    } catch (error) {
        return {
            success: false,
            message: 'An unexpected error occurred',
        }
    }

    //save to  db 

    // try {
    //     await db.insert(lists)
    //         .values({ name: validatedData.data.name, id: id, artistId: artist.id })
    // } catch (e: any) {
    //     if (e.code === 'SQLITE_CONSTRAINT') {
    //         return {
    //             success: false,
    //             message: 'Must be unique',
    //         }
    //     }
    //     return {
    //         success: false,
    //         message: 'An unexpected error occurred on DB',
    //     }
    // }
    // return {
    //     success: true,
    //     message: 'Artist saved successfully!',
    // }





    console.log("submite collection")
    return {
        success: false,
        message: 'An unexpected error occurred',
    }
}

