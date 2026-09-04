---
title: Git workflow
date: 2026-08-25
---

# Git workflow

## Jádro

- `main` je vždy platný, odsouhlasený stav. Nikdo v něm nepracuje napřímo.
- Větve: člověk `feature/D00X-nazev` nebo `fix/<popis>`, agent `agent/D00X-nazev`. Kebab-case bez diakritiky, vždy s ID, po merge smazat.
- Commity česky s prefixem ID nebo oblasti: `D004: rozpad tasků`, `journal: zápis 2026-08-24`.
- `--force` do main nikdy.

## Co smí přímo do main

Drobnosti, u kterých je PR jen zdržení:

- převzetí itemu (přesun do `30-in-progress/`)
- otázka v `otazky.md`
- řádek do `JOURNAL.md`
- zápis ze schůzky

Když si nejsi jistý, uděláš větev a PR.

## Co jde vždy přes PR

- přesun itemu do `40-done/`
- cokoli měnící pravidla nebo strukturu repa (`AGENTS.md`, `README.md`, `templates/`)
- změny v `03-context/`
- větší obsahové celky

Merge schvaluje PO.

## Přesuny složek

Přesun itemu mezi lifecycle složkami je **samostatný malý commit pushnutý hned**. Git řeší merge konflikty na přesunech složek mizerně, a čím déle přesun leží nepushnutý, tím větší je šance na kolizi.

## Typické problémy

**Konflikt na přesunu itemu.** Dva lidé přesunuli tentýž item. Vyřeš tak, že se domluvíte, kdo item vlastní podle lifecycle, a ten přesun zopakuje na čistém `main`.

**Zapomenutý řádek v journalu.** Přidej ho samostatným commitem `journal: doplnění YYYY-MM-DD`. Zpětně se řádky nepřepisují.

**Rozjetý DELIVERY.md vs. obsah složek.** Zdroj pravdy je **umístění souboru**, ne index. Oprav index podle složek.
