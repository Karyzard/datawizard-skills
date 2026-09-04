---
title: Výhled automatizace (co skills nedělají)
date: 2026-09-04
source: OneDrive Hub - Dokumenty/01_Projekty/Datawizard-AI-Hub/2026-08-25-datawizard-automation-design.md (draft)
---

# Výhled automatizace

Souhrn druhého dokumentu metodiky. Nic z toho zatím nestojí; skills v `project-os` jsou interaktivní vrstva a dělají jen to, co jde udělat lokálně v repu.

## Dělba práce (cílový stav)

| Vrstva | Co tam běží |
|---|---|
| aplikace `app-datawizard-os` (Supabase Cron + Edge Functions) | číselník projektů `YY-NNN` v DB, provisioning repa, registr rep org, denní sběr aktivity a LLM digest, agregace delivery itemů napříč projekty |
| GitHub Actions per repo | `@claude` v Issues/PR, CI kódových rep |
| Claude Code skills (tento plugin) | `/new-project`, `/migrate-project`, `/delivery-item`, `/project-audit`; cílově tenké klienty nad API aplikace |
| Claude Code hooks (ze šablony, druhá iterace) | ochrana `40-done/`, `99-archive/`, `03-context/`, cizích `50-*/`; připomínka journalu; kontrola prefixu commitu |

## Co z toho plyne pro skills dnes

- `project_id` zůstává `"<doplnit>"`, dokud aplikace nealokuje čísla. Skill číslo nevymýšlí.
- `registr-projektu.md` v `datawizard-crm` bude generovaný soubor; do té doby neexistuje a skill do něj nezapisuje.
- Digest bere řádky z `JOURNAL.md` doslova a commity `D00X: …` páruje na itemy. Kázeň journalu a prefixů má tedy přímou hodnotu, ne jen estetickou.
- Stav itemu čte stroj z umístění ve lifecycle složce. Žádné paralelní stavy ve frontmatteru.
- Placeholder konvence pro seed: `{{PROJECT_ID}}`, `{{CLIENT_SLUG}}`, `{{PROJECT_NAME}}`, `{{DATE}}`, `{{TEMPLATE_VERSION}}` (šablona je dnes používá ve formě `<…>`; sjednotit při napojení na provisioning).

## Fázování

A: vidět (read-only sync org, digest, stránka Práce z Issues). B: zakládat (číselník v DB, provisioning, `/new-project` jako klient). C: hlídat (drift auto-PR, týdenní digest, template-drift report, `/archive-project`).
