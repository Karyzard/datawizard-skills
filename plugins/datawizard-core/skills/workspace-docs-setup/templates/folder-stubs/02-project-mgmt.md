---
title: 02-project-mgmt — kontext
date: {{today}}
status: active
---

# 02-project-mgmt/ — Project management

> **Účel:** Plánovací a řídící artefakty — roadmapa, pracovní balíčky, cenové nabídky, timeline, RACI, risks.

## Údržba

Aktualizuj tento soubor když přidáš nový artefakt (např. začneš trackovat něco nového).

## K čemu složka slouží

Centrální místo pro řízení projektu. Co se plánuje, co se mění, kdo je za co zodpovědný, jaká jsou rizika. Žijí tu i cenové nabídky (evidence NAB-NNN) a pracovní balíčky pro realizaci.

## Standardní artefakty

- `ROADMAP.md` — jediný zdroj pravdy o prioritách balíčků + **append-only decision log** (nikdy nemazat, jen přidávat)
- `packages/` — pracovní balíčky v lifecycle `10-draft → 20-ready → 30-in-progress → 40-done` (model PO ↔ developer); každý balíček má `zadani.md`, `otazky.md`, `podklady/`
- `templates/package/` — šablona nového balíčku
- `nabidky.md` — evidence cenových nabídek (číselná řada NAB-NNN, stavy poptávka → odhad → kalkulace → odeslána → schválena/zamítnuta)
- `nabidky/` — složka per nabídka (`NAB-NNN-kebab-nazev/`) s podklady a odhadem developera; interní ceny jen v souborech `*-INTERNI-*` (nikdy nesdílet s klientem)
- `templates/nabidka/` — šablona nové nabídky

## Doporučené artefakty (podle potřeby)

- `timeline.md` — milníky, deadliny
- `raci.md` — Responsible, Accountable, Consulted, Informed
- `moscow.md` — Must / Should / Could / Won't have priorities
- `risks.md` — registr rizik s mitigací
- `sprints/` — sprint složky (`sprint-NN_WYY-WZZ_YYYY-MM-DD/`)

## Naming konvence

- Balíčky: `packages/<lifecycle>/<kebab-case-nazev>/`
- Nabídky: `nabidky/NAB-NNN-kebab-nazev/` (číslo se nikdy nerecykluje)
- Sprint složky: `sprint-NN_WYY-WZZ_YYYY-MM-DD/`
- Plánovací dokumenty: `kebab-case.md`
