---
title: wiki-tools
date: 2026-04-28
---

# wiki-tools

Markdown wiki tools for the OS Datawizard knowledge base system.

## Skills

- **wiki-ingest** — Ingest a new source into the LLM wiki: reads the document, extracts entities and concepts, creates/updates wiki pages, and writes a log entry
- **wiki-lint** — Health check for an LLM wiki: finds orphan pages, missing frontmatter, broken cross-references, index mismatches, and suggests new sources
- **wiki-query** — Answer questions against the LLM wiki: reads index.md first, retrieves relevant pages, synthesises a cited answer, and optionally saves the analysis back to the wiki

## Installation

```bash
/plugin install file:///Users/karelsimek/Documents/_app-projects/datawizard-skills/plugins/wiki-tools
```
