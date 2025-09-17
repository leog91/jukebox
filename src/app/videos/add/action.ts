'use server'

import { z } from 'zod'
import { db } from '@/src/db/db';
import { videos } from '@/src/db/schema';


export interface VideoFormData {
    youtubeId: string;
    title: string;
}


export interface ActionResponse {
    success: boolean;
    message: string;
    errors?: {
        [K in keyof VideoFormData]?: string[];
    };
    inputs?: VideoFormData;
}


const videoSchema = z.object({
    youtubeId: z.string().min(1, 'video Id is required'),
    title: z.string().min(1, "Video title is required"),
})

export async function submitVideo(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> {

    try {
        const rawData: VideoFormData = {
            youtubeId: formData.get('youtubeId') as string,
            title: formData.get('title') as string,

        }
        const validatedData = videoSchema.safeParse(rawData)

        if (!validatedData.success) {
            return {
                success: false,
                message: 'Please fix the errors in the form',
                errors: validatedData.error.flatten().fieldErrors,
                inputs: rawData

            }
        }
        try {
            await db.insert(videos)
                .values({
                    title: validatedData.data.title,
                    youtubeId: validatedData.data.youtubeId,
                })

            console.log('Video submitted:', validatedData.data)
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
        console.log('Video submitted:', validatedData.data)

        return {
            success: true,
            message: 'Video saved successfully!',
        }
    } catch (error) {
        return {
            success: false,
            message: 'An unexpected error occurred',
        }
    }
}

