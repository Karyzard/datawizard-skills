---
name: static-html
stack: HTML5 + Tailwind CSS (CDN) + Vanilla JS + Netlify Forms
---

# Static HTML Template

## When to use

- **Simple landing pages** -- single-page marketing sites, product launches, event pages
- **Campaign sites** -- time-limited promotional pages with a contact form
- **One-pagers** -- company presentation, service overview, portfolio showcase
- **Multi-page simple sites** (up to ~5 pages) -- small business websites without CMS needs
- Sites where **speed of deployment** matters more than long-term content management
- Sites that need **zero build step** -- just HTML files served directly

## When NOT to use

- Sites needing a **CMS for non-developers** -- use `astro-netlify` instead
- Sites with **user authentication** or accounts -- use `nextjs-supabase` or `vite-supabase`
- Sites with **complex client-side interactivity** (drag-and-drop, real-time updates, state management) -- use a React/Vue SPA
- Sites needing **server-side logic** (API routes, database queries, payments) -- use Next.js + Supabase
- Sites with **blog or news section** that clients will update -- use `astro-netlify` with Decap CMS
- **E-commerce** with cart/checkout -- use a dedicated e-commerce stack

## Tech stack

| Layer | Technology |
|---|---|
| Markup | HTML5, semantic elements |
| Styling | Tailwind CSS 4 via CDN (`cdn.tailwindcss.com`) |
| Custom styles | Plain CSS (`styles.css`) with custom properties |
| Interactivity | Vanilla JavaScript (inline `<script>`) |
| Forms | Netlify Forms (no backend code needed) |
| Hosting | Netlify (no build step, `publish = "."`) |
| Spam protection | Netlify Forms honeypot field |

## What's included in the template

| File | Description |
|---|---|
| `index.html` | Complete single-page site with header, hero, services, about, contact form, footer, cookie consent |
| `styles.css` | CSS custom properties for fonts, smooth scroll with motion preference, form success state, `@font-face` placeholders |
| `netlify.toml` | Publish config (no build), security headers, commented-out form notifications and 404 redirect |

## Placeholders to fill

The template uses `{{PLACEHOLDER}}` values that must be replaced per project:

| Placeholder | Description | Example |
|---|---|---|
| `{{SITE_TITLE}}` | Page `<title>` and OG title | `Firma s.r.o. -- Skvele sluzby` |
| `{{SITE_DESCRIPTION}}` | Meta description and OG description | `Nabizime profesionalni sluzby v oblasti...` |
| `{{COMPANY_NAME}}` | Company name in header, footer, structured content | `Firma s.r.o.` |
| `{{COMPANY_ADDRESS}}` | Full address in contact section and footer | `Ulice 123, 110 00 Praha` |
| `{{COMPANY_PHONE}}` | Phone number (contact section + footer) | `+420 123 456 789` |
| `{{COMPANY_EMAIL}}` | Email address (contact section + footer + form recipient) | `info@firma.cz` |
| `{{PRIMARY_COLOR}}` | Primary brand color for Tailwind config | `#1e40af` |
| `{{ACCENT_COLOR}}` | Accent/secondary brand color for Tailwind config | `#f59e0b` |
| `{{OG_IMAGE_URL}}` | Open Graph image URL | `https://firma.cz/og-image.jpg` |
| `{{FORM_RECIPIENT}}` | Netlify Forms notification email (in `netlify.toml`) | `info@firma.cz` |

## Conversion compatibility

Best suited for converting:

- **Lovable** simple prototypes (single-page, mostly visual)
- **Bolt** simple prototypes (landing pages, marketing sites)
- **v0** simple prototypes (component-based layouts that can be flattened to static HTML)

For more complex prototypes with routing, CMS needs, or dynamic content, use the `astro-netlify` template instead.
