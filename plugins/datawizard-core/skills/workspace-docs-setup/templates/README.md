# Workspace Docs Templates

Šablony pro standard dokumentace workspace (klient, projekt, app).

> **Reference / instrukce:** [`~/.claude/rules/workspace-docs-system.md`](../../rules/workspace-docs-system.md)

## Co je v této složce

| Soubor | Kam zkopírovat | Účel |
|---|---|---|
| `README.md` | `<workspace>/README.md` | Přehled workspace pro lidi |
| `AGENTS.md` | `<workspace>/AGENTS.md` | Routing tabulka pro AI agenty |
| `ONBOARDING.md` | `<workspace>/ONBOARDING.md` | Checklist pro nové členy týmu |
| `CONTEXT.md` | `<workspace>/<složka>/CONTEXT.md` + `<workspace>/.claude/templates/CONTEXT.md` | Rozcestník složky |
| `sync-docs.md` | `<workspace>/.claude/commands/sync-docs.md` | Slash command pro kontrolu konzistence |
| `setup-checklist.md` | (čti, neexportuj) | Krok za krokem postup setup nového workspace |

## Použití

### Nový workspace

```bash
# 1. Vytvoř workspace
mkdir -p ~/Documents/_KLIENTI/novy-klient
cd ~/Documents/_KLIENTI/novy-klient

# 2. Zkopíruj root templates
cp ~/.claude/templates/workspace-docs/README.md .
cp ~/.claude/templates/workspace-docs/AGENTS.md .
cp ~/.claude/templates/workspace-docs/ONBOARDING.md .

# 3. Setup .claude/
mkdir -p .claude/templates .claude/commands
cp ~/.claude/templates/workspace-docs/CONTEXT.md .claude/templates/
cp ~/.claude/templates/workspace-docs/sync-docs.md .claude/commands/

# 4. Vyplň placeholdery v root souborech (vyhledej {{ ... }})

# 5. Vytvoř první top-level složky a do každé CONTEXT.md
```

### Existující workspace (retrofit)

Postupuj podle [`setup-checklist.md`](setup-checklist.md).
