---
title: project-os
date: 2026-09-04
---

# project-os

Metodika projektových workspace Datawizard jako plugin. Jeden standard, dva profily podle `vcs` v `project.yaml`: **git** (`project-<slug>` repo v org mirroru) a **bez gitu** (`vcs: none`, složka na OneDrive `_DATAWIZARD/05-projects/`). Struktura a řízení jsou stejné, liší se jen git vrstva. Nahrazuje ruční odkazování na design dokumenty v OneDrive a samostatné repo `template-project`: šablona žije tady v `template/`, pravidla ve skillu `project-standard`.

## Skills

| Skill | Kdy |
|---|---|
| **project-standard** | úvodní dokument; načte se při práci v `project-*` repu nebo OneDrive projektové složce a jako první krok ostatních skillů |
| **new-project** | založit nový projekt ze šablony (klientská i core služba; git repo, nebo OneDrive složka bez gitu) |
| **migrate-project** | přenést starší složku do standardu (OneDrive `01_Projekty`, `_clients`, `05-projects` na místě, kopie v `~/dev/copy`) |
| **delivery-item** | D00X itemy: založit, převzít, blokovat, uzavřít; DELIVERY.md + JOURNAL.md |
| **project-audit** | konzistence AGENTS/README/CONTEXT/DELIVERY a drift verze šablony |

## Šablona

`template/` je kostra repa, verze v `template/CHANGELOG.md`. Projekt nese verzi v `project.yaml` (`template_version`). Šablona je copy-once; oprava tady se do založených rep nepropíše, `project-audit` hlásí zastaralou verzi.

## Co tu není (backlog s triggerem)

`/share-to-client`, `/archive-project`, `/link-repo`, `/new-client` (CRM) a hooky v `template/.claude/settings.json`. Přijdou, až bude existovat `datawizard-crm`, resp. až bude první reálná potřeba.

## Instalace

```
/plugin install project-os@datawizard-skills
```
