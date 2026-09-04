---
title: AGENTS — routing a pravidla repa
date: 2026-08-25
---

# AGENTS.md

Pravidla pro lidi i agenty v tomhle repu. Platí i pro `CLAUDE.md` (je to jen wrapper) a pro Cursor.

Jazyk obsahu je čeština. Názvy souborů a složek kebab-case bez diakritiky.

## Meetings
target: 01-communications/01-meetings/
naming: kebab-case

## Mapa složek a routing

| Kam to patří | Co sem jde | Kdo spravuje |
|---|---|---|
| `00-inbox/` | cokoli bez jasného místa; zpracování = přesun, ne kopie | kdokoli |
| `01-communications/01-meetings/` | `YYYY-MM-DD-tema/` se zápisem a originálním přepisem | kdokoli |
| `01-communications/02-messages/` | e-maily a zprávy převedené do markdownu | kdokoli |
| `01-communications/03-releases/` | release notes a komunikace k nasazením | PO |
| `01-communications/04-open-questions/` | otevřené otázky bez domova v itemu | kdokoli |
| `02-project-mgmt/` | timeline, scope, RACI, rizika, budget, handoffs | PO |
| `03-context/` | znalostní báze, jediný zdroj pravdy | PO (změna jen po schválení) |
| `04-client-hub/` | klientská plocha včetně `ukoly/` (úkoly NA klienta, lifecycle 10-open → 20-sent → 30-done). Existuje-li `hub-<klient>` repo, tahle složka se nezakládá | PO |
| `10-…` až `39-…` | fázové složky projektu (aplikace, etapy) | PO |
| `40-delivery/` | handover týmu, itemy D00X | lifecycle pravidla níže |
| `50-<jmeno>/` | osobní skicák; píše jen vlastník, nic tam není závazné | vlastník |
| `60-testing/`, `70-research/`, `90-backlog/` | podpora; volitelné, nepoužité smazat při zakládání projektu | dle CONTEXT.md složky |
| `99-archive/` | read-only, jen přesun dovnitř | nikdo nemaže |

Číslo `05` je volné jako rezerva. Ve šabloně v1 byly úkoly na klienta ve `04-client-tasks/` a plocha v `05-client-hub/`; od v2 je to jedna složka `04-client-hub/` s podsložkou `ukoly/`.

Každá top-level složka má `CONTEXT.md` s účelem a workflow. Chronologické věci se neprefixují čísly, ale datem: `YYYY-MM-DD-tema/`.

## Čtyři místa řízení

| Soubor | Otázka | Kdo píše |
|---|---|---|
| `ROADMAP.md`, sekce Aktuální priority | co je teď důležité | jen PO |
| `ROADMAP.md`, sekce Decision log | proč to tak je | jen PO |
| `DELIVERY.md` | co se má udělat a kdo to má | PO zakládá, vlastníci aktualizují svoje řádky |
| `JOURNAL.md` | co se stalo | všichni průběžně |

**Pravidlo zápisu do journalu:** kdo udělá viditelnou změnu, přidá řádek ve stejném commitu. Je to součást definice hotové práce, pro lidi i agenty.

## Delivery lifecycle

Stav itemu = jeho umístění. ID `D00X` je identita, přiděluje PO (nejvyšší použité +1 včetně `40-done/`), nikdy se nerecykluje.

| Složka | Význam | Kdo sem sahá |
|---|---|---|
| `10-draft/` | PO si ujasňuje zadání | jen PO |
| `20-ready/` | připraveno k převzetí, sekce Vyjasnit před začátkem je prázdná | jen PO; kdokoli smí založit `otazky.md` |
| `30-in-progress/` | vlastník převzal a pracuje | vlastník itemu |
| `40-done/` | nasazeno a ověřeno | přesun dovnitř jen přes PR |

- **Light item** = jeden soubor `D00X-nazev.md`. **Full item** = složka `D00X-nazev/`. Povýšení light na full nemá obřad, ID zůstává.
- **Převzetí:** přesun do `30-in-progress/` a doplnění `owner:` do frontmatteru, jeden commit přímo do main (`D00X: převzetí (jmeno)`).
- **Uzavření:** splněná kritéria Hotovo když, pak PR s přesunem do `40-done/`, merge schvaluje PO.
- **Blokace otázkou:** item se nikam nestěhuje. Nezodpovězená otázka v `otazky.md` znamená blokovaný item, v DELIVERY.md dostane ⛔. Odpovědi píše jen PO.
- **Reopen neexistuje.** Chyba nalezená po uzavření = nový item s odkazem na původní.
- Přesun mezi složkami je samostatný malý commit pushnutý hned. Merge konflikty na přesunech složek se řeší mizerně.

## Role a práva

| Role | Smí | Nesmí |
|---|---|---|
| **PO** | vše; jediný mění ROADMAP.md, obsah `10-draft/` a `20-ready/`, `03-context/`, přiděluje ID | — |
| **Člen týmu (dev)** | převzít item z `20-ready/`; editovat `tasks.md`, `otazky.md`, `podklady/`, Výsledek a checkboxy **svého** itemu; svou `50-<jmeno>/`; přidávat do JOURNAL.md; PR do `40-done/` | měnit `zadani.md` převzatého itemu; sahat do `10-draft/`, cizích itemů a cizích 50-složek; přepisovat cizí řádky v DELIVERY.md; měnit nebo deployovat `04-client-hub/` |
| **AI agent** | pracovat jen v itemu ve `30-in-progress/`, jehož `owner` je člověk, který ho spustil (větev `agent/D00X-…`); v 50-složce svého spouštěče; **přidat** řádek do JOURNAL.md; zapsat otázku do `otazky.md` | měnit ROADMAP.md, README.md, AGENTS.md, `10-draft/`, `20-ready/`, `40-done/`, `03-context/`, `04-client-hub/`; cizí itemy a 50-složky; přesouvat itemy z vlastní iniciativy; přepisovat či mazat řádky v JOURNAL.md; mazat v `99-archive/`; přidělovat nebo měnit ID |

Zadání se interpretuje doslovně. Nejasnost jde do `otazky.md`, nedomýšlí se.

## Pravidlo odkazuj, nekopíruj

`03-context/` je jediný zdroj pravdy. Delivery itemy na kontext odkazují, nikdy ho nekopírují. Když znalost žije v externím zdroji pravdy (vault klienta), odkazuje se tam.

## Git workflow

Detail v `03-context/way-of-working/git-workflow.md`. Jádro: `main` je vždy platný stav, nikdo v něm nepracuje napřímo; větve `feature/D00X-nazev`, `fix/<popis>`, agent `agent/D00X-nazev`; commity česky s prefixem ID nebo oblasti; `--force` do main nikdy.

## Maintenance checklist

Při změně struktury složek aktualizovat zároveň:

- [ ] `AGENTS.md` — mapa složek a routing
- [ ] `README.md` — tabulka struktury a stavová tabulka fází
- [ ] dotčené `CONTEXT.md`
- [ ] `templates/` — pokud přibyla povinná sekce
- [ ] řádek do `JOURNAL.md`
