"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/src/db/db";
import { artistList, artists, lists } from "@/src/db/schema";

export type ListActionState = {
  success: boolean;
  message: string;
};

const listSchema = z.object({
  name: z.string().trim().min(1, "List name is required").max(80),
});

async function getUserId() {
  const { userId } = await auth();
  return userId;
}

export async function createList(
  _previousState: ListActionState,
  formData: FormData
): Promise<ListActionState> {
  const userId = await getUserId();
  if (!userId) return { success: false, message: "Unauthorized" };

  const result = listSchema.safeParse({ name: formData.get("name") });
  if (!result.success) {
    return { success: false, message: result.error.issues[0].message };
  }

  try {
    await db.insert(lists).values({ name: result.data.name, ownerId: userId });
    revalidatePath("/me/lists");
    return { success: true, message: "List created" };
  } catch (error: any) {
    if (error.code === "SQLITE_CONSTRAINT") {
      return { success: false, message: "You already have a list with this name" };
    }
    return { success: false, message: "Could not create the list" };
  }
}

export async function updateListSharing(
  _previousState: ListActionState,
  formData: FormData
): Promise<ListActionState> {
  const userId = await getUserId();
  if (!userId) return { success: false, message: "Unauthorized" };

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) {
    return { success: false, message: "Invalid list" };
  }

  const isShared = formData.get("isShared") === "on";
  const updated = await db
    .update(lists)
    .set({ isShared })
    .where(and(eq(lists.id, id), eq(lists.ownerId, userId)))
    .returning({ id: lists.id });

  if (updated.length === 0) {
    return { success: false, message: "List not found" };
  }

  revalidatePath(`/me/lists/${id}`);
  revalidatePath(`/lists/${id}`);
  return {
    success: true,
    message: isShared ? "List is now shared" : "List is now private",
  };
}

async function canEditList(listId: number, userId: string) {
  const [list] = await db
    .select({ id: lists.id })
    .from(lists)
    .where(and(eq(lists.id, listId), eq(lists.ownerId, userId)));

  return Boolean(list);
}

function getListAndArtistIds(formData: FormData) {
  const listId = Number(formData.get("listId"));
  const artistId = Number(formData.get("artistId"));

  return {
    listId: Number.isInteger(listId) && listId > 0 ? listId : null,
    artistId: Number.isInteger(artistId) && artistId > 0 ? artistId : null,
  };
}

export async function addArtistToList(
  _previousState: ListActionState,
  formData: FormData
): Promise<ListActionState> {
  const userId = await getUserId();
  if (!userId) return { success: false, message: "Unauthorized" };

  const { listId, artistId } = getListAndArtistIds(formData);
  if (!listId || !artistId) return { success: false, message: "Invalid artist or list" };
  if (!(await canEditList(listId, userId))) {
    return { success: false, message: "List not found" };
  }

  const [artist] = await db
    .select({ id: artists.id })
    .from(artists)
    .where(eq(artists.id, artistId));
  if (!artist) return { success: false, message: "Artist not found" };

  await db
    .insert(artistList)
    .values({ listId, artistId })
    .onConflictDoNothing();

  revalidatePath(`/me/lists/${listId}`);
  revalidatePath(`/lists/${listId}`);
  return { success: true, message: "Artist added to list" };
}

export async function removeArtistFromList(
  _previousState: ListActionState,
  formData: FormData
): Promise<ListActionState> {
  const userId = await getUserId();
  if (!userId) return { success: false, message: "Unauthorized" };

  const { listId, artistId } = getListAndArtistIds(formData);
  if (!listId || !artistId) return { success: false, message: "Invalid artist or list" };
  if (!(await canEditList(listId, userId))) {
    return { success: false, message: "List not found" };
  }

  await db
    .delete(artistList)
    .where(and(eq(artistList.listId, listId), eq(artistList.artistId, artistId)));

  revalidatePath(`/me/lists/${listId}`);
  revalidatePath(`/lists/${listId}`);
  return { success: true, message: "Artist removed from list" };
}
