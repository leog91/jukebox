'use server'

import { z } from 'zod'
import { db } from '@/src/db/db';
import { albums } from '@/src/db/schema';


export interface AlbumFormData {
    artist: string;
    name: string;
    cover: string;
}


export interface ActionResponse {
    success: boolean;
    message: string;
    errors?: {
        [K in keyof AlbumFormData]?: string[];
    };
    inputs?: AlbumFormData;
}


const albumSchema = z.object({
    artist: z.string().min(1, 'Album artist is required'),
    name: z.string().min(1, "Album name is required"),
    cover: z.string().optional(),

})

export async function submitAlbum(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> {

    try {
        const rawData: AlbumFormData = {
            artist: formData.get('artist') as string,
            name: formData.get('name') as string,
            cover: formData.get('cover') as string,
        }
        const validatedData = albumSchema.safeParse(rawData)

        if (!validatedData.success) {
            return {
                success: false,
                message: 'Please fix the errors in the form',
                errors: validatedData.error.flatten().fieldErrors,
                inputs: rawData

            }
        }
        try {
            await db.insert(albums)
                .values({
                    name: validatedData.data.name,
                    artist: validatedData.data.artist,
                    coverUrl: validatedData.data.cover

                })

            console.log('Album submitted:', validatedData.data)
        } catch (e: any) {
            console.log('Error:', e)
            if (e.code === 'SQLITE_CONSTRAINT') {
                return {
                    success: false,
                    message: 'Must be unique',
                }
            }
            return {
                success: false,
                message: 'An unexpected error occurred on DB',
            }
        }

        //save data
        console.log('Album submitted:', validatedData.data)

        return {
            success: true,
            message: 'Album saved successfully!',
        }
    } catch (error) {
        return {
            success: false,
            message: 'An unexpected error occurred',
        }
    }
}

