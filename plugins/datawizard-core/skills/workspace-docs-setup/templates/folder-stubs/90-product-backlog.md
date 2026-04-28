---
title: 90-product-backlog — kontext
date: {{today}}
status: active
---

# 90-product-backlog/ — Product backlog

> **Účel:** Strukturovaný backlog produktu — co se chystá, co je v plánu, co se zahodilo.

## Údržba

Aktualizuj tento soubor když změníš strukturu backlogu (např. přidáš novou kategorii epicu).

## K čemu složka slouží

Single source of truth pro **co se bude dělat**. Strategická úroveň (epic, theme), taktická (story, task) i operativní (sprint commitment).

## Doporučené struktura (Boulders-Rocks-Gravel)

- `boulders/` — velké iniciativy, multi-měsíce (1–3 ročně)
- `rocks/` — středně velké (sprint—měsíc, ~10—20 v parallelu)
- `gravel/` — drobné úkoly, co vejde do mezery (50+)
- `done/` — archive dokončených (s datem)
- `wont-do/` — vědomě zahozené s důvodem

## Naming konvence

- Epic / story: `YYYY-MM-zkraceny-nazev.md`
- Sprint commit: viz `02-project-mgmt/sprints/`
