import "server-only";
import { unstable_cache } from "next/cache";
import { LastfmError, LISTENING_CACHE_SECONDS, lastfmUsernameSchema, normalizeTopAlbums, parseListeningPeriod, type ListeningPeriod } from "./lastfm";

// Cache only normalized successes. The username and period are part of the key;
// errors are thrown inside the cached function so they aren't stored as results.
const fetchTopAlbums = unstable_cache(async (username: string, period: ListeningPeriod) => {
  const apiKey = process.env.LASTFM_API_KEY;
  if (!apiKey) throw new LastfmError("Listening is not configured yet. Ask the administrator to set LASTFM_API_KEY.");
  const url = new URL("https://ws.audioscrobbler.com/2.0/");
  url.search = new URLSearchParams({
    method: "user.getTopAlbums", user: username, period, api_key: apiKey,
    format: "json", limit: "50",
  }).toString();
  let response: Response;
  try {
    response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(10_000) });
  } catch {
    throw new LastfmError("Could not reach Last.fm. Please try again later.");
  }
  if (!response.ok) throw new LastfmError("Last.fm is unavailable right now. Please try again later.");
  let data: unknown;
  try { data = await response.json(); }
  catch { throw new LastfmError("Last.fm returned an unexpected response. Please try again later."); }
  return normalizeTopAlbums(data);
}, ["lastfm-top-albums-v3"], { revalidate: LISTENING_CACHE_SECONDS });

export async function getTopAlbums(username: string, period: ListeningPeriod) {
  return fetchTopAlbums(lastfmUsernameSchema.parse(username), parseListeningPeriod(period));
}

export function getPublicListeningUsername(): string | null {
  const username = process.env.LASTFM_PUBLIC_USERNAME;
  if (!username?.trim()) return null;
  const result = lastfmUsernameSchema.safeParse(username);
  if (!result.success) {
    throw new LastfmError("Public Listening is not configured correctly. Ask the administrator to check LASTFM_PUBLIC_USERNAME.");
  }
  return result.data;
}
