---
name: generate-prototype
description: Generate an HTML prototype of the current app state into docs/html-prototype/v{version}/. Supports fresh mode (first time) and diff mode (update from previous version). Use when user types /generate-prototype or asks to generate/update an HTML prototype of the app.
---

Generate an HTML prototype of the current app state into `docs/html-prototype/v$ARGUMENTS/`.

If no version argument given, ask the user: "Jakou verzi chcete přiřadit? (např. 1.0, 1.1)"

---

## Mode detection

Before doing anything, check if a previous version exists:

```
ls docs/html-prototype/
```

- **No previous version found** → **Fresh mode**: generate everything from scratch (Steps 1–3 below).
- **Previous version found** → **Diff mode**: copy and patch (Steps 1b–3b below).
- User passed `--fresh` flag → always use Fresh mode regardless.

---

## FRESH MODE (first time or --fresh)

### Step 1 — Read the app

Cesty níže jsou příklad z FEOS aplikace. Čti je, pokud v projektu existují; jinak najdi ekvivalenty (nav struktura, globální CSS, header komponenta).

1. `src/components/navigation/navigation-items.ts` — nav structure (sections, dotColor, subitems + urls)
2. `src/index.css` — CSS variables
3. `src/components/navigation/app-sidebar-header.tsx` — brand name, logo initials
4. For each nav subitem url, find the matching page in `src/pages/` — read it to understand structure

### Step 2 — Generate shared files

Create `docs/html-prototype/v{version}/`:

**theme.css** — extract from `src/index.css`:
- All `--sidebar-*` variables (convert HSL to hex)
- `--background`, `--foreground`, `--border`, `--radius`
- Base styles: reset, `.app-shell`, `.app-main`, `.topbar`, `.page-content`, `.card`, `.badge`, `.btn`, `.table`, `.tabs-bar`, `.tab-btn`, `.tab-panel`, `.avatar`, `.detail-header`, `.grid-2`, `.grid-3`, `.section-label`, `.progress-bar`, `.stat-number`
- Light + dark theme via `[data-theme="dark"]`

**theme.js** — light/dark toggle stored in `localStorage` key `<projekt>-theme` (např. ve FEOS aplikaci `feos-theme`). Auto-inject toggle button into `.topbar-right` on DOMContentLoaded.

**nav.js** — sidebar via DOM only (createElement/appendChild — never innerHTML with variable data):
- `alwaysOpen: true` sections → **card** with `border + border-radius`, card header with colored dot + uppercase label, subitem rows with `border-top` separators and Lucide SVG icons. Active = primární barva projektu (např. ve FEOS aplikaci `background: #E63946; color: #fff`).
- `alwaysOpen: false` sections → collapsible row with icon + ChevronDown. Toggle on click.
- Dashboard → plain single link.
- Footer: podle sidebar footer komponenty projektu, pokud existuje (např. ve FEOS aplikaci `app-sidebar-footer.tsx`: "User Guide" + "Můj profil").
- All icons as inline SVG via `createElementNS` — Lucide paths (Home, UserCheck, Users, User, BarChart3, Calendar, TrendingUp, FileText, Settings, CalendarClock, Stethoscope, ChevronDown, BookOpen). Never emoji.
- Items without a prototype page: `href="#"`, click blocked, `opacity: 0.35`.
- `<meta name="<projekt>-nav-active" content="...">` on each page sets the active item (prefix podle projektu, např. ve FEOS aplikaci `feos-nav-active`).

### Step 3 — Generate pages

**index.html** (Dashboard):
- Sections matching the nav structure, representative cards per section

**One HTML file per nav subitem**, path derived from nav url (`/leads/overview` → `leads/overview.html`):
- Topbar with breadcrumb, fake Czech data, structure matching real page
- Overview/list pages: clickable rows → `detail.html`
- Detail pages: functioning tab switcher via `switchTab()`
- Stub pages: placeholder block "Připravujeme..."

`<meta name="<projekt>-nav-active">` value: `{section-key}-{subitem-key}` (e.g. `leads-overview`)

---

## DIFF MODE (update from previous version)

### Step 1b — Find previous version and detect changes

1. Identify the latest existing version folder in `docs/html-prototype/` (highest version number).
2. Copy it as the new version: `cp -r docs/html-prototype/v{prev} docs/html-prototype/v{new}`
3. Read the project's nav structure file, pokud existuje (např. ve FEOS aplikaci `src/components/navigation/navigation-items.ts`).
4. Read `nav.js` from the **old** version — extract what nav structure it was built from.
5. Diff the two:
   - **New sections** added to nav → need new pages + update nav.js
   - **Removed sections** → remove their pages, update nav.js
   - **Changed subitem url or title** → update that page's breadcrumb + nav.js
   - **No nav changes** → nav.js and shared files stay as-is
6. For each changed/new subitem url, read the matching `src/pages/` component to understand current structure.

### Step 2b — Patch shared files (only if nav changed)

If nav structure changed:
- Update `nav.js` NAV_DATA — add/remove/rename sections and items. Keep existing icon assignments; assign sensible Lucide icons for new items.
- Do NOT touch `theme.css` or `theme.js` unless the project's global CSS (např. `src/index.css`) changed significantly.

### Step 3b — Patch pages (only changed/new)

- **New page**: generate from scratch (same rules as Fresh mode Step 3).
- **Changed breadcrumb/title only**: edit just that section in the existing file.
- **Removed page**: delete the file.
- **Unchanged pages**: leave completely untouched.

Report what was changed: "Aktualizováno: X stránek, přidáno: Y, odstraněno: Z."

---

## Step 4 — After generating (both modes)

1. List all generated/modified files with one-line description.
2. Say: "Prototyp vygenerován do `docs/html-prototype/v{version}/`. Otevři `index.html` v prohlížeči."
3. Ask: "Chcete prototyp zkopírovat i do jiné složky? Pokud ano, zadejte absolutní cestu (nebo 'ne')."
4. If path provided: `cp -r docs/html-prototype/v{version} "{path}/"` and confirm.
