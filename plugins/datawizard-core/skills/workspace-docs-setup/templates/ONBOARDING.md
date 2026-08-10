---
title: Onboarding — první týden v týmu
date: YYYY-MM-DD
status: active
---

# ONBOARDING — Vítej v týmu {{ Workspace Name }}

> **Kdy použít:** Jsi nový člen týmu. Tento dokument tě provede prvním týdnem.
>
> **Údržba:** Když se mění proces nebo přibyde nová klíčová složka, aktualizuj sekci „Den 2" a „Den 3".

## Den 1 — Co je {{ Workspace Name }} a kdo v týmu dělá co

**Cíl dne:** Vědět co stavíme/řešíme a kdo má jakou roli.

### Přečti v tomto pořadí

1. [`README.md`](README.md) — co je projekt, aktuální stav (5 min)
2. [`DEVELOPMENT-PROCESS.md`](DEVELOPMENT-PROCESS.md) — role, sprint cyklus, eskalace (15 min) {{ pokud existuje }}
3. [`{{ context-folder }}/CONTEXT.md`]({{ context-folder }}/CONTEXT.md) — sdílený kontext (10 min)

### Kontaktní osoby

| Osoba | Role | Komunikuje přes |
|---|---|---|
| {{ Jméno }} | {{ Role }} | {{ Kanál }} |
| ... | ... | ... |

<!-- SECTION: druha-osoba-v-tymu -->
### Tvůj scope (druhá osoba v týmu)

{{ Vyplní seed z 00-kickoff.md sekce 6.2 — pokud v týmu není druhá osoba, obsah této sekce se maže, HTML komentáře zůstávají jako kotvy pro re-seed. }}
<!-- /SECTION -->


### Akce na konci dne 1

- [ ] Přidán do komunikačních kanálů (Slack / e-mail / WhatsApp)
- [ ] Přístup k workspace souborům
- [ ] Pochopení procesu z `DEVELOPMENT-PROCESS.md`

---

## Den 2 — Orientace v dokumentaci

**Cíl dne:** Vědět kde co najít.

### Klíčové dokumenty v rootu

| Soubor | Účel | Kdy otevřít |
|---|---|---|
| [`AGENTS.md`](AGENTS.md) | Routing tabulka | Když nevíš kam jít |
| [`TODO.md`](TODO.md) | Operativní úkoly | Sprint start, status check |
| [`IDEAS.md`](IDEAS.md) | Funnel nápadů | Sprint review |

### Top-level složky

Každá složka má **`CONTEXT.md`** jako rozcestník.

| Složka | Otevři když potřebuješ |
|---|---|
| [`{{ ... }}/`]({{ ... }}/CONTEXT.md) | {{ kdy }} |
| ... | ... |

### Akce na konci dne 2

- [ ] Otevřel jsi alespoň 3 `CONTEXT.md` v různých složkách
- [ ] Procházel jsi sdílený kontext
- [ ] Zkontroloval jsi aktuální stav

---

## Den 3 — Najdi svou oblast

**Cíl dne:** Pochopit, na čem konkrétně budeš dělat.

| Pracuješ na | Začni v |
|---|---|
| {{ Oblast 1 }} | [`{{ ... }}/CONTEXT.md`]({{ ... }}/CONTEXT.md) |
| {{ Oblast 2 }} | [`{{ ... }}/CONTEXT.md`]({{ ... }}/CONTEXT.md) |

V `CONTEXT.md` vždy najdeš sekci **„Doporučené pořadí čtení"** — drž se jí.

---

## Den 4–5 — První úkol

1. {{ Kdo }} ti přidělí první úkol
2. Pracuj podle procesu v [`DEVELOPMENT-PROCESS.md`](DEVELOPMENT-PROCESS.md)
3. Po dokončení: handoff
4. Zúčastni se nejbližšího mid-sprint check / review

---

## Konvence, které musíš znát

### Naming

- **Soubory a složky**: `kebab-case`, **bez diakritiky**
- **Obsah souborů**: {{ jazyk }}
- **Datumy**: `YYYY-MM-DD` prefix
- **Sprint složky**: `sprint-NN_WYY-WZZ_YYYY-MM-DD/`

### Frontmatter (minimum)

```yaml
---
title: Název dokumentu
date: YYYY-MM-DD
---
```

### Co NEDĚLAT

- {{ Workspace-specific NO-NO 1 }}
- {{ Workspace-specific NO-NO 2 }}
- Diakritika v názvech souborů
- Editace `99-archive/` bez souhlasu
- Sdílení souborů `*-INTERNI-*` (ceny, marže, strategie) s klientem — nikdy, v žádné podobě

---

## Kde hledat pomoc

| Otázka | Kam |
|---|---|
| „Kde najdu...?" | [`AGENTS.md`](AGENTS.md) routing tabulka |
| „Jak se dělá...?" | `CONTEXT.md` ve správné složce, sekce „Proces" |
| „Kdo to rozhoduje?" | [`DEVELOPMENT-PROCESS.md`](DEVELOPMENT-PROCESS.md) |
| Cokoli jiného | {{ Primary contact }} |

---

## AI agenti v projektu

Workspace je nástrojově nezávislý — funguje v Claude Code, Cursoru i VS Code + Copilot:

1. Agent zná routing — kanonické instrukce v [`AGENTS.md`](AGENTS.md) a v `CONTEXT.md` každé složky
2. AI artefakty (commands, skills) žijí v [`.agents/`](.agents/README.md); soubory v `.claude/`, `.cursor/`, `.github/` jsou jen tenké wrappery
3. Pro update dokumentace použij slash command `/sync-docs`
4. Uživatelsky specifickou konfiguraci (cesty, účty) si vyplň do `agent.local.md` (zkopíruj z `agent.local.md.example`)
5. Když agent dává nesmyslné výstupy → pravděpodobně je nějaký `CONTEXT.md` zastaralý. Nahlásit {{ Primary contact }}.
