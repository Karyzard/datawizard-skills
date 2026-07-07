---
title: Datawizard Skills
date: 2026-04-28
---

# Datawizard Skills

Monorepo s tematickými pluginy pro **Claude Code**, **Cursor** a další AI nástroje podporující formát `SKILL.md`.

Repo: [github.com/Karyzard/datawizard-skills](https://github.com/Karyzard/datawizard-skills)

## Pluginy

| Plugin | Účel |
|---|---|
| [datawizard-core](plugins/datawizard-core/) | Session workflow (`start`, `wrap`, `ship`) + globální pravidla |
| [content-tools](plugins/content-tools/) | Konverze dokumentů (email, PDF, přepisy schůzek) a generování obrázků |
| [client-delivery](plugins/client-delivery/) | Klientská práce — discovery, advisory persony |
| [product-design](plugins/product-design/) | Design Thinking pipeline, prototyping, UI/UX intelligence |
| [business-advice](plugins/business-advice/) | Konzultantské persony (Hormozi, Inizio) |
| [talent-coaching](plugins/talent-coaching/) | Kasimaka talent koučovací persony |
| [wiki-tools](plugins/wiki-tools/) | Markdown wiki — ingest, lint, query |
| [web-conversion](plugins/web-conversion/) | Konverze web prototypů do produkčních stacků, scaffolding z šablon |
| [web-motion](plugins/web-motion/) | Animovaná demo okna (terminál, IDE, blueprint, CRT) + hook-switcher pro hero copy |

## Instalace pro Claude Code

### 1. Přidej marketplace (jednorázově)

```
/plugin marketplace add Karyzard/datawizard-skills
```

> ⚠️ **Důležité:** repo musí být veřejné. Claude Code zatím nepodporuje autentizaci k privátním repos pro marketplace.

Po úspěchu uvidíš: `Successfully added marketplace: datawizard-skills`

### 2. Nainstaluj jednotlivé pluginy

```
/plugin install datawizard-core@datawizard-skills
/plugin install content-tools@datawizard-skills
/plugin install client-delivery@datawizard-skills
/plugin install product-design@datawizard-skills
/plugin install business-advice@datawizard-skills
/plugin install talent-coaching@datawizard-skills
/plugin install wiki-tools@datawizard-skills
/plugin install web-conversion@datawizard-skills
/plugin install web-motion@datawizard-skills
```

Nainstaluj jen ty, které potřebuješ.

### 3. Použití

Skills se pak buď **automaticky aktivují** podle popisu v dané situaci, nebo je můžeš zavolat jako slash command:

```
/start         # zahájí pracovní úsek
/wrap          # uzavře úsek a zapíše log
/ship          # commit + push
```

Skill list zobrazíš příkazem `/plugin`.

### Aktualizace

Když na repu vyjde nová verze:

```
/plugin marketplace update datawizard-skills
/plugin update <plugin-name>@datawizard-skills
```

### Odinstalace

```
/plugin uninstall <plugin-name>@datawizard-skills
/plugin marketplace remove datawizard-skills
```

## Instalace pro Cursor

Cursor zatím plugin systém nemá — používá `~/.cursor/skills/` jako složku. Skills sdílíš symlinkem:

```bash
# Pro celý plugin (např. talent-coaching)
ln -s /cesta/k/datawizard-skills/plugins/talent-coaching/skills ~/.cursor/skills/talent-coaching
```

Po naklonování repa nastav cestu podle vlastního umístění:

```bash
git clone https://github.com/Karyzard/datawizard-skills.git ~/dev/datawizard-skills
ln -s ~/dev/datawizard-skills/plugins/talent-coaching/skills ~/.cursor/skills/talent-coaching
```

## Pro vývoj a přispívání

### Konvence

- Každý plugin žije v `plugins/<name>/`
- Plugin manifest: `plugins/<name>/.claude-plugin/plugin.json`
- Skills: `plugins/<name>/skills/<skill-name>/SKILL.md`
- Marketplace manifest (root): `.claude-plugin/marketplace.json`
- Všechny `SKILL.md` mají YAML frontmatter s `name:` a `description:`

### Přidání nového skillu

1. Vyber plugin podle tématu (nebo založ nový)
2. Vytvoř složku `plugins/<plugin>/skills/<new-skill>/`
3. Napiš `SKILL.md` s frontmatter:
   ```yaml
   ---
   name: new-skill
   description: Stručně co skill dělá a kdy ho použít. Tento popis Claude používá pro auto-aktivaci.
   ---
   ```
4. Pokud přidáváš celý nový plugin, přidej ho do `.claude-plugin/marketplace.json`
5. Commit + push na main

### Vzorový plugin

Podívej se na [`plugins/datawizard-core/`](plugins/datawizard-core/) — nejjednodušší příklad se 3 skills a `rules/`.

### Vzorový komplexní plugin

[`plugins/product-design/`](plugins/product-design/) — 12 skills, většina s `references/` podadresářem pro hlubší dokumentaci.

## Troubleshooting

**`/plugin marketplace add` selhává s SSH chybou:**
Repo musí být **veřejné**. Privátní repos nejdou (Claude Code 2026).

**`Marketplace file not found`:**
Repo nemá `.claude-plugin/marketplace.json` v rootu. Zkontroluj že existuje.

**Plugin se nainstaluje ale skill nefunguje:**
Restartuj Claude Code session (`/clear` nestačí — opravdu zavři a otevři okno).

**Cursor nevidí skill:**
Cursor neumí pluginy — musíš použít symlink do `~/.cursor/skills/`.
