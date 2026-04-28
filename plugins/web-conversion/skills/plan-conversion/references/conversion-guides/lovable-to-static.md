# Konverzní manuál: Lovable prototyp → Static HTML

Tento dokument popisuje postup převodu jednoduchého prototypu vytvořeného v Lovable (React + Vite + Tailwind + shadcn/ui) do čistého statického HTML s Tailwind CDN. Vhodné pro jednoduché landing pages a mikrosajty bez build procesu.

---

## Přehled konverze

| Z (Lovable) | Na (Static HTML) |
|---|---|
| React 18 SPA | HTML5 dokument |
| Vite (build tool) | Žádný build — přímé soubory |
| React komponenty (`.tsx`) | HTML sekce v jednom souboru |
| Tailwind 3 + CSS variables (HSL) | Tailwind 4 CDN (`<script>`) |
| useState / useEffect | Vanilla JS (`<script>`) |
| React Router (client-side) | Kotevní odkazy (`<a href="#section">`) |
| shadcn/ui (Radix) | Čistý HTML + Tailwind třídy |
| Lucide React ikony | Inline SVG z lucide.dev |
| `alert()` formulář | Netlify Forms (`data-netlify`) |

---

## Fáze konverze

### Fáze 1: HTML extrakce — JSX → čistý HTML

Jádro konverze. Každá React komponenta se "rozbalí" do HTML sekcí v jednom `index.html`.

#### Pravidla převodu

| JSX (Lovable) | HTML (Static) | Poznámka |
|---|---|---|
| `className="..."` | `class="..."` | Přejmenovat atribut |
| `{variable}` | Hardcoded hodnota | Nahradit proměnné textem |
| `<Component />` | `<section>...</section>` | Inline HTML místo importu |
| `<img src={logo} />` | `<img src="./images/logo.png" />` | Relativní cesta k souboru |
| `{items.map((item) => ...)}` | Rozepsané opakující se HTML | Každý prvek zvlášť |
| `<></>` (Fragment) | Smazat | V HTML nepotřebujeme |
| `onClick={() => ...}` | Smazat, řešit v `<script>` | Viz Fáze 4 |
| `{condition && <div>...</div>}` | `<div class="hidden" id="...">` | Toggle přes JS |
| Self-closing `<div />` | `<div></div>` | HTML vyžaduje zavírací tag |

**Příklad převodu:**

```tsx
// React (Lovable)
import { Shield, Clock, Award } from "lucide-react";

const features = [
  { title: "Bezpečnost", desc: "Certifikované řešení", icon: Shield },
  { title: "Rychlost", desc: "Do 48 hodin", icon: Clock },
  { title: "Garance", desc: "5 let záruka", icon: Award },
];

export const Features = () => {
  return (
    <section className="py-20 bg-navy">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-heading text-yellow mb-12">Proč my</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-card p-8 rounded-xl">
              <f.icon className="text-yellow" size={44} />
              <h3 className="text-xl font-bold mt-4">{f.title}</h3>
              <p className="text-card/80 mt-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

```html
<!-- Static HTML -->
<section id="proc-my" class="py-20 bg-primary">
  <div class="max-w-6xl mx-auto px-4 sm:px-8">
    <h2 class="text-4xl font-heading text-accent mb-12">Proč my</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

      <div class="bg-card p-8 rounded-xl">
        <svg class="text-accent" width="44" height="44"><!-- Shield SVG --></svg>
        <h3 class="text-xl font-bold mt-4">Bezpečnost</h3>
        <p class="text-text/80 mt-2">Certifikované řešení</p>
      </div>

      <div class="bg-card p-8 rounded-xl">
        <svg class="text-accent" width="44" height="44"><!-- Clock SVG --></svg>
        <h3 class="text-xl font-bold mt-4">Rychlost</h3>
        <p class="text-text/80 mt-2">Do 48 hodin</p>
      </div>

      <div class="bg-card p-8 rounded-xl">
        <svg class="text-accent" width="44" height="44"><!-- Award SVG --></svg>
        <h3 class="text-xl font-bold mt-4">Garance</h3>
        <p class="text-text/80 mt-2">5 let záruka</p>
      </div>

    </div>
  </div>
</section>
```

**Změny:**
- `className` → `class`
- `{features.map(...)}` → rozepsáno na 3 statické `<div>` bloky
- Lucide `<f.icon>` → inline `<svg>` (viz Fáze 3)
- Přejmenovat barvy: `bg-navy` → `bg-primary`, `text-yellow` → `text-accent`
- Přidat `grid-cols-1` mobile fallback
- Přidat `id="proc-my"` pro kotevní navigaci
- Přidat `sm:px-8` na kontejner pro tablet/desktop

---

### Fáze 2: Design tokeny — tailwind.config.ts → CDN config

Lovable používá Tailwind 3 s HSL CSS variables. Static verze používá Tailwind 4 CDN s konfigurací v `<script>` tagu.

**Postup:**

1. Otevřít `tailwind.config.ts` z Lovable projektu
2. Otevřít `src/index.css` — najít CSS variables (`:root { --navy: 213 96% 8%; ... }`)
3. Převést HSL hodnoty na hex (např. přes [hsl.to](https://hsl.to) nebo DevTools color picker)
4. Vložit do Tailwind CDN config bloku v `<head>`

**Příklad převodu:**

```css
/* Lovable (src/index.css) */
:root {
  --navy: 213 96% 8%;       /* hsl(213, 96%, 8%)   → #011227 */
  --yellow: 56 100% 50%;    /* hsl(56, 100%, 50%)  → #ffee00 */
  --charcoal: 0 0% 15%;     /* hsl(0, 0%, 15%)     → #262626 */
  --card: 0 0% 100%;        /* hsl(0, 0%, 100%)    → #ffffff */
  --muted: 213 10% 55%;     /* hsl(213, 10%, 55%)  → #808998 */
}
```

```html
<!-- Static HTML (v <head>) -->
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwindcss.config = {
    theme: {
      extend: {
        colors: {
          primary: '#011227',
          secondary: '#262626',
          accent: '#ffee00',
          'accent-hover': '#ccb800',
          card: '#011227',
          text: '#ffffff',
          'text-muted': '#808998',
          border: 'rgba(255, 255, 255, 0.1)',
        },
        fontFamily: {
          heading: ['"Bebas Neue"', 'sans-serif'],
          sans: ['Poppins', 'sans-serif'],
        },
      },
    },
  }
</script>

<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

**Tabulka mapování tříd:**

| Lovable třída | Static ekvivalent | Poznámka |
|---|---|---|
| `bg-navy` | `bg-primary` | Definováno v config |
| `bg-yellow` | `bg-accent` | |
| `text-yellow` | `text-accent` | |
| `text-card` | `text-text` | |
| `text-card/80` | `text-text/80` | Tailwind opacity syntax |
| `bg-light-gray` | `bg-gray-100` | Použít Tailwind default |
| `font-heading` | `font-heading` | Definováno v config |
| `font-body` | `font-sans` | Výchozí font |

**Custom CSS** — pokud Lovable prototyp má custom třídy (`.noise-overlay`, `.animate-glow-pulse` atd.), vložit je do `<style>` bloku v `<head>`:

```html
<style>
  .noise-overlay {
    background-image: url("data:image/svg+xml,...");
    opacity: 0.03;
    pointer-events: none;
  }
</style>
```

---

### Fáze 3: Ikony — Lucide React → inline SVG

Lovable používá `lucide-react` balíček. V static HTML nahradit inline SVG.

**Postup:**

1. Otevřít [lucide.dev/icons](https://lucide.dev/icons)
2. Vyhledat ikonu podle názvu (např. `Shield`, `Phone`, `Mail`)
3. Kliknout → Copy SVG
4. Vložit přímo do HTML
5. Přidat Tailwind třídy pro velikost a barvu

**Příklad:**

```tsx
// Lovable
import { Shield } from "lucide-react";
<Shield className="text-yellow" size={44} />
```

```html
<!-- Static HTML -->
<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44"
     viewBox="0 0 24 24" fill="none" stroke="currentColor"
     stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
     class="text-accent">
  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
</svg>
```

**Tip:** SVG ikony používají `stroke="currentColor"`, takže barvu řídí Tailwind třída `text-accent` na SVG elementu.

---

### Fáze 4: Interaktivita — React hooks → vanilla JS

Všechny React hooks nahradit čistým JavaScriptem v `<script>` bloku na konci `<body>`.

| React pattern | Vanilla JS ekvivalent |
|---|---|
| `useState(false)` + toggle | `element.classList.toggle('hidden')` |
| `useEffect(() => { scroll listener }, [])` | `window.addEventListener('scroll', fn)` |
| `onClick={() => setState(!state)}` | `element.addEventListener('click', fn)` |
| `onChange={(e) => setState(e.target.value)}` | `new FormData(form)` při submit |
| `{condition && <div>}` | Element s `class="hidden"`, toggle přes JS |
| `useRef()` | `document.getElementById()` |

**Příklad — Header s hamburger menu a scroll efektem:**

```tsx
// React (Lovable)
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
      {mobileOpen && <nav className="flex flex-col">...</nav>}
    </header>
  );
};
```

```html
<!-- Static HTML -->
<header id="main-header" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
  <nav class="max-w-6xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
    <a href="#" class="font-heading text-2xl text-accent">Logo</a>

    <!-- Desktop nav -->
    <div class="hidden lg:flex gap-8">
      <a href="#sluzby" class="text-sm uppercase text-text hover:text-accent transition-colors">Služby</a>
      <a href="#proc-my" class="text-sm uppercase text-text hover:text-accent transition-colors">Proč my</a>
      <a href="#kontakt" class="text-sm uppercase text-text hover:text-accent transition-colors">Kontakt</a>
    </div>

    <!-- Hamburger -->
    <button id="mobile-toggle" class="lg:hidden text-text" aria-label="Menu" aria-expanded="false">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2">
        <line x1="4" x2="20" y1="12" y2="12"/>
        <line x1="4" x2="20" y1="6" y2="6"/>
        <line x1="4" x2="20" y1="18" y2="18"/>
      </svg>
    </button>
  </nav>

  <!-- Mobile menu -->
  <div id="mobile-menu" class="hidden lg:hidden bg-primary/95 backdrop-blur-md px-4 pb-6">
    <a href="#sluzby" class="block py-3 text-text hover:text-accent">Služby</a>
    <a href="#proc-my" class="block py-3 text-text hover:text-accent">Proč my</a>
    <a href="#kontakt" class="block py-3 text-text hover:text-accent">Kontakt</a>
  </div>
</header>

<script>
  const header = document.getElementById('main-header');
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('mobile-menu');

  // Scroll efekt
  window.addEventListener('scroll', () => {
    header.classList.toggle('bg-primary/90', window.scrollY > 20);
    header.classList.toggle('backdrop-blur-md', window.scrollY > 20);
  }, { passive: true });

  // Hamburger toggle
  toggle.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden');
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });

  // Zavřít menu po kliknutí na odkaz
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Zavřít na Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      menu.classList.add('hidden');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
</script>
```

**Smooth scroll** — přidat na `<html>` tag:

```html
<html lang="cs" class="scroll-smooth">
```

---

### Fáze 5: Formulář — mock alert() → Netlify Forms

Lovable prototypy typicky mají `alert("Děkujeme za zprávu!")`. Nahradit Netlify Forms — žádný backend, žádná funkce.

**Postup:**

1. Přidat `data-netlify="true"` na `<form>`
2. Přidat `name="contact"` (identifikátor formuláře v Netlify)
3. Přidat honeypot pole proti spamu
4. Přidat hidden `form-name` input
5. Přidat thank-you stránku nebo inline potvrzení

```tsx
// Lovable (mock)
const handleSubmit = (e) => {
  e.preventDefault();
  alert("Děkujeme za vaši zprávu!");
};

<form onSubmit={handleSubmit}>
  <Input placeholder="Jméno" />
  <Input placeholder="Email" />
  <Textarea placeholder="Zpráva" />
  <Button type="submit">Odeslat</Button>
</form>
```

```html
<!-- Static HTML — Netlify Forms -->
<form name="contact" method="POST" data-netlify="true"
      netlify-honeypot="bot-field" action="/dekujeme.html">

  <!-- Honeypot (skryté pole proti spamu) -->
  <p class="hidden">
    <label>Nevyplňujte: <input name="bot-field"></label>
  </p>

  <!-- Povinné hidden pole pro Netlify -->
  <input type="hidden" name="form-name" value="contact">

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label for="name" class="block text-sm text-text-muted mb-1">Jméno</label>
      <input type="text" id="name" name="name" required
             class="w-full bg-card border border-border rounded-lg px-4 py-3 text-text
                    focus:outline-none focus:ring-2 focus:ring-accent">
    </div>
    <div>
      <label for="email" class="block text-sm text-text-muted mb-1">Email</label>
      <input type="email" id="email" name="email" required
             class="w-full bg-card border border-border rounded-lg px-4 py-3 text-text
                    focus:outline-none focus:ring-2 focus:ring-accent">
    </div>
  </div>

  <div class="mt-4">
    <label for="message" class="block text-sm text-text-muted mb-1">Zpráva</label>
    <textarea id="message" name="message" rows="5" required
              class="w-full bg-card border border-border rounded-lg px-4 py-3 text-text
                     focus:outline-none focus:ring-2 focus:ring-accent resize-y"></textarea>
  </div>

  <button type="submit"
          class="mt-6 inline-flex items-center bg-accent text-primary px-8 py-3
                 font-semibold rounded-lg hover:bg-accent-hover transition-colors">
    Odeslat zprávu
  </button>
</form>
```

**Thank-you stránka** (`dekujeme.html`):

```html
<!DOCTYPE html>
<html lang="cs" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <title>Děkujeme | Název firmy</title>
  <!-- stejný Tailwind CDN config jako index.html -->
</head>
<body class="bg-primary text-text min-h-screen flex items-center justify-center">
  <div class="text-center px-4">
    <h1 class="text-4xl font-heading text-accent mb-4">Děkujeme!</h1>
    <p class="text-text/80 mb-8">Vaši zprávu jsme přijali. Ozveme se co nejdříve.</p>
    <a href="/" class="inline-flex bg-accent text-primary px-6 py-3 font-semibold rounded-lg
                       hover:bg-accent-hover transition-colors">
      Zpět na hlavní stránku
    </a>
  </div>
</body>
</html>
```

---

### Fáze 6: SEO — meta tagy, OG, Twitter Card, favicon

Lovable prototypy mají minimální SEO. Do `<head>` přidat kompletní meta bloky.

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- SEO -->
  <title>Název firmy — Claim / hlavní sdělení</title>
  <meta name="description" content="Stručný popis firmy a služeb, max 155 znaků.">
  <link rel="canonical" href="https://www.domena.cz/">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://www.domena.cz/">
  <meta property="og:title" content="Název firmy — Claim">
  <meta property="og:description" content="Stručný popis firmy a služeb.">
  <meta property="og:image" content="https://www.domena.cz/images/og-image.jpg">
  <meta property="og:locale" content="cs_CZ">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Název firmy — Claim">
  <meta name="twitter:description" content="Stručný popis firmy a služeb.">
  <meta name="twitter:image" content="https://www.domena.cz/images/og-image.jpg">

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

  <!-- Tailwind CDN + config (viz Fáze 2) -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwindcss.config = { /* ... */ }
  </script>
</head>
```

**OG image:** Vytvořit 1200×630 px obrázek (Figma / Canva) a uložit do `/images/og-image.jpg`.

**Favicon sada:** Vygenerovat přes [realfavicongenerator.net](https://realfavicongenerator.net) nebo [favicon.io](https://favicon.io).

---

### Fáze 7: Deploy — GitHub + Netlify

Static HTML = žádný build. Netlify servíruje soubory přímo.

**Postup:**

1. **Struktura projektu:**
   ```
   /
   ├── index.html
   ├── dekujeme.html        (thank-you stránka)
   ├── favicon.svg
   ├── favicon-32x32.png
   ├── apple-touch-icon.png
   ├── images/
   │   ├── og-image.jpg
   │   ├── logo.png
   │   └── ...
   └── _redirects            (volitelné — Netlify redirecty)
   ```

2. **Vytvořit GitHub repo:**
   ```bash
   git init
   git add .
   git commit -m "Initial static site"
   git remote add origin git@github.com:user/repo.git
   git push -u origin main
   ```

3. **Netlify deploy:**
   - Propojit GitHub repo v Netlify Dashboard
   - **Build command:** *(nechat prázdné)*
   - **Publish directory:** `.`
   - Deploy — hotovo

4. **Custom doména:**
   - V Netlify → Domain settings → Add custom domain
   - DNS: CNAME záznam na `<site>.netlify.app`
   - SSL certifikát se nastaví automaticky

5. **Netlify `_redirects`** (volitelné):
   ```
   # SPA fallback není potřeba — máme statické soubory
   # Ale můžeme přidat redirecty:
   /kontakt    /#kontakt    301
   ```

---

## Checklist konverze

- [ ] Vytvořit `index.html` se základní HTML5 strukturou
- [ ] Přidat Tailwind 4 CDN `<script>` do `<head>`
- [ ] Převést design tokeny (barvy, fonty) do `tailwindcss.config` bloku
- [ ] Přidat Google Fonts link
- [ ] Převést React komponenty na HTML sekce (className → class, rozbalit .map())
- [ ] Přejmenovat Tailwind třídy dle nového mapování barev
- [ ] Nahradit Lucide React ikony inline SVG z lucide.dev
- [ ] Nahradit shadcn/ui komponenty čistým HTML + Tailwind (Button, Input, Textarea, Select)
- [ ] Převést React interaktivitu na vanilla JS (hamburger menu, scroll efekt)
- [ ] Přidat smooth scroll (`class="scroll-smooth"` na `<html>`)
- [ ] Přidat kotevní odkazy na všechny sekce (`id="..."`)
- [ ] Nahradit mock `alert()` formulář Netlify Forms (`data-netlify`, honeypot, hidden input)
- [ ] Vytvořit thank-you stránku (`dekujeme.html`)
- [ ] Přidat SEO meta tagy (title, description, canonical)
- [ ] Přidat Open Graph meta tagy
- [ ] Přidat Twitter Card meta tagy
- [ ] Vytvořit a přidat OG image (1200×630 px)
- [ ] Přidat favicon sadu (SVG, PNG, apple-touch-icon)
- [ ] Přidat responsive padding (`px-4 sm:px-8`) na všechny sekce
- [ ] Přidat `grid-cols-1` mobile fallback na všechny gridy
- [ ] Přidat ARIA atributy (aria-label, aria-expanded)
- [ ] Push na GitHub
- [ ] Deploy na Netlify (no build command, publish `.`)
- [ ] Nastavit custom doménu + SSL
- [ ] Ověřit Netlify Forms v dashboardu
- [ ] Otestovat na mobilu (overflow, touch targets)
- [ ] Otestovat OG preview (og-image tester)

---

## Odhad náročnosti

| Fáze | Náročnost | Poznámka |
|---|---|---|
| 1. HTML extrakce | Střední | Mechanická práce, ale hodně copy-paste |
| 2. Design tokeny | Nízká | HSL → hex, vložit do config |
| 3. Ikony | Nízká | Copy-paste SVG z lucide.dev |
| 4. Interaktivita | Střední | Přepis hooks → vanilla JS |
| 5. Formulář | Nízká | Netlify Forms — žádný backend |
| 6. SEO | Nízká | Šablonové meta tagy |
| 7. Deploy | Nízká | Žádný build, přímý deploy |
