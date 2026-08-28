# E-mail

Čtyři typy, které Karel píše nejčastěji. Příklady v `examples/emails-and-messages.md`. Výstup vždy ve formátu skillu `send-email` (frontmatter `to`, `subject`, `signature`), aby šel rovnou otevřít v Outlooku.

## Společná pravidla

- Předmět je konkrétní a osobní, ne prodejní. Do 60 znaků.
- Oslovení na vlastním řádku, tělo začíná malým písmenem po čárce („Dobrý den,\n\njezdím k vám…").
- Odstavce na 1 až 3 věty. Celý e-mail se vejde na jednu obrazovku telefonu bez scrollování, pokud není nabídka.
- Jedna žádost nebo jeden další krok. Na konci vždy „stačí odepsat" nebo konkrétní den.
- Podpis do těla nepiš, přidá ho `send-email` podle pole `signature`. Tělo končí rozloučením a čárkou („Hezký den,").
- Žádné emoji (výjimka: warm kontakt, nejvýš jedno 🙂).
- Markdown jen minimálně: tučný odkaz na ukázku, případně jedna tučná cena. Žádné nadpisy, žádné odrážky u cold e-mailu.
- Odkaz na ukázku na samostatném řádku. Přihlašovací údaje k demu jen když jsou nutné, a pak na samostatném řádku v závorce.

## 1. Cold e-mail s prototypem (vztah A)

Účel: dostat majitele k proklikání ukázky a k souhlasu s osobní návštěvou. Neprodává.

Kostra (5 odstavců, 120 až 200 slov):

1. **Kdo jsem vůči vám.** Zákazník, a jak dlouho. Pochvala, když je upřímná („jsem se službou spokojený", „chodím rád").
2. **Co mě zdržuje.** Jedna konkrétní věc z pohledu zákazníka. „Většinou přesně vím, co chci, a stejně jsme na telefonu několik minut."
3. **Uznání toho, co mají, a nápad.** „Vím, že jste na Foodoře. Tam si to naklikám za půl minuty, ale zaplatím o čtvrtinu víc." Pak: „Tak mě napadlo, jak by to vypadalo, kdyby…" Jedna věta o tom, že takové věci dělám.
4. **Ukázka.** „Postavil jsem si to nanečisto na vaše menu." Odkaz na vlastním řádku. Co v ní uvidí, ve dvou větách z pohledu zákazníka a z pohledu provozu. Pak: „Je to ukázka, ne hotová věc. Ceny jsem tam dal podle vašeho webu, takže je možné, že něco nesedí."
5. **Další krok.** „Kdyby vám to přišlo užitečné, zastavím se u vás a projdeme, co by to znamenalo v reálném provozu. Stejně k vám jezdím. Stačí odepsat."

Předměty, které fungovaly: „Jezdím k vám s autem a něco jsem vám vyrobil", „Objednávka po telefonu, nebo pár kliknutí na vašem webu?", „Přemýšlím o vestavbě od vás a mezitím jsem vám něco postavil".

Nikdy: cena, výčet funkcí v odrážkách, „neváhejte", „nabídka spolejsou", strašení problémem na jejich webu (to patří na osobní schůzku), víc než jedna prosba.

## 2. Follow-up (vztah A nebo C)

Po pozitivní, ale nekonkrétní odpovědi („až se vrátím, zavolám") převezmi iniciativu, ale bez tlaku. Tři až čtyři věty.

> Dobrý den,
>
> děkuji za odpověď, užijte si volno.
>
> Koncem července se chystám na festival, po kterém mívám auto pěkně špinavé. Tak se pak kdyžtak stavím rovnou s autem, nebo se do té doby ještě sám připomenu.
>
> Hezké léto,

Po tichu (5 pracovních dní): jedna krátká zpráva s mírným důvodem, proč se ptát teď („pro první týden v červnu si potřebuju rezervovat čas, kdyby to bylo aktuální, dej vědět, ať to neblokuju zbytečně"). Ne „jen se připomínám".

## 3. E-mail s nabídkou (vztah C)

Nabídka je v příloze (PDF) nebo na odkazu. Tělo e-mailu je shrnutí na jednu obrazovku:

1. Dík za konkrétní věc (včerejší mytí, úterní schůzku).
2. „Jak jsem slíbil, posílám nabídku. Jsou v ní tři balíčky, ať si vyberete jen to, co potřebujete teď."
3. Ve zkratce ceny všech balíčků v jedné větě, pak doporučení a rozložení platby. Když je platba později možná, jedna věta.
4. Platnost a „nemusíte se rozhodovat hned".
5. Další krok s termínem: „Až si budu vyzvedávat auto, můžeme to probrat. Jinak vám zavolám za týden. A jestli chcete začít dřív, stačí odepsat ANO a číslo balíčku."

U warm klienta (tykání): cena v prvním odstavci, „není to hodinovka", tři vrstvy co dostane, tři věci, které potřebuju, termín prvního bloku. Jedna věta o pokračování, žádný pitch.

Nejkratší forma (po dobré schůzce s kamarádem):
> Ahoj Davide,
>
> ještě jednou dík za úterý, bavilo mě to.
>
> Zkus si tu složku, co jsem ti poslal. Otevři ji, hoď do ní pár svých věcí a uvidíš, jestli ti to něco udělá.
>
> A kdybys pak chtěl navázat nějakou spolupráci, připravil jsem ti cenovou nabídku: [odkaz]
>
> Neber to jako něco, na co musíš reagovat. Ať jen víš, že ta možnost existuje.
>
> Karel

## 4. Odpověď na oslovení (recruiter, obchodník, pozvánka)

Krátce, slušně, otočit na to, co Karla zajímá. Omluva za zpoždění jednou větou s důvodem, ne „omlouvám se za pozdní reakci" bez kontextu. Pak: co není aktuální (jedna věta), co zaujalo (jedna až dvě věty), návrh otočení („Klidně se sejdeme, ale spíš vám ukážu…"), otevřený konec („Dejte vědět, jestli by vás to zajímalo.").

## Formát výstupu

```markdown
---
type: sent-email
date: YYYY-MM-DD
to: Jméno <email> nebo [DOPLNIT]
subject: Předmět
from: Karel Šimek <karel.simek@datawizard.cz>
signature: datawizard
status: draft
---

# Název (do e-mailu se neposílá)

Dobrý den,

tělo…

Hezký den,
```

Pod blokem e-mailu, mimo něj, nejvýš tři body „před odesláním": doplnit odkaz, ověřit jméno, rozhodnout o odstavci X.

Kam uložit: `04-clients/nabidky/YYYY-MM-DD-klient/` u nabídek, jinak `<klient>/01-communications/02-messages/YYYY-MM-DD-popis/`. Když není jasné, zeptej se.
