import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/src/db/db";
import { artistList, artists, lists } from "@/src/db/schema";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const [list] = await db
    .select({ id: lists.id, name: lists.name })
    .from(lists)
    .where(and(eq(lists.id, id), eq(lists.isShared, true)));
  if (!list) notFound();

  const listArtists = await db
    .select({ id: artists.id, name: artists.name })
    .from(artistList)
    .innerJoin(artists, eq(artistList.artistId, artists.id))
    .where(eq(artistList.listId, id));

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-2xl">
        <p className="text-sm uppercase tracking-wide text-zinc-400">Shared list</p>
        <h1 className="mt-2 text-3xl font-light">{list.name}</h1>
        {listArtists.length === 0 ? (
          <p className="mt-4 text-zinc-400">No artists in this list yet.</p>
        ) : (
          <ul className="mt-6 divide-y divide-zinc-800 rounded-lg bg-neutral-900">
            {listArtists.map((artist) => (
              <li key={artist.id} className="px-4 py-3">
                {artist.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
