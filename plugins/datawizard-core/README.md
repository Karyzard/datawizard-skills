---
title: datawizard-core
date: 2026-04-28
---

# datawizard-core

Session management workflow for the OS Datawizard markdown vault system.

## Skills

- **start** — Begin a new work session, write pointer file with window name + start time
- **wrap** — Close session, append summary log to today's session file, prepare for `/clear`
- **ship** — Commit all changes and push to GitHub
- **workspace-docs-setup** — Set up or audit a workspace documentation system (root files, 00–99 folder structure, CONTEXT.md per folder, /sync-docs slash command). Auto-detects SETUP vs AUDIT mode.

## Rules

Global rules referenced by `~/.claude/CLAUDE.md`:

- `boundaries.md` — what AI can/cannot modify (GREEN/YELLOW/RED zones)
- `naming.md` — file/folder naming conventions
- `tone.md` — communication style

## Installation

```bash
/plugin install file:///Users/karelsimek/Documents/_app-projects/datawizard-skills/plugins/datawizard-core
```
