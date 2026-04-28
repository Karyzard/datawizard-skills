# Design Thinking – Kompletní metodika

## Obsah
1. [Pět fází Design Thinking](#pět-fází-design-thinking)
2. [Empatie – techniky](#empatie--techniky)
3. [Definice problému](#definice-problému)
4. [Ideace](#ideace)
5. [Jobs-to-be-Done framework](#jobs-to-be-done-framework)
6. [5× Proč technika](#5-proč-technika)
7. [Stakeholder analýza](#stakeholder-analýza)
8. [Metriky úspěšnosti](#metriky-úspěšnosti)

---

## Pět fází Design Thinking

Design Thinking není lineární proces. Jde o rychlé smyčky učení.

### I. Empatie – Porozumění uživatelům
- **Co to znamená:** Hluboké pochopení pocitů, potřeb a motivací uživatelů
- **Metody sběru:** Pozorování, rozhovory, imerzní zkušenosti
- **Nástroj:** Empathy Map – pro hlubší pochopení a identifikaci potřeb
- **Klíčová otázka:** "Co uživatel skutečně prožívá?"

### II. Definice – Vymezení problému
- **Analýza informací:** Zpracování a organizace dat z empatie
- **Point of View (POV):** Formulace uživatelských potřeb a výzev
- **Převod:** Široké výzvy → konkrétní problémy k řešení
- **Klíčová otázka:** "Jaký je skutečný problém, ne jen symptom?"

### III. Nápad – Generování řešení
- **Brainstorming:** Efektivní techniky, post-it poznámky, digitální nástroje
- **Výběr:** Kritéria pro hodnocení a výběr řešení k prototypování
- **Kreativní důvěra:** Myšlení mimo rámec, přijímání rizika
- **Klíčová otázka:** "Jaké všechny možnosti existují?"

### IV. Prototyp – Vytvoření modelu
- **Účel:** Nástroj na přemýšlení, nahrazuje diskuze, odhaluje předpoklady
- **Techniky:** Papírové náčrty, Figma, klikací prototypy, fake data + fake UI
- **Iterace:** Upravovat a zlepšovat na základě zpětné vazby
- **Klíčová otázka:** "Co si tímhle prototypem chci ověřit?"

### V. Testování – Ověření a iterace
- **Prezentace:** Ukázat prototyp reálným uživatelům
- **Analýza:** Vyhodnotit reakce a poznatky
- **Iterace:** Opakované testování a úpravy až k finálnímu řešení
- **Klíčová otázka:** "Co jsem se naučil? Co musím změnit?"

---

## Empatie – techniky

### Empathy Map
```
        CO ŘÍKÁ              CO DĚLÁ
   ┌──────────────┬──────────────┐
   │              │              │
   │  Citáty,     │  Chování,    │
   │  výroky      │  akce        │
   │              │              │
   ├──────────────┼──────────────┤
   │              │              │
   │  Pocity,     │  Myšlenky,   │
   │  emoce       │  přesvědčení │
   │              │              │
   └──────────────┴──────────────┘
        CO CÍTÍ              CO SI MYSLÍ
```

### Rozhovor s uživatelem – best practices
1. Otevřené otázky ("Řekněte mi o..." ne "Líbí se vám...?")
2. Poslouchej, neptej se na řešení
3. Sleduj emoce a frustrace
4. Neptej se "co byste chtěli" – lidi nevědí, co chtějí
5. Ptej se na konkrétní situace z minulosti

---

## Definice problému

### Problem Statement šablona
```
[Persona] potřebuje [potřeba] protože [insight].
```

### Point of View (POV) šablona
```
Zjistili jsme, že [persona] je frustrovaná z [problém],
protože [root cause]. Kdyby existoval způsob jak [řešení],
pomohlo by jí to [benefit].
```

### How Might We (HMW) otázky
Transformují problém do tvůrčí výzvy:
- "Jak bychom mohli..." + [aspekt problému]
- Příklad: "Jak bychom mohli pomoct Tomášovi udržet si návyky i po prvním týdnu?"

---

## Ideace

### Brainstorming pravidla (IDEO)
1. **Defer judgment** – žádná kritika během generování
2. **Go for quantity** – čím víc, tím líp
3. **Build on ideas** – "Ano, a..." místo "Ano, ale..."
4. **Stay focused** – drž se tématu
5. **One conversation** – mluví jeden
6. **Be visual** – kresli, ukazuj
7. **Encourage wild ideas** – bláznivé nápady vítány

### Dot Voting
- Každý člen týmu dostane 3 hlasy (tečky)
- Hlasuje se pro nejslibnější nápady
- Rychlá demokratická selekce

### Impact/Effort Matrix
```
         Vysoký impact
              │
    Quick     │    Big
    Wins ★    │    Bets
              │
  ────────────┼────────────
              │
    Fill-ins  │    Money
              │    Pits ✗
              │
         Nízký impact
  Nízký effort         Vysoký effort
```

---

## Jobs-to-be-Done framework

### Formát
```
Když [situace/kontext],
chci [motivace/akce],
abych [očekávaný výsledek].
```

### Tři dimenze
1. **Funkční** – Co produkt musí prakticky umět?
2. **Emocionální** – Jak se chci cítit při používání?
3. **Sociální** – Jak chci být vnímán ostatními?

### Příklad
```
Funkční: "Chci rychle zalogovat návyk" (< 5 sekund)
Emocionální: "Chci cítit uspokojení z pokroku"
Sociální: "Chci moci ukázat přátelům svůj streak"
```

---

## 5× Proč technika

Iterativní dotazování na root cause:

```
Problém: Uživatelé přestávají používat app po týdnu

1. Proč? → Zapomínají app otevřít
2. Proč? → Nemají návyk na otevírání app
3. Proč? → App jim nic nepřipomíná
4. Proč? → Nemáme push notifikace
5. Proč? → Implementovali jsme MVP bez notifikací

Root cause: Chybí engagement mechanismus (notifikace)
```

---

## Stakeholder analýza

### Power/Interest Matrix
```
              Vysoký zájem
                   │
    Keep           │    Manage
    Satisfied      │    Closely ★
                   │
  ─────────────────┼─────────────────
                   │
    Monitor        │    Keep
    (minimum)      │    Informed
                   │
              Nízký zájem
  Nízká moc               Vysoká moc
```

### Personas vs Stakeholders
- **Persona** = koncový uživatel (kdo produkt používá)
- **Stakeholder** = kdo je ovlivněn výsledkem (sponzor, tým, regulátor...)

---

## Metriky úspěšnosti

### Kvantitativní metriky
- Doba vývoje produktu
- Náklady na prototypování
- Úspora díky rychlé iteraci
- Počet iterací do finální verze
- Time to first value

### Kvalitativní metriky
- Uživatelská spokojenost (NPS, CSAT)
- Kvalita prototypů
- Týmová spokojenost
- Stakeholder buy-in

### North Star Metric
Jedna metrika, která nejlépe měří, zda produkt plní svůj účel:
- **Spotify:** Čas strávený posloucháním
- **Airbnb:** Počet rezervovaných nocí
- **Slack:** Počet odeslaných zpráv

### Anti-metriky
Co NECHCEME:
- Vanity metrics (stažení bez aktivního používání)
- Metrika, která se zlepšuje na úkor UX
- Vše co vypadá dobře na reportu, ale neodráží realitu

---

## Klíčové principy (z kurzu)

1. **Lidocentrický design** – Hluboké porozumění potřebám a motivacím lidí
2. **Kreativní sebevědomí** – Věřit ve schopnost vytvářet změnu
3. **Iterace místo selhání** – Selhání = příležitost k učení
4. **Multidisciplinární týmy** – Síla různorodosti v myšlení
5. **AI je akcelerátor, Design Thinking je kompas** – AI zrychluje tvorbu, ne porozumění
6. **Nedělám řešení proto, aby bylo hotové. Dělám ho proto, abych se něco rychle naučil.**
