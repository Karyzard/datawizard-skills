---
title: Datawizard Skills — Migration TODO
date: 2026-04-28
status: in-progress
---

# Migration TODO

Tracking migration of all personal skills into the `datawizard-skills` monorepo.

## Phase 1 — Scaffold ✅

- [x] Create monorepo at `/Users/karelsimek/Documents/_app-projects/datawizard-skills/`
- [x] Init git, README, .gitignore
- [x] Plugin #1 `datawizard-core` (start, wrap, ship + rules)

## Phase 2 — Test installation

- [ ] In a new Claude Code window, run: `/plugin install file:///Users/karelsimek/Documents/_app-projects/datawizard-skills/plugins/datawizard-core`
- [ ] Verify `/start`, `/wrap`, `/ship` work
- [ ] Fix any issues with manifest/skill format before scaling out

## Phase 3 — Migrate remaining 6 plugins ✅

All 7 plugins created with 31 skills total. Completed 2026-04-28.

| Plugin | Skills |
|---|---|
| datawizard-core | start, wrap, ship |
| content-tools | email-to-markdown, pdf-to-markdown, process-meeting-transcript, generate-images |
| client-delivery | client-discovery, ivo-cdo-advisor + scaffold-client.sh |
| product-design | product-discovery, wireframe-designer, html-prototyper, branding-creator, backlog-builder, business-case, implementation-spec, rapid-prototype-pipeline, generate-prototype, prototype-feature, backlog-dashboard, ui-ux-pro-max |
| business-advice | hormozi-consultant, inizio-consultant |
| talent-coaching | talent-kouc, talent-rozhodovani, talent-reflexe, talent-projekt-review, talent-obchodni-priprava |
| wiki-tools | wiki-ingest, wiki-lint, wiki-query |

Note: `ui-ux-pro-max` included but review content — source was in `~/Documents/_temp-local/` which is a temp folder. Consider moving source.

## Phase 4 — Test all plugins locally

- [ ] Install each plugin via `/plugin install file://...`
- [ ] Spot-check that skills are invokable
- [ ] Fix manifest/format issues

## Phase 5 — GitHub push

- [ ] Create GitHub repo: `karyzard/datawizard-skills` (public or private — decide)
- [ ] Add remote, push main branch
- [ ] Update repo README with GitHub install instructions
- [ ] Optionally: set up `.claude-plugin/marketplace.json` for `/plugin marketplace add karyzard/datawizard-skills`

## Phase 6 — Cleanup old locations

**⚠️ Only after all plugins are confirmed working from monorepo!**

- [ ] Remove migrated commands from `~/.claude/commands/` (start.md, wrap.md, ship.md, generate-images.md, generate-prototype.md, prototype-feature.md)
- [ ] Remove migrated skills from `~/.cursor/skills/` OR replace with symlinks to monorepo
- [ ] Remove duplicate rules from `~/.cursor/rules/` (boundaries, naming, tone — keep `.mdc` files like `invoice-mover.mdc`, `skill-editing-sync.mdc`)
- [ ] Uninstall old local-skills plugins from `~/.claude/plugins/cache/local-skills/` (design-thinking, hormozi-consultant, inizio-consultant) — replace with installs from new monorepo
- [ ] Update `~/.claude/CLAUDE.md` references to rules paths if they break

## Phase 7 — Cursor symlink strategy

Decide: do we symlink from `~/.cursor/skills/<plugin>` → monorepo, or copy? Symlink keeps single source of truth.

```bash
# Example
ln -s /Users/karelsimek/Documents/_app-projects/datawizard-skills/plugins/talent-coaching/skills ~/.cursor/skills/talent-coaching
```

## Phase 8 — New skill: `workspace-docs-setup`

**Plugin:** `datawizard-core` (lifecycle skill — sedí vedle start/wrap/ship)

**Účel:** Nastaví nebo zauditovat dokumentační systém v jakémkoli workspace (klient, app, projekt). Dva módy:
- **SETUP** (greenfield) — workspace nemá README/AGENTS → vytvoří root soubory + standardní 00-99 složky + CONTEXT.md ve všech + `.claude/commands/sync-docs.md`
- **AUDIT/REFACTOR** (existující) — projde existující dokumentaci, vypíše report (chybějící CONTEXT.md, mrtvé linky, zastaralé názvy, chybějící onboarding), nabídne opravu

### Detekce módu

- Žádný `README.md` ANI `AGENTS.md` v rootu → **SETUP**
- Existuje aspoň jedno → **AUDIT**
- Pokud uživatel explicitně řekne „nastav nový" / „zauditovat" — respektuj

### SETUP — co skill udělá

1. Zeptá se na **typ workspace**: klient / app / projekt / dokumentační vault
2. Zeptá se na **kontext**: jméno workspace, kdo v týmu, jazyk obsahu (cs/en), tech stack (volitelně)
3. Vytvoří **root soubory** ze šablon, vyplní zjištěné údaje:
   - `README.md`
   - `AGENTS.md`
   - `ONBOARDING.md` (pokud tým 2+)
   - `TODO.md`, `IDEAS.md` (volitelně dle typu)
4. Vytvoří **standardní složky** podle typu workspace (viz dále) a do každé vloží stub `CONTEXT.md`
5. Nainstaluje `.claude/commands/sync-docs.md` (slash command pro průběžnou kontrolu)
6. Spustí `/sync-docs` jako verifikaci

### Standardní složky 00–99 (viz Phase 8 reference)

**Vždy povinné (jakýkoli workspace):**
- `00-inbox/` — staging neroztříděných materiálů
- `99-archive/` — read-only archiv

**Doporučené pro klient/projekt/app:**
- `01-communications/` (schůzky, e-maily, sw-releases)
- `02-project-mgmt/` (timeline, RACI, MoSCoW, risks)
- `03-context/` (sdílený produktový kontext, vize, design system)

**Pro app/produkt:**
- `10-19` — fáze aplikace (admin, klient, atd.)
- `70-research/`
- `90-product-backlog/`
- `docs/`, `scripts/` (volitelné, technické)

**Pro klienta:**
- `04-deliverables/` nebo `10-deliverables/`
- `05-meetings/` (pokud nemá `01-communications/`)

Skill se zeptá uživatele, které z doporučených zahrnout.

### AUDIT — co skill udělá

1. Vylistuje top-level složky a porovná s `AGENTS.md` mapou
2. Pro každou top-level složku ověří existenci `CONTEXT.md`
3. Najde mrtvé linky v root souborech
4. Najde zastaralé názvy složek (porovná zmínky v textu vs. realita)
5. Zkontroluje datumy ve frontmatter (starší 2 měsíce → flagne)
6. Vypíše **report** se třemi sekcemi: V pořádku / Opraveno automaticky / Vyžaduje rozhodnutí
7. Po souhlasu provede opravy

### Struktura skillu

```
plugins/datawizard-core/skills/workspace-docs-setup/
  SKILL.md                       ← hlavní instrukce, rozhodovací logika SETUP/AUDIT
  templates/
    README.md
    AGENTS.md
    ONBOARDING.md
    TODO.md
    IDEAS.md
    CONTEXT.md                   ← generický CONTEXT.md
    sync-docs.md                 ← slash command template
    folder-stubs/                ← stub CONTEXT.md per standardní složka
      00-inbox.md
      01-communications.md
      02-project-mgmt.md
      03-context.md
      99-archive.md
      70-research.md
      90-product-backlog.md
      docs.md
      scripts.md
  references/
    folder-numbering.md          ← detail 00–99 schématu
    naming.md                    ← naming konvence
    workspace-types.md           ← typy workspace a doporučené složky
```

### Migrace existujících artefaktů

Už mám v `~/.claude/templates/workspace-docs/` šablony a v `~/.claude/rules/workspace-docs-system.md` master instrukci. Skill je převezme:

- [ ] Přesunout šablony z `~/.claude/templates/workspace-docs/` → `plugins/datawizard-core/skills/workspace-docs-setup/templates/`
- [ ] Master instrukci z `~/.claude/rules/workspace-docs-system.md` → integrovat do `SKILL.md` + případně `references/workspace-docs-system.md`
- [ ] Smazat staré lokace po ověření, že skill funguje

### Reference implementation

Existující funkční implementace standardu (vzor pro stuby): `~/Library/CloudStorage/OneDrive-Sdílenéknihovny–Datawizard/Hub - Dokumenty/01_Projekty/2026-feos-apps/`

- 14 top-level složek, každá má CONTEXT.md
- Root: README.md + AGENTS.md + ONBOARDING.md + DEVELOPMENT-PROCESS.md
- `.claude/commands/sync-docs.md` funkční

### Akceptační kritéria

- [ ] Skill má SKILL.md s detekcí módu (setup vs audit)
- [ ] V čistém adresáři dokáže vytvořit kompletní dokumentační kostru
- [ ] V existujícím workspace dokáže vypsat audit report a nabídnout opravy
- [ ] Šablony obsahují placeholdery (`{{ ... }}`) které skill vyplní podle inputu
- [ ] Nainstaluje `/sync-docs` slash command jako součást setupu
- [ ] Funguje pro 4 typy workspace: klient / app / projekt / docs vault

### Open questions

- Má `99-archive/` být **vždy** povinný i pro malé workspace (5 složek)? Nebo ho přidat až při prvním archivování?
- Pro klienta vs. app — má skill mít víc předdefinovaných „presetů" nebo jen jednu sadu doporučených složek a uživatel si vybere?
- Naming složek — povolit anglické varianty (`01-meetings/` místo `01-communications/`) nebo držet jednotné české názvy?

## Notes

- Pending question (deferred): Karel mentioned an HTML conversion skill ("webovku do jiné architektury") — not found in inventory, may have been confused with `geocities-html` from course materials. Will revisit when he remembers.
- `ui-ux-pro-max-skill` location: `~/Documents/_temp-local/` — temp folder, consider whether to move source elsewhere.
