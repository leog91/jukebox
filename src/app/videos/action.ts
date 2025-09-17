"use server";
// import { eq, sql } from "drizzle-orm";

import { db } from "@/src/db/db";
import { videos } from "@/src/db/schema";

export async function getVideos() {
  const videoList = await db.select().from(videos);

  return videoList;
}
