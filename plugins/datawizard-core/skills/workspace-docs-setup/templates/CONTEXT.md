---
title: {{ Název složky — krátce }}
date: YYYY-MM-DD
status: active
---

# {{ slozka-folder-name }} — {{ Název }}

> **Údržba:** Při přidání/přejmenování podsložky aktualizuj sekci „Podsložky". Při změně stavu fáze/projektu aktualizuj „Aktuální stav".

## K čemu složka slouží

{{ 1–3 věty: účel složky, kdo do ní zapisuje, jaký artefakt produkuje. }}

## Aktuální stav ({{ měsíc rok }})

{{ Tabulka nebo bullet list — kde aktuálně jsme. Aktualizovat při změně fáze. }}

| Položka | Stav |
|---------|------|
| ... | ... |

## Podsložky

{{ Tabulka top-level podsložek — co kde je. Aktualizovat při přidání/přejmenování. }}

| Složka | Obsah |
|--------|-------|
| `01-spec/` | ... |
| `02-zdrojove-dokumenty/` | ... |

## Doporučené pořadí čtení

{{ Seznam souborů v pořadí, jak je má číst nový kolega/agent. }}

1. `01-spec/...md` — ...
2. `...`

## Naming konvence

- kebab-case, bez diakritiky v názvech souborů (obsah může být česky)
- Features: `nazev-feature.md`

## Související

- [`../README.md`](../README.md) — workspace přehled
- [`../AGENTS.md`](../AGENTS.md) — routing pro AI agenty
- {{ další relevantní složky / soubory }}

## Typické AI skills

{{ Volitelné — které skills se v této složce typicky používají. }}

- `wireframe-designer` — ...
- `implementation-spec` — ...
