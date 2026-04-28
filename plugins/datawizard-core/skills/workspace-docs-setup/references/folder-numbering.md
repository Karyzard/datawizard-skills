---
title: Folder Numbering — 00–99 schéma
date: 2026-04-28
---

# Folder Numbering

Konvence pro number prefixy top-level složek napříč všemi workspace v Datawizard OS.

## Schéma

| Rozsah | Účel | Příklady |
|---|---|---|
| `00-09` | Sdílený kontext, podpůrné | `00-inbox/`, `01-communications/`, `02-project-mgmt/`, `03-context/`, `04-deliverables/` |
| `10-19` | Hlavní výstupy — fáze projektu, aplikace, dodávky | `10-mvp/`, `11-admin-app/`, `12-mobile-app/` |
| `20-29` | Rezerva pro další fáze | (volné) |
| `30-69` | Explorativní / future / experimentální | `30-experiments/`, `40-prototypes/` |
| `70-79` | Research | `70-research/`, `71-user-research/` |
| `80-89` | Rezerva | (volné) |
| `90-98` | Produktové artefakty | `90-product-backlog/`, `91-design-system/` |
| `99` | Archiv (read-only) | `99-archive/` |
| nečíslované | Technické artefakty | `docs/`, `scripts/`, `src/`, `.claude/`, `node_modules/` |

## Pravidla

1. **Mezery v číslech jsou OK** — když ti chybí `04`, ale máš `05`, není to problém. Sortování funguje.
2. **Nepřesouvat čísla** — když začneš s `10-mvp/` a později chceš `09-mvp/`, **nepřejmenovávej** — udělá to chaos s odkazy. Místo toho přidej nové číslo nahoru.
3. **`00-` a `99-` jsou speciální** — `00-inbox/` je staging, `99-archive/` je read-only archiv.
4. **Číslo má smysl** — řadí složky logicky pro lidi i AI. Nedávej `01-foo/` jen aby tam bylo číslo, pokud to neodpovídá schématu.

## Co se nečísluje

Technické složky (které slouží nástrojům, ne lidskému workflow):

- `docs/` — technická dokumentace pro vývojáře
- `scripts/` — pomocné skripty
- `src/`, `lib/`, `tests/` — kód
- `.claude/`, `.cursor/`, `.github/` — config nástrojů
- `node_modules/`, `venv/`, `dist/` — generované

Tyhle vždy patří mimo number schéma — řadí se abecedně mezi 99 a koncem.
