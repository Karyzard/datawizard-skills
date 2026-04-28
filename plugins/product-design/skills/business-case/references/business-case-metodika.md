# Business Case Metodika

Detailní metodika business case analýzy s Value Path, Risk Management a příklady.

---

## Value Path – od výstupů k hodnotě

### Koncept

Value Path je framework z PRINCE2 Agile, který ukazuje cestu od toho, co dodáme, k reálné hodnotě:

```
Outputs → Outcomes → Benefits → Value
```

| Krok | Definice | Otázka |
|------|----------|--------|
| **Outputs** | Deliverables – co fyzicky dodáme | Co vytvoříme? |
| **Outcomes** | Nový operační stav po nasazení | Co se změní v chování/procesech? |
| **Benefits** | Měřitelné zlepšení plynoucí z outcomes | Jaké metriky se zlepší? |
| **Value** | Benefits v poměru k investici | Vyplatilo se to? |

### Klíčový princip

**Output ≠ Value.** Dodání appky (output) neznamená hodnotu. Hodnota vznikne, až uživatelé změní chování (outcome), což vede k měřitelnému zlepšení (benefit), které převáží investici (value).

### Příklad: Fairy Airport App

| Krok | Příklad |
|------|---------|
| **Output** | Mobilní appka s navigací po letišti |
| **Outcome** | Cestovatelé používají app místo hledání info tabulí |
| **Benefit** | 30% snížení dotazů na info, 25% méně zmeškaných letů |
| **Value** | ROI 3:1 – investice 500k, úspora 1.5M ročně na customer support |

---

## Risk Management Framework

### Definice

Riziko = nejistá událost, která pokud nastane, ovlivní dosažení cílů.

Dva typy:
- **Threat** – nejistá událost s negativním dopadem
- **Opportunity** – nejistá událost s pozitivním dopadem

### Probability/Impact Matrix

```
              Low Impact    Medium Impact    High Impact
High Prob.   [monitor]      [act]            [critical]
Med. Prob.   [accept]       [monitor]        [act]
Low Prob.    [accept]       [accept]         [monitor]
```

**Risk tolerance line** – hranice, nad kterou rizika eskalujeme do business case jako "major risks".

### Hodnocení rizik

Pro každé riziko ohodnoť:
- **Probability** – pravděpodobnost (Low/Medium/High nebo 1-3)
- **Impact** – dopad (Low/Medium/High nebo 1-3)
- **Proximity** – kdy může nastat (brzy/později/neznámo)
- **Score** = Probability × Impact

### Response strategie

**Pro threats (hrozby):**

| Strategie | Popis | Příklad |
|-----------|-------|---------|
| **Avoid** | Eliminuj příčinu | Změň scope, aby riziko neexistovalo |
| **Reduce** | Sniž P a/nebo I | Přidej testování, prototypuj |
| **Transfer** | Přesuň dopad | Pojistka, outsourcing rizikovéčásti |
| **Accept** | Vědomě akceptuj | Připrav contingency plán (Plan B) |

**Pro opportunities (příležitosti):**

| Strategie | Popis | Příklad |
|-----------|-------|---------|
| **Exploit** | Zajisti, že nastane | Investuj víc do oblasti příležitosti |
| **Enhance** | Zvyš P a/nebo I | Marketingová podpora |
| **Share** | Sdílej přínos (pain/gain) | Partnerství |
| **Accept** | Využij, pokud nastane | Bez aktivní akce |

---

## Business Case Šablona (prázdná)

```markdown
# Business Case: [Název projektu]

**Datum:** [YYYY-MM-DD]
**Autor:** [jméno]
**Verze:** 1.0

---

## 1. Reasons
[Proč to děláme? Jaký problém/příležitost řešíme?]

## 2. Business Options

### a) Do Nothing
[Co se stane, když neuděláme nic?]

### b) Do Minimum
[Nejmenší možný zásah]

### c) Do Something (doporučeno)
[Navrhovaný přístup]

## 3. Benefits

| # | Benefit | Měřitelnost | Kdo těží |
|---|---------|-------------|----------|
| B1 | | | |
| B2 | | | |
| B3 | | | |

## 4. Dis-benefits

| # | Dis-benefit | Dopad | Mitigace |
|---|-------------|-------|----------|
| DB1 | | | |
| DB2 | | | |

## 5. Costs

| Kategorie | Jednorázové | Průběžné |
|-----------|-------------|----------|
| Vývoj | | |
| Infrastruktura | | |
| Lidé | | |
| **Celkem** | | |

## 6. Timescale

| Fáze | Doba | Milestone |
|------|------|-----------|
| | | |

## 7. Investment Appraisal (Value Path)

| Outputs | Outcomes | Benefits | Value |
|---------|----------|----------|-------|
| | | | |

## 8. Major Risks

### Threats
| # | Threat | P/I | Response |
|---|--------|-----|----------|
| T1 | | | |

### Opportunities
| # | Opportunity | P/I | Response |
|---|-------------|-----|----------|
| O1 | | | |

## 9. MVP

**Scope:** [co je in/out]
**Předpoklad k ověření:** [co chceme zjistit]
**Success kritéria:** [jak poznáme úspěch]

---

**Doporučení:** Go / No-Go / Conditional Go
**Podmínky:** [pokud conditional]
```

---

## Příklad: Fairy Airport App Business Case

```markdown
# Business Case: Fairy Airport Navigation

## 1. Reasons
Cestovatelé (zejm. méně zkušení) prožívají stres na letišti.
90% problémů se točí kolem JISTOTY, ne informací. Letiště ztrácí
customer satisfaction a přetěžuje info countery.

## 2. Business Options

### a) Do Nothing
Info tabule a personál zůstávají. Customer satisfaction klesá,
náklady na support rostou o ~10% ročně.

### b) Do Minimum
Vylepšit stávající navigační značení. Jednorázově 200k.
Zlepší situaci o ~15%, ale neřeší personalizaci.

### c) Do Something (doporučeno)
Mobilní appka s personalizovanou navigací, real-time info,
krokový průvodce. Investice 500k, provoz 50k/rok.

## 3. Benefits
| # | Benefit | Měřitelnost |
|---|---------|-------------|
| B1 | Snížení dotazů na info o 30% | Počet interakcí na info |
| B2 | Zvýšení customer satisfaction o 20% | NPS score |
| B3 | Snížení zmeškaných letů o 25% | Počet no-show z důvodu navigace |

## 4. Dis-benefits
| # | Dis-benefit | Mitigace |
|---|-------------|----------|
| DB1 | Digitální propast – starší cestovatelé | Zachovat fyzické značení |
| DB2 | Závislost na připojení | Offline mód |

## 5. Costs
| Kategorie | Jednorázové | Průběžné |
|-----------|-------------|----------|
| Vývoj | 400k | - |
| Design + UX | 100k | - |
| Infrastruktura | - | 30k/rok |
| Support | - | 20k/rok |
| **Celkem** | **500k** | **50k/rok** |

## 7. Value Path
| Outputs | Outcomes | Benefits | Value |
|---------|----------|----------|-------|
| Mobilní app | Cestovatelé navigují sami | -30% dotazy, +20% NPS | ROI 3:1 za 2 roky |

## 8. Major Risks
### Threats
| T1 | Nízká adopce | M/H | Reduce: soft-launch, QR kódy na boarding pass |
| T2 | Technické problémy (GPS indoor) | M/M | Reduce: beacon technologie, fallback |

### Opportunities
| O1 | Partnerství s aerolinkami | M/H | Exploit: integrace do airline apps |

## 9. MVP
In: Navigace k gate pro 1 terminál
Out: Služby, multi-terminál, offline
Ověřit: Snížení dotazů na info o 15%+

**Doporučení:** Go
```

---

## MVP Definition Guidelines

### Co je MVP

MVP (Minimum Viable Product) je nejmenší verze produktu, která:
1. Řeší core problém pro core personu
2. Je dostatečně funkční pro reálné použití
3. Generuje data pro validaci předpokladů

### Co MVP NENÍ

- Není "worst case" scénář projektu
- Není nekvalitní verze plného produktu
- Není demo nebo prototyp (ten je krok PŘED MVP)
- Není "všechno, co zvládneme za X týdnů"

### Jak definovat MVP

1. **Identifikuj hlavní předpoklad** – co musí být pravda, aby produkt uspěl?
2. **Navrhni nejmenší experiment** – co nejmenšího můžu udělat, abych předpoklad ověřil?
3. **Definuj success kritéria** – jak poznám, že předpoklad platí?
4. **Ohranič scope** – co je IN a co je explicitně OUT

### Pravidla

- Must Have nesmí být víc než 60% celkového scope (MoSCoW)
- Pokud MVP trvá déle než 4-6 týdnů, je příliš velké
- MVP by mělo ověřovat JEDEN hlavní předpoklad, ne pět
- Po MVP vždy review: Go / Pivot / Kill
