import 'dotenv/config'


import { db } from './db';
import { videos, tags, videoTags } from './schema';
import { musicList } from './../../db/songList';
import { eq } from 'drizzle-orm';

async function seedMedia() {
    for (const { src, title, tags: tagList } of musicList) {
        const youtubeId = src.trim();
        const cleanedTitle = title.trim();

        let [video] = await db.select().from(videos).where(eq(videos.youtubeId, youtubeId));
        if (!video) {
            const inserted = await db
                .insert(videos)
                .values({ youtubeId, title: cleanedTitle })
                .returning();
            video = inserted[0];
        }

        for (const rawTag of tagList) {
            const tagName = rawTag.trim();

            let [tag] = await db.select().from(tags).where(eq(tags.name, tagName));
            if (!tag) {
                const inserted = await db.insert(tags).values({ name: tagName }).returning();
                tag = inserted[0];
            }

            await db
                .insert(videoTags)
                .values({ videoId: video.id, tagId: tag.id })
                .onConflictDoNothing();
        }
    }
    console.log('Seeding done');
}

seedMedia().catch(console.error);
