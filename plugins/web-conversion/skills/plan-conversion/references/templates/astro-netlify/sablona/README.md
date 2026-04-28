# Astro šablona — ready-to-copy soubory

Tyto soubory tvoří kompletní základ nového Astro projektu.

## Postup

### 1. Scaffold projekt

```bash
npm create astro@latest -- --template minimal nazev-projektu
cd nazev-projektu
npm install tailwindcss @tailwindcss/vite @astrojs/sitemap aos resend busboy @netlify/functions @netlify/blobs
npm install -D sharp @types/node typescript
```

### 2. Zkopírovat šablonu

```bash
cp -r cesta/k/sablona/* .
```

### 3. Vyplnit src/data/site.ts

**Toto je hlavní konfigurační soubor.** Otevři `src/data/site.ts` a vyplň:

| Sekce | Co vyplnit |
|---|---|
| `site` | URL, název, tagline, popis webu |
| `company` | Právní název, IČO, DIČ, rok založení |
| `contact` | Email, telefon |
| `locations[]` | Pobočky — adresa, telefon, email |
| `socials[]` | Sociální sítě (volitelné) |
| `cms` | GitHub repo, DecapBridge Site ID |
| `form` | Turnstile Site Key, consent key |
| `seo` | Cesty k OG image a logu |

Většina šablonových souborů (.astro, .ts) **importuje z tohoto souboru automaticky**.

### 4. Zbylé ruční úpravy

Tyto soubory **nemohou** importovat z TypeScriptu a vyžadují ruční úpravu:

| Soubor | Co upravit |
|---|---|
| `astro.config.mjs` | `site` — URL webu (musí být string pro build) |
| `public/admin/config.yml` | `repo`, `site_url`, `DECAPBRIDGE_SITE_ID` — hodnoty z `site.ts` |
| `src/styles/global.css` | Barvy v `@theme`, font names v `@font-face` |

**Tip:** Hodnoty pro config.yml najdeš v `site.ts` pod `cms.githubRepo` a `cms.decapBridgeSiteId`.

### 5. Fonty

1. Stáhni WOFF2 z [Google Webfonts Helper](https://gwfh.mranftl.com/fonts)
2. Ulož do `public/fonts/`
3. Uprav `@font-face` v `src/styles/global.css`

### 6. Favicony a assets

- Favicon sadu vygeneruj např. na [realfavicongenerator.net](https://realfavicongenerator.net)
- OG image (1200×630) ulož jako `public/og-image.jpg`
- Logo ulož jako `public/images/logo.png`

### 7. Environment variables (Netlify Dashboard)

| Proměnná | Typ | Popis |
|---|---|---|
| `TURNSTILE_SITE_KEY` | Build-time | Veřejný Cloudflare Turnstile key |
| `TURNSTILE_SECRET_KEY` | Runtime | Tajný Turnstile key |
| `RESEND_API_KEY` | Runtime | Resend API klíč |
| `RESEND_FROM_EMAIL` | Runtime | Odesílací email (např. noreply@firma.cz) |
| `INQUIRY_RECIPIENT` | Runtime | Kam chodí poptávky |

## Struktura šablony

```
sablona/
├── README.md                       ← Tento soubor
├── astro.config.mjs                ← Astro + Tailwind + sitemap
├── netlify.toml                    ← Build + functions config
├── src/
│   ├── data/
│   │   └── site.ts                 ← ** HLAVNÍ CONFIG — vyplnit první **
│   ├── content.config.ts           ← Content Collections schema
│   ├── styles/
│   │   └── global.css              ← Tokeny, animace, utility (upravit barvy + fonty)
│   ├── layouts/
│   │   └── BaseLayout.astro        ← SEO, OG, JSON-LD (čte z site.ts)
│   ├── components/
│   │   └── CookieConsent.astro     ← Consent Mode v2 (čte z site.ts)
│   ├── pages/
│   │   ├── cms.astro               ← CMS redirect (čte z site.ts)
│   │   └── 404.astro               ← Custom 404 (čte z site.ts)
│   └── utils/
│       ├── validation.ts           ← Klientská validace formuláře
│       └── storage.ts              ← Session/localStorage helpery
├── public/
│   └── admin/
│       ├── config.yml              ← Decap CMS config (ruční úprava)
│       └── index.html              ← Decap CMS entry point
└── netlify/
    └── functions/
        └── submit-inquiry/
            └── submit-inquiry.mts  ← Formulářový backend (upravit pole + email šablonu)
```
