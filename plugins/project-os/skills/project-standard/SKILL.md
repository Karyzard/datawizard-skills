---
name: project-standard
description: Use when working inside a Datawizard project workspace — a git repo (~/dev/projects/project-*/) or an OneDrive project folder (OneDrive-Datawizard/_DATAWIZARD/05-projects/) with files like project.yaml, DELIVERY.md, JOURNAL.md, 40-delivery/ — when starting or founding a new project (client service or core service), or when someone mentions the project standard, template-project, delivery items D00X, journal, decision log, org mirror, klientská plocha, or the no-git profile (vcs: none). Also the first step of new-project, migrate-project, delivery-item and project-audit.
---

# Standard projektového repa

Jedno repo na projekt: řízení + znalostní báze + handover týmu. Kód žije v samostatných repech, vazbu drží `project.yaml`. Klient do projektového repa nevidí; vidí jen klientskou plochu (hub repo nebo `04-client-hub/`).

Standard má dva profily podle `vcs` v `project.yaml` (fallback: existuje `.git/`?): **git** (repo v org mirroru) a **bez gitu** (OneDrive složka, viz níže). Struktura a řízení jsou stejné, liší se jen git vrstva.

Závazný text je `references/standard.md` (sekce 3 a 3b metodiky, doslovně). Tenhle soubor je mapa; při nejistotě čti referenci, nedomýšlej.

## Kdy číst co

| Situace | Přečti |
|---|---|
| Kam patří soubor, kdo smí co, lifecycle itemu | `AGENTS.md` repa, pak `references/standard.md` sekce 3.1–3.8 |
| Zakládám nebo přenáším projekt | `references/founding.md` (+ skill `new-project` / `migrate-project`) |
| Co bude automatizované a kde skill končí | `references/automation-outlook.md` |

## Vrstvy repa

| Rozsah | Vrstva | Spravuje |
|---|---|---|
| root soubory | řízení: `ROADMAP.md`, `DELIVERY.md`, `JOURNAL.md`, `project.yaml`, `00-kickoff.md` | PO |
| 00–09 | sdílená: inbox, komunikace, project-mgmt, `03-context/` (jediný zdroj pravdy), `04-client-hub/` | PO |
| 10–39 | fázové složky (aplikace, etapy) | PO |
| 40 | `40-delivery/` handover: `10-draft → 20-ready → 30-in-progress → 40-done` | lifecycle |
| 50 | `50-<jmeno>/` osobní skicák | vlastník |
| 60–98 | testing, research, backlog (zakládat při potřebě) | dle CONTEXT.md |
| 99 | archiv, jen přesun dovnitř | nikdo nemaže |

Každá top-level složka má `CONTEXT.md`. Chronologické věci se prefixují datem `YYYY-MM-DD-tema/`, ne číslem.

## Čtyři místa řízení

`ROADMAP.md` priority a decision log (jen PO) · `DELIVERY.md` co a kdo (PO zakládá, vlastníci své řádky) · `JOURNAL.md` co se stalo (všichni) · `project.yaml` identita pro stroje.

**Viditelná změna = řádek do JOURNAL.md ve stejném commitu.** Formát `- YYYY-MM-DD — kdo — co`, agent píše `kdo (agent)`. Append-only, nejnovější nahoře.

## Co agent nesmí (matice rolí, 3.8)

- Měnit `ROADMAP.md`, `README.md`, `AGENTS.md`, `03-context/`, `10-draft/`, `20-ready/`, `40-done/`, `04-client-hub/` bez výslovné výzvy PO.
- Přesouvat itemy mezi lifecycle složkami z vlastní iniciativy; přidělovat nebo měnit ID.
- Přepisovat nebo mazat řádky v `JOURNAL.md`; mazat v `99-archive/`.
- Sahat do cizích itemů a cizích `50-*/`.
- Domýšlet nejasné zadání. Nejasnost jde do `otazky.md` u itemu.

Smí: pracovat v itemu ve `30-in-progress/`, jehož `owner` je člověk, který ho spustil; v `50-*/` svého spouštěče; přidat řádek do journalu; zapsat otázku.

## Pravidla, na která se zapomíná

- **Odkazuj, nekopíruj.** `03-context/` je jediný zdroj pravdy; item na něj odkazuje.
- **Stav itemu = jeho složka.** ID `D00X` je identita, nikdy se nerecykluje; reopen neexistuje, chyba po dodání = nový item.
- **Přesun itemu = samostatný malý commit** hned pushnutý.
- **Klientská plocha:** klient s `hub-<klient>` repem má plochu tam a `04-client-hub/` se v projektu nezakládá; klient bez hubu má `04-client-hub/` a vidí jen deploy (`10-open/` se nikdy nedeployuje).
- **Git:** `main` vždy platný; větve `feature/D00X-…`, `fix/…`, `agent/D00X-…`; commity česky s prefixem ID nebo oblasti; `--force` do main nikdy. Přesun do `40-done/` a změny pravidel repa vždy přes PR.
- **Org mirror:** lokálně `~/dev/projects/project-*`, `~/dev/hubs/hub-*`, `~/dev/code/app-*|web-*`, `~/dev/datawizard/datawizard-*`. Jméno složky = jméno repa.
- **První nastavení:** layout `~/dev/` je týmový standard Datawizard. Nový člen týmu si složky vytvoří jednou: `mkdir -p ~/dev/projects ~/dev/hubs ~/dev/code ~/dev/datawizard`.
- **Nic citlivého do gitu:** osobní údaje klientů a binárky patří do assets vaultu (SharePoint URL v `project.yaml`). Git historie je navždy.

## Profil bez gitu (OneDrive projekty)

Projektové složky v `_DATAWIZARD/05-projects/<kategorie>/` drží tentýž standard bez git vrstvy; deklaruje ho `vcs: none` v `project.yaml`. Detail v `references/standard.md` sekce 3c. Struktura, řídicí soubory, lifecycle itemů, matice rolí i append-only pravidla platí beze změny. Mění se jen:

- journal řádek se píše hned po viditelné změně (není commit, ke kterému by se vázal)
- přesun itemu = přesun složky + journal řádek v jednom kroku
- větve a PR odpadají; `40-done/`, `AGENTS.md` a `README.md` jen po výslovném souhlasu PO
- domov je `05-projects/<kategorie>/<nazev>` s datovým prefixem názvu (`2026-08-nazev`), ne org mirror
- binárky a podklady můžou ležet přímo ve složce (OneDrive je privátní, do žádné git historie nejdou)

Povýšení na git: `git init` + PII scrub + `vcs: git` + přesun do org mirroru jako `project-<slug>`. Struktura už sedí.

## Údržba

Při změně struktury: `AGENTS.md` (mapa), `README.md` (stavová tabulka), dotčené `CONTEXT.md`, řádek do journalu. Stavová tabulka v README s datem starším než měsíc u běžícího projektu lže.
