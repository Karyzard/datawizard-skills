---
title: template-project — šablona projektového repa
date: 2026-08-25
template_version: 2
---

# template-project

Šablona týmového projektového repa Datawizard. Jeden projekt = jedno repo: provozní řízení, znalostní báze a handover pro tým na jednom místě. Kódová repa zůstávají oddělená, vazbu drží `project.yaml`.

## Jak z toho udělat nový projekt

Šablona žije v pluginu `project-os` (`datawizard-skills`). Nový projekt zakládá skill `/new-project`, přenos existující složky skill `/migrate-project`. Ručně: zkopírovat strom bez `CHANGELOG.md`, vyplnit `project.yaml` a `00-kickoff.md`, přejmenovat `50-jmeno/` na `50-<jmeno>/` a `10-priklad-faze/` na reálnou první fázi, smazat `04-client-hub/` u klienta s hub repem.

Zdroj pravdy pro pravidla je skill `project-standard` (`references/standard.md`).

## Struktura

Mapa složek a routing žijí v `AGENTS.md`, ať se neudržují dvakrát.

| Vrstva | Složky |
|---|---|
| Řízení | `ROADMAP.md`, `DELIVERY.md`, `JOURNAL.md`, `project.yaml` |
| Sdílená vrstva | `00-inbox/`, `01-communications/`, `02-project-mgmt/`, `03-context/`, `04-client-hub/` (vč. `ukoly/`) |
| Fáze projektu | `10-…` až `39-…` |
| Delivery | `40-delivery/` |
| Osobní | `50-<jmeno>/` |
| Podpora | `60-testing/`, `70-research/`, `90-backlog/` (zakládat při potřebě) |
| Archiv | `99-archive/` |

## Verzování šablony

Šablona je copy-once. Oprava tady se do už založených projektů nepropíše sama. Verze se vede v `CHANGELOG.md` a zapisuje do `project.yaml` jako `template_version`.
