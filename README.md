---
title: Datawizard Skills
date: 2026-04-28
---

# Datawizard Skills

Monorepo with thematic plugins for Claude Code, Cursor, and other AI coding tools that support the `SKILL.md` format.

## Plugins

| Plugin | Purpose |
|---|---|
| [datawizard-core](plugins/datawizard-core/) | Markdown vault session workflow (start, wrap, ship) + global rules |
| [content-tools](plugins/content-tools/) | Document conversion (email, PDF, transcripts) and image generation |
| [client-delivery](plugins/client-delivery/) | Client work — discovery, advisory personas |
| [product-design](plugins/product-design/) | Design Thinking pipeline, prototyping, UI/UX |
| [business-advice](plugins/business-advice/) | Consultant personas (Hormozi, Inizio) |
| [talent-coaching](plugins/talent-coaching/) | Kasimaka talent coaching personas |
| [wiki-tools](plugins/wiki-tools/) | Markdown wiki ingest, lint, query |

## Installation

### Claude Code

```bash
/plugin install file:///Users/karelsimek/Documents/_app-projects/datawizard-skills/plugins/<plugin-name>
```

Or from GitHub once published:

```bash
/plugin marketplace add karyzard/datawizard-skills
/plugin install <plugin-name>@datawizard-skills
```

### Cursor

Symlink the skills directory:

```bash
ln -s /Users/karelsimek/Documents/_app-projects/datawizard-skills/plugins/<plugin-name>/skills ~/.cursor/skills/<plugin-name>
```

## Conventions

- Each plugin lives in `plugins/<name>/`
- Plugin manifest: `plugins/<name>/.claude-plugin/plugin.json`
- Skills: `plugins/<name>/skills/<skill-name>/SKILL.md`
- All `SKILL.md` files use YAML frontmatter with `name` and `description`

## Development

See `plugins/datawizard-core/` as the canonical example.
