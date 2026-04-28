---
name: vite-supabase
stack: React 18 + Vite + Supabase + Tailwind 4 + shadcn/ui + Supabase Declarative Schemas
---

# Vite-Supabase Template

## When to use

- **Internal tools and dashboards** where SEO doesn't matter
- **SPA apps** with authentication and database
- **Simpler projects** that don't need SSR or server components
- **Lovable prototype conversions** — closest stack match (both React + Vite), minimal component changes needed
- **Rapid prototyping** that needs a real backend

## When NOT to use

- **Sites needing good SEO** — use nextjs-supabase (SSR)
- **Static marketing sites** without auth — use astro-netlify
- **Simple landing pages** — use static-html
- **Apps needing server-side secrets handling** — use nextjs-supabase (API routes)
- **E-commerce** with cart/checkout — use a dedicated e-commerce platform

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router v7 (route definitions, not file-based) |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Auth | Supabase Auth (`@supabase/supabase-js`) |
| Database | Supabase PostgreSQL |
| Schema | Supabase Declarative Schemas (`supabase/schemas/`) |
| Server logic | Supabase RPC functions (Edge Functions / PL/pgSQL) |
| Data fetching | TanStack Query v5 |
| Validation | Zod |
| Forms | React Hook Form |
| Hosting | Netlify (static SPA) |

## Architecture notes

- **SPA only** — no SSR, no server components, no middleware
- **Client-side routing** — React Router v7 with centralized route definitions
- **Auth guard** — `ProtectedRoute` React component wrapping authenticated routes
- **No API routes** — all server-side logic via Supabase RPC functions and Edge Functions
- **Type generation** — `supabase gen types` workflow for database types
- **Static hosting** — built as static assets, served from Netlify CDN with SPA redirect

## What's included in the template

- **Auth flow** — login, register, reset password pages
- **Auth guard** — `ProtectedRoute` component for authenticated routes
- **React Router v7 setup** — centralized route definitions with layout routes
- **Supabase client setup** — browser client (`createClient`)
- **Dashboard layout** — sidebar + main content, responsive
- **Providers** — React Query, Theme, Router
- **Example CRUD** — via Supabase RPC + React Query hook + page
- **Supabase Declarative Schemas setup** — `supabase/schemas/` directory for DB schema management
- **Type generation workflow** — `supabase gen types` integration
- **Zod validation schemas** for form and data validation
- **Vite config** — path aliases (`@/`), build settings
- **netlify.toml** — build config + SPA redirect (`/* → /index.html`)

## Placeholders to fill

The template uses `{{PLACEHOLDER}}` values that must be replaced per project:

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anonymous key
- `APP_NAME` — application display name
- `APP_DESCRIPTION` — application description for meta tags

## Key differences from nextjs-supabase

| Aspect | nextjs-supabase | vite-supabase |
|---|---|---|
| Rendering | SSR + client | SPA only (client-side) |
| Routing | File-based (App Router) | React Router v7 (route definitions) |
| Server logic | Next.js API routes | Supabase RPC functions |
| DB schema | Drizzle ORM + migrations | Supabase Declarative Schemas |
| Auth middleware | Next.js middleware | ProtectedRoute component |
| Supabase client | Server + browser + middleware | Browser only |
| Hosting | SSR on Netlify | Static SPA on Netlify |
| Complexity | Higher | Lower |
| Dev speed | Moderate | Fast |

## Conversion compatibility

Best suited for converting:
- **Lovable** prototypes — closest stack match (both React + Vite), minimal component changes needed
- **Bolt** prototypes with simple SPA patterns
- Any React SPA with authentication and database-driven content that doesn't need SEO

The conversion guide `lovable-to-vite-supabase.md` covers the Lovable to Vite-Supabase path in detail.
