"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/src/db/db";
import { listeningProfiles } from "@/src/db/schema";
import { lastfmUsernameSchema } from "@/src/lib/lastfm";

export type ListeningActionState = { success: boolean; message: string };

export async function saveLastfmUsername(
  _previousState: ListeningActionState, formData: FormData
): Promise<ListeningActionState> {
  const { userId } = await auth();
  if (!userId) return { success: false, message: "Unauthorized" };
  const result = lastfmUsernameSchema.safeParse(formData.get("username"));
  if (!result.success) return { success: false, message: result.error.issues[0].message };
  try {
    await db.insert(listeningProfiles).values({ userId, lastfmUsername: result.data })
      .onConflictDoUpdate({ target: listeningProfiles.userId, set: { lastfmUsername: result.data } });
  } catch {
    return { success: false, message: "Could not save your Last.fm username" };
  }
  revalidatePath("/me/listening");
  return { success: true, message: "Last.fm username saved" };
}

export async function getListeningProfile() {
  const { userId } = await auth();
  if (!userId) return null;
  const [profile] = await db.select().from(listeningProfiles).where(eq(listeningProfiles.userId, userId));
  return profile ?? null;
}
