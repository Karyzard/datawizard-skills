---
name: wiki-ingest
description: >-
  Ingestuje nový zdroj do LLM wiki — přečte dokument, extrahuje poznatky, aktualizuje
  relevantní wiki stránky, vytvoří nové entity/concept/source stránky a zapíše log entry.
  Použij kdykoli chceš přidat dokument, soubor, meeting přepis nebo poznámku do wiki.
  Triggeruj na "přidej do wiki", "ingestuj", "zpracuj do wiki", "wiki ingest", "ulož do wiki",
  "přidej do knowledge base". Komunikuj česky.
tags: [wiki, knowledge-management, os-datawizard]
version: "1.0.0"
allowed-tools: "Read, Write, Glob, Grep, Shell"
---

# Wiki Ingest

Orchestrátor pro přidání nového zdroje do LLM wiki.

---

## Krok 0 — Identifikuj wiki a zdroj

Před ingestionem urči:

1. **Do které wiki** se má zdroj přidat? Seznam wik a jejich cest je v uživatelově konfiguraci `~/.claude/wiki-config.md` (alias → cesta → popis). Pokud uživatel řekl alias nebo cestu přímo, použij ji.

   Pokud `~/.claude/wiki-config.md` neexistuje, zeptej se uživatele na cestu k wiki a nabídni založení konfigurace v tomto formátu:

   ```markdown
   ---
   title: Wiki Config
   date: YYYY-MM-DD
   ---

   # Wiki Config

   Výchozí wiki: <alias>

   | Alias | Cesta | Popis |
   |---|---|---|
   | wiki-os | ~/cesta/k/wiki-os/ | OS Datawizard, nástroje, projekty |
   | klient/<nazev> | ~/cesta/ke/klientovi/wiki/ | klientský kontext |
   ```

2. **Jaký je zdroj?** Cesta k souboru nebo obsah.

Pokud wiki na dané cestě ještě neexistuje, nejprve ji založ: vytvoř `<wiki-root>/AGENTS.md` (doménové konvence), `index.md`, `log.md` a složky `wiki/{entities,concepts,sources,decisions,analyses}/` + `raw/`.

---

## Krok 1 — Přečti schéma a kontext

1. Přečti `<wiki-root>/AGENTS.md` — konvence a doménové instrukce dané wiki
2. Přečti `<wiki-root>/index.md` — co již existuje

---

## Krok 2 — Přečti zdroj

Přečti celý zdrojový dokument. Pokud je to soubor z `raw/`, přečti ho odtud. Jinak ho nejprve zkopíruj do `<wiki-root>/raw/`.

---

## Krok 3 — Identifikuj entity, koncepty a dotčené stránky

Ze zdroje extrahuj:
- **Entity** (lidé, firmy, projekty, nástroje) které se zmiňují
- **Koncepty** (principy, patterny, metodologie)
- **Rozhodnutí** (architektonická nebo strategická)

Pro každou věc zkontroluj index: **existuje stránka?**
- Ano → přečti stránku a přidej do plánu aktualizace
- Ne → přidej do plánu vytvoření nové stránky

---

## Krok 4 — Navrhni ingest plán

Vypiš uživateli přehledně:

```
Plán ingestu pro: [název zdroje]

Nové stránky (N):
- wiki/entities/nazev-entity.md — [stručný popis]
- wiki/concepts/nazev-konceptu.md
- wiki/sources/source-nazev.md

Aktualizace (M stránek):
- wiki/entities/existujici-entita.md — [co se přidá]

Wikilinky k doplnění:
- [[nova-strana]] ← přidat do [[existujici-strana]]

Pokračuji? (ano / uprav)
```

Pokud uživatel není k dispozici nebo řekne "autonomně", pokračuj bez potvrzení.

---

## Krok 5 — Proveď ingest

### 5a. Vytvoř source stránku

Vždy vytvoř stránku v `wiki/sources/source-<kebab-nazev>.md`. Šablonu hledej v `<wiki-root>/_schema/page-templates/source.md`; pokud neexistuje, použij minimální frontmatter (`type: source`, `title`, `created`, `status`) + sekce Shrnutí a Klíčové poznatky.

### 5b. Vytvoř nebo aktualizuj entity/concept/decision stránky

Pro každou identifikovanou položku:
- **Nová:** vytvoř soubor ze šablony, vyplň obsah z kontextu zdroje
- **Existující:** přidej nové informace, wikilinky, případně sekci `## Revize` pokud zdroj reviduje existující tvrzení

### 5c. Přidej wikilinky

Zkontroluj nové i aktualizované stránky — všechny zmínky existujících entit/konceptů musí mít `[[wikilink]]`.

---

## Krok 6 — Aktualizuj index.md

Přidej nové stránky do příslušných sekcí v `<wiki-root>/index.md`. Aktualizuj:
- `Počet stránek: N` (přičti nové)
- `Naposledy aktualizován: YYYY-MM-DD`
- Příslušné tabulky (Entities / Concepts / Sources / Decisions)

---

## Krok 7 — Zapiš log entry

Na **začátek** `<wiki-root>/log.md` přidej nový záznam:

```markdown
## [YYYY-MM-DD HH:mm] ingest | <název zdroje>

<2–3 věty: co bylo zpracováno, co vzniklo>

**Nové stránky:** [[stranka-1]], [[stranka-2]]
**Dotčené stránky:** [[existujici-1]], [[existujici-2]]
```

---

## Dokončení

Vypiš summary:

```
✓ Ingest dokončen: [název zdroje] → wiki-[nazev]
Nové stránky: N
Aktualizované stránky: M
```

---

## Poznámky

- `raw/` soubory nikdy nemodifikuj
- Šablony jsou v `<wiki-root>/_schema/page-templates/`; bez nich použij minimální frontmatter
- Frontmatter je povinný — minimálně `type`, `title`, `created`, `status`
- Preferuj aktualizaci existující stránky před vytvořením nové — nejprve zkontroluj index
- Pokud zdroj odporuje existující stránce, přidej sekci `## Revize` s vysvětlením konfliktu
