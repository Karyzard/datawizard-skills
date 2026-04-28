---
name: astro-netlify
stack: Astro 6 + Tailwind 4 + Netlify + Decap CMS + Resend + Turnstile
---

# Astro-Netlify Template

## When to use

- **Static or mostly-static websites** — company sites, portfolios, landing pages, product showcases
- Sites that need a **CMS for non-developers** (Decap CMS with git-based content)
- Sites with **contact forms** that send emails (Resend + Netlify Functions)
- Sites that need **fast load times and good SEO** (SSG, no client-side JS framework)
- Sites hosted on **Netlify** (or adaptable to other static hosts)

## When NOT to use

- **Dynamic web apps** — dashboards, SaaS, user accounts, real-time data → use Next.js + Supabase
- **E-commerce** with cart/checkout → use a dedicated e-commerce stack
- Sites needing **server-side rendering on every request** → use Next.js or similar
- Sites with **complex client-side interactivity** (drag-and-drop, real-time collaboration) → use React/Vue SPA

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Astro 6 (SSG) |
| Styling | Tailwind CSS 4 with `@theme` design tokens |
| Animations | AOS.js (Animate On Scroll) |
| CMS | Decap CMS + DecapBridge (git-based) |
| Forms | Netlify Functions + Resend (email) + Turnstile (captcha) |
| Hosting | Netlify |
| Routing | File-based (`src/pages/`) with SPA transitions (ClientRouter) |
| Content | Astro Content Collections (Markdown/MDX) |

## What's included in the template

- `BaseLayout.astro` — SEO meta, OG tags, JSON-LD, GTM Consent Mode v2, AOS init
- `CookieConsent.astro` — GDPR cookie consent with Consent Mode v2
- `global.css` — design token structure, animations, utility classes
- `site.ts` — central configuration (site info, company, contact, CMS, forms)
- `content.config.ts` — Content Collections schema
- `validation.ts` + `storage.ts` — form validation and browser storage utilities
- `submit-inquiry.mts` — Netlify Function for form submission with Turnstile + Resend
- `config.yml` + `index.html` — Decap CMS admin panel
- `netlify.toml` — build and functions configuration
- `404.astro` + `cms.astro` — error page and CMS redirect

## Placeholders to fill

The template uses `{{PLACEHOLDER}}` values that must be replaced per project. The main config file is `src/data/site.ts`. Files that can't import from TypeScript need manual edits:

- `astro.config.mjs` — site URL
- `public/admin/config.yml` — repo, site URL, DecapBridge Site ID
- `src/styles/global.css` — colors in `@theme`, font names in `@font-face`

## Conversion compatibility

Best suited for converting:
- **Lovable** prototypes (React + Vite + Tailwind + shadcn/ui)
- **Bolt** prototypes (similar stack)
- **v0** prototypes (React + Tailwind)
- Any React SPA with mostly static content

The conversion guide `lovable-to-astro.md` covers the Lovable → Astro path in detail.
