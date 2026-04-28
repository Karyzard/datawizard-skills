# Team Experience Reference

Kalibrační základ pro technický risk assessment v backlogu.
Každý záznam říká: "Tohle jsme dělali — takhle těžké to pro nás bylo."

**Jak používat:** Při risk assessmentu Rocku porovnej popis Rocku s typy úkolů níže.
Najdi nejbližší analogii a použij ji jako výchozí odhad obtížnosti.

**Jak aktualizovat:** Po každém dokončeném projektu nebo sprintu přidej nové záznamy.
Uprav obtížnost u položek, kde se odhad a realita lišily.

---

## Typy úkolů a naše zkušenost

| Typ úkolu | Zkušenost | Obtížnost pro nás | Poznámka |
|-----------|:---------:|:-----------------:|----------|
| _(sem přidej první záznam)_ | Ne | — | — |

---

## Legenda

**Zkušenost:**
- `Ano` — máme zkušenost, víme jak na to
- `Ano (1×)` — dělali jsme jednou, opatrnost
- `Ne` — nová oblast pro nás

**Obtížnost pro nás** (T-shirt sizing):
| Označení | Význam |
|----------|--------|
| **S** | Zvládneme snadno, máme zkušenost a šablony — nízké riziko |
| **M** | Střední, potřebujeme čas na research nebo implementaci |
| **L** | Složité, poprvé nebo hodně edge cases — zvýšené riziko |
| **H** | Neznámá oblast, vysoké riziko, doporučujeme spike před odhadem |

---

## Příklady záznamu (smaž a nahraď reálnými)

| Typ úkolu | Zkušenost | Obtížnost pro nás | Poznámka |
|-----------|:---------:|:-----------------:|----------|
| REST API integrace s dokumentací | Ano | S | Máme vzory, zvládneme rychle |
| Scraping webu bez API | Ano | M | Záleží na struktuře stránky |
| Autentizace / session management | Ano | S | Máme šablonu |
| Fulltext vyhledávání | Ano (1×) | M | Poprvé bylo L, teď M |
| Real-time komunikace (websockets) | Ne | H | Nová oblast — spike před odhadem |
| Import / export dat (CSV, Excel) | Ano | S | Rutina |
| E-mailové notifikace | Ano | S | Používáme hotovou službu |
| Platební brána | Ne | H | Regulace + integrace — vždy spike |
| Admin CRUD rozhraní | Ano | S | Generujeme ze šablony |
| Komplexní filtrovací UI | Ano (1×) | M–L | Záleží na počtu dimenzí |
