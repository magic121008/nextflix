# NEXTFLIX

A production-ready streaming platform with a Netflix-style UI. Users can browse movies, anime, and TV shows, search content, manage a watchlist, watch videos with an HLS-compatible player, and track viewing progress. Admins can manage all content and users from a dashboard.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/nextflix run dev` — run the frontend (port 25023)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite + Tailwind CSS + wouter + React Query
- API: Express 5 + JWT auth (jsonwebtoken + bcryptjs)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- Video: HLS.js (adaptive streaming), native video for MP4, iframe for embeds
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/db/src/schema/` — Drizzle schema (users, content, categories, watchlist, watchProgress)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/api-server/src/lib/auth.ts` — JWT sign/verify + requireAuth/requireAdmin middleware
- `artifacts/nextflix/src/pages/` — All page components
- `artifacts/nextflix/src/components/` — Shared UI components (Navbar, ContentCard, Layout)
- `artifacts/nextflix/src/lib/auth.tsx` — AuthContext (JWT stored in localStorage as `nextflix_token`)

## Architecture decisions

- Contract-first: OpenAPI spec → Orval codegen → typed React Query hooks + Zod schemas
- JWT auth: tokens stored in localStorage under `nextflix_token`; decoded client-side for role checks; verified server-side on protected routes
- Content types (movie/anime/tv) share a single `content` table with a `type` discriminator column
- Content detail + video pages try all three content types in sequence (movie → anime → tv) since IDs are shared across types
- Admin/watchlist/continue-watching routes are protected with `requireAuth` / `requireAdmin` middleware

## Product

- Home: Hero banner (featured content) + horizontal scroll rows for Trending Movies, Trending Anime, Trending TV Shows
- Movies / Anime / TV Shows: Paginated grids with filter support
- Trending: Combined trending content sorted by view count
- Latest: Most recently added movies
- Categories: Browse by genre/category
- Search: Real-time search across all content types, filterable by type
- Watchlist: User's saved content (requires login)
- Video Player: Full-screen HLS + MP4 + iframe embed support, custom controls, auto-saves progress every 10s
- Content Detail: Hero banner, metadata, related content, watchlist toggle, Play button
- Admin Dashboard: Stats overview + full CRUD for movies/anime/TV/categories/users

## Demo credentials

- Admin: `admin@nextflix.com` / `admin123`
- User: `user@nextflix.com` / `admin123`

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `bcryptjs` is used instead of `bcrypt` (pure JS — no native bindings needed in this environment)
- Content IDs are global (not per-type), so both watch.tsx and content-detail.tsx try all three type endpoints
- Run `pnpm --filter @workspace/api-spec run codegen` after every OpenAPI spec change — it rebuilds both React Query hooks and Zod schemas

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
