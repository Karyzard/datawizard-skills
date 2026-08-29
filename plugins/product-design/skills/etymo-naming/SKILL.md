---
name: etymo-naming
description: Generate brand and product name candidates using etymological roots from Greek, Latin, Norse, Celtic, Polynesian, Inuit, and other source languages, plus historical figures and events. Use this skill whenever the user wants to name or rename a product, app, startup, brand, project, service, or company — even if they don't explicitly say "naming skill" or "etymological". Triggers include phrases like "I need a name for…", "help me rename…", "rebrand…", "come up with a name…", "the .com is taken, I need alternatives", or any time the user is brainstorming brand names. The skill produces 30+ candidates organized by source language, including derived neologisms (made-up words built from real roots), and ends with a domain-availability checklist.
---

# Etymo-Naming

A naming skill that generates brand candidates by mining etymological roots across cultures and languages, then derives neologisms from those roots when literal words are likely taken.

## When to use

Trigger this skill any time the user wants to name something — a product, app, startup, brand, service, project, company, or feature. Don't wait for an explicit "use the naming skill" — recognize the intent.

Common phrasings:
- "I need a name for my app/startup/product"
- "Help me rebrand X" / "X.com is taken, what else?"
- "Come up with a name that sounds like…"
- "I'm launching a [thing], need a name"

## Workflow

1. **Capture product intent** (1–3 short questions max, only if unclear). What does it do? What's the personality (analytical, playful, premium, mystical)? Any source languages or cultures the user wants to draw from or avoid?
2. **Generate 30+ candidates** organized by etymological source (see Source Banks below). Mix literal words and derived neologisms.
3. **Mark top 3** at the end with a brief justification.
4. **Append the availability checklist** (always — see Closing Section).

## The core insight

Most short, meaningful, pronounceable .com domains are taken or cost $50k+. The way modern brands solve this:

- **Asana, Notion, Stripe, Twilio, Spotify, Xero** — none are existing words. They're neologisms built from real roots.
- The trick: take an etymological root → modify it (drop letters, add a suffix, mash with another root) → you get a word that **sounds familiar but doesn't exist**, so the .com is free and the trademark is clean.

This skill therefore generates **both** literal etymological words AND derived neologisms.

## Source Banks

Use a mix from these. For each candidate, briefly note the etymology and why it fits the product.

### Greek & Latin
- **Greek**: Pythia (Delphic oracle), mantis/manteia (divination), kleros (lot), Tyche (luck), Hermes (messenger), Nike (victory), kosmos, logos, doxa
- **Latin**: monere (to advise), consilium (counsel), augur (seer), alea (dice/wager), sortes (lots/oracle), suasor (advisor), indicare (to point out), vox, nota, opus

### Norse & Celtic
- **Norse**: Mimir (wisdom), Saga (story), Bragi (poetry), runes, Heimdall (watcher), Ratatoskr (messenger squirrel), Yggdrasil
- **Celtic/Welsh/Irish**: Awen (inspiration flow), Brigid (craft/wisdom), Taliesin (bard), Ogham (script)

### Polynesian, Hawaiian, Maori
- **Hawaiian**: kilo (observer/seer who reads signs), kaha (mark/sign), mana'o (thought/opinion), ho'ike (to show/reveal), pono (rightness), hānai (to nurture)
- **Maori**: tohu (sign/omen), matakite (seer), whakaaro (thought), aroha (love/empathy), korero (to speak)
- **Samoan/Tongan/Tahitian**: tama (child/core), kawa (custom/protocol), vaka (canoe/vessel)

### Inuit & Indigenous American
- **Inuit/Inuktitut**: nuna (land/place), sila (air/wisdom/awareness), inuksuk (stone marker — literal trail "tip"), nanuk (polar bear), tikaani (variant for "wild dog/coyote")
- **Quechua**: wayra (wind/messenger), inti (sun), pacha (world/time)
- **Nahuatl**: tlilli (ink/knowledge), itzli (obsidian/clarity)

> ⚠️ **Cultural sensitivity**: Some terms from indigenous cultures carry sacred or restricted meanings (e.g., inuksuk is a national symbol of Nunavut). Flag these when suggesting them and recommend the user verify with a native speaker before commercial use.

### Historical figures & events
- Explorers (Marco Polo → Marco), cartographers (Mercator), guides (Baedeker, Sherpa), polymaths (Vitruvius → Vitru), oracles, scribes, ancient marketplaces (Agora, Forum, Bazaar)

### Sound symbolism (universal patterns)
- Open vowels (a, o) feel friendly and approachable
- Sharp consonants (k, t, x) feel tech and decisive
- "-io", "-ix", "-ly", "-a", "-ara", "-ora" suffixes feel modern app-like
- 2 syllables, 4–6 letters is the sweet spot for memorability

## Neologism construction patterns

When real words are likely taken, derive them. Examples of patterns:

| Pattern | Example |
|---|---|
| Root + vowel ending | *consilium* → **Consilo, Consilio** |
| Root + tech suffix (-ix, -io, -ari) | *mantis* → **Mantix, Mantio** |
| Root + friendly suffix (-a, -ara, -aya) | *alea* → **Aleya, Aleara** |
| Drop letters from existing word | *recommend* → **Reko** |
| Mash two roots | *kilo + saga* → **Kilosa, Sagilo** |
| Tip/keyword + foreign suffix | *tip* → **Tipio, Tipara, Tippi** |
| Phonetic respelling | *hint* → **Hinto, Hyntz** |

Aim for words that:
- Are 4–7 letters
- Have 2 syllables
- Are pronounceable in English by a non-native speaker
- Don't clash with existing big brands or have unfortunate meanings in major languages (the user should still verify)

## Output format

When generating, use this structure:

```
## Brief setup
One sentence on what the user described and what direction you're taking.

## Greek & Latin (X candidates)
**Name** — etymology · why it fits · neologism? Y/N

## Norse & Celtic (X candidates)
…

## Polynesian / Hawaiian / Maori (X candidates)
…

## Inuit & Indigenous (X candidates)
…

## Historical / Other (X candidates)
…

## Neologism specials (X candidates)
Cross-cutting derived words that don't fit one bank — mash-ups, phonetic plays.

## My top 3 picks
**1. Name** — one-line case
**2. Name** — one-line case
**3. Name** — one-line case

## Check availability
[See closing section below — always include this]
```

Aim for **30+ total candidates**. Don't pad with weak entries — but err on the side of more rather than fewer, since the user explicitly wants broad brainstorming.

## Closing section (always include)

End every response with this checklist, adapted to the actual names you generated:

```
## Check availability — recommended workflow

1. **Bulk domain check** — paste your favorites into one of these:
   - Namecheap Beast Mode: https://www.namecheap.com/domains/registration/results/?domain=
   - Instant Domain Search: https://instantdomainsearch.com/
   - Namechk (domain + social handles): https://namechk.com/

2. **Trademark check** (only for your final 2–3):
   - EU: TMview (https://www.tmdn.org/tmview/) — free
   - US: USPTO TESS (https://tmsearch.uspto.gov/) — free
   - Worldwide: WIPO Global Brand Database (https://branddb.wipo.int/) — free

3. **Backup strategy if .com is taken**:
   - Try alternative TLDs: .app, .io, .co
   - Add a prefix: get-, try-, use-, join- (e.g., getNAME.com)
   - Add a suffix: -hq, -app, -labs (e.g., NAMEhq.com)

4. **Final sanity checks** before committing:
   - Google the name + your category — any unfortunate collisions?
   - Say it out loud over the phone — can someone spell it without seeing it?
   - Check meanings in major languages (Google Translate is fine for a first pass)
   - Look for accidental meanings on Urban Dictionary
```

## Edge cases & guidance

- **If the user gives only a vague brief**, ask 1–3 short clarifying questions before generating. Don't ask more than 3.
- **If the user already has a name they like** (e.g., "Tipio") and wants variants, generate variants holding the core sound or root constant.
- **If the user pushes back that everything is taken**, double down on neologisms — generate 30 made-up words with high probability of free .com (less common roots, unusual letter combinations, mash-ups).
- **Match the user's language**. If they write in Czech, German, French, etc., respond in their language. The roots are universal but the explanation should be in their language.
- **Tone**: the user came here for brainstorming. Be generative and confident. Mark cultural sensitivity flags where relevant, but don't be preachy.
- **Don't promise domain availability**. Always say "likely free, verify" — never "this is available". Domain state changes by the second.

## Quick reference: pre-vetted neologism stems

These stems are productive (i.e. you can grow many names from them) and tend to feel fresh:

- **mant-** (mantix, mantio, mantara) — divination
- **sort-** (sortela, sortix, sortari) — lots/oracle
- **augur-** (augori, augora) — seer
- **alea-** (aleya, aleon, alear) — dice/wager
- **kilo-** (kilora, kiloa, kiloma) — observer
- **sila-** (silara, silaro, silax) — wisdom
- **mimir-** (mimira, mimiro) — wisdom
- **saga-** (sagora, sagari, sagix) — story
- **tohu-** (tohua, tohuri) — sign
- **rune-** (runix, runara) — script/oracle
- **tip-** (tipio, tipara, tippi, tipri) — preserves user's existing brand DNA
