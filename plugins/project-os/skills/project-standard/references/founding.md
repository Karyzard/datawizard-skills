---
title: Založení a přenos projektu
date: 2026-09-04
---

# Založení a přenos projektu

Ověřený postup ze `project-fitness-os` (2026-08-25), `project-hf-design` (2026-08-27, přenos z OneDrive) a `project-med-elektronic-systems` (2026-09-04, prázdné založení). Skills `new-project` a `migrate-project` ho vykonávají; tady je proč.

## Vstupy, bez kterých se nezakládá

| Vstup | Kde se propisuje |
|---|---|
| slug repa (`project-<slug>`, kebab-case, po založení se nemění) | název složky, `project.yaml` |
| název projektu | `project.yaml`, README, kickoff |
| slug klienta (jak ho vedou ostatní repa a CRM; `datawizard` u core služby) | `project.yaml`, README frontmatter, topic `client-<slug>` |
| PO (jméno) | `DELIVERY.md` sekce, `50-<jmeno>/`, kickoff |
| má klient hub repo? | rozhoduje o `04-client-hub/` |
| první fázové složky (může být žádná) | `10-…`, README stavová tabulka |

## Recept

1. Zkopírovat `template/` bez `CHANGELOG.md`.
2. `50-jmeno/` → `50-<po>/`; `10-priklad-faze/` smazat, nebo přejmenovat na první reálnou fázi.
3. `04-client-hub/` smazat, když má klient hub repo (`hub-<klient>`, u MED Elektronik `project-med-hub` + `med-elektronik-hub`).
4. Vyplnit `project.yaml` (`project_id: "<doplnit>"` dokud neexistuje registr; `template_version` z `template/CHANGELOG.md`), `README.md` (úvod, kde začít, stavová tabulka s dnešním datem, odchylky od šablony), `00-kickoff.md`, `ROADMAP.md` (první priorita + první decision log řádek), `DELIVERY.md` (sekce PO), `JOURNAL.md` (řádek o založení), `date:` ve frontmatterech CONTEXT.md.
5. `.gitkeep` do prázdných složek, `git init`, jeden init commit `init: projektové repo <název> ze šablony template-project v<N>`.
6. GitHub až na výslovné zadání: `gh repo create DatawizardCZ/project-<slug> --private --source . --push`, topics `client-<slug>` (a `prj-YY-NNN`, až bude registr).
7. Zápis do CRM `clients/<klient>/projects.md`, až `datawizard-crm` existuje.

## Odchylky od šablony patří do README

Sekce „Odchylky od šablony" v README je povinná, i když je prázdná. Každé vědomé odchýlení (chybějící `project_id`, jiná kostra fáze, binárky v repu, chybějící plocha) je tam jednou větou s důvodem a datem; větší rozhodnutí navíc do decision logu.

## Přenos existující složky (migrate)

Mapování legacy → standard:

| Legacy (OneDrive `01_Projekty`, `_clients`, `~/dev/copy`) | Cíl |
|---|---|
| zápisy, přepisy, e-maily | `01-communications/01-meetings/YYYY-MM-DD-tema/`, `02-messages/` |
| timeline, scope, nabídky, budget | `02-project-mgmt/spec/`, `daily-ops/` |
| profil klienta, datový model, procesy, design | `03-context/` (destilát; surové podklady do podsložky, dokud z nich není stránka) |
| fázové složky `10-…` | `10-…` se **zachovanými názvy** (odkazy uvnitř dokumentů) |
| úkoly a výstupy pro klienta | hub repo, nebo `04-client-hub/` (`ukoly/`, `dokumenty/`) |
| staří AI asistenti, TASKS.md, TODO.md, IDEAS.md | `99-archive/` (nahrazují je skills, DELIVERY.md, ROADMAP.md, `90-backlog/`) |
| binárky, exporty s osobními údaji | assets vault; do repa jen odkaz. Výjimka jen rozhodnutím PO do decision logu |

Kázeň při přenosu:

- **Cutover datum** do README: od něj je git jediný zdroj pravdy, legacy složka read-only.
- **PII scrub před prvním commitem.** Git historie se nedá vygumovat.
- **Přepsat interní odkazy** na SharePoint/OneDrive cesty; po přesunu nikam nevedou.
- **Kickoff rekonstruovaný zpětně** se tak označí v úvodní větě; co není známé, jde do Známé neznámé, ne do vymyšleného textu.
- Legacy složku nemazat; jen se do ní přestane psát.
