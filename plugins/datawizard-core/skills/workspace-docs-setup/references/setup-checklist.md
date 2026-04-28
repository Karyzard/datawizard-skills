# Setup Checklist — Workspace Documentation System

Checklist pro **zavedení standardu** v novém nebo existujícím workspace.

> Reference: [`~/.claude/rules/workspace-docs-system.md`](../../rules/workspace-docs-system.md)

---

## Nový workspace (greenfield)

- [ ] **Krok 1 — Root soubory**
  - [ ] Zkopíruj `README.md` z templates → vyplň placeholdery
  - [ ] Zkopíruj `AGENTS.md` z templates → uprav routing tabulku pro tento workspace
  - [ ] Zkopíruj `ONBOARDING.md` z templates → uprav role a kontaktní osoby
  - [ ] (Volitelně) Vytvoř `DEVELOPMENT-PROCESS.md`, `TODO.md`, `IDEAS.md`

- [ ] **Krok 2 — Top-level složky**
  - [ ] Vytvoř top-level složky s prefix čísly (`0X-`, `1X-`, ...)
  - [ ] Do každé vlož `CONTEXT.md` z templates
  - [ ] Vyplň placeholdery v každém CONTEXT.md (k čemu složka, podsložky, čtení)

- [ ] **Krok 3 — Automatizace**
  - [ ] Vytvoř `.claude/templates/` a vlož kopii `CONTEXT.md`
  - [ ] Vytvoř `.claude/commands/sync-docs.md` z templates
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

- [ ] Vytvoř `.claude/commands/sync-docs.md` z templates
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
