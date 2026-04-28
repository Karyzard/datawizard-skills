# Benchmark Findings: web-project-conversion

Iteration 1 — 2026-04-05 | Model: claude-opus-4-6 | 3 test cases, with-skill vs without-skill (no skill)

## Overall Results

| Metric | With skill | Without skill | Delta |
|---|---|---|---|
| **Pass rate** | 100% (20/20) | 55% (11/20) | **+45%** |
| Avg time | 327s | 166s | +161s |
| Avg tokens | 66k | 30k | +36k |

The skill uses ~2x more tokens and time because it reads reference materials (template files, conversion guide). This is expected — the quality improvement justifies the cost.

---

## Eval 1: Plan Conversion (Lovable → production stack)

**Prompt:** "Mám Lovable prototyp, potřebuju konverzní plán do produkčního stacku."

| Assertion | With skill | Without skill |
|---|---|---|
| Source analysis | PASS | PASS |
| Recommends template | PASS (astro-netlify) | **FAIL** (chose Next.js) |
| Component mapping table | PASS (9 components, typed) | **FAIL** (list without mapping) |
| Color mapping | PASS (HSL→hex, token names) | **FAIL** (mentioned colors, no mapping) |
| Data extraction plan | PASS | PASS |
| Flags interactive components | PASS (astro:page-load noted) | **FAIL** (no reinit pattern) |
| Lists unused deps | PASS | PASS |
| **Score** | **7/7** | **3/7** |

### Key differences

**Template selection:** Without the skill, Claude recommended Next.js 14 + Vercel — a reasonable generic choice, but wrong for this use case (static marketing site). The skill guided to Astro-Netlify, which matches the team's architectural standard and includes production infrastructure (CMS, forms, cookie consent) out of the box.

**Plan specificity:** The with-skill plan included exact hex values for color mapping, specific file paths for data extraction targets, and the `astro:page-load + AbortController` pattern for interactive components. The without-skill plan was more general — "migrate colors to Tailwind" without specifying how.

**Phase structure:** With-skill produced a 10-phase plan matching the conversion guide structure. Without-skill produced a 7-phase plan with different organization (combined design + components, added testing phase).

---

## Eval 2: Scaffold from Scratch (new autoservis site)

**Prompt:** "Vytvoř web pro autoservis AutoMax — služby, ceník, kontaktní formulář."

| Assertion | With skill | Without skill |
|---|---|---|
| site.ts filled correctly | PASS | PASS |
| @theme design tokens | PASS | **FAIL** (used :root vars) |
| All 4 services present | PASS | PASS |
| Contact form exists | PASS | PASS |
| Pricing page/section | PASS | PASS |
| Uses BaseLayout | PASS | PASS |
| **Score** | **6/6** | **5/6** |

### Key differences

**Template utilization:** With-skill copied and customized the full template infrastructure — BaseLayout with SEO/OG/JSON-LD, CookieConsent with Consent Mode v2, Turnstile captcha on the form, Netlify Function for email sending. Without-skill created a minimal Layout.astro with basic meta tags, a form without backend, and no cookie consent or captcha.

**Tailwind version:** With-skill used Tailwind 4 `@theme` tokens. Without-skill defaulted to Tailwind 3 `:root` CSS variables — a working approach but inconsistent with the team's standard.

**Production readiness:** The with-skill output could be deployed with minimal work (fill env vars, add fonts). The without-skill output would need significant additional work — form backend, cookie consent, SEO meta, structured data.

---

## Eval 3: Direct Conversion (Lovable → Astro, no separate plan)

**Prompt:** "Mám Lovable prototyp, rovnou to převeď do Astro."

| Assertion | With skill | Without skill |
|---|---|---|
| Components converted | PASS (10 .astro files) | PASS (9 .astro files) |
| Data extracted to src/data/ | PASS (6 data files) | **FAIL** (hardcoded in components) |
| Colors mapped to @theme | PASS | **FAIL** (raw HSL copy) |
| astro:page-load on interactive | PASS | **FAIL** (missing everywhere) |
| AbortController pattern | PASS | **FAIL** (missing everywhere) |
| No className (React syntax) | PASS | PASS |
| No React imports | PASS | PASS |
| **Score** | **7/7** | **3/7** |

### Key differences

**Data layer:** With-skill extracted all hardcoded data into `src/data/*.ts` files (navigation, kitchens, features, process, testimonials, site config). Without-skill kept data hardcoded in component frontmatter — workable but harder to maintain and no central config.

**Interactive component patterns (critical):** This is the most important difference. Without the skill, Claude converted React hooks to vanilla JS correctly but missed two Astro-specific patterns:

1. **`astro:page-load`** — Astro's ClientRouter (SPA mode) means components don't re-mount on navigation. Without `astro:page-load`, interactive components (mobile menu, scroll detection, form handlers) break when the user navigates away and back. This is a production bug that's hard to debug because it works on first load.

2. **`AbortController`** — Without cleanup, every `astro:page-load` re-initialization adds duplicate event listeners. After navigating 5 pages, you'd have 5 scroll listeners stacking up. AbortController ensures the previous listeners are removed before adding new ones.

With-skill applied both patterns to Header.astro and ContactForm.astro consistently:

```astro
<script>
  let controller: AbortController | null = null;
  function init() {
    controller?.abort();
    controller = new AbortController();
    const { signal } = controller;
    // ... all listeners use { signal }
  }
  init();
  document.addEventListener('astro:page-load', init);
</script>
```

**Anchor links:** With-skill converted `#section` to `/#section` (absolute paths). Without-skill kept `#section` — this breaks on subpages where `#kontakt` would look for an element on the current page instead of navigating to homepage.

**CSS approach:** With-skill used Tailwind 4 `@theme` with hex values. Without-skill copied the Tailwind 3 HSL variable approach verbatim, which doesn't work with Tailwind 4's native CSS-first configuration.

---

## Patterns the skill consistently enforces

These are things Claude reliably does with the skill but reliably skips without it:

1. **Template selection from available options** — instead of recommending a generic stack
2. **Tailwind 4 `@theme` tokens** — instead of Tailwind 3 `:root` variables
3. **Data extraction to `src/data/`** — instead of hardcoding in components
4. **`astro:page-load` reinit** — critical for SPA navigation, never used by baseline
5. **`AbortController` cleanup** — prevents memory leaks, never used by baseline
6. **Absolute anchor links (`/#section`)** — prevents broken nav on subpages
7. **Production infrastructure** — CookieConsent, Turnstile, Netlify Functions, JSON-LD
8. **Responsive improvements** — `grid-cols-1` mobile fallbacks, `px-4 sm:px-8` padding
9. **AOS.js animations** — instead of custom CSS keyframes
10. **Self-hosted fonts** — instead of Google Fonts CDN (GDPR)
