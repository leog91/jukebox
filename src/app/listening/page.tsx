import Link from "next/link";
import { ListeningResults } from "@/src/components/ListeningResults";
import { getPublicListeningUsername, getTopAlbums } from "@/src/lib/lastfm-client";
import { LastfmError, parseListeningPeriod, type ListeningAlbum } from "@/src/lib/lastfm";
import { RetryButton } from "@/src/app/me/listening/RetryButton";

export const metadata = { title: "Listening" };

export default async function Page({ searchParams }: {
  searchParams: Promise<{ period?: string | string[] }>;
}) {
  const period = parseListeningPeriod((await searchParams).period);
  let username: string | null = null;
  let rankedAlbums: ListeningAlbum[] = [];
  let error: string | null = null;
  try {
    username = getPublicListeningUsername();
    if (username) rankedAlbums = await getTopAlbums(username, period);
  } catch (cause) {
    error = cause instanceof LastfmError
      ? cause.message
      : "Could not load the listening history. Please try again later.";
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="mb-2 text-3xl font-light">Listening</h1>
        <p className="mb-6 text-zinc-400">
          {username ? `${username}’s most-played albums on Last.fm.` : "Public Last.fm listening history."}
          {" "}Listening statistics, not favourite ratings or curated selections.
        </p>
        <Link href="/me/listening" className="mb-6 inline-block text-sm text-zinc-300 underline hover:text-white">
          My Listening & settings
        </Link>
        {username ? (
          <ListeningResults username={username} period={period} basePath="/listening" rankedAlbums={rankedAlbums} error={error} />
        ) : error ? (
          <div role="alert" className="rounded-xl bg-neutral-900 p-4"><p>{error}</p><RetryButton /></div>
        ) : (
          <p className="text-zinc-400">No public listening profile has been selected yet.</p>
        )}
      </div>
    </main>
  );
}
