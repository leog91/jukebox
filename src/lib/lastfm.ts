import { z } from "zod";

export const LISTENING_CACHE_SECONDS = 6 * 60 * 60;

export const listeningPeriods = [
  { value: "7day", label: "7 days" },
  { value: "1month", label: "1 month" },
  { value: "3month", label: "3 months" },
  { value: "6month", label: "6 months" },
  { value: "12month", label: "12 months" },
  { value: "overall", label: "All time" },
] as const;

export type ListeningPeriod = (typeof listeningPeriods)[number]["value"];

export function parseListeningPeriod(value: unknown): ListeningPeriod {
  return listeningPeriods.find((period) => period.value === value)?.value ?? "1month";
}

export const lastfmUsernameSchema = z.string().trim().min(1, "Enter a Last.fm username")
  .max(15, "Last.fm usernames have at most 15 characters")
  .regex(/^[a-zA-Z0-9_-]+$/, "Enter a username, not a profile URL");

export type ListeningAlbum = {
  name: string;
  artist: string;
  rank: number;
  playCount: number;
  artwork: string | null;
  url: string;
};

export class LastfmError extends Error {}

const countSchema = z.union([z.string().regex(/^\d+$/), z.number()])
  .transform(Number).pipe(z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER));

const albumSchema = z.object({
  name: z.string().trim().min(1),
  artist: z.object({ name: z.string().trim().min(1) }),
  playcount: countSchema,
  url: z.string(),
  image: z.array(z.object({ "#text": z.string(), size: z.string() })).optional().default([]),
  "@attr": z.object({ rank: countSchema.pipe(z.number().positive()) }).optional(),
});

function safeLastfmUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && ["last.fm", "www.last.fm"].includes(url.hostname)
      && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

function safeArtwork(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:"
      && ["lastfm.freetls.fastly.net", "lastfm-img.freetls.fastly.net"].includes(url.hostname)
      && !url.username && !url.password
      && !url.pathname.includes("2a96cbd8b46e442fc41c2b86b821562f") ? url.href : null;
  } catch { return null; }
}

export function normalizeTopAlbums(data: unknown): ListeningAlbum[] {
  const error = z.object({ error: z.union([z.number(), z.string()]) }).safeParse(data);
  if (error.success) {
    throw new LastfmError(Number(error.data.error) === 6
      ? "Last.fm could not find that user. Check your username."
      : "Last.fm is unavailable right now. Please try again later.");
  }
  const response = z.object({ topalbums: z.object({
    album: z.union([z.array(albumSchema), albumSchema, z.literal("")])
      .transform((value) => value === "" ? [] : Array.isArray(value) ? value : [value]),
  }) }).safeParse(data);
  if (!response.success) throw new LastfmError("Last.fm returned an unexpected response. Please try again later.");

  return response.data.topalbums.album.map((album, index) => {
    const artwork = ["mega", "extralarge", "large", "medium", "small"]
      .map((size) => album.image.find((image) => image.size === size))
      .map((image) => image ? safeArtwork(image["#text"]) : null)
      .find(Boolean) ?? null;
    return {
      name: album.name,
      artist: album.artist.name,
      playCount: album.playcount,
      rank: album["@attr"]?.rank ?? index + 1,
      artwork,
      url: safeLastfmUrl(album.url) ?? `https://www.last.fm/music/${encodeURIComponent(album.artist.name)}/${encodeURIComponent(album.name)}`,
    };
  });
}
