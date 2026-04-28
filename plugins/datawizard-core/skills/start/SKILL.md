---
name: start
description: Zahájí nový pracovní úsek — zapíše název okna a čas začátku do sessions/.active-<nazev>, připraví na pozdější /wrap. Použij když uživatel napíše /start nebo chce začít nový úsek práce.
---

# /start — Zahájení úseku

Proveď následující kroky:

## Krok 1 — Zeptej se na název okna

Zeptej se:
> „Jaké je jméno tohoto okna? (např. A, B, nebo téma jako 'admin')"

Počkej na odpověď.

## Krok 2 — Najdi sessions složku

Najdi složku `sessions/` v aktuálním projektu (working directory nebo nejbližší nadřazená složka s CLAUDE.md, max 3 úrovně výš).

Pokud neexistuje — vytvoř ji.

## Krok 3 — Zjisti aktuální čas a zapiš pointer soubor

Nejprve zjisti aktuální čas příkazem: `date +%H:%M`

Pak vytvoř soubor `sessions/.active-<název>` s obsahem:

```
<název>
<čas z date příkazu>
```

Příklad pro okno "A" spuštěné v 09:00:
```
A
09:00
```

Pokud soubor `.active-<název>` již existuje — přepiš ho (předchozí úsek byl ukončen wrapem nebo zapomenut).

## Krok 4 — Informuj uživatele

Vypiš:
- „Okno <název> aktivní od <čas>. Spusť /wrap až budeš chtít úsek uzavřít."
