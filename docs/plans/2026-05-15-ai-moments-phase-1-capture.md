# ai-moments Phase 1 — `capture-moment` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `capture-moment` skill — first skill of the `ai-moments` plugin — that captures interesting AI session moments into a structured markdown destilát in the active project plus a row in a central index.

**Architecture:** Skill is a markdown instruction file (`SKILL.md`) with a YAML frontmatter that triggers on capture phrases. It uses 4 templates (one per moment type), writes destilát to `{project}/00-zurnal/ai-moments/`, and appends to `~/Documents/_BUSINESS/ai-moments/INDEX.md`. Proactive detection lives outside the skill in `~/.claude/rules/ai-moments.md`.

**Tech Stack:** Markdown + YAML frontmatter. No runtime code — skill is pure instructions interpreted by Claude. Bash/Read/Write/Edit/AskUserQuestion as `allowed-tools`.

**Spec reference:** [docs/specs/2026-05-15-ai-moments-design.md](../specs/2026-05-15-ai-moments-design.md)

---

## File Structure

**Will create:**
- `plugins/ai-moments/.claude-plugin/plugin.json` — plugin manifest
- `plugins/ai-moments/README.md` — plugin overview
- `plugins/ai-moments/skills/capture-moment/SKILL.md` — main skill instructions
- `plugins/ai-moments/skills/capture-moment/templates/learning.md`
- `plugins/ai-moments/skills/capture-moment/templates/workflow-win.md`
- `plugins/ai-moments/skills/capture-moment/templates/wow.md`
- `plugins/ai-moments/skills/capture-moment/templates/meta.md`
- `/Users/karelsimek/.claude/rules/ai-moments.md` — proactive detection hint

**Will modify:**
- `.claude-plugin/marketplace.json` — add `ai-moments` plugin entry
- `/Users/karelsimek/.claude/CLAUDE.md` — add one-line reference to ai-moments rules

**Note on testing:** Skills are markdown instructions, not executable code. „Tests" in this plan = manual verification scenarios Karel runs in a Claude Code session. Task 6 is the manual test.

---

## Task 1: Plugin Scaffold

**Files:**
- Create: `plugins/ai-moments/.claude-plugin/plugin.json`
- Create: `plugins/ai-moments/README.md`
- Modify: `.claude-plugin/marketplace.json` — add ai-moments entry to `plugins` array

- [ ] **Step 1: Create plugin manifest**

File: `plugins/ai-moments/.claude-plugin/plugin.json`

```json
{
  "name": "ai-moments",
  "version": "0.1.0",
  "description": "Capture interesting AI session moments into structured markdown destilát; build a library for later content (LinkedIn, talks, learning).",
  "author": {
    "name": "Karel Simek",
    "email": "datawizard.bi@gmail.com"
  }
}
```

- [ ] **Step 2: Create plugin README**

File: `plugins/ai-moments/README.md`

```markdown
# ai-moments

Systematic capture of interesting AI session moments — wow outputs, learnings, workflow wins, meta reflections — into a markdown library. Foundation for later content generation (LinkedIn posts, talks, internal docs).

## Skills

### capture-moment

Captures a moment from the current AI session into a structured destilát. Writes:

- **Full destilát** to `{project}/00-zurnal/ai-moments/{YYYY-MM-DD}-{slug}.md`
- **Index row** to `~/Documents/_BUSINESS/ai-moments/INDEX.md`

Triggers on: „zachyť tohle", „zachyť moment", „capture moment", „tohle stojí za zachycení", „uložit jako ai-moment", `/capture-moment`.

Four moment types: `learning`, `workflow-win`, `wow`, `meta`.

## Planned (later phases)

- `browse-moments` — filter and view the collection
- `weekly-moments-review` — weekly ritual over captured moments
- `to-linkedin-post` — moment → LinkedIn text + image brief

See [design spec](../../docs/specs/2026-05-15-ai-moments-design.md).
```

- [ ] **Step 3: Register plugin in marketplace**

Modify `.claude-plugin/marketplace.json` — add to the `plugins` array (after the `web-conversion` entry, keeping array order alphabetical-by-domain is not enforced; append is fine):

```json
    {
      "name": "ai-moments",
      "description": "Capture interesting AI session moments into structured markdown destilát; library for later content generation.",
      "version": "0.1.0",
      "author": { "name": "Karel Simek" },
      "source": "./plugins/ai-moments",
      "category": "productivity"
    }
```

- [ ] **Step 4: Verify JSON validity**

Run:
```bash
python3 -m json.tool plugins/ai-moments/.claude-plugin/plugin.json > /dev/null && echo "plugin.json OK"
python3 -m json.tool .claude-plugin/marketplace.json > /dev/null && echo "marketplace.json OK"
```

Expected: `plugin.json OK` and `marketplace.json OK`.

- [ ] **Step 5: Commit**

```bash
git add plugins/ai-moments/.claude-plugin/plugin.json plugins/ai-moments/README.md .claude-plugin/marketplace.json
git commit -m "feat(ai-moments): scaffold plugin with manifest and README"
```

---

## Task 2: Templates (4 moment types)

**Files:**
- Create: `plugins/ai-moments/skills/capture-moment/templates/learning.md`
- Create: `plugins/ai-moments/skills/capture-moment/templates/workflow-win.md`
- Create: `plugins/ai-moments/skills/capture-moment/templates/wow.md`
- Create: `plugins/ai-moments/skills/capture-moment/templates/meta.md`

All templates share the same outer skeleton; only the **„Co se stalo"** middle section differs. Each template uses `{{placeholder}}` syntax — the skill fills these in.

- [ ] **Step 1: Create `learning.md`**

```markdown
---
title: {{title}}
date: {{date}}
type: learning
project: {{project_name}}
project_path: {{project_path}}
status: captured
linkedin_candidate: {{linkedin_candidate}}
tags: [{{tags_csv}}]
---

# {{title}}

## Kontext

{{context_1_2_sentences}}

## Co se stalo

### Co jsem zkusil

{{what_i_tried}}

### Co fungovalo

{{what_worked}}

### Co selhalo

{{what_failed}}

### Pravidlo pro příště

{{rule_for_next_time}}

## Insight / proč to stojí za zachycení

{{insight}}

## Stopa

- Soubory, které vznikly: {{files_created}}
- Souvisí s: {{related_links}}
```

- [ ] **Step 2: Create `workflow-win.md`**

```markdown
---
title: {{title}}
date: {{date}}
type: workflow-win
project: {{project_name}}
project_path: {{project_path}}
status: captured
linkedin_candidate: {{linkedin_candidate}}
tags: [{{tags_csv}}]
---

# {{title}}

## Kontext

{{context_1_2_sentences}}

## Co se stalo

### Zadání

{{the_brief}}

### AI postup

{{ai_approach}}

### Co to ušetřilo

{{savings_time_money_complexity}}

### Reproducible recept

{{reproducible_recipe}}

## Insight / proč to stojí za zachycení

{{insight}}

## Stopa

- Soubory, které vznikly: {{files_created}}
- Souvisí s: {{related_links}}
```

- [ ] **Step 3: Create `wow.md`**

```markdown
---
title: {{title}}
date: {{date}}
type: wow
project: {{project_name}}
project_path: {{project_path}}
status: captured
linkedin_candidate: {{linkedin_candidate}}
tags: [{{tags_csv}}]
---

# {{title}}

## Kontext

{{context_1_2_sentences}}

## Co se stalo

### Co jsem čekal

{{what_i_expected}}

### Co AI udělala

{{what_ai_did}}

### Příklad výstupu

{{example_output}}

### Proč to bylo překvapivé

{{why_surprising}}

## Insight / proč to stojí za zachycení

{{insight}}

## Stopa

- Soubory, které vznikly: {{files_created}}
- Souvisí s: {{related_links}}
```

- [ ] **Step 4: Create `meta.md`**

```markdown
---
title: {{title}}
date: {{date}}
type: meta
project: {{project_name}}
project_path: {{project_path}}
status: captured
linkedin_candidate: {{linkedin_candidate}}
tags: [{{tags_csv}}]
---

# {{title}}

## Kontext

{{context_1_2_sentences}}

## Co se stalo

### Pozorování

{{observation}}

### Širší teze

{{broader_thesis}}

### Hot take draft

{{hot_take_draft}}

### Pro koho by to bylo zajímavé

{{audience}}

## Insight / proč to stojí za zachycení

{{insight}}

## Stopa

- Soubory, které vznikly: {{files_created}}
- Souvisí s: {{related_links}}
```

- [ ] **Step 5: Verify all 4 templates have matching frontmatter fields**

Run:
```bash
for f in plugins/ai-moments/skills/capture-moment/templates/*.md; do
  echo "=== $f ==="
  awk '/^---$/{n++; next} n==1' "$f" | grep -E "^(title|date|type|project|project_path|status|linkedin_candidate|tags):"
done
```

Expected: each file shows the same 8 frontmatter fields, with `type:` being the only one that differs across files.

- [ ] **Step 6: Commit**

```bash
git add plugins/ai-moments/skills/capture-moment/templates/
git commit -m "feat(ai-moments): add 4 moment templates (learning, workflow-win, wow, meta)"
```

---

## Task 3: Main `capture-moment` Skill

**Files:**
- Create: `plugins/ai-moments/skills/capture-moment/SKILL.md`

This is the core file. It contains the full instruction set Claude follows when triggered. Reference points:
- Existing skill style: `plugins/content-tools/skills/generate-images/SKILL.md` (Czech, structured, allowed-tools header).

- [ ] **Step 1: Write `SKILL.md`**

```markdown
---
name: capture-moment
description: Zachytí zajímavý moment z aktuální AI session do strukturovaného markdown destilátu. Použij když uživatel řekne "zachyť tohle", "zachyť moment", "capture moment", "tohle stojí za zachycení", "uložit jako ai-moment", nebo spustí /capture-moment. Vybírá z 4 typů (learning, workflow-win, wow, meta), píše destilát do {project}/00-zurnal/ai-moments/ a apenduje řádek do centrálního indexu ~/Documents/_BUSINESS/ai-moments/INDEX.md. Komunikuj česky.
allowed-tools: Read, Write, Edit, Glob, Bash(ls:*), Bash(mkdir:*), Bash(date:*), Bash(find:*), AskUserQuestion
---

# Capture Moment

Zachytí moment z právě probíhající AI session do strukturovaného markdown souboru. Cíl: postupně budovat knihovnu zajímavých momentů, ze kterých půjde později destilovat LinkedIn obsah, prezentace nebo workshop materiály.

## Vstup

Volitelný argument: typ momentu (`learning` | `workflow-win` | `wow` | `meta`). Pokud uživatel řekl třeba „zachyť to jako wow", použij ten typ rovnou. Jinak se zeptej.

## Postup

### 1. Detekce projektu

Zjisti aktuální pracovní složku:

```bash
pwd
```

Hledej `project_path` — první rodičovskou složku, která je projekt. Pravidla:

- Pokud cesta obsahuje `_KLIENTI/<client>/...` → projekt = `_KLIENTI/<client>/`
- Pokud cesta obsahuje `_APPS/<app>/...` → projekt = `_APPS/<app>/`
- Pokud cesta obsahuje `01_Projekty/<project>/...` → projekt = `01_Projekty/<project>/`
- Pokud cesta obsahuje `_PROJECTS/<project>/...` → projekt = `_PROJECTS/<project>/`
- Jinak nabídni cwd jako project_path a zeptej se na potvrzení.

Pokud detekce selže, zeptej se přes AskUserQuestion: „V jakém projektu/složce moment vznikl?" — nabídni cwd jako default, „jiná cesta" jako fallback.

`project_name` = poslední segment `project_path` (bez koncového lomítka).

### 2. Volba typu

Pokud uživatel neřekl typ explicitně, použij AskUserQuestion (single-select):

- **learning** — naučil jsem se něco (insight, „už nikdy ne", pravidlo pro příště)
- **workflow-win** — neobvyklé / efektivní použití AI (reproducible recept)
- **wow** — překvapivý výstup od AI (skvělé pro LinkedIn)
- **meta** — co tenhle moment říká o AI obecně (hot take, reflexe)

Můžeš jeden typ označit jako „doporučený" na základě kontextu konverzace, ale **rozhoduje uživatel**.

### 3. Destilace z konverzace

Z aktuální session vytáhni:

- **Klíčové prompty uživatele** — krátké citace toho, co Karel řekl (max 2–3 nejdůležitější věty)
- **Co AI udělala** — rozhodnutí, výstupy, akce
- **Soubory, které vznikly** — spusť:

  ```bash
  find {project_path} -type f -newermt "1 hour ago" -not -path "*/node_modules/*" -not -path "*/.git/*" 2>/dev/null | head -20
  ```

  Vrátí soubory změněné v posledni hodině. Filtruj na relevantní (vznikly v této session).

- **Insight** — jednu větu shrnující co je na tom momentu cenné. Pokud nevíš, zeptej se Karla: „Co je na tomhle momentu pro tebe nejcennější?"

Načti odpovídající šablonu:

```
{plugin_root}/skills/capture-moment/templates/{type}.md
```

(`{plugin_root}` zjistíš z cesty tohoto SKILL.md souboru.)

Vyplň všechny `{{placeholders}}` **draftem**. Ukaž drafta uživateli a zeptej se: „Sedí, nebo bys něco upravil?" Iteruj dokud Karel neodsouhlasí.

### 4. Slug + filename

Navrhni `slug` v kebab-case (3–5 slov z titulku, bez diakritiky). Příklady:
- „Zapomenutá selfie — workshop demo" → `zapomenuta-selfie-workshop`
- „AI sama opravila chybu v migracích" → `ai-opravila-migrace`

Zeptej se: „Slug bude `{navržený-slug}`. OK, nebo navrhneš jiný?"

Datum z dnešního dne:
```bash
date +%Y-%m-%d
```

Cílová cesta:
```
{project_path}/00-zurnal/ai-moments/{date}-{slug}.md
```

Pokud složka `00-zurnal/ai-moments/` neexistuje:
```bash
mkdir -p {project_path}/00-zurnal/ai-moments
```

Pokud soubor se stejným jménem už existuje, přidej `-2`, `-3`, atd.

### 5. Frontmatter rozhodnutí

**linkedin_candidate** — AskUserQuestion single-select:
- `ano` → `true`
- `možná` → `maybe`
- `ne` → `false` (default)

**tags** — navrhni 2–4 tagy odvozené z obsahu (např. ze jmen souborů, technologií, doménových slov). Ukaž návrh a zeptej se: „Tagy `[tag1, tag2, tag3]` — OK, přidat/odebrat?"

### 6. Zápis souboru

Napiš vyplněnou šablonu na cílovou cestu pomocí Write.

### 7. Update centrálního indexu

Cesta indexu: `/Users/karelsimek/Documents/_BUSINESS/ai-moments/INDEX.md`

**Pokud index neexistuje** — vytvoř ho s následující hlavičkou:

```markdown
---
title: AI Moments — index
updated: {date}
---

# AI Moments

Centrální index zachycených momentů z AI sessions. Plné destiláty žijí v projektových složkách (`{project}/00-zurnal/ai-moments/`).

| Datum | Typ | Titulek | Projekt | LI? | Stav | Cesta |
|---|---|---|---|---|---|---|
```

Pokud složka `~/Documents/_BUSINESS/ai-moments/` neexistuje, vytvoř ji (`mkdir -p`).

**Apenduj nový řádek** na konec tabulky:

```
| {date} | {type} | {title} | {project_name} | {li_mark} | captured | [→]({absolute_destilát_path}) |
```

Kde:
- `li_mark` = `✓` pokud `linkedin_candidate: true`, `?` pro `maybe`, prázdné pro `false`.
- `{absolute_destilát_path}` je absolutní cesta k destilátu (klikatelná z indexu).

**Updatuj frontmatter** `updated:` na dnešní datum (Edit operace na řádku s `updated:`).

### 8. Confirmation

Krátké shrnutí pro uživatele (v chatu):

```
✅ Zachyceno: **{title}**

- Typ: {type}
- Destilát: {destilát_path}
- Index: {index_path}
- Celkem momentů v indexu: {N}

{linkedin_hint}
```

Kde `linkedin_hint`:
- Pokud `linkedin_candidate: true`: „💡 Označeno jako LinkedIn kandidát. Až budeš mít hotový skill `to-linkedin-post`, můžeš to zpracovat."
- Pokud `maybe`: „🤔 Možná LinkedIn — uvidí se při weekly review."
- Pokud `false`: nic.

`{N}` = počet datových řádků v tabulce indexu (řádků mezi hlavičkou `|---|---|` a koncem souboru).

## Pravidla

- **Nikdy nezapisuj bez Karlova odsouhlasení draftu** (krok 3 a 4).
- **Nikdy nemerguj duplicitní momenty** — pokud existuje podobný moment, řekni to a zeptej se („vypadá to podobně jako `{existing}`, přidat nový, nebo updatovat existující?").
- **Diakritika ve slugu**: vždy odstraň. `Zapomenutá` → `zapomenuta`.
- **Citace promptů** — krátké, doslovné, v uvozovkách.
- **Pokud Karel pustí skill, ale není v projektovém kontextu** (cwd je `~/` nebo `~/Documents/`), zeptej se kam moment patří — neukládej do home.

## Co skill NEDĚLÁ

- Negeneruje HTML rendering. Pokud bude potřeba, případný samostatný skill `moment-to-html` později.
- Negeneruje LinkedIn obsah. To je úloha `to-linkedin-post` (zatím neimplementováno).
- Nezachytává bez explicitního souhlasu Karla.

## Příklad výstupu (wow moment)

Pro představu, jak vyplněný destilát vypadá (zkrácený):

```markdown
---
title: Zapomenutá selfie — workshop demo
date: 2026-05-14
type: wow
project: 2026-05-ai-date-workshop
project_path: /Users/karelsimek/Documents/01_Projekty/2026-05-ai-date-workshop
status: captured
linkedin_candidate: true
tags: [workshop, image-gen, prompt-engineering]
---

# Zapomenutá selfie — workshop demo

## Kontext
Při přípravě workshopu jsem si uvědomil, že nemám fotku z minulého ročníku. Zkusil jsem AI vygenerovat split-screen mockup „prázdný telefon + workshop card".

## Co se stalo
### Co jsem čekal
…
```

Tahle struktura usnadní pozdější parser pro `to-linkedin-post`.
```

- [ ] **Step 2: Verify SKILL.md frontmatter parses correctly**

Run:
```bash
python3 -c "
import yaml
with open('plugins/ai-moments/skills/capture-moment/SKILL.md') as f:
    content = f.read()
parts = content.split('---', 2)
fm = yaml.safe_load(parts[1])
assert 'name' in fm and fm['name'] == 'capture-moment'
assert 'description' in fm and len(fm['description']) > 100
assert 'allowed-tools' in fm
print('SKILL.md frontmatter OK')
print('  name:', fm['name'])
print('  description length:', len(fm['description']))
print('  allowed-tools:', fm['allowed-tools'])
"
```

Expected: prints `SKILL.md frontmatter OK` and the three fields.

- [ ] **Step 3: Commit**

```bash
git add plugins/ai-moments/skills/capture-moment/SKILL.md
git commit -m "feat(ai-moments): add capture-moment skill"
```

---

## Task 4: Proactive Detection Rule

**Files:**
- Create: `/Users/karelsimek/.claude/rules/ai-moments.md`
- Modify: `/Users/karelsimek/.claude/CLAUDE.md` — add one-line reference

- [ ] **Step 1: Create the rule file**

File: `/Users/karelsimek/.claude/rules/ai-moments.md`

```markdown
# AI Moments — proactive detection

When during a session you notice one of:

- **(a) wow output** — a result that visibly surprised or delighted Karel ("hezký", "wow", "to je super", surprised reaction)
- **(b) workflow appreciation** — Karel explicitly praises an approach ("pěkný", "to si zapamatuj", "tohle si ulož")
- **(c) AI usage insight** — a non-obvious way the AI was leveraged, worth remembering

Then **suggest once, in one sentence**:

> "Tenhle moment by stál za zachycení do ai-moments. Mám?"

## Constraints

- **Maximum 1 suggestion per 10 turns.** Don't pepper.
- **Never capture without explicit consent.** Suggestion is a question, not an action.
- **Don't suggest for self-referential patterns** (e.g., AI praising its own work, generic "good job" exchanges).
- **If Karel says yes**, invoke `ai-moments:capture-moment`. If no, don't ask again about the same moment.

## Why this lives here

The `capture-moment` skill is purely on-demand (Karel triggers it manually). Proactive nudging is a separate concern — it's a meta-behavior across all sessions, not part of the skill's contract. Keeping it in `rules/` means it's Karel-global, not plugin-local.
```

- [ ] **Step 2: Reference the rule from `CLAUDE.md`**

Modify `/Users/karelsimek/.claude/CLAUDE.md` — find the section that mentions other rules (search for `rules/boundaries.md` or similar). Add this line after the existing rules references:

```markdown
- `rules/ai-moments.md` — proactive nudging to capture interesting AI session moments
```

If there is no rules-list section, add the reference at the end of the `## Architecture` or `## Conventions` section under a new line:

```markdown
## Proactive AI Moment Capture

See `rules/ai-moments.md` — instructs Claude when to suggest capturing an interesting moment via `ai-moments:capture-moment`.
```

(Engineer: read `/Users/karelsimek/.claude/CLAUDE.md` first to pick the natural insertion point. If unsure, ask Karel.)

- [ ] **Step 3: Verify rule file readable + CLAUDE.md updated**

Run:
```bash
test -f /Users/karelsimek/.claude/rules/ai-moments.md && echo "rule file OK"
grep -q "ai-moments" /Users/karelsimek/.claude/CLAUDE.md && echo "CLAUDE.md reference OK"
```

Expected: both prints succeed.

- [ ] **Step 4: Commit**

These files live in `/Users/karelsimek/.claude/`, which is a **separate git repo** from `datawizard-skills`. Run:

```bash
cd /Users/karelsimek/.claude
git add rules/ai-moments.md CLAUDE.md
git commit -m "Add ai-moments proactive detection rule"
cd /Users/karelsimek/Documents/_app-projects/datawizard-skills
```

If `/Users/karelsimek/.claude/` is **not** a git repo, skip the commit step and just note "rule file added, not committed (no git)".

---

## Task 5: Plugin Self-Check

**Files:** (verification only, no new files)

- [ ] **Step 1: List plugin tree**

Run:
```bash
find plugins/ai-moments -type f | sort
```

Expected output:
```
plugins/ai-moments/.claude-plugin/plugin.json
plugins/ai-moments/README.md
plugins/ai-moments/skills/capture-moment/SKILL.md
plugins/ai-moments/skills/capture-moment/templates/learning.md
plugins/ai-moments/skills/capture-moment/templates/meta.md
plugins/ai-moments/skills/capture-moment/templates/workflow-win.md
plugins/ai-moments/skills/capture-moment/templates/wow.md
```

(7 files total.)

- [ ] **Step 2: Verify marketplace registration**

Run:
```bash
python3 -c "
import json
with open('.claude-plugin/marketplace.json') as f:
    m = json.load(f)
names = [p['name'] for p in m['plugins']]
assert 'ai-moments' in names, f'ai-moments not in {names}'
ai_m = [p for p in m['plugins'] if p['name'] == 'ai-moments'][0]
assert ai_m['source'] == './plugins/ai-moments'
print('marketplace registration OK')
"
```

Expected: `marketplace registration OK`.

- [ ] **Step 3: Verify templates are uniform**

Run:
```bash
for f in plugins/ai-moments/skills/capture-moment/templates/*.md; do
  echo "=== $(basename $f) ==="
  grep -c "^## " "$f"
done
```

Expected: each file shows `4` (Kontext + Co se stalo + Insight + Stopa).

- [ ] **Step 4: Commit (only if anything was fixed during checks)**

Otherwise skip.

---

## Task 6: Manual Test (Meta Moment)

This task verifies the skill works end-to-end by capturing the very session in which `ai-moments` was built. It's a "dogfood" test and produces the first real moment in the index.

**Pre-requisite:** Plugin must be loaded. Karel needs to restart Claude Code or reload plugins so the new skill is discoverable.

- [ ] **Step 1: Karel restarts Claude Code (or runs `/plugins reload` if available)**

Verify skill is discoverable:

```
/help
```

Look for `ai-moments:capture-moment` in the list, or `/capture-moment` slash command. If missing, troubleshoot loading (likely path issue in `marketplace.json`).

- [ ] **Step 2: Karel triggers the skill in a fresh session**

In a new session, working in `/Users/karelsimek/Documents/_app-projects/datawizard-skills/`, Karel types:

> „zachyť tohle jako meta — postavili jsme `ai-moments` plugin"

Expected:
1. Skill triggers.
2. Skill asks for project confirmation (since cwd doesn't match standard project patterns — datawizard-skills is in `_app-projects/`). Karel confirms.
3. Skill skips type question (already specified `meta`).
4. Skill drafts the meta-template fields based on this session's conversation. Karel reviews and edits.
5. Skill suggests slug, asks for confirmation.
6. Skill asks about linkedin_candidate. Karel decides.
7. Skill asks about tags. Karel decides.
8. Skill writes destilát to `{datawizard-skills}/00-zurnal/ai-moments/2026-05-15-postavili-jsme-ai-moments.md`.
9. Skill writes/updates `~/Documents/_BUSINESS/ai-moments/INDEX.md`.
10. Skill prints confirmation with paths and count = 1.

- [ ] **Step 3: Verify outputs**

```bash
ls -la /Users/karelsimek/Documents/_app-projects/datawizard-skills/00-zurnal/ai-moments/
cat ~/Documents/_BUSINESS/ai-moments/INDEX.md
```

Expected:
- One markdown file in the project folder.
- Index file exists with 1 row in the table.
- Frontmatter on both files is valid YAML.

- [ ] **Step 4: Capture issues**

If anything in steps 1–3 didn't match expectations, list the issues and fix them in `SKILL.md` directly. Common issues to watch for:

- Project detection failed → adjust path patterns or fallback prompt.
- Templates not found → check relative path resolution in SKILL.md.
- Index path wrong → verify `~/Documents/_BUSINESS/ai-moments/INDEX.md` is the intended location.
- Slug had diacritics → fix the slug-normalization instruction.

- [ ] **Step 5: Commit any fixes from Step 4**

```bash
git add plugins/ai-moments/
git commit -m "fix(ai-moments): adjustments from first dogfood capture"
```

---

## Self-Review (after writing)

Run through this checklist:

**Spec coverage:**

- [ ] Plugin layout matches spec — `plugin.json`, `README.md`, `skills/capture-moment/{SKILL.md, templates/*.md}` → Task 1, 2, 3
- [ ] 4 templates (learning, workflow-win, wow, meta) → Task 2
- [ ] `capture-moment` postup (1–7) → Task 3 Step 1 (mirrored in SKILL.md)
- [ ] Centrální index at `~/Documents/_BUSINESS/ai-moments/INDEX.md` → Task 3 Step 1, init logic
- [ ] Destilát at `{project}/00-zurnal/ai-moments/...` → Task 3 Step 1
- [ ] Proactive detection rule → Task 4
- [ ] Out-of-scope: HTML rendering, LinkedIn pipeline, deduplication → noted in SKILL.md „Co skill NEDĚLÁ" + README „Planned"

**Placeholder scan:** no „TBD", „TODO", „implement later", „add appropriate error handling" — verified.

**Type consistency:**
- Template placeholders: all use `{{snake_case}}` — consistent across 4 templates.
- Frontmatter fields: 8 fields, identical names across templates (verified by Task 2 Step 5).
- Skill internal naming: `project_path`, `project_name`, `slug`, `date`, `type` — consistent throughout.

No gaps found.

---

## Execution Options

**1. Subagent-Driven (recommended for this plan)** — fresh subagent per task, review between tasks. Tasks 1–4 are mechanical (file creation); Task 5 is verification; Task 6 is interactive and Karel must run it himself.

**2. Inline Execution** — execute Tasks 1–5 inline in this session, then Karel runs Task 6 separately.

Recommendation: **inline** for Tasks 1–5 (they're short and tightly coupled), then Karel restarts and runs Task 6 manually. The skill itself is the artifact under test — best validated by Karel, not a subagent.
