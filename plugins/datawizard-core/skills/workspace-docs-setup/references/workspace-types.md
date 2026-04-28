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
- `01-communications/` — schůzky, mail, sw releases
- `02-project-mgmt/` — timeline, RACI, MoSCoW, risks
- `04-deliverables/` — nabídky, specs, reporty
- `99-archive/`

**Doporučené:**
- `03-context/` — pokud má klient dlouhodobý produktový kontext
- `70-research/` — pokud děláš pro klienta výzkum

**Root soubory:**
- `README.md` (povinné)
- `AGENTS.md` (povinné)
- `ONBOARDING.md` (pokud na klientovi pracuje 2+ lidí)
- `TODO.md`

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
- `AGENTS.md` (povinné, pokud používáš AI)
- `TODO.md`
- `ONBOARDING.md` (pokud projekt > 1 osoba)

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
5. **Volitelné složky** → list doporučených, uživatel vybere

## Rozhodovací strom: Aplikovat standard?

Aplikuj systém pokud platí **alespoň 2 z 3**:

1. Spolupracuje na něm víc lidí (i jen občas)
2. Má víc než 5 top-level složek
3. AI agenti v něm pracují pravidelně

Pokud nesplňuje, stačí jednoduchý `README.md` — nezakládat celý systém.
