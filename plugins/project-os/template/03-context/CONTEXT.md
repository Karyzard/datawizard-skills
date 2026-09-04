---
title: Znalostní báze
date: 2026-08-25
---

# 03-context

## Účel

Znalostní báze projektu a **jediný zdroj pravdy**. Vize, datový model, procesy, pravidla, design.

## Co sem patří

- Cokoli, co platí napříč itemy a fázemi a co by se jinak opisovalo na víc míst.

## Co sem nepatří

- Provozní řízení (jde do `02-project-mgmt/`), záznamy komunikace (`01-communications/`), rozpracované myšlenky (`50-<jmeno>/`).

## Workflow

- Mění se **jen po schválení PO**. Agent sem bez explicitního zadání nesahá.
- Delivery itemy na kontext **odkazují, nikdy ho nekopírují**. Duplikovaný datový model je nejdražší chyba, kterou tenhle systém umí udělat.
- Pokud znalost žije v externím zdroji pravdy (vault klienta, jiné repo), odkazuje se tam a nekopíruje se sem.
- Stránky se odkazují wikilinky `[[nazev-stranky]]`, katalog drží `index.md`.
- `way-of-working/` drží, jak se v projektu pracuje (git workflow, konvence).
