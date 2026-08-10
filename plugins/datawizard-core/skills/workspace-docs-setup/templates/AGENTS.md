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
> 3. `CONTEXT.md` v dotčené složce (vytvořit/aktualizovat dle šablony [`.agents/templates/CONTEXT.md`](.agents/templates/CONTEXT.md))

## O workspace

{{ 2–3 věty co tento workspace je, kdo v něm pracuje, jaký artefakt produkuje. U klientského projektu: workspace je interní zdroj pravdy — klientovi se výstupy předávají jako exportovaný balíček z deliverables, ne sdílením tohoto repa. }}

**Hlavní dokumenty v rootu:**

- [`README.md`](README.md) — přehled pro lidi
- [`00-kickoff.md`](00-kickoff.md) — kickoff seed dokument (vyplnit s klientem, pak naseed-ovat workspace)
- [`ONBOARDING.md`](ONBOARDING.md) — onboarding pro nové členy týmu
- [`TODO.md`](TODO.md) — operativní úkoly
- {{ IDEAS.md, DEVELOPMENT-PROCESS.md — pokud existují }}

## Mapa složek (top-level)

| Složka | Obsah | CONTEXT.md |
|---|---|---|
| `00-inbox/` | Staging neroztříděných materiálů | [✓](00-inbox/CONTEXT.md) |
| `01-{{ ... }}/` | {{ popis }} | [✓](01-{{ ... }}/CONTEXT.md) |
| {{ atd. }} | ... | ... |
| `99-archive/` | Read-only archiv | [✓](99-archive/CONTEXT.md) |

> **Projektové fáze (10+):** pro dedikované fáze/výstupy zakládej složky číslované od `10` výš a doplň je do této mapy.

> **Pozn.:** Tooling dot-složky (`.agents/`, `.claude/`, `.cursor/`, `.github/`, `.vscode/`) nejsou obsahové složky a do této mapy nepatří. Systém AI artefaktů popisuje [`.agents/README.md`](.agents/README.md).

## Routovací tabulka

| Úkol | Čti / piš | Vyhnout se |
|---|---|---|
| Onboarding pro lidi | `README.md` → `ONBOARDING.md` → `AGENTS.md` | — |
| Onboarding pro AI agenta | tento soubor + `CONTEXT.md` cílové složky | duplicitní routování |
| Přidání poznámky ze schůzky | `01-communications/01-meetings/YYYY-MM-DD-nazev/` | inbox (dlouhodobé) |
| Plánování / harmonogram / status | `02-project-mgmt/` | — |
| Příprava cenové nabídky, podklady pro odhad | `02-project-mgmt/nabidky/NAB-NNN-*/` + evidence v `02-project-mgmt/nabidky.md` | export klientovi (interní pricing v `*-INTERNI-*`) |
| Pracovní balíček pro realizaci (zadání pro developera) | `02-project-mgmt/packages/<lifecycle>/` | míchat s nabídkami (nabídka ≠ realizace) |
| Kontext o klientovi / projektu | `03-context/` | — |
| Výstupy a materiály pro klienta | `04-deliverables/` | interní soubory `*-INTERNI-*` |
| {{ Typický úkol 1 }} | {{ kam }} | {{ čemu se vyhnout }} |
| Neroztříděné vstupy | `00-inbox/` | dlouhodobé skladování zde |
| Historické / archivované | `99-archive/` (read-only) | aktivní úpravy |
| **Seed nového workspace z `00-kickoff.md`** | viz sekce „Seed workflow" níže | — |

## Pravidla pro agenty

1. **Před větší změnou** zkontroluj duplicity — projdi relevantní složky.
2. **Konzistentní názvy souborů**: kebab-case, bez diakritiky v názvech (obsah může být česky).
3. **Při změně top-level struktury** dodržuj checklist v sekci „Údržba" nahoře.
4. **`99-archive/`** je read-only — neupravovat obsah, jen číst.
5. **Sync check** — když uživatel řekne „jsem hotový" nebo `/sync-docs`, spusť kontrolu konzistence.
6. **Interní obsah** — soubory `*-INTERNI-*` (ceny, marže, strategie) se **nikdy nesdílí s klientem** ani nekopírují do deliverables; z ostatních dokumentů se na ně jen odkazuje.
7. **Git workflow** — pokud je workspace v gitu: nikdy necommituj přímo do `main` ani `dev`; změny vždy přes PR (viz sekce „Git workflow" níže).

## Seed workflow

Po vyplnění [`00-kickoff.md`](00-kickoff.md) s klientem řekne uživatel: **„Naseed-uj workspace podle 00-kickoff.md"**. Agent dodrží tento postup:

1. **Přečti `00-kickoff.md`.** Identifikuj vyplněná pole v sekcích 1–9.
2. **Pro každý target soubor** (viz seznam níže) přečti současný obsah, najdi generické formulace, které mají být nahrazeny konkrétními hodnotami ze seedu, a navrhni změny. Uživatel potvrzuje.
3. **Když je v seedu pole nevyplněné**, ponech v target souboru obecnou formulaci (nesnaž se hádat).
4. **Sekce 6.2 (Další lidé v týmu) je volitelná.** Pokud je vyplněná, doplň reference na druhou osobu do `ONBOARDING.md` (sekce ohraničené HTML komentáři `<!-- SECTION: druha-osoba-v-tymu -->`…`<!-- /SECTION -->`). Pokud je smazaná nebo prázdná, odstraň obsah mezi těmito komentáři (komentáře ponech jako kotvy pro budoucí re-seed).
5. **Nahlas souhrn** co jsi změnil v každém souboru.

**Target soubory pro seed:**

| Soubor | Co propsat ze seedu |
|---|---|
| `README.md` | Sekce 1 (klient), 2 (projekt), 3 (služba) → titul, popis, „Aktuální stav" |
| `AGENTS.md` | Sekce 1, 2 → „O workspace"; sekce 8 (interní reference) → „Externí reference" |
| `ONBOARDING.md` | Sekce 1, 2, 3 → „Den 1"; sekce 6.2 (druhá osoba) → kontaktní tabulka a scope |
| `TODO.md` | Sekce 4 (harmonogram) → časové milníky |
| `01-communications/CONTEXT.md` | Sekce 1 (kanály) → „Aktuální stav" |
| `02-project-mgmt/CONTEXT.md` | Sekce 3 (počet bloků), 4 (harmonogram) → struktura projektu |
| `03-context/CONTEXT.md` | Sekce 1, 2, 9 → skeletony `client-persona.md`, `project-brief.md`, `client-environment.md` |
| `04-deliverables/CONTEXT.md` | Sekce 7 (deliverables) → seznam deliverables |

## Git workflow (pokud je workspace v gitu)

> Pokud workspace není git repo, tuto sekci smaž.

### Model větví

```
main  ←──PR──  dev  ←──PR──  feature/* | fix/* | chore/* | docs/* | …
  ↑                                    (běžný vývoj)
  └──PR (jen hotfix/*)──────────────── výjimka pro urgentní opravy
```

- **`main`** — stabilní větev. **Protected**: zákaz přímých commitů, jen merge přes PR.
- **`dev`** — integrační větev. **Protected**: zákaz přímých commitů, jen merge přes PR.
- **`feature/*`, `fix/*`, `chore/*`, `docs/*`** — krátkodobé pracovní větve z `dev`, PR míří do `dev`.
- **`hotfix/*`** — jediná výjimka: PR přímo do `main`; po mergi sloučit `main` zpět do `dev`.

### Pravidla

1. Nikdy přímý commit do `main` ani `dev` — vždy pracovní větev + PR.
2. Pojmenování větví: `<typ>/<kebab-popis>`, např. `feature/prompt-library`, `fix/dead-link-readme`.
3. **Agent nikdy nemerguje ani nepushuje do `main`/`dev` sám** bez explicitního pokynu — připraví větev a PR, merge potvrzuje člověk.
4. PR má smysluplný titulek a popis (co a proč); drž jazyk repa.

## AI agenti a nástroje

**Tento soubor (`AGENTS.md`) je kanonický zdroj pravdy pro rules/instrukce.** Workspace je nástrojově nezávislý: Claude Code, Cursor i VS Code + Copilot fungují stejně. AI artefakty (commands, skills, plugins) mají kanonický domov ve složce [`.agents/`](.agents/README.md); soubory jednotlivých nástrojů jsou jen **tenké wrappery**, které sem odkazují.

| Typ artefaktu | Kanonický zdroj | Claude Code | Cursor | VS Code / Copilot |
|---|---|---|---|---|
| Rules / instrukce | `AGENTS.md` (tento soubor) | [`CLAUDE.md`](CLAUDE.md) (`@AGENTS.md`) | [`.cursor/rules/000-agents.mdc`](.cursor/rules/000-agents.mdc) | [`.github/copilot-instructions.md`](.github/copilot-instructions.md) |
| Commands | [`.agents/commands/`](.agents/commands/) | `.claude/commands/` | `.cursor/commands/` | `.github/prompts/` |
| Skills | [`.agents/skills/`](.agents/skills/) | `.claude/skills/` | přes rule | přes copilot-instructions |
| Plugins | [`.agents/plugins.md`](.agents/plugins.md) | doc | doc | `.vscode/extensions.json` |

Detail systému, governance (jak přidat nový artefakt) a rozdíl command vs. skill → [`.agents/README.md`](.agents/README.md).

> **Uživatelsky specifická konfigurace** (cesty, auth účty, interní OneDrive cesty) patří do **`agent.local.md`** (gitignorovaný). Viz šablona [`agent.local.md.example`](agent.local.md.example). Pokud soubor neexistuje, zkopíruj šablonu a vyplň.

## Cross-platform (Windows + macOS, bez výjimek)

Workspace musí fungovat shodně na Windows i macOS:

- **Konce řádků LF** — drží [`.gitattributes`](.gitattributes) + [`.editorconfig`](.editorconfig).
- **Žádné symlinky** — propojení přes textový odkaz/import (např. `CLAUDE.md` → `@AGENTS.md`), nikdy symlink.
- **Žádné bash-only skripty** jako závislost workflow — `/sync-docs` běží jako AI skill; případné helpery musí být Node-based.
- **Naming souborů** — viz Konvence níže (mj. Windows-rezervované názvy).

## Konvence

- **Naming souborů**: kebab-case, bez diakritiky (obsah smí být česky)
- **Windows-safe názvy**: vyhni se rezervovaným názvům (`CON`, `PRN`, `AUX`, `NUL`, `COM1`–`COM9`, `LPT1`–`LPT9`), bez koncových teček/mezer, bez kolizí lišících se jen velikostí písmen
- **Datum prefix**: `YYYY-MM-DD-nazev` pro chronologické soubory (schůzky, maily, zápisy)
- **Frontmatter** (minimum): `title`, `date`, `status`
- **Verze dokumentů**: `nazev-vX.Y.md` nebo `YYYY-MM-DD-nazev-vX.Y.md`
- **Interní soubory**: `*-INTERNI-*` v názvu (nikdy nesdílet s klientem)

## Jazykový standard

Obsah: **{{ čeština }}** (výstupy pro klienta mohou mít vlastní jazyk dle potřeby).

## Externí reference (interní — nepublikovat)

Interní strategické podklady k tomuto projektu jsou mimo workspace — konkrétní cesta je v gitignorovaném `agent.local.md`.

## Self-maintenance — když přidáš/přejmenuješ top-level složku

1. **Vytvoř** `<složka>/CONTEXT.md` podle šablony [`.agents/templates/CONTEXT.md`](.agents/templates/CONTEXT.md)
2. **Aktualizuj** sekci „Mapa složek" v tomto souboru
3. **Aktualizuj** sekci „Routovací tabulka" — přidej řádek pro typický úkol
4. **Aktualizuj** [`README.md`](README.md) — sekce „Struktura složky"
5. **Pokud je relevantní pro onboarding** — aktualizuj [`ONBOARDING.md`](ONBOARDING.md)
