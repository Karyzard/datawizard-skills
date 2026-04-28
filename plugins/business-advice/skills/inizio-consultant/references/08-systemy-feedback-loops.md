# Systémy & Feedback Loops

## Obsah
1. Black Box thinking
2. Vstupní podmínky a chaos theory
3. Iterační rychlost
4. A/B testování jako systém
5. Feedback loops
6. Concentrated thinking
7. Příklady z praxe INIZIO

---

## 1. Black Box thinking

### Princip:
Koukej na vstupy a výstupy, ne na vnitřek. Neotevírej black box, dokud neselže změna vstupů.

### Postup:
1. **Změř výstupy** – co systém produkuje?
2. **Změň vstupy** – jednoduché, 50% zlepšení za minuty
3. **Teprve pak** – lož do vnitřní komplexity
4. **Izoluj problémy systematicky** – jedna proměnná naráz

### Příklad:
- Landing page nekonvertuje (výstup: 2% konverze)
- Než přepisuj celou stránku, změň VSTUP:
  - Jiný zdroj trafficu? (input change)
  - Jiný headline? (první co zákazník vidí)
  - Jiný obrázek? (vizuální vstup)
- Často vyřeší problém bez zásahu do "vnitřku"

### Kdy otevřít black box:
- Vstupní změny nepomáhají
- Potřebuješ porozumět PROČ (ne jen CO)
- Systém je kritický a nelze experimentovat

---

## 2. Vstupní podmínky a chaos theory

### Butterfly effect v byznysu:
Malá změna vstupní podmínky = dramaticky jiný výsledek.

### Příklady vstupních podmínek:
- **Reklama**: Prvních 5 vteřin = zbytek je irelevantní, pokud nezaujmeš
- **Email**: Předmět = vstupní podmínka celé sekvence
- **Zaměstnanec**: První den = nastaví očekávání na roky
- **Zákazník**: Onboarding v prvních 24h = určuje LTV
- **Produkt**: Název = vstupní podmínka vnímání hodnoty

### Princip:
"Optimalizuj VSTUP, ne prostředek." 80% výsledku je ve vstupní podmínce.

### Matematika vstupních podmínek:
- A/B test vstupní podmínky (welcome screen): +10.5% paid aktivace
- = ~350 platících zákazníků/rok navíc
- = 1.7M Kč ročně
- Investice do změny: ~0 Kč (jen redesign jedné obrazovky)

---

## 3. Iterační rychlost

### Princip:
Rychlost iterace > kvalita první iterace.

### Proč:
- 10 iterací za měsíc × průměrná kvalita > 1 iterace za měsíc × vynikající kvalita
- Compound learning: každá iterace tě učí víc
- "Mapa není teritorium" – plánování ≠ výsledky, execution matters

### Jak zvýšit iterační rychlost:
1. **Zmenši scope** – testuj jednu věc, ne celý redesign
2. **Zkrať feedback loop** – 2 dny test, ne 2 měsíce
3. **Automatizuj měření** – dashboardy, ne ruční reporty
4. **Rozhoduj rychle** – 80% data stačí, nepotřebuješ 100%
5. **Kill losers fast** – nepokračuj s nefunkční variantou

### Matematika iterace:
- 10% zlepšení per iterace × 10 iterací = 1.1^10 = 2.59× zlepšení
- 10% zlepšení per iterace × 1 iterace = 1.1× zlepšení
- Rozdíl: 159% vs. 10% – POUZE díky rychlosti

---

## 4. A/B testování jako systém

### Honzův A/B testing framework:

**Fáze 1: Hypotéza**
- "Emocionální headline konvertuje lépe než racionální"
- Musí být testovatelná a specifická

**Fáze 2: Setup**
- 50/50 split traffic
- Minimálně 500 zobrazení na variantu
- Jedna proměnná (ne dva změny naráz!)

**Fáze 3: Test**
- Initial: 2 dny
- Winner: 14 dní
- Měř PROFIT, ne jen konverze

**Fáze 4: Vyhodnocení**
- Vítěz se stává novou kontrolou
- Poražený se archivuje (ne smaže – poučení)
- Nová hypotéza pro další test

### Co testovat (pořadí priority):
1. Headline / předmět emailu (50-300% swing)
2. Hlavní vizuál / thumbnail (50%+ swing)
3. CTA (text, barva, umístění)
4. Cena a platební možnosti
5. Copy (text stránky/emailu)
6. Layout / design

### POZOR:
- "Hezčí" ≠ "profitabilnější"
- Konverzky: nový "hezčí" design = -20% konverze = -2M Kč/rok
- Vždy měř na PROFIT, ne na estetiku

---

## 5. Feedback loops

### Typy feedback loops:

**Pozitivní (zesilující):**
- Více zákazníků → více testimonials → více důvěry → více zákazníků
- Více dat → lepší rozhodnutí → lepší výsledky → více dat
- Virální koeficient > 1 → exponenciální růst

**Negativní (stabilizující):**
- Růst → komplexita → zpomalení → stabilizace
- Více zákazníků → více supportu → méně času na akvizici → méně zákazníků

### Jak budovat pozitivní feedback loops:
1. **Identifikuj loop** – co zesiluje co?
2. **Odstraň tření** – kde loop zpomaluje?
3. **Automatizuj** – loop musí běžet bez manuálního zásahu
4. **Měř** – dashboardy ukazující loop v reálném čase

### Příklad virálního feedback loopu:
- Zákazník koupí → zákazník má výsledek → zákazník sdílí → nový zákazník
- Koeficient 1.3 = exponenciální růst (roste rychleji než x²)

---

## 6. Concentrated thinking

### Princip:
"Hluboké přemýšlení o jednom problému dny/týdny > povrchní multitasking."

### Compound interest na intelektuální práci:
- 3 hodiny deep work denně = miliardářská metrika
- Compound interest platí i na myšlení
- Identifikuj a odstraň "narrow bottlenecks" iterativně

### Sherlock Holmes metodologie:
1. **Sbírej data obsesivně** – před rozhodováním
2. **Ignoruj irelevantní informace** – social media, news, drby
3. **Formuj teorie z dat** – ne data z teorií
4. **1 hodina pozorování > 2 hodiny konverzace**
5. **Disciplína ignorovat nepotřebné**

### Pravidla deep work:
- Blokuj 3h denně bez přerušení
- Žádný telefon, email, Slack
- Jeden problém per session
- Zapiš výstupy ihned po session

---

## 7. Příklady z praxe INIZIO

### A/B testing systém:
- 125+ video variací (5×5×5)
- 2 dny initial test per variace
- 14 dní winner testing
- Měření: retention drops, CPA, close rate, PROFIT
- Neustálý loop: test → vyhodnoť → nová hypotéza → test

### Entry condition optimization:
- Balenciaga pozadí vs. kontrola: +7% registrace
- Zjednodušená welcome screen: +10.5% paid aktivace
- Bílé vs. černé pozadí landing page: +44% konverze
- Méně polí ve formuláři: +15% completion
- Celkem po optimalizaci: 45.96% konverze na cold traffic

### Pareto analýza:
- 26 týdnů sledování práce s hodnotou
- 80% hodnoty ($2.3M USD) = 2 týdny práce
- 24 týdnů = $450K USD
- Poučení: Najdi své "2 týdny" a dělej JEN to

### Newtonovy zákony aplikované na produktivitu:
- Těleso v klidu zůstává v klidu (prokrastinace má setrvačnost)
- Těleso v pohybu zůstává v pohybu (momentum)
- "Body follows mind" – začni se hýbat a motivace přijde
- Studená sprcha jako trénink disciplíny a setrvačnosti
