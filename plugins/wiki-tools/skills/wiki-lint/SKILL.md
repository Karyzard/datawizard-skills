---
name: wiki-lint
description: >-
  Provede health check LLM wiki — hledá orphan stránky bez příchozích linků,
  zastaralé nároky přepsané novějšími zdroji, chybějící cross-reference, stránky
  bez frontmatter, a navrhuje nové zdroje k prozkoumání. Reportuje výsledky jako
  přehledný markdown report.
  Triggeruj na "wiki lint", "health check wiki", "zkontroluj wiki", "co chybí ve wiki",
  "orphan stránky", "zastaralé wiki", "audit wiki". Komunikuj česky.
tags: [wiki, knowledge-management, os-datawizard, maintenance]
version: "1.0.0"
allowed-tools: "Read, Glob, Grep"
---

# Wiki Lint

Health check LLM wiki. Odhalí slabá místa, zastaralé informace a chybějící propojení.

---

## Krok 1 — Identifikuj wiki

Urči které wiki se lint týká. Pokud není specifikováno, lintuj `wiki-os` (`~/Documents/personal-os/wiki-os/`).

---

## Krok 2 — Přečti schéma a index

1. Přečti `~/Documents/_wiki-schema/AGENTS.md` — reference pro konvence
2. Přečti `<wiki-root>/AGENTS.md` — doménové instrukce
3. Přečti `<wiki-root>/index.md` — kompletní seznam stránek

---

## Krok 3 — Proveď analýzu

### 3a. Orphan stránky

Projdi všechny stránky v `wiki/`. Pro každou stránku zkontroluj: je `[[nazev-stranky]]` zmíněna na jiné stránce?

Stránky bez příchozích odkazů = orphan kandidáti. (Výjimka: `index.md`, `log.md` a stránky v `wiki/sources/` — ty orphan být mohou.)

### 3b. Chybějící frontmatter

Projdi všechny `.md` soubory v `wiki/`. Stránky bez YAML frontmatter bloku (nebo bez povinných polí `type`, `title`, `created`, `status`) jsou problém.

### 3c. Stub stránky bez obsahu

Stránky se `status: stub` starší než 14 dní — kandidáti na doplnění nebo smazání.

### 3d. Chybějící cross-reference

Při čtení stránek hledej zmínky entity/konceptu, které mají vlastní stránku, ale nejsou označeny wikilinkem `[[...]]`.

Příklad: stránka `cursor.md` zmiňuje "Claude Code" ale neobsahuje `[[claude-code]]` → chybějící cross-ref.

Prohledej grep-em: pro každou stránku v `wiki/entities/` a `wiki/concepts/` hledej její `title` nebo `name` bez wikilinků v ostatních stránkách.

### 3e. Index vs. skutečnost

Porovnej seznam stránek v `index.md` s faktickým obsahem `wiki/`:
- Stránky v indexu, které fyzicky neexistují
- Stránky, které fyzicky existují, ale nejsou v indexu

### 3f. Potenciální kontradikce

Hledej stránky s datem `last_updated` starším než nejnovější source stránka, která je referencuje. Tyto stránky mohly být zastaralé novějším ingestionem.

### 3g. Návrhy nových zdrojů

Na základě obsahu wiki identifikuj:
- Témata s nedostatečnými zdroji (stránky s `sources: []`)
- Otevřené otázky zmíněné na stránkách
- Stub stránky, kde by nový zdroj pomohl

---

## Krok 4 — Sestav report

Vypiš výsledky jako strukturovaný markdown:

```markdown
# Wiki Lint Report — <wiki-nazev>

**Datum:** YYYY-MM-DD  
**Celkem stránek:** N

---

## 🔴 Kritické

### Chybějící frontmatter (N stránek)
- `wiki/entities/nazev.md` — chybí pole: type, status

---

## 🟡 Upozornění

### Orphan stránky (N)
- `[[nazev-stranky]]` — žádný příchozí link

### Chybějící cross-reference (N)
- `wiki/entities/cursor.md` zmiňuje "Claude Code" bez [[claude-code]]

### Index vs. skutečnost
- V indexu ale neexistuje: [[neexistujici-stranka]]
- Existuje ale není v indexu: `wiki/entities/nova-stranka.md`

---

## 🔵 Doporučení

### Stub stránky k doplnění
- `[[nabidkovy-agent]]` — stub starší než 14 dní, doplnit obsah

### Návrhy nových zdrojů
- Téma "Aibility přístup" zmíněno v [[os-datawizard]], ale chybí source stránka
- Zdroj: hledat informace o firmě Aibility a jejich GitHub workflow

---

## Shrnutí

Celkem nalezeno: X kritických, Y upozornění, Z doporučení.
```

---

## Krok 5 — Nabídni opravu

Po reportu se zeptej:

```
Chceš abych automaticky opravil nalezené problémy?
- Přidat chybějící frontmatter
- Přidat chybějící cross-reference (wikilinky)
- Aktualizovat index.md dle skutečnosti

(ano / jen X / ne)
```

Po potvrzení proveď opravy a zapiš log entry do `log.md`:

```markdown
## [YYYY-MM-DD HH:mm] lint | Health check — N oprav

Provedeno N oprav: chybějící frontmatter (X), cross-reference (Y), index update (Z).

**Dotčené stránky:** [[stranka-1]], [[stranka-2]]
```
