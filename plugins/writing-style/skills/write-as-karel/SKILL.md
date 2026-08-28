---
name: write-as-karel
description: Použij, kdykoli má vzniknout text, který půjde ven Karlovým jménem, nebo má existující text projít kontrolou, aby nezněl jako AI. LinkedIn post, komentář, text nad karuselem, e-mail (cold, follow-up, nabídkový, odpověď na oslovení), zpráva na WhatsApp / Messenger / LinkedIn DM / Slack, cenová nabídka. Triggeruj na "napiš post", "napiš e-mail", "zpráva pro", "napiš to za mě", "přepiš to lidsky", "zní to jako AI", "zkontroluj text", "vyhoď pomlčky", "odslopuj", "/write-as-karel", i když uživatel jen nadiktuje surové poznámky a řekne "udělej z toho post". Komunikuj česky.
---

# Psaní Karlovým hlasem

Karel píše jako člověk, který vysvětluje chytrému kamarádovi u piva: konkrétní situace, přiznaná pochybnost, jeden další krok. Taste je hlavně to, co odmítá. Nejvíc ho štvou pomlčky uprostřed věty a krátké úderné fragmenty, které AI používá jako rytmus. Text, který tohle obsahuje, je špatně, i když je jinak dobrý.

Referenční soubory jsou vedle tohoto souboru v `references/`. Čti je, nespoléhej na paměť.

## Postup

### 1. Co píšu a s kým

Než napíšeš první větu, urči čtyři věci. Když některá není ze zadání jasná, zeptej se jednou větou (jen na tu jednu).

| Otázka | Kam to vede |
|---|---|
| **Kanál** (post, e-mail, zpráva, nabídka, komentář) | `references/channels/<kanál>.md` |
| **Vztah** (cizí majitel, kamarád, klient v běhu, LinkedIn publikum, tým) | `references/audiences.md` |
| **Jedna akce**, kterou má čtenář udělat (odepsat, prokliknout, odpovědět na otázku) | závěr textu |
| **Fakta**, která mám (jména, čísla, odkazy, souhlasy) | co smím napsat, co dostane `[DOPLNIT]` |

Vždy načti `references/voice.md` a `references/anti-slop.md`. Podle kanálu načti jeden soubor z `references/channels/`. Před prvním textem v session si přečti příklady v `references/examples/`, ať máš hlas v uchu.

### 2. Napiš

- První věta nese konkrétní moment, ne tezi.
- Věty různě dlouhé, odstavce na 1 až 4 řádky, mezi nimi vzduch.
- Nejvýš jedna krátká samostatná věta na celý text. Nikdy dvě za sebou. Jednoslovná nikdy.
- Tolik položek, kolik jich opravdu je. Ne tři ze zvyku.
- Čísla, jména, citace jen ze vstupu. Chybí-li: `[DOPLNIT: co]`. Nikdy nevymýšlej háček, cenu ani „ještě týž den".
- Jedna výzva. Post se ptá na jednu věc, e-mail chce jednu akci.
- Věty z `references/examples/` a kalibrační věty z `voice.md` neopisuj doslova. Slouží k naladění, ne jako stavebnice. Stejná funkce, vlastní slova.
- Emoji podle kanálu: e-mail a nabídka žádné, LinkedIn nejvýš tři s funkcí, zpráva kamarádovi nejvýš jedno.

### 3. Zkontroluj

Spusť skript nad hotovým textem (ulož ho nejdřív do souboru, třeba do scratchpadu):

```bash
python3 <tento-skill>/scripts/slop-check.py <soubor> --channel linkedin|email|message|offer
```

Oprav všechny `ERROR`, posuď `WARN`, pak skript spusť znovu, dokud nevrátí 0 ERROR. Potom projdi ruční checklist na konci `references/anti-slop.md` (trojice, falešné prozření, rytmus, čtení nahlas). Skript je síto, ne soudce; text může projít skriptem a pořád znít jako AI.

### 4. Odevzdej

- **Text** v čisté podobě, připravený ke zkopírování. E-mail ve formátu skillu `send-email` (frontmatter `to`, `subject`, `signature`, podpis do těla nepatří). LinkedIn post s hashtagy na konci a odkazem do prvního komentáře, ne do těla.
- **Pod textem** nejvýš tři body pro Karla: co doplnit, co ověřit, jaké rozhodnutí je na něm (tykání, zveřejnit částku, tagovat člověka). Ne víc. Žádné vysvětlování, proč je text dobrý.
- **Varianty** jen když si je Karel řekne. Výjimka: u LinkedIn postu nabídni dva alternativní hooky, pokud si hlavním nejsi jistý.
- **Kam uložit:** podle kanálu (viz `channels/*.md`, sekce „Kam uložit"). Když pracuješ mimo workspace `_DATAWIZARD` nebo klientskou složku, zeptej se.

## Režim kontroly a přepisu

Když Karel pošle hotový text („zkontroluj", „zní to jako AI", „vyhoď pomlčky", „přepiš to lidsky"):

1. Spusť `slop-check.py` nad původním textem a vypiš nálezy.
2. Přepiš text. Zachovej fakta, čísla, strukturu a délku; měň jen jazyk a rytmus. Nepřidávej nic, co ve vstupu není.
3. Spusť skript znovu nad přepisem.
4. Odevzdej přepsaný text a pod ním tři až pět největších změn v jedné větě každá.

## Tvrdá pravidla (bez výjimek)

1. Žádná pomlčka uprostřed věty (–, —, „ - "). Jen v rozsahu 10–12 h, po–pá a v tabulce.
2. Žádný řetěz krátkých vět, žádná jednoslovná věta, žádné „Ne X. Ne Y."
3. Žádné „nejde jen o X, ale o Y", žádné „Výsledek? Úspora času."
4. Žádná vymyšlená čísla, jména, citace, háčky.
5. Žádný korporátní a AI slovník (seznam v `anti-slop.md`).
6. Repo je veřejné: do skillu ani do příkladů nikdy nepřidávej jména klientů, ceny, přístupy a odkazy na dema.

## Časté chyby

| Chyba | Oprava |
|---|---|
| Post začíná tezí („AI mění způsob, jak…") | Začni místem a momentem. |
| Číslovaný postup v těle postu nebo e-mailu | Do karuselu nebo nabídky. V postu ho jen ohlas. |
| Tři otázky na konci | Jedna. |
| Cold e-mail s cenou nebo výčtem funkcí | Cena až po osobní ukázce. Funkce dvěma větami z pohledu zákazníka. |
| Podpis „Karel Šimek, Datawizard" v těle e-mailu | Přidá ho `send-email`. Tělo končí „Hezký den,". |
| „Omlouvám se za pozdní reakci" bez důvodu | S důvodem v jedné větě, nebo vůbec. |
| Sebeironie v každém odstavci | Jednou, kde sedí. Jinak je to póza. |
| Vysvětlování pod textem, proč je dobrý | Smazat. Karel to pozná sám. |

## Co skill neřeší

- Texty pro weby klientů a hlas jiných lidí (klientův brand). Tam platí klientův kontext.
- Odeslání e-mailu (skill `send-email`), výroba karuselu (Karlův `karusel-pruvodce.md`).
- Obchodní strategii nabídky (skilly `hormozi-consultant`, `inizio-consultant`). Tento skill řeší jen jazyk a strukturu.
