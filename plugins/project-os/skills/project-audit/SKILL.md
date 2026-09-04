---
name: project-audit
description: Use when checking a project-<slug> repo for drift between AGENTS.md, README.md, CONTEXT.md files, DELIVERY.md and the actual folders, when the template version may be outdated, when links are dead, or when the user says "zauditovat projekt", "sync docs", "je repo podle standardu", "/project-audit", "co v repu nesedí".
---

# project-audit

Read-only kontrola projektového repa proti standardu. Nejdřív report, opravy až po souhlasu; nic se neopravuje potichu.

**REQUIRED SUB-SKILL:** `project-standard` (3.1 vrstvy, 3.2 řídicí soubory, 3.13 údržba).

## Co se kontroluje

| Kontrola | Jak |
|---|---|
| root soubory | existují `README.md`, `AGENTS.md`, `CLAUDE.md` (= `@AGENTS.md`), `ONBOARDING.md`, `ROADMAP.md`, `DELIVERY.md`, `JOURNAL.md`, `project.yaml`, `00-kickoff.md` |
| mapa složek | každá top-level složka `NN-*` je v tabulce v `AGENTS.md` a naopak; každá má `CONTEXT.md` |
| číslování | složky spadají do vrstev 00–09 / 10–39 / 40 / 50 / 60–98 / 99; chronologické položky uvnitř mají prefix `YYYY-MM-DD` |
| delivery | každý řádek `DELIVERY.md` ukazuje na existující item v `10-draft|20-ready|30-in-progress`; každý item mimo `40-done/` má řádek; ID unikátní; blokované mají ⛔ a nezodpovězenou otázku v `otazky.md` |
| journal | append-only: `git log -p JOURNAL.md` nesmí ukazovat smazané řádky; poslední řádek není starší než poslední obsahový commit o víc než týden |
| README | stavová tabulka: datum starší než 30 dní při `status: active`; sekce Odchylky od šablony existuje |
| manifest | `project.yaml` má slug = název složky bez `project-`, `client`, `status`, `template_version`; `code_repos` existují (`gh repo view`) |
| šablona | `template_version` vs. první `## v<N>` v `plugins/project-os/template/CHANGELOG.md`; při rozdílu vypiš upgrade poznámky z CHANGELOGu |
| klientská plocha | buď `04-client-hub/` (bez `10-open/` v deploy výčtu), nebo hub repo uvedené v README/`project.yaml`; ne obojí, ne nic |
| odkazy | relativní odkazy v root souborech a CONTEXT.md vedou na existující cíle; žádné `sharepoint.com`/`OneDrive` lokální cesty mimo `assets_vault` |
| citlivé | soubory > 5 MB, `.env`, exporty s osobními údaji mimo assets vault |

## Report

```
## V pořádku
- …
## Vyžaduje rozhodnutí
- `60-testing/` nemá CONTEXT.md → založit ze šablony, nebo složku smazat?
- template_version 1, šablona v2 → upgrade podle CHANGELOG (přejmenování 05→04-client-hub …)
## Poznámky
- …
```

Sekce „Opraveno automaticky" neexistuje: audit nic nemění. Po souhlasu proveď opravy jako jeden commit `audit: <co>` + journal řádek, pak audit zopakuj a vypiš čistý report.

## Co audit nedělá

Nehodnotí obsah (kvalitu zadání, úplnost kontextu). Nesahá do `40-done/`, `99-archive/`, `50-*/` cizích lidí ani při opravách.
