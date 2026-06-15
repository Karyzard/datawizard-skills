# process-meeting-transcript redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Přepsat SKILL.md `process-meeting-transcript` tak, aby uměl najít vstup sám (default Downloads), respektoval workspace pravidla pro cílovou složku, parsoval JSON přepisy a uměl novou šablonu Školení/Workshop.

**Architecture:** Skill je čistě dokumentační Markdown soubor čtený Claudem při invokaci. Žádný runtime kód, žádné unit testy. „Implementace" = strukturovaný přepis sekcí SKILL.md s atomic commity, „testování" = manuální E2E scénáře proti aktuálním přepisům v `~/Downloads/`.

**Tech Stack:** Markdown, YAML frontmatter, žádné dependency.

**Spec:** `docs/specs/2026-06-15-process-meeting-transcript-redesign.md`

---

## File Structure

- **Modify:** `plugins/content-tools/skills/process-meeting-transcript/SKILL.md` — kompletní přepis vstupní logiky, cílové složky, přidání JSON parsingu, nová šablona, dokumentace AGENTS.md konvence.

Žádné nové soubory. Žádné supporting scripty. Vše je v jednom Markdown souboru, který Claude přečte při triggerování skillu.

---

## Task 1: Aktualizovat frontmatter `description` (nové triggery)

**Files:**
- Modify: `plugins/content-tools/skills/process-meeting-transcript/SKILL.md:1-11`

- [ ] **Step 1: Přepiš frontmatter `description` — přidej nové triggery**

Aktuální text končí `..."diktát", "cenzuruj přepis", "off-topic v přepisu". Komunikuj česky.`

Nový frontmatter:

```yaml
---
name: process-meeting-transcript
description: >-
  Zpracuje přepis meetingu, školení nebo hlasové poznámky. Defaultně najde
  nejnovější přepis v ~/Downloads/ (.txt, .json, .vtt, .srt, .md), parsuje
  JSON exporty (Otter, Whisper, Fireflies), přesune originál do cílové složky
  v aktuálním workspace, volitelně cenzuruje off-topic úseky a vytvoří
  strukturovaný Markdown výstup podle typu (klientský meeting / týdenní /
  školení / osobní poznámka). Cílovou složku určuje podle pravidel workspace
  (01-communications/01 meetings/ → AGENTS.md/CLAUDE.md sekce ## Meetings →
  zeptat se). Použij kdykoli uživatel chce zpracovat přepis, hlasovou
  poznámku, přejmenovat transcript, vytáhnout shrnutí ze schůzky, zpracovat
  školení/workshop, nebo cenzurovat off-topic pasáže. Triggeruj na "zpracuj
  meeting", "zpracuj přepis", "zpracuj transcript", "zpracuj poslední přepis",
  "zpracuj poslední transcript", "zpracuj z Downloads", "najdi poslední
  meeting", "přejmenuj meeting", "zpracuj schůzku", "klientský meeting",
  "osobní poznámka", "hlasová poznámka", "voice memo", "diktát", "zpracuj
  školení", "workshop přepis", "cenzuruj přepis", "off-topic v přepisu".
  Komunikuj česky.
---
```

- [ ] **Step 2: Commit**

```bash
git add plugins/content-tools/skills/process-meeting-transcript/SKILL.md
git commit -m "process-meeting-transcript: expand description with new triggers"
```

---

## Task 2: Přidat Krok 0 — Vstup

**Files:**
- Modify: `plugins/content-tools/skills/process-meeting-transcript/SKILL.md` — vložit novou sekci mezi „## Co skill dělá" a „## Krok 1 — Vytvoření složky"

- [ ] **Step 1: Přepiš úvodní „## Co skill dělá" tak, aby reflektoval Krok 0**

Aktuální obsah sekce:

```markdown
## Co skill dělá

1. **Vytvoří složku** s datem a krátkým ASCII názvem
2. **Přejmenuje soubor** do formátu `YYYY-MM-DD Stručný název.txt` a přesune ho do složky
3. **Volitelně cenzuruje off-topic úseky** v originálním `.txt` přepisu (osobní odbočky, nevhodný obsah)
4. **Vytvoří Markdown soubor** se strukturovaným výstupem uvnitř složky
```

Nový obsah:

```markdown
## Co skill dělá

1. **Najde vstupní soubor** (defaultně nejnovější přepis v `~/Downloads/`, nebo podle explicitní cesty)
2. **Pokud je JSON, vyrobí normalizovaný `.txt`** (Otter / Whisper / Fireflies / obecný formát)
3. **Určí cílovou složku** podle workspace pravidel (`01-communications/01 meetings/` → `AGENTS.md`/`CLAUDE.md` → zeptat se)
4. **Vytvoří složku** s datem a názvem (idempotentně — pokud už existuje, použije ji)
5. **Přesune originál a normalizovaný `.txt`** do složky
6. **Volitelně cenzuruje off-topic úseky** v `.txt` přepisu
7. **Vytvoří Markdown soubor** se strukturovaným výstupem podle typu (klientský / týdenní / školení / osobní)
```

- [ ] **Step 2: Vlož novou sekci „## Krok 0 — Vstup" před „## Krok 1 — Vytvoření složky"**

Vložit přesně tento blok (před stávající řádek `## Krok 1 — Vytvoření složky`):

````markdown
## Krok 0 — Vstup (najdi soubor ke zpracování)

Skill přijímá tři režimy vstupu, vyhodnocují se v tomto pořadí:

### A) Explicitní cesta k souboru
Uživatel uvede konkrétní soubor (např. `~/Downloads/foo.json`). Skill zpracuje přesně tento soubor. Přeskoč hledání.

### B) Explicitní cesta ke složce
Uživatel uvede složku (např. `~/Downloads/` nebo `./inbox/`). Skill v ní hledá nejnovější přepis algoritmem níže.

### C) Žádný argument (default)
Chová se jako B) s cestou `~/Downloads/`.

### Algoritmus „najdi nejnovější přepis ve složce"

1. Načti seznam **souborů** ve složce (ne podsložky):
   ```bash
   ls -lt <složka> | head -20
   ```
2. Seřaď podle modification time sestupně, vezmi prvních 10.
3. Pro každý kandidát zkontroluj kritéria „je to přepis":
   - **Formát**: `.txt`, `.json`, `.md`, `.vtt`, `.srt`, nebo bez přípony s textovým obsahem (test přes `file <path>` nebo přečtení prvních ~50 řádků).
   - **Obsah** obsahuje aspoň jedno z:
     - Timestampy: `HH:MM:SS`, `MM:SS`, `[HH:MM:SS]`, `[MM:SS]`
     - Markery mluvčích: `Speaker 1`, `Speaker N:`, `[Speaker N]`
     - U JSONu: pole `segments`, `utterances`, `transcript`, `sentences`, `paragraphs`, `transcript_segments`
4. **První kandidát, který projde** → použij ho.
5. **Pokud žádný z 10 neprojde** → vypiš seznam nalezených souborů (název + mtime + ~30 znaků náhledu) a zeptej se uživatele, který je to.

### Příklady triggerování

| Uživatel napíše | Skill udělá |
|---|---|
| `zpracuj poslední přepis` | Hledá v `~/Downloads/` |
| `zpracuj ~/Downloads/foo.json` | Zpracuje přesně `foo.json` |
| `zpracuj přepisy v ./inbox/` | Hledá v `./inbox/` |
| `zpracuj školení` (žádná cesta) | Hledá v `~/Downloads/` |

---
````

- [ ] **Step 3: Commit**

```bash
git add plugins/content-tools/skills/process-meeting-transcript/SKILL.md
git commit -m "process-meeting-transcript: add Krok 0 — input resolution (Downloads default)"
```

---

## Task 3: Přepsat Krok 1 — cílová složka (nové workspace pravidla)

**Files:**
- Modify: `plugins/content-tools/skills/process-meeting-transcript/SKILL.md` — kompletně nahradit sekci `## Krok 1 — Vytvoření složky`

- [ ] **Step 1: Najdi začátek sekce `## Krok 1 — Vytvoření složky` a konec (před `## Krok 2 — Přejmenování souboru…`). Celý blok mezi nimi nahraď tímto:**

````markdown
## Krok 1 — Cílová složka

Cílová složka se určuje podle **CWD a workspace pravidel**, ne podle umístění originálu. Pravidla v pořadí priority — první, které sedí, vyhrává:

### Pravidlo (a) — FEOS pattern

Pokud v CWD nebo v některém **rodiči** (až do `~/Documents/`) existuje složka `01-communications/01 meetings/` → použij ji.

- **Naming uvnitř**: kebab-case, bez diakritiky, slova spojená pomlčkou.
- Vytvoř podsložku `YYYY-MM-DD-strucny-nazev-kebab/` uvnitř `01-communications/01 meetings/`.

Detekce:
```bash
# zkusit najít vzestupně od CWD
dir="$PWD"
while [ "$dir" != "$HOME/Documents" ] && [ "$dir" != "/" ]; do
  if [ -d "$dir/01-communications/01 meetings" ]; then
    echo "FOUND: $dir/01-communications/01 meetings"
    break
  fi
  dir="$(dirname "$dir")"
done
```

### Pravidlo (b) — AGENTS.md / CLAUDE.md sekce `## Meetings`

Pokud v CWD existuje `AGENTS.md` nebo `CLAUDE.md` a obsahuje sekci:

```markdown
## Meetings
target: 02-meetings/
naming: kebab-case   # volitelné; default = diakritika
```

→ Použij `target:` jako cílovou složku (relativně k CWD nebo absolutně) a `naming:` jako styl pro názvy uvnitř.

Hodnoty `naming:`:
- `kebab-case` — bez diakritiky, pomlčky (`2026-06-15-strucny-nazev`)
- `diakritika` (default) — s diakritikou, mezery (`2026-06-15 Stručný název`)

### Pravidlo (c) — zeptat se

Pokud ani (a), ani (b) nesedí → zeptej se uživatele:

```
Nenašel jsem 01-communications/01 meetings/ ani sekci ## Meetings
v AGENTS.md/CLAUDE.md. Kam mám vytvořit složku meetingu?

1. ./Meetings/  (vytvořit v aktuální složce)
2. ./           (vedle CWD, bez podsložky)
3. Jinam — napiš cestu
```

### Název nové složky

- **Datum**: dnešní, nebo z názvu vstupního souboru / prvního timestampu v přepisu.
- **Název**: 3–5 slov, výstižný.
- **Formát názvu** podle `naming`:
  - `diakritika`: `YYYY-MM-DD Kratky nazev` (bez diakritiky pro ASCII bezpečnost, mezery)
  - `kebab-case`: `YYYY-MM-DD-strucny-nazev-kebab`

### Idempotence — složka s dnešním datem už existuje

Pokud v cíli **už existuje složka začínající dnešním datem** (např. `2026-06-15 RooPortal skoleni/` vytvořená dříve při přípravě):

- **Použij ji**, nevytvářej novou ani ji nepřepisuj.
- Přesuň do ní originál + případně nový `.txt` z JSONu + MD.
- Pokud MD se stejným názvem už uvnitř existuje → suffix `v2`, `v3`, …

**Pozor:** Idempotence se týká **jen přesné shody dnešního data** (`YYYY-MM-DD`). Složka se stejným tématem ale jiným datem se ignoruje (vytvoří se nová s dnešním datem).

### Příklady

| Workspace | Vstup | Cílová složka |
|---|---|---|
| FEOS_Apps (má `01-communications/01 meetings/`) | RooPortal školení | `01-communications/01 meetings/2026-06-15-rooportal-skoleni/` |
| RooPortal (`AGENTS.md` má `target: meetings/`) | Školení | `meetings/2026-06-15 RooPortal skoleni/` |
| `~/tmp/` (žádný workspace) | Cokoli | Zeptá se |

Vytvoř složku pomocí Shell nástroje (`mkdir -p`).

---
````

- [ ] **Step 2: Commit**

```bash
git add plugins/content-tools/skills/process-meeting-transcript/SKILL.md
git commit -m "process-meeting-transcript: rewrite Krok 1 with workspace-aware target resolution"
```

---

## Task 4: Přepsat Krok 2 — JSON normalizace + přesun originálu

**Files:**
- Modify: `plugins/content-tools/skills/process-meeting-transcript/SKILL.md` — nahradit sekci `## Krok 2 — Přejmenování souboru a přesun do složky`

- [ ] **Step 1: Najdi sekci `## Krok 2 — Přejmenování souboru a přesun do složky` a její konec (před `## Krok 2.5 — Cenzura…`). Nahraď celý blok:**

````markdown
## Krok 2 — JSON normalizace + přejmenování + přesun originálu

### 2a) Pokud je vstup JSON — vyrob normalizovaný `.txt`

Pokud má vstupní soubor příponu `.json`:

1. Načti a parsuj JSON.
2. Detekuj strukturu podle klíčů (heuristika):

| Formát | Detekce | Mapování |
|---|---|---|
| **Otter** | klíč `transcript_segments` nebo `utterances` s `speaker_name`, `start_time`, `text` | `speaker_name` → Speaker, `start_time` (sec) → `HH:MM:SS`, `text` |
| **Whisper** | klíč `segments` s `start`, `end`, `text` (volitelně `speaker`) | `speaker` (nebo "Speaker 1") → Speaker, `start` → `HH:MM:SS`, `text` |
| **Fireflies** | klíč `sentences` s `speaker_name`, `start_time`, `text` | jako Otter |
| **Obecný** | jakékoli pole objektů s `text` + timestamp field + (volitelně) speaker | best-effort |

3. Vyrob normalizovaný text ve formátu:

```
HH:MM:SS Speaker N
text první věty
text druhé věty

HH:MM:SS Speaker M
text…
```

4. **Pokud strukturu nelze detekovat** → ukaž prvních ~30 řádků JSONu a zeptej se uživatele, jak ho mapovat. Nikdy nehádej.

### 2b) Pravidla pro název souboru

- **Datum**: vezmi z názvu souboru (formát `MM-DD` nebo `DD-MM`) nebo z prvního timestampu v přepisu, jinak dnes.
- **Rok**: pokud není explicitně řečeno jinak, aktuální rok.
- **Čas**: pokud je v názvu nebo přepisu, přidej `HH-MM`.
- **Název**: stručný, max 6–8 slov, česky, výstižný obsah meetingu.

Formát podle `naming` z Kroku 1:

- `diakritika` (default): `YYYY-MM-DD Stručný název meetingu.{txt,json,md}`
- `kebab-case`: `YYYY-MM-DD-strucny-nazev-meetingu.{txt,json,md}`

S časem: `YYYY-MM-DD HH-MM Stručný název.{txt,…}` nebo `YYYY-MM-DD-HH-MM-strucny-nazev.{txt,…}`.

### 2c) Přesun originálu do cílové složky

Originál se **přesune** (`mv`), ne kopíruje:

```bash
# JSON vstup
mv "~/Downloads/original.json" "<cílová složka>/<YYYY-MM-DD nazev>.json"
# zápis normalizovaného .txt vedle něj
echo "<normalized>" > "<cílová složka>/<YYYY-MM-DD nazev>.txt"
```

```bash
# TXT vstup
mv "~/Downloads/original.txt" "<cílová složka>/<YYYY-MM-DD nazev>.txt"
```

Po přesunu **Downloads už soubor neobsahuje** — to je záměr (vyčistí Downloads).

### Příklady

| Vstup | Cílová složka | Soubory v ní |
|---|---|---|
| `~/Downloads/-kolen-apka-be77692c-c205.json` | `meetings/2026-06-15 RooPortal skoleni/` | `2026-06-15 RooPortal skoleni.json` + `2026-06-15 RooPortal skoleni.txt` |
| `~/Downloads/03-13 MVP FAPI-transcript.txt` | `meetings/2026-03-13 MVP FAPI/` | `2026-03-13 Návrh MVP fakturačního nástroje FAPI.txt` |

---
````

- [ ] **Step 2: Commit**

```bash
git add plugins/content-tools/skills/process-meeting-transcript/SKILL.md
git commit -m "process-meeting-transcript: rewrite Krok 2 with JSON normalization and mv-not-cp"
```

---

## Task 5: Přidat šablonu Školení/Workshop a update výběru šablon

**Files:**
- Modify: `plugins/content-tools/skills/process-meeting-transcript/SKILL.md` — sekce `## Krok 3 — Markdown výstup` (přidat novou šablonu) a `## Jak vybrat šablonu` (přepsat)

- [ ] **Step 1: V sekci `## Krok 3 — Markdown výstup`, za blok `### Šablona — Osobní poznámka` (a jeho code block s šablonou), vlož:**

````markdown
### Šablona — Školení / Workshop

Použij pro školení, workshopy, výukové sessions s dominantním lektorem:

```markdown
# [Název školení]

**Datum:** YYYY-MM-DD  
**Typ:** Školení / Workshop  
**Délka:** ~X min  
**Lektor:** [jméno z kontextu nebo "Speaker 1"]  
**Účastníci:** [pokud lze odvodit z otázek/jmen]

---

## Shrnutí

[2–4 věty: o čem školení bylo, jaký byl cíl, pro koho]

## Probraná témata

- **[Téma 1]** — [1–2 věty co se k tomu řeklo]
- **[Téma 2]** — [...]

## Klíčové poznatky / takeaways

- [Nejdůležitější myšlenky, principy, definice]
- [...]

## Praktické ukázky / příklady

- [Co se demonstrovalo, jaké příklady padly]
- [...]

## Otázky a odpovědi

- **Q:** [otázka z publika] → **A:** [odpověď lektora]
- **Q:** [...] → **A:** [...]

## Akční body / domácí úkol

- [ ] [Co si mám vyzkoušet, dohledat, nastavit]
- [ ] [...]

## Zdroje a odkazy

- [Cokoli, na co lektor odkazoval — knihy, weby, nástroje]
```

---
````

- [ ] **Step 2: Najdi sekci `## Jak vybrat šablonu` a nahraď celý její obsah:**

````markdown
## Jak vybrat šablonu

1. **Pokud uživatel řekne typ** → použij příslušnou šablonu.
2. **Jinak odvoď z obsahu přepisu** v tomto pořadí:
   - Jeden mluvčí + osobní reflexe / diktování myšlenek (ne výuka) → **Osobní poznámka**
   - Jeden mluvčí dominuje + výuková struktura (témata, ukázky, otázky publika), monolog s tematickým členěním → **Školení / Workshop**
   - Více mluvčích + interní status / plánování → **Týdenní / projektová schůzka**
   - Více mluvčích + projekt / featurky / update se zákazníkem → **Klientský meeting**
3. **Default**, když si nejsi jistý → **Klientský meeting**

---
````

- [ ] **Step 3: Commit**

```bash
git add plugins/content-tools/skills/process-meeting-transcript/SKILL.md
git commit -m "process-meeting-transcript: add Školení/Workshop template + update selection logic"
```

---

## Task 6: Přidat sekci „Konvence workspace" (dokumentace `## Meetings` v AGENTS.md)

**Files:**
- Modify: `plugins/content-tools/skills/process-meeting-transcript/SKILL.md` — přidat novou sekci na konec, před aktuální `## Poznámky`

- [ ] **Step 1: Najdi sekci `## Poznámky` (úplně na konci souboru). Před ni vlož:**

````markdown
## Konvence workspace

Skill respektuje per-workspace instrukce v `AGENTS.md` nebo `CLAUDE.md`. Pokud chceš v projektu nastavit cíl pro meetingy a styl pojmenování, přidej do `AGENTS.md` (nebo `CLAUDE.md`) sekci:

```markdown
## Meetings
target: 02-meetings/
naming: kebab-case
```

- **`target:`** — relativní (k CWD) nebo absolutní cesta. Skill v ní vytvoří složku s datem.
- **`naming:`** — volitelné. `kebab-case` = bez diakritiky, slova spojená pomlčkou. Default `diakritika` = s diakritikou, slova oddělená mezerou.

### Priorita pravidel

1. **FEOS pattern**: pokud existuje `01-communications/01 meetings/` v CWD nebo nad ním, má přednost.
2. **AGENTS.md / CLAUDE.md** sekce `## Meetings` v CWD.
3. **Zeptat se** uživatele.

---
````

- [ ] **Step 2: Commit**

```bash
git add plugins/content-tools/skills/process-meeting-transcript/SKILL.md
git commit -m "process-meeting-transcript: document workspace convention (## Meetings in AGENTS.md)"
```

---

## Task 7: Update sekce „Poznámky" — reflektuj nové chování

**Files:**
- Modify: `plugins/content-tools/skills/process-meeting-transcript/SKILL.md` — sekce `## Poznámky` na konci

- [ ] **Step 1: Nahraď celou sekci `## Poznámky` tímto:**

````markdown
## Poznámky

- **Originál se po zpracování přesune** (`mv`) do cílové složky — v Downloads už zůstane.
- Pokud byl vstup JSON, do cílové složky jde **JSON i normalizovaný `.txt`**.
- MD výstup vytvoř uvnitř stejné složky jako přesunutý soubor, se stejným základním názvem (jen `.md` místo `.txt`/`.json`).
- Mluvčí identifikuj pokud je to možné z kontextu (jméno v přepisu, kontext tématu).
- Délku meetingu odvoď z posledního timestampu v přepisu.
- **Cenzura off-topic úseků (Krok 2.5) je vždy opt-in a vyžaduje potvrzení uživatele** — nikdy ji neprováděj automaticky, ani když nevhodné pasáže detekuješ.
- Po cenzuře upozorni uživatele, že originální `.txt` byl přepsán a kolik úseků / minut bylo vynecháno.
- **Žádné průběžné potvrzování** — skill najde, přesune, vytvoří, hotovo. Jen Krok 2.5 (cenzura) má vlastní potvrzení.
- **Report na závěr**: vypiš co se stalo — cesta k cílové složce, vytvořené soubory, použitá šablona, případně poznámka o idempotenci („použil jsem existující složku XYZ").
````

- [ ] **Step 2: Commit**

```bash
git add plugins/content-tools/skills/process-meeting-transcript/SKILL.md
git commit -m "process-meeting-transcript: update Poznámky to reflect new behavior"
```

---

## Task 8: Manuální E2E validace

**Files:**
- Read-only: `plugins/content-tools/skills/process-meeting-transcript/SKILL.md` (přečíst celý znovu, ověřit konzistenci)

- [ ] **Step 1: Přečti celý přepsaný SKILL.md od shora**

Použij Read tool. Zkontroluj:
- Kroky jdou logicky 0 → 1 → 2 → 2.5 → 3.
- Žádná zmínka starého pravidla „složka leží vedle originálu".
- Žádný odkaz na neexistující sekci.
- Frontmatter má všechny nové triggery.
- Šablona Školení/Workshop je na seznamu v „Jak vybrat šablonu".
- Sekce „Konvence workspace" je před „Poznámky".

Pokud najdeš nekonzistenci → oprav (Edit tool) a commitni `process-meeting-transcript: fix internal consistency`.

- [ ] **Step 2: Připrav scénář 1 — RooPortal školení (motivační příklad)**

Předpoklad: existuje testovací JSON přepis v `~/Downloads/` (např. `~/Downloads/-kolen-apka-be77692c-c205.json` nebo aktuální ekvivalent).

Otevři novou Claude Code session v projektové složce (např. `~/Documents/_KLIENTI/rooportal/` — nebo libovolná složka s `01-communications/01 meetings/` nebo s `AGENTS.md` obsahujícím `## Meetings`).

Spusť:
```
zpracuj poslední přepis
```

Očekávané chování:
- Skill najde JSON v Downloads.
- Vyrobí normalizovaný `.txt`.
- Najde cílovou složku podle pravidel workspace.
- Pokud složka s dnešním datem existuje → použije ji.
- Vytvoří MD podle šablony Školení/Workshop.
- Reportne výsledek.

Pokud krok selže → zapiš issue, oprav SKILL.md, commitni `process-meeting-transcript: fix <issue>`.

- [ ] **Step 3: Scénář 2 — žádný workspace context**

```bash
cd ~/tmp
mkdir -p test-meetings && cd test-meetings
claude
```

Spusť:
```
zpracuj poslední přepis
```

Očekávané chování:
- Skill najde nejnovější přepis v Downloads.
- Nenajde `01-communications/...` ani `AGENTS.md` → **zeptá se** kam.

Pokud se neptá → bug, oprav.

- [ ] **Step 4: Scénář 3 — explicitní cesta k souboru**

V libovolné složce:
```
zpracuj ~/Downloads/<konkrétní-soubor>
```

Očekávané chování: skill přeskočí hledání, zpracuje přesně ten soubor.

- [ ] **Step 5: Pokud všechny tři scénáře projdou → final commit**

```bash
git commit --allow-empty -m "process-meeting-transcript: redesign validated by E2E scenarios"
```

(Empty commit jako marker — jinak nic dalšího ke commitnutí není.)

---

## Self-Review (vyplněno při psaní plánu)

**Spec coverage** — všechny sekce specu (Cíle, Změny v SKILL.md 1–7, Workflow, Edge cases) mají odpovídající task:
- Spec §Změny 1 (frontmatter) → Task 1 ✓
- Spec §Změny 2 (Krok 0) → Task 2 ✓
- Spec §Změny 3 (Krok 1) → Task 3 ✓
- Spec §Změny 4 (Krok 2 + JSON) → Task 4 ✓
- Spec §Změny 5 (Cenzura beze změny) → žádný task potřeba ✓
- Spec §Změny 6 (Krok 3 + Školení) → Task 5 ✓
- Spec §Změny 7 (Konvence workspace) → Task 6 ✓
- Spec §Test plán → Task 8 ✓
- Aktualizace „Poznámky" → Task 7 ✓

**Placeholder scan** — žádné TBD/TODO/„implement later". Všechny code bloky obsahují finální obsah.

**Type consistency** — `target:`/`naming:` jména konzistentní napříč Task 3 a Task 6. „kebab-case" / „diakritika" hodnoty stejné v Task 3 i Task 4.
