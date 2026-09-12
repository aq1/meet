Welcome to your new TanStack Start app! 

# Getting Started

To run this application:

```bash
bun install
bun --bun run dev
```

# Building For Production

To build this application for production:

```bash
bun --bun run build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
bun --bun run test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

### Removing Tailwind CSS

If you prefer not to use Tailwind CSS:

1. Remove the demo pages in `src/routes/demo/`
2. Replace the Tailwind import in `src/styles.css` with your own styles
3. Remove `tailwindcss()` from the plugins array in `vite.config.ts`
4. Uninstall the packages: `bun install @tailwindcss/vite tailwindcss -D`

## Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting. The following scripts are available:


```bash
bun --bun run lint
bun --bun run format
bun --bun run check
```


## Database migrations

Migrations are plain SQL files in `migrations/`, run with [goose](https://pressly.github.io/goose/). Install it locally with `brew install goose`; `scripts/deploy.ts` runs `goose up` on the server during each deploy.

The `db:*` scripts read goose settings from `.env`:

```bash
GOOSE_DRIVER=postgres
GOOSE_DBSTRING=$DATABASE_URL
GOOSE_MIGRATION_DIR=migrations
```

Columns are `snake_case` in SQL and exposed as `camelCase` through Kysely's `CamelCasePlugin`; run `bun run db:generate` after migrating to refresh `src/lib/db/schema.d.ts`.

```bash
bun run db:new add_something sql   # create migrations/<timestamp>_add_something.sql
bun run db:migrate                 # apply pending migrations to $DATABASE_URL
bun run db:status                  # show applied / pending migrations
```

## Deploy

`bun run build` produces a self-contained `.output` directory:

- `.output/server/index.mjs` — the Nitro server (Bun preset)
- `.output/public` — static assets

The production image contains only `.output` on top of `oven/bun:1-alpine`; no `node_modules`, sources or dev tooling.

```bash
docker compose up --build -d meet
```
