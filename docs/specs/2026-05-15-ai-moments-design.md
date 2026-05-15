---
title: ai-moments plugin — design spec
date: 2026-05-15
status: draft
type: design-spec
---

# ai-moments — design spec

Plugin pro systematické zachytávání zajímavých momentů ze sessions s AI a jejich pozdější převod na obsah (zejména LinkedIn).

## Motivace

Karel při práci s AI naráží na momenty, ze kterých by se dalo učit nebo je publikovat (wow výstup, neobvyklý workflow, insight, hot take). Dnes je zachytává ad-hoc (např. `60-workshop-output/interakce/*.html` v `ai-date-workshop`). Cíl: **systematický sběr** ve standardní struktuře, aby z toho šel později destilovat LinkedIn obsah, prezentace, workshop materiály.

## Rozhodnutá architektura

### Plugin layout

```
plugins/ai-moments/
├── plugin.json
├── README.md
└── skills/
    ├── capture-moment/
    │   ├── SKILL.md
    │   └── templates/
    │       ├── learning.md
    │       ├── workflow-win.md
    │       ├── wow.md
    │       └── meta.md
    ├── browse-moments/
    │   └── SKILL.md
    ├── weekly-moments-review/
    │   └── SKILL.md
    └── to-linkedin-post/
        ├── SKILL.md
        └── linkedin-style.md   # prázdný placeholder v MVP
```

### Datový tok

```
[session s AI]
     ↓ ručně ("zachyť tohle") nebo AI proaktivně navrhne
[capture-moment] ──→ {project}/00-zurnal/ai-moments/YYYY-MM-DD-slug.md  (plný destilát)
     ↓                                  ↓ apenduje řádek
     │      ~/Documents/_BUSINESS/ai-moments/INDEX.md                   (centrální index)
     ↓
[browse-moments] / [weekly-moments-review] ──→ vybere kandidáta
     ↓
[to-linkedin-post] ──→ post-short.md + post-long.md + image-brief.md
     ↓
[content-tools:generate-images]                                          (existující skill)
```

### Klíčové principy

- **Source of truth = markdown.** Žádný JSON, žádná databáze. Index je append-only markdown tabulka, lidsky čitelná a gretovatelná.
- **Plný destilát žije v projektu**, centrální index jen pointuje. Kontext zůstává blízko práci.
- **Šablony se liší jen prostřední sekcí.** Frontmatter, kontext, insight a stopa jsou stejné napříč typy.
- **AI vyplňuje draft, Karel reviewuje.** Skill nikdy nepíše bez interakce.
- **Proaktivní detekce mimo skill** — samostatný rules-soubor v `~/.claude/rules/ai-moments.md`, ne hardcoded uvnitř skillu.

## Datový model

### Destilát momentu

Soubor: `{project_path}/00-zurnal/ai-moments/{YYYY-MM-DD}-{slug}.md`

```markdown
---
title: Zapomenutá selfie — workshop demo
date: 2026-05-14
type: wow                          # learning | workflow-win | wow | meta
project: 2026-05-ai-date-workshop
project_path: /Users/karelsimek/Documents/01_Projekty/2026-05-ai-date-workshop
status: captured                   # captured | reviewed | drafted | published | archived
linkedin_candidate: true
tags: [workshop, image-gen, prompt-engineering]
---

# {Krátký titulek}

## Kontext (1–2 věty)
…

## Co se stalo
…  (sekce závisí na šabloně)

## Insight / proč to stojí za zachycení
…

## Stopa
- Soubory, které vznikly: `…`
- Souvisí s: `[[jiný-moment]]` / `[[projekt]]`
```

### Šablony — prostřední sekce „Co se stalo"

| Šablona | Sekce |
|---|---|
| `learning` | Co jsem zkusil · Co fungovalo · Co selhalo · Pravidlo pro příště |
| `workflow-win` | Zadání · AI postup · Co to ušetřilo (čas/peníze/komplexita) · Reproducible recept |
| `wow` | Co jsem čekal · Co AI udělala · Příklad výstupu · Proč to bylo překvapivé |
| `meta` | Pozorování · Širší teze · Hot take draft · Pro koho by to bylo zajímavé |

### Centrální index

Soubor: `~/Documents/_BUSINESS/ai-moments/INDEX.md` (vytvoří se při prvním capture, pokud neexistuje).

```markdown
---
title: AI Moments — index
updated: 2026-05-15
---

# AI Moments

| Datum | Typ | Titulek | Projekt | LI? | Stav | Cesta |
|---|---|---|---|---|---|---|
| 2026-05-14 | wow | Zapomenutá selfie | ai-date-workshop | ✓ | captured | [→](…/2026-05-14-zachycena-selfie.md) |
```

Append-only. Updaty na frontmatter `updated:` při každé změně. Sloupec `Stav` se aktualizuje při `to-linkedin-post` (na `drafted`) a manuálně/přes `weekly-review` na `published`/`archived`.

## Skill: `capture-moment`

### Trigger
„zachyť tohle", „zachyť moment", „capture moment", „tohle stojí za zachycení", „uložit jako ai-moment", `/capture-moment`.

### Postup

1. **Detekce projektu.** Skill se podívá na `cwd`. Pokud spadá pod `_KLIENTI/*/`, `_APPS/*/`, `01_Projekty/*/`, použije to jako `project_path`. Jinak se zeptá.

2. **Volba typu.** Pokud Karel sám neřekl, single-select: learning / workflow-win / wow / meta. AI může navrhnout default na základě kontextu, ale rozhoduje Karel.

3. **Destilace z konverzace.** AI z aktuální session vytáhne:
   - klíčové prompty Karla (krátké citace)
   - co AI udělala (rozhodnutí, výstupy)
   - jaké soubory vznikly (`ls` projektu pro novější timestampy než N hodin)
   - 1 větu insight
   Vyplní šablonu **draftem**. Karel vidí a edituje.

4. **Slug + filename.** AI navrhne kebab-case slug (3–5 slov). Karel může změnit.
   Cesta: `{project_path}/00-zurnal/ai-moments/{YYYY-MM-DD}-{slug}.md`. Pokud složka neexistuje, vytvoří.

5. **Frontmatter rozhodnutí.**
   - `linkedin_candidate`: single-select ano / ne / možná, default `ne`.
   - `tags`: AI navrhne 2–4, Karel přijme nebo upraví.

6. **Zápis.**
   - Napíše destilát do projektu.
   - Apenduje řádek do `~/Documents/_BUSINESS/ai-moments/INDEX.md`. Pokud index neexistuje, vytvoří s hlavičkou.
   - Updatuje `updated:` v indexu frontmatteru.

7. **Confirmation.** Vrátí cestu k destilátu, cestu k indexu, jednu větu: *„Zachyceno jako {typ} v {project}. {N} momentů celkem v indexu."*

### Co skill NEDĚLÁ
- Negeneruje HTML rendering (jako `60-workshop-output/interakce/*.html`). Případně samostatný skill `moment-to-html` později.
- Negeneruje LinkedIn obsah (to je `to-linkedin-post`).
- Nemerguje duplicitní momenty.

### Proaktivní detekce (mimo skill)

Soubor `~/.claude/rules/ai-moments.md` (~15 řádků):

> Když si během session všimneš, že právě proběhl: (a) překvapivý výstup, který Karla viditelně potěšil/překvapil, (b) workflow, který Karel ocenil („pěkný", „skvělý", „tohle si zapamatuj"), (c) insight o tom jak AI použít — **navrhni jednou větou**: *„Tenhle moment by stál za zachycení do ai-moments. Mám?"* Nenavrhuj víc než 1× za 10 tahů. Nikdy nezachytávej bez explicitního souhlasu.

Z `~/.claude/CLAUDE.md` na to odkážeš jedním řádkem v sekci s rules.

## Skill: `browse-moments`

### Trigger
„ukaž ai-moments", „co mám v ai-moments", „najdi momenty s tagem X", „LinkedIn kandidáti", `/browse-moments`.

### Co dělá
- Přečte centrální `INDEX.md`.
- Filtruje podle argumentu: typ, projekt, tag, `linkedin_candidate`, stav, rozsah datumů.
- Vrátí markdown tabulku v chatu (max 20 řádků; jinak řekne kolik je celkem).
- Volitelně „otevři moment X" → přečte plný destilát a shrne ho.

### Co NEDĚLÁ
Needituje index, nepřejmenovává soubory, neuklízí.

## Skill: `weekly-moments-review`

### Trigger
`/weekly-moments-review`, „týdenní review momentů". Volitelně později spustit z `/weekly` v `datawizard-core`.

### Co dělá
- Najde momenty z posledních 7 dnů (filtr v `INDEX.md`).
- Pro každý se zeptá: ponechat / promote na `linkedin_candidate` / archivovat.
- Spočítá kolik kandidátů čeká na publikaci (`stav: captured`, `linkedin_candidate: true`).
- Návrh top 1–3 ke zpracování přes `to-linkedin-post`.
- Pokud žádné nové momenty: připomene *„nezachytil jsi nic 7 dnů — chceš si rozmyslet pár ze sessions?"*

### Output
Krátký markdown report v chatu. Nezapisuje samostatné soubory — mění jen frontmatter polí jednotlivých momentů (status, linkedin_candidate) podle Karlových rozhodnutí, a sloupec ve `INDEX.md`.

## Skill: `to-linkedin-post`

### Trigger
„udělej z tohohle LinkedIn post", „to-linkedin {moment-path}", `/to-linkedin-post`.

### Co dělá

1. Přečte zadaný moment (path/slug), nebo nabídne výběr z `linkedin_candidate: true`.
2. Přečte `skills/to-linkedin-post/linkedin-style.md` — voice/tone guide. V MVP je placeholder; skill řekne *„style guide chybí, použiju neutrální tón, doplň až budeš mít 3+ posty."*
3. Vygeneruje 2 varianty postu:
   - **krátká** (3–5 řádků, hook + insight + CTA)
   - **delší příběh** (~1500 znaků, struktura: hook → setup → wow moment → takeaway)
4. Vygeneruje **image brief** kompatibilní s `content-tools:generate-images` (stejná struktura jako `60-workshop-output/linkedin-images/brief.md`).
5. Uloží do `{project_path}/60-workshop-output/linkedin/{YYYY-MM-DD}-{slug}/`:
   - `post-short.md`
   - `post-long.md`
   - `image-brief.md`
6. Updatuje moment frontmatter: `status: drafted`. Synchronizuje sloupec ve `INDEX.md`.
7. Nabídne *„spustit `content-tools:generate-images` teď?"* — pokud ano, předá řízení.

### Co NEDĚLÁ
Nepostuje na LinkedIn. Negeneruje obrázky (deleguje na existující skill). Nemění obsah momentu — jen status.

### Voice guide (`linkedin-style.md`)

V MVP **prázdný placeholder** s instrukcí pro budoucí Karla:

```markdown
# LinkedIn style guide

Vyplň, až budeš mít 3+ vlastních postů na LinkedIn a uvidíš svůj reálný vzorec:
- Tone: …
- Délka preferovaná: …
- Hook patterns: …
- CTA preferovaná: …
- Co nedělat: …
```

YAGNI-honest: voice guide se píše z reálných vzorků, ne z hlavy.

## Pořadí implementace

Doporučení (Karel souhlasil s designem všech 4 skillů, ale stavět budeme postupně):

1. **Fáze 1** — `capture-moment` + 4 šablony + index init + rules soubor. Použít 2 týdny v reálu, nasbírat 5–10 momentů.
2. **Fáze 2** — `browse-moments`. Bez něj rostoucí index čte špatně.
3. **Fáze 3** — `to-linkedin-post`. Otestovat na nejlepším kandidátovi z Fáze 1, doplnit `linkedin-style.md`.
4. **Fáze 4** — `weekly-moments-review`. Až bude rituál „kapacita pro týdenní review" reálný.

Každá fáze je samostatný plán (writing-plans).

## Otevřené body / future

- **HTML render** momentu (jako `interakce/*.html`) — případný samostatný skill `moment-to-html`, ne v MVP.
- **Cross-link** mezi momenty (`[[…]]` syntaxe v Stopa sekci) — bez aktivního lint/discovery zatím; analogie k `wiki-tools` později možná.
- **Integration s talent-coaching** — momenty by mohly feedovat `talent-reflexe` (týdenní reflexe). Spíše manuálně přes browse, ne automatika.
- **Sanitizace pro klienty** — pokud moment vznikl v klientském projektu, před publikací je potřeba sanitizace. Není v MVP scope, ale frontmatter `client_sensitive: true` lze přidat preventivně.

## Vně scope

- Postování na LinkedIn (API integrace).
- Automatický scraping „co se stalo v session" bez explicitního Karlova souhlasu.
- Mergování / deduplikace momentů.
- Vlastní web UI pro browsing.
