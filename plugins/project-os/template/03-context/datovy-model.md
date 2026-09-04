---
title: Datový model
date: <YYYY-MM-DD>
status: draft
---

# Datový model

**Jediné místo, kde datový model žije.** Delivery itemy a fázové specifikace sem odkazují, nikdy nekopírují. Duplikovaný datový model je nejdražší chyba, kterou tenhle systém umí udělat.

## Entity

### <Entita>

| Pole | Typ | Povinné | Popis |
|---|---|---|---|
| `id` | <typ> | ano | <popis> |
| <pole> | <typ> | ano / ne | <popis> |

**Vazby:** <na které entity a jakou kardinalitou>

## Diagram

```
<entita> ──1:N── <entita>
```

## Rozhodnutí o modelu

Append-only. Změna datového modelu je rozhodnutí, patří i do decision logu v `ROADMAP.md`.

- `<YYYY-MM-DD>` — <co se rozhodlo>, protože <důvod>

Souvisí: [[vize]] · [[pravidla]]
