import { test } from "bun:test";
import assert from "node:assert/strict";
import { LastfmError, lastfmUsernameSchema, listeningPeriods, normalizeTopAlbums, parseListeningPeriod } from "../src/lib/lastfm";

const album = {
  name: " Dummy ", artist: { name: " Portishead " }, playcount: "42",
  url: "https://www.last.fm/music/Portishead/Dummy", "@attr": { rank: "1" },
  image: [
    { size: "small", "#text": "https://lastfm.freetls.fastly.net/i/u/34s/small.jpg" },
    { size: "extralarge", "#text": "https://lastfm.freetls.fastly.net/i/u/300x300/large.jpg" },
  ],
};

test("normalizes album fields, counts, ranks, and largest available artwork", () => {
  assert.deepEqual(normalizeTopAlbums({ topalbums: { album: [album] } }), [{
    name: "Dummy", artist: "Portishead", playCount: 42, rank: 1,
    artwork: album.image[1]["#text"], url: album.url,
  }]);
});

test("handles empty lists, singleton albums, absent artwork and absent ranks", () => {
  assert.deepEqual(normalizeTopAlbums({ topalbums: { album: [] } }), []);
  assert.deepEqual(normalizeTopAlbums({ topalbums: { album: "" } }), []);
  const result = normalizeTopAlbums({ topalbums: { album: { ...album, image: undefined, "@attr": undefined } } });
  assert.equal(result[0].artwork, null);
  assert.equal(result[0].rank, 1);
});

test("accepts the artwork CDN returned by the live Last.fm API", () => {
  const artwork = "https://lastfm-img.freetls.fastly.net/i/u/300x300/8e4304de63b44d6ca8f9d3df2576ac8f.png";
  const result = normalizeTopAlbums({ topalbums: { album: [{
    ...album, image: [{ size: "extralarge", "#text": artwork }],
  }] } });
  assert.equal(result[0].artwork, artwork);
});

test("rejects untrusted artwork hosts, credentials, HTTP, and placeholders on the live CDN", () => {
  for (const artwork of [
    "https://example.com/cover.png",
    "https://lastfm-img.freetls.fastly.net.example.com/cover.png",
    "https://user:password@lastfm-img.freetls.fastly.net/cover.png",
    "http://lastfm-img.freetls.fastly.net/cover.png",
    "https://lastfm-img.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png",
  ]) {
    const result = normalizeTopAlbums({ topalbums: { album: [{
      ...album, image: [{ size: "extralarge", "#text": artwork }],
    }] } });
    assert.equal(result[0].artwork, null);
  }
});

test("filters missing-art placeholders and unsafe URLs", () => {
  const result = normalizeTopAlbums({ topalbums: { album: [{ ...album,
    url: "javascript:alert(1)", image: [{ size: "large", "#text": "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png" }],
  }] } });
  assert.equal(result[0].artwork, null);
  assert.equal(result[0].url, album.url);
});

test("rejects API error envelopes, malformed responses, and invalid play counts", () => {
  assert.throws(() => normalizeTopAlbums({ error: 6, message: "User not found" }), /could not find/);
  assert.throws(() => normalizeTopAlbums({ error: 29 }), LastfmError);
  for (const data of [{}, { topalbums: {} }, { topalbums: { album: [{ ...album, playcount: "-1" }] } },
    { topalbums: { album: [{ ...album, playcount: "9007199254740992" }] } }]) {
    assert.throws(() => normalizeTopAlbums(data), LastfmError);
  }
});

test("accepts only allowed periods and defaults invalid or repeated values to one month", () => {
  for (const { value } of listeningPeriods) assert.equal(parseListeningPeriod(value), value);
  for (const value of [undefined, "", "weekly", "1month&api_key=bad", ["7day", "overall"]]) {
    assert.equal(parseListeningPeriod(value), "1month");
  }
});

test("validates usernames without profile URLs or embedded query parameters", () => {
  assert.equal(lastfmUsernameSchema.parse(" listener_1 "), "listener_1");
  for (const value of ["", "https://www.last.fm/user/listener", "x&user=y", "a".repeat(16)]) {
    assert.equal(lastfmUsernameSchema.safeParse(value).success, false);
  }
});
