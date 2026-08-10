---
title: {{ Workspace Name }} — přehled
date: YYYY-MM-DD
status: active
client: {{ Klient / — }}
company: datawizard
phase: {{ offer-preparation / realizace / ... }}
---

# {{ Workspace Name }}

## O čem to je

{{ 2–4 věty: co je tento workspace, pro koho, jaký artefakt produkuje. U klienta: kdo je klient, co dodáváme, jaký je model spolupráce. }}

## Aktuální stav ({{ YYYY-MM-DD }})

| Fáze | Stav |
|---|---|
| {{ První kontakt }} | {{ ✅ / 🔄 / 🔜 / — }} |
| {{ Nabídka }} | {{ }} |
| {{ Realizace }} | {{ }} |

**Další kroky:**

- [ ] {{ krok 1 }}
- [ ] {{ krok 2 }}

## Struktura složky

Každá top-level složka má `CONTEXT.md` jako rozcestník — detail hledej tam.

| Složka | Obsah |
|---|---|
| [`00-inbox/`](00-inbox/CONTEXT.md) | Staging neroztříděných materiálů |
| [`01-{{ ... }}/`](01-{{ ... }}/CONTEXT.md) | {{ popis }} |
| {{ atd. }} | ... |
| [`99-archive/`](99-archive/CONTEXT.md) | Read-only archiv |

## AI nástroje

Workspace je nástrojově nezávislý — funguje stejně v Claude Code, Cursoru i VS Code + Copilot. Kanonické instrukce pro agenty jsou v [`AGENTS.md`](AGENTS.md), systém AI artefaktů popisuje [`.agents/README.md`](.agents/README.md).

## Tým

| Osoba | Role | Komunikuje přes |
|---|---|---|
| {{ Jméno }} | {{ Role }} | {{ Kanál }} |

## Jak začít

1. Nový člověk v týmu → [`ONBOARDING.md`](ONBOARDING.md)
2. Nový engagement → vyplň [`00-kickoff.md`](00-kickoff.md) s klientem a nech agenta naseed-ovat workspace
3. Operativa → [`TODO.md`](TODO.md)
