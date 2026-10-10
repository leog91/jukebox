'use server'

import { z } from 'zod'
import { db } from '@/src/db/db';
import { albums } from '@/src/db/schema';
import { isAdmin } from "@/src/lib/auth";
import { sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";


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
    artist: z.string().trim().min(1, 'Album artist is required').max(100),
    name: z.string().trim().min(1, "Album name is required").max(100),
    cover: z.union([z.literal(""), z.url().max(2048).refine((value) => ["https:", "http:"].includes(new URL(value).protocol), "Use an HTTP or HTTPS artwork URL")]).optional(),

})

export async function submitAlbum(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> {

    try {
        if (!(await isAdmin())) {
            return {
                success: false,
                message: "Unauthorized",
            }
        }

        const rawData: AlbumFormData = {
            artist: typeof formData.get('artist') === 'string' ? formData.get('artist') as string : '',
            name: typeof formData.get('name') === 'string' ? formData.get('name') as string : '',
            cover: typeof formData.get('cover') === 'string' ? formData.get('cover') as string : '',
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
            const { name, artist, cover } = validatedData.data;
            // A single SQLite statement makes the duplicate check atomic, including
            // concurrent submissions. No changes to existing catalog rows are needed.
            const saved = await db.all<{ id: number }>(sql`
                INSERT INTO ${albums} (name, artist, cover_url)
                SELECT ${name}, ${artist}, ${cover || null}
                WHERE NOT EXISTS (
                    SELECT 1 FROM ${albums}
                    WHERE lower(trim(${albums.name})) = lower(${name})
                      AND lower(trim(${albums.artist})) = lower(${artist})
                )
                RETURNING id
            `);
            if (saved.length === 0) {
                return { success: false, message: 'This artist and album are already in the curated catalog', inputs: rawData };
            }
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

        revalidatePath('/albums');
        revalidatePath('/me/listening');

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
