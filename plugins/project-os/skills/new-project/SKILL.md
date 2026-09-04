---
name: new-project
description: Use when founding a new Datawizard project repo (project-<slug>) from the standard template, for a client service or a core/internal service, when the user says "založ nový projekt", "nová projektová složka", "new project", "podle standardu", "ze šablony". Not for transferring an existing folder (use migrate-project).
---

# new-project

Založí `~/dev/projects/project-<slug>` z `../../template/` a naseeduje řídicí soubory. Výsledek je lokální git repo s jedním commitem; GitHub jen na výslovné zadání.

**REQUIRED SUB-SKILL:** nejdřív `project-standard` (aspoň SKILL.md a `references/founding.md`).

## Vstupy

Zjisti z požadavku, chybějící doptej jednou zprávou (ne po jedné):

| Vstup | Default, když neřečeno |
|---|---|
| slug (`project-<slug>`) | z názvu, kebab-case bez diakritiky |
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

## Co skill nedělá

- Nevymýšlí `project_id`; zůstává `"<doplnit>"`.
- Nezapisuje do `datawizard-crm` (neexistuje).
- Nepřenáší obsah ze starých složek; to je `migrate-project`.
- Nezakládá SharePoint assets vault; do `project.yaml` dá prázdný řetězec a komentář s legacy zdroji.

## Kontrola před hlášením hotovo

- [ ] `project.yaml`: slug, client, status, template_version odpovídají
- [ ] `README.md` má stavovou tabulku s dnešním datem a sekci Odchylky
- [ ] `JOURNAL.md` má řádek o založení s `(agent)`
- [ ] `DELIVERY.md` má sekci `## <PO> (PO)`
- [ ] žádné `<YYYY-MM-DD>` v řádcích `date:` (`grep -rn '^date: <' .`)
- [ ] `git log` ukazuje jeden commit, `git status` čistý
