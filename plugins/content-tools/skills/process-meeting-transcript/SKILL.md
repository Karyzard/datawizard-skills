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

# Zpracování přepisu meetingu

## Co skill dělá

1. **Najde vstupní soubor** (defaultně nejnovější přepis v `~/Downloads/`, nebo podle explicitní cesty)
2. **Pokud je JSON, vyrobí normalizovaný `.txt`** (Otter / Whisper / Fireflies / obecný formát)
3. **Určí cílovou složku** podle workspace pravidel (`01-communications/01 meetings/` → `AGENTS.md`/`CLAUDE.md` → zeptat se)
4. **Vytvoří složku** s datem a názvem (idempotentně — pokud už existuje, použije ji)
5. **Přesune originál a normalizovaný `.txt`** do složky
6. **Volitelně cenzuruje off-topic úseky** v `.txt` přepisu
7. **Vytvoří Markdown soubor** se strukturovaným výstupem podle typu (klientský / týdenní / školení / osobní)

---

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

## Krok 2.5 — Cenzura off-topic konverzací (volitelné)

### Kdy krok použít

Použij vždy, když v přepisu **identifikuješ úseky, které nesouvisí s hlavním tématem meetingu** nebo jsou nevhodné pro sdílení:

- Osobní odbočky (bavení o holkách, vztazích, osobních tématech, která nepatří k projektu)
- Nevhodný humor, drby o třetích osobách
- Dlouhé off-topic vsuvky (např. probírání sportu, jídla, nesouvisejících zážitků)
- Cokoli, co by uživatel nechtěl mít v trvalém archivu meetingu

Pokud **nic takového v přepisu nenajdeš**, tento krok přeskoč a pokračuj na Krok 3.

### Postup

**1. Identifikuj off-topic úseky**

Při čtení přepisu si značkuj rozsahy timestampů, kde se téma odklání od deklarovaného obsahu meetingu. Krátké jednorázové vtípky (1–2 věty) **není potřeba cenzurovat** — jde o souvislé úseky od ~30 sekund výš.

**2. Ukaž uživateli seznam před zásahem**

Nikdy necenzuruj bez potvrzení. Vypiš přehledně:

```
Našel jsem tyto off-topic úseky:

1. 00:12:34 – 00:15:20 (~3 min)
   Téma: neformální bavení o holkách
   Úryvek: "...a pak říká, že ta Maruška..."

2. 00:45:10 – 00:48:00 (~3 min)
   Téma: vtipy o kolegovi z jiné firmy
   Úryvek: "...to Honza zase totálně..."

Chceš všechny cenzurovat? (ano / vynechej č. X / všechno nech)
```

**3. Po potvrzení přepiš úseky v originálním `.txt`**

V souboru nahraď označené úseky placeholderem a **zachovej timestampy na okrajích** úseku, aby bylo jasné, kolik času bylo vynecháno:

```
00:12:34 Speaker 1
[CENZUROVÁNO — off-topic konverzace, ~3 min]
00:15:20 Speaker 1
Takže zpátky k té feature…
```

**4. Do MD výstupu (Krok 3) off-topic úseky nevkládej vůbec**

MD je strukturované shrnutí — patří tam jen podstatné. Off-topic pasáže se v MD ani nezmiňují.

### Nevratnost

Cenzura přepíše originální `.txt` **in-place, bez zálohy**. Uživatel musí ve stepu 2 výslovně potvrdit. Pokud uživatel chce zálohu před cenzurou, zeptej se a vytvoř kopii `*.original.txt` vedle souboru.

### Zpětné použití na už zpracované meetingy

Pokud uživatel ukáže na **už existující složku meetingu** (nebo konkrétní `.txt` uvnitř) a chce zpětně cenzurovat:

1. Přečti `.txt` přepis uvnitř složky.
2. Proveď Krok 2.5 stejně jako u nového zpracování (identifikuj → ukaž → po potvrzení přepiš).
3. Pokud MD soubor **obsahuje pasáže odvozené z off-topic** (což by neměl, ale zkontroluj), aktualizuj i MD.
4. Složku ani názvy souborů neměň.

---

## Krok 3 — Markdown výstup

Vytvoř `.md` soubor uvnitř složky se stejným názvem jako přejmenovaný `.txt` (místo `.txt` použij `.md`).

### Formát přepisu

Přepisy mají timestampy ve formátu `HH:MM:SS Speaker N\ntext`. Identifikuj mluvčí z kontextu, pokud je to možné.

### Šablona — Klientský meeting

Použij pro meetingy, kde se řeší projekt, featurky, update se zákazníkem/klientem:

```markdown
# [Název meetingu]

**Datum:** YYYY-MM-DD  
**Typ:** Klientský meeting  
**Délka:** ~X min  
**Účastníci:** [identifikuj z kontextu nebo napiš "Speaker 1, Speaker 2"]

---

## Shrnutí

[2–4 věty: o čem meeting byl, co se řešilo]

## Klíčová rozhodnutí

- [Rozhodnutí 1]
- [Rozhodnutí 2]

## Akční body

- [ ] [Co kdo udělá — pokud je jasné, přiřaď osobu]
- [ ] ...

## Kontext / poznámky

[Důležité detaily, čísla, termíny, které stojí za zaznamenání]
```

### Šablona — Týdenní / projektová schůzka

Použij pro interní meetingy, statusy, plánování:

```markdown
# [Název meetingu]

**Datum:** YYYY-MM-DD  
**Typ:** Týdenní schůzka / Projektový status  
**Délka:** ~X min  
**Účastníci:** [identifikuj z kontextu nebo napiš "Speaker 1, Speaker 2, ..."]

---

## Shrnutí

[2–4 věty: stav projektu, co se probíralo]

## Stav projektu / aktualizace

- [Téma 1]: [co bylo sděleno]
- [Téma 2]: [co bylo sděleno]

## Klíčová rozhodnutí

- [Rozhodnutí 1]

## Akční body

- [ ] [Úkol — přiřadit osobě pokud je jasné]
- [ ] ...

## Termíny a deadliny

| Co | Datum | Kdo |
|---|---|---|
| [úkol] | [datum] | [osoba] |

## Poznámky

[Vše ostatní důležité]
```

### Šablona — Osobní poznámka

Použij pro hlasové poznámky, osobní reflexe, diktované myšlenky (typicky jeden mluvčí, žádná schůzka):

```markdown
# [Téma poznámky]

**Datum:** YYYY-MM-DD  
**Typ:** Osobní poznámka  
**Délka:** ~X min  

---

## Kontext

[1–2 věty: co předcházelo, proč si to nahrávám]

## Klíčové myšlenky

- [Myšlenka 1]
- [Myšlenka 2]

## Akční body

- [ ] [Co udělat]

## Důležité termíny / čísla

- [Termín nebo číslo, které stojí za zaznamenání]

## Poznámky

[Cokoliv dalšího důležitého]
```

---

## Jak vybrat šablonu

- Uživatel řekne typ meetingu → použij příslušnou šablonu
- Pokud typ není řečen, odvoď z obsahu přepisu:
  - Více mluvčích + projekt/featurky/update → **Klientský meeting**
  - Více mluvčích + interní status/plánování → **Týdenní / projektová schůzka**
  - Jeden mluvčí + osobní reflexe/diktování myšlenek (ne schůzka) → **Osobní poznámka**
- Výchozí šablona: **Klientský meeting**

---

## Postup při zpracování více souborů

Pokud uživatel ukáže na složku nebo více souborů:
1. Vypiš seznam nalezených `.txt` přepisů
2. Zpracuj každý soubor samostatně — každý dostane vlastní složku, přejmenovaný TXT a MD uvnitř
3. Potvrď seznam zpracovaných souborů a jejich složek

---

## Poznámky

- Zachovej originální `.txt` soubor — jen ho přejmenuj a přesuň do složky, nemazej
- MD výstup vytvoř uvnitř stejné složky jako přejmenovaný TXT
- Mluvčí identifikuj pokud je to možné z kontextu (jméno v přepisu, kontext tématu)
- Délku meetingu odvoď z posledního timestampu v přepisu
- **Cenzura off-topic úseků (Krok 2.5) je vždy opt-in a vyžaduje potvrzení uživatele** — nikdy ji neprováděj automaticky, ani když nevhodné pasáže detekuješ
- Po cenzuře upozorni uživatele, že originální `.txt` byl přepsán a kolik úseků / minut bylo vynecháno
