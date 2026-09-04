---
title: Delivery
date: 2026-08-25
---

# 40-delivery

## Účel

Handover týmu. Jedna ID řada `D00X`, jeden lifecycle, jeden index (`DELIVERY.md` v rootu).

## Lifecycle — stav je umístění

| Složka | Význam | Kdo sem sahá |
|---|---|---|
| `10-draft/` | PO si ujasňuje zadání | jen PO |
| `20-ready/` | připraveno k převzetí, sekce Vyjasnit před začátkem je prázdná | jen PO; kdokoli smí založit `otazky.md` |
| `30-in-progress/` | vlastník převzal a pracuje | vlastník itemu |
| `40-done/` | nasazeno a ověřeno | přesun dovnitř jen přes PR |

## Light vs. full item

**ID je identita, složka je stav.** ID přiděluje PO (nejvyšší použité +1, včetně `40-done/`), nikdy se nerecykluje a nese se do commitů, větví a zápisů.

- **Light** = jeden soubor `D00X-nazev.md` ze `templates/item-light.md`.
- **Full** = složka `D00X-nazev/` ze `templates/item/`.
- **Povýšení light na full:** ze souboru se stane složka se `zadani.md`, ID zůstává. Žádný obřad, žádné druhé ID.

## Pravidla

- **Blokace otázkou:** item se nikam nestěhuje. Nezodpovězená otázka v `otazky.md` = fakticky blokovaný item, v DELIVERY.md dostane ⛔.
- **Převzetí:** přesun do `30-in-progress/` + `owner:` do frontmatteru, jeden commit přímo do main.
- **Uzavření:** PR s přesunem do `40-done/`, merge schvaluje PO. U light itemu s triviálním rozsahem může PO povolit uzavření bez PR.
- **Reopen neexistuje.** Chyba nalezená po uzavření zakládá nový item s odkazem na původní. `40-done/` je neměnný archiv.
- **Souběh:** přesun mezi složkami je samostatný malý commit pushnutý hned; dělá ho ten, kdo item podle lifecycle vlastní.
- **Sekce Výsledek se nemaže.** Je to paměť projektu.
