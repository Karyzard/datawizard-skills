# Discovery – příklady a šablony

## Obsah
1. [Kompletní příklad: Habit Tracker](#příklad-habit-tracker)
2. [Kompletní příklad: Interní reporting](#příklad-interní-reporting)
3. [Šablona prázdné specifikace](#šablona-prázdné-specifikace)

---

## Příklad: Habit Tracker

### Vstup
> Chtěl bych vytvořit appku na sledování návyků. Něco jednoduchého, co by mi pomohlo držet se pravidelných aktivit.

### Discovery Analýza
1. **Jádro problému:** Lidé chtějí budovat pozitivní návyky, ale nemají systém pro sledování a motivaci
2. **Kdo trpí nejvíc:** Lidé snažící se o self-improvement, kteří začínají nadšeně ale po týdnu přestanou
3. **Současné řešení:** Papírové kalendáře, excelovské tabulky, složité apps které jsou overkill
4. **Proč teď:** Nový rok, lidé dělají předsevzetí
5. **Rizika:** Předpokládáme, že problém je v trackování, ne v motivaci samotné

### Problem Statement
**Problém:** Lidé chtějí budovat zdravé návyky, ale většina pokusů selže do 2 týdnů kvůli chybějící viditelnosti pokroku a okamžité zpětné vazbě.

**Kontext:** Projevuje se nejvíc ráno (ranní rutina) a večer (reflexe dne). Typicky po rozhodnutí "od teď budu..."

**Dopad:** Frustrace ze selhání, ztráta sebedůvěry, opakované začínání od nuly.

**Současné řešení:**
- Papírové kalendáře (fungují, ale nejsou při ruce)
- Komplexní apps typu Habitica (overkill, příliš gamifikované)
- Nic (spoléhání na paměť - nefunguje)

### Target Persona
**Tomáš, 28, Software Developer**
- Věk: 25-35
- Technická zdatnost: vysoká
- Kontext: Používá telefon jako první věc ráno a poslední večer

**Motivace:** Chce mít pocit kontroly nad životem, vidět pokrok (i malý)

**Frustrace:** Existující apps příliš jednoduché nebo složité. Zapomene zalogovat → výčitky → vzdá to.

**Citát:** "Vždycky začnu s nadšením, ale po týdnu zapomenu. Pak mám výčitky a přestanu úplně."

### Jobs-to-be-Done
**Hlavní Job:** Když si uvědomím, že chci změnit život k lepšímu, chci jednoduchý systém pro sledování denních aktivit, abych viděl pokrok a udržel motivaci.

**Funkční:** Rychle (< 5 sekund) zaznamenat splnění, vidět historii a streak, připomenout ve správný čas
**Emocionální:** Cítit uspokojení při splnění, necítit vinu při vynechání
**Sociální:** Moci sdílet úspěch s přáteli (volitelně)

### Key User Flows
**Flow 1: Denní check-in (primární)**
- Trigger: Push notifikace / otevření app
- Kroky: Vidí návyky → Tapne = splněno → Vidí streak
- Úspěch: Všechny návyky do 30 sekund

**Flow 2: Přidání nového návyku**
- Trigger: Chce sledovat něco nového
- Kroky: "+" → Vybere/napíše → Nastaví frekvenci
- Úspěch: Nový návyk do 1 minuty

**Flow 3: Týdenní review**
- Trigger: Nedělní notifikace
- Kroky: Shrnutí týdne → Splněné/nesplněné → Úprava cílů
- Úspěch: Jasný přehled a plán

### Success Metrics
**North Star:** Týdenní aktivní uživatelé s alespoň 1 logem denně

| Metrika | Cíl | Jak měřit |
|---------|-----|-----------|
| Čas do prvního logu | < 10s | Analytics |
| 30-day retention | > 40% | Kohorty |
| Průměrný streak | > 5 dní | App data |

**Anti-metriky:** 10+ návyků (přetížení), nikdy neotevřou review (není hodnota)

---

## Příklad: Interní reporting

### Vstup
> Lidi v našem týmu (10 lidí) zapomínají posílat týdenní statusy. Vždycky musím dohánět.

### Discovery Analýza
1. **Jádro problému:** Manuální proces sběru informací je časově náročný a nespolehlivý
2. **Kdo trpí nejvíc:** Team lead (dohánění) + členové týmu (otravuje je to)
3. **Současné řešení:** Email/Slack reminder → manuální sběr → kompilace
4. **Proč teď:** Tým roste, manuální proces nescaluje
5. **Rizika:** Možná problém není v nástroji ale v kultuře/motivaci

### Problem Statement
**Problém:** Team leadové tráví 2-3 hodiny týdně sbíráním a kompilací statusů od členů týmu, protože neexistuje automatizovaný systém pro pravidelný reporting.

**Kontext:** Projevuje se každý pátek odpoledne, kdy je deadline pro týdenní status. Team lead musí individuálně dohánět 3-5 lidí z 10.

**Dopad:** Ztráta času team leada, frustrace na obou stranách, neúplné reporty pro management, zpoždění rozhodování.

**Současné řešení:**
- Slack reminder v kanálu (ignorovaný)
- Individuální DM (časově náročné)
- Excel tabulka kam nikdo nepíše (mrtvá)

### Target Persona
**Martin, 35, Team Lead (Engineering)**
- Věk: 30-40
- Technická zdatnost: vysoká
- Kontext: Řídí tým 10 vývojářů, reportuje managementu každé pondělí

**Motivace:** Mít aktuální přehled o práci týmu bez manuálního dohánění. Udržet si důvěru managementu.

**Frustrace:** "Píšu lidem každý pátek, ale polovina mi odpoví až v pondělí. A pak musím narychlo kompilovat report."

**Citát:** "Většinu pátků strávím víc času doháněním statusů než vlastní prací."

### Jobs-to-be-Done
**Hlavní Job:** Když přijde pátek, chci automaticky získat status od celého týmu, abych mohl rychle sestavit report bez dohánění.

**Funkční:** Automatický sběr, připomínky, kompilace do jednoho reportu, historické porovnání
**Emocionální:** Necítit se jako "otravný šéf", mít klid, že nic nechybí
**Sociální:** Působit organizovaně před managementem

### Key User Flows
**Flow 1: Týdenní sběr (primární)**
- Trigger: Pátek 14:00 automaticky
- Kroky: Systém pošle formulář → členové vyplní (3 otázky) → automatická kompilace
- Úspěch: 80%+ odpovědí do pátku 17:00

**Flow 2: Reminder a eskalace**
- Trigger: Člen nereagoval do 2 hodin
- Kroky: Automatický reminder → po dalších 2h notifikace team leadovi
- Úspěch: Team lead nemusí ručně dohánět

**Flow 3: Report review**
- Trigger: Pondělí ráno
- Kroky: Team lead otevře dashboard → vidí shrnutí → exportuje pro management
- Úspěch: Report hotový do 5 minut

### Success Metrics
**North Star:** % statusů odevzdaných včas (do pátku 17:00) bez manuálního zásahu

| Metrika | Cíl | Jak měřit |
|---------|-----|-----------|
| Včasná odpověď | > 80% | Timestamp odevzdání |
| Čas team leada na report | < 15 min | Self-report |
| Completeness | 100% | Žádné prázdné statusy |

**Anti-metriky:** Příliš dlouhé statusy (>5 min na vyplnění), copy-paste odpovědi (žádná hodnota)

---

## Šablona prázdné specifikace

```markdown
# 📱 [Název produktu] – Discovery Specifikace

## 🧠 Discovery Analýza
1. **Jádro problému:** [...]
2. **Kdo trpí nejvíc:** [...]
3. **Současné řešení:** [...]
4. **Proč teď:** [...]
5. **Rizika a předpoklady:** [...]

## 📋 Problem Statement
### Problém
[1-2 věty]
### Kontext
[Kdy a kde]
### Dopad
[Následky]
### Současné řešení
[Co nefunguje]

## 👤 Target Persona
### [Jméno], [Věk], [Role]
- Technická zdatnost: [...]
- Kontext použití: [...]
### Motivace
- [...]
### Frustrace
- [...]
### Citát
> "[...]"

## 🎯 Jobs-to-be-Done
### Hlavní Job
Když [situace], chci [akce], abych [výsledek].
### Funkční požadavky
1. [...]
### Emocionální požadavky
1. [...]

## 🔄 Key User Flows (3-5)
### Flow 1: [Název]
**Trigger:** [...]
**Kroky:** 1. [...] 2. [...] 3. [...]
**Úspěch:** [...]

## 📊 Success Metrics
### North Star
[Jedna metrika]
### Sekundární metriky
| Metrika | Cíl | Jak měřit |
|---------|-----|-----------|
### Anti-metriky
- [...]
```
