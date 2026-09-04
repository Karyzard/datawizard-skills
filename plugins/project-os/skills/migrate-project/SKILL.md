---
name: migrate-project
description: Use when an existing project folder (OneDrive Hub 01_Projekty, OneDrive-Datawizard _clients, ~/dev/copy, an older workspace with AGENTS.md/TODO.md/IDEAS.md layout) has to become a standard project-<slug> repo, when the user says "přenes projekt do standardu", "založ repo z té složky", "migrate", "povýšit na šablonu". Not for greenfield projects (use new-project).
---

# migrate-project

Založí standardní repo a přenese do něj obsah starší složky podle mapovací tabulky. Legacy složka zůstává, jen se od cutoveru nepíše.

**REQUIRED SUB-SKILL:** `project-standard` včetně `references/founding.md` (mapovací tabulka a kázeň přenosu). Kostru zakládej postupem z `new-project`.

## Postup

1. **Inventura zdroje.** `find <legacy> -maxdepth 2` a přečti jeho README/AGENTS. Sestav tabulku „legacy složka → cíl" podle `founding.md`; nejasné položky (co je klientský výstup, co surový podklad) vypiš a rozhodni s uživatelem jednou zprávou.
2. **Kostra** podle `new-project` (kroky 1–3), bez vyplňování textů.
3. **Přenos** `rsync -a` po složkách podle tabulky. Fázové složky `10-…` přenes se zachovanými názvy. Staré `TASKS.md`, `TODO.md`, `IDEAS.md`, asistenty a `.cursor/`, `.agents/` do `99-archive/` (podsložka podle původu).
4. **PII a binárky** před prvním commitem: `find . -size +5M`, `grep -rl -i 'rodné číslo\|IČO\|heslo\|password'`; osobní údaje a velké soubory ven (assets vault) nebo vědomé rozhodnutí do decision logu. `git add` až potom.
5. **Odkazy:** `grep -rn 'sharepoint\|onedrive\|OneDrive' --include='*.md'` a přepiš na relativní cesty nebo označ jako assets vault.
6. **Seed textů:** README (úvod, cutover datum, stavová tabulka podle skutečně přeneseného obsahu, Odchylky od šablony), kickoff rekonstruovaný ze zápisů s označením „sestaven zpětně", ROADMAP z posledního známého stavu, journal řádek „obsah přenesen z …".
7. **Kontext:** profil klienta do `03-context/klient.md`; surové podklady do `03-context/<podslozka>/` s poznámkou v README, že to není destilát.
8. Init commit `init: projektové repo <název> ze šablony v<N>, obsah přenesen z <legacy>`.

## Co skill nedělá

- Nemaže ani nemění legacy složku (jen do README napíše, že je read-only od cutoveru).
- Nedestiluje kontext; surové podklady přenese a označí, destilaci dělá PO nebo samostatný úkol.
- Neslučuje duplicitní dokumenty potichu; duplicity vypíše do „Vyžaduje rozhodnutí".

## Kontrola před hlášením hotovo

- [ ] mapovací tabulka je v README sekci Odchylky nebo v `99-archive/README.md`
- [ ] žádný soubor > 5 MB bez rozhodnutí v decision logu
- [ ] žádný odkaz na lokální OneDrive cestu
- [ ] názvy fázových složek shodné s legacy
- [ ] `git status` čistý, jeden init commit
