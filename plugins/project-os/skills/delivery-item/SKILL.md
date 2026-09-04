---
name: delivery-item
description: Use when creating, taking over, questioning, blocking, handing off or closing a delivery item (D00X) in a project repo's 40-delivery/, when DELIVERY.md or JOURNAL.md must be updated for it, or when the user says "založ item", "delivery item", "převzít D00X", "uzavři D00X", "handover pro dev", "balíček pro Prokopa".
---

# delivery-item

Operace nad `40-delivery/`. Stav itemu = složka, ID = identita. Každá operace mění zároveň soubor itemu, `DELIVERY.md` a `JOURNAL.md`, v jednom commitu.

**REQUIRED SUB-SKILL:** `project-standard` (lifecycle 3.5, role 3.8). Kostry ber z `templates/` repa (`item-light.md`, `item/`, `handoff.md`), ne z hlavy.

## Kdo smí co (zkráceně)

| Operace | Kdo | Agent sám? |
|---|---|---|
| založit item, přidělit ID, přesun do `20-ready/` | PO | jen na výzvu PO |
| převzít (→ `30-in-progress/`) | budoucí vlastník | jen na výzvu toho člověka |
| otázka do `otazky.md` | kdokoli | ano |
| odpověď v `otazky.md` | PO | ne |
| uzavřít (→ `40-done/` přes PR) | vlastník, merge PO | připraví PR na výzvu |
| přesun z vlastní iniciativy | nikdo | ne |

Když požadavek přijde od někoho, kdo na operaci nemá právo, skill to řekne a nabídne správnou cestu (otázka, návrh do `00-inbox/`, zpráva PO).

## Operace

**Založit.** ID = nejvyšší použité +1 napříč všemi lifecycle složkami včetně `40-done/` (`ls 40-delivery/*/ | grep -o 'D[0-9]\{3\}' | sort | tail -1`). Light item = soubor `D00X-nazev.md` z `templates/item-light.md`; full = složka z `templates/item/`. Do itemu piš jen to, co PO řekl; Instrukce nedomýšlej, chybějící krok = `<doplnit>`. Zakládá se do `10-draft/`. Do `20-ready/` jde item, když je připravený (full: sekce „Vyjasnit před začátkem" prázdná; light: žádné `<doplnit>` v Instrukcích) a „Hotovo když" je ověřitelné; když PO řekne „rovnou do ready" a item připravený není, ulož ho tam, ale vypiš, co v něm chybí. Řádek do `DELIVERY.md`: pod vlastníka jen když je item převzatý (`owner:` vyplněný), jinak pod Nepřiřazené s poznámkou „určeno pro <jméno>". Formát `- [ ] **D00X** Název — cesta (od YYYY-MM-DD)`. Frontmatter `status:` zrcadlí složku: `draft | ready | in-progress | done`.

**Převzít.** `git mv` do `30-in-progress/`, `owner:` do frontmatteru, `DELIVERY.md` řádek pod nového vlastníka, journal řádek. Commit přímo do main: `D00X: převzetí (jmeno)`.

**Otázka.** Do `otazky.md` (u light itemu povýšit na full: složka + `zadani.md` z původního souboru, ID zůstává). Formát `**Q (jmeno, YYYY-MM-DD):** …`. V `DELIVERY.md` doplnit ⛔ a důvod. Item se nestěhuje.

**Handoff.** `handoff.md` z `templates/handoff.md` (Stav / Co ověřit / Náměty) do složky itemu; řádek do `02-project-mgmt/daily-ops/handoffs.md`.

**Uzavřít.** Podmínka: všechny checkboxy „Hotovo když" zaškrtnuté a sekce Výsledek vyplněná (co, kde, na co narazil). Když to neplatí, nic nepřesouvej a nevyplňuj Výsledek za vlastníka; vypiš, co chybí, a nabídni uzavření po doplnění. Jinak větev `feature/D00X-nazev` → `git mv` do `40-done/`, smazat řádek z `DELIVERY.md`, journal řádek → PR s titulkem `D00X: hotovo`. Merge dělá PO. Uzavření bez PR jen u light itemu, když to PO výslovně povolil.

## Commit a journal

Commit: `D00X: <co>` česky. Journal: `- YYYY-MM-DD — <kdo> (agent) — D00X <co> (<cesta>)`, kde `<kdo>` je člověk, který agenta spustil; nejnovější nahoře, nic se nepřepisuje. Přesun itemu pushni hned, pokud repo má remote; bez remote to napiš do hlášení. Placeholder `<YYYY-MM-DD>` v řádku `date:` souboru, který stejně měníš, nahraď dnešním datem; jiné zbytky šablony nech.

## Červené vlajky

- „Přesunu to rovnou, je to jasné" → ne. Stav mění jen vlastník podle lifecycle.
- „Reopen D003" → neexistuje. Nový item s odkazem na `40-done/D003…`.
- „Doplním zadání sám" → zadání mění jen PO; nejasnost do `otazky.md`.
- „Journal doplním potom" → řádek je součást téhož commitu.
