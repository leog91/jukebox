"use server";
// import { eq, sql } from "drizzle-orm";

import { db } from "@/src/db/db";
import { videos } from "@/src/db/schema";
import { eq } from 'drizzle-orm'
import { revalidatePath } from "next/cache";

export async function getVideos() {
  const videoList = await db.select().from(videos);

  return videoList;
}

export interface ActionResponse {
  success: boolean
  message: string
}


//check auth
export async function toggleVideoVisibility(
  id: number,
  visible: boolean
): Promise<ActionResponse> {

  console.log('Toggling visibility for video ID:', id, 'to', visible);

  try {
    await db
      .update(videos)
      .set({ visible: visible ? 1 : 0 })
      .where(eq(videos.id, id))

    revalidatePath("/videos");

    return {
      success: true,
      message: `Video visibility updated to ${visible ? 'visible' : 'hidden'}`,
    }
  } catch (error: any) {
    console.error('Error updating visibility:', error)

    return {
      success: false,
      message: 'Failed to update video visibility',
    }
  }
}