---
name: new-project
description: Use when founding a new Datawizard project from the standard template — a git repo (project-<slug>) or a no-git OneDrive project folder in _DATAWIZARD/05-projects/ — for a client service or a core/internal service, when the user says "založ nový projekt", "nová projektová složka", "new project", "podle standardu", "ze šablony". Not for transferring an existing folder (use migrate-project).
---

# new-project

Založí projekt z `../../template/` a naseeduje řídicí soubory. Dva profily (viz `project-standard`):

- **git** (default): `~/dev/projects/project-<slug>`, výsledek je lokální git repo s jedním commitem; GitHub jen na výslovné zadání.
- **bez gitu**: složka v OneDrive `_DATAWIZARD/05-projects/<kategorie>/<nazev>` (název s datovým prefixem, např. `2026-09-nazev`), žádný git; `vcs: none` v manifestu.

**REQUIRED SUB-SKILL:** nejdřív `project-standard` (aspoň SKILL.md a `references/founding.md`).

## Vstupy

Zjisti z požadavku, chybějící doptej jednou zprávou (ne po jedné):

| Vstup | Default, když neřečeno |
|---|---|
| profil (git / bez gitu) | git; bez gitu když uživatel míří na OneDrive nebo řekne „bez repa" |
| slug (`project-<slug>`; bez gitu `YYYY-MM-nazev`) | z názvu, kebab-case bez diakritiky |
| název projektu | podle slugu |
| klient (slug jako v ostatních repech / CRM) | `datawizard` u core služby |
| PO | Karel |
| hub repo klienta existuje? | ověř `ls ~/dev/hubs/`, `gh repo list DatawizardCZ` |
| první fázové složky | žádné; stav do README |
| kódová repa k nalinkování | `gh repo list DatawizardCZ` podle jména klienta, jako kandidáti s komentářem „ověřit" |

Než cokoli vytvoříš: cílová složka nesmí existovat. Když existuje, zastav a řekni to.

## Postup

1. `rsync -a --exclude CHANGELOG.md template/ ~/dev/projects/project-<slug>/`. Verzi šablony přečti z `template/CHANGELOG.md` (první `## v<N>`).
2. `50-jmeno/` → `50-<po>/`; v jeho `CONTEXT.md` oprav `title:`, nadpis a smaž větu o přejmenování. `10-priklad-faze/` smaž, nebo přejmenuj na první fázi a v jejím `CONTEXT.md` nastav `title:`, nadpis a první odstavec na skutečnou fázi (věty „příkladová kostra, přejmenuj nebo smaž" pryč).
3. `04-client-hub/` zůstává jen u klienta bez hub repa. Hub repo existuje, nebo `client: datawizard` (core služba nemá klienta) → `rm -r 04-client-hub/`, v `AGENTS.md` řádek `04-client-hub/` přepiš na „v tomhle repu neexistuje" s důvodem (hub repo `<název>`, nebo interní služba), z matice rolí odstraň zmínky o deployi plochy.
4. Vyplň soubory podle `references/founding.md` v `project-standard`. Každý řádek `date:` ve frontmatteru v celém repu (placeholder i datum šablony, včetně `AGENTS.md` a všech `CONTEXT.md`) = dnešní `date +%Y-%m-%d`. Ostatní placeholdery uvnitř kostrových tabulek nech, jsou to vzorové řádky. Kandidáti kódových rep jdou do `project.yaml` jen jako komentář u `code_repos: []`; do seznamu až po ověření s PO.
5. `README.md` vždy obsahuje: úvod (kdo je klient, co se staví), „Kde začít", stavovou tabulku s datem, „Odchylky od šablony" (min. `project_id` chybí), odkaz na `AGENTS.md` pro strukturu, Maintenance.
6. `find . -type d -empty -exec touch {}/.gitkeep \;` → `git init` → `git add -A` → commit `init: projektové repo <název> ze šablony template-project v<N>`. Identita z git configu; když chybí, commituj s `-c user.name=<PO>` a řekni to v hlášení.
7. Vypiš strom (`find . -not -path './.git*' -type d`), zbylé `<doplnit>` v kickoffu a co má PO dodat.

GitHub jen když to uživatel řekl: `gh repo create DatawizardCZ/project-<slug> --private --source . --push`, pak `gh repo edit --add-topic client-<slug>`.

## Odchylky profilu bez gitu

1. Cíl je `_DATAWIZARD/05-projects/<kategorie>/<YYYY-MM-nazev>/` (kategorii `interni`/`apps` potvrď s uživatelem).
2. Krok 6 se nahrazuje: žádné `.gitkeep`, žádný `git init`, žádný commit. Založení = řádek do `JOURNAL.md` s `(agent)`.
3. `project.yaml`: `vcs: none`.
4. `AGENTS.md` přizpůsob profilu: sekci „Git workflow" nahraď větou „Projekt bez gitu (`vcs: none`): platí profil bez gitu ze standardu (skill `project-standard`), git pravidla se nepoužívají."; „ve stejném commitu" → „hned po změně"; „jeden commit přímo do main" a „přes PR" → „přesun + journal řádek" a „po výslovném souhlasu PO". Smaž `03-context/way-of-working/git-workflow.md`.
5. Odstavec o GitHubu neplatí.

## Co skill nedělá

- Nevymýšlí `project_id`; zůstává `"<doplnit>"`.
- Nezapisuje do `datawizard-crm` (neexistuje).
- Nepřenáší obsah ze starých složek; to je `migrate-project`.
- Nezakládá SharePoint assets vault; do `project.yaml` dá prázdný řetězec a komentář s legacy zdroji.

## Kontrola před hlášením hotovo

- [ ] `project.yaml`: slug, client, status, template_version, vcs odpovídají
- [ ] `README.md` má stavovou tabulku s dnešním datem a sekci Odchylky
- [ ] `JOURNAL.md` má řádek o založení s `(agent)`
- [ ] `DELIVERY.md` má sekci `## <PO> (PO)`
- [ ] žádné `<YYYY-MM-DD>` v řádcích `date:` (`grep -rn '^date: <' .`)
- [ ] git profil: `git log` ukazuje jeden commit, `git status` čistý; bez gitu: žádný `.git/` a journal má řádek o založení
