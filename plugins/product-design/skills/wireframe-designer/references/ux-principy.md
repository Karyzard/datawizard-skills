# UX principy a wireframing best practices

## Obsah
1. [Information hierarchy](#information-hierarchy)
2. [Gestalt principy](#gestalt-principy)
3. [Mobile vs Desktop patterns](#mobile-vs-desktop)
4. [Navigation patterns](#navigation-patterns)
5. [Edge cases a stavy](#edge-cases-a-stavy)
6. [Accessibility basics](#accessibility-basics)

---

## Information hierarchy

### Vizuální hierarchie (co vidí uživatel první)
1. **Hlavní nadpis / kontext** – Kde jsem? (název stránky, breadcrumb)
2. **Primární obsah** – Co je hlavní informace?
3. **Primární akce (CTA)** – Co mám udělat?
4. **Sekundární obsah** – Doplňkové informace
5. **Navigace** – Kam se můžu dostat?

### Pravidlo jednoho CTA
Každá obrazovka by měla mít **jednu jasnou primární akci**:
- Dashboard: "Označ návyk"
- Formulář: "Odeslat"
- Detail: "Koupit" / "Kontaktovat"

Pokud máš 2+ rovnocenné akce, uživatel váhá → konverze klesá.

### F-pattern (desktop) vs Thumb zone (mobile)

**Desktop – F-pattern čtení:**
```
████████████████████
████████████
████████████████████
████████
```
Uživatel skenuje zleva doprava, pak dolů po levé straně.

**Mobile – Thumb zone:**
```
┌─────────────┐
│  Těžko      │  ← Horní část = navigace, ne akce
│  dostupné   │
├─────────────┤
│  Přirozená  │  ← Střed = obsah
│  zóna       │
├─────────────┤
│  Snadné ★   │  ← Spodek = primární akce
│  dosažení   │
└─────────────┘
```

---

## Gestalt principy

### Blízkost (Proximity)
Prvky blízko u sebe vnímáme jako skupinu.
```
✅ Správně:          ❌ Špatně:
[Jméno]              [Jméno]
[______]             [______]
                     [Email]
[Email]              [______]
[______]             [Heslo]
                     [______]
[Heslo]
[______]
```

### Podobnost (Similarity)
Podobně vypadající prvky vnímáme jako příbuzné.
- Všechny primární buttony stejná barva
- Všechny karty stejný styl
- Konzistence = předvídatelnost

### Ohraničení (Closure)
Prvky v rámečku/kartě vnímáme jako celek.
```
┌─────────────────┐
│ 📋 Sekce 1      │  ← Karta = logický celek
│ • Položka A      │
│ • Položka B      │
└─────────────────┘
```

---

## Mobile vs Desktop

### Mobile-first patterns
| Pattern | Kdy použít | Příklad |
|---------|-----------|---------|
| **Full-width cards** | Seznam položek | Feed, chat, seznam úkolů |
| **Bottom sheet** | Sekundární akce | Filtry, nastavení, sdílení |
| **Tab bar** | Hlavní navigace (3-5 sekcí) | Home, Search, Profile |
| **Pull to refresh** | Aktualizace obsahu | Feed, inbox |
| **Swipe actions** | Rychlé akce na položce | Smazat, archivovat |

### Desktop patterns
| Pattern | Kdy použít | Příklad |
|---------|-----------|---------|
| **Sidebar** | Navigace s mnoha sekcemi | Admin, email, CRM |
| **Multi-column** | Přehled + detail | Master-detail, email |
| **Modal** | Potvrzení, formulář | Dialog, wizard |
| **Dropdown menu** | Mnoho akcí | Kontextové menu |
| **Data table** | Strukturovaná data | Backlog, reporty |

---

## Navigation patterns

### Hierarchická navigace
```
Home → Kategorie → Detail → Akce
[← Zpět vždy dostupné]
```

### Tab navigace (mobile)
```
┌─────────────────────────────┐
│                             │
│       [Obsah stránky]       │
│                             │
├──────┬──────┬──────┬───────┤
│ 🏠   │ 🔍   │ ➕   │ 👤    │
│ Home │Search│ Add  │Profile│
└──────┴──────┴──────┴───────┘
```

### Breadcrumb (desktop)
```
Home > Projekty > Habit Tracker > Backlog
```

### Stepper (wizard/onboarding)
```
(1)━━━━(2)━━━━○3○━━━━○4○
Info   Náhled  Potvrzení  Hotovo
```

---

## Edge cases a stavy

Každá obrazovka má minimálně 5 stavů:

### 1. Empty state (prázdný)
```
┌─────────────────────────┐
│                         │
│      📋                 │
│  Zatím nemáš žádné      │
│  návyky.                │
│                         │
│  [▶ Přidej první]       │
│                         │
└─────────────────────────┘
```
Vždy obsahuje: ilustraci/ikonu, vysvětlení, CTA.

### 2. Loading state
```
┌─────────────────────────┐
│                         │
│   ⏳ Načítání...        │
│   ░░░░░░░░░░            │
│                         │
└─────────────────────────┘
```
Nebo skeleton loading (šedé placeholdery).

### 3. Error state
```
┌─────────────────────────┐
│                         │
│   ❌ Něco se pokazilo   │
│   Zkus to znovu.        │
│                         │
│   [Zkusit znovu]        │
│                         │
└─────────────────────────┘
```

### 4. Partial state (částečně vyplněné)
Mezistav – některé položky jsou, ale ne všechny.

### 5. Ideal state (plný)
Normální stav s daty – to co většinou navrhujeme jako první.

### 6. Overflow state
Co se stane když je obsahu příliš mnoho? Scrollování, pagination, "Zobrazit více".

---

## Accessibility basics

### Kontrast
- Text: min. 4.5:1 (WCAG AA)
- Velký text (18px+): min. 3:1
- Interaktivní prvky: min. 3:1

### Touch targets (mobile)
- Minimum: 44×44px (Apple) / 48×48dp (Google)
- Spacing mezi targety: min. 8px

### Focus states
Vždy viditelný focus ring pro keyboard navigation:
```
Normal:    [Button]
Focused:   [Button] ← viditelný outline/ring
```

### Labels
- Každý input má viditelný label (ne jen placeholder)
- Ikony mají textový alt/tooltip
- Barva NIKDY jako jediný indikátor (red/green colorblind)
