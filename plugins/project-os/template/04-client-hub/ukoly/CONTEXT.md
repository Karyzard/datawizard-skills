---
title: Úkoly a otázky na klienta
date: 2026-08-25
---

# 04-client-hub/ukoly

## Účel

Úkoly a otázky, které čekáme **od klienta**. Obsahové artefakty, ne trackovací tikety. Tahle složka je zároveň zdroj pravdy i to, co klient vidí; žádná druhá kopie jinde neexistuje.

## Lifecycle — stav je umístění

| Složka | Význam | Vidí klient? |
|---|---|---|
| `10-open/` | formulujeme, klient to ještě neviděl | **NE, nikdy** |
| `20-sent/` | odesláno klientovi, čekáme na odpověď | ano |
| `30-done/` | zodpovězeno nebo dodáno | ano |

## ⚠️ `10-open/` se nikdy nedeployuje

Tohle je jediné místo v repu, kde vedle sebe leží interní a veřejný obsah. `deploy.sh` publikuje **jen** `20-sent/` a `30-done/`, výčtem, ne plošným kopírováním. Kdo mění `deploy.sh`, musí to pravidlo zachovat.

Odeslání úkolu klientovi = přesun z `10-open/` do `20-sent/`. Až tímhle přesunem se obsah stává veřejným, takže před přesunem se čte celý soubor, ne jen nadpis.

## Workflow

- Průřezové otázky se **deduplikují před odesláním**. Klient nemá dostat tutéž otázku třikrát z různých fází.
- Trackování volitelně GitHub Issue s labelem `client-question`, které odkazuje na soubor. Zdroj pravdy je soubor.
- Klientské výstupy nemají vlastní top-level složku: žijí ve fázových složkách, release komunikace v `01-communications/03-releases/`.

## Co sem nepatří

- Práce pro tým. To je delivery item ve `40-delivery/`.
- Otázky OD klienta k dovyjasnění zadání. Ty patří k delivery itemu do `otazky.md`.
