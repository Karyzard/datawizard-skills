---
title: .agents/ — kanonický systém pro AI artefakty (rules, commands, skills, plugins)
date: YYYY-MM-DD
status: active
---

# `.agents/` — kanonický systém pro AI artefakty

> **Účel:** Jedno místo pravdy pro AI artefakty napříč nástroji (Claude Code, Cursor, VS Code + GitHub Copilot). Každý artefakt se definuje **jednou** tady; jednotlivé nástroje na něj jen **odkazují** tenkými wrappery. Tím se vyhneme duplicitám a repo funguje stejně bez ohledu na použitý nástroj — na **Windows i macOS**.

## Princip: kanonický zdroj + tenké wrappery

| Typ artefaktu | Kanonický zdroj (edituj TADY) | Claude Code | Cursor | VS Code / Copilot |
|---|---|---|---|---|
| **Rules / instrukce** | [`../AGENTS.md`](../AGENTS.md) | [`../CLAUDE.md`](../CLAUDE.md) (`@AGENTS.md` import) | `../.cursor/rules/000-agents.mdc` | `../.github/copilot-instructions.md` |
| **Commands** | `commands/<name>.md` | `../.claude/commands/<name>.md` | `../.cursor/commands/<name>.md` | `../.github/prompts/<name>.prompt.md` |
| **Skills** | `skills/<name>/SKILL.md` | `../.claude/skills/<name>/SKILL.md` | přes rule v `000-agents.mdc` | přes `copilot-instructions.md` |
| **Plugins / rozšíření** | [`plugins.md`](plugins.md) (registr) | jen dokumentace | jen dokumentace | `../.vscode/extensions.json` (odvozeno) |

**Pravidlo:** Obsah žije v kanonickém zdroji. Soubory v `.claude/`, `.cursor/`, `.github/`, `.vscode/` jsou **tenké odkazy** (1–10 řádků), které říkají „postupuj podle kanonického zdroje". Nikdy nekopíruj plný obsah do více souborů.

## Commands vs. Skills — jaký je rozdíl

- **Command** = akce vyvolaná **explicitně** (uživatel napíše `/sync-docs`, „udělej X teď"). Bývá to tenký *spouštěč*.
- **Skill** = znalost/postup, který agent **načte sám**, když je relevantní (na základě popisu a kontextu úkolu).

Některý artefakt je obojí. Příklad: **`sync-docs`** je modelovaný jako **skill** (znalost = kontroly + formát reportu + pravidla) a **command** (tenký spouštěč, který skill vyvolá). Díky tomu je dostupný dvěma způsoby — explicitně přes `/sync-docs` i automatickým načtením skillu — ale znalost existuje **jen jednou**.

## Struktura

```
.agents/
├── README.md              # tento soubor — definice systému
├── commands/              # kanonické commands (tenké spouštěče)
│   └── sync-docs.md
├── skills/                # kanonické skills (znalost/postupy)
│   └── sync-docs/
│       └── SKILL.md
├── templates/             # sdílené šablony
│   └── CONTEXT.md
└── plugins.md             # registr doporučených rozšíření per nástroj
```

## Jak přidat nový artefakt (governance)

### Nový command
1. Vytvoř `commands/<name>.md` (kanonický). Pokud nese reálnou znalost/postup, vytvoř místo toho **skill** a command nech jako tenký spouštěč.
2. Přidej tenké wrappery: `../.claude/commands/<name>.md`, `../.cursor/commands/<name>.md`, `../.github/prompts/<name>.prompt.md`.
3. Aktualizuj mapovací tabulku výše a sekci „AI agenti a nástroje" v [`../AGENTS.md`](../AGENTS.md).

### Nový skill
1. Vytvoř `skills/<name>/SKILL.md` s frontmatter `name` + `description` (popis spouští automatické načtení).
2. Přidej tenký pointer `../.claude/skills/<name>/SKILL.md`.
3. Pokud má jít vyvolat i explicitně, přidej command podle postupu výše.

### Nový plugin / rozšíření
1. Přidej řádek do [`plugins.md`](plugins.md).
2. Pokud je to VS Code rozšíření, doplň ID do `../.vscode/extensions.json`.

## Pravidla (cross-platform — Windows + macOS bez výjimek)

1. **Žádné symlinky.** Propojení se řeší odkazem v textu (např. `@AGENTS.md` import), ne symlinkem — symlinky nejsou spolehlivé na Windows.
2. **Žádné bash-only skripty** jako závislost workflow. `sync-docs` a podobné běží jako AI command/skill. Pomocné skripty (pokud vůbec) musí být Node-based a běžet na obou OS.
3. **Konce řádků LF** drží [`../.gitattributes`](../.gitattributes) + [`../.editorconfig`](../.editorconfig).
4. **Naming souborů:** kebab-case, bez diakritiky; vyhni se názvům rezervovaným na Windows (`CON`, `PRN`, `AUX`, `NUL`, `COM1`–`COM9`, `LPT1`–`LPT9`), bez koncových teček/mezer, bez kolizí lišících se jen velikostí písmen.

## Související

- [`../AGENTS.md`](../AGENTS.md) — kanonické rules + routing
- [`../README.md`](../README.md) — přehled workspace
