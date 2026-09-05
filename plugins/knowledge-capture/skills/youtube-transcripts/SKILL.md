---
name: youtube-transcripts
description: Stáhne přehled a textové přepisy videí z YouTube playlistu, kanálu nebo jednoho videa (titulek, datum, délka, odkaz, popis, přepis s časovými značkami) do Excelu a markdownu, bez API klíče a bez přihlášení. Používej kdykoli uživatel chce „stáhnout přepisy / transkripce z YouTube", „projít jejich tutoriály", „co mají na YouTube", „udělat z videí textové zápisy", „seznam videí z playlistu / kanálu do Excelu", zpracovat konkurenční YouTube kanál do výzkumu, nebo pošle odkaz na YouTube playlist / kanál / video s tím, že z něj chce text. Triggeruj i na "youtube přepis", "yt transcript", "/youtube-transcripts". Komunikuj česky.
---

# YouTube přepisy – playlist, kanál nebo video do textu

Jeden příkaz udělá přehled všech videí (Excel + markdown index) a ke každému
dostupnému videu stáhne přepis do samostatného markdownu. Bez API klíče, bez
cookies. Přepis = titulky z YouTube (většinou auto-generované, bez interpunkce),
pro AI analýzu bohatě stačí, pro čtení člověkem jsou drsnější.

## Postup

1. **Zjisti zdroj a cíl.** URL (playlist, kanál `…/@handle/videos` nebo
   `…/channel/ID/videos`, jedno video) a kam výstup patří. Ve workspace
   klienta/projektu typicky `research/youtube-<zdroj>/` nebo složka výzkumu,
   ve které uživatel právě pracuje. Nepiš do `docs/knowledge-base/`.
2. **Jen přehled**, když uživatel chce nejdřív vidět, co tam je, nebo řekl
   jen „seznam / kolik toho je":
   ```bash
   python3 "${CLAUDE_PLUGIN_ROOT}/skills/youtube-transcripts/scripts/yt_transcripts.py" "<url>" --out <složka> --list-only
   ```
   Vytvoří `00-prehled.xlsx` + `00-index.md` (složka se založí sama). Řekni
   počet videí, rozsah dat, kolik je nedostupných, a zeptej se na přepisy.
   Když uživatel rovnou zadal „stáhni přepisy", krok 2 přeskoč.
3. **Stáhni přepisy** stejným příkazem bez `--list-only`. Jedno video trvá
   zhruba 8 s (2–3 s stahování + `--delay`), 30 videí tedy asi 4 minuty.
   U víc než ~20 videí spusť **na pozadí** (`run_in_background`). První běh
   je o minutu delší, skript si zakládá venv a instaluje závislosti.
   Skript je idempotentní: po přerušení nebo blokaci spusť znovu se stejnými
   parametry, hotové soubory přeskočí.
4. **Ohlas výsledek:** cesta ke složce, počet videí / přepisů / nedostupných,
   rozsah dat vydání, a co dál (typicky extrakce funkcí nebo témat z přepisů
   do strukturovaného přehledu pro srovnání).

Parametry: `--limit N` (jen prvních N, na zkoušku), `--lang en,cs` (pořadí
jazyků, jinak vezme cokoli dostupné), `--delay 5` (pauza mezi videi),
`--name "Název"` (do indexu). `--help` vypíše vše.

## Co vzniká

| Soubor | Obsah |
|---|---|
| `00-prehled.xlsx` | Jeden řádek na video: #, titulek, klikací odkaz, kanál, datum, délka, zhlédnutí, dostupné, soubor přepisu, poznámka. Nedostupná videa oranžově. |
| `00-index.md` | Markdown tabulka: titulek s odkazem, kanál, datum, délka, počet slov, odkaz na přepis (bez zhlédnutí, ta jsou jen v xlsx). Název sady = `--name`, jinak jméno kanálu. |
| `NN-slug.md` | Frontmatter (title, date, channel, url, video_id, published, duration, views, transcript = jazyk a auto/ruční, words), popis videa, přepis po minutových odstavcích s `**[m:ss]**`. |

Pořadí = pořadí v playlistu (u kanálu od nejnovějšího). Není chronologické,
při hodnocení řaď podle sloupce datum.

## Známé situace

- **Soukromá videa** (v playlistu bez titulku, YouTube vrací „Sign in"):
  nejdou stáhnout ani s přihlášením uživatele, přístup dává jen majitel.
  Do přehledu jdou s poznámkou „nestaženo – soukromé video". Nezkoušej
  cookies z prohlížeče, ověřeno, že nepomůžou.
- **Blokace IP** po ~20 rychlých požadavcích na přepisy: skript čeká
  a opakuje (45 s, 90 s, …), při vyčerpání pokusů označí video a jede dál.
  Pak stačí spustit znovu. Nesnižuj `--delay` pod 3.
- **Video bez titulků:** poznámka „nemá titulky ani auto-přepis". Alternativa
  je stáhnout audio přes yt-dlp a přepsat lokálně (whisper), to skill neřeší.
- **Kanál bez záložky Videa** (`@handle` nefunguje): použij odkaz
  `…/channel/<UC…>/videos`, channel ID je v HTML každého videa
  (`"channelId":"UC…"`).
- **Závislosti:** skript si při prvním běhu založí venv v `~/.cache/datawizard/youtube-transcripts-venv`
  z Homebrew `python3.12+`. Systémový Python 3.9 nestačí (yt-dlp ho
  nepodporuje), proto nikdy neinstaluj yt-dlp do systémového Pythonu.

## Co nedělat

- Nestahuj přepisy po jednom ručně přes WebFetch nebo prohlížeč, skript to
  řeší hromadně včetně metadat.
- Nepřepisuj auto-generovaný text do „hezčí" podoby v souborech s přepisem,
  jsou to zdrojová data. Shrnutí a extrakce patří do separátního souboru.
