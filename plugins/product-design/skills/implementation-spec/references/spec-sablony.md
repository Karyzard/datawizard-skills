# Implementation Spec – šablony a příklady

## Obsah
1. [Kompletní příklad: Habit Tracker spec](#příklad-habit-tracker-spec)
2. [User Story šablona](#user-story-šablona)
3. [Feature Spec šablona](#feature-spec-šablona)
4. [AI Prompt patterns](#ai-prompt-patterns)
5. [Datový model patterns](#datový-model-patterns)

---

## Příklad: Habit Tracker spec

### User Stories

#### Epic: Denní sledování návyků

**US-001: Zobrazení dnešních návyků**
**Jako** uživatel
**Chci** vidět své návyky pro dnešní den
**Abych** věděl co mám splnit

**Acceptance Criteria:**
- [ ] Seznam návyků se zobrazí při otevření app
- [ ] Každý návyk má název, emoji a checkbox
- [ ] Vidím které návyky jsem již splnil
- [ ] Vidím aktuální streak

**Priority:** 🔴 Must | **Estimate:** S

---

**US-002: Označení návyku jako splněného**
**Jako** uživatel
**Chci** jedním tapem označit návyk jako splněný
**Abych** to zvládl za pár sekund

**Acceptance Criteria:**
- [ ] Tap na návyk togglene stav
- [ ] Vizuální feedback (✓, změna barvy)
- [ ] Progress bar se aktualizuje
- [ ] Streak se přepočítá
- [ ] Stav se uloží a přetrvá refresh

**Edge Cases:**
- Všechny splněné → zobrazí se gratulace
- "Od-checkne" návyk → streak se přepočítá

**Priority:** 🔴 Must | **Estimate:** S

---

**US-003: Přidání nového návyku**
**Jako** uživatel
**Chci** přidat nový návyk ke sledování
**Abych** mohl rozšířit svou rutinu

**Acceptance Criteria:**
- [ ] Tlačítko "+" otevře formulář
- [ ] Zadám název a vyberu emoji
- [ ] Návyk se objeví v seznamu
- [ ] Limit max 10 návyků

**Priority:** 🔴 Must | **Estimate:** M

---

### Feature Spec: Streak Calculation

**Popis:** Počítá kolik dní v řadě uživatel splnil VŠECHNY návyky. Resetuje se na 0 při vynechání.

**Logika:**
```
streak = 0
for each day going backwards from yesterday:
  if all habits completed that day:
    streak++
  else:
    break
return streak
```

**Datové požadavky:**

| Entita | Atributy | Typ | Poznámka |
|--------|----------|-----|----------|
| Habit | id | uuid | Primary key |
| | userId | uuid | Foreign key |
| | name | string | Max 100 chars |
| | emoji | string | Single emoji |
| | createdAt | datetime | |
| HabitLog | id | uuid | Primary key |
| | habitId | uuid | Foreign key |
| | date | date | Den splnění |
| | completedAt | datetime | Čas splnění |

**Computed values:**
- `streak`: Počet po sobě jdoucích dní s HabitLog
- `completedToday`: Existuje HabitLog pro dnešní datum?
- `progress`: Počet splněných / celkový počet

**Edge cases:**
- Nový uživatel → streak = 0
- Dnes nesplněno → streak počítá od včerejška
- Habit přidán včera → nepočítá se do streak před vytvořením

---

### AI Prompt: Kompletní MVP

```
Vytvoř habit tracker aplikaci:

FUNKCE:
1. Seznam denních návyků s checkboxy
2. Přidání/smazání návyku (max 10)
3. Streak počítadlo (dny v řadě se všemi návyky splněnými)
4. Progress bar (kolik splněno dnes)
5. Persistence v localStorage

DATA MODEL:
- Habit: { id, name, emoji, createdAt }
- HabitLog: { id, habitId, date, completedAt }
- Streak: computed z HabitLog

UI STYL:
- Barva: Teal (#14b8a6)
- Font: Inter nebo system-ui
- Mobile-first, max-width 400px
- Rounded corners, subtle shadows

EDGE CASES:
- Prázdný stav → "Přidej první návyk" s CTA
- Všechny splněné → celebration feedback
- Nový den → reset dnešních splnění, zachovat streak
- Max 10 návyků → disable "přidat" tlačítko

Dodej jako jeden HTML soubor.
```

---

## User Story šablona

```markdown
#### US-[číslo]: [Název]
**Jako** [persona/role]
**Chci** [akce/funkce]
**Abych** [hodnota/benefit]

**Acceptance Criteria:**
- [ ] [Testovatelné kritérium 1]
- [ ] [Testovatelné kritérium 2]
- [ ] [Testovatelné kritérium 3]

**Edge Cases:**
- Když [situace], pak [chování]

**Priority:** 🔴 Must / 🟡 Should / 🟢 Could
**Estimate:** S / M / L / XL
```

### Checklist dobrých AC:
- Každé AC je **testovatelné** (ne "uživatel je spokojený")
- AC popisuje **výsledek**, ne implementaci
- AC je **konkrétní** ("zobrazí se checkmark" ne "vizuální feedback")
- AC pokrývá **happy path i edge cases**

---

## Feature Spec šablona

```markdown
### Feature: [Název]

**Popis:** [2-3 věty co a proč]

**Uživatelský flow:**
1. [Trigger]
2. [Akce uživatele]
3. [Reakce systému]
4. [Výsledek]

**UI Reference:** [Odkaz na wireframe/prototyp]

**Datové požadavky:**
| Entita | Atributy | Typ | Poznámka |
|--------|----------|-----|----------|
| [...] | [...] | [...] | [...] |

**API / Akce:**
| Akce | Vstup | Výstup | Side effects |
|------|-------|--------|--------------|
| [...] | [...] | [...] | [...] |

**Validace:**
- [Pravidlo 1]
- [Pravidlo 2]

**Error handling:**
- [Situace] → [Reakce]
```

---

## AI Prompt patterns

### Pattern 1: Postupné prompty (doporučeno)
```
Prompt 1: Setup a datový model
Prompt 2: UI komponenty (s referencí na prototyp)
Prompt 3: Hlavní flow a logika
Prompt 4: Edge cases a error handling
Prompt 5: Polish (animace, loading, feedback)
```

### Pattern 2: Kompletní zadání
```
Vytvoř [aplikaci] s těmito specifikacemi:

FUNKCE: [seznam features]
DATA: [datový model]
UI: [vizuální styl + reference na prototyp]
EDGE CASES: [seznam]
TECH: [framework/stack preference]
```

### Pattern 3: Cursor/Copilot specifický
```
@file:prototype.html Vytvoř [framework] komponentu
na základě tohoto prototypu. Zachovej stejný vizuální
styl. Přidej [specifická funkce] s edge cases:
- [case 1]
- [case 2]
```

### Pattern 4: Vercel v0 specifický
```
Vytvoř [komponenta] s těmito požadavky:
- Vizuál: [popis + barvy]
- Interakce: [co se děje při kliknutí]
- Responsive: mobile-first
- Data: [jaká data zobrazuje]
Styl: shadcn/ui, Tailwind CSS
```

---

## Datový model patterns

### Jednoduchý CRUD
```
Entity → Attributes → Types → Constraints
```

### Vztahy
```
User 1:N Habit (uživatel má mnoho návyků)
Habit 1:N HabitLog (návyk má mnoho logů)
```

### LocalStorage schema
```json
{
  "habits": [
    { "id": "uuid", "name": "Cvičení", "emoji": "💪", "createdAt": "ISO" }
  ],
  "habitLogs": [
    { "id": "uuid", "habitId": "uuid", "date": "YYYY-MM-DD", "completedAt": "ISO" }
  ]
}
```

### Computed values (nepersistovat, počítat)
- streak: z HabitLog
- completedToday: z HabitLog
- progress: z HabitLog + Habit count
- weeklyStats: z HabitLog aggregace
