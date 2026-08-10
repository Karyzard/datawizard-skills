---
name: workspace-docs-setup
description: Nastaví nebo zauditovat dokumentační systém v jakémkoli workspace (klient, app, projekt, docs vault). Detekuje mód automaticky — SETUP pro nové (chybí README/AGENTS), AUDIT/REFACTOR pro existující. Vytváří root soubory (README, AGENTS, CLAUDE, kickoff seed), standardní 00-99 složky s CONTEXT.md a nástrojově nezávislou vrstvu .agents/ + tenké wrappery (.claude, .cursor, .github, .vscode) včetně /sync-docs. Použij když uživatel zakládá nový workspace, chce zauditovat existující dokumentaci, nebo říká „nastav dokumentaci", „zauditovat docs", „setup workspace".
---

# workspace-docs-setup

Standardizovaný dokumentační systém pro Datawizard OS workspaces. Tři vrstvy: **ROOT** (orientace), **FOLDER** (`CONTEXT.md` v každé top-level), **AUTOMATION** (`.agents/` kanonický zdroj AI artefaktů + tenké wrappery per nástroj, `/sync-docs`).

Reference: [`references/workspace-docs-system.md`](references/workspace-docs-system.md) — kompletní master instrukce.
Vzorové implementace: `.../01_Projekty/2026-pavel-prachar/`, `.../01_Projekty/2026-med-company-hub-mentoring/`.

---

## Krok 1 — Detekuj mód

V kořenovém adresáři aktuálního workspace zkontroluj existenci `README.md` a `AGENTS.md`:

| Stav | Mód |
|---|---|
| Žádný `README.md` ani `AGENTS.md` | **SETUP** (greenfield) |
| Aspoň jeden existuje | **AUDIT/REFACTOR** |
| Uživatel řekl „nastav nový" / „nastav workspace" | vždy **SETUP** |
| Uživatel řekl „zauditovat" / „audit" / „zkontroluj docs" | vždy **AUDIT** |

Před pokračováním uživateli oznam: **„Detekoval jsem mód: SETUP/AUDIT. Pokračovat? (a/n)"**

---

## SETUP MODE — nastavení nového workspace

### Krok 2 — Zjisti kontext (zeptej se uživatele)

Polož postupně tyto otázky (jednu po druhé, počkej na odpověď):

1. **Jaký typ workspace?** — `klient` / `app` / `projekt` / `docs-vault`
   (viz [`references/workspace-types.md`](references/workspace-types.md))

2. **Jméno workspace** — krátký název (např. „acme-corp", „feos-mobile-app")

3. **Tým** — `solo` nebo `2+ lidí`?
   (rozhoduje o povinnosti `ONBOARDING.md`)

4. **Jazyk obsahu** — `cs` (čeština) nebo `en` (English)?

5. **Git repo?** — bude workspace verzovaný v gitu / na GitHubu?
   (rozhoduje o config souborech a git workflow sekci v `AGENTS.md`)

6. **Tech stack** (volitelné, jen pokud je to dev workspace) — jednu větu

### Krok 3 — Doporuč standardní složky podle typu

Podle typu workspace ukaž uživateli **doporučený seznam složek** z [`references/workspace-types.md`](references/workspace-types.md):

```
Pro typ `klient` doporučuji tyto složky:
  ✓ 00-inbox/          (staging)
  ✓ 01-communications/ (01-meetings/, 02-messages/, 03-summaries/)
  ✓ 02-project-mgmt/   (ROADMAP, packages/, nabidky/ NAB-NNN)
  ✓ 03-context/        (persona klienta, brief, jeho systémy)
  ✓ 04-deliverables/   (finální výstupy pro klienta)
  ✓ 99-archive/

Volitelně:
  ◯ 70-research/       (výzkum)
  ◯ 10+ fáze projektu  (číslované od 10 výš)

Které volitelné chceš zahrnout? (zadej čísla nebo „všechno"/„žádné")
```

### Krok 4 — Vytvoř root soubory

Z [`templates/`](templates/) vytvoř a vyplň placeholdery (`{{ Workspace Name }}`, `{{today}}`, atd.):

| Soubor | Kdy vytvořit |
|---|---|
| `README.md` | vždy |
| `AGENTS.md` | vždy (pokud používá AI) |
| `CLAUDE.md` | vždy (pokud používá AI) — tenký `@AGENTS.md` ukazatel |
| `00-kickoff.md` | typ `klient` (nebo projekt pro klienta) — seed formulář |
| `ONBOARDING.md` | tým 2+ |
| `TODO.md` | vždy |
| `IDEAS.md` | typ `app`, `projekt` |
| `DEVELOPMENT-PROCESS.md` | typ `app` |
| `agent.local.md.example` | git repo |
| `.gitignore`, `.gitattributes`, `.editorconfig`, `.cursorindexingignore` | git repo — z [`templates/config/`](templates/config/) (soubory jsou bez úvodní tečky, při kopírování ji doplň) |

Vyplnění:
- `{{ Workspace Name }}` → odpověď z Kroku 2.2
- `{{today}}` / `YYYY-MM-DD` → dnešní datum (`date +%Y-%m-%d`)
- Mapa složek v `AGENTS.md` a `README.md` → vyplň podle vybraného setu z Kroku 3
- Pokud workspace **není** git repo → smaž v `AGENTS.md` sekci „Git workflow" a pravidlo o gitu

### Krok 5 — Vytvoř standardní složky + CONTEXT.md stub

Pro každou vybranou složku:
1. Vytvoř adresář
2. Zkopíruj odpovídající stub z [`templates/folder-stubs/<nazev>.md`](templates/folder-stubs/) jako `<slozka>/CONTEXT.md`
3. Vyplň `{{today}}` → dnešní datum

Pokud pro složku není stub, použij generický [`templates/CONTEXT.md`](templates/CONTEXT.md).

**Vnitřní scaffold u vybraných složek:**

- `01-communications/` → podsložky `01-meetings/`, `02-messages/`, `03-summaries/`
- `02-project-mgmt/` → `ROADMAP.md` (prázdný draft s append-only decision logem), `packages/10-draft/`, `packages/20-ready/`, `packages/30-in-progress/`, `packages/40-done/`, `nabidky/`, `nabidky.md` (z [`templates/nabidky.md`](templates/nabidky.md)), `templates/package/` (`zadani.md`, `otazky.md`, `podklady/`), `templates/nabidka/`

### Krok 6 — Nastav AI vrstvu (`.agents/` + tenké wrappery)

Kanonický zdroj AI artefaktů je `.agents/`; nástroje dostávají jen tenké wrappery. Zkopíruj z [`templates/dotfolders/`](templates/dotfolders/) (složky jsou bez úvodní tečky, při kopírování ji doplň):

```
templates/dotfolders/agents/   → .agents/     (README.md, plugins.md, commands/, skills/)
templates/dotfolders/claude/   → .claude/     (wrappery: commands/sync-docs.md, skills/sync-docs/SKILL.md)
templates/dotfolders/cursor/   → .cursor/     (rules/000-agents.mdc, commands/sync-docs.md)
templates/dotfolders/github/   → .github/     (copilot-instructions.md, prompts/sync-docs.prompt.md)
templates/dotfolders/vscode/   → .vscode/     (extensions.json, settings.json)
```

Do `.agents/templates/CONTEXT.md` zkopíruj [`templates/CONTEXT.md`](templates/CONTEXT.md). Vyplň `{{ Workspace Name }}` placeholdery ve wrapperech (000-agents.mdc, copilot-instructions.md).

**Pravidla vrstvy** (detail v `.agents/README.md` šabloně): žádné symlinky, žádné bash-only skripty, obsah žije jednou v `.agents/`, wrappery jen odkazují.

### Krok 7 — Verifikace

1. Spusť `/sync-docs` (nebo zavolej skill `workspace-docs-setup` v AUDIT módu).
2. Pokud najde nesrovnalosti, oprav je.
3. Vypiš shrnutí:
   ```
   ✓ Workspace "<name>" nastaven jako <type>
   ✓ Vytvořeno X root souborů, Y standardních složek, .agents/ + wrappery
   ✓ Slash command /sync-docs k dispozici

   Další kroky:
   - Otevři README.md a doplň aktuální stav
   - Klientský projekt: vyplň 00-kickoff.md s klientem a řekni „Naseed-uj workspace podle 00-kickoff.md"
   - Pokud máš tým: pošli kolegům odkaz na ONBOARDING.md
   ```

### Seed workflow (po kickoffu s klientem)

U klientského workspace následuje po setupu **seed**: uživatel vyplní `00-kickoff.md` a řekne „Naseed-uj workspace podle 00-kickoff.md". Postup seedu je definovaný v `AGENTS.md` šabloně (sekce „Seed workflow") — agent propíše vyplněná pole do `README.md`, `AGENTS.md`, `ONBOARDING.md`, `TODO.md` a `CONTEXT.md` složek; prázdná pole nechá obecná.

---

## AUDIT MODE — kontrola existující dokumentace

### Krok 2 — Sebrej fakta

1. **Vylistuj top-level adresáře** v rootu workspace
2. **Zkontroluj root soubory** — které z `README.md`, `AGENTS.md`, `CLAUDE.md`, `ONBOARDING.md`, `TODO.md`, `IDEAS.md`, `DEVELOPMENT-PROCESS.md` existují
3. **Pro každou top-level složku** ověř existenci `CONTEXT.md`
4. **Otevři `AGENTS.md`** (pokud existuje) — extrahuj „Mapa složek" a porovnej s realitou
5. **Zkontroluj AI vrstvu** — existuje `.agents/`? Jsou `.claude/`/`.cursor/`/`.github/` jen tenké wrappery, nebo duplikují obsah? (duplicity → navrhni konsolidaci do `.agents/`)
6. **Najdi mrtvé linky** v root souborech (linky na neexistující soubory/složky)
7. **Najdi zastaralé názvy** — pokud README/AGENTS zmiňuje složku, která už neexistuje (přejmenovaná, smazaná)
8. **Zkontroluj datumy ve frontmatter** — flagni dokumenty starší než 60 dní bez `status: archived`
9. **Zkontroluj úniky interního obsahu** — soubory `*-INTERNI-*` nesmí být v `04-deliverables/` ani v exportech pro klienta

### Krok 3 — Sestav report

Tři sekce:

```
## ✓ V pořádku
- README.md a AGENTS.md existují
- Všechny top-level složky mají CONTEXT.md
- Mapa v AGENTS.md odpovídá realitě

## 🔧 Opraveno automaticky
- (nic, nebo seznam co jsi opravil bez ptaní — typicky jen formátovací drobnosti)

## ⚠️ Vyžaduje rozhodnutí
- Složka `05-old-stuff/` nemá CONTEXT.md → vytvořit nebo archivovat?
- README.md zmiňuje `02-marketing/` ale složka neexistuje → smazat zmínku?
- `.claude/commands/foo.md` obsahuje plný obsah místo wrapperu → přesunout do `.agents/`?
- Dokument `notes.md` v rootu má frontmatter date: 2026-01-15 → zastaralý, archivovat?
```

### Krok 4 — Po souhlasu proveď opravy

Pro každý bod v „Vyžaduje rozhodnutí":
1. Zeptej se uživatele
2. Po odpovědi proveď akci (vytvoř CONTEXT.md / smaž zmínku / přesuň do `99-archive/` / atd.)
3. Vypiš co jsi udělal

### Krok 5 — Final check

Spusť ještě jednou Krok 2 a vypiš čistý report. Pokud zůstaly nesrovnalosti, vypiš je jako „K dořešení později".

---

## Průřezové konvence

- **`*-INTERNI-*`** — interní ceny, marže, strategie. Nikdy nesdílet s klientem, nikdy nekopírovat do `04-deliverables/`; z ostatních dokumentů jen odkazovat.
- **Cross-platform** — LF konce řádků, žádné symlinky, žádné bash-only skripty, Windows-safe názvy (bez `CON`, `PRN`, `AUX`, `NUL`, `COM1`–`COM9`, `LPT1`–`LPT9`).
- **Naming** — kebab-case bez diakritiky, chronologické `YYYY-MM-DD-popis`, verze `nazev-vX.Y.md`.

## Kdy NEpoužít tento skill

Aplikuj systém **jen pokud platí alespoň 2 z 3**:

1. Spolupracuje na něm víc lidí (i jen občas)
2. Má víc než 5 top-level složek
3. AI agenti v něm pracují pravidelně

Pro malý solo workspace stačí jednoduchý `README.md` — neotvírej zbytečně velký systém.

---

## Reference

- Master instrukce: [`references/workspace-docs-system.md`](references/workspace-docs-system.md) — celý standard
- Number schéma: [`references/folder-numbering.md`](references/folder-numbering.md) — 00–99
- Naming: [`references/naming.md`](references/naming.md) — kebab-case, datumy, sprint
- Typy workspace: [`references/workspace-types.md`](references/workspace-types.md) — klient / app / projekt / docs-vault
- Setup checklist: [`references/setup-checklist.md`](references/setup-checklist.md) — krok-za-krokem
- Šablony root souborů: [`templates/`](templates/) — README, AGENTS, CLAUDE, ONBOARDING, CONTEXT, TODO, IDEAS, 00-kickoff, agent.local.md.example, nabidky.md
- Config soubory: [`templates/config/`](templates/config/) — gitignore, gitattributes, editorconfig, cursorindexingignore
- AI vrstva: [`templates/dotfolders/`](templates/dotfolders/) — .agents/ + wrappery (.claude, .cursor, .github, .vscode)
- Folder stuby: [`templates/folder-stubs/`](templates/folder-stubs/) — CONTEXT.md per standardní složka
