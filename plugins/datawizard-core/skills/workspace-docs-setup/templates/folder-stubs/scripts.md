---
title: scripts — kontext
date: {{today}}
status: active
---

# scripts/ — Pomocné skripty

> **Účel:** Bash, Python, Node skripty pro automatizaci a údržbu workspace.

## Údržba

Aktualizuj tento soubor když přibyde nový skript — uveď k čemu slouží a jak ho spustit.

## K čemu složka slouží

Automatizace, scaffolding, údržba. Ne aplikační kód (ten je v `src/` nebo v repu aplikace), ale **operativní skripty pro tento workspace**.

## Příklady

- `scaffold-X.sh` — založí novou položku (klient, sprint, atd.)
- `sync-Y.py` — synchronizace dat
- `report-Z.sh` — generování reportu

## Naming konvence

- `kebab-case.sh`, `kebab-case.py`
- Spustitelné scripty mají `chmod +x`
- V hlavičce komentář: co skript dělá + jak ho zavolat
