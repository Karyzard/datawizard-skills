---
name: send-email
description: Připraví email z Markdown draftu s YAML frontmatter — převede na HTML a otevře v Outlooku, nebo vypíše jako čistý text ke zkopírování. Používej tento skill kdykoli uživatel chce poslat email, napsat email klientovi, připravit zprávu, naformátovat email, nebo říká "/send-email". Triggeruj i na "pošli email", "napiš email", "otevři v Outlooku", "připrav zprávu pro klienta", "send this email", "open in Outlook", "draft an email", "naformátuj email". Komunikuj česky.
---

# Send Email

Připravíš email z Markdown draftu. Výchozí výstup je otevření zprávy v Microsoft Outlooku. Alternativně můžeš vypsat čistý text, který si uživatel zkopíruje sám.

## Kdy se skill aktivuje

- Uživatel má hotový `.md` soubor s email draftem a chce ho poslat
- Uživatel chce napsat email od nuly
- Uživatel říká cokoliv o posílání emailu klientovi

## Výstupní formáty

| Formát | Kdy použít | Jak |
|--------|-----------|-----|
| `outlook` (výchozí) | Uživatel chce otevřít v Outlooku | `--format outlook` |
| `text` | Uživatel říká "jenom text", "zkopíruju si to sám", "nechci Outlook" | `--format text` |

Pokud uživatel nespecifikuje, použij `outlook`.

## Workflow

### Varianta A: Existující Markdown draft

Pokud uživatel odkáže na existující `.md` soubor:

1. Přečti soubor a ověř, že má YAML frontmatter s povinnými poli (`to`, `subject`)
2. Pokud chybí povinná pole, doptej se
3. Spusť bundlovaný skript:

```bash
# Outlook (výchozí)
python "<SKILL_DIR>/scripts/open-in-outlook.py" "<cesta-k-md-souboru>"

# Plain text
python "<SKILL_DIR>/scripts/open-in-outlook.py" "<cesta-k-md-souboru>" --format text

# S přílohami
python "<SKILL_DIR>/scripts/open-in-outlook.py" "<cesta-k-md-souboru>" \
  --attachment "/cesta/k/priloha1.pdf" \
  --attachment "/cesta/k/priloha2.docx"
```

### Varianta B: Email od nuly

Pokud uživatel chce napsat nový email:

1. Zeptej se na klíčové informace (pokud nejsou zřejmé z kontextu):
   - Komu? (jméno + email)
   - Předmět?
   - O čem má email být? (body/kontext)
   - Přílohy?
2. Napiš Markdown draft a ulož ho do příslušné složky
3. Ukaž uživateli draft k odsouhlasení
4. Po schválení spusť skript

### Kde uložit nový draft

Pokud pracuješ v klientské složce, ulož draft do:
```
<klient>/01-communications/02-messages/<YYYY-MM-DD>-<popis>/
```

Pokud ne, zeptej se uživatele kam uložit.

## Formát Markdown draftu

```markdown
---
type: sent-email
date: 2026-04-08
to: Jméno Příjemce <email@example.com>
subject: Předmět emailu
from: Karel Šimek <karel@datawizard.cz>
signature: datawizard
status: draft
attachments:
  - ../priloha1.pdf
  - /absolutni/cesta/k/priloha2.docx
---

# Název emailu (neposílá se — slouží jako nadpis v souboru)

Dobrý den,

text emailu v Markdownu...

S pozdravem
**Karel Šimek**
DatawizardCZ
Tel.: 720 738 044
```

### Frontmatter pole

| Pole | Povinné | Popis |
|------|---------|-------|
| `to` | ano | Příjemce — `Jméno <email>` nebo jen `email` |
| `subject` | ano | Předmět zprávy |
| `from` | ne | Odesílatel (pro kontext, Outlook použije aktivní účet) |
| `signature` | ne | Podpis: `datawizard` (výchozí) nebo `tokada` — viz tabulka níže |
| `date` | ne | Datum draftu |
| `type` | ne | Vždy `sent-email` |
| `status` | ne | `draft` nebo `sent` |
| `attachments` | ne | Seznam cest k přílohám (relativní k .md souboru nebo absolutní) |

### Podpisy

| Hodnota `signature` | Podpis |
|---------------------|--------|
| `datawizard` (výchozí) | **Karel Šimek**, DatawizardCZ, Tel.: 720 738 044 |
| `tokada` | **Karel Šimek**, Tokada, Tel.: 720 738 044 |

Při psaní emailu od nuly použij podpis podle hodnoty `signature` ve frontmatter. Pokud chybí, použij `datawizard`.

### Co skript dělá s Markdown body

- Odstraní blockquoty na začátku (metadata draft) a úvodní `# Nadpis`
- **Formát `outlook`**: Převede Markdown na HTML (Calibri, inline styly), otevře v Outlooku přes AppleScript
- **Formát `text`**: Vypíše hlavičku (Komu, Předmět) + čistý Markdown body na stdout

### Podporovaný Markdown

| Syntax | Výstup |
|--------|--------|
| `**text**` | **tučný** |
| `*text*` | *kurzíva* |
| `[text](url)` | odkaz |
| `# Nadpis` | nadpis (h1–h3) |
| `- položka` | odrážkový seznam |
| `1. položka` | číslovaný seznam |
| `---` | horizontální čára |
| `` `kód` `` | inline kód |

## Spuštění skriptu

Skript je bundlovaný v tomto skillu. Cesta ke skriptu je relativní k SKILL.md:

```
<tento-skill>/scripts/open-in-outlook.py
```

Skript potřebuje Python 3 (standardní knihovny, žádné dependencies) a Microsoft Outlook nainstalovaný na macOS.

## Po spuštění

- **Outlook**: Oznam, že zpráva je otevřená. Připomeň: "Zkontroluj a pošli ručně"
- **Text**: Výstup skriptu ukaž uživateli — je to hotový text ke zkopírování
- Pokud je `status: draft` ve frontmatter, nabídni aktualizaci na `status: sent` po odeslání

## Důležité

- Nikdy neposílej email automaticky — vždy jen připrav k ruční kontrole
- Přílohy: ověř, že soubory existují, než spustíš skript
- Pokud skript selže (Outlook není otevřený, špatná cesta), vypiš srozumitelnou chybu
