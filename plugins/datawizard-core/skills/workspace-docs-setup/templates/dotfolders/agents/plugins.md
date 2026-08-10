---
title: Registr doporučených rozšíření / pluginů per nástroj
date: YYYY-MM-DD
status: active
---

# plugins.md — registr rozšíření a pluginů

> **Účel:** Jedno místo pravdy pro doporučená rozšíření napříč nástroji. Pluginy/rozšíření **nejdou sdílet obsahem** mezi nástroji (každý má vlastní formát) — jdou jen **dokumentovat**. Tento registr je zdroj; strojově čitelný seznam pro VS Code je z něj odvozený v [`../.vscode/extensions.json`](../.vscode/extensions.json).
>
> **Žádná auto-instalace.** Tabulka je doporučení; instalaci provádí uživatel.

## VS Code / GitHub Copilot

| Rozšíření | ID | K čemu | Povinné |
|---|---|---|---|
| GitHub Copilot | `GitHub.copilot` | AI completions | ✓ |
| GitHub Copilot Chat | `GitHub.copilot-chat` | Chat, agent mode, čtení `AGENTS.md` | ✓ |
| Markdown All in One | `yzhang.markdown-all-in-one` | Editace markdown (TOC, zkratky) | doporučeno |
| markdownlint | `DavidAnson.vscode-markdownlint` | Lint konzistence markdown | doporučeno |
| EditorConfig | `EditorConfig.EditorConfig` | Respektuje `.editorconfig` (cross-platform) | doporučeno |

VS Code tato doporučení čte z [`../.vscode/extensions.json`](../.vscode/extensions.json) a nabídne je při otevření workspace.

## Cursor

| Plugin / nastavení | K čemu | Povinné |
|---|---|---|
| Vestavěný AI chat / agent | Čte `AGENTS.md` + `.cursor/rules/` nativně | ✓ |
| `.cursor/rules/000-agents.mdc` | Always-applied rule → odkaz na `AGENTS.md` | ✓ |
| `.cursorindexingignore` | Vyloučení generovaných souborů z indexace | ✓ |

Cursor je z velké části kompatibilní s VS Code rozšířeními — výše uvedená VS Code rozšíření lze použít i zde.

## Claude Code

| Mechanismus | K čemu | Povinné |
|---|---|---|
| `CLAUDE.md` (`@AGENTS.md` import) | Načte kanonické rules | ✓ |
| `.claude/commands/` | Slash commands (wrappery na `.agents/commands/`) | ✓ |
| `.claude/skills/` | Skills (pointery na `.agents/skills/`) | ✓ |
| Plugin marketplaces | Volitelná rozšíření Claude Code | volitelné |

## Jak přidat nové rozšíření

1. Přidej řádek do příslušné tabulky výše.
2. Pokud je to VS Code rozšíření, doplň jeho ID do `recommendations` v [`../.vscode/extensions.json`](../.vscode/extensions.json).
3. U pluginů, které nejdou nasdílet (Cursor/Claude specifické), stačí dokumentace zde.

## Související

- [`README.md`](README.md) — systém `.agents/`
- [`../AGENTS.md`](../AGENTS.md) — kanonické rules + routing
