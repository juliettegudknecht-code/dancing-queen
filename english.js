// Temporary English mode: swaps the site's own words (buttons, instructions, messages) to English.
// The Swedish you are practicing (cards, options, phrases, examples) stays Swedish.
(function () {
  'use strict';
  const MAP = {
    'Hem': 'Home', 'Kort': 'Cards', 'Quiz': 'Quiz', 'Verb': 'Verbs', 'Fraser': 'Phrases', 'Spel': 'Games',
    'Tio frågor': 'Ten questions', 'Korten': 'The cards', 'Ett verb': 'One verb',
    'Dagens ord': 'Word of the day', 'Din nivå': 'Your level', 'Repetition (B1)': 'Review (B1)', 'Lagom (B2)': 'Just right (B2)', 'Ett snäpp till (C1)': 'One notch up (C1)',
    'Här står du': 'Where you are', 'Ord som sitter, per planet (tre rätt i rad på ett kort):': 'Words that feel solid, by planet (three right answers in a row on a card):',
    'Inget quiz än. Tio frågor tar fem minuter.': 'No quiz yet. Ten questions takes five minutes.', 'Nollställ allt': 'Reset everything',
    'Vilken planet i dag?': 'Which planet today?', 'tryck för att vända': 'tap to flip', 'tryck för att vända, svep höger om du kunde, vänster om inte än': 'tap to flip, swipe right if you knew it, left if not yet',
    'Visa engelska först': 'Show English first', 'Visa svenska först': 'Show Swedish first',
    'Inte än': 'Not yet', 'Jag kunde': 'I knew it', 'Planeten är klar.': 'Planet finished.', 'Ett varv till': 'One more lap',
    'Tio frågor, en planet': 'Ten questions, one planet', 'Kör': 'Go', 'Sluta': 'Stop', 'Nästa': 'Next', 'Kolla': 'Check', 'Lyssna och välj.': 'Listen and choose.',
    'Skriv på svenska:': 'Write it in Swedish:', 'med en, ett eller att, om det passar': 'with en, ett or att, if it fits', 'Tio till': 'Ten more', 'Repetera korten': 'Review the cards',
    'Tio av tio. Glittra snurrar av glädje. Fem bonusstjärnor.': 'Ten out of ten. Glittra is spinning with joy. Five bonus stars.', 'Riktigt stabilt. En till så har du alla.': 'Really solid. One more and you will have them all.',
    'Bra jobbat. Missarna är de bästa lärarna.': 'Nice work. The misses are the best teachers.', 'Tung dag, än sen. Ta korten för den här planeten igen och kom tillbaka.': 'Rough day, so what. Redo the cards for this planet and come back.',
    'Böj det här': 'Conjugate this', 'Visa tabellen': 'Show the table', 'Dölj tabellen': 'Hide the table', 'Jag vet inte': 'I do not know', 'bara verbet': 'just the verb', 'med har': 'with har', 'med ska eller kommer att': 'with ska or kommer att',
    'Nästan, kolla å, ä och ö.': 'Almost, check å, ä and ö.', 'presens': 'present', 'preteritum': 'past', 'perfekt': 'perfect', 'futurum': 'future', 'infinitiv': 'infinitive',
    'Sånt du faktiskt säger': 'Things you actually say', 'Dölj engelskan': 'Hide English', 'Visa engelskan': 'Show English', 'Utmaning': 'Challenge mode', 'Lugnt läge': 'Easy mode', 'Blanda': 'Shuffle',
    'Ska vi spela?': 'Shall we play?', 'Klä Arianna': 'Dress Arianna', 'Skyltfönstret': 'The shop window', 'Catwalken': 'The catwalk', 'Igen': 'Again', 'Andra spel': 'Other games', 'Annat spel': 'Another game',
    'Arianna är redo för scenen!': 'Arianna is ready for the stage!', 'Vad har hon på sig?': 'What is she wearing?',
    'Tryck på något nedan för att ändra looken, eller börja om.': 'Tap anything below to change her look, or start again.',
    'Inga etiketter, det är det som är spelet.': 'No labels, that is the game.', 'Du kan gå på rea i Stockholm utan att blinka.': 'You can hit the Stockholm sales without blinking.', 'Svenska priser, nästan i hamn.': 'Swedish prices, nearly nailed.',
    'Sjuttio och sjutton låter lika i farten. En runda till?': 'Seventy and seventeen sound alike at speed. Another round?', 'Perfekt kongruens. Agnetha applåderar.': 'Perfect agreement. Agnetha approves.', 'Catwalken är din, nästan.': 'The catwalk is yours, almost.',
    'Adjektivet rättar sig efter substantivet: en, ett eller -a. En runda till?': 'The adjective follows the noun: en, ett or -a. One more round?',
    'Lyssna på instruktionen och välj rätt scenplagg. Inga etiketter, bara öronen.': 'Listen to the instruction and pick the right stage piece. No labels, just your ears.',
    'Svenska priser i ord och i örat. Kanelbullar, SL-kort och platåskor.': 'Swedish prices in words and out loud. Cinnamon buns, transit passes and platform shoes.',
    'Säg vad hon har på sig med rätt en, ett eller plural och rätt adjektivform.': 'Say what she is wearing with the right en, ett or plural and the right adjective ending.',
    'Bygg meningen': 'Build the sentence', 'Paren': 'The pairs', 'Sex till': 'Six more', 'En planet till': 'One more planet',
    'Orden är huller om buller. Tryck tillbaka dem till en riktig svensk mening.': 'The words are scrambled. Tap them back into a real Swedish sentence.',
    'Tolv kort med baksidan upp, sex svenska ord och deras engelska tvillingar. Vänd och para ihop.': 'Twelve cards face down, six Swedish words and their English twins. Flip and match.',
    'Tryck på orden i rätt ordning. Tryck på ett ord i meningen för att skicka tillbaka det.': 'Tap the words in order. Tap a word in the sentence to send it back.', 'Din mening...': 'Your sentence...',
    'Alla i rätt ordning. Nu följer orden dig.': 'All in the right order. The words follow you now.', 'Snyggt. Svenskan älskar verbet på andra plats.': 'Nice. Swedish loves the verb in second place.', 'Ordföljden är klurig. Tänk V2 i huvudsats och BIFF i bisats.': 'Word order is tricky. Think V2 in main clauses and BIFF in subordinate ones.',
    'Minne som en elefant. Eller en discokula.': 'Memory like an elephant. Or a disco ball.', 'Bra jobbat, allt är parat.': 'Nice work, everything is paired.', 'Hittat, och det är det som räknas.': 'Found, and that is what counts.',
    'Din väg': 'Your path', 'En planet i taget. Tre rätt på ett kort och ordet sitter.': 'One planet at a time. Three right answers on a card and the word sticks.', 'alla planeter': 'all planets', 'Börja': 'Start',
    'Radio': 'Radio', 'Spela': 'Play', 'Paus': 'Pause', 'ABBA väntar på kanal ett.': 'ABBA is waiting on station one.', 'Klistra in en YouTube-länk eller spellista': 'Paste any YouTube link or playlist',
    'Lyssna': 'Listen', 'Översätt': 'Translate', 'Översätter...': 'Translating...', 'Alla': 'All', 'everything': 'everything',
    'Snyggt!': 'Nice!', 'Bra jobbat!': 'Well done!', 'Toppen!': 'Top!', 'Kanon!': 'Brilliant!', 'Helt rätt!': 'Exactly right!', 'Grymt!': 'Awesome!', 'Strålande!': 'Splendid!', 'Precis!': 'Precisely!', 'Perfekt!': 'Perfect!', 'Där satt den!': 'Nailed it!', 'Dancing Queen!': 'Dancing Queen!', 'Så ska det låta!': 'That is the spirit!',
    'Ingen fara.': 'No worries.', 'Nästan!': 'Almost!', 'Vi testar igen.': 'Try again.', 'Den var klurig.': 'That one was tricky.', 'Nästa gång.': 'Next time.', 'Det kommer.': 'It will come.',
    'Tre i rad!': 'Three in a row!', 'Fem i rad!': 'Five in a row!',
    'Vad betyder': 'What does', 'Hur säger man': 'How do you say',
    'Daglig påminnelse': 'Daily reminder', 'Påminnelse: på': 'Reminder: on', 'Påminnelse: av': 'Reminder: off', 'En liten knuff i telefonen en gång om dagen. Välj tid, och stäng av när du vill.': 'A little nudge on your phone once a day. Pick the time, and turn it off whenever you like.',
    'Svenska för Arianna, med ABBA på radion.': 'Swedish for Arianna, with ABBA on the radio.',
    'Gjord med kärlek för Arianna, av Juliette. Framstegen sparas bara i den här webbläsaren.': 'Made with love for Arianna, by Juliette. Progress lives in this browser only.', 'Integritet': 'Privacy',
    'Du är redan bra på svenska, så Lagom ligger på B2 och är standard. Känns det för lätt tar du Ett snäpp till, och tunga dagar finns Repetition. Tryck på Arianna eller Glittra där uppe när du vill ha lite pepp. Radion i hörnet har ABBA på kanal ett. Under Spel klär du Arianna i scenkläder, gissar priser i kronor och böjer adjektiv. Markera vilken svenska som helst på sidan så dyker en Översätt-knapp upp.':
      'You are already good at Swedish, so Lagom sits at B2 and is the default. If it feels too easy take Ett snäpp till, and on heavy days there is Repetition. Tap Arianna or Glittra up top whenever you want a bit of encouragement. The radio in the corner has ABBA on station one. Under Spel you dress Arianna in stage clothes, guess prices in kronor and bend adjectives. Highlight any Swedish on the page and a Translate button pops up.'
  };
  // Dress-up instructions
  [['Sätt på henne den silvriga manteln.', 'Put the silver cape on her.'], ['Ge henne den rosa fjäderboan.', 'Give her the pink feather boa.'], ['Sätt på henne de stora solglasögonen.', 'Put the big sunglasses on her.'], ['Sätt på henne det glittriga pannbandet.', 'Put the sparkly headband on her.'], ['Ge henne de vita platåstövlarna.', 'Give her the white platform boots.'], ['Sätt på henne den lilla guldkronan.', 'Put the little gold crown on her.'], ['Ge henne mikrofonen.', 'Give her the microphone.'], ['Sätt på henne det stora guldhalsbandet.', 'Put the big gold necklace on her.']].forEach(([f, e]) => MAP[f] = e);
  const RULES = [
    [/^(God morgon|Hej|God kväll), Arianna\.$/, (m) => ({ 'God morgon': 'Good morning', Hej: 'Hi', 'God kväll': 'Good evening' }[m[1]] + ', Arianna.')],
    [/^I dag är det (.+)\.$/, m => 'Today is ' + m[1] + '.'],
    [/^Din himmel är tom än\..*$/, () => 'Your sky is still empty. Every right answer lights a star.'],
    [/^Du har (\d+) stjärn(?:a|or) på himlen\. (.*)$/, m => `You have ${m[1]} star${m[1] === '1' ? '' : 's'} in your sky. ` + ({ 'Det börjar glittra.': 'It is starting to sparkle.', 'Det ser ut som ett dansgolv.': 'It looks like a dance floor.', 'Glittra är imponerad.': 'Glittra is impressed.' }[m[2]] || m[2])],
    [/^Quiz gjorda: (\d+)\. Bästa resultat: (\d+) av 10\.$/, m => `Quizzes done: ${m[1]}. Best score: ${m[2]} out of 10.`],
    [/^Dagar här: (\d+)\..*$/, m => `Days spent here: ${m[1]}. No pressure, the stars never go out.`],
    [/^(.+): (\d+) av (\d+)$/, m => `${m[1]}: ${m[2]} of ${m[3]}`],
    [/^(\d+) av (\d+)$/, m => `${m[1]} out of ${m[2]}`],
    [/^(\d+) av (\d+)\.? Inga etiketter, det är det som är spelet\.$/, m => `${m[1]} of ${m[2]}. No labels, that is the game.`],
    [/^(.+?) (\d+) av (\d+) sitter\.$/, m => `${m[1]} ${m[2]} of ${m[3]} feel solid.`],
    [/^(\d+) meningar av (\d+)$/, m => `${m[1]} sentences out of ${m[2]}`],
    [/^(\d+) drag$/, m => `${m[1]} move${m[1] === '1' ? '' : 's'}`],
    [/^(\d+) dag(?:ar)?$/, m => `${m[1]} day${m[1] === '1' ? '' : 's'}`],
    [/^Svit på (\d+)! Ostoppbar\.$/, m => `Streak of ${m[1]}! Unstoppable.`],
    [/^Du har gått varvet runt (.+)\. Kom tillbaka i morgon eller välj en annan planet\.$/, m => `You went all the way around ${m[1]}. Come back tomorrow or pick another planet.`],
    [/^Vad kostar (.+)\? Lyssna och välj varan\.$/, m => `How much is ${m[1]}? Listen and pick the item.`],
    [/^Vad kostar (.+)\?$/, m => `What costs ${m[1]}?`],
    [/^Hon har på sig: (.+)\.$/, m => `She is wearing: ${m[1]}.`],
    [/^Planeten (.+)\. Hitta varje svenskt ord och dess engelska tvilling\.$/, m => `Planet ${m[1]}. Find each ${LANG === 'fi' ? 'Finnish' : 'Swedish'} word and its English twin.`],
    [/^\(att (.+), (presens|preteritum|perfekt|futurum)\)$/, m => `(att ${m[1]}, ${MAP[m[2]]})`],
    [/^\((.+), (preesens|imperfekti|perfekti|konditionaali)\)$/, m => `(${m[1]}, ${({ preesens: 'present', imperfekti: 'past', perfekti: 'perfect', konditionaali: 'conditional' })[m[2]]})`]
  ];
  const SKIP = '.tr-pop, #nowPlaying, .station small, .accents, .langbtn';
  const head = sv => sv.replace(/\s*\([^)]*\)\s*$/, '').trim();
  const DICT = {};
  (window.DQ_DECKS || []).forEach(d => d.items.forEach(it => { DICT[it[0]] = it[1]; DICT[head(it[0])] = it[1]; DICT[it[2]] = it[3]; head(it[0]).split(',').forEach(x => { DICT[x.trim()] = it[1]; }); }));
  (window.DQ_PHRASES || []).forEach(p => DICT[p[0]] = p[1]);
  (window.DQ_VERBS || []).forEach(v => { DICT[v.inf] = v.en; DICT['att ' + v.inf] = v.en; });
  (window.DQ_DECKS || []).forEach(d => { DICT[d.name] = d.en.charAt(0).toUpperCase() + d.en.slice(1); });
  let CACHE = {}; try { CACHE = JSON.parse(localStorage.getItem('dq_tr') || '{}'); } catch (e) {}
  const LANG = window.DQ_LANG || 'sv';
  const SVISH = /[åäöÅÄÖ]|\b(och|att|är|inte|jag|du|han|hon|vi|ni|de|det|den|en|ett|på|i|med|för|som|har|kan|ska|var|till|av|om|men|så|nu|här|där|från|efter|under|över|vid|utan|mellan|sedan|redan|också|bara|alla|mycket|kommer|blir|gör|säger|vill|måste|kanske|ja|nej|tack|hej|ja|on|ei|minä|sinä|hän|me|te|he|että|mutta|kun|jos|tämä|se|olen|olet|kanssa|myös|vain|nyt|sitten|kyllä|kiitos|hei)\b/i;
  async function online(t) {
    if (CACHE[t]) return CACHE[t];
    try {
      const r = await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=' + LANG + '&tl=en&dt=t&q=' + encodeURIComponent(t));
      if (r.ok) { const j = await r.json(); const out = (j[0] || []).map(x => x[0]).join(''); if (out) { CACHE[t] = out; try { localStorage.setItem('dq_tr', JSON.stringify(CACHE)); } catch (e) {} return out; } }
    } catch (e) {}
    return null;
  }
  let on = false;
  function tr(s) {
    const t = s.trim(); if (!t) return null;
    if (MAP[t]) return s.replace(t, MAP[t]);
    for (const [re, fn] of RULES) { const m = t.match(re); if (m) return s.replace(t, fn(m)); }
    const t2 = t.replace(/[.!?]+$/, '');
    if (DICT[t]) return s.replace(t, DICT[t]);
    if (DICT[t2]) return s.replace(t2, DICT[t2]);
    return null;
  }
  function apply(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n => {
      const p = n.parentElement; if (!p || p.closest(SKIP) || p.closest('script,style')) return;
      if (n.__fr != null) return;
      // in Finnish mode fi.js keeps the Swedish original on __sv, and the English map is keyed by Swedish
      const out = tr(n.__sv != null ? n.__sv : n.nodeValue);
      if (out != null) { n.__fr = n.nodeValue; n.nodeValue = out; }
      else if (n.nodeValue.trim().length > 1 && /[a-zA-ZåäöÅÄÖ]/.test(n.nodeValue) && SVISH.test(n.nodeValue)) {
        const orig = n.nodeValue; n.__fr = orig;
        online(orig.trim()).then(res => { if (on && res && n.__fr === orig) n.nodeValue = orig.replace(orig.trim(), res); });
      }
      else if (n.nodeValue.trim() === '?' && p.closest('.q') && /What does|How do you say/.test(p.closest('.q').textContent)) { n.__fr = n.nodeValue; n.nodeValue = /What does/.test(p.closest('.q').textContent) ? ' mean?' : '?'; }
    });
    root.querySelectorAll && root.querySelectorAll('[placeholder]').forEach(el => { const k = el.__svp != null ? el.__svp : el.placeholder; if (el.__fr == null && MAP[k]) { el.__fr = el.placeholder; el.placeholder = MAP[k]; } });
  }
  function restore(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n => { if (n.__fr != null) { n.nodeValue = n.__fr; n.__fr = null; } });
    root.querySelectorAll('[placeholder]').forEach(el => { if (el.__fr != null) { el.placeholder = el.__fr; el.__fr = null; } });
  }
  const obs = new MutationObserver(ms => { if (!on) return; ms.forEach(m => m.addedNodes.forEach(nd => { if (nd.nodeType === 1) apply(nd); else if (nd.nodeType === 3 && nd.parentElement) apply(nd.parentElement); })); });
  const btn = document.createElement('button'); btn.className = 'btn sm plain langbtn'; btn.textContent = 'In English, please';
  document.querySelector('.title').appendChild(btn);
  btn.onclick = () => {
    on = !on; document.body.classList.toggle('en-mode', on);
    if (on) { apply(document.body); obs.observe(document.body, { childList: true, subtree: true }); btn.textContent = 'Tillbaka till svenska'; }
    else { obs.disconnect(); restore(document.body); btn.textContent = 'In English, please'; }
  };
  // Finnish-only words the Swedish map does not know
  Object.assign(MAP, { 'preesens': 'present', 'imperfekti': 'past', 'perfekti': 'perfect', 'konditionaali': 'conditional', 'infinitiivi': 'infinitive', 'På svenska': 'På svenska', 'Suomeksi': 'Suomeksi' });
  if (LANG === 'fi') Object.keys(MAP).forEach(k => { MAP[k] = MAP[k].replace(/Swedish/g, 'Finnish').replace(/Stockholm sales/, 'Helsinki sales').replace(/prices in kronor/, 'prices in euros').replace(/en, ett or plural/, 'the right number and case').replace(/the right en, ett or att/, 'the base form').replace(/with en, ett or att, if it fits/, 'in the base form').replace(/Cinnamon buns, transit passes and platform shoes/, 'Cinnamon buns, transit cards and platform shoes').replace(/Adjectives agree[^.]*\./, 'The adjective follows the noun in number and case.').replace(/Swedish loves the verb in second place/, 'Known information first, new information last').replace(/Think V2 in main clauses and BIFF in subordinate ones/, 'Known information first, new information last'); });
})();
