---
name: animated-demo-windows
description: Použij při stavbě webu/prototypu, kde má být animované „demo okno" — terminál co živě píše build, editorové/IDE okno, kreslící se SVG schéma pipeline (agenti, workflow), nebo retro CRT boot obrazovka. Triggeruj na „animované okno", „živý build", „typewriter", „terminál v hero", „ukázat jak agent pracuje", „blueprint/schéma", „kreslící se diagram", „boot sekvence", „demo v hero". Komunikuj česky.
---

# Animovaná demo okna

Čtyři ověřené patterny animovaných oken pro hero sekce a produktová dema.
**Neinventuj engine od nuly — zkopíruj šablonu z `assets/` a přizpůsob ji.**
Šablony jsou kompletní funkční single-file HTML, laděné a ověřené v prohlížeči;
vlastní implementace znamená znovu objevovat timing, pasti a bugy.

## Výběr patternu

| Šablona (assets/) | Kdy | Charakter |
|---|---|---|
| `terminal-typewriter.html` | build/CLI proces, tech publikum | tmavý terminál, příkazy → ✓ výstupy, statusbar |
| `ide-window.html` | vznik dokumentu/plánu, světlý web | VS Code light: taby, sidebar, breadcrumb |
| `blueprint-pipeline.html` | architektura, pipeline, agenti | navy výkres, SVG uzly a šipky se kreslí |
| `crt-boot.html` | nostalgie, maximální zapamatovatelnost | amber fosfor, scanlines, boot log |

## Postup

1. Vyber pattern podle tabulky; zkopíruj šablonu do projektu.
2. Přizpůsob obsah animace (kroky buildu / uzly schématu) tématu produktu
   a barvy přes CSS proměnné v `:root` (šablony jsou na to připravené).
3. Vlož okno do layoutu stránky; sekvenci NEpřepisuj, jen její data.
4. Projdi checklist níže.

## Ověřené hodnoty (neměnit bez důvodu)

- Psaní: `26 + Math.random()*40` ms/znak — náhodná složka nutná, konstantní
  tempo působí roboticky. CRT: 14 ms, a jen 6 ms pro znak `.` (leader tečky).
- Rytmus kroků: pauza ~420 ms před ✓ řádkem, fade .25 s, další krok +380 ms;
  „běžící" krok (▸) drž ~900 ms před jeho ✓ — simuluje reálný build.
- Kurzor: `blink 1s steps(1) infinite` — `steps(1)` = tvrdé bliknutí, ne fade.
- Start: IntersectionObserver threshold .3 + odklad 300–500 ms (divák musí
  okno nejdřív zaregistrovat).
- SVG kreslení: `.7s ease` na čáry, `.55s ease` na uzly.

## Pasti (každá stála debugging)

- **SVG:** `pathLength="1"` na každém tvaru → `stroke-dasharray:1` funguje
  bez měření `getTotalLength()`. Delay třídy drž pod `.play` třídou,
  jinak animace startují před IntersectionObserverem.
- **Typewriter:** text vkládej `cur.insertAdjacentText('beforebegin', ch)`
  (roste před kurzorem); `min-height` na tělo okna, jinak layout poskakuje.
- **Reduced-motion — dvě větve:** CSS (vypnout blink/flicker/draw, vynutit
  finální stav) **a** JS (`renderInstant()` místo sekvence).
- **CRT flicker:** keyframes jen v úzkém pásmu (88–98 % cyklu) → působí
  náhodně; animuj jen `opacity`, nikdy `text-shadow` (repaint).
- Delší běhy: `sleep()` bez hrubého pollingu (fixní 60ms polling natáhne
  14ms tiky ~4×); generation-token pro čistý restart/replay.

## Checklist před odevzdáním

- [ ] Start přes IntersectionObserver + odklad; pauza mimo viewport u loopů
- [ ] `prefers-reduced-motion` v CSS i JS větvi (okamžitý finální stav)
- [ ] Demo `aria-hidden="true"` + sr-only textový popis průběhu
- [ ] Mobil ~380 px: okno se vejde bez horizontálního scrollu
- [ ] Po doběhnutí definovaný konec: finální stav / loop s výdrží ≥4 s / replay
- [ ] Okno je kulisa — čitelnost a CTA stránky mají přednost před efektem

## Časté chyby

- Vlastní engine místo šablony → jiný vzhled na každé stránce, hodiny ladění.
- Konstantní rychlost psaní, kurzor s fade, animace od načtení stránky.
- Reduced-motion jen v CSS (JS sekvence pak stejně „píše" do skrytého stavu).
