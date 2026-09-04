---
title: Testování
date: 2026-08-25
---

# 60-testing

Volitelná složka. Zakládá se, když testování přeroste rámec jedné fáze.

## Účel

Testovací scénáře, výstupy a evidence chyb napříč fázemi.

## Co sem patří

- Testovací scénáře a checklisty použitelné opakovaně
- Výstupy testovacích kol a co z nich vypadlo
- Evidence prostředí (kde se testuje, na jakých datech)

## Co sem nepatří

- Uživatelské testování jedné fáze. To žije ve `05-user-testing/` dané fázové složky.
- Nalezené chyby jako práce. Ty se stávají delivery itemy nebo GitHub Issues.

## Workflow

Nález z testu není úkol. Úkolem se stává tak, že PO založí item ve `40-delivery/10-draft/` a odkáže na nález.
