# LinkedIn

Platí pro post, text nad karuselem, komentář a odpověď na komentář. Příklady v `examples/linkedin-posts.md`.

## Post

### Dramaturgie

1. **Hook (1 až 2 věty).** Konkrétní moment nebo číslo z vlastního života. LinkedIn ukáže první dva řádky, zbytek je za „…více". Hook musí fungovat sám.
   - „Na festivalu mi jedna účetní poradila s fakturací. Vrátil jsem jí to aplikací."
   - „Jeden klik mě včera stál necelých 32 000 Kč."
   - „Posledních pár dní jsem moc nespal. Včera v noci jsem to konečně s týmem dotáhl."
2. **Příběh.** Kdo, kde, co se opravdu stalo. Dialog, detail, drobná absurdita. Čtenář má pocit, že tam byl.
3. **Zlom nebo pochybnost.** „Pak přišla realita open bety." „A teď to, co mi vrtá hlavou: nebyl to overkill?"
4. **Reflexe.** Jedna až dvě věty, vyplynou z příběhu. Ne sekce „co jsem se naučil", ne bullet pointy.
5. **Závěr.** Jedna otázka na čtenáře, nebo jedna výzva. Ne obojí, ne tři otázky.
6. **P.S.** (volitelně) Sebeironie, malá reklama, vedlejší pointa.
7. **Hashtagy.** Dva až tři. Mix obecného (#vibecoding) a tématu (#MSfotbal2026).

### Pravidla formy

- Délka 1 200 až 2 500 znaků. Kratší je v pořádku, když příběh nepotřebuje víc.
- Odstavce na 1 až 4 řádky, mezi nimi prázdný řádek. Ne každá věta na vlastním řádku.
- Žádný markdown (LinkedIn ho nezobrazí). Žádné tučné písmo, žádné odrážky s pomlčkou.
- Číslovaný postup nepatří do těla postu. Když ho příběh potřebuje, jde do karuselu a post ho jen ohlásí („V karuselu je celý postup i s nástroji.").
- Emoji nejvýš tři, každé s funkcí (tematická ikona, emocionální tečka 🫠 😅 😏, ukazatel 👇). Nikdy dvě vedle sebe, nikdy jako odrážky.
- Externí odkaz nepatří do těla (LinkedIn ho penalizuje). Napiš „Odkaz hodím do prvního komentáře. 👇" a pod text připrav komentář s odkazem.
- Tagovat jen lidi reálně spojené s příběhem (inspirace, tým, organizátor). Když nikdo takový není, netagovat.
- Jména klientů, částky a názvy akcí jen když je to výslovně povolené. Jinak „jedna účetní", „automyčka, kam jezdím".

### Humor

Chytrý, schovaný, čtenář se na moment zastaví. Techniky, které Karel používá:
- Absurdní kontrast: „A to jen proto, že jsem vytvořil zbytečnou aplikaci."
- Sebeironická gradace: „Hele, s Cursorem už trochu pracuju. Pak jsem viděl, co předváděli. Úplně jiná liga."
- Pointa v závorce na konci odstavce: „(Ano, čtyři dny.)"
- Uvozovky jako ironický komentář: náš „barista", „zbytečná" funkcionalita.

Nikdy: přímé vtipy, emoji bomby, „haha".

### Co k postu přiložit

Pod text postu dej krátký blok pro Karla (ne do postu):
- návrh prvního komentáře s odkazem, pokud je odkaz,
- koho tagovat a proč,
- co ověřit před publikací (souhlas jmenovaného, číslo, které není ze vstupu),
- 2 alternativní hooky, když si nejsi jistý tím hlavním.

Publikační checklist (pracovní den 8–10 h nebo 17–19 h, první hodinu odpovídat na komentáře) Karel zná, neopakuj ho v každém draftu.

## Text nad karuselem

Karusel je PDF nahrané jako dokument. Text nad ním nese příběh a otázku, karusel nese návod. Text nad karuselem: 800 až 1 500 znaků, stejná dramaturgie jako post, bez postupu (ten je uvnitř). Jedna výzva v textu (otázka na názor), jedna na posledním slidu (žádost o věc, např. „napište prompt a pošlu ho"). Nemíchat.

Slidy: jedna myšlenka na slide, nejvýš tři řádky textu, slidy s kroky ve stejné šabloně (číslo kroku, nástroj, dvě věty). Detail v Karlově `karusel-pruvodce.md` (mimo tento skill).

## Komentář a odpověď na komentář

Krátce, lidsky, s tykáním nebo vykáním podle toho, jak píše druhá strana. Poděkovat konkrétně („díky za ten paragraf, to zkusím"), ne „děkuji za komentář". Když někdo poradí, přiznat, že to Karla nenapadlo. Emoji nejvýš jedno.

## Kam uložit

`07-resources/linkedin/posty/YYYY-MM-DD_slug/draft.md` ve firemním workspace (`_DATAWIZARD`), s frontmatter:

```yaml
---
title: Krátký název
datum: YYYY-MM-DD
stav: draft
---
```

Pod finálním textem sekce `## Poznámky` (komentář s odkazem, tagy, co ověřit).
