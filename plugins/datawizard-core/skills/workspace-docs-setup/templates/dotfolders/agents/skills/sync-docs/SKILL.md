---
name: sync-docs
description: Zkontroluje a srovná konzistenci dokumentace workspace (AGENTS.md, README.md, CONTEXT.md, ONBOARDING.md) po změnách struktury složek. Použij, když uživatel řekne „jsem hotový", spustí /sync-docs, nebo po jakékoli změně top-level struktury.
---

# sync-docs — kontrola konzistence dokumentace

Spusť tuto kontrolu, když uživatel řekne „jsem hotový", „/sync-docs" nebo po jakékoli změně top-level struktury workspace.

## Co kontrolovat

### 1. Existující top-level složky vs. AGENTS.md routing tabulka

Vylistuj všechny top-level složky (číslované `0X-`, `1X-`, `7X-`, `9X-` + nečíslované jako `docs/`, `scripts/`). Tooling dot-složky (`.agents/`, `.claude/`, `.cursor/`, `.github/`, `.vscode/`) do mapy nepatří.

Porovnej s mapou složek v `AGENTS.md` sekce „Mapa složek (top-level)":

- **Chybí v AGENTS.md, ale složka existuje** → přidej řádek do tabulky
- **Je v AGENTS.md, ale složka neexistuje** → odstraň řádek (nebo přesuň do archivu)

### 2. CONTEXT.md ve všech top-level složkách

Pro každou top-level složku ověř, že existuje `<složka>/CONTEXT.md`.

Pokud **chybí**:
- Vytvoř ho podle šablony `.agents/templates/CONTEXT.md`
- Vyplň minimálně sekce: K čemu složka slouží, Podsložky, Související
- Ohlas uživateli, že byl vytvořen draft, ať ho zreviduje

### 3. README.md sekce „Struktura složky"

Porovnej tabulku v `README.md` sekce „Struktura složky" s reálnou strukturou. Stejná logika jako bod 1.

### 4. Datumy

Najdi v `README.md`, `AGENTS.md`, `ONBOARDING.md` a všech `CONTEXT.md` frontmatter `date:` a viditelné věty typu „Aktuální stav (měsíc rok)".

Pokud je datum starší než 2 měsíce a stav se mohl změnit (sprinty, fáze), upozorni uživatele a nabídni aktualizaci.

### 5. Mrtvé linky

Projdi všechny markdown linky v rootu (`README.md`, `AGENTS.md`, `ONBOARDING.md`, případně `DEVELOPMENT-PROCESS.md`) a ve všech top-level `CONTEXT.md`.

Pro každý relativní odkaz `[text](cesta)` ověř, že cílová cesta existuje. Mrtvé linky vypiš.

### 6. Zastaralé referenční odkazy

Hledej v dokumentaci zmínky o starých názvech složek (z dřívějších iterací struktury).

Workspace-specific mapping (uprav podle vlastní historie):

```
{{ stary-nazev/ }} → {{ novy-nazev/ }}
```

Pokud najdeš → oprav v daném souboru.

## Výstupní report

Po kontrole vypiš stručný report:

```
## Sync-docs report — YYYY-MM-DD

### ✓ V pořádku
- Mapa složek v AGENTS.md odpovídá realitě
- Všech N top-level složek má CONTEXT.md
- Žádné mrtvé linky

### ⚠ Opraveno automaticky
- Přidán <složka>/CONTEXT.md (draft) — projdi a doplň detail
- Aktualizována tabulka v README.md (přidán řádek pro <složka>)

### ❗ Vyžaduje rozhodnutí uživatele
- README.md sekce „Aktuální stav" má datum YYYY-MM — aktualizovat?
- Mrtvý link v <složka>/CONTEXT.md → opravit ručně
```

## Pravidla

1. **Nepřemazávej obsah CONTEXT.md** — pokud existuje, jen kontroluj a hlas problémy. Vytvářej jen chybějící.
2. **Nemazej** existující složky/soubory bez explicitního souhlasu uživatele.
3. Pokud jsi si nejistý jestli něco změnit nebo ne, **zeptej se uživatele** s konkrétním návrhem.
4. Drž se naming konvencí: kebab-case, bez diakritiky v názvech souborů.

## Reference

- Kanonické rules + routing: [`../../../AGENTS.md`](../../../AGENTS.md)
- Šablona CONTEXT.md: [`../../templates/CONTEXT.md`](../../templates/CONTEXT.md)
