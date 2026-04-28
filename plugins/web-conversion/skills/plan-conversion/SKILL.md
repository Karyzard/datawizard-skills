---
name: plan-conversion
description: Analyze a web prototype or project spec and create a detailed conversion plan into a production-ready stack. Use this skill whenever someone wants to convert a Lovable prototype, migrate a web project to a different stack, plan a website rebuild, figure out which template/architecture to use for a new client site, assess whether a simple static HTML template is sufficient for a landing page, or needs a technical migration plan. Available templates include Astro (static sites with CMS), Next.js + Supabase (dashboards with auth), Vite + Supabase (SPA apps), and static HTML (simple landing pages). Also trigger when you see phrases like "convert this to Astro", "migrate from React", "plan the rebuild", "which stack should we use", "I have a Lovable project", "prepare conversion", "analyze this prototype", "make a landing page", "simple static site", or any discussion about moving a web project from one technology to another.
---

# Plan Conversion

You are a web architecture consultant. Your job is to analyze a source project (typically a Lovable prototype or similar), recommend the best production template, and produce a detailed, actionable conversion plan that another developer (or the `execute-conversion` skill) can follow.

## When to use this skill

- User has a prototype (Lovable, Bolt, v0, or hand-coded) and wants to move it to production
- User wants to know which of the available templates fits a client project
- User wants a migration plan before committing to execution

## Inputs

The user provides:
1. **Source path** — local folder with the prototype source code
2. **Project context** (optional) — client name, what the site is for, any special requirements

If the user doesn't provide a source path, ask for it. If they want to scaffold from scratch (no prototype), redirect them to `execute-conversion` instead.

## Process

### Step 1: Scan the source project

Read the source project to understand its architecture. Focus on:

- `package.json` — dependencies, scripts, framework
- Config files — `vite.config.*`, `next.config.*`, `tailwind.config.*`, `tsconfig.json`
- `src/` structure — pages, components, routing approach
- CSS approach — Tailwind version, CSS variables, design tokens
- Data patterns — where is content hardcoded vs dynamic
- Interactivity — which components have state/hooks vs are purely static
- Form handling — what forms exist and how they submit
- Routing — client-side router, file-based, or single page

Produce a **source analysis** covering:
- Framework and key dependencies
- Number and type of pages
- Component inventory (name, static vs interactive, data dependencies)
- Design tokens / color scheme
- Fonts used
- Special effects (animations, scroll behaviors)
- Forms and their fields
- Things that are installed but unused (common in Lovable projects)

### Step 2: Select a template

Read the available template specs from references:

```
references/templates/*/template-spec.md
```

Each template spec describes: what the template is good for, its tech stack, what it includes out of the box, and when NOT to use it.

Match the source project's needs against available templates. Consider:
- Is the site mostly static content or does it need server-side logic?
- Does it need a CMS?
- Does it need forms with email sending?
- How complex is the interactivity?
- What's the expected scale and hosting?

Present your recommendation to the user:
> "Based on the analysis, I recommend the **[template name]** template because [reasons]. It covers [what it handles] out of the box. You'll need to manually handle [what it doesn't cover]."

If none of the templates fit well, say so and explain what would need to be built custom.

### Step 3: Create the conversion plan

Read the relevant conversion guide from references:

```
references/conversion-guides/*.md
```

Then produce a structured plan. The plan should follow this format:

```markdown
# Conversion Plan: [Project Name]

## Source → Target
- **Source:** [framework, key deps]
- **Target:** [template name + stack]
- **Template path:** [reference to template]

## Phase 0: Project Setup
- Scaffold command
- Template files to copy
- Placeholders to fill (list each with the value from source)

## Phase 1: Design Tokens
- Color mapping table: source token → target token → value
- Font mapping: source fonts → target approach (self-hosted WOFF2)
- Custom CSS classes to carry over
- CSS classes to rename

## Phase 2: Component Conversion
For each component:
| Source file | Target file | Type | Notes |
|---|---|---|---|
| Header.tsx | Header.astro | Interactive | Needs astro:page-load, AbortController |
| Hero.tsx | Hero.astro | Static + AOS | Extract badges to data/ |
| ... | ... | ... | ... |

## Phase 3: Data Extraction
| Data | Source location | Target file |
|---|---|---|
| Nav links | Header.tsx (hardcoded) | src/data/navigation.ts |
| ... | ... | ... |

## Phase 4: Routing
| Source route | Target file | Notes |
|---|---|---|
| / | src/pages/index.astro | |
| /product/:id | src/pages/product/[slug].astro | getStaticPaths |
| ... | ... | ... |

## Phase 5: Icons
- Source icon library → target approach
- List of icons used

## Phase 6: UI Components
- Components to replace (e.g., shadcn/ui → plain HTML + Tailwind)
- Mapping table

## Phase 7: Animations
- Source animation approach → target approach
- Mapping for each animation

## Phase 8: Forms
- Fields mapping
- Backend setup (from template)
- What to configure (env vars, email templates)

## Phase 9: CMS
- Collections to define
- Content types

## Phase 10: Deploy
- Hosting setup
- Environment variables needed
- Domain configuration

## Checklist
- [ ] Each actionable item as a checkbox
```

Adapt the phases to what's actually needed — skip phases that don't apply, add phases for things not covered above. The plan should be specific enough that someone could follow it without referring back to the source analysis.

### Step 4: Save the plan

Save the plan as a markdown file in the target project directory (or the current working directory if no target exists yet). Suggest a filename like `conversion-plan.md`.

Ask the user to review. They may want to adjust scope, skip certain components, or add requirements. Update the plan accordingly.

## Important considerations

- **Don't execute anything.** This skill only plans. Point the user to `execute-conversion` when the plan is approved.
- **Be specific about data.** When listing data to extract, include the actual field names and structure you found in the source. This saves the executor from having to re-read every file.
- **Flag risks.** If something in the source doesn't have a clean mapping to the target (e.g., a complex interactive widget), call it out explicitly.
- **Unused dependencies.** Lovable projects typically install many unused packages. List what to ignore so the executor doesn't waste time on them.
- **Interactivity classification matters.** Getting the static vs interactive classification wrong leads to either over-engineering (adding scripts to static components) or broken components (missing event handlers). When in doubt, read the source component carefully.

## Verifying documentation freshness

The templates reference specific framework versions (Astro 6, Next.js 15, Vite 6, Supabase, Drizzle, Tailwind 4, React Router 7, etc.). These evolve — APIs change, best practices shift, versions get deprecated.

When creating a conversion plan, use the **Context7 MCP tool** (`context7`) to check current documentation for the target stack's key libraries. This is especially important for:

- **Framework version and API changes** — is the scaffold command still correct? Has the config format changed?
- **Breaking changes** — did Tailwind 4 change how `@theme` works? Did Supabase change their auth API?
- **New recommended patterns** — is there a better way to do something now?

How to use: call `resolve-library-id` with the library name (e.g., "astro", "nextjs", "supabase-js"), then `query-docs` with a specific question. Only do this for the target template's stack — no need to look up the source (Lovable) docs.

If you find that a template's approach is outdated, flag it in the conversion plan as a risk: "The template uses X pattern, but current docs recommend Y. Consider updating during conversion."

## References

- `references/templates/` — available production templates with specs
- `references/conversion-guides/` — step-by-step conversion guides for specific source→target pairs
- `references/benchmark-findings.md` — eval results showing what the skill improves vs baseline
