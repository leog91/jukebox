'use server'

import { z } from 'zod'
import { db } from '@/src/db/db';
import { videos } from '@/src/db/schema';

function extractYoutubeId(input: string): string | null {
    const trimmed = input.trim();

    if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) {
        return trimmed;
    }

    let urlString = trimmed;
    if (!/^https?:\/\//i.test(trimmed) && trimmed.includes('.')) {
        urlString = `https://${trimmed}`;
    }

    try {
        const url = new URL(urlString);
        const pathname = url.pathname.endsWith('/') ? url.pathname.slice(0, -1) : url.pathname;
        const host = url.hostname.replace(/^(www|m)\./, '').toLowerCase();

        if (host === 'youtube.com' || host === 'music.youtube.com') {
            if (pathname === '/watch') {
                const v = url.searchParams.get('v');
                if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) {
                    return v;
                }
            }

            const pathParts = pathname.split('/').filter(Boolean);
            if (pathParts.length >= 2) {
                const segment = pathParts[0];
                const id = pathParts[1];
                const validSegments = ['embed', 'v', 'shorts', 'live'];
                if (id && validSegments.includes(segment) && /^[A-Za-z0-9_-]{11}$/.test(id)) {
                    return id;
                }
            }
        }

        if (host === 'youtu.be') {
            const id = pathname.split('/').filter(Boolean)[0];
            if (id && /^[A-Za-z0-9_-]{11}$/.test(id)) {
                return id;
            }
        }
    } catch {
        // not a valid URL
    }

    const fallback = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/|youtube\.com\/live\/)([A-Za-z0-9_-]{11})/.exec(trimmed);
    if (fallback) {
        return fallback[1];
    }

    return null;
}

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
    youtubeId: z.string()
        .min(1, 'YouTube URL or video ID is required')
        .transform((val) => extractYoutubeId(val) ?? ''),
    title: z.string().min(1, "Video title is required"),
}).refine((data) => /^[A-Za-z0-9_-]{11}$/.test(data.youtubeId), {
    message: 'Invalid YouTube URL or video ID',
    path: ['youtubeId'],
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
