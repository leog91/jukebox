import Link from "next/link";
import { listeningPeriods, type ListeningAlbum, type ListeningPeriod } from "@/src/lib/lastfm";
import { AlbumArtwork } from "@/src/app/me/listening/AlbumArtwork";
import { RetryButton } from "@/src/app/me/listening/RetryButton";

export function ListeningResults({ username, period, basePath, rankedAlbums, error, catalog }: {
  username: string;
  period: ListeningPeriod;
  basePath: "/listening" | "/me/listening";
  rankedAlbums: ListeningAlbum[];
  error: string | null;
  // Only the authenticated admin dashboard supplies a catalog for import controls.
  catalog?: { name: string; artist: string }[];
}) {
  return (
    <>
      <nav aria-label="Listening period" className="mb-6 flex flex-wrap gap-2">
        {listeningPeriods.map((option) => (
          <Link
            key={option.value}
            href={`${basePath}?period=${option.value}`}
            prefetch={false}
            aria-current={period === option.value ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-sm ${
              period === option.value
                ? "bg-white text-black"
                : "bg-neutral-800 text-zinc-300 hover:bg-neutral-700"
            }`}
          >
            {option.label}
          </Link>
        ))}
      </nav>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm text-zinc-400">
        <a
          href={`https://www.last.fm/user/${encodeURIComponent(username)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white"
        >
          {username} on Last.fm ↗
        </a>
        <span>Top 50 albums · Cached for 6 hours</span>
      </div>
      {error ? (
        <div role="alert" className="rounded-xl bg-neutral-900 p-4">
          <p>{error}</p>
          <RetryButton />
        </div>
      ) : rankedAlbums.length === 0 ? (
        <p className="text-zinc-400">No albums scrobbled in this period yet. Try a longer period.</p>
      ) : (
        <ol className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {rankedAlbums.map((album) => {
            const inCatalog = catalog?.some((saved) =>
              saved.artist.trim().toLowerCase() === album.artist.trim().toLowerCase()
              && saved.name.trim().toLowerCase() === album.name.trim().toLowerCase()
            );
            const prefill = new URLSearchParams({
              artist: album.artist,
              name: album.name,
              cover: album.artwork ?? "",
            });
            return (
              <li key={`${album.rank}-${album.artist}-${album.name}`} className="min-w-0 rounded-xl bg-neutral-900 p-3">
                <a href={album.url} target="_blank" rel="noopener noreferrer" className="block hover:text-green-400">
                  <AlbumArtwork key={album.artwork} src={album.artwork} name={album.name} />
                  <p className="text-sm text-zinc-400">
                    #{album.rank} · {album.playCount.toLocaleString("en-US")} {album.playCount === 1 ? "play" : "plays"}
                  </p>
                  <h2 className="mt-1 break-words font-medium">{album.name}</h2>
                  <p className="break-words text-sm text-zinc-400">{album.artist}</p>
                  <span className="mt-2 inline-block text-xs text-zinc-400">View on Last.fm ↗</span>
                </a>
                {catalog && (inCatalog ? (
                  <p className="mt-3 text-sm text-green-400">In curated catalog</p>
                ) : (
                  <Link
                    href={`/albums/add?${prefill}`}
                    className="mt-3 inline-block rounded-full bg-green-500 px-3 py-2 text-sm font-semibold text-black hover:bg-green-400"
                  >
                    Add to catalog
                  </Link>
                ))}
              </li>
            );
          })}
        </ol>
      )}
    </>
  );
}
