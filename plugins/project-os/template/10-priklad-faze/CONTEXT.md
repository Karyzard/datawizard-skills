---
title: Příklad fázové složky
date: 2026-08-25
---

# 10-<faze>

Příkladová kostra. Při zakládání projektu přejmenuj na reálnou fázi (`10-admin-app/`, `11-mobile-app/`, `20-<etapa>/`) nebo smaž.

## Účel

Jedna složka = jedna aplikace nebo etapa projektu.

## Doporučená kostra

| Podsložka | Co sem jde |
|---|---|
| `01-spec/` | zadání a specifikace fáze |
| `02-zdrojove-dokumenty/` | podklady, ze kterých spec vznikl |
| `03-features/` | rozpad na funkčnosti |
| `04-prototype/` | prototypy a mockupy |
| `05-user-testing/` | scénáře a výstupy testování |

## Workflow

Zakládá a spravuje PO. Znalost, která platí napříč fázemi, sem nepatří, patří do `03-context/`.
