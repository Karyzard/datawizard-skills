# web-motion

Animované a interaktivní webové patterny pro prototypy a landing pages.
Extrahováno z reálného projektu (2026-web-datawizard, prodejní stránky AI Sprint),
kde byly všechny patterny postavené a ověřené živě v prohlížeči.

## Skills

| Skill | K čemu |
|---|---|
| `animated-demo-windows` | Animovaná „demo okna" do hero sekcí: terminál s typewriter buildem, IDE/editor okno, kreslící se SVG blueprint pipeline, retro CRT boot. Šablony v `assets/` + ověřené timing hodnoty a pasti. |
| `hook-switcher` | Živé přepínání hero copy (headline + subhead) na prototypu — porovnávání hooků nezávisle na designu. Panel s klávesami, localStorage persist napříč stránkami, před produkcí se odstraní. |

## Princip

Neinventovat engine od nuly — kopírovat ověřené šablony a přizpůsobovat data
(obsah animace, hooky, barvy přes CSS proměnné). Každý pattern má za sebou
reálný debugging; hodnoty a pasti jsou zdokumentované v SKILL.md.
