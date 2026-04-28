# source-docs — zdrojové dokumenty pro backlog dashboard

Tato složka obsahuje zdrojové dokumenty, ze kterých AI vygeneruje `data.json` (backlog dashboard).

**Nahraj sem své dokumenty, pak v Cursor chatu napiš:**
```
Vygeneruj backlog dashboard z dokumentů v source-docs/
```

---

## Co sem patří a v jakém pořadí důležitosti

### Povinné (bez toho AI nemůže vygenerovat kvalitní backlog)

#### `vision.md` — Vize a cíl produktu
Co tento software řeší a proč. Odpověz na:
- Pro koho je produkt určen (role: admin, klient, trenér...)?
- Jaký problém řeší?
- Jak poznáme, že jsme uspěli? (KPI, metriky)
- Co je Must Have pro první launch?

---

#### `requirements.md` — Požadavky a scope
Seznam toho co produkt musí umět. Může být ve formě:
- Odrážkového seznamu features
- Tabulky požadavků (ID, popis, priorita)
- Textového popisu funkčností

Zahrň:
- Funkční požadavky (co systém dělá)
- Role a jejich oprávnění
- Co vědomě NEděláme (Won't scope)

---

### Doporučené (výrazně zlepší kvalitu backlogu)

#### `processes.md` — Procesy a user flows
Popis klíčových procesů krok za krokem:
- Název procesu
- Kdo ho spouští (role)
- Kroky 1 → 2 → 3
- Co se stane při chybě / výjimce

---

#### `IDEAS.md` — Nápady a rozšíření
Volný seznam nápadů nad rámec základního scope. AI je automaticky zařadí jako Should/Could backlog.

---

#### `wireframes.md` — Obrazovky a UI
ASCII náčrty nebo textový popis obrazovek. Pomáhá AI psát přesnější acceptance criteria. Obrázky sem nedávej — pouze text.

---

### Volitelné (pro milestones a sprinty)

#### `milestones.md` — Termíny a milníky

```markdown
- 2026-05-31: MVP launch — procesy omluvy, náhrady, docházka
- 2026-06-14: SOS modul — klient může požádat o pomoc
```

---

#### `team.md` — Tým a kapacita

```markdown
- Vývojář: 1 full-time
- Sprint délka: 2 týdny
- Odhadovaná kapacita: 20 SP / sprint
```

---

## Formát souborů

- **Markdown (.md)** — preferovaný formát
- **Prostý text (.txt)** — funguje
- Jazyk: česky nebo anglicky, mix nevadí

---

## Checklist před spuštěním AI

- [ ] Mám soubor s vizí / cílem produktu
- [ ] Mám seznam požadavků nebo features
- [ ] Vím co je Must Have pro launch
- [ ] Vím co NEděláme (aspoň přibližně)

---

## Příklad minimálního vstupu

Stačí jeden soubor `brief.md`:

```markdown
# Název projektu

## Co řešíme
[1-2 věty]

## Uživatelé / role
- Role 1: ...
- Role 2: ...

## Must Have pro launch
- ...

## Should / Could (po launchi)
- ...

## Won't (vědomě neděláme)
- ...

## Termíny
- Datum X: ...
```
