---
name: pdf-to-markdown
description: >-
  Převede prezentační PDF (slidy) do strukturovaného Markdownu. Každý slide = H1 sekce.
  Prázdné slidy (bez textu) detekuje jako image-only, exportuje jako PNG a vizuálně
  analyzuje obsah. Použij kdykoli uživatel chce převést PDF prezentaci do Markdownu,
  zpracovat přednášku, nebo vytáhnout poznámky ze slidů. Triggeruj na "převeď PDF",
  "PDF do markdownu", "zpracuj prezentaci", "zpracuj slidy", "pdf to markdown",
  "převeď přednášku". Komunikuj česky.
---

# PDF to Markdown

Převede prezentační PDF na strukturovaný Markdown, kde **každý slide = jedna H1 sekce**.

## Závislosti

```bash
pip3 install PyMuPDF
```

## Postup

### 1. Přečti PDF a rozděl na slidy

Přečti PDF pomocí Read tool. Cursor vrací text s page markery ve formátu:

```
[obsah stránky]

-- X of Y --
```

**Parsování:** Obsah před `-- 1 of Y --` = slide 1. Obsah mezi `-- N of Y --` a `-- N+1 of Y --` = slide N+1. Celkový počet slidů = Y.

### 2. Klasifikuj každý slide

Odfiltruj z textu slidu:
- Opakující se footer prezentace (typicky řádek obsahující jméno autora, rok, název kurzu)
- Samostatná čísla (čísla stránek v patičce)
- Prázdné řádky

Po filtraci klasifikuj:

| Kategorie | Podmínka | Příklad |
|-----------|----------|---------|
| **image-only** | Nezůstal žádný text | Slide s diagramem, schématem, obrázkem |
| **section-header** | Zůstal jen krátký nadpis (1–3 slova) | "Rekapitulace", "Domácí úkol" |
| **text-rich** | Zůstal víceřádkový obsah | Slide s textem, tabulkou, seznamem |
| **partial-text** | Text je nekompletní — chybí nadpis/otázka, jsou jen odpovědi/fragmenty | Kvízový slide kde odpovědi A/B/C se extrahovaly, ale otázka ne |

**Detekce partial-text slidů:** Pokud text začíná rovnou odpověďmi (A/B/C) bez předchozí otázky, nebo obsahuje jen odrážky bez kontextu, exportuj stránku jako PNG a doplň chybějící text z vizuální analýzy.

### 3. Zpracuj image-only a partial-text slidy

Pro **každý** slide klasifikovaný jako image-only nebo partial-text:

1. Exportuj stránku jako PNG:

```bash
python3 ~/.cursor/skills/pdf-to-markdown/scripts/export_pdf_page.py "CESTA_K_PDF" CISLO_STRANKY /tmp/slide_PAGE.png
```

2. Přečti exportovaný PNG pomocí Read tool (vizuální analýza)
3. Z analýzy napiš strukturovaný textový popis do Markdownu
4. Po zpracování smaž dočasný PNG:

```bash
rm /tmp/slide_PAGE.png
```

### 4. Vygeneruj Markdown

Celý výstup je **jeden `.md` soubor** — každý slide jako H1 sekce.

#### Formát nadpisu

```
# Slide X: Odvozený název
```

- **X** = číslo slidu
- **Odvozený název** = první smysluplný řádek textu slidu, nebo název odvozený z vizuální analýzy u image-only slidů

#### Šablona — text-rich slide

```markdown
# Slide X: Název

[Obsah slidu převedený do čistého Markdownu]

---
```

#### Šablona — section-header slide

```markdown
# Slide X: Název sekce

---
```

#### Šablona — image-only slide

```markdown
# Slide X: Odvozený název z vizuální analýzy

> Slide obsahuje pouze obrázek/diagram.

[Strukturovaný textový popis: co obrázek zobrazuje, jaké prvky obsahuje,
jaká je struktura/sdělení diagramu. Použij číslované seznamy pro fáze/kroky,
tučné písmo pro klíčové pojmy.]

---
```

#### Šablona — kvízový slide

```markdown
# Slide X: Otázka — [stručné téma]

*[Text otázky]*

- A) [Odpověď A]
- **B) [Odpověď B]** ✓
- C) [Odpověď C]

---
```

Pokud je ze slidu zřejmá správná odpověď (tučná, jiná barva, zvýrazněná), označ ji tučně + ✓. Pokud ne, ponech všechny odpovědi bez označení.

### 5. Pravidla formátování

- **Footer prezentace** (jméno autora, rok, název kurzu) — použij jen jednou v metadatech pod H1 prvního slidu, ze zbytku ignoruj
- **Čísla stránek** v patičce — ignoruj
- **Tabulky** — použij pro strukturovaná data (agendy, seznamy nástrojů, srovnání)
- **Odrážky/seznamy** — zachovej původní strukturu
- **Separátor** `---` — vždy mezi slidy
- **Cvičení** — pokud slide obsahuje vstup/výstup/nástroj, formátuj jako:

```markdown
**Vstup:** [co je potřeba]
**Výstup:** [co vznikne]
**Nástroj:** [jaký nástroj použít]
```

### 6. Ulož výstup

Soubor ulož vedle původního PDF se stejným názvem a příponou `.md`:

```
AIUX_Week2_Lesson3.pdf → AIUX_Week2_Lesson3.md
```

## Příklad výstupu

Pro prezentaci s 3 slidy (title, text-rich, image-only):

```markdown
# Slide 1: AI pro UX/UI Product Design — Týden 2, Lekce 3

*Lukáš Soukup — 2026*

---

# Slide 2: Co nás čeká

| Téma | Čas |
|------|-----|
| Rekapitulace – shrnutí předchozí lekce | 5 min |
| Domácí úkol | 15 min |
| Definování a ideace | 15 min |

---

# Slide 7: Design Thinking proces

> Slide obsahuje pouze obrázek/diagram.

Cyklický diagram zobrazující 5 fází Design Thinking procesu propojených šipkami:

1. **Discovery** — průzkum a porozumění problému (ikona: dokument s lupou)
2. **Definition** — definování problému a cílů (ikona: trychtýř)
3. **Ideation** — generování nápadů a řešení (ikona: žárovka)
4. **Prototyping** — tvorba prototypů (ikona: wireframe s 3D kostkou)
5. **Testing** — testování s uživateli (ikona: osoba s checklistem)

Fáze jsou uspořádány v kruhu, šipky naznačují iterativní charakter procesu — po Testing se vracíme zpět k Discovery.

---
```

## Edge cases

- **Kvízové slidy s chybějící otázkou** — PDF často neextrahuje stylizované nadpisy kvízových otázek. Pokud text slidu začíná odpověďmi A/B/C bez otázky, exportuj stránku a doplň otázku z vizuální analýzy
- **Slide s kvízem bez viditelné správné odpovědi** — ponech odpovědi bez označení, přidej poznámku `(správná odpověď nebyla na slidu označena)`
- **Vícero prázdných slidů za sebou** — každý exportuj a analyzuj zvlášť
- **Slide s minimem textu + obrázkem** — pokud text po filtraci footeru neříká nic smysluplného, zpracuj jako image-only
- **Stejný nadpis na více slidech** (např. "Cvičení") — rozliš podnázvem: `# Slide 9: Cvičení — User Stories`
