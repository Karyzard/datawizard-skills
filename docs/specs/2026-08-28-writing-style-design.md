---
title: writing-style — plugin pro psaní Karlovým hlasem
date: 2026-08-28
status: implemented
type: spec
---

# writing-style — návrh a rozhodnutí

## Motivace

Karel nechává AI psát e-maily, LinkedIn posty a zprávy. Výstupy ho opakovaně štvou dvěma věcmi: pomlčkami uprostřed věty a krátkými údernými fragmenty („Ne X. Ne Y.", „Tečka."). Pravidla stylu byla roztroušená na čtyřech místech (`~/.claude/rules/tone.md`, `_DATAWIZARD/CLAUDE.md`, `07-resources/linkedin/nastaveni/styl-psani.md`, prázdné drafty v `03-context/writing-styles/`) a žádné z nich nerozlišovalo kanál ani vztah k příjemci.

## Cíl

Jeden skill, který:

1. pozná, co se píše (kanál) a komu (vztah), a podle toho načte správná pravidla,
2. píše Karlovým hlasem (kalibrace z reálných textů),
3. před odevzdáním text deterministicky zkontroluje,
4. funguje i mimo Claude Code (Cursor přes symlink), takže pravidla nesmí záviset na globálním CLAUDE.md.

## Rozhodnutí

| Otázka | Rozhodnutí | Proč |
|---|---|---|
| Kolik skillů | Jeden (`write-as-karel`) s režimem psaní a režimem kontroly/přepisu | Sdílené reference, jeden název k zapamatování. Cursor symlinkuje jen `skills/`, takže reference musí být uvnitř skillu. |
| Kde | Nový plugin `writing-style` | Průřezový základ pro víc kanálů, nesedí do `content-tools` (konverze) ani `client-delivery`. |
| Skript | `scripts/slop-check.py`, stdlib, exit code | Pomlčky a fráze jsou mechanicky chytitelné; skill má povinnost skript spustit a opravit ERROR. |
| Příklady | Publikované posty verbatim (lehce normalizované), e-maily anonymizované | Repo je veřejné. Žádná jména klientů, ceny, odkazy na dema, přístupy. |
| Formát e-mailu | Frontmatter skillu `send-email` | Draft jde rovnou do Outlooku. |
| Hlas jiných lidí | Neřeší se | YAGNI. Kdyby bylo potřeba, přidá se `references/voices/<jméno>.md`. |

## Testování (TDD podle superpowers:writing-skills)

Tři zadání (LinkedIn post z diktátu, cold e-mail cykloservisu, WhatsApp kamarádovi) plus jeden přepis záměrně „slopového" textu.

- **Baseline bez skillu** (subagent s globálním CLAUDE.md): pomlčky žádné (globální pravidla fungují), ale plochý hook, číslovaný postup v těle postu, tři otázky na konci, žádné hashtagy, podpis v těle e-mailu.
- **Se skillem:** hook z konkrétního momentu, jedna otázka, hashtagy 3, e-mail ve formátu send-email, skript prošel napoprvé u všech tří. Přepis slopu: 19 ERROR → 0 ERROR, fakta zachována.
- **Skript** odladěný na falešné poplachy: číslované odrážky, nadpisy, pozdravy, podpisy.

## Údržba

Když Karel v textu něco smaže opakovaně, patří to do `references/voice.md` (Never) nebo `anti-slop.md`. Povedený post do `examples/linkedin-posts.md` s větou proč. Globální `~/.claude/rules/tone.md` může zůstat jako krátká verze; zdroj pravdy je skill.
