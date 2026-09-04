---
title: Changelog šablony
date: 2026-08-25
---

# Changelog template-project

Formát: `## v<N> — YYYY-MM-DD`, nejnovější nahoře. Breaking změna struktury = nová verze; projekty se povyšují vědomě přes PR.

## v3 — 2026-09-05

Nebreaking. `project.yaml` nese pole `vcs: git | none`. Standard nově platí i pro projektové složky na OneDrive bez gitu (`_DATAWIZARD/05-projects/`, profil bez gitu, standard sekce 3c): stejná struktura a řízení, git pravidla přemapovaná (journal řádek hned místo „ve stejném commitu", přesuny itemů bez commitů, bez větví a PR).

**Upgrade z v2:** doplnit `vcs: git` do `project.yaml`. Nic dalšího se nemění.

## v2 — 2026-08-25

**Breaking:** `04-client-tasks/` a `05-client-hub/` sloučeny do jedné složky `04-client-hub/` s podsložkou `ukoly/`.

Spec (sekce 3.3 a 3.7) vedl úkoly na klienta jako interní zdroj pravdy ve `04-client-tasks/` a `04-client-hub/ukoly/` jako jeho projekci. Dvě místa pro tentýž obsah znamenají drift; projekce se v praxi přestane aktualizovat. Úkoly teď žijí na jednom místě, které je zároveň zdroj pravdy i to, co klient vidí.

- `04-client-hub/ukoly/` drží lifecycle `10-open → 20-sent → 30-done`.
- **`10-open/` se nikdy nedeployuje.** `deploy.sh` publikuje výčtem, ne plošným kopírováním, a má pojistku, která deploy zastaví, kdyby se `10-open/` do kopie dostalo.
- `deploy.sh` navíc generuje rozcestníky pro `/ukoly/`, `/agenda/` a `/prototypy/`, které by jinak končily na 404.
- Plocha se přečíslovala z `05` na `04`, aby po zrušené složce nezůstala mezera. Číslo `05` je nově volné jako rezerva.

**Upgrade z v1:** přejmenovat `05-client-hub/` na `04-client-hub/`, přesunout do něj `04-client-tasks/{10-open,20-sent,30-done}/` jako `ukoly/`, převzít nový `deploy.sh`, přepsat odkazy v `AGENTS.md`, `README.md`, `01-communications/CONTEXT.md` a `02-project-mgmt/spec/komunikacni-plan.md`.

## v1 — 2026-08-25

První verze podle specu `_spec/2026-07-14-datawizard-github-team-structure-design.md` (sekce 3, stav `updated: 2026-08-25`).

- Sdílená vrstva 00–09 včetně `04-client-hub/`, fázové složky 10–39, `40-delivery/` s jednou ID řadou `D00X`, osobní složky `50-<jmeno>/`, podpůrné `60-testing/`, `70-research/`, `90-backlog/`, archiv 99.
- Čtyři místa řízení: ROADMAP.md (priority + decision log), DELIVERY.md, JOURNAL.md, project.yaml.
- `templates/` s kostrami item-light, item full, handoff, CONTEXT, zápis, agenda (sekce 3.9).
- `02-project-mgmt/` s kostrami timeline, scope (MoSCoW), RACI, rizika, komunikační plán, budget, předávky.
- `03-context/` s kostrami vize, datový model, procesy, pravidla, design, katalog `index.md` a `way-of-working/git-workflow.md`.
- `04-client-hub/` s rozcestníkem `index.html`, `_redirects` a `deploy.sh` na Netlify (vzor med-hub `07-hub`, sekce 3.7).
