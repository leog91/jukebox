import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/src/db/db";
import { albums } from "@/src/db/schema";
import { isAdmin } from "@/src/lib/auth";
import { getTopAlbums } from "@/src/lib/lastfm-client";
import {
  LastfmError,
  parseListeningPeriod,
  type ListeningAlbum,
} from "@/src/lib/lastfm";
import { getListeningProfile } from "./actions";
import { UsernameForm } from "./UsernameForm";
import { ListeningResults } from "@/src/components/ListeningResults";

export const metadata = { title: "My Listening" };

export default async function Page({ searchParams }: {
  searchParams: Promise<{ period?: string | string[] }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/me/listening");
  const period = parseListeningPeriod((await searchParams).period);
  const profile = await getListeningProfile();
  const admin = await isAdmin();
  let rankedAlbums: ListeningAlbum[] = [];
  let error: string | null = null;
  if (profile) {
    try {
      rankedAlbums = await getTopAlbums(profile.lastfmUsername, period);
    } catch (cause) {
      error = cause instanceof LastfmError
        ? cause.message
        : "Could not load your listening history. Please try again later.";
    }
  }
  const catalog = admin && rankedAlbums.length
    ? await db.select({ name: albums.name, artist: albums.artist }).from(albums)
    : [];

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="mb-2 text-3xl font-light">My Listening</h1>
        <p className="mb-6 text-zinc-400">
          Your most-played albums on Last.fm. Listening statistics, not favourite ratings or curated selections.
        </p>
        <UsernameForm username={profile?.lastfmUsername} />
        {!profile ? (
          <p className="text-zinc-400">Connect your Last.fm username to see your top albums.</p>
        ) : (
          <ListeningResults
            username={profile.lastfmUsername}
            period={period}
            basePath="/me/listening"
            rankedAlbums={rankedAlbums}
            error={error}
            catalog={admin ? catalog : undefined}
          />
        )}
      </div>
    </main>
  );
}
