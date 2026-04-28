# Default Design Theme

Použij tento theme když projekt nemá vlastní design systém. Zkopíruj CSS do `theme.css` ve výstupní složce. Vyber dark nebo light variantu podle kontextu.

## Kdy dark vs light

- **Dark**: admin panely, developer tools, B2B SaaS, technické produkty
- **Light**: consumer apps, e-commerce, onboarding flows pro běžné uživatele

---

## theme.css — Dark varianta

```css
/* ── FONTS ── */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');

:root {
  /* Layout */
  --radius: 4px;
  --radius-lg: 10px;
  --radius-pill: 999px;
  --font-d: 'Syne', sans-serif;      /* display / headings / labels */
  --font-b: 'Inter', sans-serif;     /* body text */

  /* Dark palette */
  --bg:       hsl(222, 22%, 7%);
  --surface:  hsl(222, 18%, 10%);
  --card:     hsl(222, 16%, 14%);
  --card-hi:  hsl(222, 16%, 17%);
  --muted:    hsl(222, 14%, 19%);
  --border:   hsl(222, 14%, 23%);
  --fg:       hsl(40, 8%, 92%);
  --fg-muted: hsl(222, 8%, 52%);

  /* Accent — blue */
  --accent:     hsl(217, 91%, 60%);
  --accent-dim: hsl(217, 60%, 20%);
  --accent-fg:  hsl(0, 0%, 100%);

  /* Secondary accent — teal */
  --teal:     hsl(174, 58%, 40%);
  --teal-dim: hsl(174, 40%, 16%);

  /* Warning / highlight */
  --gold:     hsl(42, 100%, 52%);
  --gold-dim: hsl(42, 70%, 18%);
  --gold-fg:  hsl(222, 22%, 8%);

  /* Danger */
  --danger:   hsl(4, 72%, 52%);
  --red-dim:  hsl(4, 50%, 14%);

  /* Amber (edge cases, warnings) */
  --amber:    hsl(38, 90%, 52%);
  --amber-dim:hsl(38, 60%, 14%);

  /* Frame (browser mock) */
  --frame-bg: hsl(222, 25%, 5%);
}
```

## theme.css — Light varianta

```css
/* ── FONTS ── */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&display=swap');

:root {
  --radius: 4px;
  --radius-lg: 10px;
  --radius-pill: 999px;
  --font-d: 'Syne', sans-serif;
  --font-b: 'Inter', sans-serif;

  /* Light palette */
  --bg:       hsl(220, 16%, 97%);
  --surface:  hsl(220, 14%, 94%);
  --card:     hsl(0, 0%, 100%);
  --card-hi:  hsl(220, 12%, 96%);
  --muted:    hsl(220, 10%, 90%);
  --border:   hsl(220, 10%, 84%);
  --fg:       hsl(222, 28%, 12%);
  --fg-muted: hsl(222, 8%, 44%);

  --accent:     hsl(217, 91%, 52%);
  --accent-dim: hsl(217, 80%, 94%);
  --accent-fg:  hsl(0, 0%, 100%);

  --teal:     hsl(174, 55%, 34%);
  --teal-dim: hsl(174, 40%, 92%);

  --gold:     hsl(38, 95%, 44%);
  --gold-dim: hsl(38, 80%, 94%);
  --gold-fg:  hsl(0, 0%, 100%);

  --danger:   hsl(4, 72%, 46%);
  --red-dim:  hsl(4, 60%, 94%);

  --amber:    hsl(38, 90%, 46%);
  --amber-dim:hsl(38, 80%, 94%);

  --frame-bg: hsl(220, 16%, 92%);
}
```

---

## Jak používat tokeny v prototypech

```css
body {
  font-family: var(--font-b);
  background: var(--bg);
  color: var(--fg);
}

/* Nadpisy sekcí */
.section-label {
  font-family: var(--font-d);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent);
}

/* Karta */
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
}

/* Primární tlačítko */
.btn {
  background: var(--accent);
  color: var(--accent-fg);
  border: none;
  border-radius: var(--radius);
  padding: 10px 16px;
  font-family: var(--font-d);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* Outline tlačítko */
.btn-outline {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--fg-muted);
}

/* Input */
.field-input {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 8px 10px;
  font-size: 13px;
  color: var(--fg);
  width: 100%;
}
```

---

## Barevná konvence pro role a stavy

| Barva | Použití |
|-------|---------|
| `--accent` (modrá) | Primární akce, aktivní stav, výchozí CTA |
| `--teal` | Hráč / user role, success stavy, dokončené kroky |
| `--gold` | Admin / organizer role, highlight, důležitá data |
| `--amber` | Edge cases, warnings, nové stavy (EC badge) |
| `--danger` | Chybové stavy, odmítnutí, neplatné hodnoty |
| `--fg-muted` | Systémové/pasivní stavy, deprecated |
