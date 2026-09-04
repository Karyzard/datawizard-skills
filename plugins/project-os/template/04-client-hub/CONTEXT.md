---
title: Klientská plocha
date: 2026-08-25
---

# 04-client-hub

## Účel

Kurátorovaný výřez projektu pro klienta. Používá se **jen u klientů bez vlastního `hub-<klient>` repa** — pokud hub existuje, tahle složka se v projektu nezakládá a rovnou se smaže.

Klient do repa nevidí, vidí jen web vygenerovaný deployem.

## Co sem patří

- `co-je-noveho.md` — changelog pro klienta ze zdrojů `01-communications/03-releases/` a uzavřených itemů ve `40-done/`
- `ukoly/` — úkoly a otázky NA klienta, lifecycle `10-open → 20-sent → 30-done`. **`10-open/` se nikdy nedeployuje**, detail v `ukoly/CONTEXT.md`
- `agenda/` — přípravy schůzek (agendy ano, zápisy nikdy)
- `prototypy/` — prototypy schválené k připomínkám
- `milniky.md` — roadmapa bez interních detailů
- `jak-hlasit.md` — kam poslat bug, nápad, dotaz

## Co sem NIKDY nepatří

Částky a rozpočty, interní IP, servery a přístupy, osobní údaje, cokoli o jiných klientech, interní zápisy ze schůzek.

## Workflow

- **Jednosměrný tok, kurátoruje PO.** Obsah se sem dostává vědomým výběrem. Nikdy se nesdílí odkaz dovnitř týmového repa.
- Agent smí navrhnout obsah jen na výzvu PO. Deploy nikdy.
- **Před každým deployem projít diff plochy.**
