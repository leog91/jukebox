import { auth } from "@clerk/nextjs/server";
import { and, eq, sql } from "drizzle-orm";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/src/db/db";
import { artistList, artists, lists } from "@/src/db/schema";
import { ArtistListEditor } from "./ArtistListEditor";
import { ShareToggle } from "./ShareToggle";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const [list] = await db
    .select()
    .from(lists)
    .where(and(eq(lists.id, id), eq(lists.ownerId, userId)));
  if (!list) notFound();

  const listArtists = await db
    .select({ id: artists.id, name: artists.name })
    .from(artistList)
    .innerJoin(artists, eq(artistList.artistId, artists.id))
    .where(eq(artistList.listId, id))
    .orderBy(sql`${artists.name} COLLATE NOCASE asc`);
  const artistIds = new Set(listArtists.map((artist) => artist.id));
  const availableArtists = (await db
    .select({ id: artists.id, name: artists.name })
    .from(artists)
    .orderBy(sql`${artists.name} COLLATE NOCASE asc`)).filter(
    (artist) => !artistIds.has(artist.id)
  );

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-2xl">
        <Link href="/me/lists" className="text-green-400 hover:underline">
          Back to My Lists
        </Link>
        <h1 className="mt-4 text-3xl font-light">{list.name}</h1>
        <p className="mt-2 text-zinc-400">This list is private unless you share it.</p>
        <ArtistListEditor
          listId={list.id}
          artists={listArtists}
          availableArtists={availableArtists}
        />
        <ShareToggle id={list.id} isShared={list.isShared} />
      </div>
    </main>
  );
}
