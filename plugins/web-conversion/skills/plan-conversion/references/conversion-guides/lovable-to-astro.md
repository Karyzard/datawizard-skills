# Konverzní manuál: Lovable prototyp → Astro stack

Tento dokument popisuje postup převodu prototypu vytvořeného v Lovable (React + Vite + Tailwind + shadcn/ui) do produkčního Astro stacku definovaného v [final-architecture.md](../final-architecture.md).

**Self-contained:** Všechny šablonové soubory jsou ve složce [sablona/](sablona/) — není potřeba kopírovat z jiného projektu.

---

## Přehled konverze

| Z (Lovable) | Na (Astro stack) |
|---|---|
| React 18 SPA | Astro 6 SSG (statický web) |
| React Router (client-side) | File-based routing (`src/pages/`) |
| React komponenty (`.tsx`) | Astro komponenty (`.astro`) |
| Tailwind 3 + CSS variables (HSL) | Tailwind 4 + `@theme` tokeny |
| shadcn/ui (Radix) | Nahrazeno čistým HTML + Tailwind |
| useState / useEffect | Inline `<script>` s `astro:page-load` |
| Žádný backend | Netlify Functions + Resend + Turnstile |
| Žádný CMS | Decap CMS + Content Collections |
| Google Fonts (runtime) | Self-hosted WOFF2 |

---

## Fáze konverze

### Fáze 0: Příprava nového projektu

1. **Scaffold Astro projekt:**
   ```bash
   npm create astro@latest -- --template minimal nazev-projektu
   cd nazev-projektu
   npm install tailwindcss @tailwindcss/vite @astrojs/sitemap
   ```

2. **Zkopírovat soubory ze složky `sablona/`** (v tomto repo `docs/konverze/sablona/`):
   ```bash
   # Z kořene nového projektu:
   cp -r docs/konverze/sablona/* .
   ```
   Pak nahradit `{{PLACEHOLDER}}` hodnoty — viz [sablona/README.md](sablona/README.md) pro kompletní seznam.

   **Obsah šablony:**
   - `astro.config.mjs` — Astro + Tailwind + sitemap config
   - `netlify.toml` — build + functions config
   - `netlify/functions/submit-inquiry/submit-inquiry.mts` — kompletní formulářový backend
   - `public/admin/config.yml` — Decap CMS + DecapBridge auth config
   - `public/admin/index.html` — Decap CMS entry point
   - `src/layouts/BaseLayout.astro` — hlavní layout (SEO, OG, JSON-LD, ClientRouter, AOS)
   - `src/styles/global.css` — design tokeny, animace, utility třídy
   - `src/components/CookieConsent.astro` — cookie consent + Consent Mode v2
   - `src/content.config.ts` — Content Collections schema
   - `src/utils/validation.ts` — klientská validace formuláře
   - `src/utils/storage.ts` — session/localStorage helpery
   - `src/pages/cms.astro` — CMS redirect
   - `src/pages/404.astro` — custom 404 stránka

3. **Vytvořit adresářovou strukturu:**
   ```
   src/
   ├── components/
   ├── data/
   ├── content/
   ├── layouts/
   ├── pages/
   ├── styles/
   │   └── global.css
   └── utils/
   ```

---

### Fáze 1: Design tokeny — Tailwind config → global.css

Lovable používá Tailwind 3 s HSL CSS variables. Astro stack používá Tailwind 4 s `@theme`.

**Postup:**

1. Otevřít `tailwind.config.ts` z Lovable projektu
2. Otevřít `src/index.css` z Lovable projektu
3. Převést barvy do `@theme` bloku v `src/styles/global.css`

**Příklad převodu:**

```css
/* Lovable (tailwind.config.ts + index.css) */
/* --navy: 213 96% 8%  →  hsl(213, 96%, 8%)  →  hex */
/* --yellow: 56 100% 50%  →  hsl(56, 100%, 50%)  →  hex */

/* Astro stack (global.css) */
@import "tailwindcss";

@theme {
  --color-primary: #011227;      /* navy */
  --color-secondary: #262626;    /* charcoal */
  --color-accent: #ffee00;       /* yellow */
  --color-accent-hover: #ccb800; /* yellow-hover */
  --color-text-DEFAULT: #ffffff; /* card/foreground */
  --color-text-muted: #808998;   /* muted */
  --color-border: rgba(255, 255, 255, 0.1);
  --color-card: #011227;         /* navy card bg */
  --color-light-gray: #f0f0f0;  /* light-gray */
  --font-sans: 'Poppins', sans-serif;
  --font-heading: 'Bebas Neue', sans-serif;
}
```

4. **Zkopírovat custom CSS třídy** z Lovable `index.css`:
   - `.noise-overlay` → přímo přenositelné
   - `.light-texture` → přímo přenositelné
   - `.animate-glow-pulse` → přepsat jako `@keyframes` v global.css
   - `.spotlight-card` / `.spotlight-grid` → přímo přenositelné
   - `.logo-scroll-wrapper` + `.logo-scroll-track` → odpovídá `.marquee-fade` + `.marquee-track`
   - Focus styly formuláře → přímo přenositelné

5. **Převést font import:**
   - Lovable: `@import url('https://fonts.googleapis.com/...')` v CSS
   - Astro: Stáhnout WOFF2 z Google Fonts → `public/fonts/` → `@font-face` v global.css

**Tabulka mapování tříd:**

| Lovable třída | Astro ekvivalent | Poznámka |
|---|---|---|
| `bg-navy` | `bg-primary` | Přejmenovat v @theme |
| `bg-yellow` | `bg-accent` | |
| `text-yellow` | `text-accent` | |
| `bg-light-gray` | `bg-light-gray` | Přidat do @theme |
| `text-card` | `text-text` | Přejmenovat |
| `text-card/80` | `text-text/80` | Tailwind opacity syntax |
| `shadow-card` | `shadow-card` | Definovat v @theme nebo custom CSS |
| `font-heading` | `font-heading` | Přidat `--font-heading` do @theme |
| `font-body` | `font-sans` | Výchozí font |
| `noise-overlay` | `noise-overlay` | Kopie z Lovable index.css |
| `light-texture` | `light-texture` | Kopie z Lovable index.css |

---

### Fáze 2: React komponenty → Astro komponenty

Toto je jádro konverze. Každý React `.tsx` soubor se převádí na `.astro`.

#### Pravidla převodu

**A) Statická komponenta (bez state/hooks):**

```tsx
// React (Lovable)
export const About = () => {
  return (
    <section id="about" className="py-16 bg-navy">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-heading">O nás</h2>
        <p className="text-card/80">Text...</p>
      </div>
    </section>
  );
};
```

```astro
---
// Astro — frontmatter (server-side)
---

<section id="about" class="py-16 bg-primary">
  <div class="container mx-auto px-4 sm:px-8">
    <h2 class="text-4xl font-heading">O nás</h2>
    <p class="text-text/80">Text...</p>
  </div>
</section>
```

**Změny:**
- `className` → `class`
- Odstranit `export`, `return`, závorky
- Přejmenovat barvy dle @theme mapování
- Přidat `px-4 sm:px-8` na full-width sekce (lesson learned)

**B) Komponenta s hardcoded daty:**

```tsx
// React (Lovable)
const products = [
  { title: "Dveře", desc: "...", icon: DoorOpen },
  { title: "Mříže", desc: "...", icon: Grid },
];

export const Products = () => {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {products.map((p, i) => (
        <div key={i} className="bg-card p-8">
          <p.icon size={44} />
          <h3>{p.title}</h3>
        </div>
      ))}
    </div>
  );
};
```

```astro
---
// Astro — extrahovat data do src/data/
import { products } from '../data/products';
---

<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
  {products.map((p) => (
    <div class="bg-card p-8">
      <Icon name={p.icon} size={44} />
      <h3>{p.title}</h3>
    </div>
  ))}
</div>
```

**Změny:**
- Extrahovat data pole do `src/data/*.ts`
- Lucide ikony → buď inline SVG, nebo vlastní `Icon.astro` wrapper
- Přidat `grid-cols-1` mobile fallback

**C) Komponenta s interaktivitou (state/hooks):**

```tsx
// React (Lovable) — Header s hamburger menu
export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed ${scrolled ? 'bg-navy/90 backdrop-blur' : ''}`}>
      <button onClick={() => setMobileOpen(!mobileOpen)}>☰</button>
      {mobileOpen && <nav>...</nav>}
    </header>
  );
};
```

```astro
---
// Astro — HTML v template, JS v <script>
import { navLinks } from '../data/navigation';
---

<header id="main-header" class="fixed top-0 left-0 right-0 z-50 transition-all">
  <nav class="container mx-auto px-4 sm:px-8">
    <!-- Desktop nav -->
    <div class="hidden lg:flex gap-8">
      {navLinks.map((link) => (
        <a href={link.href} class="nav-link text-sm uppercase">{link.label}</a>
      ))}
    </div>

    <!-- Hamburger button -->
    <button id="mobile-toggle" class="lg:hidden" aria-label="Menu" aria-expanded="false">
      <svg>...</svg>
    </button>

    <!-- Mobile menu -->
    <div id="mobile-menu" class="hidden lg:hidden">
      {navLinks.map((link) => (
        <a href={link.href} class="block py-3">{link.label}</a>
      ))}
    </div>
  </nav>
</header>

<script>
  let controller: AbortController | null = null;

  function initHeader() {
    controller?.abort();
    controller = new AbortController();
    const { signal } = controller;

    const header = document.getElementById('main-header');
    const toggle = document.getElementById('mobile-toggle');
    const menu = document.getElementById('mobile-menu');
    if (!header || !toggle || !menu) return;

    // Scroll state
    window.addEventListener('scroll', () => {
      header.classList.toggle('bg-primary/90', window.scrollY > 20);
      header.classList.toggle('backdrop-blur-md', window.scrollY > 20);
    }, { passive: true, signal });

    // Mobile toggle
    toggle.addEventListener('click', () => {
      const isOpen = !menu.classList.contains('hidden');
      menu.classList.toggle('hidden');
      toggle.setAttribute('aria-expanded', String(!isOpen));
    }, { signal });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        menu.classList.add('hidden');
        toggle.setAttribute('aria-expanded', 'false');
      }
    }, { signal });
  }

  initHeader();
  document.addEventListener('astro:page-load', initHeader);
</script>
```

**Změny:**
- `useState` → DOM manipulace (classList.toggle, setAttribute)
- `useEffect` + cleanup → `AbortController`
- Event handlers na elementech → `addEventListener` v `<script>`
- **Povinně** `astro:page-load` pro SPA reinicializaci
- ARIA atributy pro přístupnost

---

### Fáze 3: Routing — React Router → Astro pages

| React Router route | Astro soubor |
|---|---|
| `/` | `src/pages/index.astro` |
| `/bezpecnostni-dvere/masterdoor-ad-rc3` | `src/pages/bezpecnostni-dvere/[slug].astro` |
| `/bezpecnostni-mrize` | `src/pages/bezpecnostni-mrize.astro` |
| `*` (404) | `src/pages/404.astro` |

**Pro dynamické produktové stránky:**

```astro
---
// src/pages/bezpecnostni-dvere/[slug].astro
import { productCatalog } from '../../data/products';
import BaseLayout from '../../layouts/BaseLayout.astro';

export function getStaticPaths() {
  return productCatalog.map((product) => ({
    params: { slug: product.slug },
    props: { product },
  }));
}

const { product } = Astro.props;
---

<BaseLayout title={product.name}>
  <!-- obsah detail stránky -->
</BaseLayout>
```

**Navigační odkazy:**
- `<Link to="/page">` → `<a href="/page">`
- `<a href="#section">` → `<a href="/#section">` (absolutní cesta — lesson learned!)

---

### Fáze 4: Data extrakce

Všechna hardcoded data z React komponent extrahovat do `src/data/`:

| Data | Zdrojová komponenta | Cílový soubor |
|---|---|---|
| Nav linky | `Header.tsx` | `src/data/navigation.ts` |
| Produktové karty | `Products.tsx` | `src/data/products.ts` |
| Modely dveří | `ProductShowcase.tsx` | `src/data/products.ts` (rozšířit) |
| Specifikace RC3 | `ProductRC3.tsx` | `src/data/products.ts` |
| Povrchové úpravy | `ProductRC3.tsx` | `src/data/surfaces.ts` |
| Služby / "Proč my" | `WhyUs.tsx` | `src/data/services.ts` |
| Loga klientů | `LogoBar.tsx` | `src/data/references.ts` |
| Proces (kroky) | `Process.tsx` | `src/data/process.ts` |
| Certifikace | `Certifications.tsx` | `src/data/certifications.ts` |
| Kontaktní pobočky | `ContactForm.tsx` | `src/data/locations.ts` |
| Kategorie mříží | `GrillesPage.tsx` | `src/data/grilles.ts` |

---

### Fáze 5: Ikony — Lucide React → alternativa

Lovable používá `lucide-react`. V Astro máme tyto možnosti:

**Varianta A: Inline SVG (doporučeno pro malé projekty)**
- Zkopírovat SVG z [lucide.dev](https://lucide.dev)
- Vložit přímo do HTML

**Varianta B: Icon.astro wrapper**
```astro
---
// src/components/Icon.astro
interface Props {
  name: string;
  size?: number;
  class?: string;
}
const { name, size = 24, class: className = '' } = Astro.props;
---
<i class={`fa-solid fa-${name} ${className}`} style={`font-size: ${size}px`}></i>
```

**Varianta C: astro-icon balíček**
```bash
npm install astro-icon @iconify-json/lucide
```
Pak: `<Icon name="lucide:shield" size={24} />`

---

### Fáze 6: shadcn/ui → čistý HTML + Tailwind

Většina shadcn/ui komponent v Lovable prototypu se **nepoužívá** v produkci. Ty, které ano, nahradit:

| shadcn/ui | Astro náhrada |
|---|---|
| `<Button>` | `<a class="inline-flex bg-accent text-primary px-6 py-3 font-semibold hover:bg-accent-hover">` |
| `<Input>` | `<input class="w-full bg-card border border-border px-4 py-3 text-sm">` |
| `<Select>` | `<select class="w-full bg-card border border-border px-4 py-3 text-sm">` |
| `<Textarea>` | `<textarea class="w-full bg-card border border-border px-4 py-3 text-sm">` |
| `<Toaster>` | Vlastní toast v `<script>` nebo vůbec |

---

### Fáze 7: Scroll animace — RevealOnScroll → AOS.js

Lovable má custom `RevealOnScroll` wrapper (IntersectionObserver + CSS transitions). Astro stack používá AOS.js.

**Převod:**

```tsx
// Lovable
<RevealOnScroll delay={0.2}>
  <div>Obsah</div>
</RevealOnScroll>
```

```astro
<!-- Astro -->
<div data-aos="fade-up" data-aos-delay="200">
  Obsah
</div>
```

AOS se inicializuje v `BaseLayout.astro` (už je v šabloně).

---

### Fáze 8: Formulář — mock → produkční backend

Lovable formulář má jen `alert("Děkujeme")`. Nahradit plně funkčním backendem ze šablony:

1. Zkopírovat `netlify/functions/submit-inquiry/` z web-jr-service
2. Upravit pole formuláře v `submit-inquiry.mts` (name, email, phone, category, message)
3. Zkopírovat Turnstile integraci z `Contact.astro`
4. Nastavit env variables v Netlify Dashboard
5. Upravit email šablonu (`buildEmailHtml`, `buildEmailText`)

---

### Fáze 9: CMS setup

1. Zaregistrovat projekt na DecapBridge
2. Získat Site ID
3. Upravit `public/admin/config.yml` — repo, branch, site ID, kolekce
4. Definovat Content Collections v `src/content.config.ts`

---

### Fáze 10: Deploy

1. Vytvořit GitHub repo
2. Propojit s Netlify
3. Nastavit env variables (Turnstile, Resend, recipient email)
4. Nastavit custom doménu
5. Ověřit build + deploy

---

## Checklist konverze

Kompletní checklist pro sledování postupu:

- [ ] Scaffold Astro projekt
- [ ] Zkopírovat šablonové soubory (BaseLayout, CookieConsent, functions, admin)
- [ ] Převést design tokeny (barvy, fonty) do `global.css`
- [ ] Stáhnout a self-hostovat fonty (WOFF2)
- [ ] Zkopírovat custom CSS třídy (noise, glow, marquee, spotlight)
- [ ] Extrahovat data do `src/data/*.ts`
- [ ] Převést statické komponenty (About, Services, Products, Footer, ...)
- [ ] Převést interaktivní komponenty (Header, Contact, BackToTop, ...)
- [ ] Přidat `astro:page-load` reinicializaci na všechny interaktivní komponenty
- [ ] Přidat `AbortController` na document/window listenery
- [ ] Nahradit Lucide ikony (inline SVG nebo astro-icon)
- [ ] Nahradit shadcn/ui komponenty čistým HTML + Tailwind
- [ ] Vytvořit file-based routes (`src/pages/`)
- [ ] Přidat dynamické routes s `getStaticPaths()`
- [ ] Opravit navigační linky na absolutní cesty (`/#section`)
- [ ] Přidat responsive padding (`px-4 sm:px-8`) na všechny sekce
- [ ] Přidat `grid-cols-1` mobile fallback na všechny gridy
- [ ] Nahradit RevealOnScroll za AOS.js atributy
- [ ] Napojit formulář na Netlify Function + Turnstile
- [ ] Nastavit Decap CMS
- [ ] Přidat SEO (OG, Twitter Card, JSON-LD, sitemap, robots.txt)
- [ ] Přidat a11y (skip-to-content, ARIA, reduced motion)
- [ ] Přidat favicon sadu + PWA manifest
- [ ] Deploy na Netlify
- [ ] Otestovat mobilní overflow (pinch-zoom)
- [ ] Otestovat scrollbar (Windows / macOS "Always show")
- [ ] Otestovat SPA navigaci (tam a zpět mezi stránkami)

---

## Odhad náročnosti

| Fáze | Náročnost | Poznámka |
|---|---|---|
| 0. Scaffold | Nízká | Kopie ze šablony |
| 1. Design tokeny | Nízká | Mechanický převod |
| 2. Komponenty (statické) | Střední | ~10 komponent, většinou copy-paste HTML |
| 3. Komponenty (interaktivní) | Vyšší | ~5 komponent, přepis hooks → vanilla JS |
| 4. Routing | Nízká | File-based, přímočaré |
| 5. Data extrakce | Nízká | Mechanická práce |
| 6. Ikony | Nízká | Inline SVG nebo balíček |
| 7. shadcn → HTML | Nízká | Většinu nepotřebujeme |
| 8. Animace | Nízká | AOS atributy místo wrapperu |
| 9. Formulář | Nízká | Kopie ze šablony + úprava polí |
| 10. CMS | Nízká | Kopie ze šablony + config |
| 11. Deploy | Nízká | Standardní Netlify flow |
