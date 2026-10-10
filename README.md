# Jukebox

**🎵 One Stop Artist Hub.**

## 🌟 Overview

In today's world, where countless platforms like Spotify, YouTube, and radio stations coexist, it can become overwhelming to keep track of artists, musicians, videos, and other content. **One Stop Artist Hub** is a centralized web platform designed to serve as a **"single source of truth"** for all your favorite content, helping you stay organized and reducing the complexity of managing multiple services.

## ✨ Features

- 🎯 **Centralized Access**: Navigate to Spotify and YouTube directly from the hub.
- 🎧 **Personalized Radio Streams**: Enjoy content tailored to individual tastes.
- 💡 **Music Discovery**: Find ideas and inspiration when you're unsure of what to listen to.
- 📀 **Album Recommendations**: Browse curated album suggestions.
- **Shared Curation**: Browse a public video feed, album catalog, and artist recommendations maintained by an administrator.
- **Personal Lists**: Signed-in users can create private artist lists, add or remove curated artists, and share a list with a read-only link.
- **Listening**: Browse the administrator-selected public Last.fm profile, or connect your own username privately, to see most-played albums across six periods independently of the curated catalog.

## 🚀 Vision

The platform began as a personal tool for organizing preferences and building a tailored music experience. It now supports a shared curated catalog alongside private user lists: the catalog stays focused and consistent, while each user can organize the artists they care about.

## ❓ Why This Project?

Managing content across fragmented platforms can be overwhelming. This project aims to simplify that experience while also enhancing the joy of music discovery and personalized recommendations.

Who knows? One day, others might find this tool valuable enough to use it themselves!

## Access Model

| Action | Guest | Signed-in user | Admin |
| --- | --- | --- | --- |
| View the shared videos, albums, and Pick catalog | Yes | Yes | Yes |
| Create and manage personal lists | No | Their own lists | Their own lists |
| Share a personal list | No | Their own lists | Their own lists |
| Add, edit, hide, or delete shared catalog content | No | No | Yes |

The administrator is the Clerk user whose verified email matches `ADMIN_EMAIL`. The shared catalog remains public; private lists are visible only to their owner until sharing is enabled.

## Routes

- `/` - Shared video feed.
- `/albums` - Shared album catalog.
- `/pick` - Shared artist recommendations.
- `/me/lists` - The signed-in user's private lists.
- `/me/lists/[id]` - Owner-only list editor.
- `/me/listening` - Signed-in user's Last.fm top-album dashboard and username settings.
- `/listening` - Public, read-only rankings for the explicitly configured Last.fm profile.
- `/lists/[id]` - Read-only shared list, available only when its owner enables sharing.

## Setup

Install dependencies with Bun and configure the required environment variables. The project uses `bun.lock` for reproducible installs:

```bash
bun install --frozen-lockfile
```

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
ADMIN_EMAIL=
LASTFM_API_KEY=
LASTFM_PUBLIC_USERNAME=
```

Start the development server:

```bash
bun run dev
```

## Database

The project uses Drizzle ORM with Turso/libSQL. Schema changes live in `src/db/schema.ts` and generated migrations live in `src/db/migrations`.

```bash
# Generate a migration after editing the schema.
bun run db-generate

# Apply pending migrations to the configured Turso database.
bun run db-migrate
```

The live database migration history has been baselined, so `db-migrate` applies only new pending migrations.

## Listening / Last.fm

1. Copy `.env.example` to `.env` (or add its variables to your existing environment).
2. Create a Last.fm API key at [Last.fm API account creation](https://www.last.fm/api/account/create) and set `LASTFM_API_KEY` on the server. OAuth and a Last.fm shared secret are not required.
3. Apply the new `listening_profiles` migration with `bun run db-migrate` before using the dashboard.
4. Sign in, open **Listening** at `/me/listening`, and enter your Last.fm username (the part after `/user/` in your profile URL).

To publish one profile, set `LASTFM_PUBLIC_USERNAME` to its Last.fm username on the server. The navigation's **Listening** link opens `/listening` for everyone; **My Listening & settings** leads to the authenticated personal dashboard. Leave the variable blank to publish no profile. On Vercel, add the variable to the desired deployment environments and redeploy. Private user associations are never selected automatically for the public page, and visitors cannot override the public username through query parameters. No additional migration is required for publishing a profile.

The setting is stored by Clerk user ID. Users can update only their own association, and the dashboard uses public Last.fm data, not a verified Last.fm account connection. Anyone can associate a public username with their own Jukebox account.

Both dashboards request up to 50 albums using `user.getTopAlbums`. Periods are `7day`, `1month` (default), `3month`, `6month`, `12month`, and `overall`, reflected in `?period=`. Invalid or repeated period parameters fall back to one month. Successful normalized responses are cached for **6 hours** per username and period in Next.js's server-side Data Cache (managed by Vercel when deployed); public and personal dashboards share results for the same profile/period. Failed requests are not cached. Data may remain briefly stale while Next.js revalidates the cache. Period links disable prefetching to avoid fetching unselected periods merely because their links are visible.

The public dashboard makes no Turso queries and has no username editing or catalog-import controls. Its profile comes only from the server environment. The shared layout still renders Clerk-aware navigation, so a Data Cache hit avoids the Last.fm call but does not guarantee a whole-page CDN hit or eliminate Vercel rendering/request usage. For one continuously viewed profile, six periods refreshed once every six hours would mean roughly 24 Last.fm calls per day, excluding cold caches and retries.

Play counts measure listening activity, not favourite ratings. No statistics are persisted or automatically imported into the shared catalog. Administrators can select **Add to catalog** to open the existing album form with the title, artist, and artwork prefilled, review/edit it, and explicitly save. Ordinary users cannot create curated albums. The shared creation action atomically rejects matching artist/title pairs, ignoring surrounding spaces and ASCII case. Alternate editions, different spellings, and non-ASCII case variants may still need manual review; Last.fm's inconsistent MusicBrainz identifiers are not used as catalog identity.

Missing or failed artwork shows a placeholder. Empty histories and Last.fm failures display recoverable states. Additional providers, top artists/tracks, trend history, and pagination are outside this MVP.

Album covers use native `<img>` elements with lazy loading and asynchronous decoding. The browser requests them directly from Last.fm's image CDN; they do not use `next/image`, Vercel's `/_next/image` endpoint, or Vercel image transformations. Serving the dashboard still contributes to Vercel's normal page/request/rendering usage.

### Checks

```bash
bun run test
bun run lint
bunx tsc --noEmit
bun run build
```

Tests use Bun's native test runner, mocked Clerk/Last.fm calls, and an isolated in-memory libSQL database. They do not contact Last.fm or your configured Turso database.

## Commands

| Command | Purpose |
| --- | --- |
| `bun run dev` | Run the Next.js development server. |
| `bun run build` | Create and type-check the production build. |
| `bun run lint` | Check the project with ESLint. |
| `bun run test` | Run Last.fm normalization, API-client, isolation, and authorization tests with Bun. |
| `bun run db-generate` | Generate a Drizzle migration from schema changes. |
| `bun run db-migrate` | Apply pending migrations. |
| `bun run db-push` | Synchronize the schema directly. Use migrations for deployed databases. |

---

🎶 Built with ❤️ for music lovers.
