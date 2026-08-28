#!/usr/bin/env python3
"""
slop-check.py — deterministická kontrola českého textu na AI signatury.

Použití:
    python3 slop-check.py text.md
    python3 slop-check.py text.md --channel linkedin
    cat text.md | python3 slop-check.py - --channel email

Kanály: linkedin | email | message | offer | any (výchozí)

Výstup: seznam nálezů (ERROR / WARN / INFO) s číslem řádku a úryvkem.
Exit code 1, pokud je aspoň jeden ERROR. Jen stdlib, žádné závislosti.

Skript chytá jen to, co jde chytit regexem. Trojice přídavných jmen,
falešné prozření nebo plochý rytmus musí zkontrolovat člověk (viz
references/anti-slop.md a checklist v SKILL.md).
"""

import argparse
import re
import sys
import unicodedata

# ---------------------------------------------------------------------------
# Zakázané fráze (case-insensitive, hledá se jako podřetězec)
# ---------------------------------------------------------------------------

FORBIDDEN = [
    # kontrastní obrat a copy triky
    "nejde jen o", "nejde jenom o", "není jen o", "není to jen o", "nejen o ", "ne jen o ",
    # vata na začátku
    "v dnešní době", "v dnešním světě", "v dnešní dynamické", "v rychle se měnící",
    "stojí za zmínku", "je důležité poznamenat", "je třeba zmínit", "pojďme se ponořit",
    "pojďme se podívat", "dovolte mi", "rád bych vám", "rád bych vás",
    "skvělá otázka", "dobrý postřeh", "zajímavé je, že", "je pozoruhodné",
    "v neposlední řadě", "sečteno a podtrženo", "celkově vzato", "závěrem lze",
    "na konci dne", "ať už jste", "ať už potřebujete",
    # falešné prozření a falešná hloubka
    "otevřelo mi to oči", "potvrdilo mi to jednu věc", "potvrdilo mi to",
    "donutilo mě to zamyslet", "tady je ta nepříjemná pravda", "pravda je taková",
    "a tady to začíná být zajímavé", "a teď to nejdůležitější", "a víte, co je na tom",
    "pojďme si nalít čistého vína", "upřímně řečeno", "ale pozor",
    "technologie sama o sobě nestačí", "všechno začíná u lidí", "není o technologii, je o lidech",
    "člověk s ai nahradí",
    # ohrané metafory
    "kopilot", "copilot, ne autopilot", "nová ropa", "digitální kolega", "digitálního kolegu",
    "katalyzátor změny", "operační systém firmy", "mění pravidla hry", "game changer", "game-changer",
    # korporátní a AI slovník
    "leverag", "synergi", "holistick", "transformač", "průlomov", "bezprecedent",
    "komplexní řešení", "na míru šit", "šité na míru", "přidaná hodnota", "přidanou hodnotu",
    "best practice", "pain point", "odemkn", "posunout na další úroveň", "na další úroveň",
    "na novou úroveň", "posouvají se", "být součástí něčeho",
    "inovativn", "špičkov", "unikátn", "bezproblémov", "revolučn",
    # drama
    "brutáln", "tečka.",
]

# Slova, která často nahrazují konkrétní sdělení. Jen WARN.
WEAK_WORDS = [
    "klíčov", "zásadní", "komplexn", "efektivn", "strategick", "modern", "robustn",
    "seamless", "rychle a snadno", "jednoduše a rychle", "neváhejte",
]

# Slova, kterými AI ráda začíná věty (WARN, kontroluje se jen na začátku věty)
SENTENCE_STARTERS = [
    "určitě", "samozřejmě", "jistě", "bezpochyby", "navíc", "kromě toho", "dále",
    "nicméně", "nepochybně", "v podstatě",
]

# ---------------------------------------------------------------------------
# Pomocné funkce
# ---------------------------------------------------------------------------

EMOJI_RE = re.compile(
    "[\U0001F300-\U0001FAFF\U00002600-\U000027BF\U0001F1E6-\U0001F1FF⭐⬆⬇✅❌❗]"
    "(?:️|‍[^\s]+)?"
)

SENT_END_RE = re.compile(r"(?<=[.!?…])\s+(?=[„\"(A-ZÁ-Ž0-9])")
ABBREV_RE = re.compile(r"\b(např|tj|tzv|atd|apod|resp|cca|č|s\.r\.o|a\.s|Kč|hod|min|tis|mil|P\.S|P\.P\.S|st|ul)\.$")


def strip_frontmatter(text: str) -> str:
    if text.startswith("---"):
        end = text.find("\n---", 3)
        if end != -1:
            return text[end + 4:]
    return text


LIST_MARKER_RE = re.compile(r"^\s*(\d+[.)]|[-*•]|[a-z][.)])\s+")
GREETING_RE = re.compile(
    r"^\s*(dobrý den|ahoj|čau|hezký den|hezké léto|s pozdravem|měj se|mějte se|díky|děkuji|karel|karel šimek|p\.?\s?s\.?)\b",
    re.IGNORECASE,
)


def split_sentences(line: str):
    """Naivní dělení na věty. Vrací seznam vět (bez ořezaných uvozovek).

    Přeskakuje číslování odrážek („1.“, „-“) a řádky s pozdravem či podpisem,
    aby je skript nepočítal jako jednoslovné věty.
    """
    line = LIST_MARKER_RE.sub("", line.strip())
    if GREETING_RE.match(line) and len(line) < 40:
        return []
    parts = SENT_END_RE.split(line)
    merged = []
    for p in parts:
        if merged and ABBREV_RE.search(merged[-1]):
            merged[-1] = merged[-1] + " " + p
        else:
            merged.append(p)
    return [s.strip() for s in merged if s.strip()]


def word_count(sentence: str) -> int:
    cleaned = re.sub(r"[„“\"()\[\]*_#>:;,.!?…]", " ", sentence)
    cleaned = EMOJI_RE.sub(" ", cleaned)
    return len([w for w in cleaned.split() if w])


def first_word(sentence: str) -> str:
    cleaned = re.sub(r"^[„“\"(\[*_#>\s]+", "", sentence)
    cleaned = EMOJI_RE.sub("", cleaned).strip()
    m = re.match(r"[\wÁ-Žá-ž]+", cleaned)
    return m.group(0).lower() if m else ""


# ---------------------------------------------------------------------------
# Kontroly
# ---------------------------------------------------------------------------

def check(text: str, channel: str):
    findings = []  # (severity, line_no, rule, snippet)

    def add(sev, ln, rule, snippet):
        findings.append((sev, ln, rule, snippet.strip()[:110]))

    lines = text.splitlines()
    total_emoji = 0
    hashtags = 0
    one_word_sentences = 0
    short_sentence_total = 0
    exclamations = 0
    is_code = False

    for i, raw in enumerate(lines, 1):
        line = raw.rstrip()
        if line.strip().startswith("```"):
            is_code = not is_code
            continue
        if is_code or not line.strip():
            continue
        # Markdown nadpisy a HTML komentáře nejsou věty
        if re.match(r"^\s*#{1,6}\s", line) or line.strip().startswith("<!--"):
            continue
        # Tabulky a řádky s rozsahem nechat být
        is_table = line.strip().startswith("|")

        # --- Pomlčky uprostřed věty -------------------------------------
        if not is_table:
            for m in re.finditer(r"—", line):
                add("ERROR", i, "pomlcka", line)
                break
            # en dash: povolen jen v rozsahu (10–12, po–pá, 2024–2026)
            for m in re.finditer(r"–", line):
                before = line[max(0, m.start() - 1):m.start()]
                after = line[m.end():m.end() + 1]
                if not (re.match(r"[\wÁ-Žá-ž0-9]", before or " ") and re.match(r"[\wÁ-Žá-ž0-9]", after or " ")):
                    add("ERROR", i, "pomlcka", line)
                    break
            # spojovník s mezerami použitý jako pomlčka
            if re.search(r"\S\s-\s\S", line) and not re.match(r"^\s*-\s", line):
                add("ERROR", i, "pomlcka", line)

        # --- Zakázané fráze ----------------------------------------------
        low = line.lower()
        for phrase in FORBIDDEN:
            if phrase in low:
                add("ERROR", i, f"fráze „{phrase.strip()}“", line)
        for w in WEAK_WORDS:
            if w in low:
                add("WARN", i, f"slabé slovo „{w}“ (nahraď konkrétním sdělením)", line)

        # --- Věty -------------------------------------------------------
        sentences = split_sentences(line)
        prev_wc = None
        prev_first = None
        for s in sentences:
            wc = word_count(s)
            fw = first_word(s)
            if fw in SENTENCE_STARTERS:
                add("WARN", i, f"věta začíná vatou „{fw}“", s)
            terminated = s[-1] in ".!?…" if s else False
            plain = not re.search(r"#\w", s) and not s.startswith("http") and terminated
            if wc == 1 and plain:
                one_word_sentences += 1
                add("ERROR", i, "jednoslovná věta (drama)", s)
            elif wc <= 3 and plain:
                short_sentence_total += 1
                if prev_wc is not None and prev_wc <= 3:
                    add("ERROR", i, "dvě krátké věty za sebou (řetěz úderů)", s)
            if prev_first and fw and fw == prev_first and wc <= 6 and prev_wc is not None and prev_wc <= 6:
                add("ERROR", i, f"anafora („{fw}… {fw}…“)", s)
            if s.endswith("?") and wc <= 3:
                # otázka-odpověď trik: krátká otázka a hned krátká odpověď
                idx = sentences.index(s)
                if idx + 1 < len(sentences) and word_count(sentences[idx + 1]) <= 6:
                    add("ERROR", i, "otázka-odpověď copy trik", s + " " + sentences[idx + 1])
            prev_wc = wc
            prev_first = fw

        # --- Trojice (jen INFO, člověk rozhodne) -------------------------
        for m in re.finditer(r"\b([\wÁ-Žá-ž]{3,}),\s+([\wÁ-Žá-ž]{3,})\s+a\s+([\wÁ-Žá-ž]{3,})\b", line):
            add("INFO", i, "možná trojice ze zvyku (rychlý, jednoduchý a přehledný)", m.group(0))

        # --- Interpunkce ------------------------------------------------
        exclamations += line.count("!")
        if "..." in line or "…" in line:
            add("WARN", i, "tři tečky", line)

        # --- Emoji --------------------------------------------------------
        emojis = EMOJI_RE.findall(line)
        total_emoji += len(emojis)
        if re.search(EMOJI_RE.pattern + r"\s?" + EMOJI_RE.pattern, line):
            add("ERROR", i, "dvě emoji vedle sebe", line)
        if EMOJI_RE.match(line.strip()) and len(line.strip()) > 3:
            add("WARN", i, "řádek začíná emoji (emoji jako odrážka)", line)

        # --- Hashtagy, markdown ----------------------------------------
        hashtags += len(re.findall(r"(?<!\w)#[\wÁ-Žá-ž]+", line))
        if channel in ("linkedin", "message") and re.match(r"^\s*([-*]\s|#{1,6}\s|\*\*)", line):
            add("WARN", i, "markdown v kanálu bez formátování", line)

    # --- Souhrnné kontroly --------------------------------------------------
    if exclamations > 1:
        add("WARN", 0, f"vykřičníky: {exclamations} (max 1)", "")
    if short_sentence_total > 2:
        add("WARN", 0, f"krátkých vět (≤3 slova) celkem {short_sentence_total}, drž max 1 až 2 na text", "")
    if channel == "linkedin" and hashtags > 3:
        add("ERROR", 0, f"hashtagy: {hashtags} (max 3)", "")
    if channel == "linkedin" and total_emoji > 3:
        add("ERROR", 0, f"emoji: {total_emoji} (max 3 na post)", "")
    if channel in ("email", "offer") and total_emoji > 0:
        add("ERROR", 0, f"emoji v {channel}: {total_emoji} (do e-mailu cizímu člověku a do nabídky emoji nepatří)", "")
    if channel == "message" and total_emoji > 1:
        add("WARN", 0, f"emoji ve zprávě: {total_emoji} (max 1)", "")

    return findings


def main():
    ap = argparse.ArgumentParser(description="Kontrola českého textu na AI signatury.")
    ap.add_argument("file", help="cesta k souboru nebo - pro stdin")
    ap.add_argument("--channel", default="any", choices=["linkedin", "email", "message", "offer", "any"])
    args = ap.parse_args()

    if args.file == "-":
        text = sys.stdin.read()
    else:
        with open(args.file, encoding="utf-8") as f:
            text = f.read()

    text = unicodedata.normalize("NFC", strip_frontmatter(text))
    findings = check(text, args.channel)

    order = {"ERROR": 0, "WARN": 1, "INFO": 2}
    findings.sort(key=lambda f: (order[f[0]], f[1]))

    errors = sum(1 for f in findings if f[0] == "ERROR")
    warns = sum(1 for f in findings if f[0] == "WARN")

    if not findings:
        print("OK: žádné nálezy.")
        return 0

    for sev, ln, rule, snippet in findings:
        loc = f"ř. {ln}" if ln else "text"
        print(f"{sev:5} {loc:>7}  {rule}" + (f"\n             {snippet}" if snippet else ""))

    print(f"\nCelkem: {errors} ERROR, {warns} WARN. ERROR oprav vždy, WARN posuď.")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
