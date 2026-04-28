---
title: docs — kontext
date: {{today}}
status: active
---

# docs/ — Technická dokumentace

> **Účel:** Technická dokumentace projektu — architektura, API, deployment, runbooky.

## Údržba

Aktualizuj tento soubor když přibyde nová oblast dokumentace.

## K čemu složka slouží

Pro vývojáře a operations team. Co potřebují vědět aby kód postavili, nasadili a provozovali.

## Doporučené struktura

- `architecture/` — diagramy, ADR (Architecture Decision Records)
- `api/` — API reference (OpenAPI, postman kolekce)
- `deployment/` — jak nasadit, env vars, infra
- `runbooks/` — co dělat když X (incident response)
- `dev-setup.md` — jak rozjet lokálně

## Naming konvence

- `kebab-case.md`
- ADRs: `YYYY-MM-DD-rozhodnuti-nazev.md`
