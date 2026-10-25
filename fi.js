// Finnish mode for the site's own words. The code still writes its buttons and messages in Swedish;
// in Finnish mode this layer swaps them to Finnish as they appear, the same way english.js does for English.
// It also adds the language toggle button under the title in both modes.
(function () {
  'use strict';
  const FI = window.DQ_LANG === 'fi';
  const title = document.querySelector('.title');
  if (title) {
    const btn = document.createElement('button'); btn.className = 'btn sm plain langbtn fibtn';
    btn.textContent = FI ? 'På svenska' : 'Suomeksi';
    btn.onclick = () => window.DQ_SET_LANG(FI ? 'sv' : 'fi');
    title.appendChild(btn);
  }
  if (!FI) return;

  const MAP = {
    'Hem': 'Koti', 'Kort': 'Kortit', 'Quiz': 'Visa', 'Verb': 'Verbit', 'Fraser': 'Fraasit', 'Spel': 'Pelit',
    'Tio frågor': 'Kymmenen kysymystä', 'Korten': 'Kortit', 'Ett verb': 'Yksi verbi',
    'Dagens ord': 'Päivän sana', 'Din nivå': 'Tasosi', 'Repetition (B1)': 'Kertaus (B1)', 'Lagom (B2)': 'Sopiva (B2)', 'Ett snäpp till (C1)': 'Pykälä ylös (C1)',
    'Här står du': 'Tässä olet nyt', 'Ord som sitter, per planet (tre rätt i rad på ett kort):': 'Sanat, jotka istuvat, planeetoittain (kolme oikein peräkkäin kortilla):',
    'Inget quiz än. Tio frågor tar fem minuter.': 'Ei vielä visaa. Kymmenen kysymystä vie viisi minuuttia.', 'Nollställ allt': 'Nollaa kaikki',
    'Vilken planet i dag?': 'Mikä planeetta tänään?', 'tryck för att vända': 'napauta kääntääksesi', 'tryck för att vända, svep höger om du kunde, vänster om inte än': 'napauta kääntääksesi, pyyhkäise oikealle jos osasit, vasemmalle jos et vielä',
    'Visa engelska först': 'Näytä englanti ensin', 'Visa svenska först': 'Näytä suomi ensin',
    'Inte än': 'En vielä', 'Jag kunde': 'Osasin', 'Planeten är klar.': 'Planeetta on valmis.', 'Ett varv till': 'Vielä yksi kierros',
    'Tio frågor, en planet': 'Kymmenen kysymystä, yksi planeetta', 'Kör': 'Aloita', 'Sluta': 'Lopeta', 'Nästa': 'Seuraava', 'Kolla': 'Tarkista', 'Lyssna och välj.': 'Kuuntele ja valitse.',
    'Skriv på svenska:': 'Kirjoita suomeksi:', 'med en, ett eller att, om det passar': 'perusmuodossa', 'Tio till': 'Kymmenen lisää', 'Repetera korten': 'Kertaa kortit',
    'Tio av tio. Glittra snurrar av glädje. Fem bonusstjärnor.': 'Kymmenen kymmenestä. Glittra pyörii ilosta. Viisi bonustähteä.', 'Riktigt stabilt. En till så har du alla.': 'Todella vakaata. Yksi lisää, niin sinulla on kaikki.',
    'Bra jobbat. Missarna är de bästa lärarna.': 'Hyvin tehty. Virheet ovat parhaat opettajat.', 'Tung dag, än sen. Ta korten för den här planeten igen och kom tillbaka.': 'Raskas päivä, entä sitten. Käy tämän planeetan kortit uudestaan ja tule takaisin.',
    'Böj det här': 'Taivuta tämä', 'Visa tabellen': 'Näytä taulukko', 'Dölj tabellen': 'Piilota taulukko', 'Jag vet inte': 'En tiedä', 'bara verbet': 'pelkkä verbi', 'med har': 'olla-verbin kanssa', 'med ska eller kommer att': 'konditionaalissa',
    'Nästan, kolla å, ä och ö.': 'Melkein, tarkista ä ja ö.', 'infinitiv': 'infinitiivi',
    'Sånt du faktiskt säger': 'Sellaista, mitä oikeasti sanot', 'Dölj engelskan': 'Piilota englanti', 'Visa engelskan': 'Näytä englanti', 'Utmaning': 'Haaste', 'Lugnt läge': 'Rauhallinen tila', 'Blanda': 'Sekoita',
    'Ska vi spela?': 'Pelataanko?', 'Klä Arianna': 'Pue Arianna', 'Skyltfönstret': 'Näyteikkuna', 'Catwalken': 'Catwalk', 'Igen': 'Uudestaan', 'Andra spel': 'Muut pelit', 'Annat spel': 'Toinen peli',
    'Arianna är redo för scenen!': 'Arianna on valmis lavalle!', 'Vad har hon på sig?': 'Mitä hänellä on päällään?',
    'Tryck på något nedan för att ändra looken, eller börja om.': 'Napauta jotain alla vaihtaaksesi tyyliä, tai aloita alusta.',
    'Inga etiketter, det är det som är spelet.': 'Ei nimilappuja, se on pelin idea.', 'Du kan gå på rea i Stockholm utan att blinka.': 'Voit mennä Helsingin aleihin silmää räpäyttämättä.', 'Svenska priser, nästan i hamn.': 'Suomalaiset hinnat, melkein hallussa.',
    'Sjuttio och sjutton låter lika i farten. En runda till?': 'Seitsemän ja seitsemäntoista menevät sekaisin vauhdissa. Vielä yksi kierros?', 'Perfekt kongruens. Agnetha applåderar.': 'Täydellinen kongruenssi. Agnetha taputtaa.', 'Catwalken är din, nästan.': 'Catwalk on sinun, melkein.',
    'Adjektivet rättar sig efter substantivet: en, ett eller -a. En runda till?': 'Adjektiivi taipuu substantiivin mukana: sama luku ja sija. Vielä yksi kierros?',
    'Lyssna på instruktionen och välj rätt scenplagg. Inga etiketter, bara öronen.': 'Kuuntele ohje ja valitse oikea esiintymisasuste. Ei nimilappuja, vain korvat.',
    'Svenska priser i ord och i örat. Kanelbullar, SL-kort och platåskor.': 'Suomalaiset hinnat sanoina ja korvaan. Korvapuusteja, HSL-kortteja ja korokekenkiä.',
    'Säg vad hon har på sig med rätt en, ett eller plural och rätt adjektivform.': 'Sano, mitä hänellä on päällään, oikeassa luvussa ja sijassa.',
    'Bygg meningen': 'Rakenna lause', 'Paren': 'Parit', 'Sex till': 'Kuusi lisää', 'En planet till': 'Vielä yksi planeetta',
    'Orden är huller om buller. Tryck tillbaka dem till en riktig svensk mening.': 'Sanat ovat sekaisin. Napauta ne takaisin oikeaksi suomenkieliseksi lauseeksi.',
    'Tolv kort med baksidan upp, sex svenska ord och deras engelska tvillingar. Vänd och para ihop.': 'Kaksitoista korttia nurin, kuusi suomen sanaa ja niiden englanninkieliset kaksoset. Käännä ja yhdistä.',
    'Tryck på orden i rätt ordning. Tryck på ett ord i meningen för att skicka tillbaka det.': 'Napauta sanoja oikeassa järjestyksessä. Napauta sanaa lauseessa lähettääksesi sen takaisin.', 'Din mening...': 'Lauseesi...',
    'Alla i rätt ordning. Nu följer orden dig.': 'Kaikki oikeassa järjestyksessä. Nyt sanat seuraavat sinua.', 'Snyggt. Svenskan älskar verbet på andra plats.': 'Hienoa. Suomen sanajärjestys on vapaa, mutta ei sattumanvarainen.', 'Ordföljden är klurig. Tänk V2 i huvudsats och BIFF i bisats.': 'Sanajärjestys on vaikea. Tuttu tieto ensin, uusi tieto lopuksi.',
    'Minne som en elefant. Eller en discokula.': 'Muisti kuin norsulla. Tai discopallolla.', 'Bra jobbat, allt är parat.': 'Hyvin tehty, kaikki parit löytyivät.', 'Hittat, och det är det som räknas.': 'Löytyi, ja se ratkaisee.',
    'Din väg': 'Polkusi', 'En planet i taget. Tre rätt på ett kort och ordet sitter.': 'Yksi planeetta kerrallaan. Kolme oikein kortilla, ja sana istuu.', 'alla planeter': 'kaikki planeetat', 'Börja': 'Aloita',
    'Radio': 'Radio', 'Spela': 'Soita', 'Paus': 'Tauko', 'ABBA väntar på kanal ett.': 'ABBA odottaa kanavalla yksi.', 'Klistra in en YouTube-länk eller spellista': 'Liitä YouTube-linkki tai soittolista',
    'Lyssna': 'Kuuntele', 'Översätt': 'Käännä', 'Översätter...': 'Käännetään...', 'Alla': 'Kaikki', 'everything': 'kaikki',
    'Tre i rad!': 'Kolme putkeen!', 'Fem i rad!': 'Viisi putkeen!',
    'Vad betyder': 'Mitä tarkoittaa', 'Hur säger man': 'Miten sanotaan',
    'Daglig påminnelse': 'Päivittäinen muistutus', 'Påminnelse: på': 'Muistutus: päällä', 'Påminnelse: av': 'Muistutus: pois', 'En liten knuff i telefonen en gång om dagen. Välj tid, och stäng av när du vill.': 'Pieni tönäisy puhelimeen kerran päivässä. Valitse aika, ja sammuta kun haluat.',
    'Svenska för Arianna, med ABBA på radion.': 'Suomea Ariannalle, ABBA radiossa.',
    'Gjord med kärlek för Arianna, av Juliette. Framstegen sparas bara i den här webbläsaren.': 'Tehty rakkaudella Ariannalle, Julietten toimesta. Edistyminen tallentuu vain tähän selaimeen.', 'Integritet': 'Tietosuoja',
    'Stjärnor du har samlat': 'Keräämäsi tähdet', 'Dagar i rad': 'Päiviä putkeen',
    'Du är redan bra på svenska, så Lagom ligger på B2 och är standard. Känns det för lätt tar du Ett snäpp till, och tunga dagar finns Repetition. Tryck på Arianna eller Glittra där uppe när du vill ha lite pepp. Radion i hörnet har ABBA på kanal ett. Under Spel klär du Arianna i scenkläder, gissar priser i kronor och böjer adjektiv. Markera vilken svenska som helst på sidan så dyker en Översätt-knapp upp.':
      'Sopiva on B2 ja se on oletus. Jos tuntuu liian helpolta, ota Pykälä ylös, ja raskaina päivinä on Kertaus. Napauta Ariannaa tai Glittraa ylhäällä, kun kaipaat vähän kannustusta. Nurkan radiossa on ABBA kanavalla yksi. Peleissä puet Ariannan esiintymisasuihin, arvaat hintoja euroissa ja taivutat adjektiiveja. Maalaa mikä tahansa suomenkielinen kohta sivulla, niin Käännä-nappi ilmestyy.'
  };
  const RULES = [
    [/^(God morgon|Hej|God kväll), Arianna\.$/, m => ({ 'God morgon': 'Hyvää huomenta', Hej: 'Hei', 'God kväll': 'Hyvää iltaa' }[m[1]] + ', Arianna.')],
    [/^I dag är det (.+)\.$/, m => 'Tänään on ' + m[1] + '.'],
    [/^Din himmel är tom än\..*$/, () => 'Taivaasi on vielä tyhjä. Jokainen oikea vastaus sytyttää tähden.'],
    [/^Du har (\d+) stjärn(?:a|or) på himlen\. (.*)$/, m => `Sinulla on ${m[1]} tähte${m[1] === '1' ? 'ä' : 'ä'} taivaalla. ` + ({ 'Det börjar glittra.': 'Alkaa kimaltaa.', 'Det ser ut som ett dansgolv.': 'Näyttää tanssilattialta.', 'Glittra är imponerad.': 'Glittra on vaikuttunut.' }[m[2]] || m[2])],
    [/^Quiz gjorda: (\d+)\. Bästa resultat: (\d+) av 10\.$/, m => `Visoja tehty: ${m[1]}. Paras tulos: ${m[2]} / 10.`],
    [/^Dagar här: (\d+)\..*$/, m => `Päiviä täällä: ${m[1]}. Ei paineita, tähdet eivät koskaan sammu.`],
    [/^(.+): (\d+) av (\d+)$/, m => `${m[1]}: ${m[2]} / ${m[3]}`],
    [/^(\d+) av (\d+)$/, m => `${m[1]} / ${m[2]}`],
    [/^(\d+) av (\d+)\.? Inga etiketter, det är det som är spelet\.$/, m => `${m[1]} / ${m[2]}. Ei nimilappuja, se on pelin idea.`],
    [/^(.+?) (\d+) av (\d+) sitter\.$/, m => `${m[1]} ${m[2]} / ${m[3]} istuu.`],
    [/^(\d+) meningar av (\d+)$/, m => `${m[1]} lausetta / ${m[2]}`],
    [/^(\d+) drag$/, m => `${m[1]} siirtoa`],
    [/^(\d+) dag(?:ar)?$/, m => `${m[1]} päivä${m[1] === '1' ? '' : 'ä'}`],
    [/^Svit på (\d+)! Ostoppbar\.$/, m => `${m[1]} putkeen! Pysäyttämätön.`],
    [/^Du har gått varvet runt (.+)\. Kom tillbaka i morgon eller välj en annan planet\.$/, m => `Kävit koko kierroksen: ${m[1]}. Tule takaisin huomenna tai valitse toinen planeetta.`],
    [/^Hon har på sig: (.+)\.$/, m => `Hänellä on päällään: ${m[1]}.`],
    [/^Det där är (.+) \((.+)\)\.$/, m => `Tuo on ${m[1]} (${m[2]}).`],
    [/^Planeten (.+)\. Hitta varje svenskt ord och dess engelska tvilling\.$/, m => `Planeetta ${m[1]}. Etsi jokainen suomen sana ja sen englanninkielinen kaksonen.`],
    [/^Rätt svar\. Tänk på en, ett eller att nästa gång\.$/, () => 'Oikea vastaus.'],
    [/^Nästan perfekt, kolla å, ä och ö\.$/, () => 'Melkein täydellistä, tarkista ä ja ö.'],
    [/^\((.+), (preesens|imperfekti|perfekti|konditionaali)\)$/, m => `(${m[1]}, ${m[2]})`]
  ];
  window.DQ_FI_MAP = MAP; window.DQ_FI_RULES = RULES;
  const SKIP = '.tr-pop, #nowPlaying, .station small, .accents, .langbtn';
  function tr(s) {
    const t = s.trim(); if (!t) return null;
    if (MAP[t]) return s.replace(t, MAP[t]);
    for (const [re, fn] of RULES) { const m = t.match(re); if (m) return s.replace(t, fn(m)); }
    return null;
  }
  function apply(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n => {
      const p = n.parentElement; if (!p || p.closest(SKIP) || p.closest('script,style') || n.__sv != null) return;
      const out = tr(n.nodeValue);
      if (out != null) { n.__sv = n.nodeValue; n.nodeValue = out; }
    });
    if (root.querySelectorAll) root.querySelectorAll('[placeholder],[title],[aria-label]').forEach(el => {
      if (el.__svp == null && MAP[el.placeholder]) { el.__svp = el.placeholder; el.placeholder = MAP[el.placeholder]; }
      if (MAP[el.title]) el.title = MAP[el.title];
      if (MAP[el.getAttribute('aria-label')]) el.setAttribute('aria-label', MAP[el.getAttribute('aria-label')]);
    });
  }
  apply(document.body);
  const np = document.getElementById('nowPlaying'); if (np && MAP[np.textContent.trim()]) np.textContent = MAP[np.textContent.trim()];
  new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(nd => { if (nd.nodeType === 1) apply(nd); else if (nd.nodeType === 3 && nd.parentElement) apply(nd.parentElement); }))).observe(document.body, { childList: true, subtree: true });
})();
