import { afterAll, beforeEach, mock, test } from "bun:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import type { ListeningPeriod } from "../src/lib/lastfm";

const client = createClient({ url: "file::memory:" });
const testDb = drizzle(client);
let userId: string | null = "user-a";
let admin = false;
let authCalls = 0;
const invalidated: string[] = [];
process.env.ADMIN_EMAIL = "admin@example.test";

mock.module("@clerk/nextjs/server", () => ({
  auth: async () => { authCalls++; return { userId }; },
  currentUser: async () => userId ? { emailAddresses: [{ emailAddress: admin ? "admin@example.test" : "user@example.test" }] } : null,
}));
let cacheOptions: { revalidate: number } | undefined;
let cacheKey: string[] | undefined;
const cacheArguments: unknown[][] = [];
mock.module("server-only", () => ({}));
mock.module("next/cache", () => ({
  revalidatePath: (path: string) => invalidated.push(path),
  unstable_cache: (fn: (...args: unknown[]) => Promise<unknown>, key: string[], options: { revalidate: number }) => {
    cacheKey = key;
    cacheOptions = options;
    return (...args: unknown[]) => { cacheArguments.push(args); return fn(...args); };
  },
}));
mock.module("../src/db/db", () => ({ db: testDb }));

const { saveLastfmUsername, getListeningProfile } = await import("../src/app/me/listening/actions");
const { submitAlbum } = await import("../src/app/albums/add/action");
const { getTopAlbums, getPublicListeningUsername } = await import("../src/lib/lastfm-client");
const { default: PublicListeningPage } = await import("../src/app/listening/page");
const { renderToStaticMarkup } = await import("react-dom/server");
await client.execute(await readFile(new URL("../src/db/migrations/0013_normal_mach_iv.sql", import.meta.url), "utf8"));
await client.execute("CREATE TABLE albums (id INTEGER PRIMARY KEY, name TEXT NOT NULL, artist TEXT NOT NULL, cover_url TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)");

function form(values: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}
const initial = { success: false, message: "" };
const originalKey = process.env.LASTFM_API_KEY;
const originalPublicUsername = process.env.LASTFM_PUBLIC_USERNAME;
const originalFetch = globalThis.fetch;
const fetchMock = mock(async (_input: string | URL | Request, _init?: RequestInit) =>
  Response.json({ topalbums: { album: [] } }));
globalThis.fetch = Object.assign(fetchMock, { preconnect: originalFetch.preconnect });

beforeEach(async () => {
  userId = "user-a";
  admin = false;
  authCalls = 0;
  invalidated.length = 0;
  process.env.LASTFM_API_KEY = "test-key";
  delete process.env.LASTFM_PUBLIC_USERNAME;
  cacheArguments.length = 0;
  fetchMock.mockClear();
  fetchMock.mockImplementation(async () => Response.json({ topalbums: { album: [] } }));
  await client.execute("DELETE FROM listening_profiles");
  await client.execute("DELETE FROM albums");
});
afterAll(() => {
  client.close();
  globalThis.fetch = originalFetch;
  if (originalKey === undefined) delete process.env.LASTFM_API_KEY;
  else process.env.LASTFM_API_KEY = originalKey;
  if (originalPublicUsername === undefined) delete process.env.LASTFM_PUBLIC_USERNAME;
  else process.env.LASTFM_PUBLIC_USERNAME = originalPublicUsername;
});

test("profile reads and writes use the authenticated owner, ignoring submitted user IDs", async () => {
  assert.equal((await saveLastfmUsername(initial, form({ username: "listener-a", userId: "user-b" }))).success, true);
  userId = "user-b";
  assert.equal(await getListeningProfile(), null);
  await saveLastfmUsername(initial, form({ username: "listener-b" }));
  assert.equal((await getListeningProfile())?.lastfmUsername, "listener-b");
  userId = "user-a";
  assert.equal((await getListeningProfile())?.lastfmUsername, "listener-a");
  await saveLastfmUsername(initial, form({ username: "changed-a" }));
  assert.equal((await getListeningProfile())?.lastfmUsername, "changed-a");
  userId = "user-b";
  assert.equal((await getListeningProfile())?.lastfmUsername, "listener-b");
  assert.ok(invalidated.includes("/me/listening"));
});

test("unauthenticated and invalid configuration writes cannot persist data", async () => {
  userId = null;
  assert.equal((await saveLastfmUsername(initial, form({ username: "listener" }))).message, "Unauthorized");
  assert.equal(await getListeningProfile(), null);
  userId = "user-a";
  assert.equal((await saveLastfmUsername(initial, form({ username: "https://www.last.fm/user/listener" }))).success, false);
  assert.equal((await client.execute("SELECT * FROM listening_profiles")).rows.length, 0);
});

test("ordinary users and guests cannot import ranked albums into the shared catalog", async () => {
  const data = form({ artist: "Portishead", name: "Dummy", cover: "" });
  assert.equal((await submitAlbum(null, data)).message, "Unauthorized");
  userId = null;
  assert.equal((await submitAlbum(null, data)).message, "Unauthorized");
  assert.equal((await client.execute("SELECT * FROM albums")).rows.length, 0);
});

test("admin creation rejects duplicates atomically and allows distinct albums", async () => {
  admin = true;
  const data = form({ artist: " Portishead ", name: " Dummy ", cover: "https://lastfm.freetls.fastly.net/i/u/300x300/cover.jpg" });
  const results = await Promise.all([submitAlbum(null, data), submitAlbum(null, data)]);
  assert.equal(results.filter((result) => result.success).length, 1);
  assert.equal((await submitAlbum(null, form({ artist: "portishead", name: "dummy", cover: "" }))).success, false);
  assert.equal((await submitAlbum(null, form({ artist: "Portishead", name: "Third", cover: "" }))).success, true);
  const rows = (await client.execute("SELECT * FROM albums")).rows;
  assert.equal(rows.length, 2);
  assert.equal(rows[0].artist, "Portishead");
  assert.ok(invalidated.includes("/albums"));
});

test("prefilled input remains untrusted and unsafe cover URLs are rejected", async () => {
  admin = true;
  assert.equal((await submitAlbum(null, form({ artist: "Artist", name: "Album", cover: "javascript:alert(1)" }))).success, false);
  assert.equal((await client.execute("SELECT * FROM albums")).rows.length, 0);
});

test("uses the top albums API with isolated username/period cache arguments and a six-hour TTL", async () => {
  await getTopAlbums("listener-a", "7day");
  await getTopAlbums("listener-b", "overall");
  assert.deepEqual(cacheArguments, [["listener-a", "7day"], ["listener-b", "overall"]]);
  assert.equal(cacheOptions?.revalidate, 21600);
  assert.deepEqual(cacheKey, ["lastfm-top-albums-v3"]);
  const [input, init] = fetchMock.mock.calls[0];
  const url = new URL(String(input));
  assert.equal(url.origin, "https://ws.audioscrobbler.com");
  assert.equal(url.searchParams.get("method"), "user.getTopAlbums");
  assert.equal(url.searchParams.get("api_key"), "test-key");
  assert.equal(url.searchParams.get("user"), "listener-a");
  assert.equal(url.searchParams.get("period"), "7day");
  assert.equal(url.searchParams.get("limit"), "50");
  assert.equal(init?.cache, "no-store");
  assert.ok(init?.signal);
});

test("public profile selection is explicit and independent of the signed-in user's private settings", async () => {
  await saveLastfmUsername(initial, form({ username: "private-user" }));
  assert.equal(getPublicListeningUsername(), null);
  process.env.LASTFM_PUBLIC_USERNAME = " public-user ";
  assert.equal(getPublicListeningUsername(), "public-user");
  assert.equal((await getListeningProfile())?.lastfmUsername, "private-user");
  userId = null;
  assert.equal(getPublicListeningUsername(), "public-user");
  await getTopAlbums(getPublicListeningUsername()!, "1month");
  assert.equal(new URL(String(fetchMock.mock.calls[0][0])).searchParams.get("user"), "public-user");
});

test("invalid public configuration fails before contacting Last.fm", () => {
  process.env.LASTFM_PUBLIC_USERNAME = "https://www.last.fm/user/listener";
  assert.throws(() => getPublicListeningUsername(), /not configured correctly/);
  assert.equal(fetchMock.mock.calls.length, 0);
});

test("public page works for guests, ignores username overrides, and offers no editing or importing controls", async () => {
  userId = null;
  process.env.LASTFM_PUBLIC_USERNAME = "public-user";
  fetchMock.mockImplementation(async () => Response.json({ topalbums: { album: [{
    name: "Dummy", artist: { name: "Portishead" }, playcount: "42",
    url: "https://www.last.fm/music/Portishead/Dummy",
  }] } }));
  const params = { period: "7day", username: "private-user" };
  const page = await PublicListeningPage({ searchParams: Promise.resolve(params) });
  const markup = renderToStaticMarkup(page);
  const requestUrl = new URL(String(fetchMock.mock.calls[0][0]));
  assert.equal(requestUrl.searchParams.get("user"), "public-user");
  assert.equal(requestUrl.searchParams.get("period"), "7day");
  assert.equal(authCalls, 0);
  assert.ok(markup.includes("Dummy"));
  assert.ok(markup.includes("Cached for 6 hours"));
  assert.ok(markup.includes("/listening?period=overall"));
  assert.ok(markup.includes("/me/listening"));
  assert.ok(!markup.includes("Add to catalog"));
  assert.ok(!markup.includes("Update username"));
  assert.ok(!markup.includes("<form"));
});

test("unconfigured public page does not request any user's rankings", async () => {
  const page = await PublicListeningPage({ searchParams: Promise.resolve({}) });
  assert.ok(renderToStaticMarkup(page).includes("No public listening profile"));
  assert.equal(fetchMock.mock.calls.length, 0);
});

test("revalidates untrusted periods and rejects invalid usernames before fetching", async () => {
  await getTopAlbums("listener", "invalid" as ListeningPeriod);
  assert.equal(new URL(String(fetchMock.mock.calls[0][0])).searchParams.get("period"), "1month");
  await assert.rejects(getTopAlbums("listener&api_key=bad", "1month"));
  assert.equal(fetchMock.mock.calls.length, 1);
});

test("reports missing server configuration without making API requests", async () => {
  delete process.env.LASTFM_API_KEY;
  await assert.rejects(getTopAlbums("listener", "1month"), /not configured/);
  assert.equal(fetchMock.mock.calls.length, 0);
});

test("reports transport, HTTP, invalid JSON, and HTTP-200 Last.fm errors without exposing credentials", async () => {
  for (const implementation of [
    async () => { throw new Error("network failure with test-key"); },
    async () => new Response("error", { status: 503 }),
    async () => new Response("not JSON"),
    async () => Response.json({ error: 10, message: "Invalid API key: test-key" }),
  ]) {
    fetchMock.mockImplementation(implementation);
    await assert.rejects(getTopAlbums("listener", "1month"), (error: Error) => {
      assert.ok(!error.message.includes("test-key"));
      return /Last.fm/.test(error.message);
    });
  }
});
