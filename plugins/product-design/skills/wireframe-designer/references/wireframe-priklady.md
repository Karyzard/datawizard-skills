# Wireframe příklady

## Obsah
1. [Mobile Dashboard](#mobile-dashboard)
2. [Formulář](#formulář)
3. [Seznam s akcemi](#seznam-s-akcemi)
4. [Onboarding stepper](#onboarding-stepper)
5. [Settings screen](#settings-screen)

---

## Mobile Dashboard

### Varianta A: Minimalistická
```
┌─────────────────────────┐
│ 👤              ⚙️      │
├─────────────────────────┤
│                         │
│  Čtvrtek 18.12.         │
│  🔥 5 dní v řadě        │
│                         │
│  ─────────────────────  │
│                         │
│  ☐ 💪 Cvičení           │
│  ☑ 📚 Čtení             │
│  ☐ 🧘 Meditace          │
│  ☑ 💧 Pít vodu          │
│                         │
│  ─────────────────────  │
│                         │
│  [████████░░] 2/4       │
│                         │
│           [➕]          │
└─────────────────────────┘
```

### Varianta B: Rozšířená s motivací
```
┌─────────────────────────┐
│ Ahoj Tomáši! 👋         │
│ Čtvrtek 18. prosince    │
├─────────────────────────┤
│                         │
│  🔥 Tvůj streak: 5 dní  │
│  "Jen 2 návyky zbývají!"│
│                         │
├─────────────────────────┤
│  📋 DNEŠNÍ NÁVYKY       │
├─────────────────────────┤
│                         │
│  ┌───────────────────┐  │
│  │ ☐ 💪 Cvičení      │  │
│  │    Obvykle: 7:00  │  │
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │
│  │ ☑ 📚 Čtení       │  │
│  │    ✅ Splněno 8:30│  │
│  └───────────────────┘  │
│                         │
│  [+ Přidat návyk]       │
│                         │
├─────────────────────────┤
│ [📊 Statistiky]  [⚙️]   │
└─────────────────────────┘
```

---

## Formulář

### Varianta A: Jednoduchý
```
┌─────────────────────────────┐
│ [← Zpět]  Nový návyk       │
├─────────────────────────────┤
│                             │
│  Název návyku               │
│  ┌─────────────────────┐   │
│  │ Cvičení              │   │
│  └─────────────────────┘   │
│                             │
│  Ikona                      │
│  [💪] [📚] [🧘] [💧] [🏃]  │
│  [🎵] [✍️] [🥗] [💤] [📱]  │
│                             │
│  Připomínka                 │
│  │ 7:00 ráno          ▼│   │
│                             │
│  [▶ Přidat návyk]           │
│                             │
└─────────────────────────────┘
```

### Varianta B: S preview
```
┌─────────────────────────────┐
│ [← Zpět]  Nový návyk       │
├─────────────────────────────┤
│                             │
│  ┌─────────────────────┐   │
│  │ ☐ 💪 Cvičení        │   │
│  │    Každý den, 7:00  │   │
│  └─────────────────────┘   │
│  ℹ️ Náhled jak bude vypadat │
│                             │
│  ─────────────────────────  │
│                             │
│  Název                      │
│  ┌─────────────────────┐   │
│  │ Cvičení              │   │
│  └─────────────────────┘   │
│                             │
│  Ikona: [💪 Vybrané ▼]     │
│                             │
│  Frekvence                  │
│  ● Každý den               │
│  ○ Pracovní dny             │
│  ○ Vlastní...               │
│                             │
│  Připomínka                 │
│  [●━━] Zapnuto  7:00       │
│                             │
│  [▶ Přidat návyk]           │
│                             │
└─────────────────────────────┘
```

---

## Seznam s akcemi

### Desktop tabulka
```
┌──────────────────────────────────────────────────────┐
│  📋 Product Backlog                    [+ Přidat]    │
├──────┬──────────────────┬────────┬───────┬──────────┤
│ ID   │ User Story       │ MoSCoW │ SP    │ Status   │
├──────┼──────────────────┼────────┼───────┼──────────┤
│ US-1 │ Zobrazení návyků │ Must   │ 3     │ ✅ Done  │
│ US-2 │ Toggle splnění   │ Must   │ 3     │ 🔄 In PR │
│ US-3 │ Přidání návyku   │ Must   │ 5     │ ○ To Do  │
│ US-4 │ Smazání návyku   │ Should │ 2     │ ○ To Do  │
├──────┴──────────────────┴────────┴───────┴──────────┤
│ [← Předchozí]                      [Další →]        │
└──────────────────────────────────────────────────────┘
```

---

## Onboarding stepper

```
┌─────────────────────────────┐
│                             │
│  (●)━━(○)━━(○)━━(○)        │
│   1    2    3    4          │
│                             │
├─────────────────────────────┤
│                             │
│  👋 Vítej v Habit Trackeru! │
│                             │
│  Začni přidáním svého       │
│  prvního návyku.            │
│                             │
│  Co chceš sledovat?         │
│                             │
│  ☐ 💪 Cvičení              │
│  ☐ 📚 Čtení                │
│  ☐ 🧘 Meditace             │
│  ☐ 💧 Pít vodu             │
│  ☐ ✍️ Vlastní...           │
│                             │
│            [Další →]        │
│                             │
│  Přeskočit                  │
└─────────────────────────────┘
```

---

## Settings screen

```
┌─────────────────────────────┐
│ [← Zpět]    ⚙️ Nastavení   │
├─────────────────────────────┤
│                             │
│  👤 PROFIL                  │
│  ─────────────────────────  │
│  Jméno         Tomáš     > │
│  Foto          [👤]      > │
│                             │
│  🔔 NOTIFIKACE              │
│  ─────────────────────────  │
│  Push          [●━━] Zap   │
│  Čas ranní     7:00      > │
│  Čas večerní   21:00     > │
│                             │
│  📊 DATA                    │
│  ─────────────────────────  │
│  Exportovat          [CSV]  │
│  Smazat vše         [🗑️]   │
│                             │
│  ℹ️ O APLIKACI              │
│  ─────────────────────────  │
│  Verze              1.0.0   │
│  Zpětná vazba           >  │
│                             │
└─────────────────────────────┘
```
