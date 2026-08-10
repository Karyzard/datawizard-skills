# Workspace Documentation System

> **Účel:** Standard pro dokumentaci jakéhokoli workspace (klient, projekt, app) v Datawizard OS. Zajišťuje, že kolegové i AI agenti se v daném workspace **rychle zorientují** a že dokumentace je **samoudržitelná** — když se mění struktura, dokumentace ji následuje.
>
> **Kdy použít:** Při zakládání nového workspace, při onboardingu nového člena týmu, nebo když si všimneš, že stávající dokumentace je zastaralá / nekonzistentní.
>
> **Šablony:** [`../templates/`](../templates/) (součást skillu `workspace-docs-setup`)

---

## Princip — vrstvený systém

Dokumentace má **tři vrstvy**, každá s jasnou rolí:

```
┌─────────────────────────────────────────────────────────────┐
│ ROOT (globální orientace)                                   │
│   README.md          → co to je, aktuální stav, struktura   │
│   AGENTS.md          → KANONICKÉ rules + routing pro agenty │
│   CLAUDE.md          → tenký ukazatel (@AGENTS.md import)   │
│   00-kickoff.md      → seed formulář (klientský projekt)    │
│   ONBOARDING.md      → checklist pro nové členy týmu        │
│   TODO.md, IDEAS.md  → operativa                            │
│   agent.local.md     → per-uživatel config (gitignorovaný)  │
├─────────────────────────────────────────────────────────────┤
│ FOLDER LEVEL (detail jednotlivých složek)                   │
│   <folder>/CONTEXT.md → rozcestník: účel, podsložky, čtení  │
├─────────────────────────────────────────────────────────────┤
│ AUTOMATION (samoudržitelnost, nástrojová nezávislost)       │
│   .agents/           → KANONICKÝ zdroj AI artefaktů         │
│     commands/, skills/, templates/CONTEXT.md, plugins.md    │
│   .claude/, .cursor/, .github/, .vscode/ → tenké wrappery   │
│   /sync-docs         → kontrola konzistence (skill+command) │
└─────────────────────────────────────────────────────────────┘
```

**Nástrojová nezávislost:** `AGENTS.md` je kanonický zdroj instrukcí; `CLAUDE.md` (Claude Code), `.cursor/rules/000-agents.mdc` (Cursor) a `.github/copilot-instructions.md` (Copilot) jsou tenké wrappery, které na něj odkazují. AI artefakty (commands, skills) žijí jednou v `.agents/`, nástroje na ně jen odkazují — žádné duplicity, žádné symlinky (cross-platform Windows + macOS).

**Klíčové pravidlo dělby práce:**

- **AGENTS.md** drží **routing** (úkol → kam jít) — mění se zřídka, jen když přibyde nová top-level kategorie
- **CONTEXT.md složky** drží **detail** (co je ve složce, jak je strukturovaná) — mění se s obsahem té složky, vlastní ji ten, kdo ve složce pracuje
- **README.md** drží **přehled** (krátká tabulka struktury) — odkazuje na CONTEXT.md detail

Takhle se nikdy nepřepisuje detail na dvou místech najednou.

---

## Rozhodovací strom — potřebuje tento workspace tento standard?

Aplikuj systém pokud platí **alespoň 2 z 3**:

1. **Spolupracuje na něm víc lidí** (i jen občas)
2. **Má víc než 5 top-level složek**
3. **AI agenti v něm pracují pravidelně** (Claude Code, Cursor)

Pokud workspace nesplňuje, stačí jednoduchý `README.md`.

---

## Setup nového workspace — krok za krokem

### Krok 1 — Root soubory

Ze šablon skillu (`templates/`) zkopíruj a vyplň:

| Soubor | Povinný? | Účel |
|---|---|---|
| `README.md` | ✓ | Přehled pro lidi — co to je, aktuální stav, struktura, tech stack |
| `AGENTS.md` | ✓ (pokud používáš AI) | Kanonické rules + routing — mapa složek, pravidla, git workflow |
| `CLAUDE.md` | ✓ (pokud používáš AI) | Tenký ukazatel `@AGENTS.md` pro Claude Code |
| `00-kickoff.md` | ◯ (klientský projekt) | Seed formulář — vyplnit s klientem, pak naseed-ovat workspace |
| `ONBOARDING.md` | ✓ (víceosobní team) | Checklist pro první týden v týmu |
| `agent.local.md.example` | ◯ (git repo) | Šablona per-uživatel konfigurace (gitignorovaná kopie) |
| `.gitignore`, `.gitattributes`, `.editorconfig` | ◯ (git repo) | Cross-platform základ (LF, ignore pravidla) — z `templates/config/` |
| `DEVELOPMENT-PROCESS.md` | ◯ (vývojové projekty) | Role, sprint cyklus, eskalace |
| `TODO.md` | ◯ | Operativní úkoly |
| `IDEAS.md` | ◯ | Funnel nápadů |

### Krok 2 — `CONTEXT.md` v každé top-level složce

Pro každou top-level složku (`0X-`, `1X-`, atd.) vytvoř `CONTEXT.md` z šablony [`../templates/CONTEXT.md`](../templates/CONTEXT.md) (per-složka stuby v [`../templates/folder-stubs/`](../templates/folder-stubs/)).

Minimum sekcí v CONTEXT.md:

1. **Frontmatter** (`title`, `date`, `status: active`)
2. **Údržba** (poznámka co aktualizovat při změně)
3. **K čemu složka slouží** (1–3 věty)
4. **Aktuální stav** (tabulka modulů / fáze)
5. **Podsložky** (tabulka co kde)
6. **Doporučené pořadí čtení** (pro nové)
7. **Naming konvence**
8. **Související** (cross-linky)

### Krok 3 — Automatizace (`.agents/` + tenké wrappery)

Kanonický zdroj AI artefaktů je `.agents/`; jednotlivé nástroje dostávají jen tenké wrappery. Ze šablon skillu (`templates/dotfolders/`) vytvoř:

```
.agents/                          ← KANONICKÝ ZDROJ (edituje se jen tady)
  README.md                       ← definice systému + governance
  plugins.md                      ← registr doporučených rozšíření
  commands/sync-docs.md           ← tenký spouštěč
  skills/sync-docs/SKILL.md       ← znalost (6 kontrol + report)
  templates/CONTEXT.md            ← šablona pro nové složky
.claude/                          ← wrapper pro Claude Code
  commands/sync-docs.md, skills/sync-docs/SKILL.md (pointery)
.cursor/                          ← wrapper pro Cursor
  rules/000-agents.mdc (alwaysApply → AGENTS.md), commands/sync-docs.md
.github/                          ← wrapper pro VS Code + Copilot
  copilot-instructions.md, prompts/sync-docs.prompt.md
.vscode/
  extensions.json, settings.json  ← doporučení + cross-platform nastavení
```

> **Volitelné pokročilé vzory** (negenerují se automaticky, viz reálné projekty): `.internal/build.js` — Node HTML build dokumentace; `output/` — gitignorovaný build adresář HTML exportů (agent ho nečte proaktivně); `_export-*/` — staging pro redakci citlivých dat před sdílením do externího repa.

### Krok 4 — Onboard tým

Pošli kolegům odkaz na `ONBOARDING.md` s instrukcí: „začni Dnem 1, postup tě provede".

---

## Konvence napříč všemi workspace

### Number prefixy top-level složek

| Rozsah | Účel |
|---|---|
| `00-09` | Sdílený kontext, podpůrné (inbox, communications, project-mgmt, kontext) |
| `10-19` | Hlavní výstupy — fáze projektu, aplikace, dodávky |
| `20-29` | Rezerva pro další fáze |
| `30-69` | Explorativní / future / experimentální |
| `70-79` | Research |
| `90-98` | Produktové artefakty (backlog, archiv produkce) |
| `99` | Archiv (read-only) |
| nečíslované (`docs/`, `scripts/`) | Technické artefakty |

### Naming

- **Složky a soubory**: `kebab-case`, **bez diakritiky**
- **Top-level složky**: prefix číslem (`0X-nazev/`, `1X-nazev/`)
- **Datumové soubory**: `YYYY-MM-DD-popis.md`
- **Sprint složky**: `sprint-NN_WYY-WZZ_YYYY-MM-DD/`
- **Schůzky**: `YYYY-MM-DD-strucny-nazev/`
- **Systémové soubory**: `UPPERCASE.md` (`CLAUDE.md`, `README.md`, `AGENTS.md`, `ONBOARDING.md`, `TODO.md`, `IDEAS.md`, `CONTEXT.md`)
- **Ostatní markdown**: `lowercase.md` nebo `kebab-case.md`

### Frontmatter (minimum)

```yaml
---
title: Název dokumentu
date: YYYY-MM-DD
---
```

Volitelně: `status: active | draft | approved | archive`, `company:`, `type:`

---

## Samoudržitelnost — jak držet dokumentaci živou

### Pravidlo 1: Při změně top-level struktury aktualizuj 3 soubory

Když přidáš / přejmenuješ / odstraníš top-level složku, **MUSÍŠ** aktualizovat:

1. **`<složka>/CONTEXT.md`** — vytvoř nový (z šablony) nebo aktualizuj
2. **`AGENTS.md`** — sekce „Mapa složek" + „Routovací tabulka"
3. **`README.md`** — sekce „Struktura složky"

### Pravidlo 2: Detail je v CONTEXT.md, ne v AGENTS.md

AGENTS.md má jen routing tabulku „úkol → kam". Detail (jaké jsou podsložky, jaký je stav, co kde najít) patří do CONTEXT.md té složky. Tím se vyhneš duplicitě a zastarávání.

### Pravidlo 3: `99-archive/` je read-only

Když chceš něco archivovat:

1. Přesuň do `99-archive/<duvod>/`
2. Aktualizuj `99-archive/CONTEXT.md` — přidej řádek do „Co je tu archivované"
3. Aktualizuj zdrojovou složku (CONTEXT.md, AGENTS.md, README.md) — odstraň reference

### Pravidlo 4: Slash command `/sync-docs` před koncem práce

Když uživatel řekne „jsem hotový" nebo `/sync-docs`, spusť kontrolu:

- Existují všechny CONTEXT.md v top-level složkách?
- Mapa v AGENTS.md odpovídá realitě?
- Jsou všechny linky živé?
- Není někde zastaralý název složky?
- Jsou datumy aktuální?

Šablona: [`../templates/dotfolders/agents/skills/sync-docs/SKILL.md`](../templates/dotfolders/agents/skills/sync-docs/SKILL.md)

---

## Anti-patterns — čemu se vyhnout

| ❌ Nedělej | ✓ Dělej místo toho |
|---|---|
| Detail složky popsaný v AGENTS.md | Detail v `<složka>/CONTEXT.md`, AGENTS.md má jen routing |
| Stejný onboarding seznam ve 3 souborech | Single source — `ONBOARDING.md`, ostatní jen odkazují |
| `Meetings/` v rootu (mimo `01-communications/`) | `01-communications/01 meetings/YYYY-MM-DD-…/` |
| Mazání věcí z `99-archive/` bez souhlasu | Archiv je read-only, smazat až po explicitním souhlasu |
| Diakritika v názvech souborů | kebab-case bez diakritiky |
| Top-level složka bez `CONTEXT.md` | Vždy minimálně jednoduchý CONTEXT.md (i krátký pointer) |
| Datumy „březen 2026" v dokumentu zapsaném 2026-04 | Aktualizovat při zápisu, nebo použít relativní formulaci |

---

## Pro AI agenty — jak v takhle nastaveném workspace pracovat

1. **Začni v `AGENTS.md`** — najdi routing pro svůj úkol
2. **Otevři `CONTEXT.md`** cílové složky — pochop co tam je a jak je strukturovaná
3. **Při zápisu dodržuj naming** — kebab-case bez diakritiky
4. **Při změně struktury** — aktualizuj 3 soubory (CONTEXT.md, AGENTS.md, README.md)
5. **Před koncem práce** — pokud uživatel řekne „jsem hotový", spusť `/sync-docs`

---

## Reference

- Šablony: [`../templates/`](../templates/)
- Globální boundaries: `~/.claude/rules/boundaries.md`
- Naming pravidla: [`naming.md`](naming.md)
- Příklady implementace: `.../01_Projekty/2026-pavel-prachar/` a `.../01_Projekty/2026-med-company-hub-mentoring/`
