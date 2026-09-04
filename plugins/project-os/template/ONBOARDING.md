---
title: Onboarding do projektu
date: 2026-08-25
---

# Onboarding

Čti v tomhle pořadí, zabere to ~20 minut.

1. **`README.md`** — co projekt je a v jaké je fázi.
2. **`00-kickoff.md`** — proč vznikl a co je cílem.
3. **`AGENTS.md`** — kam co patří, kdo co smí, jak funguje delivery lifecycle. Tohle je nejdůležitější.
4. **`03-context/index.md`** — znalostní báze, jediný zdroj pravdy.
5. **`ROADMAP.md`** — co je teď priorita a proč (decision log).
6. **`DELIVERY.md`** — co je otevřené a kdo to má.
7. **`03-context/way-of-working/git-workflow.md`** — jak se tu commituje.

## Než si vezmeš první item

- Založ si `50-<tvojejmeno>/` a dej tam cokoli rozpracovaného. Nikdo tam nesahá a nic tam není závazné.
- Vyber si item z `40-delivery/20-ready/`. Do `10-draft/` nesahej.
- Nejasnost píšeš do `otazky.md` u itemu, nedomýšlíš si. Odpovídá PO.
- Když uděláš viditelnou změnu, přidej řádek do `JOURNAL.md` ve stejném commitu.

## Na co se nejčastěji naráží

- **Kontext se nekopíruje.** Když potřebuješ datový model, odkážeš na `03-context/`, nevytvoříš si vedle vlastní verzi.
- **Stav itemu je jeho složka.** Když na něčem děláš, item musí být v `30-in-progress/`.
- **`40-done/` je archiv.** Bug nalezený po dodání zakládá nový item, starý se neotevírá.
