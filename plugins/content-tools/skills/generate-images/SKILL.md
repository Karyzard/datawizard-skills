---
name: generate-images
description: Generuje obrazky pres Google Gemini API. Zvladne tri vstupy — hotovy brief.md, surove poznamky/diktovani (AI vytvori brief), nebo auto mode (bez schvalovani). Pouzivej kdykoli uzivatel chce generovat obrazky, pripravit image brief, vytvorit vizualy pro projekt, nebo popisuje jake obrazky potrebuje. Triggeruj na "generuj obrazky", "generate images", "obrazky z poznamek", "vygeneruj bez schvaleni", "auto generate", "image brief", "priprav obrazky", "vizualy". Komunikuj cesky.
allowed-tools: Bash(pip install:*), Bash(pip3 install:*), Bash(python:*), Bash(python3:*), Bash(which:*), Bash(ls:*), Bash(mkdir:*), Read, Write, Edit, Glob, Grep, AskUserQuestion
---

# Generate Images

Unifikovany skill pro generovani obrazku pres Google Gemini API. Pokryva cely flow od suroveho napadu po hotove soubory.

---

## Vstup

Argument `$ARGUMENTS`: jedna z moznosti:

1. **Cesta k brief.md** — parsovat a generovat primo
2. **Volne poznamky / text** — AI nejprve vytvori strukturovany brief
3. **Priznak "auto"** — pridej `--auto` nebo rikej "rovnou" / "bez schvaleni" pro preskoceni schvaleni

Pokud neni zadano, zeptat se uzivatele co chce generovat.

---

## Detekce modu

Pred zahajenim urcit mod podle vstupu uzivatele:

| Signal | Mod | Chovani |
|--------|-----|---------|
| Cesta k `.md` souboru | **A — Brief** | Precti a parsuj existujici brief |
| Volny text, poznamky, seznam | **B — Poznamky** | Vytvor brief z poznamek podle [brief-template.md](brief-template.md) |
| "rovnou", "auto", "bez schvaleni" | **Auto flag** | Preskoc approval krok (kombinovatelne s A i B) |

Pokud neni jasne, zeptej se: "Mas hotovy brief.md, nebo ti ho mam pripravit z poznamek?"

---

## Workflow

### 1. Priprav brief

**Mode A — Brief soubor:**
- Precti soubor na zadane ceste
- Over ze obsahuje povinne sekce: `## Nastaveni`, `## Globalni styl`, `## Obrazky`
- Pokud chybi sekce, doplnit s defaulty

**Mode B — Poznamky:**
- Precti [brief-template.md](brief-template.md) jako sablonu
- Z uzivatelem dodanych poznamek vytvor strukturovany brief:
  - Zvol vhodne nazvy souboru (kebab-case, anglicky)
  - Nastav kategorie (mockup, ai_photo, infographic, thumbnail, icon, pattern, illustration)
  - Prompty pis **anglicky** pro lepsi vysledky (i kdyz vstup je cesky)
  - Poměr zvol podle ucelu (16:9 pro hero, 1:1 pro ikony, 3:2 pro fotky)
- Uloz brief jako `brief.md` do vystupni slozky (default `./images/brief.md`)
- Uzivateli ukazat obsah briefu

### 2. Approval (pokud neni auto mode)

Ukaz uzivateli:
- Pocet obrazku
- Seznam: nazev souboru, kategorie, zkraceny prompt
- Odhadovany cas: N obrazku x delay sekund

Zeptej se: **"Mam generovat? Chces neco upravit?"**

Pokud uzivatel chce upravit — proved zmeny v brief.md a ukaz znovu.

### 3. Zkontroluj prerekvizity

```bash
python3 -c "from google import genai; from PIL import Image; print('OK')"
```

Pokud chybi:
```bash
pip3 install google-genai pillow
```

`GOOGLE_API_KEY` hledej v tomto poradi:
1. Environment variable
2. `.env` soubor ve vystupni slozce
3. `.env` soubor v rootu projektu

Pokud nikde neni — rekni uzivateli at nastavi a nabidni vytvoreni `.env`.

### 4. Vygeneruj `generate.py`

Precti [generate-template.py](generate-template.py) a nahrad vsechny `{placeholders}` hodnotami z briefu:

| Placeholder | Zdroj |
|-------------|-------|
| `{project_name}` | Nazev projektu (z cesty nebo brief hlavicky) |
| `{model}` | `## Nastaveni` → Model |
| `{delay}` | `## Nastaveni` → Delay mezi requesty (cislo) |
| `{format_upper}` | `## Nastaveni` → Format → UPPERCASE (WEBP, PNG, JPEG) |
| `{quality}` | `## Nastaveni` → Kvalita |
| `{global_style_text}` | Cely text pod `## Globalni styl` |
| `IMAGES` list | Kazdy `### filename.ext` = jeden dict |

Pro kazdy obrazek v IMAGES listu:
- `"filename"`: nazev souboru z nadpisu
- `"category"`: z parametru Kategorie
- `"aspect_ratio"`: z parametru Pomer
- `"prompt"`: z parametru Prompt
- `"reference"`: jen pokud je v briefu (volitelne)
- `"thinking"`: jen pokud je explicitne "high" (volitelne)

Uloz `generate.py` do vystupni slozky.

### 5. Dry-run preview

```bash
python3 {output_dir}/generate.py --dry-run
```

Ukaz uzivateli vystup. Pokud je auto mode, pokracuj rovnou na krok 6.

### 6. Generovani

```bash
python3 {output_dir}/generate.py
```

Pro castecne generovani:
```bash
python3 {output_dir}/generate.py --only {pattern}
python3 {output_dir}/generate.py --category {category}
python3 {output_dir}/generate.py --only {name} --force
```

### 7. Vizualni kontrola

1. `ls -la {output_dir}/*.{format}` — ukazat soubory a velikosti
2. Read tool na 1–2 vygenerovane obrazky — vizualni inspekce
3. Zeptat se zda vysledky vypadaji dobre nebo pregenerovat (`--only X --force`)

---

## Parsovani brief formatu

### Globalni nastaveni (z `## Nastaveni`)

| Parametr | Default |
|----------|---------|
| Model | `gemini-3.1-flash-image-preview` |
| Rozliseni | `1K` |
| Vystupni slozka | `./images` |
| Format | `webp` |
| Kvalita | `85` |
| Delay mezi requesty | `5` |

### Per-image parametry (z `### filename.ext`)

| Parametr | Popis |
|----------|-------|
| Pomer | Aspect ratio: `1:1`, `16:9`, `3:2`, `9:16`, atd. |
| Rozliseni | Override globalniho rozliseni |
| Kategorie | `mockup`, `ai_photo`, `infographic`, `thumbnail`, `icon`, `pattern`, `illustration` |
| Thinking | `minimal` (default) nebo `high` |
| Reference | Cesta k referencnimu obrazku |
| Prompt | Popis obrazku |

---

## Troubleshooting

- **Rate limit**: Free tier = 10 RPM. Zvys `--delay`.
- **No image in response**: Ukaz textovou odpoved. Prompt potrebuje upravu.
- **Kvalita**: `gemini-3-pro-image-preview` pro nejvyssi kvalitu.
- **Anglicke prompty** funguji lepe nez ceske.
- **SynthID watermark**: Automaticky, nelze vypnout.

---

## Reference soubory

- [brief-template.md](brief-template.md) — sablona pro tvorbu briefu
- [generate-template.py](generate-template.py) — Python skript sablona s placeholdery

---

## Dostupne modely

| Model | Popis |
|-------|-------|
| `gemini-3.1-flash-image-preview` | Rychly, levny, az 14 ref. obrazku (default) |
| `gemini-3-pro-image-preview` | Nejvyssi kvalita, profesionalni produkce |
| `gemini-2.5-flash-image` | High-volume, nizka latence |

## Dostupne aspect ratios

`1:1` `1:4` `1:8` `2:3` `3:2` `3:4` `4:1` `4:3` `4:5` `5:4` `8:1` `9:16` `16:9` `21:9`

## Tipy pro prompty

- Bud konkretni — barvy (#hex), materialy, osvetleni, uhel zaberu
- Pro mockupy: popisuj UI prvky, layout, data v grafech
- Pro fotky: prostredi, obleceni, nalada, typ objektivu
- Pro infografiky: struktura, ikony, flow, porovnani
- "No text overlays, no watermarks" pokud nechces text
- Anglicke prompty funguji lepe nez ceske
