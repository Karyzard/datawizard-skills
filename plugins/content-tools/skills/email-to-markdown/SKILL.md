---
name: email-to-markdown
description: >-
  Převede e-mail uložený jako .msg soubor (Outlook) do čistého Markdown souboru.
  Extrahuje předmět, odesílatele, datum a tělo zprávy, odstraní HTML tagy
  a uloží výstup jako .md vedle originálního souboru.
  Použij kdykoli uživatel chce převést email do markdownu, zpracovat .msg soubor,
  nebo ukázuje na soubor z Outlooku. Triggeruj na "email to markdown", "převeď email",
  "zpracuj email", "msg soubor", "outlook email", "email do md", "/email".
  Komunikuj česky.
---

# Email to Markdown

Převede `.msg` soubor (Outlook) na čistý Markdown.

## Závislosti

Knihovna `extract-msg` musí být nainstalovaná:
```bash
pip3 install extract-msg
```

Ověř dostupnost:
```bash
pip3 show extract-msg
```

## Postup

### 1. Identifikuj soubor

Uživatel ukáže na `.msg` soubor (cestou, @referencí nebo popisem). Pokud soubor není jasný, zeptej se.

### 2. Extrakce přes Python

Spusť pomocí Shell nástroje:

```python
import extract_msg
from bs4 import BeautifulSoup
import re

msg = extract_msg.openMsg("CESTA_K_SOUBORU.msg")

subject = (msg.subject or "(bez předmětu)").strip()
sender  = msg.sender or "(neznámý odesílatel)"
date_prefix = str(msg.date)[:10] if msg.date else "0000-00-00"

html = msg.htmlBody
soup = BeautifulSoup(html, "html.parser")

# Odstraň style/script
for tag in soup.find_all(["style", "script"]):
    tag.decompose()

# Konvertuj linky na Markdown
for a in soup.find_all("a", href=True):
    text = a.get_text(strip=True)
    href = a["href"]
    if text:
        if href.startswith("mailto:"):
            a.replace_with(href.replace("mailto:", ""))
        elif any(x in text.lower() for x in ["opt-out", "unsubscribe"]):
            a.replace_with("")
        else:
            a.replace_with(f"[{text}]({href})")

# Konvertuj bold/italic
for tag in soup.find_all("strong"):
    tag.replace_with(f"**{tag.get_text()}**")
for tag in soup.find_all("em"):
    tag.replace_with(f"*{tag.get_text()}*")

# Extrahuj odstavce
paragraphs = []
for p in soup.find_all("p"):
    text = p.get_text(separator=" ").strip()
    text = text.replace("\xa0", " ").strip()
    text = re.sub(r' +', ' ', text)
    if text:
        paragraphs.append(text)

body = "\n\n".join(paragraphs)

# Odstraň opt-out patičky
body = "\n\n".join(
    l for l in body.split("\n\n")
    if not any(x in l.lower() for x in ["opt-out", "unsubscribe", "do not wish"])
)

print(subject, sender, date_prefix, "---", body, sep="\n")
```

### 3. Vytvoř Markdown soubor

Výstupní soubor uložte vedle originálního `.msg` souboru, název odvoď z předmětu:
- lowercase, mezery → pomlčky, bez speciálních znaků
- prefix s datem z e-mailu: `YYYY-MM-DD nazev-emailu.md`

### Výstupní šablona

```markdown
# {subject}

**Od:** {sender}  
**Datum:** {date}

---

{body_clean}
```

### 4. Zachování originálů

`.msg` soubor **nemaž ani nepřejmenovávej** — pouze vytvoř nový `.md` soubor vedle něj.

## Zpracování více souborů

Pokud uživatel ukáže na složku:
1. Najdi všechny `.msg` soubory (`glob("*.msg")`)
2. Zpracuj každý zvlášť
3. Vypiš seznam vytvořených `.md` souborů

## Poznámky k čištění těla

- Odstraň prázdné řádky vzniklé z HTML `&nbsp;`
- Odstraň unsubscribe / opt-out patičky (poslední řádky obsahující "opt-out", "unsubscribe", "odhlásit")
- Zachovej odrážky, číslování a strukturu
- Linky zachovej v Markdown formátu: `[text](url)`
