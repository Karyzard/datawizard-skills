---
title: Standard projektového repa (template-project v2)
date: 2026-09-04
source: OneDrive Hub - Dokumenty/01_Projekty/Datawizard-AI-Hub/2026-07-14-datawizard-github-team-structure-design.md (sekce 3 a 3b, stav updated 2026-08-25)
---

# Standard projektového repa

Doslovný výtah závazné části metodiky. Rozhodnutí a historie zůstávají v původním dokumentu; tady je jen to, podle čeho se v repu pracuje. Změna standardu = změna tady + řádek do `template/CHANGELOG.md`.

Šablona: `plugins/project-os/template/` (verze v `template/CHANGELOG.md`, projekt ji nese v `project.yaml` jako `template_version`).

## Cílová architektura

```
GitHub org: DatawizardCZ
│
├── datawizard-os            (private) firemní operační systém — týmová vrstva
├── datawizard-crm           (private) klientská báze
├── datawizard-skills        (public)  plugin marketplace (Claude Code / Cursor)
├── (šablona projektového repa žije v datawizard-skills/plugins/project-os/template/, rozhodnutí 2026-09-04)
│
├── project-<slug>           (private) 1 projekt = 1 repo (docs: PM + kontext + delivery itemy) — jen tým
├── hub-<klient>             (private) klientský hub — sdílený prostor PO ↔ klient (klient MÁ přístup)
└── app-*, web-*             kódová repa (beze změny, zůstávají oddělená)
```


## 3. `template-project` — šablona projektového repa

Kompletní spec šablony. Kombinace tří ověřených zdrojů: OneDrive `2026-feos-apps` (PM/kontext vrstva + číslování složek), `project-feos` (handover mechanika balíčků) a `project-med-hub` (řídicí vrstva: journal, decision log, osobní složky, matice rolí, git workflow). Týmové projektové repo je interní; klient vidí jen klientskou plochu (sekce 3.7). Jazyk obsahu čeština, názvy souborů a složek kebab-case bez diakritiky.

```
template-project/
├── README.md, AGENTS.md, CLAUDE.md (@AGENTS.md), ONBOARDING.md, 00-kickoff.md
├── ROADMAP.md             priority + decision log (append-only, píše jen PO)
├── DELIVERY.md            index otevřených delivery itemů podle vlastníka
├── JOURNAL.md             append-only deník; zápis ve stejném commitu jako změna
├── project.yaml           MANIFEST — strojově čitelná identita projektu (viz níže)
├── templates/             šablony: item-light, item/ (zadani, otazky, tasks, podklady), handoff, CONTEXT, zapis
├── 00-inbox/
├── 01-communications/     01-meetings/ (cíl Fireflies pipeline), 02-messages/, 03-releases/
├── 02-project-mgmt/       timeline, budget, handoffs — PROVOZNÍ ŘÍZENÍ
├── 03-context/            znalostní báze projektu — JEDINÝ zdroj pravdy (+ way-of-working/git-workflow.md)
├── 04-client-hub/         KLIENTSKÁ PLOCHA vč. úkolů na klienta (jen klient bez hub-<klient> repa)
│                          ukoly/ 10-open → 20-sent → 30-done; deploy publikuje jen odeslané; kurátoruje PO
├── 10..39-<faze>/         fázové složky projektu, spravuje PO
├── 40-delivery/           HANDOVER TÝMU: 10-draft → 20-ready → 30-in-progress → 40-done
│                          item D00X: light = jeden soubor, full = složka (zadani, otazky, tasks, podklady)
├── 50-<jmeno>/            osobní skicák člena týmu — píše jen vlastník, nic tam není závazné
├── 60-testing/, 70-research/, 90-backlog/   (volitelné, zakládají se při potřebě)
└── 99-archive/            read-only
```

### 3.1 Číslování složek

Kořenové soubory = řízení, číslované složky = obsah. Číslo vyjadřuje vrstvu; desítkové kroky nechávají prostor na mezistavy a rezervy.

| Rozsah | Vrstva | Kdo spravuje |
|---|---|---|
| 00–09 | sdílená vrstva: kontext, komunikace, řízení — čte celý tým | PO (03-context jen po schválení) |
| 10–39 | fázové složky projektu (aplikace, etapy) | PO |
| 40–49 | delivery (handover týmu) | lifecycle pravidla (3.5) |
| 50–59 | osobní složky členů týmu | každý svou |
| 60–89 | podpora: testing, research, rezerva | dle CONTEXT.md složky |
| 90–98 | produktové artefakty (backlog) | PO |
| 99 | archiv | nikdo nemaže, jen přesun dovnitř |

Každá top-level složka má `CONTEXT.md` (účel, co sem patří / nepatří, workflow). Chronologické věci se neprefixují čísly, ale datem: `YYYY-MM-DD-tema/`.

### 3.2 Root řídicí soubory — čtyři místa řízení

Nemíchat je; každé odpovídá na jinou otázku:

| Soubor | Otázka | Kdo píše |
|---|---|---|
| `ROADMAP.md` — Aktuální priority | co je teď důležité | jen PO |
| `ROADMAP.md` — Decision log | proč to tak je | jen PO |
| `DELIVERY.md` | co se má udělat a kdo to má | PO zakládá, vlastníci aktualizují svoje řádky |
| `JOURNAL.md` | co se stalo | všichni průběžně |

**JOURNAL.md** — append-only, nejnovější nahoře; existující řádky se nikdy nepřepisují ani nemažou. **Pravidlo zápisu: kdo udělá viditelnou změnu, přidá řádek ve stejném commitu.** Tím je zápis „automatický": je součástí definice hotové práce, pro lidi i agenty. Formát: `- YYYY-MM-DD — kdo — co se stalo` + odkaz na soubor/item; agentem psaný řádek se značí `kdo (agent)`. Nepatří sem obsah schůzek (→ 01-communications), úkoly (→ delivery) ani mechanické commity.

**Decision log** (sekce v ROADMAP.md) — append-only, nové nahoru, formát `YYYY-MM-DD — rozhodnutí, protože důvod` + do kterých souborů promítnuto. Vstupní filtr: jen rozhodnutí měnící **scope, priority nebo strukturu repa**. Je záměrně oddělený od journalu: v jedné časové ose by se rozhodnutí utopila v provozních záznamech.

**DELIVERY.md** — index otevřených itemů podle vlastníka (`## Karel (PO)`, `## <dev>`, `## Nepřiřazené`). Řádek: `- [ ] **D00X** Název — odkaz (od YYYY-MM-DD)`; blokovaný item dostane ⛔ + důvod. Uzavřený item se z indexu maže (odkaz na `40-done/` je na konci souboru). Index nikdy nesmí ukazovat jinam než složky — aktualizace indexu je součást commitu, který mění stav itemu.

### 3.3 Sdílená vrstva 00–09

- **`00-inbox/`** — staging pro cokoli bez jasného místa. Zpracování = přesun na správné místo, ne kopie.
- **`01-communications/`** — `01-meetings/YYYY-MM-DD-tema/` (zápis + originální přepis; cíl Fireflies pipeline), `02-messages/` (e-maily a zprávy převedené do md), `03-releases/` (release notes a komunikace k nasazením), `04-open-questions/`.
- **`02-project-mgmt/`** — `spec/` (timeline, MoSCoW scope, RACI, risks, komunikační plán), `daily-ops/` (budget, handoffs, případný kanban). Provozní řízení, spravuje PO.
- **`03-context/`** — znalostní báze a jediný zdroj pravdy projektu (vize, datový model, procesy, pravidla, design). Přebírá wiki konvence (wikilinky mezi stránkami, `index.md` katalog, LINT kontrola driftu) — samostatná wiki struktura v projektu nevzniká (rozhodnutí 10). Podsložka `way-of-working/` s `git-workflow.md`. Mění se jen po schválení PO. Delivery itemy na kontext **odkazují, nikdy ho nekopírují** (lekce FEOS: datový model existoval 4×). Pokud znalost žije v externím zdroji pravdy (vault klienta), odkazuje se tam.
- **`04-client-hub/`** — klientská plocha, jediné rozhraní na klienta v repu: úkoly a otázky NA klienta (`ukoly/` s lifecycle `10-open → 20-sent → 30-done`, vzor FEOS `80-klient-task`) + agenda, prototypy, changelog; detail v 3.7. Existuje-li `hub-<klient>` repo, tahle složka se v projektu nezakládá (plocha vč. úkolů žije v hubu). Klientské výstupy nemají vlastní top-level složku: žijí ve fázových složkách, release komunikace v `01-communications/03-releases/`.

### 3.4 Fázové složky 10–39

Jedna složka = jedna aplikace nebo etapa projektu (`10-admin-app/`, `11-mobile-app/`, `20-<dalsi-etapa>/`). Zakládá a spravuje PO. Doporučená vnitřní kostra (podle FEOS): `01-spec/` → `02-zdrojove-dokumenty/` → `03-features/` → `04-prototype/` → `05-user-testing/`. Šablona obsahuje jeden příkladový adresář s CONTEXT.md; reálné fáze se zakládají per projekt.

### 3.5 `40-delivery/` — handover týmu

Sloučení feosích packages a med-hubích tasků do jednoho systému (rozhodnutí 8). Jedna ID řada, jeden lifecycle, jeden index.

| Složka | Význam | Kdo sem sahá |
|---|---|---|
| `10-draft/` | PO si ujasňuje zadání | jen PO |
| `20-ready/` | připraveno k převzetí, sekce „Vyjasnit před začátkem" je prázdná | jen PO (výjimka: kdokoli smí založit otazky.md) |
| `30-in-progress/` | vlastník převzal a pracuje | vlastník itemu |
| `40-done/` | nasazeno/hotovo a ověřeno | nikdo; přesun dovnitř jen přes PR |

Stav = umístění. Převzetí: přesun do `30-in-progress/` + `owner:` do frontmatteru, jeden commit přímo do main (`D00X: převzetí (jmeno)`). Uzavření: splněná kritéria Hotovo když → PR s přesunem do `40-done/`, merge schvaluje PO. U light itemu s triviálním rozsahem může PO povolit uzavření bez PR. Reopen neexistuje: chyba nalezená po uzavření = nový item s odkazem na původní.

**Item: light vs. full.** **ID je identita, složka je stav.** ID `D00X` přiděluje PO (nejvyšší použité +1, včetně `40-done/`), nikdy se nerecykluje a nese se do commitů, větví a zápisů.

- **Light item = jeden soubor** `D00X-nazev.md`: frontmatter (`title, date, owner, status`) + sekce **Zadání** (1–3 věty, píše PO) / **Instrukce** (kroky, přístupy; neznámé = `<doplnit>` a item je blokovaný) / **Hotovo když** (ověřitelné checkboxy, „ne pocit") / **Výsledek** (vyplní řešitel: co udělal, kde to je, na co narazil — nemaže se, je to paměť projektu) / **Poznámky**.
- **Full item = složka** `D00X-nazev/`: `zadani.md` (Kontext → Cílový proces → Konkrétní úkoly `D00X.1…` → ⚠️ Vyjasnit před začátkem → Acceptance kritéria) + `otazky.md` (dialog dev ↔ PO, formát Q/A s datem a ✅) + `tasks.md` (rozpad na checkboxy, píše vlastník) + `podklady/` (přílohy; co nepatří do repa, se jen odkáže) + volitelně `rozhodnuti-log.md` (per-item decision log s kolonkou „Promítnuto do zadání") a `handoff.md` (předávka rozdělané práce: Stav / Co ověřit / Náměty).
- **Light → full:** ze souboru se stane složka se `zadani.md`, ID zůstává. Žádný obřad povýšení, žádné druhé ID.

**Blokace otázkou:** item se kvůli otázkám nikam nestěhuje (žádný mezistav „needs-clarification"). Nezodpovězená otázka v `otazky.md` = item fakticky blokovaný na dotčených částech; v DELIVERY.md dostane ⛔. Odpovědi píše jen PO.

**Souběh:** přesun itemu mezi složkami = samostatný malý commit pushnutý hned (přesuny složek se v merge konfliktech řeší mizerně); přesun dělá ten, kdo item podle lifecycle vlastní.

### 3.6 `50-<jmeno>/` — osobní složky

Každý člen týmu má vlastní složku (`50-karel/`, `50-prokop/`, …). Pravidla z med-hubu:

- Píše sem **jen vlastník** (a agent, kterého vlastník spustil). Ostatní jen čtou, nikdy needitují.
- Žádná povinná struktura, žádný lifecycle: je to skicák. Nic tady není závazné ani odsouhlasené; zdroj pravdy jsou delivery itemy, `03-context/` a `ROADMAP.md`.
- Když věc dozraje, přesune se na správné místo (`00-inbox/`, `03-context/`, návrh itemu). Do `40-delivery/10-draft/` smí destilát poslat jen PO; ostatní ho předají PO nebo dají do inboxu.

Číslo 50 je pro všechny osobní složky stejné; mezera 41–49 a 51–59 je rezerva.

### 3.7 Klientská plocha — co a jak sdílet s klientem

Klient má vidět kurátorovaný výřez projektu, ne týmové repo. Kde plocha žije, se řídí klientem (rozhodnutí 2026-08-24, „kombinace dle klienta"):

- **Klient s `hub-<klient>` repem** (umí GitHub, např. MED Elektronik): plocha žije v hubu, per klient napříč projekty. V projektovém repu se `04-client-hub/` nezakládá — i úkoly na klienta žijí v hubu.
- **Klient bez hub repa** (např. FWC): plocha = `04-client-hub/` v projektovém repu. Klient do repa nevidí, vidí jen web vygenerovaný deployem (vzor FEOS `80-klient-task/fwc` Netlify rozcestník, med-hub `07-hub`).

**Standardní kostra plochy je v obou režimech stejná** (jedna šablona, dva domovy). Úkoly na klienta jsou její součástí — žádná oddělená složka a projekce, zdroj pravdy je přímo tady:

```
<plocha>/
├── index.html / deploy.sh   # rozcestník + skládaný deploy na Netlify (vzor med-hub 07-hub)
├── co-je-noveho.md          # changelog pro klienta
├── ukoly/                   # úkoly a otázky NA klienta (vzor FEOS 80-klient-task)
│   ├── 10-open/             #   PO připravuje — NEdeployuje se
│   ├── 20-sent/             #   odesláno klientovi — deployuje se
│   └── 30-done/             #   vyřízeno — deployuje se (archiv pro klienta)
├── agenda/                  # přípravy a agendy schůzek (PŘED schůzkou; zápisy PO schůzce jsou interní)
├── prototypy/               # prototypy schválené k připomínkám
├── milniky.md               # kurátorovaná roadmapa bez interních detailů (budget, kapacity)
└── jak-hlasit.md            # intake instrukce: kam poslat bug, nápad, dotaz
```

Pravidla:

- **Jednosměrný tok, kurátoruje PO.** Obsah se na plochu dostává vědomým výběrem z projektu (skill `/share-to-client` v backlogu; do té doby ručně). Nikdy se nesdílí odkazem dovnitř týmového repa.
- **Co je nového:** zdroj = release notes (`01-communications/03-releases/`) + uzavřené delivery itemy ve `40-done/`. Agent navrhne text, PO schválí a publikuje. Formát: datovaný blok „přibylo / opravilo se / co přijde dál", nejnovější nahoře. Není to journal — žádné interní provozní záznamy.
- **Publicita** (med-hub pravidlo): na plochu nikdy částky, rozpočty, interní IP/servery/přístupy, osobní údaje, nic o jiných klientech. Před každým deployem projít diff plochy.
- `ukoly/` nese lifecycle přímo: deploy publikuje jen `20-sent/` a `30-done/`, nikdy `10-open/` (rozpracované návrhy jsou interní, dokud je PO neodešle). Před odesláním deduplikovat průřezové otázky (lekce FEOS). U hub-repo klienta vidí klient i `10-open/` — do rozpracovaných úkolů proto nepatří nic citlivého.

### 3.8 Role a práva (matice do AGENTS.md)

| Role | Smí | Nesmí |
|---|---|---|
| **PO** | vše; jediný mění ROADMAP.md, obsah `10-draft/` a `20-ready/`, `03-context/`, přiděluje ID | — |
| **Člen týmu (dev)** | převzít item z `20-ready/`; editovat `tasks.md`, `otazky.md`, `podklady/`, Výsledek a checkboxy **svého** itemu; svou `50-<jmeno>/`; přidávat do JOURNAL.md; PR do `40-done/` | měnit `zadani.md` převzatého itemu (to dělá PO); sahat do `10-draft/`, cizích itemů, cizích 50-složek; přepisovat cizí řádky v DELIVERY.md; měnit nebo deployovat `04-client-hub/` (kurátoruje PO) |
| **AI agent** | pracovat jen v itemu ve `30-in-progress/`, jehož `owner` = člověk, který ho spustil (větev `agent/D00X-…`); v 50-složce svého spouštěče; **přidat** řádek do JOURNAL.md; zapsat otázku do `otazky.md` (ne odpověď) | měnit ROADMAP.md, README.md, AGENTS.md, `10-draft/`, `20-ready/`, `40-done/`, `03-context/`, `04-client-hub/` (návrh obsahu jen na výzvu PO, deploy nikdy), cizí itemy a 50-složky; přesouvat itemy mezi lifecycle složkami z vlastní iniciativy; přepisovat či mazat řádky v JOURNAL.md; mazat v `99-archive/`; přidělovat nebo měnit ID |

Zadání se interpretuje doslovně; nejasnost → `otazky.md`, ne domýšlení. Onboarding developera = `ONBOARDING.md` repa (nahrazuje typ obsahu `91-dan/`).

### 3.9 `templates/` v šabloně

`item-light.md` · `item/` (`zadani.md`, `otazky.md`, `tasks.md`, `rozhodnuti-log.md`, `podklady/.gitkeep`) · `handoff.md` · `CONTEXT.md` · `zapis.md` (zápis ze schůzky) · `agenda.md` (příprava schůzky). Šablony jsou kopírovací kostry; reálné soubory je smí přerůst, ale nové povinné sekce se propisují zpět do šablony.

### 3.10 Git workflow

Detail v `03-context/way-of-working/git-workflow.md` (převzít z med-hubu včetně troubleshootingu). Jádro:

- `main` je vždy platný, odsouhlasený stav; nikdo v něm nepracuje napřímo. Branch protection na main (viz sekce 9–10).
- Větve: člověk `feature/D00X-nazev` nebo `fix/<popis>`, agent `agent/D00X-nazev`. Kebab-case bez diakritiky, vždy s ID, po merge smazat.
- Výjimka pro drobnosti přímo do main: převzetí itemu, otázka v `otazky.md`, řádek do journalu, zápis ze schůzky. Když si nejsi jistý → větev + PR.
- Vždy přes PR: přesun do `40-done/`; cokoli měnící pravidla nebo strukturu repa (AGENTS.md, README.md, šablony); větší obsahové celky. Merge schvaluje PO.
- Commity česky s prefixem ID nebo oblasti (`D004: rozpad tasků`, `journal: zápis 2026-08-24`). `--force` do main nikdy.

### 3.11 `project.yaml` — mapování projekt ↔ code repa ↔ klient

Projektové (docs) repo a kódová repa jsou vždy oddělená; vazbu drží manifest v rootu projektového repa:

```yaml
project_id: 26-001                   # evidenční číslo z registru v datawizard-crm (YY-NNN)
client: fwc                          # slug klienta v datawizard-crm
status: active                       # active | paused | done | archived
template_version: 1                  # verze template-project, ze které repo vzniklo
code_repos:
  - DatawizardCZ/feos-admin-app
  - DatawizardCZ/feos-mobile-client
  - DatawizardCZ/feos-mobile-trainer
assets_vault: "https://<tenant>.sharepoint.com/.../2026-feos-apps"   # sdílený SharePoint URL
```

Doplňkově GitHub topics na kódových repech (`project-feos`, `client-fwc`), takže `gh repo list DatawizardCZ --topic project-feos` vrátí vše k projektu strojově. Manifest čtou: dashboard generátor, `/new-project` a `/link-repo` skills, agenti (routing „kam patří tenhle bug"). CRM `projects.md` zůstává lidský index; `project.yaml` je zdroj pravdy pro stroje.

- **Assets vault vždy jako sdílený SharePoint URL**, ne lokální OneDrive cesta — lokální cesta je u každého člena týmu jiná a agenti na ni nedosáhnou.
- **Slug se po založení nemění.** Přejmenování klienta/projektu = řízená procedura (skill `/rename`, backlog): přejmenovat repo (GitHub redirect), přepsat topics, `project.yaml`, složku v CRM a odkazy — nikdy ručně po kouskách.
- **Template je copy-once** — oprava v `template-project` se do existujících rep nepropíše sama. `template-project` vede CHANGELOG s verzemi, `project.yaml` nese `template_version`; dashboard hlásí projekty se zastaralou šablonou a upgrade se dělá vědomě přes PR (ručně nebo agentem).

### 3.12 Evidenční číslo projektu (číselník)

Každý projekt dostává při kickoffu evidenční číslo **`YY-NNN`** (rok zahájení + pořadí v roce, např. `26-001`). Pravidla:

- Přiděluje se z registru **`registr-projektu.md` v `datawizard-crm`** (tabulka: číslo, klient, slug, název, stav, odkaz na repo). Nejvyšší použité +1 v daném roce; číslo se **nikdy nerecykluje** ani po zrušení projektu.
- Číslo se propisuje do: `project.yaml` (`project_id: 26-001`), názvu assets vault složky (`26-001-feos-apps`), GitHub topicu (`prj-26-001`), nabídek a fakturačních podkladů.
- **Jméno repa číslo neobsahuje** — zůstává `project-<slug>` (sluggy se nemění a čísla by je udělala kryptickými; vazbu drží manifest, topic a registr).
- Přiděluje skill `/new-project` (zapíše do registru i manifestu), aby číslování nestálo na disciplíně.
- **Prvotní naplnění registru:** při založení `datawizard-crm` (krok 1 migrace) se registr zpětně naplní existujícími projekty (FEOS, MED hub, JR servis…), aby čísla odpovídala realitě.

**Postup založení nového projektu** (cílově celé dělá skill `/new-project`; do jeho vzniku ručně podle stejného checklistu):

1. **Číslo:** otevřít `datawizard-crm/registr-projektu.md`, nejvyšší `YY-NNN` aktuálního roku +1, zapsat řádek (číslo, klient, slug, název, stav `active`, odkaz na repo).
2. **Repo:** `gh repo create DatawizardCZ/project-<slug> --template DatawizardCZ/template-project --private` — struktura ze šablony přijde sama.
3. **Manifest:** vyplnit `project.yaml` (`project_id`, `client`, `status`, `template_version`, později `code_repos` a `assets_vault`) + `00-kickoff.md`.
4. **Topics:** `prj-YY-NNN`, `client-<slug>` (stroje pak projekt najdou přes `gh repo list --topic`).
5. **CRM:** řádek do `clients/<klient>/projects.md`.
6. **Assets vault:** založit SharePoint složku `YY-NNN-<slug>` a URL zapsat do manifestu.
7. **Lidé a stroje:** pozvat tým, spustit seed agenta, naklonovat lokálně dle org mirror konvence (sekce 3b).

### 3.13 Údržba a konzistence

- **Maintenance checklist** (na konci AGENTS.md): při změně struktury složek aktualizovat zároveň AGENTS.md (mapa + routing), README.md (tabulka struktury), dotčené CONTEXT.md a přidat řádek do JOURNAL.md. Spouští se i příkazem `/sync-docs`.
- README.md nese self-maintenance checklist a stavovou tabulku fází s datem poslední aktualizace (lekce FEOS: stavové tabulky driftovaly o 4 měsíce).
- Mapa složek žije primárně v AGENTS.md; README na ni odkazuje, ať se neudržuje dvakrát (lekce med-hub: dvojitá mapa = dvojitá údržba).
- **Reopen:** bug nalezený po dodání item nereotevírá — vzniká nový item (nebo Issue) s odkazem na původní ve `40-done/`; `40` zůstává neměnný archiv.
- Doc-consistency agent (sekce 9) hlídá drift AGENTS/README/CONTEXT a DELIVERY.md ↔ obsah lifecycle složek.

### 3.14 Co ze zdrojů vědomě nepřebíráme

- **Med-hubí model „veřejné složky rozeseté ve struktuře"** (`01-meetings` a `06-prototypes` veřejné vedle interních) — klientská plocha je soustředěná na jednom místě (`04-client-hub/`, sekce 3.7), případně mimo repo v `hub-<klient>`; interní prototypy žijí ve fázových složkách.
- **TASKS.md + ROADMAP jako dva indexy práce** — nahrazeno jedním DELIVERY.md (priority zůstávají v ROADMAP.md).
- **Dvě ID řady P/T** — nahrazeno jednou řadou D s light/full itemy.
- **Kopie kontextu v repu (feos `context/` se `synced:` frontmatterem)** — v cílovém stavu je `03-context/` v repu jediný zdroj pravdy, žádná synchronizovaná kopie z OneDrive (OneDrive je po cutoveru read-only, viz postup migrace).

Nový projekt = skill `/new-project` (kopie `template/` + seed) + vyplnit `00-kickoff.md`. Rozhodnutí 2026-09-04: šablona žije v pluginu `project-os`, samostatné repo `template-project` se nezakládá.

## 3b. Lokální workspace — konvence „org mirror"

Repa jsou na GitHubu oddělená (kvůli přístupům, rozhodnutí 7), ale lokálně žijí v jedné rodičovské struktuře pod `~/dev/`, kterou se otevírá editor/agent (Claude Code, Codex, Cursor). Konvence se jmenuje **org mirror**: lokální strom zrcadlí GitHub org, rozdělený do čtyř větví podle typu repa.

**Pravidlo jednou větou:** lokální cesta = `~/dev/<větev>/<jméno-repa>`; jméno složky = jméno repa (nikdy se nepřejmenovává) a větev se odvozuje z prefixu jména repa.

```
~/dev/
├── datawizard/    ← firemní jádro: datawizard-os, datawizard-crm, datawizard-skills, template-project
├── projects/      ← týmová projektová repa (project-*) — klient NEMÁ přístup
├── hubs/          ← klientské huby (hub-*) — sdílený prostor PO ↔ klient, klient MÁ přístup
├── code/          ← kódová repa (app-*, web-*)
└── ...            ← osobní a ne-org věci mimo zrcadlo
```

Mapování prefix → větev: `datawizard-*` a `template-*` → `datawizard/`, `project-*` → `projects/`, `hub-*` → `hubs/`, `app-*` a `web-*` → `code/`.

- Rozdělení `projects/` vs. `hubs/` není kosmetika: jde o dvě trust zóny. Do hubu klient vidí, do projektového repa ne. Lokální strom to drží viditelné i při práci.
- Agent se otevírá nad `~/dev/` (nebo nad konkrétní větví). Pocit „jednoho celku" vzniká tady, ne slučováním rep.
- Skill **`/workspace-sync`**: projde `gh repo list DatawizardCZ`, chybějící repa naklonuje do správné větve podle prefixu, existující pullne. Jeden příkaz, všechno aktuální. Každý člen týmu si syncne jen repa, kam má přístup; nic se nerozbije tím, že na CRM nedosáhne.
- Konvence pro tým do `datawizard-os/05-navody/` (součást GitHub workflow návodu).
- **Migrace u Karla:** dnešní `~/dev/_project-repos/` a org repa roztroušená v `~/dev/_app-projects/` (datawizard-os, datawizard-skills…) se postupně přesunou do větví výše; ne-org a osobní věci v `_app-projects/` zůstávají mimo zrcadlo. `med-elektronik-hub` a `project-med-hub` jsou oba klientské huby MED Elektronik → `hubs/` (viz otevřený bod ke konsolidaci níže).

