"use server";

import { db } from "@/src/db/db";
import { videos } from "@/src/db/schema";
import { eq, isNull, isNotNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

export interface ActionResponse {
  success: boolean;
  message: string;
}

async function checkIsAdmin(): Promise<boolean> {
  const user = await currentUser();
  return process.env.ADMIN_EMAIL === user?.emailAddresses[0]?.emailAddress;
}

export async function getVideos() {
  const videoList = await db
    .select()
    .from(videos)
    .where(isNull(videos.deletedAt));

  return videoList;
}

export async function getTrashedVideos() {
  const videoList = await db
    .select()
    .from(videos)
    .where(isNotNull(videos.deletedAt));

  return videoList;
}

export async function toggleVideoVisibility(
  id: number,
  visible: boolean
): Promise<ActionResponse> {
  if (!(await checkIsAdmin())) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    await db
      .update(videos)
      .set({ visible: visible ? 1 : 0 })
      .where(eq(videos.id, id));

    revalidatePath("/");

    return {
      success: true,
      message: `Video visibility updated to ${visible ? "visible" : "hidden"}`,
    };
  } catch (error: any) {
    console.error("Error updating visibility:", error);

    return {
      success: false,
      message: "Failed to update video visibility",
    };
  }
}

export async function softDeleteVideo(id: number): Promise<ActionResponse> {
  if (!(await checkIsAdmin())) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    await db
      .update(videos)
      .set({ deletedAt: new Date().toISOString() })
      .where(eq(videos.id, id));

    revalidatePath("/");
    revalidatePath("/videos/trash");

    return {
      success: true,
      message: "Video moved to trash",
    };
  } catch (error: any) {
    console.error("Error moving video to trash:", error);

    return {
      success: false,
      message: "Failed to move video to trash",
    };
  }
}

export async function restoreVideo(id: number): Promise<ActionResponse> {
  if (!(await checkIsAdmin())) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    await db
      .update(videos)
      .set({ deletedAt: null })
      .where(eq(videos.id, id));

    revalidatePath("/");
    revalidatePath("/videos/trash");

    return {
      success: true,
      message: "Video restored",
    };
  } catch (error: any) {
    console.error("Error restoring video:", error);

    return {
      success: false,
      message: "Failed to restore video",
    };
  }
}

export async function permanentlyDeleteVideo(
  id: number
): Promise<ActionResponse> {
  if (!(await checkIsAdmin())) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    await db.delete(videos).where(eq(videos.id, id));

    revalidatePath("/");
    revalidatePath("/videos/trash");

    return {
      success: true,
      message: "Video permanently deleted",
    };
  } catch (error: any) {
    console.error("Error deleting video:", error);

    return {
      success: false,
      message: "Failed to delete video",
    };
  }
}
