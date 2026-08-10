# CLAUDE.md

Tento soubor existuje, aby Claude Code načetl kanonické instrukce workspace.

@AGENTS.md

## AI artefakty (commands, skills, plugins)

Kanonický zdroj všech AI artefaktů je složka [`.agents/`](.agents/README.md). Soubory pod `.claude/` jsou **tenké wrappery**, které na `.agents/` odkazují — needituj je jako zdroj pravdy, edituj `.agents/`.

- Commands: [`.agents/commands/`](.agents/commands/) (mirror: `.claude/commands/`)
- Skills: [`.agents/skills/`](.agents/skills/) (mirror: `.claude/skills/`)
- Plugins: [`.agents/plugins.md`](.agents/plugins.md)

Slash command `/sync-docs` spustí skill [`.agents/skills/sync-docs/SKILL.md`](.agents/skills/sync-docs/SKILL.md).
