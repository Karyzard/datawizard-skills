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

1. **Vytvoří složku** s datem a krátkým ASCII názvem
2. **Přejmenuje soubor** do formátu `YYYY-MM-DD Stručný název.txt` a přesune ho do složky
3. **Volitelně cenzuruje off-topic úseky** v originálním `.txt` přepisu (osobní odbočky, nevhodný obsah)
4. **Vytvoří Markdown soubor** se strukturovaným výstupem uvnitř složky

---

## Krok 1 — Vytvoření složky

### Pravidla pro název složky

- **Datum**: stejné jako u souboru (`YYYY-MM-DD`)
- **Název**: max 3–5 slov, bez diakritiky, bez speciálních znaků, slova oddělená mezerou (nebo pomlčkou)
- Složka leží ve stejném adresáři jako originální přepis — **kromě workspace FEOS_Apps** (viz níže).

### FEOS_Apps workspace (Fitness revolution / FeOS)

Pokud pracuješ v projektu **FEOS_Apps**, nepoužívej novou složku `Meetings/` v kořeni. Vytvoř podsložku v:

`01-communications/01 meetings/YYYY-MM-DD-strucny-nazev-kebab/`

Názvy souborů uvnitř: **kebab-case, bez diakritiky** (viz kořenový `AGENTS.md`, `01-communications/CONTEXT.md` a `01-communications/01 meetings/AGENTS.md`).

### Formát

```
YYYY-MM-DD Kratky nazev ascii/
```

### Příklady

| Soubor | Složka |
|---|---|
| `2025-08-02 Závěrečné hodnocení s Vojtou a Mírou.txt` | `2025-08-02 Zaverecne hodnoceni parking/` |
| `2026-03-13 Návrh MVP fakturačního nástroje FAPI.txt` | `2026-03-13 MVP fakturacni nastroj FAPI/` |
| `2026-03-13 Týdenní schůzka FEOS předání pozice.txt` | `2026-03-13 Tydenni schuze FEOS/` |

Vytvoř složku pomocí Shell nástroje (`mkdir`).

---

## Krok 2 — Přejmenování souboru a přesun do složky

### Pravidla pro název souboru

- **Datum**: vezmi z názvu souboru (formát `MM-DD` nebo `DD-MM`) nebo z prvního timestampu v přepisu
- **Rok**: pokud není explicitně řečeno jinak, použij aktuální rok
- **Čas**: pokud je v názvu nebo přepisu, přidej ve formátu `HH-MM`
- **Název**: stručný, max 6–8 slov, česky, výstižný obsah meetingu

### Formát

```
YYYY-MM-DD Stručný název meetingu.txt
YYYY-MM-DD HH-MM Stručný název meetingu.txt   ← pokud je dostupný čas
```

### Příklady

| Původní název | Nový název |
|---|---|
| `03-13 Návrh MVP fakturačního nástroje jako náhrady za FAPI-transcript.txt` | `2026-03-13 Návrh MVP fakturačního nástroje FAPI.txt` |
| `03-13 Týdenní schůzka_ Projekt FEOS a předání pozice-transcript.txt` | `2026-03-13 Týdenní schůzka FEOS předání pozice.txt` |

Přejmenuj soubor a přesuň ho do složky z Kroku 1 pomocí Shell nástroje (`mv`):

```bash
mv "původní-název.txt" "YYYY-MM-DD Kratky nazev ascii/YYYY-MM-DD Stručný název meetingu.txt"
```

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
