---
applyTo: '**'
---

# Copilot instrukce — {{ Workspace Name }}

**Kanonické instrukce tohoto workspace jsou v [`AGENTS.md`](../AGENTS.md). Vždy se jimi řiď.** Tento soubor je tenký ukazatel + pár poznámek specifických pro VS Code / Copilot.

## Kde co hledat

- Routing, mapa složek, pravidla pro agenty → [`AGENTS.md`](../AGENTS.md) (kanonické)
- Systém AI artefaktů (commands, skills, plugins) → [`.agents/README.md`](../.agents/README.md)
- Slash workflow `/sync-docs` → prompt [`prompts/sync-docs.prompt.md`](prompts/sync-docs.prompt.md), znalost v [`.agents/skills/sync-docs/SKILL.md`](../.agents/skills/sync-docs/SKILL.md)

## Poznámky pro toto repo

- **Účel:** {{ 1 věta — interní zdroj pravdy pro klientský projekt / app / projekt }}
- **Jazyk obsahu:** čeština. Výstupy pro klienta mohou mít vlastní jazyk.
- **Naming souborů:** kebab-case, bez diakritiky; vyhni se Windows-rezervovaným názvům (`CON`, `PRN`, `AUX`, `NUL`, `COM1`–`COM9`, `LPT1`–`LPT9`); chronologické soubory `YYYY-MM-DD-popis.md`.
- **Cross-platform:** repo musí fungovat shodně na Windows i macOS — žádné symlinky, LF konce řádků (drží `.gitattributes` + `.editorconfig`).
- **Při změně top-level struktury** dodrž checklist v [`AGENTS.md`](../AGENTS.md) a spusť `/sync-docs`.
- **`99-archive/`** je read-only.
