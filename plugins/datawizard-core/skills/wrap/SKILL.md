---
name: wrap
description: Zabalí aktuální pracovní úsek — appenduje strukturovaný log do dnešního sessions/build-session-YYYY-MM-DD.md, smaže .active pointer, připraví na /clear. Použij když uživatel napíše /wrap nebo chce uzavřít úsek.
---

# /wrap — Session wrap

Proveď následující kroky v pořadí:

## Krok 1 — Zjisti název okna a čas začátku

Zeptej se:
> „Jaké je jméno tohoto okna? (A, B, nebo téma)"

Počkej na odpověď. Pak najdi soubor `sessions/.active-<název>` a přečti z něj čas začátku úseku.

Pokud soubor neexistuje — zeptej se uživatele na čas začátku ručně.

## Krok 2 — Vstup od uživatele

Zeptej se:
> „Co chceš zdůraznit z tohoto úseku? (nebo Enter pro přeskočení)"

Počkej na odpověď.

## Krok 3 — Najdi nebo vytvoř sessions složku

Zkontroluj, jestli v aktuálním projektu (working directory nebo nejbližší nadřazená složka s CLAUDE.md) existuje složka `sessions/`.

**Pokud neexistuje:** vytvoř ji.

## Krok 4 — Appenduj úsek do dnešního souboru

Soubor: `sessions/build-session-YYYY-MM-DD.md` (dnešní datum).

- **Pokud soubor neexistuje:** vytvoř ho s hlavičkou:
  ```markdown
  ---
  title: Build session — YYYY-MM-DD
  date: YYYY-MM-DD
  type: session-log
  ---

  # Build session — YYYY-MM-DD
  ```

- **Vždy appenduj** na konec souboru nový úsek:

```markdown

## Úsek HH:MM–HH:MM [okno-<název>]
**Téma:** [krátký popis co se řešilo]

### Poznámka od Karla
[co uživatel napsal v Kroku 2, nebo "(bez poznámky)"]

### Co bylo uděláno
[Seřazený seznam — technické detaily, soubory, rozhodnutí, proč se volilo to nebo ono]

### Soubory upraveny / vytvořeny
[Seznam souborů s krátkým popisem změny]

### Co šlo zbytečně složitě
[Upřímná reflexe: kde si Claude a uživatel nerozuměli, co trvalo moc dlouho, co se muselo opakovat]

### Jak dát příště lepší instrukci
[Konkrétní tipy — co říct jinak, co upřesnit předem]
```

Čas začátku: z `.active-<název>` souboru.
Čas konce: aktuální čas.

## Krok 5 — Smaž pointer soubor

Smaž `sessions/.active-<název>` — úsek je uzavřen.

## Krok 6 — Informuj uživatele

Vypiš:
- „Úsek [okno-<název>] HH:MM–HH:MM zapsán do sessions/build-session-YYYY-MM-DD.md"
- Připomenutí: **„Teď spusť `/clear` a pak `/start` pro nový úsek."**

## Pravidla

- Buď upřímný v sekci „Co šlo zbytečně složitě" — to je nejhodnotnější část logu
- Nezlehčuj chyby ani zmatené instrukce — zapiš co se skutečně stalo
- Sekce „Jak dát příště lepší instrukci" má být konkrétní, ne obecná
- Appenduj vždy — nikdy nepřepisuj existující obsah souboru
