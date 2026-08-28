# Anti-slop: co v textu nesmí být

Filtr, který se použije na každý text bez ohledu na kanál. Seřazeno podle toho, co Karla štve nejvíc. Prvních pět položek jsou věci, které z AI textů maže pokaždé.

Většinu položek chytí `scripts/slop-check.py`. Položky označené 👁 musí posoudit člověk.

## 1. Pomlčky uprostřed věty

Nejnápadnější AI signatura. Karel ji maže vždy.

Špatně:
> Postavil jsem prototyp — za jeden večer — a poslal ho kamarádovi.
> Rodiče konečně vědí, jestli jsou zapsaní – a to je celé.

Dobře:
> Postavil jsem prototyp za jeden večer a poslal ho kamarádovi.
> Rodiče konečně vědí, jestli jsou zapsaní. Víc jsem nechtěl.

Náhrady podle situace: čárka (vsuvka), dvojtečka (vysvětlení, výčet), závorka (poznámka), tečka (nová věta). Pomlčka zůstává jen v rozsahu (10–12 h, po–pá, 2024–2026) a jako oddělovač v tabulce.

## 2. Řetěz krátkých úderných vět a fragmentů

AI to používá jako rytmus. Karel to čte jako pózu.

Špatně:
> Ne teorie. Ne nástroje. Praxe.
> A ta energie neklesá. Nestagnuje. Roste.
> Většina firem to dělá špatně. Tečka.

Dobře:
> Nebude to teorie ani seznam nástrojů. Ukážu, jak to používám na vlastních projektech.
> A ta energie od té doby jen roste.
> Většina firem nasadí AI na jeden nástroj a čeká, že se zbytek vyřeší sám.

Pravidlo: nejvýš jedna krátká samostatná věta na text, nikdy dvě za sebou, jednoslovná věta nikdy, anafora („Bez X. Bez Y. Bez Z.") nikdy.

## 3. Trojice ze zvyku 👁

AI dává tři položky, i když jsou dvě nebo pět. Tři přídavná jména za sebou jsou skoro vždy vata.

Špatně:
> Rychlý, jednoduchý a přehledný systém.
> Ušetří čas, peníze a nervy.

Dobře:
> Systém, ve kterém rodič vidí, jestli je zapsaný.
> Ušetří obsluze telefonáty ve špičce.

Kontrola: jsou tři položky proto, že jich je opravdu tolik? Když ne, přepiš.

## 4. „Nejde jen o X, ale o Y"

Zní chytře, nic neříká, natahuje větu.

Špatně:
> Nejde jen o aplikaci. Jde o změnu způsobu práce.
> AI není jen nástroj, ale partner.

Dobře:
> Aplikace změnila jednu věc: rodiče už nevolají, jestli jsou zapsaní.

## 5. Otázka a odpověď jako copy trik

Špatně:
> Výsledek? Spokojení rodiče.
> Největší přínos? Úspora času.

Dobře:
> Rodiče píšou, že konečně vědí, jestli jsou zapsaní.

## 6. Falešné prozření a falešná hloubka 👁

AI předstírá aha moment nebo končí moudrem, které nic neříká.

Vyhni se: „Potvrdilo mi to jednu věc.", „Otevřelo mi to oči.", „Donutilo mě to zamyslet se.", „A tady je ta nepříjemná pravda:", „Pravda je taková:", „A tady to začíná být zajímavé.", „Technologie sama o sobě nestačí.", „Všechno začíná u lidí.", „Na konci dne...", „Závěrem lze říci...", „AI nenahradí člověka, člověk s AI nahradí člověka bez AI."

Dobře: konkrétní pozorování místo prozření.
> Na třech workshopech jsem viděl stejnou věc: lidé umí napsat prompt, ale nevědí, který svůj úkol mají AI zadat.

## 7. Ohrané metafory o AI

Vyhni se: kopilot vs. autopilot, data jsou nová ropa, digitální kolega, katalyzátor změny, páka na produktivitu, operační systém firmy, prompt je nový brief, mění pravidla hry.

## 8. Korporátní a AI slovník

Nepoužívat: leverage, synergie, holistický, transformační, průlomový, bezprecedentní, inovativní, špičkový, unikátní, robustní (mimo techniku), komplexní řešení, na míru šité, přidaná hodnota, best practice, pain point, odemknout potenciál, posunout na další úroveň, posouvají se, být součástí něčeho.

Používat opatrně (jen když je jasné v čem): klíčový, zásadní, efektivní, strategický, moderní.

## 9. Vata na začátku věty

Smazat: „Určitě,", „Samozřejmě,", „Jistě,", „Bezpochyby,", „Navíc,", „Kromě toho,", „Dále,", „Zajímavé je, že", „Stojí za zmínku, že", „Je důležité poznamenat, že", „Skvělá otázka!", „Rád bych vám...", „Dovolte mi...", „V dnešní době...", „Pojďme se ponořit do...".

Začni rovnou obsahem.

## 10. Plastová lidskost

Vyhni se: „A víte, co je na tom nejlepší?", „Pojďme si nalít čistého vína.", „Upřímně řečeno...", „Ale pozor...", „Dobrá zpráva? Špatná zpráva?", „A teď to nejdůležitější."

## 11. LinkedIn klišé

- „A tady je proč ↓"
- „Většina lidí to dělá špatně."
- „Dělám tohle deset let. Tady je, co jsem se naučil:"
- Každá věta na samostatném řádku s prázdným řádkem mezi (sloupec místo textu).
- „Nedávno mi jeden klient řekl..." bez konkrétního detailu.
- Sloupec emoji odrážek (✅ 🚀 💡).
- Pět a víc hashtagů.
- Číselný teaser nadpis: „Jedna hodina. Tři úkoly.", „5 chyb, které děláte".

## 12. Formát tam, kam nepatří

Hvězdičky, mřížky, tučné písmo a odrážky nemají co dělat v LinkedIn postu ani ve zprávě. V e-mailu jen výjimečně (tučný odkaz na ukázku, jedna zvýrazněná cena).

## 13. Interpunkce

- Vykřičník: nejvýš jeden na text, v e-mailu žádný.
- Tři tečky: jen když věta opravdu doznívá, ne jako přechod.
- Uvozovky české „takto", ne "takto".

## 14. Přesnost 👁

- Nevymýšlej čísla, citace, jména, studie, zákazníky.
- Hypotetický příklad označ jako hypotetický.
- Když nevíš: „zhruba", „zatím nevíme", „potřebuju ověřit", nebo `[DOPLNIT]`.
- Nepiš „ještě týž den" nebo „za deset minut", pokud to není ověřené. Úderné časy jsou častá lež.

## Nejsilnější signál je kombinace

Jedna fráze ještě není slop. Spolehlivý detektor je kombinace: antiteze „není X, je Y" plus trojice plus grandiózní závěr plus nula konkrétních čísel nebo jmen. Rychlý test: mohl by tenhle text viset na webu jakékoli konzultační firmy? Pak je to slop.

## Ruční checklist před odevzdáním

1. Spustil jsem `slop-check.py` a opravil všechny ERROR?
2. Je v prvních dvou větách konkrétní situace, ne teze?
3. Není v textu trojice ze zvyku?
4. Mají věty různou délku? Není tam řetěz krátkých?
5. Nekončí text falešným moudrem nebo moralizováním?
6. Jsou všechna čísla a jména ze vstupu, ne z mé hlavy?
7. Má text jednu výzvu nebo jeden další krok?
8. Přečteno nahlas: řekl by to Karel kamarádovi u piva?
