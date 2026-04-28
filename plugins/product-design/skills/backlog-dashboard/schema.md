# Data Schema — Backlog Dashboard

Referenční dokumentace datové struktury pro šablonu HTML backlog dashboardu. Objekt `DATA` v JavaScriptu načítá backlog v hierarchii Boulders → Rocks → Stories (PRINCE2 Agile Boulders-Rocks-Gravel).

---

## 1. Přehled

`DATA` je JavaScriptový objekt na vrcholu šablony `product-backlog/index.html`. Obsahuje:

- **Metadátové informace** o projektu a review
- **Kontext** a klíčový insight pro prioritizaci
- **Hierarchickou strukturu backlogu**: Boulders (balvany) → Rocks (kameny) → Stories (user stories)
- **Milníky** a **sprinty** pro plánování
- **Závislosti** mezi features a **otevřené otázky** k vyřešení

Všechna pole jsou vyžadována, pokud není uvedeno jinak. Prázdné pole `ac` u story je povoleno.

---

## 2. meta

Metadata projektu a review session.

| Pole | Typ | Povinné? | Validační pravidlo | Příklad |
|------|-----|----------|--------------------|---------|
| projectName | string | ano | neprázdný řetězec | `"FechtClub Pro"` |
| projectCode | string | ano | krátký kód (sidebar) | `"FEOS"` |
| reviewDate | string | ano | ISO datum (YYYY-MM-DD) | `"2026-03-14"` |
| reviewer | string | ano | jméno revieweru | `"David"` |
| source | string | ano | zdrojový dokument | `"IDEAS.md"` |
| devStart | string | ano | kdy začíná vývoj | `"květen 2026"` |

---

## 3. context

Kontextový shrnutí backlogu pro rychlé pochopení.

| Pole | Typ | Povinné? | Validační pravidlo | Příklad |
|------|-----|----------|--------------------|---------|
| summary | string | ano | 1–2 věty | `"MVP klientské appky stojí na 4 procesech. Tyto nápady jsou nadstavba."` |
| insight | string | ano | klíčový strategický insight | `"MVP řeší retenci reaktivně. Davidovy nápady přidávají proaktivní kanály."` |

---

## 4. boulders

Nejvyšší úroveň hierarchie — tematické celky (balvany). Max. cca 10 boulders.

| Pole | Typ | Povinné? | Validační pravidlo | Příklad |
|------|-----|----------|--------------------|---------|
| id | string | ano | formát B1, B2, … B10 | `"B1"` |
| name | string | ano | název boulderu | `"Proaktivní péče o klienta"` |
| moscow | string | ano | `must` \| `should` \| `could` \| `wont` | `"should"` |
| desc | string | ano | jedno-odstavcový popis | `"SOS tlačítko + průzkum spokojenosti…"` |
| reasoning | string | ano | důvod MoSCoW úrovně | `"Přímo podporuje KPI retence."` |

---

## 5. rocks

Střední úroveň — epiky nebo super user stories. Max. cca 100 rocks celkem.

| Pole | Typ | Povinné? | Validační pravidlo | Příklad |
|------|-----|----------|--------------------|---------|
| id | string | ano | formát R1.1, R1.2, R2.1… | `"R1.1"` |
| boulder | string | ano | musí odkazovat na `boulder.id` | `"B1"` |
| name | string | ano | název rocku | `"SOS tlačítko — klientská strana"` |
| type | string | ano | `"Epic"` \| `"Super User Story"` | `"Epic"` |
| moscow | string | ano | `must` \| `should` \| `could` \| `wont` | `"should"` |
| size | string | ano | `XS` \| `S` \| `M` \| `L` \| `XL` | `"M"` |

---

## 6. stories

User stories — nejnižší úroveň. Formát „Jako [role] chci [co] abych [proč]“.

| Pole | Typ | Povinné? | Validační pravidlo | Příklad |
|------|-----|----------|--------------------|---------|
| id | string | ano | formát US-1.1.1, US-1.1.2… | `"US-1.1.1"` |
| rock | string | ano | musí odkazovat na `rock.id` | `"R1.1"` |
| text | string | ano | text user story | `"Jako klient chci vidět tlačítko…"` |
| moscow | string | ano | `must` \| `should` \| `could` \| `wont` | `"should"` |
| sp | number | ano | Fibonacci: 1, 2, 3, 5, 8, 13 | `3` |
| ac | string[] | ano | acceptance criteria, může být `[]` | `["Na dashboardu je CTA", "Kliknutím se otevře formulář"]` |

---

## 7. milestones

Milníky v čase (např. release, dema, handover).

| Pole | Typ | Povinné? | Validační pravidlo | Příklad |
|------|-----|----------|--------------------|---------|
| id | string | ano | formát M1, M2… | `"M1"` |
| name | string | ano | název milníku | `"MVP Launch"` |
| date | string | ano | ISO datum | `"2026-06-15"` |
| status | string | ano | `planned` \| `in-progress` \| `done` \| `at-risk` | `"planned"` |
| deps | string[] | ano | ID rocků nebo stories, na nichž závisí | `["R1.1", "US-1.1.1"]` |
| desc | string | ano | krátký popis | `"Launch klientské appky pro pilotní kluby"` |

---

## 8. sprints

Sprinty pro přiřazení stories.

| Pole | Typ | Povinné? | Validační pravidlo | Příklad |
|------|-----|----------|--------------------|---------|
| id | string | ano | formát S1, S2… | `"S1"` |
| name | string | ano | název sprintu | `"Sprint 1 (post-MVP)"` |
| startDate | string | ano | ISO datum | `"2026-05-04"` |
| endDate | string | ano | ISO datum | `"2026-05-17"` |
| goal | string | ano | cíl sprintu (1 věta) | `"SOS flow klient → admin"` |
| capacity | number | ano | kapacita ve story pointech | `20` |
| defaultStories | string[] | ano | předvybrané story ID | `["US-1.1.1", "US-1.1.2"]` |

---

## 9. dependencies

Závislosti mezi features (feature X závisí na Y).

| Pole | Typ | Povinné? | Validační pravidlo | Příklad |
|------|-----|----------|--------------------|---------|
| feature | string | ano | název feature | `"SOS tlačítko (klient)"` |
| dep | string | ano | na čem závisí | `"Push notifikace (Proces 4 MVP)"` |

---

## 10. questions

Otevřené otázky k vyřešení (např. před nebo během implementace).

| Pole | Typ | Povinné? | Validační pravidlo | Příklad |
|------|-----|----------|--------------------|---------|
| id | string | ano | formát BQ-1, BQ-2… | `"BQ-1"` |
| text | string | ano | text otázky | `"SOS: Chceme trackovat SLA?"` |
| forWho | string | ano | kdo má odpovědět | `"David"` |

---

## 11. Validační pravidla (mezi poli)

1. **Hierarchie**
   - `rock.boulder` musí odkazovat na existující `boulder.id`
   - `story.rock` musí odkazovat na existující `rock.id`

2. **MoSCoW**
   - Všechna `moscow` pole musí být jedno z: `must`, `should`, `could`, `wont`
   - Doporučení: Must stories max. cca 60 % celkových SP (kvůli realistickému scope)

3. **Story points**
   - `story.sp` musí být Fibonacci: 1, 2, 3, 5, 8, 13

4. **Sprint přiřazení**
   - `sprint.defaultStories` musí obsahovat pouze existující `story.id`
   - Součet SP přiřazených stories by neměl překročit `sprint.capacity` (doporučení)

5. **Milníky**
   - `milestone.deps` musí obsahovat pouze existující `rock.id` nebo `story.id`

6. **Označení**
   - Boulder ID: `B1`…`B10`
   - Rock ID: `R1.1`, `R1.2`, `R2.1`…
   - Story ID: `US-1.1.1`, `US-1.1.2`…
   - Milestone ID: `M1`, `M2`…
   - Sprint ID: `S1`, `S2`…
   - Question ID: `BQ-1`, `BQ-2`…

---

## 12. Minimální platný příklad

```javascript
const DATA = {
  meta: {
    projectName: "Test Projekt",
    projectCode: "TST",
    reviewDate: "2026-03-14",
    reviewer: "Karel",
    source: "IDEAS.md",
    devStart: "květen 2026"
  },
  context: {
    summary: "Minimální backlog pro testování šablony.",
    insight: "Priorita je ověřit MVP core flow."
  },
  boulders: [
    { id: "B1", name: "Core flow", moscow: "must", desc: "Základní funkce.", reasoning: "Nutné pro launch." },
    { id: "B2", name: "Nice-to-have", moscow: "could", desc: "Vylepšení.", reasoning: "Po MVP." }
  ],
  rocks: [
    { id: "R1.1", boulder: "B1", name: "Epic A", type: "Epic", moscow: "must", size: "M" },
    { id: "R1.2", boulder: "B1", name: "Epic B", type: "Epic", moscow: "must", size: "S" },
    { id: "R2.1", boulder: "B2", name: "Epic C", type: "Epic", moscow: "could", size: "M" }
  ],
  stories: [
    { id: "US-1.1.1", rock: "R1.1", text: "Jako uživatel chci X abych Y", moscow: "must", sp: 3, ac: ["AC1"] },
    { id: "US-1.1.2", rock: "R1.1", text: "Jako uživatel chci Z abych W", moscow: "must", sp: 2, ac: [] },
    { id: "US-1.2.1", rock: "R1.2", text: "Jako admin chci …", moscow: "must", sp: 5, ac: ["AC1", "AC2"] },
    { id: "US-2.1.1", rock: "R2.1", text: "Jako klient chci …", moscow: "could", sp: 2, ac: [] },
    { id: "US-2.1.2", rock: "R2.1", text: "Jako klient chci …", moscow: "could", sp: 1, ac: [] }
  ],
  milestones: [
    { id: "M1", name: "MVP Launch", date: "2026-06-15", status: "planned", deps: ["R1.1", "R1.2"], desc: "Launch pro pilotní kluby." }
  ],
  sprints: [
    { id: "S1", name: "Sprint 1", startDate: "2026-05-04", endDate: "2026-05-17", goal: "Core flow A+B", capacity: 20, defaultStories: ["US-1.1.1", "US-1.1.2", "US-1.2.1"] }
  ],
  dependencies: [
    { feature: "Epic C", dep: "Epic A" }
  ],
  questions: [
    { id: "BQ-1", text: "Je scope Epic A definitivní?", forWho: "David" }
  ]
};
```
