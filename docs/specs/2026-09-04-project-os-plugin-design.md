---
title: Plugin project-os — metodika projektových rep jako skills
date: 2026-09-04
status: draft
type: strategy
---

# Plugin `project-os`

Návrh, jak z metodiky projektových rep (dva dokumenty v OneDrive `Hub - Dokumenty/01_Projekty/Datawizard-AI-Hub/`) udělat plugin v `datawizard-skills`, aby se na dokumenty nemuselo odkazovat ručně. Čeká na schválení Karlem; nic z toho zatím není postavené.

## Cíl

1. Při zakládání nového projektu (klientská služba i core služba) má agent metodiku „nastudovanou" sám, vždy stejně, bez odkazu na OneDrive.
2. Běžná práce v `project-*` repu (delivery itemy, journal, údržba struktury) běží podle standardu, ne podle paměti agenta.
3. Šablona repa se distribuuje stejným kanálem jako skills (`/plugin install`), takže ji má celý tým.

## Zdroje, které plugin nahrazuje

| Dnes | Co s tím |
|---|---|
| `2026-07-14-datawizard-github-team-structure-design.md` (50 KB, sekce 3 + 3b = struktura repa) | destilát do `references/` skillu `project-standard`; originál zůstává v OneDrive jako historie rozhodnutí |
| `2026-08-25-datawizard-automation-design.md` (automatizace přes app datawizard-os) | krátký souhrn „co je plánované a kde skill končí" v `references/`; plugin sám nic z automatizace nestaví |
| `~/dev/datawizard/template-project` (lokální draft v2, na GitHubu neexistuje) | přesun do pluginu jako `template/`; jediný zdroj kostry |
| `datawizard-core:workspace-docs-setup` (starší `.agents/` layout, interaktivní dotazník) | zúžit na ne-projektové workspaces (OneDrive klient, app, docs-vault), nebo deprecatovat; pro `project-*` platí jen `project-os` |
| paměť `project-repo-standard-reference.md` | nahradí ji skill; memory zůstane jen jako ukazatel |

## Struktura pluginu

```
plugins/project-os/
├── .claude-plugin/plugin.json
├── README.md
├── template/                       ← kostra repa (= template-project v2, bez _spec/)
│   ├── CHANGELOG.md                ← verze šablony (template_version)
│   └── …
└── skills/
    ├── project-standard/           ← ÚVODNÍ DOKUMENT, metodika (čte se vždy)
    │   ├── SKILL.md
    │   └── references/
    │       ├── standard.md         ← sekce 3 + 3b: složky, čtyři místa řízení, lifecycle, role, git, manifest
    │       ├── founding.md         ← sekce 3.12 + zkušenost z hf-design: postup založení a migrace
    │       └── automation-outlook.md ← souhrn automation designu (co bude dělat app, co skills)
    ├── new-project/                ← založit project-<slug> ze šablony
    ├── migrate-project/            ← založit ze starší složky (OneDrive / _clients) s mapováním obsahu
    ├── delivery-item/              ← D00X: založit, převzít, uzavřít, blokovat; DELIVERY.md + JOURNAL.md
    └── project-audit/              ← konzistence AGENTS/README/CONTEXT/DELIVERY + template drift
```

Pět skillů. `share-to-client`, `archive-project`, `link-repo`, `new-client` (CRM) zůstávají v backlogu s triggerem podle hlavního dokumentu (sekce 8), dokud neexistuje `datawizard-crm`.

## Skills

### 1. `project-standard` (úvodní dokument)

- **Kdy se spustí:** práce v `~/dev/projects/project-*/` nebo `~/dev/hubs/hub-*/`, řeč o „novém projektu", „šabloně", „delivery itemu", „journalu", „standardu projektového repa". Ostatní čtyři skills ho volají jako první krok.
- **SKILL.md** (do 150 řádků): mapa vrstev 00–99, čtyři místa řízení, lifecycle `40-delivery/`, matice rolí pro agenta (co nesmí), pravidlo „odkazuj, nekopíruj", journal ve stejném commitu, org mirror. Zbytek v `references/`, načítá se podle potřeby.
- **Nic nedělá**, jen nastaví pravidla. Tím se plní požadavek „metodika nastudovaná, vždy stejná".

### 2. `new-project`

Vstupy: slug, název, klient (slug), typ (klientská služba / core služba), první fázové složky, kdo je PO, existuje-li hub repo klienta.

Kroky: načíst `project-standard` → zkopírovat `template/` bez `CHANGELOG.md` → vyplnit `project.yaml`, `README.md`, `00-kickoff.md`, `ROADMAP.md`, `DELIVERY.md`, `JOURNAL.md`, datumy ve frontmatterech → `50-<po>/` → `04-client-hub/` jen bez hub repa → `.gitkeep` do prázdných složek → `git init` + init commit → volitelně `gh repo create DatawizardCZ/project-<slug> --private` + topics `client-<slug>` (a `prj-YY-NNN`, až bude registr). Push jen na výslovné zadání.

Dnes ručně provedený postup u `project-med-elektronic-systems` (2026-09-04) je přesně tenhle checklist; skill ho jen zopakuje.

### 3. `migrate-project`

Varianta `new-project` pro projekty, které už existují ve starší struktuře (OneDrive `01_Projekty/…`, `_clients/…`, `~/dev/copy/…`). Přidává mapovací tabulku legacy → standard (komunikace → `01-`, kontext → `03-`, fáze → `10+` se zachováním názvů kvůli odkazům, klientské výstupy → hub / `04-client-hub/`, zbytek → `99-archive/`), PII scrub před prvním commitem, cutover datum do README a přepis interních odkazů. Vzor: `project-hf-design` (2026-08-27).

### 4. `delivery-item`

Operace nad `40-delivery/`: založit light/full item z `templates/`, přidělit ID (nejvyšší +1 včetně `40-done/`), převzít (přesun + `owner`, commit `D00X: převzetí`), zapsat otázku do `otazky.md` a ⛔ do indexu, uzavřít (kontrola „Hotovo když", PR do `40-done/`). Každá operace = aktualizace `DELIVERY.md` + řádek do `JOURNAL.md` ve stejném commitu. Skill respektuje matici rolí: přesun z vlastní iniciativy a zápis do `10-draft/` odmítne.

### 5. `project-audit`

Náhrada `/sync-docs` pro projektová repa: mapa v `AGENTS.md` vs. skutečné složky, `CONTEXT.md` v každé top-level, `DELIVERY.md` vs. obsah lifecycle složek, stavová tabulka v README starší než měsíc, `template_version` vs. `template/CHANGELOG.md` (hlásí, co upgrade obnáší), mrtvé odkazy. Report ve třech sekcích (v pořádku / opraveno / vyžaduje rozhodnutí), opravy až po souhlasu.

## Kde žije šablona

Doporučení: **v pluginu** (`plugins/project-os/template/`), ne v samostatném repu `template-project`.

- Repo `DatawizardCZ/template-project` dodnes nevzniklo; draft leží jen lokálně. Plugin ji rozdá celému týmu jedním `/plugin install` a verze šablony jede s verzí pluginu.
- `gh repo create --template` tím padá; nahrazuje ho `new-project` (kopie + seed), což hlavní dokument stejně předpokládal (seed agent).
- Pokud bude template repo někdy potřeba (provisioning z aplikace, sekce 2 automation designu), vygeneruje se z `template/` jedním skriptem. Jeden zdroj, druhý je derivát.

Mění to rozhodnutí z hlavního dokumentu (šablona = GitHub template repo). Patří do decision logu OneDrive dokumentu, až to Karel potvrdí.

## Vazby na kernel

- `~/.claude/CLAUDE.md`, routing mapa: nový řádek „Working in `~/dev/projects/project-*/` → skill `project-standard`". Hlavní dokument tuhle aktualizaci kernelu vede jako otevřený bod.
- `datawizard-core:workspace-docs-setup`: do popisu doplnit „ne pro `project-*` repa, tam `project-os`".
- Hooky ze sekce 5b automation designu (ochrana `40-done/`, `03-context/`, journal připomínka) mohou přijít v `template/.claude/settings.json` jako druhá iterace; do první verze pluginu nepatří.

## Pořadí stavby

1. `project-standard` + `template/` (přesun draftu, CHANGELOG v2) — nejvyšší hodnota, žádná logika.
2. `new-project` (ověřit na dalším novém projektu).
3. `delivery-item` (ověřit na prvním reálném D001 v med-elektronic-systems nebo hf-design).
4. `project-audit`.
5. `migrate-project` (až bude další legacy složka k přenosu).

Marketplace: nový záznam `project-os` v `.claude-plugin/marketplace.json`, verze 0.1.0.

## Otevřené otázky

1. Jméno pluginu: `project-os`, nebo `datawizard-projects`?
2. Šablona v pluginu vs. samostatné template repo (doporučení výše).
3. Co s `workspace-docs-setup`: zúžit, nebo deprecatovat?
4. Má být `project-standard` samostatný skill, nebo `rules/` soubor v pluginu načítaný přes CLAUDE.md (jako `datawizard-core/rules/`)? Doporučení: skill, protože se má číst jen v projektových repech, ne v každé session.
