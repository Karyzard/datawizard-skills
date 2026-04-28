# Product Backlog Dashboard

Interaktivní vizualizace product backlogu — nasaditelná přes Netlify Drop nebo lokální server.

## Obsah složky

```
product-backlog-files/
  index.html          -- vizualizační engine (needituješ)
  data.json           -- backlog data (edituj nebo nech vygenerovat AI)
  README.md           -- tento soubor
  source-docs/        -- zdrojové dokumenty pro AI generování
    README.md         -- návod co sem patří
    (tvoje dokumenty)
```

---

## Jak spustit lokálně

Soubory **nelze otevřít dvojklikem** — potřebuješ lokální server:

```bash
cd "cesta/k/product-backlog-files"
npx serve .
# Otevři http://localhost:3000
```

Alternativa přes Python:

```bash
python3 -m http.server 8080
# Otevři http://localhost:8080
```

---

## Jak nasadit na Netlify Drop

1. Otevři [app.netlify.com/drop](https://app.netlify.com/drop)
2. Přetáhni celou složku `product-backlog-files/` do okna prohlížeče
3. Netlify vygeneruje veřejnou URL — sdílej s klientem nebo týmem

Pro aktualizaci: uprav `data.json`, přetáhni složku znovu.

---

## Jak aktualizovat backlog přes AI (Cursor)

### Poprvé — vygeneruj backlog z dokumentace

1. Nahraj zdrojové dokumenty do `source-docs/` (viz `source-docs/README.md`)
2. V Cursor chatu napiš:

```
Vygeneruj backlog dashboard z dokumentů v source-docs/
```

### Aktualizace po sprintu nebo přidání nápadů

```
Aktualizuj backlog dashboard — přibyly nové nápady v source-docs/IDEAS.md
```

---

## Ruční editace data.json

| Sekce | Co edituješ |
|-------|-------------|
| `meta` | Název projektu, datum review, reviewer |
| `context` | Shrnutí a klíčový insight pro dashboard |
| `boulders` | Největší funkční celky (max 10), MoSCoW priorita |
| `rocks` | Epiky, T-shirt sizing (XS/S/M/L/XL) |
| `stories` | User stories, story points (1,2,3,5,8,13), acceptance criteria |
| `milestones` | Milníky s datem a stavem (planned/in-progress/done/at-risk) |
| `sprints` | Sprinty s kapacitou, cílem a výběrem stories |
| `dependencies` | Závislosti mezi features |
| `questions` | Otevřené otázky k zodpovězení |

Povolené hodnoty `status` milestonu: `planned` | `in-progress` | `done` | `at-risk`

---

## Detailní schéma polí

Viz `~/.cursor/skills/backlog-dashboard/schema.md` (v Cursoru).
