---
title: 01-communications — kontext
date: {{today}}
status: active
---

# 01-communications/ — Komunikace, schůzky, e-maily

> **Účel:** Centralizace veškeré komunikace okolo workspace — schůzky, mailová vlákna, chat zápisky.

## Údržba

Aktualizuj tento soubor když přidáš novou podsložku (nový typ komunikace).

## K čemu složka slouží

Záznam toho, co se kde řeklo, dohodlo, posunulo. Platí: pokud to není napsané tady, nestalo se to.

## Podsložky

- `01-meetings/` — schůzky (`YYYY-MM-DD-strucny-nazev/` se zápisem, přípravou a přílohami)
- `02-messages/` — mailová vlákna a chat zprávy (`YYYY-MM-DD-odesilatel-tema/` s `.eml` + `.md`)
- `03-summaries/` — průběžná shrnutí komunikace
- volitelně `04-sw-releases/` — release notes, deploy logy (dev workspace)

## Aktuální stav

| Položka | Stav |
|---|---|
| Kanál s klientem | {{ doplnit — chat / e-mail / telefon }} |
| Poslední komunikace | {{ odkaz }} |
| Nadcházející | {{ odkaz }} |

## Naming konvence

- Schůzky: `YYYY-MM-DD-strucny-nazev/`
- E-mail vlákna: `YYYY-MM-DD-predmet.md`
- Chat zápisky: `YYYY-MM-DD-chat-poznamky.md`

## Doporučené pořadí čtení

1. Toto `CONTEXT.md` — co složka je
2. Nejnovější záznam ze schůzky — aktuální stav komunikace

## Související

- [`../README.md`](../README.md) — workspace přehled
- [`../AGENTS.md`](../AGENTS.md) — routing pro AI agenty
- [`../02-project-mgmt/CONTEXT.md`](../02-project-mgmt/CONTEXT.md) — harmonogram a plán vychází z komunikace
