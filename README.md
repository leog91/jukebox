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
- `/lists/[id]` - Read-only shared list, available only when its owner enables sharing.

## Setup

Install dependencies and configure the required environment variables:

```bash
npm install
```

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
ADMIN_EMAIL=
```

Start the development server:

```bash
npm run dev
```

## Database

The project uses Drizzle ORM with Turso/libSQL. Schema changes live in `src/db/schema.ts` and generated migrations live in `src/db/migrations`.

```bash
# Generate a migration after editing the schema.
npm run db-generate

# Apply pending migrations to the configured Turso database.
npm run db-migrate
```

The live database migration history has been baselined, so `db-migrate` applies only new pending migrations.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the Next.js development server. |
| `npm run build` | Create and type-check the production build. |
| `npm run db-generate` | Generate a Drizzle migration from schema changes. |
| `npm run db-migrate` | Apply pending migrations. |
| `npm run db-push` | Synchronize the schema directly. Use migrations for deployed databases. |

---

🎶 Built with ❤️ for music lovers.
