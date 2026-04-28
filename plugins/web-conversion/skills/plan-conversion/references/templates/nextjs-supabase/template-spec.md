---
name: nextjs-supabase
stack: Next.js 15 (App Router) + Supabase + Tailwind 4 + shadcn/ui + Drizzle ORM
---

# Next.js-Supabase Template

## When to use

- **Complex web applications** with authentication and user accounts
- **Internal systems, client portals, admin panels, dashboards**
- Apps needing **server-side rendering (SSR)** for SEO
- Apps needing **API routes** for server-side logic
- **Multi-role applications** (admin, manager, member)

## When NOT to use

- **Static marketing sites** without auth — use astro-netlify
- **Simple landing pages** — use static-html
- **Simple SPA** without SSR needs — consider vite-supabase
- **E-commerce** with cart/checkout — use a dedicated e-commerce platform

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Auth | Supabase Auth (`@supabase/ssr`) |
| Database | Supabase PostgreSQL |
| Schema | Drizzle ORM |
| Data fetching | TanStack Query v5 |
| Validation | Zod |
| Forms | React Hook Form |
| Hosting | Netlify |

## What's included in the template

- **Auth flow** — login, register, reset password, profile pages
- **Middleware** — session refresh, protected routes, security headers, rate limiting
- **Supabase client setup** — server, browser, and middleware variants
- **Auth helpers** — `requireAuth`, `requireRole` for API routes
- **Dashboard layout** — sidebar + main content, responsive
- **Providers** — React Query, Theme, Tooltips, Toasts
- **Example CRUD** — API route + React Query hook + page
- **Drizzle ORM setup** — schema, config, migrations directory
- **Error handling** — safe PG error responses
- **Zod validation schemas** + `parseBody` helper
- **netlify.toml** — build and hosting configuration

## Placeholders to fill

The template uses `{{PLACEHOLDER}}` values that must be replaced per project:

- `DATABASE_URL` — Supabase PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key
- `APP_NAME` — application display name
- `APP_DESCRIPTION` — application description for meta tags

## Conversion compatibility

Best suited for converting:
- **Lovable** prototypes that have auth flows, dashboards, or complex data management
- **Bolt** prototypes with similar dynamic app patterns
- Any React SPA with authentication, user roles, or database-driven content

The conversion guide `lovable-to-nextjs.md` covers the Lovable to Next.js path in detail.
