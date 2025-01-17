'use server'

import { z } from 'zod'
import { db } from '@/src/db/db';
import { artists } from '@/src/db/schema';


export interface ArtistFormData {
    name: string;
}


export interface ActionResponse {
    success: boolean;
    message: string;
    errors?: {
        [K in keyof ArtistFormData]?: string[];
    };
    inputs?: ArtistFormData;
}


const artistSchema = z.object({
    name: z.string().min(1, "Artist name is required"),
})

export async function submitArtist(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> {

    try {
        const rawData: ArtistFormData = {
            name: formData.get('name') as string,
        }
        const validatedData = artistSchema.safeParse(rawData)

        if (!validatedData.success) {
            return {
                success: false,
                message: 'Please fix the errors in the form',
                errors: validatedData.error.flatten().fieldErrors,
                inputs: rawData
            }
        }
        //save data
        try {
            await db.insert(artists)
                .values({ name: validatedData.data.name })
        } catch (e: any) {
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
        return {
            success: true,
            message: 'Artist saved successfully!',
        }

    } catch (error) {
        return {
            success: false,
            message: 'An unexpected error occurred',
        }
    }
}

