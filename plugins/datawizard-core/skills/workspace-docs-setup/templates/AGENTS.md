---
title: AGENTS.md — routing pro AI agenty
date: YYYY-MM-DD
status: active
---

# AGENTS.md — {{ Workspace Name }}

> **Účel:** Routing tabulka pro AI agenty — kde co hledat, kam zapisovat. Detail jednotlivých složek je v jejich `CONTEXT.md`.
>
> **Údržba (DŮLEŽITÉ):** Při změně top-level struktury (přidání/přejmenování/odstranění složky) MUSÍŠ aktualizovat:
> 1. tento soubor (sekce „Mapa složek" a „Routovací tabulka")
> 2. [`README.md`](README.md) (sekce „Struktura složky")
> 3. `CONTEXT.md` v dotčené složce (vytvořit/aktualizovat dle šablony [`.claude/templates/CONTEXT.md`](.claude/templates/CONTEXT.md))

## O workspace

{{ 2–3 věty co tento workspace je, kdo v něm pracuje, jaký artefakt produkuje. }}

**Hlavní dokumenty v rootu:**

- [`README.md`](README.md) — přehled pro lidi
- [`ONBOARDING.md`](ONBOARDING.md) — onboarding pro nové členy týmu
- {{ DEVELOPMENT-PROCESS.md, TODO.md, IDEAS.md — pokud existují }}

## Mapa složek (top-level)

| Složka | Obsah | CONTEXT.md |
|---|---|---|
| `00-inbox/` | {{ popis }} | [✓](00-inbox/CONTEXT.md) |
| `01-{{ ... }}/` | {{ popis }} | [✓](01-{{ ... }}/CONTEXT.md) |
| {{ atd. }} | ... | ... |

## Routovací tabulka

| Úkol | Čti / piš | Vyhnout se |
|---|---|---|
| Onboarding pro lidi | `README.md` → `ONBOARDING.md` → `{{ context-folder }}/CONTEXT.md` | — |
| Onboarding pro AI agenta | tento soubor + `CONTEXT.md` cílové složky | duplicitní routování |
| {{ Typický úkol 1 }} | {{ kam }} | {{ čemu se vyhnout }} |
| {{ Typický úkol 2 }} | {{ kam }} | — |
| Neroztříděné vstupy | `00-inbox/` | dlouhodobé skladování zde |
| Historické / archivované | `99-archive/` (read-only) | aktivní úpravy |

## Pravidla pro agenty

1. **Před větší změnou** zkontroluj duplicity — projdi relevantní složky.
2. **Konzistentní názvy souborů**: kebab-case, bez diakritiky v názvech (obsah může být česky).
3. **Při změně top-level struktury** dodržuj checklist v sekci „Údržba" nahoře.
4. **`99-archive/`** je read-only — neupravovat obsah, jen číst.
5. **Sync check** — když uživatel řekne „jsem hotový" nebo „/sync-docs", spusť kontrolu konzistence.

## Self-maintenance — když přidáš/přejmenuješ top-level složku

1. **Vytvoř** `<složka>/CONTEXT.md` podle šablony [`.claude/templates/CONTEXT.md`](.claude/templates/CONTEXT.md)
2. **Aktualizuj** sekci „Mapa složek" v tomto souboru
3. **Aktualizuj** sekci „Routovací tabulka" — přidej řádek pro typický úkol
4. **Aktualizuj** [`README.md`](README.md) — sekce „Struktura složky"
5. **Pokud je relevantní pro onboarding** — aktualizuj [`ONBOARDING.md`](ONBOARDING.md)
