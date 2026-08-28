---
title: writing-style
date: 2026-08-28
---

# writing-style

Jak psát texty Karlovým jménem tak, aby nebyly poznat jako psané AI. Jeden skill, který podle kanálu a vztahu k příjemci načte správná pravidla, napíše text a před odevzdáním ho prožene deterministickou kontrolou.

## Skills

- **write-as-karel** — LinkedIn post, komentář, text nad karuselem, e-mail (cold s prototypem, follow-up, nabídkový, odpověď na oslovení), zpráva (WhatsApp, Messenger, LinkedIn DM, Slack), cenová nabídka. Umí i režim kontroly a přepisu existujícího textu („zní to jako AI", „vyhoď pomlčky").

## Struktura skillu

```
skills/write-as-karel/
  SKILL.md                      postup: co píšu, s kým, napiš, zkontroluj, odevzdej
  scripts/slop-check.py         kontrola textu (pomlčky, zakázané fráze, fragmenty, emoji, hashtagy)
  references/
    voice.md                    Karlův hlas: co je pro něj typické, always / never, kalibrační věty
    anti-slop.md                zakázané vzorce s příklady špatně / dobře + ruční checklist
    audiences.md                pět vztahů: cizí majitel, kamarád, klient v běhu, LinkedIn, tým
    channels/linkedin.md        dramaturgie postu, karusel, komentáře, kam uložit
    channels/email.md           čtyři typy e-mailů, formát pro send-email
    channels/messages.md        WhatsApp, Messenger, LinkedIn DM, Slack
    channels/offer.md           struktura cenové nabídky
    examples/linkedin-posts.md  čtyři publikované posty s poznámkou, proč fungují
    examples/emails-and-messages.md  devět reálných e-mailů a zpráv (anonymizované)
```

## Kontrolní skript

```bash
python3 plugins/writing-style/skills/write-as-karel/scripts/slop-check.py text.md --channel linkedin
```

Vrátí seznam nálezů (ERROR / WARN / INFO) a exit code 1, když je aspoň jeden ERROR. Jen Python 3 stdlib. Dá se použít i samostatně, mimo skill, třeba v pre-commit hooku nebo v Cursoru.

## Údržba hlasu

Hlas se mění. Když Karel v textu něco smaže nebo přepíše opakovaně, patří to do `references/voice.md` (sekce Never / Always) nebo do `references/anti-slop.md`. Nový publikovaný post, který se povedl, patří do `examples/linkedin-posts.md` s jednou větou, proč funguje.

Repo je veřejné. Do příkladů nepatří jména klientů, ceny, odkazy na dema ani přístupy.

## Instalace

```
/plugin install writing-style@datawizard-skills
```

Cursor: symlink `plugins/writing-style/skills` do `~/.cursor/skills/writing-style`.
