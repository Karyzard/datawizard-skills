# Pipeline Guide – Rapid Prototype Pipeline

Kompletní průvodce prototypovací pipeline s příklady a best practices.

---

## Pipeline Flow

### Přehled fází

```
Fáze 1: Discovery (5-15 min)
  Input:  Vágní nápad, problém, příležitost
  Output: Problem Statement, Persona, JTBD, User Flows (3-5), Metriky
  Skill:  product-discovery

Fáze 2: Wireframe (5-20 min)
  Input:  User Flows, Persona
  Output: ASCII wireframy, varianty A/B, flow diagram
  Skill:  wireframe-designer

Fáze 3: HTML Prototype (10-20 min)
  Input:  Wireframy, mood, barevnost
  Output: Kompletní HTML prototyp v jednom souboru
  Skill:  html-prototyper

Fáze 4: Implementation Spec (10-20 min)
  Input:  Prototyp + Discovery výstup
  Output: User Stories, Feature Specs, AI Implementation Prompty
  Skill:  implementation-spec
```

### Doplňkové skills

```
Backlog Builder     → Po Fázi 1, strukturovaný backlog (Boulders/Rocks/Gravel)
Branding Creator    → Po Fázi 1, slogan + logo + barvy
Business Case       → Před nebo po Fázi 1, obhajoba projektu
```

---

## Kdy přeskočit fázi

| Situace | Přeskočit | Důvod |
|---------|----------|-------|
| Máš jasný problém a personu | Fázi 1 | Discovery je hotová |
| Máš mockupy/wireframy | Fáze 1+2 | Začni od prototypu |
| Nepotřebuješ vizuální prototyp | Fázi 3 | Jdi rovnou do specs |
| Chceš jen validovat nápad | Fáze 2+3+4 | Stačí Discovery |
| Máš prototyp, chceš specs | Fáze 1+2+3 | Začni od Fáze 4 |

### Zkratkové cesty

```
Quick validation:    Discovery only (5-15 min)
Spec shortcut:       Discovery → Spec (15-35 min)
Visual demo:         Discovery → Wireframe → Prototype (20-55 min)
Full pipeline:       Discovery → Wireframe → Prototype → Spec (30-75 min)
With backlog:        Discovery → Backlog → Wireframe → Prototype → Spec
With branding:       Discovery → Branding → Wireframe → Prototype → Spec
```

---

## Iterační guidelines

### Kdy se vrátit o krok zpět

| Symptom | Příčina | Řešení |
|---------|---------|--------|
| Wireframe nedává smysl | Flows jsou vágní | Vrať se k Discovery, upřesni flows |
| Prototyp nevypadá správně | Wireframe je neúplný | Uprav wireframe nebo mood |
| Specs jsou příliš vágní | Discovery chybí detail | Doplň Discovery o detaily |
| Stakeholder nesouhlasí | Špatné předpoklady | Vrať se k Discovery, upřesni personu |

### Jak iterovat efektivně

1. **Zaměř se na jeden flow.** Neprototypuj celý produkt najednou – vyber 1 hlavní flow a projdi celou pipeline.
2. **Iteruj uvnitř fáze.** Než půjdeš dál, ověř kvalitu výstupu aktuální fáze.
3. **Nevracej se o víc než 1 krok.** Pokud wireframe nefunguje, nemusíš předělávat celou Discovery – uprav jen flows.
4. **Ukazuj průběžně.** Čím dřív ukážeš výstup stakeholderům, tím dřív zachytíš špatné předpoklady.

---

## Context Handoff Template

Při přechodu mezi fázemi použij tento formát pro předání kontextu:

```markdown
## 📦 Handoff: [Fáze X] → [Fáze Y]

### Dokončeno
- [Co bylo vytvořeno v předchozí fázi]
- [Klíčové rozhodnutí / vybraná varianta]

### Kontext pro další fázi
- **Persona:** [jméno, role, klíčová motivace]
- **Primární flow:** [který flow pokračujeme]
- **Klíčové artefakty:** [co předáváme – dokument, wireframe, HTML soubor]
- **Otevřené otázky:** [co ještě není rozhodnuto]

### Doporučený další krok
→ `[název-skillu]` s parametry: [modifikátory pokud relevantní]
```

### Příklady handoff přechodů

| Přechod | Co předat | Klíčové |
|---------|----------|---------|
| Discovery → Wireframe | User Flows, Persona, kontext | Vyber 1 flow k wireframování |
| Discovery → Backlog | Celý Discovery doc | Flows se stanou Rocks |
| Wireframe → HTML | Wireframy + mood + barvy | Uveď vybranou variantu (A/B) |
| HTML → Spec | HTML soubor + Discovery doc | Prototyp je vizuální reference |
| Branding → HTML | Color palette (hex), mood, slogan | Barvy přepíšou výchozí tokeny |
| Business Case → Discovery | MVP scope, success kritéria | Go/No-Go rozhodnutí |

---

## End-to-end příklad: Fairy Airport App

### Fáze 1: Discovery

**Vstup:** "Chceme appku, která provede cestovatele po letišti od příjezdu po gate."

**Výstup:**
```
Problem Statement: Cestovatelé (zejm. méně zkušení) prožívají stres
na letišti, protože nevědí kam jít a co dělat. 90% problémů se točí
kolem JISTOTY, ne informací.

Persona: Jana, 45, cestuje letadlem 1-2x ročně, střední tech zdatnost.
Motivace: Mít klid a jistotu. Frustrace: "Nevím jestli jdu správně."

User Flows:
1. Navigace k gate (primární)
2. Check-in proces
3. Nalezení služeb (WC, kavárna, lounge)

North Star Metric: % uživatelů co dorazí na gate bez dotazu na info
```

### Fáze 2: Wireframe

**Vstup:** Discovery výstup + Flow 1 (Navigace k gate)

**Výstup:**
```
┌─────────────────────────┐
│  Fairy     ✈️ PRG→BCN   │
├─────────────────────────┤
│                         │
│  Tvůj gate: B27         │
│  Za 45 minut            │
│                         │
│  ┌─────────────────┐    │
│  │  [mapa]         │    │
│  │  ● Jsi tady     │    │
│  │  ○ Gate B27     │    │
│  └─────────────────┘    │
│                         │
│  Další krok:            │
│  → Projdi security      │
│  Odhadovaný čas: 15 min │
│                         │
│  [▶ Naviguj mě]        │
└─────────────────────────┘
```

### Fáze 3: HTML Prototype

**Vstup:** Wireframe + mood: modern, calming + primary: #4A90D9

**Výstup:** Kompletní HTML soubor s:
- Header s letem a destinací
- Gate informace s countdown
- Mapa placeholder
- Kroky navigace
- CTA button
- Responsive, hover stavy, accessibility

### Fáze 4: Implementation Spec

**Výstup:**
```
US-001: Zobrazení gate informací
Jako cestovatel chci po zadání letu vidět svůj gate a čas,
abych věděl kam jít.

US-002: Krokový navigátor
Jako cestovatel chci vidět další krok cesty,
abych měl jistotu že jdu správně.

AI Prompt: "Vytvoř navigační app pro letiště. Core flow: uživatel
zadá číslo letu → vidí gate + mapu + kroky. React + Tailwind.
Reference design: [HTML prototyp]."
```

---

## FAQ

### Musím použít všechny fáze?
Ne. Pipeline je flexibilní – začni kde potřebuješ, přeskoč co nepotřebuješ.

### Můžu kombinovat skills?
Ano. Typické kombinace:
- Discovery → Backlog Builder → Implementation Spec (bez vizuálu)
- Discovery → Branding → HTML Prototyper (s brandem)
- Business Case → Discovery → Full pipeline (s obhajobou)

### Jak dlouho trvá celá pipeline?
- Quick & dirty: 15-30 minut
- S iteracemi: 1-2 hodiny
- Detailní specifikace: půl dne

### Co když výstup není dobrý?
1. Upřesni vstup (více kontextu, specifičtější)
2. Použij `--detailed` modifikátor
3. Iteruj: "Toto je dobré, ale změň [X]"
4. Vrať se o krok zpět a upřesni

### Jak formulovat vstup pro nejlepší výsledky?

| Špatně | Dobře |
|--------|-------|
| "Chci appku" | "Chci appku na sledování návyků pro lidi co chtějí zlepšit rutinu" |
| "Udělej to hezké" | "Mood: modern, playful. Barva: teal" |
| "Všechno" | "Zaměř se na Flow 1: Denní check-in" |

---

## Referenční skills

| Skill | Soubor | Účel |
|-------|--------|------|
| Product Discovery | `_skills/product-discovery/SKILL.md` | Nápad → Specifikace |
| Backlog Builder | `_skills/backlog-builder/SKILL.md` | Scope → Prioritizovaný backlog |
| Wireframe Designer | `_skills/wireframe-designer/SKILL.md` | Flows → ASCII obrazovky |
| HTML Prototyper | `_skills/html-prototyper/SKILL.md` | Wireframe → HTML prototyp |
| Implementation Spec | `_skills/implementation-spec/SKILL.md` | Vše → Specs pro AI kodéry |
| Branding Creator | `_skills/branding-creator/SKILL.md` | Brand identity |
| Business Case | `_skills/business-case/SKILL.md` | Obhajoba projektu |
