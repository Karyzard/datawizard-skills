---
name: wiki-query
description: >-
  Odpovídá na dotazy na LLM wiki — přečte index.md, identifikuje relevantní stránky,
  syntetizuje odpověď s citacemi a nabídne uložení hodnotné analýzy zpět do wiki.
  Použij kdykoli chceš zjistit co wiki ví o tématu, získat syntézu přes více stránek,
  nebo se zeptat na kontext projektu/nástroje/rozhodnutí.
  Triggeruj na "co wiki ví o", "zeptej se wiki", "wiki query", "najdi ve wiki",
  "co víme o", "shrň ze wiki", "kontext z wiki". Komunikuj česky.
tags: [wiki, knowledge-management, os-datawizard]
version: "1.0.0"
allowed-tools: "Read, Glob, Grep"
---

# Wiki Query

Odpovídá na dotazy přes LLM wiki s citacemi. Index-first přístup.

---

## Krok 1 — Identifikuj wiki a dotaz

Urči:
1. **Která wiki** je relevantní pro dotaz (nebo prohledej více)
2. **Co se ptá** — entity, téma, srovnání, nebo otevřená otázka

Pokud není wiki specifikována, začni s `wiki-os` a rozšiř dle potřeby.

---

## Krok 2 — Přečti index.md (povinné)

**Vždy začni indexem** — nikdy nečti wiki stránky naslepo bez orientace v indexu.

Přečti `<wiki-root>/index.md` a identifikuj:
- Stránky s relevantním názvem
- Stránky s relevantními tagy
- Stránky v relevantní kategorii (Entities / Concepts / Sources / Decisions)

---

## Krok 3 — Přečti relevantní stránky

Na základě indexu přečti 1–5 nejrelevantnějších stránek. Pro složitější dotazy přečti více.

Pokud stránka odkazuje na další stránky přes wikilinky, a ty jsou také relevantní, přečti je.

---

## Krok 4 — Syntetizuj odpověď

Odpověz na dotaz s citacemi:

```markdown
[Odpověď na dotaz]

*Viz [[stranka-1]], [[stranka-2]] pro více detailů.*
```

Formát odpovědi závisí na dotazu:
- **Faktický dotaz** → přímá odpověď s citacemi
- **Srovnávací dotaz** → markdown tabulka + shrnutí
- **Komplexní analýza** → strukturovaná odpověď s H2 sekcemi
- **Přehled tématu** → bullet list klíčových bodů s odkazem na stránky

---

## Krok 5 — Nabídni uložení do wiki (volitelné)

Pokud odpověď přináší novou hodnotu (analýzu, srovnání, propojení které ve wiki dosud chybí), nabídni:

```
Tato odpověď obsahuje syntézu, která ve wiki zatím chybí.
Chceš ji uložit jako novou stránku do wiki/analyses/?

Navrhovaný název: <nazev-analyzy>
(ano / ne)
```

Pokud uživatel souhlasí, vytvoř stránku:
- Umístění: `<wiki-root>/wiki/analyses/<nazev-analyzy>.md`
- Typ frontmatter: `type: analysis`
- Přidej do `index.md` sekce Analyses
- Zapiš log entry jako `query | <nazev dotazu>`

---

## Krok 6 — Log entry (pouze pokud se ukládá do wiki)

Pokud vznikne nová stránka nebo se analýza uloží, zapiš do `log.md`:

```markdown
## [YYYY-MM-DD HH:mm] query | <název dotazu>

Dotaz syntetizoval obsah ze N stránek. Výsledek uložen jako nová analýza.

**Použité stránky:** [[stranka-1]], [[stranka-2]]
**Nová stránka:** [[nazev-analyzy]]
```

---

## Poznámky

- **Index first** — vždy čti index před stránkami
- Neodhaduj co stránka obsahuje — přečti ji
- Pokud wiki odpověď neobsahuje, řekni to jasně a případně navrhni ingest chybějícího zdroje
- Wikilinky v odpovědi jsou clickable v Obsidianu — používej je pro navigaci
