# Boundaries — Framework vs Content

## AI může volně zapisovat do (GREEN)

These locations are working areas where AI writes freely:

- `docs/inbox/` — incoming materials staging
- `docs/knowledge-base/drafts/` — processed inbox items before review
- `log.md` — audit trail (append-only)
- `worklog.md` — session work log (append-only)
- `research/` — research outputs
- `notes.md` — brain dump (append-only, never delete user's notes)
- `docs/inbox/done/` — processed files

## AI může zapisovat po potvrzení (YELLOW)

These require explicit user confirmation before modification:

- `docs/knowledge-base/` (excluding drafts/) — source of truth
- `docs/strategy/` — strategic documents
- `README.md` — engagement state, handoff sections
- `TASKS.md` — task lists and priorities
- `meetings.md` — meeting index
- `docs.md` — document index

## AI nesmí měnit bez výslovné výzvy (RED)

Never modify these without an explicit user request:

- `CLAUDE.md` per-client — client identity and AI context
- `_CONTEXT/` — personal knowledge base (read-only reference)
- Any file with `status: approved` in frontmatter
- `docs/final/` — published documents (read-only after publishing)
- `.claude/rules/` and `.cursor/rules/` per-client — client-specific rules

## Structural Rules

- Never delete user-created files without explicit confirmation
- Always append to log files, never overwrite
- When moving files between folders (e.g., inbox → KB/drafts), keep a reference in the source's `done/` subfolder
- When creating new files, always include minimal frontmatter (title, date)
