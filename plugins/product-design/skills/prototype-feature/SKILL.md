---
name: prototype-feature
description: Generate a clickable HTML prototype for a feature spec folder. Reads spec markdown files, reads the app design system, then generates a self-contained prototype/ subfolder with one HTML file per identified screen. Use when user types /prototype-feature or asks to prototype a specific feature from a spec.
---

Generate a clickable HTML prototype for a feature spec folder.

Usage: /prototype-feature {path-to-feature-folder}

The path is relative to the repo root (např. ve FEOS repu: `../2026-feos-apps/11-admin-app-client-data/Client onboarding`).

## Step 1 — Read the feature spec

Read all markdown files in the given folder (skip subfolders like `archive/`, `context/`):
- Look for: screen/page descriptions, user flows, form fields, tab names, table columns, roles, states
- Identify every distinct screen/view the feature needs — list them before generating
- Note the feature name and which part of the app it lives in (from spec's "Umístění v aplikaci" section or equivalent)

## Step 2 — Read the app skeleton

Read these to get current design system + nav. Cesty jsou příklad z FEOS aplikace; čti je, pokud v projektu existují, jinak najdi ekvivalenty:
- `src/components/navigation/navigation-items.ts` — current nav structure
- `src/index.css` — CSS variables (colors, radius)
- `src/components/navigation/app-sidebar-header.tsx` — brand name

Also check if `docs/html-prototype/` exists and has a version folder — if yes, copy `theme.css`, `theme.js`, `nav.js` from the latest version. If not, generate them fresh from the sources above (same rules as `generate-prototype`).

## Step 3 — Plan screens

Before generating, output a numbered list of screens you identified:
```
Identifikované obrazovky:
1. Journey přehled — seznam aktivních journeys (nová sekce v menu)
2. Vytvoření journey — formulář s 6 poli
3. Detail journey — timeline touchpointů
...
```

Then proceed without waiting — generate all of them.

## Step 4 — Generate prototype

Create `{feature-folder}/prototype/` with:

**Shared files (copied/generated fresh — self-contained):**
- `theme.css` — full design tokens + base styles (same as generate-prototype output)
- `theme.js` — light/dark toggle
- `nav.js` — full sidebar navigation. Must match the real app structure exactly:
  - `alwaysOpen: true` sections → **card** with `border + border-radius`, card header with colored dot + uppercase label, subitem rows separated by `border-top`, Lucide SVG icons per row. Active = primární barva projektu (např. ve FEOS aplikaci `background: #E63946`).
  - `alwaysOpen: false` sections → collapsible row with icon + ChevronDown.
  - Dashboard → plain single link.
  - Footer at bottom podle sidebar footer komponenty projektu, pokud existuje (např. ve FEOS aplikaci `app-sidebar-footer.tsx`: "User Guide" + "Můj profil").
  - All icons as inline SVG via `createElementNS` — Lucide paths, never emoji.
  - Items without a prototype page: dimmed (`opacity: 0.35`), click blocked.
  - Add the feature's nav section to NAV_DATA if it doesn't exist in the real app yet.

**index.html** — entry point listing all screens with description and link to each

**One HTML file per identified screen**, named semantically (e.g. `journey-prehled.html`, `vytvoreni-journey.html`, `detail-journey.html`)

Each screen file:
- Uses `theme.css`, `theme.js`, `nav.js` from same folder (`./`)
- Has `<meta name="<projekt>-nav-active">` matching where this feature lives in the nav (or closest parent section); prefix podle nav.js (např. ve FEOS aplikaci `feos-nav-active`)
- Has `<meta name="<projekt>-nav-depth" content="0">` (all files are in prototype/ root)
- Topbar with breadcrumb showing path to this screen
- Realistic fake Czech data matching the spec (names, dates, statuses from the domain)
- For list/overview screens: clickable rows → detail screen
- For forms: all fields from spec, correct input types, validation hints
- For detail screens with tabs: all tabs functional via JS switchTab
- For flows (multi-step): prev/next navigation between steps

## Step 5 — After generating

1. List all generated files with one-line description each.
2. Say: "Prototyp vygenerován do `{feature-folder}/prototype/`. Otevři `index.html`."
