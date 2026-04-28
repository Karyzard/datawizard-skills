---
title: Naming konvence pro workspace docs
date: 2026-04-28
---

# Naming Conventions

Konvence pro pojmenování souborů a složek ve workspace dokumentačním systému.

## Složky a soubory — bez diakritiky, kebab-case

✓ `01-meetings/`, `client-discovery.md`, `sprint-12_w15-w16_2026-04-15/`
✗ `01-Schůzky/`, `Client_Discovery.md`, `Sprint 12 (W15-W16)/`

## Top-level složky — prefix číslem

✓ `00-inbox/`, `02-project-mgmt/`, `99-archive/`
✗ `inbox/` (pokud workspace používá number schéma)

Viz [folder-numbering.md](folder-numbering.md).

## Datumové soubory — ISO formát

✓ `2026-04-28-meeting-notes.md`
✗ `28-04-2026-meeting.md`, `April-28-meeting.md`, `28.4.2026-meeting.md`

## Sprint složky — formát

✓ `sprint-12_w15-w16_2026-04-15/`
✗ `sprint12/`, `Sprint 12/`, `2026-04-15-sprint/`

Formát: `sprint-NN_WYY-WZZ_YYYY-MM-DD/`
- `NN` — pořadové číslo sprintu
- `WYY-WZZ` — týden od-do
- `YYYY-MM-DD` — datum začátku

## Schůzky — datum + krátký název

✓ `2026-04-28-kickoff-acme/`, `2026-04-28-retro/`
✗ `Schůzka 28.4./`, `Kickoff_Acme.md`

Pokud má schůzka víc artefaktů, dej ji do složky:

```
2026-04-28-kickoff-acme/
  notes.md
  recording.mp4
  slides.pdf
```

## Systémové soubory — UPPERCASE

✓ `README.md`, `AGENTS.md`, `ONBOARDING.md`, `TODO.md`, `IDEAS.md`, `CONTEXT.md`, `CLAUDE.md`, `DEVELOPMENT-PROCESS.md`
✗ `readme.md`, `Agents.md`

## Ostatní markdown — lowercase nebo kebab-case

✓ `vision.md`, `design-system.md`, `api-reference.md`
✗ `Vision.md`, `DesignSystem.md`

## Frontmatter — minimum

```yaml
---
title: Název dokumentu
date: 2026-04-28
---
```

Volitelně:

```yaml
status: active | draft | approved | archived
company: datawizard | kasimaka | personal
type: spec | meeting-notes | research | offer
```

## Verzování dokumentů

✓ `offer-vX.Y.md` (pro koncepty s verzemi)
✓ `2026-04-28-offer-acme.md` (pro datované)
✗ `offer-final.md`, `offer-FINAL-v2-final.md`

Když je dokument odsouhlasen, přesuň do `final/` a pojmenuj `2026-04-28-offer-acme-signed.md` (s datem podpisu).
