---
title: Katalog znalostní báze
date: <YYYY-MM-DD>
---

# Index

Katalog stránek v `03-context/`. Jedna stránka = jeden řádek. Kdo zakládá stránku, přidá řádek ve stejném commitu.

| Stránka | O čem to je | Stav | Aktualizováno |
|---|---|---|---|
| [[vize]] | proč produkt existuje, pro koho, hranice rozsahu | draft | `<YYYY-MM-DD>` |
| [[datovy-model]] | entity, pole, vazby | draft | `<YYYY-MM-DD>` |
| [[procesy]] | jak věci fungují v doméně | draft | `<YYYY-MM-DD>` |
| [[pravidla]] | doménová pravidla a hraniční případy | draft | `<YYYY-MM-DD>` |
| [[design]] | vizuální a interakční pravidla | draft | `<YYYY-MM-DD>` |

## Konvence

- Stránky se odkazují wikilinky `[[nazev-stranky]]`, název odpovídá jménu souboru bez přípony.
- Odkaz na neexistující stránku je v pořádku, značí, že stránka teprve vznikne.
- Znalost existuje **jednou**. Když ji potřebuješ jinde, odkážeš se.
- `way-of-working/` drží, jak se pracuje v repu. Doménová znalost je zbytek téhle složky.

## LINT

Kontrola driftu: každá stránka má řádek v indexu, každý řádek indexu má stránku, žádná znalost neexistuje dvakrát. Když se stránka mění, mění se i datum v indexu.
