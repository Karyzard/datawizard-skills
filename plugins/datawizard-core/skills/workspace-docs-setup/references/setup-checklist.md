# Setup Checklist — Workspace Documentation System

Checklist pro **zavedení standardu** v novém nebo existujícím workspace.

> Reference: [`workspace-docs-system.md`](workspace-docs-system.md)

---

## Nový workspace (greenfield)

- [ ] **Krok 1 — Root soubory**
  - [ ] Zkopíruj `README.md` z templates → vyplň placeholdery
  - [ ] Zkopíruj `AGENTS.md` z templates → uprav routing tabulku pro tento workspace
  - [ ] Zkopíruj `CLAUDE.md` z templates (tenký `@AGENTS.md` ukazatel)
  - [ ] Klientský projekt: zkopíruj `00-kickoff.md` (seed formulář)
  - [ ] Zkopíruj `ONBOARDING.md` z templates → uprav role a kontaktní osoby
  - [ ] Git repo: zkopíruj `agent.local.md.example` + config soubory z `templates/config/` (`.gitignore`, `.gitattributes`, `.editorconfig`, `.cursorindexingignore`)
  - [ ] (Volitelně) Vytvoř `DEVELOPMENT-PROCESS.md`, `TODO.md`, `IDEAS.md`

- [ ] **Krok 2 — Top-level složky**
  - [ ] Vytvoř top-level složky s prefix čísly (`0X-`, `1X-`, ...)
  - [ ] Do každé vlož `CONTEXT.md` z templates (folder-stubs, nebo generický)
  - [ ] Vyplň placeholdery v každém CONTEXT.md (k čemu složka, podsložky, čtení)
  - [ ] `01-communications/` → podsložky `01-meetings/`, `02-messages/`, `03-summaries/`
  - [ ] `02-project-mgmt/` → `ROADMAP.md`, `packages/10-draft…40-done/`, `nabidky/` + `nabidky.md`, `templates/package/`, `templates/nabidka/`

- [ ] **Krok 3 — Automatizace (`.agents/` + tenké wrappery)**
  - [ ] Zkopíruj `templates/dotfolders/agents/` → `.agents/` (README, plugins.md, commands/, skills/)
  - [ ] Vlož kopii `CONTEXT.md` šablony do `.agents/templates/`
  - [ ] Zkopíruj wrappery: `.claude/` (commands + skills pointery), `.cursor/` (rules/000-agents.mdc + commands), `.github/` (copilot-instructions.md + prompts), `.vscode/` (extensions.json + settings.json)
  - [ ] Vyplň `{{ Workspace Name }}` ve wrapperech
  - [ ] (Volitelně) Vytvoř `.claude/settings.local.json` s lokálními permissions

- [ ] **Krok 4 — Verifikace**
  - [ ] Spusť `/sync-docs` — měl by projít čistě
  - [ ] Otevři `README.md` a zkontroluj, že odkazy fungují
  - [ ] Otevři `AGENTS.md` a zkontroluj, že tabulka odpovídá realitě
  - [ ] Otevři jednu z `CONTEXT.md` a zkontroluj, že je naplněná

---

## Existující workspace (retrofit)

Použij když máš workspace, který už existuje, ale chceš ho převést na tento standard.

### Fáze 1 — Audit

- [ ] **Vylistuj top-level složky** — `ls -d */ | head -30`
- [ ] **Pro každou top-level složku zkontroluj:**
  - [ ] Existuje `CONTEXT.md`? (pokud ne → fáze 2)
  - [ ] Pokud ano, je aktuální? (porovnej s reálnou strukturou)
- [ ] **Zkontroluj root soubory:**
  - [ ] Existuje `README.md`? Je aktuální?
  - [ ] Existuje `AGENTS.md`? Odpovídá reálné struktuře?
  - [ ] Existuje `ONBOARDING.md`? (pokud je víceosobní tým)

### Fáze 2 — Doplnění chybějícího

- [ ] **CONTEXT.md** — pro každou složku, kde chybí, vytvoř ze šablony
  - Minimální obsah: K čemu slouží + Podsložky + Související
  - Detail můžeš doplnit postupně
- [ ] **AGENTS.md** — pokud chybí, vytvoř ze šablony
  - Mapa složek = aktuální stav
  - Routovací tabulka = nejčastější úkoly
- [ ] **ONBOARDING.md** — pokud chybí a je tým 2+, vytvoř ze šablony

### Fáze 3 — Oprava nekonzistencí

- [ ] **Mrtvé linky** — projdi root soubory, oprav odkazy na neexistující složky
- [ ] **Zastaralé názvy složek** — pokud jsi něco přejmenoval, projdi celou dokumentaci a aktualizuj
- [ ] **Datumy** — aktualizuj „Aktuální stav (měsíc rok)" sekce
- [ ] **Diakritika v názvech souborů** — pokud máš historicky soubory s diakritikou, postupně migruj na kebab-case

### Fáze 4 — Automatizace

- [ ] Zaveď `.agents/` vrstvu + tenké wrappery (viz Krok 3 v greenfield checklistu)
- [ ] Pokud `.claude/`/`.cursor/` obsahují plný obsah (ne wrappery) → konsoliduj do `.agents/` a nahraď pointery
- [ ] Spusť `/sync-docs` — vyřeš všechny warnings
- [ ] Domluv s týmem, že před každým „hotovo" se spustí `/sync-docs`

---

## Sanity check po setupu

Po dokončení by mělo platit:

- [ ] Nový kolega otevře `README.md` → ví co to je
- [ ] Nový kolega otevře `ONBOARDING.md` → ví co dělat první týden
- [ ] AI agent otevře `AGENTS.md` → najde kam pro daný úkol
- [ ] Pro libovolnou top-level složku platí: otevřu `CONTEXT.md` → vím co tam je
- [ ] `/sync-docs` projde bez warnings

---

## Časté chyby při setupu

| Chyba | Důsledek | Oprava |
|---|---|---|
| Detail v AGENTS.md místo CONTEXT.md | AGENTS.md zastará rychle | Detail přesunout do CONTEXT.md, AGENTS.md slim |
| Šablona vyplněná jen napůl (zůstaly `{{ placeholder }}`) | AI nebo kolega narazí na nesmysly | Vždy projdi celý soubor po zkopírování |
| Chybí `CONTEXT.md` v některých složkách | Routing v AGENTS.md odkazuje do prázdna | Doplň alespoň minimální CONTEXT.md |
| AGENTS.md má staré názvy složek | AI agenti dostávají špatný routing | Spusť `/sync-docs` a oprav |
| `99-archive/` se aktivně upravuje | Ztratíš historickou referenci | Archiv = read-only, jen čtení |
