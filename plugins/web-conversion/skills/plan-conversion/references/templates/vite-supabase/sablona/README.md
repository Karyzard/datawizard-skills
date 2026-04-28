# {{APP_NAME}}

React + Vite + Supabase SPA.

## Setup

```bash
# Install dependencies
npm install

# Copy env and fill in Supabase credentials
cp .env.example .env

# Start Supabase locally
supabase start

# Apply schema (generates migration from declarative schemas)
supabase stop
supabase db diff -f initial_schema
supabase start

# Generate TypeScript types from database
npm run types

# Start dev server
npm run dev
```

## Schema Changes

This project uses **Supabase Declarative Schemas**. Edit files in `supabase/schemas/` (desired state), then:

```bash
supabase stop
supabase db diff -f description_of_change
supabase start
npm run types
```

Never edit migration files in `supabase/migrations/` manually.

## Architecture

- **Client-side only** — no SSR, no API routes
- **Supabase Auth** — email/password from the browser
- **RPC functions** — data operations via `supabase.rpc()`, not direct table access
- **RLS** — Row Level Security on all tables
- **TanStack Query** — server state management with cache invalidation
- **Zod** — input validation on the client

## Deployment

Configured for Netlify (`netlify.toml`). Set environment variables in Netlify dashboard:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
