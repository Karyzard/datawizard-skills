---
name: hook-switcher
description: Použij při porovnávání více variant hero copy (headline/subhead, „hooků") na webovém prototypu nebo landing page — když uživatel chce „přepínat hooky", „porovnat headliny", „otestovat víc úhlů na jedné stránce", „vyzkoušet různé hero texty", nebo má víc designových variant a chce na nich hodnotit copy nezávisle na designu. Komunikuj česky.
---

# Hook-switcher

Interní nástroj do prototypu: plovoucí panel, kterým se na stránce živě
přepíná hero copy (headline + subhead). Odděluje rozhodnutí o **designu**
od rozhodnutí o **copy** — místo N×M souborů jedna stránka × N hooků.

**Zkopíruj ověřený kód z `assets/hook-switcher.html`** (funkční demo
s komentovanou integrací) — nepiš switcher od nuly.

## Postup

1. Hero elementy dostanou `id="hook-headline"` a `id="hook-subhead"`,
   obsah prázdný (naplní je switcher).
2. Před `</body>` vlož blok mezi `<!-- HOOK-SWITCHER -->` komentáři
   (panel + script) a do `<style>` CSS `.hook-switcher` z assetu.
3. Naplň pole `HOOKS`: `{id, label, headline, subhead}` — v textech
   `<em>` pro akcent a `<b>` pro zvýraznění; stylizuje je CSS stránky
   (styluj obecně, ať sedí všem hookům — žádné hard-coded škrtání
   konkrétních slov).
4. `STORAGE_KEY` nastav per projekt a **stejný na všech variantách** —
   volba hooku pak přežívá přechod mezi stránkami, takže jde procházet
   designy se stejným hookem.
5. Výchozí hook (`DEFAULT_ID`) může mít každá varianta jiný.

## Pravidla

- Hooky ber z jednoho sdíleného zdroje pro celý projekt (markdown
  „knihovna hooků" vedle variant) — ne per stránka; jinak se rozjedou.
- Copy hooků = slova zákazníků/výzkumu, každý hook = jedna testovatelná
  hypotéza (úhel). Hook v reklamě musí odpovídat hero na landing page.
- Ovládání: ‹ › tlačítka + klávesy 1–N; ignoruj stisky s modifikátory
  a psaní ve formulářových polích (asset to už řeší).

## Před produkcí (nutné!)

Celý blok mezi `<!-- HOOK-SWITCHER -->` a `<!-- /HOOK-SWITCHER -->`
odstranit a vítězný hook vložit napevno do hero. Komentář v kódu je
na to záměrně nápadný. Pro A/B test v produkci → samostatné URL
per hook, ne switcher.

## Časté chyby

- Různé `STORAGE_KEY` napříč variantami → volba se mezi stránkami ztrácí.
- CSS `em`/`b` stylizované na míru jednomu hooku → ostatní vypadají rozbité.
- Switcher zapomenutý v produkci → náhodný návštěvník si přepne headline.
