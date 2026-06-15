---
title: process-meeting-transcript — redesign vstupu a cílové složky
date: 2026-06-15
status: draft
type: spec
---

# process-meeting-transcript — redesign

## Kontext a motivace

Aktuální skill `plugins/content-tools/skills/process-meeting-transcript` vyžaduje, aby uživatel pokaždé explicitně dodal cestu k souboru a kontext, kam ho přesunout. V praxi nejčastější workflow vypadá takhle:

1. Uživatel stáhne přepis ze schůzky/školení do `~/Downloads/` (různé formáty — `.txt`, `.json` z různých nástrojů).
2. Otevře agentní okno v projektové složce klienta (např. RooPortal).
3. Chce jen říct „zpracuj poslední přepis" — bez psaní cesty a kontextu.

Cílem redesignu je zkrátit tuto interakci na jednu větu a přidat detekci typu „školení/workshop", který skill dnes nezná.

## Cíle

- Skill najde input sám (default: nejnovější přepis v `~/Downloads/`).
- Skill umí parsovat JSON přepisy (Otter, Whisper, Fireflies, obecný array of segments).
- Cílová složka se určuje podle pravidel workspace (FEOS pattern → AGENTS.md/CLAUDE.md → zeptat se), ne podle umístění originálu.
- Idempotence: pokud složka s dnešním datem už existuje, skill ji použije (případ přípravy meetingu).
- Originál se po zpracování přesune do cílové složky (vyčistí Downloads).
- Přidání čtvrté šablony **Školení / Workshop**.
- Žádné průběžné potvrzování (jen cenzura zůstává opt-in).

## Non-goals

- Skill **neřeší** automatický transkript z audia — pracuje jen s hotovými přepisy.
- Skill **nemění** chování cenzury (Krok 2.5) — zůstává beze změny.
- Skill **nezavádí** konfiguraci přes globální config (vše je per-workspace přes AGENTS.md/CLAUDE.md).

---

## Změny v SKILL.md

### 1. Frontmatter `description` — nové triggery

Přidat:
- „zpracuj poslední přepis", „zpracuj poslední transcript"
- „zpracuj z Downloads", „najdi poslední meeting"
- „zpracuj školení", „workshop přepis"

### 2. Nový Krok 0 — Vstup

Skill přijímá tři režimy vstupu, vyhodnocují se v tomto pořadí:

**A) Explicitní cesta k souboru** — uživatel uvede konkrétní soubor. Skill zpracuje přesně ten.

**B) Explicitní cesta ke složce** — uživatel uvede složku. Skill v ní hledá nejnovější přepis (viz algoritmus níže).

**C) Žádný argument** — chová se jako B) s cestou `~/Downloads/`.

#### Algoritmus „najdi nejnovější přepis ve složce"

1. Načti seznam souborů (ne podsložky) ve složce.
2. Seřaď podle `mtime` sestupně, vezmi prvních 10.
3. Pro každý zkontroluj kritéria „je to přepis":
   - Textový formát: `.txt`, `.json`, `.md`, `.vtt`, `.srt`, nebo bez přípony s textovým obsahem (test přes `file` nebo prvních pár bajtů).
   - Obsah obsahuje aspoň jedno z:
     - Timestampy ve formátu `HH:MM:SS`, `MM:SS`, `[HH:MM:SS]`, `[MM:SS]`
     - Strukturu `Speaker N` nebo `Speaker 1:`, `Speaker 2:`
     - U JSONu: pole `segments`, `utterances`, `transcript`, `paragraphs`
4. První, který projde → použij.
5. Pokud žádný z 10 neprojde → vypiš seznam (názvy + mtime) a zeptej se uživatele, který je to.

### 3. Krok 1 — Cílová složka (kompletní přepis)

Pravidla v pořadí priority. První, které sedí, vyhrává:

**(a) `01-communications/01 meetings/`** existuje v CWD nebo v některém rodiči (do `~/Documents/`) → použij ji. Naming uvnitř: **kebab-case bez diakritiky** (FEOS konvence).

**(b) AGENTS.md nebo CLAUDE.md v CWD** obsahuje sekci:

```markdown
## Meetings
target: 02-meetings/
naming: kebab-case   # volitelné; default = diakritika
```

→ Použij `target:` jako cílovou složku (relativně k CWD nebo absolutně). `naming:` určuje styl pro názvy uvnitř.

**(c) Žádné z výše uvedených** → zeptej se:

```
Nenašel jsem 01-communications/01 meetings/ ani instrukci v AGENTS.md/CLAUDE.md.
Kam mám vytvořit složku meetingu?

1. ./Meetings/ (vytvořit)
2. ./ (vedle CWD)
3. Jinam — napiš cestu
```

#### Idempotence

Pokud složka s dnešním datem (`YYYY-MM-DD *`) v cíli **už existuje** (typicky vytvořena dříve při přípravě), použij ji. Nemaž obsah, nepřepiš existující soubory — jen do ní přidej originál + případně nový `.txt` (z JSONu) + MD. Pokud MD se stejným názvem už existuje, navrhni suffix `… v2.md`.

#### Pravidlo „vedle originálu" se ruší

Bez ohledu na to, kde leží vstupní soubor (Downloads / projekt / kdekoli), cílová složka se určuje podle CWD a pravidel výše. Konzistentní chování.

### 4. Krok 2 — Přesun originálu + JSON normalizace

#### JSON normalizace

Pokud je vstupní soubor `.json`:

1. Načti a parsuj.
2. Detekuj strukturu (heuristika podle klíčů):
   - **Otter**: `transcript_segments` nebo `utterances` s `speaker_name`, `start_time`, `text`
   - **Whisper**: `segments` s `start`, `end`, `text` (bez mluvčích, nebo `speaker` field)
   - **Fireflies**: `sentences` s `speaker_name`, `start_time`, `text`
   - **Obecné**: jakékoli pole objektů s `text` + timestamp + (volitelně) mluvčí
3. Vyrob normalizovaný `.txt` ve formátu:
   ```
   HH:MM:SS Speaker N
   text první věty
   text druhé věty

   HH:MM:SS Speaker M
   …
   ```
4. Pokud strukturu nelze detekovat → zeptej se uživatele a ukaž ukázku JSONu.

Normalizovaný `.txt` vznikne vedle originálu v cílové složce (jako primární zdroj pravdy pro další kroky).

#### Přesun originálu

- Originál (JSON nebo TXT) se **přesune** (`mv`) do cílové složky, ne kopíruje.
- Pokud byl vstup JSON, do cílové složky jde **JSON i nově vyrobený `.txt`**.
- Pokud byl vstup `.txt`, jde tam **jen `.txt`** (přejmenovaný podle Kroku 2 stávajícího skillu).

#### Naming uvnitř složky

- Default: `YYYY-MM-DD Stručný název.{txt,json,md}` (s diakritikou).
- Když je `naming: kebab-case` (FEOS nebo override) → `YYYY-MM-DD-strucny-nazev.{txt,json,md}` (bez diakritiky, slova spojená pomlčkou).

### 5. Krok 2.5 — Cenzura

**Beze změny.** Zůstává opt-in, vyžaduje potvrzení uživatele.

### 6. Krok 3 — Markdown výstup

#### Nová šablona: Školení / Workshop

```markdown
# [Název školení]

**Datum:** YYYY-MM-DD
**Typ:** Školení / Workshop
**Délka:** ~X min
**Lektor:** [jméno z kontextu nebo "Speaker 1"]
**Účastníci:** [pokud lze odvodit]

---

## Shrnutí
[2–4 věty: o čem školení bylo, jaký byl cíl]

## Probraná témata
- **[Téma 1]** — [1–2 věty co se k tomu řeklo]
- **[Téma 2]** — [...]

## Klíčové poznatky / takeaways
- [Nejdůležitější myšlenky, principy, definice]

## Praktické ukázky / příklady
- [Co se demonstrovalo, jaké příklady padly]

## Otázky a odpovědi
- **Q:** [otázka] → **A:** [odpověď]

## Akční body / domácí úkol
- [ ] [Co si mám vyzkoušet, dohledat, nastavit]

## Zdroje a odkazy
- [Cokoli, na co lektor odkazoval]
```

#### Update sekce „Jak vybrat šablonu"

Přidat:
- **Školení / Workshop** — jeden mluvčí dominuje (lektor), výuková struktura (témata, ukázky, otázky publika), dlouhý monolog s tematickým členěním.

Pořadí detekce:
1. Pokud uživatel řekl typ → použij.
2. Jeden mluvčí + osobní reflexe → Osobní poznámka.
3. Jeden mluvčí (dominantní) + výukový obsah → **Školení / Workshop**.
4. Více mluvčích + interní status → Týdenní / projektová schůzka.
5. Více mluvčích + projekt/featurky/update → Klientský meeting.
6. Default: Klientský meeting.

### 7. Dokumentace konvence AGENTS.md/CLAUDE.md

Na konec SKILL.md přidat sekci `## Konvence workspace`:

```markdown
## Konvence workspace

Skill respektuje per-workspace instrukce v `AGENTS.md` nebo `CLAUDE.md`. Pokud chceš v projektu nastavit cíl pro meetingy, přidej sekci:

​```markdown
## Meetings
target: 02-meetings/
naming: kebab-case
​```

- **`target:`** — relativní (k CWD) nebo absolutní cesta. Skill v ní vytvoří složku s datem.
- **`naming:`** — volitelné. `kebab-case` = bez diakritiky, slova s pomlčkou. Default = s diakritikou, slova s mezerou.

Pokud existuje `01-communications/01 meetings/` v CWD nebo nad ním, má přednost před AGENTS.md/CLAUDE.md sekcí (FEOS pattern).
```

---

## Workflow konkrétně (uživatelská perspektiva)

**Případ 1 — RooPortal školení (motivační příklad):**

```
$ cd ~/Documents/_KLIENTI/rooportal
$ claude
> zpracuj poslední přepis
```

Skill:
1. Najde `~/Downloads/-kolen-apka-be77692c-c205.json` jako nejnovější textový soubor.
2. Detekuje JSON přepis (Otter formát).
3. Vyrobí normalizovaný `.txt`.
4. Najde cíl: nemá `01-communications/...`, čte `AGENTS.md` → najde `target: meetings/`.
5. Najde existující složku `meetings/2026-06-15 RooPortal skoleni/` (z přípravy) → použije ji.
6. Přesune JSON do složky, vytvoří `2026-06-15 RooPortal skoleni.txt` z normalizace.
7. Detekuje šablonu Školení/Workshop (jeden lektor, výukový obsah) → vytvoří `2026-06-15 RooPortal skoleni.md`.
8. Vypíše report.

**Případ 2 — explicitní cesta:**

```
> zpracuj ~/Downloads/foo.txt
```

Skill přeskočí hledání v Downloads, jinak stejný flow.

**Případ 3 — žádný workspace context:**

```
$ cd ~/tmp
$ claude
> zpracuj poslední přepis
```

Skill najde soubor v Downloads, ale nenajde `01-communications/...` ani AGENTS.md → **zeptá se** kam.

---

## Risk / edge cases

- **JSON má neznámou strukturu** → skill ukáže prvních ~30 řádků JSONu a zeptá se uživatele, jak ho mapovat. Nikdy nehádá, pokud heuristika selže.
- **Downloads je prázdné nebo neobsahuje přepis** → vypíše prvních 10 nejnovějších souborů a zeptá se.
- **Více souborů se stejným mtime** → vezmi první v abecedním pořadí (deterministické).
- **Cílová složka existuje, ale s jiným datem v názvu** (např. `2026-06-14 Stejna schuzka/`) → ignoruj, vytvoř novou s dnešním datem. Idempotence se týká **jen přesné shody dnešního data**.
- **Konflikt MD souborů** v existující složce → suffix `v2`, `v3`.

## Open questions

Žádné. Všechny otevřené body byly vyjasněny v brainstormingu.

## Test plán (pro pozdější fázi)

Skill je dokumentační (Markdown), proto „testy" = manuální scénáře:

1. RooPortal školení — kompletní happy path s existující složkou (idempotence).
2. Klientský meeting z `.txt` v Downloads, žádný workspace context → zeptá se kam.
3. JSON Otter formát → normalizace na `.txt`.
4. JSON neznámý formát → skill se zeptá, neuhodne.
5. FEOS workspace — automatická detekce `01-communications/01 meetings/`, kebab-case naming.
6. Workspace s `AGENTS.md` `## Meetings` sekcí → respektuje `target:` a `naming:`.
