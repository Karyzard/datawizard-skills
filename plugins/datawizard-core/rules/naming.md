# Naming Conventions

## Folder Names

- Top-level data categories: `_UPPERCASE/` — underscore prefix + all caps
  - `_KLIENTI/`, `_APPS/`, `_CONTEXT/`, `_BUSINESS/`, `_PROJECTS/`
- Client folders: `kebab-case` — e.g., `_KLIENTI/acme-corp/`
- Project folders: `kebab-case` — e.g., `projects/data-migration/`
- No numbered prefixes (no `00-inbox/`, `01-daily/`)

## File Names

- Markdown files: `kebab-case.md` — e.g., `meeting-notes.md`
- System files: `UPPERCASE.md` — `CLAUDE.md`, `README.md`, `TASKS.md`
- Log files: `lowercase.md` — `log.md`, `worklog.md`, `notes.md`
- Date-prefixed when chronological: `2026-03-21-meeting-with-client.md`

## Frontmatter

Minimum required:

```yaml
---
title: Document Title
date: 2026-03-21
---
```

Optional (add when needed):

```yaml
status: draft | review | approved | archived
company: datawizard | kasimaka | personal
type: offer | strategy | process | research | meeting-notes
```

Trust is determined by folder location, not frontmatter fields.

## Branch Names (Git)

- Human work: `feature/<description>`, `fix/<description>`
- AI-generated: `agent/<description>`
