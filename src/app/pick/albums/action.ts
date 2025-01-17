'use server'

import { z } from 'zod'



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

