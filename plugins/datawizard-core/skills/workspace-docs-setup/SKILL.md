---
name: workspace-docs-setup
description: Nastaví nebo zauditovat dokumentační systém v jakémkoli workspace (klient, app, projekt, docs vault). Detekuje mód automaticky — SETUP pro nové (chybí README/AGENTS), AUDIT/REFACTOR pro existující. Vytváří root soubory, standardní 00-99 složky s CONTEXT.md, instaluje /sync-docs slash command. Použij když uživatel zakládá nový workspace, chce zauditovat existující dokumentaci, nebo říká „nastav dokumentaci", „zauditovat docs", „setup workspace".
---

# workspace-docs-setup

Standardizovaný dokumentační systém pro Datawizard OS workspaces. Tři vrstvy: **ROOT** (orientace), **FOLDER** (`CONTEXT.md` v každé top-level), **AUTOMATION** (`/sync-docs` slash command).

Reference: [`references/workspace-docs-system.md`](references/workspace-docs-system.md) — kompletní master instrukce.

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

5. **Tech stack** (volitelné, jen pokud je to dev workspace) — jednu větu

### Krok 3 — Doporuč standardní složky podle typu

Podle typu workspace ukaž uživateli **doporučený seznam složek** z [`references/workspace-types.md`](references/workspace-types.md):

```
Pro typ `klient` doporučuji tyto složky:
  ✓ 00-inbox/         (staging)
  ✓ 01-communications/ (schůzky, mail)
  ✓ 02-project-mgmt/  (timeline, RACI)
  ✓ 04-deliverables/  (nabídky, reporty)
  ✓ 99-archive/

Volitelně:
  ◯ 03-context/       (sdílený produktový kontext)
  ◯ 70-research/      (výzkum)

Které volitelné chceš zahrnout? (zadej čísla nebo „všechno"/„žádné")
```

### Krok 4 — Vytvoř root soubory

Z [`templates/`](templates/) vytvoř a vyplň placeholdery (`{{workspace_name}}`, `{{today}}`, `{{first_idea_or_placeholder}}`, atd.):

| Soubor | Kdy vytvořit |
|---|---|
| `README.md` | vždy |
| `AGENTS.md` | vždy (pokud používá AI) |
| `ONBOARDING.md` | tým 2+ |
| `TODO.md` | vždy |
| `IDEAS.md` | typ `app`, `projekt` |
| `DEVELOPMENT-PROCESS.md` | typ `app` |

Vyplnění:
- `{{workspace_name}}` → odpověď z Kroku 2.2
- `{{today}}` → dnešní datum (`date +%Y-%m-%d`)
- `{{first_idea_or_placeholder}}` → uživatel napsal nápad, jinak `(žádný zatím)`
- Mapa složek → vyplň podle vybraného setu z Kroku 3

### Krok 5 — Vytvoř standardní složky + CONTEXT.md stub

Pro každou vybranou složku:
1. Vytvoř adresář
2. Zkopíruj odpovídající stub z [`templates/folder-stubs/<nazev>.md`](templates/folder-stubs/) jako `<slozka>/CONTEXT.md`
3. Vyplň `{{today}}` → dnešní datum

Pokud pro složku není stub, použij generický [`templates/CONTEXT.md`](templates/CONTEXT.md).

### Krok 6 — Nastav `.claude/` automatizaci

Vytvoř:

```
.claude/
  templates/
    CONTEXT.md         ← kopie z templates/CONTEXT.md
  commands/
    sync-docs.md       ← kopie z templates/sync-docs.md
```

### Krok 7 — Verifikace

1. Spusť `/sync-docs` (nebo zavolej skill `workspace-docs-setup` v AUDIT módu).
2. Pokud najde nesrovnalosti, oprav je.
3. Vypiš shrnutí:
   ```
   ✓ Workspace "<name>" nastaven jako <type>
   ✓ Vytvořeno X root souborů, Y standardních složek
   ✓ Slash command /sync-docs k dispozici

   Další kroky:
   - Otevři README.md a doplň aktuální stav
   - Pokud máš tým: pošli kolegům odkaz na ONBOARDING.md
   ```

---

## AUDIT MODE — kontrola existující dokumentace

### Krok 2 — Sebrej fakta

1. **Vylistuj top-level adresáře** v rootu workspace
2. **Zkontroluj root soubory** — které z `README.md`, `AGENTS.md`, `ONBOARDING.md`, `TODO.md`, `IDEAS.md`, `DEVELOPMENT-PROCESS.md` existují
3. **Pro každou top-level složku** ověř existenci `CONTEXT.md`
4. **Otevři `AGENTS.md`** (pokud existuje) — extrahuj „Mapa složek" a porovnej s realitou
5. **Najdi mrtvé linky** v root souborech (linky na neexistující soubory/složky)
6. **Najdi zastaralé názvy** — pokud README/AGENTS zmiňuje složku, která už neexistuje (přejmenovaná, smazaná)
7. **Zkontroluj datumy ve frontmatter** — flagni dokumenty starší než 60 dní bez `status: archived`

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
- Šablony: [`templates/`](templates/) — README, AGENTS, ONBOARDING, CONTEXT, TODO, IDEAS, sync-docs
- Folder stuby: [`templates/folder-stubs/`](templates/folder-stubs/) — CONTEXT.md per standardní složka
