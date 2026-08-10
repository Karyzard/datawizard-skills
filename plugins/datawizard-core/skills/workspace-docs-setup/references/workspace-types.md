---
title: Workspace Types — doporučené složky
date: 2026-04-28
---

# Workspace Types

Reference pro skill `workspace-docs-setup` — jaký typ workspace dostává jaké standardní složky.

## 4 typy workspace

### 1. Klient (`klient`)

Workspace pro práci s konkrétním klientem (konzultace, dlouhodobá spolupráce).

**Vždy:**
- `00-inbox/`
- `01-communications/` — podsložky `01-meetings/`, `02-messages/`, `03-summaries/`
- `02-project-mgmt/` — `ROADMAP.md`, `packages/` (lifecycle 10-draft → 40-done), `nabidky/` (NAB-NNN) + `nabidky.md`, `templates/`
- `03-context/` — persona klienta, brief, klientovo prostředí a systémy
- `04-deliverables/` — finální výstupy pro klienta (bez `*-INTERNI-*` souborů)
- `99-archive/`

**Doporučené:**
- `70-research/` — pokud děláš pro klienta výzkum
- `10+` — dedikované fáze/výstupy projektu (číslované od 10 výš)

**Root soubory:**
- `README.md`, `AGENTS.md`, `CLAUDE.md` (povinné)
- `00-kickoff.md` — seed formulář (vyplnit s klientem, pak naseed-ovat workspace)
- `ONBOARDING.md` (pokud na klientovi pracuje 2+ lidí)
- `TODO.md`
- `agent.local.md.example` + config soubory (`.gitignore`, `.gitattributes`, `.editorconfig`)

### 2. App / produkt (`app`)

Workspace pro vývoj aplikace nebo produktu.

**Vždy:**
- `00-inbox/`
- `01-communications/`
- `02-project-mgmt/`
- `03-context/` — produktová vize, design system
- `90-product-backlog/`
- `99-archive/`
- `docs/` — technická dokumentace
- `scripts/` — pomocné skripty

**Doporučené:**
- `10-19/` — fáze aplikace (`10-mvp/`, `11-admin-panel/`, `12-mobile/`)
- `70-research/`

**Root soubory:**
- `README.md` (povinné)
- `AGENTS.md` (povinné)
- `ONBOARDING.md` (povinné)
- `DEVELOPMENT-PROCESS.md` (povinné — sprint cyklus, role)
- `TODO.md`, `IDEAS.md`

### 3. Projekt (`projekt`)

Workspace pro konkrétní projekt s jasným začátkem a koncem (např. migrace, integrace, redesign).

**Vždy:**
- `00-inbox/`
- `01-communications/`
- `02-project-mgmt/`
- `99-archive/`

**Doporučené:**
- `03-context/` — pokud má projekt nontriviální kontext
- `04-deliverables/` — pokud má projekt finální výstupy
- `70-research/`
- `docs/`, `scripts/`

**Root soubory:**
- `README.md` (povinné)
- `AGENTS.md` + `CLAUDE.md` (povinné, pokud používáš AI)
- `00-kickoff.md` (pokud je projekt pro klienta)
- `TODO.md`
- `ONBOARDING.md` (pokud projekt > 1 osoba)
- `agent.local.md.example` + config soubory (`.gitignore`, `.gitattributes`, `.editorconfig`)

### 4. Docs vault (`docs-vault`)

Workspace pro dokumentační systém — knowledge base, wiki, vault.

**Vždy:**
- `00-inbox/`
- `99-archive/`

**Doporučené:**
- `03-context/` nebo přímo tematické složky (`10-clients/`, `20-projects/`, atd.)
- Tematické top-level složky podle obsahu

**Root soubory:**
- `README.md` (povinné)
- `AGENTS.md` (povinné — bez něho se v knowledge base nikdo nevyzná)

## Otázky uživateli při setupu

Skill `workspace-docs-setup` se zeptá:

1. **Typ workspace?** → klient / app / projekt / docs-vault
2. **Jméno workspace** → použije se v root souborech
3. **Tým** → solo / 2+ lidí (rozhoduje o ONBOARDING.md)
4. **Jazyk obsahu** → cs / en
5. **Git repo?** → ano/ne (rozhoduje o git workflow sekci v AGENTS.md a config souborech)
6. **Volitelné složky** → list doporučených, uživatel vybere

## Průřezové konvence (všechny typy)

- **`*-INTERNI-*` soubory** — interní ceny, marže, strategie. Nikdy nesdílet s klientem, nikdy nekopírovat do deliverables; z ostatních dokumentů jen odkazovat.
- **Cross-platform** — LF konce řádků, žádné symlinky, žádné bash-only skripty, Windows-safe názvy souborů.
- **`.agents/` vrstva** — kanonický zdroj AI artefaktů + tenké wrappery per nástroj (viz `templates/dotfolders/`).

## Rozhodovací strom: Aplikovat standard?

Aplikuj systém pokud platí **alespoň 2 z 3**:

1. Spolupracuje na něm víc lidí (i jen občas)
2. Má víc než 5 top-level složek
3. AI agenti v něm pracují pravidelně

Pokud nesplňuje, stačí jednoduchý `README.md` — nezakládat celý systém.
