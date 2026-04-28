# Image Brief: [Nazev projektu]

---

## Nastaveni
- Model: gemini-3.1-flash-image-preview
- Rozliseni: 1K
- Vystupni slozka: ./images
- Format: webp
- Kvalita: 85
- Delay mezi requesty: 5s

## Globalni styl
Popis sdileneho vizualniho stylu pro vsechny obrazky v projektu.

Priklad:
> Dark background #0A0A0A, lime green #BFFF00 accent highlights,
> modern premium aesthetic, clean minimal composition, high quality, detailed,
> no text overlays, no watermarks.

## Obrazky

### nazev-souboru.webp
- Pomer: 16:9
- Kategorie: mockup
- Prompt: Detailni popis obrazku. Cim konkretnejsi, tim lepsi vysledek.

### dalsi-soubor.webp
- Pomer: 3:2
- Rozliseni: 2K
- Kategorie: ai_photo
- Thinking: high
- Prompt: Dalsi popis...

### soubor-s-referenci.webp
- Pomer: 1:1
- Kategorie: ai_photo
- Reference: ./reference/style-guide.png
- Prompt: Obrazek ve stylu reference...

---

## Reference: Dostupne parametry

### Modely
| Model | Popis |
|-------|-------|
| `gemini-3.1-flash-image-preview` | Rychly, levny, az 14 ref. obrazku (default) |
| `gemini-3-pro-image-preview` | Nejvyssi kvalita, profesionalni produkce |
| `gemini-2.5-flash-image` | High-volume, nizka latence |

### Rozliseni
`512px` | `1K` (default) | `2K` | `4K`

### Aspect ratio
`1:1` `1:4` `1:8` `2:3` `3:2` `3:4` `4:1` `4:3` `4:5` `5:4` `8:1` `9:16` `16:9` `21:9`

### Kategorie (pro organizaci)
`mockup` `ai_photo` `infographic` `thumbnail` `team_placeholder` `icon` `pattern` `illustration`

### Volitelne per-image parametry
- **Rozliseni**: prepise globalni (napr. `2K` pro hero obrazek, `1K` pro ostatni)
- **Thinking**: `high` pro slozite kompozice (default: `minimal`)
- **Reference**: cesta k referencnimu obrazku pro konzistenci stylu (az 14 ref. obrazku)

### Tipy pro prompty
- Bud konkretni — barvy (#hex), materialy, osvetleni, uhel zaberu
- Pro mockupy: popisuj UI prvky, layout, data v grafech
- Pro fotky: prostredi, obleceni, nalada, typ objektivu
- Pro infografiky: struktura, ikony, flow, porovnani
- "No text overlays, no watermarks" pokud nechces text
- Anglicke prompty funguji lepe nez ceske
