---
name: execute-conversion
description: Execute a web project conversion from a prototype into a production-ready stack, or scaffold a new project from a template. Use this skill when someone wants to actually perform a conversion (not just plan it), scaffold a new web project from a template, build a new client website from an architectural template, create a simple landing page from the static HTML template, or execute an existing conversion plan. Supports multiple templates — Astro (static sites), Next.js + Supabase (dashboards), Vite + Supabase (SPAs), and static HTML (landing pages). Trigger on phrases like "convert this project", "execute the conversion", "scaffold new project", "create new Astro project", "create a landing page", "simple static site", "set up the site", "run the conversion plan", "start the build", "create from template", or when a user has an approved conversion plan and wants to proceed. If no conversion plan exists yet, suggest running plan-conversion first unless the user explicitly wants to scaffold from scratch.
---

# Execute Conversion

You are a web developer executing a project conversion or scaffolding a new project from a template. You work methodically, phase by phase, and confirm with the user at key checkpoints.

## Two modes

### Mode A: Execute a conversion plan
The user has a conversion plan (from `plan-conversion` or written manually). Follow it phase by phase.

### Mode B: Scaffold from scratch
The user wants a new project from a template without a source prototype. They provide a project spec (what the site is for, what pages it needs, design direction).

If the user asks to convert but has no plan yet, suggest they run `plan-conversion` first. If they insist on skipping the plan, do a quick inline analysis before executing.

## Inputs

**Mode A (conversion):**
1. **Conversion plan** — path to the plan markdown, or the plan from a previous conversation
2. **Source project path** — local folder with the prototype
3. **Target project path** — where to create the new project

**Mode B (scaffold):**
1. **Template to use** — which template (or let the skill recommend based on requirements)
2. **Project spec** — what the site needs (pages, features, design tokens, content)
3. **Target project path** — where to create the project

## Process: Mode A (Conversion)

### Phase 0: Setup

1. Read the conversion plan
2. Verify the source project exists and matches the plan's expectations
3. Select the template — read from `references/templates/`
4. Scaffold the target project:

```bash
npm create astro@latest -- --template minimal <project-name>
cd <project-name>
```

5. Install dependencies listed in the template spec
6. Copy template files from the references into the new project

**Checkpoint:** Tell the user "Project scaffolded with template files. Ready to start converting?"

### Phase 1: Design Tokens

Follow the plan's color/font mapping:

1. Read the source project's CSS/config to get exact color values
2. Update `src/styles/global.css` — fill in the `@theme` block with mapped colors
3. Download fonts as WOFF2 (guide the user or use a script) and set up `@font-face`
4. Copy over custom CSS classes listed in the plan (noise-overlay, animations, etc.)

Adapt the global.css from the template — don't overwrite it, merge your tokens into the existing structure.

### Phase 2: Data Extraction

Before converting components, extract all hardcoded data into `src/data/` files. The plan lists what to extract and from where. For each data file:

1. Read the source component to get the exact data
2. Create a typed TypeScript file in `src/data/`
3. Export typed arrays/objects with the actual content

This makes component conversion cleaner — components import data instead of containing it.

### Phase 3: Component Conversion

Work through the plan's component table. For each component:

**Static components:**
1. Read the source `.tsx` file
2. Create the `.astro` file
3. Convert JSX → Astro template: `className` → `class`, remove React wrapper, remap CSS classes per the design token mapping
4. Import data from `src/data/` instead of hardcoding
5. Add responsive improvements noted in the plan (`grid-cols-1` mobile fallbacks, `px-4 sm:px-8`)
6. Add AOS attributes where the plan specifies animations

**Interactive components:**
1. Read the source `.tsx` file carefully — understand every `useState` and `useEffect`
2. Create the `.astro` file with the HTML template
3. Write a `<script>` block that replicates the interactivity:
   - `useState` → DOM manipulation (classList, setAttribute, textContent)
   - `useEffect` + cleanup → `AbortController` pattern
   - Event handlers on JSX → `addEventListener` in script
   - **Always** add `astro:page-load` listener for SPA re-initialization
   - **Always** use `AbortController` for cleanup of document/window listeners
4. Add ARIA attributes for accessibility

**The AbortController + astro:page-load pattern (use for every interactive component):**

```astro
<script>
  let controller: AbortController | null = null;

  function init() {
    controller?.abort();
    controller = new AbortController();
    const { signal } = controller;

    const el = document.getElementById('my-element');
    if (!el) return;

    // All event listeners use { signal } for automatic cleanup
    window.addEventListener('scroll', () => { /* ... */ }, { passive: true, signal });
    el.addEventListener('click', () => { /* ... */ }, { signal });
  }

  init();
  document.addEventListener('astro:page-load', init);
</script>
```

### Phase 4: Pages and Routing

1. Create page files in `src/pages/` following the plan's routing table
2. Each page imports its components and wraps them in `BaseLayout`
3. For dynamic routes, implement `getStaticPaths()` using data from `src/data/`
4. Fix navigation links — anchor links must use absolute paths (`/#section` not `#section`)

### Phase 5: Icons

Follow the plan's icon strategy. Typical approaches:
- **Inline SVG** — copy from lucide.dev, paste directly
- **astro-icon** — `npm install astro-icon @iconify-json/lucide`, then `<Icon name="lucide:shield" />`
- **Custom Icon.astro wrapper** — for Font Awesome or similar

### Phase 6: UI Component Replacement

Replace UI library components (shadcn/ui, Radix, etc.) with plain HTML + Tailwind. The plan provides a mapping table. These are usually straightforward — a `<Button>` becomes an `<a>` or `<button>` with Tailwind classes.

### Phase 7: Forms

1. Build the form HTML with fields from the plan
2. Wire up client-side validation using `src/utils/validation.ts` from the template
3. Add Turnstile widget (template has the integration ready)
4. Customize the Netlify Function — update field names, email template text
5. List the environment variables the user needs to set in Netlify Dashboard

### Phase 8: CMS

1. Update `public/admin/config.yml` with project-specific collections
2. Update `src/content.config.ts` with matching Zod schemas
3. Guide user through DecapBridge registration if needed

### Phase 9: Final Polish

1. SEO — fill in `src/data/site.ts` with actual site metadata
2. Favicons — remind user to generate and place in `public/`
3. OG image — remind user to create 1200x630 image
4. Test build: `npm run build`
5. Fix any build errors

**Checkpoint:** "Build passes. Ready to review in the browser?"

### Phase 10: Deploy

Guide the user through:
1. Git init + push to GitHub
2. Connect to Netlify
3. Set environment variables
4. Configure custom domain
5. Verify production build

## Process: Mode B (Scaffold from scratch)

1. Determine which template to use — read `references/templates/*/template-spec.md`
2. Follow the template-specific scaffold process below

### Mode B: Astro-Netlify scaffold

1. Scaffold the project (same as Phase 0 above)
2. Fill in `src/data/site.ts` with the project details
3. Update design tokens in `global.css` based on the user's design direction
4. Create placeholder pages in `src/pages/` based on the project spec
5. Create data files in `src/data/` with placeholder content
6. Set up CMS collections if needed
7. Build and verify

### Mode B: Static HTML scaffold

For the `static-html` template, the process is much simpler — no npm, no build step:

1. Copy `index.html`, `styles.css`, `netlify.toml` from the template's `sablona/` directory
2. Replace all `{{PLACEHOLDER}}` values with project details (company name, address, phone, email, colors)
3. Customize sections — add/remove service cards, update copy, adjust layout
4. Add project-specific fonts: download WOFF2 files to `/fonts/`, uncomment and update `@font-face` in `styles.css`
5. Customize colors in the `tailwind.config` script block inside `index.html`
6. Add images (hero background, OG image, favicon)
7. Open in browser to preview — no build needed
8. Deploy to Netlify (drag & drop or git push)
9. Configure form notifications in Netlify Dashboard → Forms

### Mode B: Next.js + Supabase scaffold

1. Create Next.js project: `npx create-next-app@latest --typescript --tailwind --app <project-name>`
2. Copy all template files from `sablona/` into the project
3. Install dependencies from template's `package.json`
4. Replace `{{PLACEHOLDER}}` values: APP_NAME, APP_DESCRIPTION, APP_SLUG
5. Set up Supabase project (create on supabase.com, get URL + anon key)
6. Fill `.env.local` with Supabase credentials and DATABASE_URL
7. Customize design tokens in `src/index.css` (colors, fonts)
8. Customize `tailwind.config.ts` if needed
9. Run Drizzle migrations: `npm run drizzle:generate && npm run drizzle:migrate`
10. Create additional pages/routes based on the project spec
11. Create Drizzle schema tables for project-specific data in `db/schema.ts`
12. Create API routes + React Query hooks for each entity
13. Test locally: `npm run dev`
14. Deploy to Netlify, set environment variables

### Mode B: Vite + Supabase SPA scaffold

1. Create Vite project: `npm create vite@latest <project-name> -- --template react-ts`
2. Copy all template files from `sablona/` into the project
3. Install dependencies from template's `package.json`
4. Replace `{{PLACEHOLDER}}` values: APP_NAME, APP_SLUG
5. Set up Supabase project (create on supabase.com, get URL + anon key)
6. Fill `.env` with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
7. Start Supabase locally: `supabase start`
8. Define database tables in `supabase/schemas/` SQL files
9. Generate migrations: `supabase db diff -f initial_schema`
10. Generate types: `supabase gen types typescript --local > src/lib/database.types.ts`
11. Customize design tokens in `src/index.css`
12. Create additional pages and routes in `src/router.tsx`
13. Create Supabase RPC functions + TanStack Query hooks for each entity
14. Test locally: `npm run dev`
15. Deploy to Netlify (SPA mode), set environment variables

## Key principles

- **Work phase by phase.** Don't try to do everything at once. Complete one phase, verify it works, move to the next.
- **Read before write.** Always read the source component before writing the target. Don't guess at data structures or interactivity patterns.
- **Preserve the template's patterns.** The template files (BaseLayout, CookieConsent, global.css) are battle-tested. Extend them, don't replace them.
- **Every interactive component needs astro:page-load.** This is the #1 source of bugs in Astro conversions. The SPA router (ClientRouter) means components re-mount on navigation. Without `astro:page-load`, interactive components break when navigating back to a page.
- **AbortController for cleanup.** Without it, event listeners stack up on every page navigation, causing memory leaks and duplicate behavior.
- **Mobile-first responsive.** Always add `grid-cols-1` on mobile grids. Always add `px-4 sm:px-8` on full-width sections. The source prototype often only designs for desktop.
- **Absolute anchor links.** `#section` works on the homepage but breaks on subpages. Always use `/#section`.

## Verifying documentation freshness

During conversion, if you encounter a pattern that doesn't work as expected or want to confirm the correct API for a specific library version, use the **Context7 MCP tool** (`context7`) to check current documentation.

Typical situations:
- A scaffold command fails or produces unexpected output
- A config format has changed since the template was written
- You need the exact API signature for a Supabase/Drizzle/Astro function
- The conversion guide references a pattern that might be outdated

Call `resolve-library-id` → `query-docs` with a specific question. This keeps the conversion aligned with current best practices even as libraries evolve.

## References

- `references/templates/` — production templates with all files
- `references/conversion-guides/` — detailed conversion guides
