# knowledge-capture

Capturing knowledge from external sources into the markdown vault — YouTube transcripts and a web research guide covering free and paid tools.

## Skills

### youtube-transcripts

Downloads an overview plus transcripts for every video in a YouTube playlist, channel, or a single video. Produces `00-prehled.xlsx`, `00-index.md`, and one markdown file per video (frontmatter with date, URL, duration, views; description; transcript in one-minute paragraphs). No API key or login needed. Handles private videos (flagged), missing captions, and YouTube IP blocking (backoff + resumable runs). Bundled script `scripts/yt_transcripts.py` bootstraps its own venv in `~/.cache/datawizard/` using Homebrew Python 3.12+ (system Python 3.9 is not supported by yt-dlp).

### web-research

Decision guide for searching and scraping the web: built-in `WebFetch` / `WebSearch` and Playwright (free) first, then Brave Search API (paid per query, key in macOS Keychain) and the Browserless plugin (paid per browser unit). Documents costs, credentials location, request patterns, and the rule to confirm with the user before large paid batches.

## Requirements

- `youtube-transcripts`: Homebrew `python3.12` or newer (`brew install python@3.12`).
- `web-research`: Brave key in Keychain as `brave-search-api-key`; Browserless token via `/browserless:auth` (plugin `browserless@browserless`).
