---
name: web-research
description: Průvodce nástroji pro vyhledávání a stahování obsahu z webu (vestavěný WebFetch/WebSearch, Playwright, Brave Search API, Browserless plugin) včetně toho, co je zdarma a co se platí. Používej kdykoli uživatel chce „vyhledat na internetu", „dohledat weby firem", „stáhnout / vykrálovat celý web", „scrapnout stránku", „projít web konkurence", „co má konkurence na webu", nebo zmíní Brave, Browserless, crawl, scraping, prospecting webů. Triggeruj i na "/web-research". Komunikuj česky.
---

# Web research – co použít a co to stojí

Nástroje od nejlevnějšího k nejdražšímu. Vždy začni nejlevnějším, které úlohu
zvládne. Placené nástroje nikdy nespouštěj ve smyčce bez horní meze.

| Potřeba | Nástroj | Cena |
|---|---|---|
| Přečíst jednu veřejnou stránku | `WebFetch` | zdarma |
| Pár ad-hoc dotazů do vyhledávače | `WebSearch` | zdarma |
| Stránka s JS, přihlášením, klikáním, lokálně | Playwright plugin (`browser_navigate`, `browser_snapshot`) | zdarma |
| Hromadné dotazy do vyhledávače (desítky až tisíce, skriptem) | **Brave Search API** | placené |
| Stáhnout celý web do markdownu, stránky blokující boty, captcha | **Browserless plugin** | placené |

## Brave Search API (placené, dotazy)

- **Cena:** 5 USD za 1 000 dotazů, každý měsíc 5 USD kredit zdarma (≈ 1 000
  dotazů). Rate limit 50 dotazů/s. Stav a útrata: https://api-dashboard.search.brave.com
- **Klíč:** macOS Keychain, service `brave-search-api-key`, account `karelsimek`.
  Registr služeb: `_DATAWIZARD/TOOLS.md`. Klíč nikdy do chatu ani do souborů.
- **K čemu:** prospecting (dohledat oficiální web pro seznam firem), hromadné
  ověřování, cokoli, kde se dotazy generují skriptem.

```bash
KEY=$(security find-generic-password -a karelsimek -s brave-search-api-key -w)
curl -s -H "Accept: application/json" -H "X-Subscription-Token: $KEY" \
  "https://api.search.brave.com/res/v1/web/search?q=ACME%20s.r.o.&count=5&country=cz&search_lang=cs"
```

Odpověď: `web.results[]` s `title`, `url`, `description`. Další parametry:
`freshness` (`pd`, `pw`, `pm`, `py`), `result_filter=web`. Jeden dotaz =
jedna účtovaná jednotka bez ohledu na `count`.

**Pravidlo:** před dávkou nad 100 dotazů řekni uživateli počet a odhad ceny
(dotazy / 1 000 × 5 USD) a počkej na souhlas. Pod 100 dotazů jeď rovnou,
na konci řekni, kolik dotazů padlo.

**Dávka (prospecting):** napiš jednorázový skript do scratchpadu: čte seznam
(název + město, případně IČO), přeskočí řádky, které už mají výsledek,
zapisuje průběžně do CSV (název, dotaz, vybraná URL, kandidáti), pauza
0,1 s mezi dotazy. Dotaz `"<název> <město>"`. Za oficiální web ber první
výsledek, jehož doména není agregátor (firmy.cz, justice.cz, kurzy.cz,
zivefirmy.cz, linkedin, facebook, mapy.cz, seznam) a obsahuje část názvu
firmy; jinak řádek označ „ověřit ručně". Výsledek je vždy k ruční kontrole,
skript ho jen předvyplní.

## Browserless plugin (placené, jednotky)

- **Cena:** 1 jednotka = až 30 s času prohlížeče na jedno připojení. Free plán
  1 000 jednotek/měsíc, Prototyping 25 USD za 20 000. Navíc residential proxy
  6 jednotek/MB, vyřešená captcha 10 jednotek. Stav účtu: MCP nástroje
  `browserless_account` a `browserless_usage`; když hlásí expirovaný token,
  uživatel musí obnovit přihlášení přes `/mcp`.
- **Token:** `~/.browserless/.env` (nastavuje `/browserless:auth`), REST
  skilly ho čtou samy. Region ponech výchozí.
- **Dvě cesty ke stejným funkcím:** MCP nástroje `browserless_crawl`,
  `browserless_map`, `browserless_smartscraper` volají API i polling samy,
  preferuj je. Když MCP hlásí expirovaný token, použij slash skilly
  `/browserless:crawl` atd., ty jedou přes REST a `curl`, polling děláš
  ručně (GET každých ~25 s, dokud `status` není `completed`).
- **Nástroje:**
  - `smart-scrape` – jedna stránka do markdownu, screenshot nebo PDF. Použij,
    když `WebFetch` selže (JS render, blokace). Řádově 1–3 jednotky.
  - `crawl` – celý web asynchronně: POST spustí, pak polluj GET každých
    ~25 s. Vždy nastav `limit` (stránek) a `maxDepth`; pro jazykovou sekci
    `includePaths` (např. `["/cs/.*"]`); `scrapeOptions.formats: ["markdown"]`,
    `onlyMainContent: true`. Každá stránka spotřebuje jednotky, 100 stránek
    je typicky 100–300 jednotek.
  - `map` – jen seznam URL webu, jedno připojení, řádově jednotky. Spusť
    před `crawl`, ať víš, kolik stránek tam je, a nastavíš rozumný `limit`.
  - `search` – vyhledávání přes prohlížeč. Pro hromadné dotazy je Brave
    levnější a rychlejší.
  - `agent` – interaktivní session (přihlášení, klikání). Nejdražší, drží
    prohlížeč po celou dobu. Pro lokální weby dej přednost Playwrightu.
- **Výsledky crawlu:** `contentUrl` každé stránky je předpodepsaný odkaz
  s platností 1 h, celý výsledek 24 h. Hned po dokončení stáhni obsah do
  souborů, JSON s metadaty ulož do scratchpadu, pak převeď do cílové složky.

**Pravidlo:** před crawlem nad 50 stránek nebo před `agent` session řekni
uživateli odhad jednotek a počkej na souhlas. Menší akce (`smart-scrape`,
`map`, crawl do 50 stránek) jeď rovnou a na konci řekni spotřebu. Při první
placené akci v session zkontroluj zůstatek přes `browserless_account`.

## Kam s výstupem

Do `research/` daného workspace (klient, projekt), jeden soubor na zdroj
s frontmatterem `title`, `date`, `source` (URL), `tool` (brave / browserless /
webfetch). U placených nástrojů připiš do souboru počet dotazů nebo jednotek,
ať je útrata dohledatelná. Surová data (JSON, HTML) zůstávají ve scratchpadu.

## Co nedělat

- Nepoužívej Browserless na stránky, které `WebFetch` přečte. Zkus zdarma
  variantu první, placenou až po selhání.
- Neposílej klíč ani token do chatu, do repa ani do OneDrive souborů.
- Necrawluj bez `limit`. Výchozí 100 stránek je strop, ne cíl.
- Nespouštěj Brave dotazy v cyklu, dokud nevíš délku seznamu.
