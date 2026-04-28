# Backlog Builder – příklady a šablony

## Obsah
1. [Kompletní příklad: Habit Tracker backlog](#příklad-habit-tracker-backlog)
2. [Šablona prázdného backlogu](#šablona-prázdného-backlogu)

---

## Příklad: Habit Tracker backlog

### Boulders (5/10)

| # | Boulder | Popis | MoSCoW |
|---|---------|-------|--------|
| B1 | Denní tracking | Základní sledování návyků – přidání, check-off, přehled | Must |
| B2 | Streak & motivace | Počítadlo dní v řadě, progress, celebrations | Must |
| B3 | Statistiky | Týdenní/měsíční přehledy a trendy | Should |
| B4 | Notifikace | Push reminders, nastavení časů | Should |
| B5 | Sociální funkce | Sdílení, přátelé, challenges | Could |

### Boulder B1: Denní tracking → Rocks

| # | Rock | Typ | MoSCoW | Odhad |
|---|------|-----|--------|-------|
| R1.1 | Seznam dnešních návyků | Epic | Must | M |
| R1.2 | Toggle splnění návyku | Epic | Must | S |
| R1.3 | Přidání nového návyku | Epic | Must | M |
| R1.4 | Úprava/smazání návyku | Super US | Should | S |
| R1.5 | Persistence dat | Epic | Must | M |

### Rock R1.1 → Gravel (User Stories)

| # | User Story | MoSCoW | SP |
|---|-----------|--------|-----|
| US-1.1.1 | Jako uživatel chci vidět seznam svých návyků pro dnešní den, abych věděl co mám splnit | Must | 3 |
| US-1.1.2 | Jako uživatel chci vidět emoji a název u každého návyku, abych je rychle rozeznal | Must | 2 |
| US-1.1.3 | Jako uživatel chci vidět které návyky jsem již splnil, abych měl přehled | Must | 2 |
| US-1.1.4 | Jako uživatel chci vidět dnešní datum a den v týdnu, abych měl kontext | Could | 1 |

### Rock R1.2 → Gravel

| # | User Story | MoSCoW | SP |
|---|-----------|--------|-----|
| US-1.2.1 | Jako uživatel chci jedním tapem označit návyk jako splněný, abych to zvládl za pár sekund | Must | 3 |
| US-1.2.2 | Jako uživatel chci vidět vizuální feedback při splnění (checkmark, barva), abych měl potvrzení | Must | 2 |
| US-1.2.3 | Jako uživatel chci moci "od-checknout" návyk pokud jsem klikl omylem | Should | 1 |

### Návrh Sprint 1

**Cíl:** Uživatel může vidět a splnit dnešní návyky s persistencí dat

**Kapacita:** ~20 SP

| User Story | SP | MoSCoW |
|-----------|-----|--------|
| US-1.1.1 Seznam návyků | 3 | Must |
| US-1.1.2 Emoji + název | 2 | Must |
| US-1.1.3 Stav splnění | 2 | Must |
| US-1.2.1 Toggle tap | 3 | Must |
| US-1.2.2 Vizuální feedback | 2 | Must |
| US-1.3.1 Formulář přidání | 3 | Must |
| US-1.5.1 Uložení do localStorage | 3 | Must |
| US-1.2.3 Od-checknutí | 1 | Should |
| US-1.1.4 Datum a den | 1 | Could |

**Celkem:** 20 SP

---

## Šablona prázdného backlogu

```markdown
# 📋 [Název produktu] – Product Backlog

## 🪨 Boulders (max. 10)

| # | Boulder | Popis | MoSCoW |
|---|---------|-------|--------|
| B1 | [...] | [...] | Must/Should/Could |
| B2 | [...] | [...] | [...] |

---

## Boulder B1: [Název]

### Rocks
| # | Rock | Typ | MoSCoW | Odhad |
|---|------|-----|--------|-------|
| R1.1 | [...] | Epic/Super US | [...] | XS-XL |

### Rock R1.1: [Název] → User Stories
| # | User Story | MoSCoW | SP |
|---|-----------|--------|-----|
| US-1.1.1 | Jako [...] chci [...] abych [...] | [...] | [...] |

---

## 🏃 Návrh Sprint 1

**Cíl:** [1 věta]
**Kapacita:** [X SP]

| User Story | SP | MoSCoW |
|-----------|-----|--------|
| [...] | [...] | [...] |

**Celkem:** [X] SP
```
