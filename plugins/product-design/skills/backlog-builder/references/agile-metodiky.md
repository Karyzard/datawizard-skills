# Agile metodiky pro Backlog Builder

## Obsah
1. [Boulders-Rocks-Gravel detailně](#boulders-rocks-gravel)
2. [MoSCoW prioritizace](#moscow-prioritizace)
3. [I.N.V.E.S.T. kritéria](#invest-kritéria)
4. [User Story formát a příklady](#user-story-formát)
5. [Estimation techniky](#estimation-techniky)
6. [SCRUM artefakty](#scrum-artefakty)
7. [Value Path](#value-path)
8. [Fix vs Flex](#fix-vs-flex)

---

## Boulders-Rocks-Gravel

Třístupňový model dekompozice požadavků z PRINCE2 Agile:

```
┌─────────────────────────────────────────┐
│  BOULDERS (max. 10)                     │
│  Fáze: Pre-project                      │
│  = Největší funkční bloky               │
│  = Epiky / Témata                       │
│  Příklad: "Uživatelská autentizace"     │
├─────────────────────────────────────────┤
│  ROCKS (max. 100)                       │
│  Fáze: Initiation Stage                 │
│  = Super User Stories / velké celky     │
│  = Nesplňují I.N.V.E.S.T.              │
│  Příklad: "Registrace emailem"          │
├─────────────────────────────────────────┤
│  GRAVEL (100+)                          │
│  Fáze: Delivery Stage/s                 │
│  = User Stories                         │
│  = Splňují I.N.V.E.S.T.                │
│  = Potenciálně shippable                │
│  Příklad: "Jako uživatel chci..."       │
└─────────────────────────────────────────┘
```

### Kdy co definovat
| Úroveň | Počet | Fáze | Kdo definuje |
|---------|-------|------|-------------|
| Boulders | max. 10 | Pre-project | Product Owner + stakeholdeři |
| Rocks | max. 100 | Initiation | Product Owner + tým |
| Gravel | 100+ | Delivery | Product Owner + dev tým |

### Vztah k Epic/Story hierarchii
- **Boulder** ≈ Theme/Epic (velký, embryonický, skicovitý)
- **Rock** ≈ Super User Story (větší story, nesplňuje I.N.V.E.S.T.)
- **Gravel** ≈ User Story (splňuje I.N.V.E.S.T., potenciálně shippable)

---

## MoSCoW prioritizace

| Priorita | Význam | Pravidlo |
|----------|--------|----------|
| **Must** | Bez tohoto produkt nefunguje, nesmí být dodán bez | Max 60% scope |
| **Should** | Důležité, bolestivé vynechat, ale workaround existuje | Další v pořadí |
| **Could** | Chtěli bychom, malý dopad pokud chybí | Flexibilní buffer |
| **Won't** (this time) | Vědomě odloženo na později | Explicitní rozhodnutí |

### Klíčová pravidla
1. **Must ≤ 60%** – Pokud je víc, scope je příliš ambiciózní
2. **Won't není „never"** – Je to „not this time"
3. **Should + Could = buffer** – Flexibilita pro dodržení termínů
4. **Re-prioritizace** – MoSCoW se reviduje každý sprint

### Příklad rozložení
```
Celkový scope: 100 story points

Must:    55 SP (55%) ✓  ← Tyto MUSÍ být dodány
Should:  25 SP (25%)    ← Důležité, ale přežijeme bez nich
Could:   15 SP (15%)    ← Bonus, pokud zbude čas
Won't:    5 SP (5%)     ← Explicitně odloženo
```

---

## I.N.V.E.S.T. kritéria

Každá User Story by měla splnit:

| Písmeno | Kritérium | Co to znamená | Jak testovat |
|---------|-----------|---------------|-------------|
| **I** | Independent | Nezávislá na jiných stories | Lze dodat samostatně? |
| **N** | Negotiable | Vyjednatelná, ne rigidní kontrakt | Lze scope upravit? |
| **V** | Valuable | Přináší hodnotu uživateli | Proč to uživatel chce? |
| **E** | Estimable | Odhadnutelná | Umíme říct jak velká je? |
| **S** | Small | Malá, dodatelná v jednom sprintu | Vejde se do sprintu? |
| **T** | Testable | Testovatelná, jasná acceptance criteria | Jak poznáme, že je hotová? |

### Když story nesplňuje I.N.V.E.S.T.
- **Není Independent?** → Rozděl nebo spoj se závislou story
- **Není Small?** → Rozlož na menší stories (vertical slicing)
- **Není Testable?** → Dopiš acceptance criteria
- **Není Valuable?** → Zeptej se "proč to uživatel potřebuje?"

---

## User Story formát

### Základní formát
```
Jako [role/persona]       ← KDO
chci [funkci/akci]        ← CO
abych [hodnota/důvod]     ← PROČ
```

### S Acceptance Criteria
```
Jako uživatel habit trackeru
chci jedním tapem označit návyk jako splněný
abych měl rychlý přehled o svém pokroku

Acceptance Criteria:
- [ ] Tap na návyk změní stav (nesplněno ↔ splněno)
- [ ] Vizuální feedback (checkmark, změna barvy)
- [ ] Progress bar se aktualizuje
- [ ] Stav se uloží a přetrvá refresh
```

### Špatná vs dobrá story

**Špatně:**
```
Jako uživatel chci databázi abych měl data.
```
(Technická, ne hodnotová, netestovatelná)

**Dobře:**
```
Jako team lead chci vidět týdenní přehled splněných úkolů svého týmu,
abych na standupu nemusel všech obvolávat.

AC:
- [ ] Dashboard zobrazí tabulku: jméno, počet úkolů, % splnění
- [ ] Data za aktuální týden (Po-Pá)
- [ ] Možnost filtrovat po členovi týmu
```

---

## Estimation techniky

### T-shirt Sizing (pro Rocks)
| Velikost | Relativní složitost | Příklad |
|----------|-------------------|---------|
| XS | Triviální, hodiny | Změna textu, úprava barvy |
| S | Jednoduchá, den | Nový formulář, jednoduchý CRUD |
| M | Středně složitá, 2-3 dny | Feature s logikou, integrace |
| L | Složitá, týden | Komplexní feature, nový modul |
| XL | Velmi složitá, 2+ týdny | → Rozlož dál! |

### Story Points – Fibonacci (pro User Stories)
```
1  – Triviální (změna configu)
2  – Jednoduché (jednoduchá UI změna)
3  – Standardní (nová komponenta s logikou)
5  – Složitější (feature s edge cases)
8  – Komplexní (feature s integrací)
13 – Velmi složité (→ zvažuj rozdělení)
21 – Příliš velké (→ MUSÍŠ rozdělit)
```

### Planning Poker
1. Product Owner přečte story
2. Tým diskutuje (krátce)
3. Všichni najednou ukáží kartu s odhadem
4. Diskuze o extrémech (nejvyšší vs nejnižší)
5. Opakuj dokud není shoda

**Proč relativní odhady?**
- "XL" je lepší než "4 dny" – velocita týmu se mění
- Porovnáváš story mezi sebou, ne s absolutním časem
- Velocity = kolik SP tým dodá za sprint (měřeno reálným dodáním)

---

## SCRUM artefakty

### Product Backlog
- Prioritizovaný seznam VŠECH požadavků
- Vlastní ho Product Owner
- Živý dokument – neustále se mění
- Seřazený: nejvyšší priorita nahoře

### Sprint Backlog
- Podmnožina Product Backlogu vybraná pro sprint
- Vlastní ho Development Team
- Commitment na Sprint Goal
- Nemění se během sprintu (scope)

### Increment
- Potenciálně shippable produkt
- Součet všech Product Backlog items dodaných ve sprintu
- Musí splňovat Definition of Done

### Backlog Grooming/Refinement
- Průběžná aktivita (ne event)
- Zpřesňování stories, dopisování AC
- Rozklad velkých stories na menší
- Re-prioritizace

---

## Value Path

```
Outputs → Outcomes → Benefits → Value

Outputs:   Výstupy plánované aktivity (kód, design, dokument)
Outcomes:  Nové provozní stavy z využití výstupů (uživatelé používají feature)
Benefits:  Měřitelná zlepšení z outcomes (méně support ticketů)
Value:     Přínosy v poměru k vloženým zdrojům (ROI)
```

### Value Matrix
```
         Vysoký benefit
              │
   Low effort │  High effort
   High value │  Medium value
   ★ START    │
   HERE       │
  ────────────┼────────────
   Low effort │  High effort
   Low value  │  Low value
              │  ✗ AVOID
              │
         Nízký benefit
```

---

## Fix vs Flex

Z PRINCE2 Agile – 5 cílů pro řízení projektu:

| # | Cíl | Fix/Flex |
|---|-----|----------|
| 1 | **Be on time** – dodržuj termíny | FIX |
| 2 | **Protect quality** – nekompromituj kvalitu | FIX |
| 3 | **Embrace change** – přijímej změny | FLEX scope |
| 4 | **Keep teams stable** – stabilní týmy | FIX |
| 5 | **Customer doesn't need everything** – ne vše musí být dodáno | FLEX features |

**Klíčový princip:** Fixuj čas a kvalitu, flexuj scope (features). Raději dodej méně, ale kvalitně a včas.
