---
title: Komunikace
date: 2026-08-25
---

# 01-communications

## Účel

Všechno, co se řeklo nebo napsalo. Archiv komunikace, ne znalostní báze.

## Struktura

| Složka | Co sem jde |
|---|---|
| `01-meetings/` | `YYYY-MM-DD-tema/` se zápisem a originálním přepisem; cíl pipeline pro přepisy |
| `02-messages/` | e-maily a zprávy převedené do markdownu |
| `03-releases/` | release notes a komunikace k nasazením |
| `04-open-questions/` | otevřené otázky, které nemají domov v konkrétním itemu |

## Co sem nepatří

- Destilovaná znalost. Ta jde do `03-context/`, sem patří jen záznam, ze kterého vznikla.
- Úkoly. Ty jdou do `40-delivery/` (pro tým) nebo `04-client-hub/ukoly/` (na klienta).

## Workflow

Zápis ze schůzky vzniká ze `templates/zapis.md`, agenda ze `templates/agenda.md`. Agenda se píše před schůzkou a smí na klientskou plochu; zápis vzniká po schůzce a zůstává interní.

Původní binárky (`.msg`, nahrávky, screenshoty) do gitu nepatří, jdou do assets vaultu. Do repa jde jen textový obsah.
