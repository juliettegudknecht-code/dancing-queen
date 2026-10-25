(function () {
  'use strict';
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const DECKS = window.DQ_DECKS, VERBS = window.DQ_VERBS, GRAMMAR = window.DQ_GRAMMAR, PHRASES = window.DQ_PHRASES;
  const LANG = window.DQ_LANG || 'sv', FI = LANG === 'fi';
  const PRONOUNS = FI ? ['minä', 'sinä', 'hän', 'me', 'te', 'he'] : ['jag', 'du', 'hon', 'han', 'vi', 'ni', 'de'];
  const TENSES = FI ? { pres: 'preesens', imp: 'imperfekti', perf: 'perfekti', cond: 'konditionaali' } : { pres: 'presens', pret: 'preteritum', perf: 'perfekt', fut: 'futurum' };
  const INK = '#1c1240';

  // ---------- state ----------
  const KEY = FI ? 'dq_fi_v1' : 'dq_v1';
  let S = { stars: 0, boxes: {}, quiz: [], level: 2, station: 'abba', radioOpen: false, days: [] };
  try { Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  const today = new Date().toISOString().slice(0, 10);
  if (!S.days.includes(today)) { S.days.push(today); S.days = S.days.slice(-400); save(); }

  // ---------- helpers ----------
  const rnd = a => a[Math.floor(Math.random() * a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // Folds å, ä, ö, é to plain letters. Used only to spot a near miss, never to decide the right answer.
  const strip = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  const norm = s => String(s).toLowerCase().replace(/[’`]/g, "'").replace(/\s+/g, ' ').replace(/\s*([?!.,;:])\s*$/g, '').replace(/[.!?]+$/, '').trim();
  const headword = sv => sv.replace(/\s*\([^)]*\)\s*$/, '').trim();
  const bare = sv => headword(sv).split(',')[0].replace(/^(en |ett |att |det är )/i, '').trim();
  const seed = n => { let x = Math.sin(n * 9301 + 49297) * 233280; return x - Math.floor(x); };
  const allItems = () => DECKS.flatMap(d => d.items.map((it, i) => ({ deck: d, i, id: d.id + ':' + i, sv: it[0], en: it[1], exSv: it[2], exEn: it[3], lvl: it[4] })));
  const byLevel = items => { const f = items.filter(it => it.lvl <= S.level); return f.length >= 8 ? f : items; };
  const SPK = `<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="${INK}"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/></svg>`;
  const STAR = `<svg viewBox="0 0 100 100"><path d="M50 4 L60 40 L96 50 L60 60 L50 96 L40 60 L4 50 L40 40 Z" fill="#ffd166" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/></svg>`;
  // the little disco ball that rides along the quiz track
  const BALL = `<svg viewBox="0 0 40 40"><path d="M20 2 v6" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><circle cx="20" cy="22" r="15" fill="#e6e9f5" stroke="${INK}" stroke-width="3"/><path d="M5 22 h30 M8 14 h24 M8 30 h24 M20 7 v30 M12 9 v26 M28 9 v26" stroke="#b7bdd6" stroke-width="1.6"/><circle cx="14" cy="16" r="2" fill="#fff"/><circle cx="25" cy="27" r="1.6" fill="#fff"/><circle cx="24" cy="13" r="1.4" fill="#ff5fa8"/></svg>`;

  // ---------- speech ----------
  let voice = null;
  function pickVoice() {
    if (!window.speechSynthesis) return;
    const vs = speechSynthesis.getVoices().filter(v => (FI ? /^fi/i : /^sv/i).test(v.lang));
    voice = vs.find(v => (FI ? /Satu|Onni|Google suomi/i : /Alva|Klara|Oskar|Google svenska|Sofie/i).test(v.name)) || vs.find(v => (FI ? /fi-FI/i : /sv-SE/i).test(v.lang)) || vs[0] || null;
  }
  if (window.speechSynthesis) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  function speak(text) {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/\s*\([^)]*\)/g, ''));
    u.lang = FI ? 'fi-FI' : 'sv-SE'; u.rate = 0.92; if (voice) u.voice = voice;
    speechSynthesis.speak(u);
  }
  const canSpeak = () => !!window.speechSynthesis;

  // ---------- sky and stars ----------
  const sky = $('#sky');
  function renderSky() {
    const W = window.innerWidth, H = window.innerHeight;
    let out = '';
    for (let i = 0; i < 70; i++) {
      const x = seed(i) * W, y = seed(i + 1000) * H, r = 0.8 + seed(i + 2000) * 1.6;
      out += `<circle class="twinkle" cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(r * 1.6).toFixed(1)}" fill="${i % 3 ? '#fff' : '#ffd166'}" style="animation-delay:${(-seed(i + 3000) * 3).toFixed(1)}s"/>`;
    }
    const n = Math.min(S.stars, 300);
    for (let i = 0; i < n; i++) {
      const x = 20 + seed(i + 5000) * (W - 40), y = 20 + seed(i + 6000) * (H - 40), s = 5 + seed(i + 7000) * 7;
      const c = ['#ffd166', '#ff5fa8', '#fff', '#e6e9f5'][i % 4];
      out += `<path class="twinkle" transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${(s / 50).toFixed(3)})" d="M0 -50 L10 -10 L50 0 L10 10 L0 50 L-10 10 L-50 0 L-10 -10 Z" fill="${c}" stroke="${INK}" stroke-width="8" stroke-linejoin="round" style="animation-delay:${(-seed(i + 8000) * 3).toFixed(1)}s"/>`;
    }
    sky.innerHTML = out;
    $('#starCount').textContent = S.stars;
  }
  window.addEventListener('resize', renderSky);

  function award(fromEl, n) {
    n = n || 1;
    const badge = $('#starBadge').getBoundingClientRect();
    const from = fromEl ? fromEl.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    for (let k = 0; k < n; k++) {
      const el = document.createElement('div');
      el.className = 'fly'; el.innerHTML = window.DQ && window.DQ.flyIcon ? window.DQ.flyIcon() : STAR;
      el.style.left = (from.left + from.width / 2 - 13 + k * 10) + 'px'; el.style.top = (from.top + from.height / 2 - 13) + 'px';
      document.body.appendChild(el);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.style.left = (badge.left + 12) + 'px'; el.style.top = (badge.top + 6) + 'px'; el.style.transform = 'rotate(360deg) scale(.6)';
      }));
      setTimeout(() => el.remove(), 1000);
    }
    setTimeout(() => { S.stars += n; save(); renderSky(); renderHome(); }, 850);
  }

  // ---------- views ----------
  function show(view) {
    $$('section[id^=view-]').forEach(s => s.hidden = s.id !== 'view-' + view);
    $$('.tab').forEach(t => t.classList.toggle('on', t.dataset.view === view));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (view === 'home') renderHome();
    if (view === 'cards') renderDecks();
    if (view === 'quiz' && !quiz) quizSetup();
    if (view === 'verbs') verbNew();
    if (view === 'phrases') renderPhrases();
    if (view === 'games' && window.DQ.gamesMenu) window.DQ.gamesMenu();
  }
  $('#tabs').addEventListener('click', e => { const t = e.target.closest('.tab'); if (t) show(t.dataset.view); });
  document.addEventListener('click', e => { const g = e.target.closest('[data-go]'); if (g) show(g.dataset.go); });

  // ---------- characters ----------
  function talk(id, lines) {
    const b = $(id); const line = rnd(lines);
    b.textContent = line; b.classList.add('show'); speak(line);
    clearTimeout(b._t); b._t = setTimeout(() => b.classList.remove('show'), 2600);
  }
  $('#charC').addEventListener('click', () => talk('#bubbleC', window.DQ_GLITTRA_SAYS));
  $('#charJ').addEventListener('click', () => talk('#bubbleJ', window.DQ_ARIANNA_SAYS));

  // ---------- home ----------
  function renderHome() {
    const h = new Date().getHours();
    $('#greeting').textContent = (h < 10 ? 'God morgon' : h < 18 ? 'Hej' : 'God kväll') + ', Arianna.';
    const d = new Date();
    let dl = new Intl.DateTimeFormat(FI ? 'fi-FI' : 'sv-SE', { weekday: 'long', day: 'numeric', month: 'long' }).format(d);
    $('#dateLine').textContent = 'I dag är det ' + dl + '.';
    const s = S.stars;
    $('#starLine').textContent = s === 0 ? 'Din himmel är tom än. Varje rätt svar tänder en stjärna.'
      : `Du har ${s} stjärn${s === 1 ? 'a' : 'or'} på himlen. ${s < 20 ? 'Det börjar glittra.' : s < 100 ? 'Det ser ut som ett dansgolv.' : 'Glittra är imponerad.'}`;
    // word of the day
    const items = allItems().filter(it => it.lvl <= S.level);
    const dayN = Math.floor(Date.now() / 86400000);
    const w = items[dayN % items.length];
    $('#wodFr').textContent = w.sv; $('#wodEn').textContent = w.en;
    $('#wodEx').innerHTML = esc(w.exSv) + '<br><span class="en">' + esc(w.exEn) + '</span>';
    $('#wodSpeak').onclick = () => speak(headword(w.sv) + '. ' + w.exSv);
    $$('#levels .btn').forEach(b => b.classList.toggle('on', +b.dataset.lvl === S.level));
    // progress
    const solid = DECKS.map(d => { const n = d.items.filter((_, i) => (S.boxes[d.id + ':' + i] || 0) >= 3).length; return `${d.name}: ${n} av ${d.items.length}`; });
    const best = S.quiz.length ? Math.max(...S.quiz.map(q => q.score)) : null;
    $('#progressPanel').innerHTML = `<h2>Här står du</h2>
      <p>Ord som sitter, per planet (tre rätt i rad på ett kort):</p>
      <p>${solid.join('<br>')}</p>
      <p>${S.quiz.length ? `Quiz gjorda: ${S.quiz.length}. Bästa resultat: ${best} av 10.` : 'Inget quiz än. Tio frågor tar fem minuter.'}</p>
      <p class="small muted">Dagar här: ${S.days.length}. Ingen press, stjärnorna slocknar aldrig.</p>
      <button class="btn sm plain" id="resetBtn">Nollställ allt</button>`;
    $('#resetBtn').onclick = () => { if (confirm('Radera allt? Stjärnorna också.')) { S = { stars: 0, boxes: {}, quiz: [], level: 2, station: S.station, radioOpen: S.radioOpen, days: [today] }; save(); renderSky(); renderHome(); } };
  }
  $('#levels').addEventListener('click', e => { const b = e.target.closest('[data-lvl]'); if (!b) return; S.level = +b.dataset.lvl; save(); renderHome(); });

  // ---------- planets ----------
  function planetSVG(p, i) {
    return `<svg viewBox="0 0 100 100"><defs><radialGradient id="pg${i}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".5" stop-color="${p.body}" stop-opacity="0"/><stop offset="1" stop-color="${INK}" stop-opacity=".22"/></radialGradient></defs>
      <ellipse cx="50" cy="52" rx="46" ry="12" fill="none" stroke="${p.ring}" stroke-width="7" transform="rotate(-18 50 52)" opacity=".9"/>
      <circle cx="50" cy="50" r="30" fill="${p.body}" stroke="${INK}" stroke-width="3.5"/>
      <circle cx="${38 + (i % 3) * 6}" cy="42" r="6" fill="${p.spots}" opacity=".8"/><circle cx="60" cy="58" r="4" fill="${p.spots}" opacity=".8"/><circle cx="44" cy="62" r="2.5" fill="${p.spots}" opacity=".8"/>
      <circle cx="50" cy="50" r="30" fill="url(#pg${i})"/>
      <path d="M4 52 a46 12 0 0 0 92 0" fill="none" stroke="${p.ring}" stroke-width="7" transform="rotate(-18 50 52)" stroke-linecap="round"/></svg>`;
  }
  function planetsHTML(sel, withAll) {
    let h = DECKS.map((d, i) => `<button class="planet ${sel === d.id ? 'on' : ''}" data-deck="${d.id}">${planetSVG(d.planet, i)}${esc(d.name)}<span class="sub">${esc(d.en)}</span></button>`).join('');
    if (withAll) h += `<button class="planet ${sel === 'all' ? 'on' : ''}" data-deck="all"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" fill="#ffd166" stroke="${INK}" stroke-width="3.5"/><path d="M50 14 l5 15 15 5 -15 5 -5 15 -5 -15 -15 -5 15 -5z" fill="#fff" stroke="${INK}" stroke-width="2.5" transform="translate(0 16)"/></svg>Alla<span class="sub">everything</span></button>`;
    return h;
  }

  // ---------- flashcards ----------
  let deck = null, queue = [], cur = null, dir = 'sv';
  function renderDecks() { $('#deckPlanets').innerHTML = planetsHTML(deck && deck.id, false); if (!deck) $('#cardArea').innerHTML = ''; }
  $('#deckPlanets').addEventListener('click', e => { const b = e.target.closest('[data-deck]'); if (!b) return; startDeck(DECKS.find(d => d.id === b.dataset.deck)); });
  function startDeck(d) {
    deck = d; renderDecks();
    const items = byLevel(allItems().filter(it => it.deck.id === d.id));
    queue = shuffle(items).sort((a, b) => (S.boxes[a.id] || 0) - (S.boxes[b.id] || 0));
    nextCard();
  }
  function nextCard() {
    if (!queue.length) { $('#cardArea').innerHTML = `<div class="panel"><h2>Planeten är klar.</h2><p>Du har gått varvet runt ${esc(deck.name)}. Kom tillbaka i morgon eller välj en annan planet.</p><button class="btn pink" id="again">Ett varv till</button></div>`; $('#again').onclick = () => startDeck(deck); return; }
    cur = queue.shift();
    const solid = deck.items.filter((_, i) => (S.boxes[deck.id + ':' + i] || 0) >= 3).length;
    const front = dir === 'sv' ? cur.sv : cur.en, back = dir === 'sv' ? cur.en : cur.sv;
    $('#cardArea').innerHTML = `<div class="panel soft">
      <div class="row" style="justify-content:space-between;margin-bottom:12px">
        <span>${esc(deck.blurb)} ${solid} av ${deck.items.length} sitter.</span>
        <button class="btn sm plain" id="dirBtn">${dir === 'sv' ? 'Visa engelska först' : 'Visa svenska först'}</button>
      </div>
      <div class="scene"><div class="card" id="card">
        <div class="face front"><div class="word">${esc(front)}</div><div class="hint">tryck för att vända</div></div>
        <div class="face back"><div class="word">${esc(back)}</div><div class="ex">${esc(cur.exSv)}<br><span class="en">${esc(cur.exEn)}</span></div></div>
      </div></div>
      <div class="cardbtns">
        <button class="speak" id="cardSpeak" aria-label="Lyssna">${SPK}</button>
        <button class="btn bad" id="notYet">Inte än</button>
        <button class="btn good" id="knew">Jag kunde</button>
      </div></div>`;
    $('#card').onclick = () => $('#card').classList.toggle('flip');
    $('#cardSpeak').onclick = e => { e.stopPropagation(); speak(headword(cur.sv) + '. ' + cur.exSv); };
    $('#dirBtn').onclick = () => { dir = dir === 'sv' ? 'en' : 'sv'; queue.unshift(cur); nextCard(); };
    $('#knew').onclick = e => { S.boxes[cur.id] = Math.min(4, (S.boxes[cur.id] || 0) + 1); save(); award(e.target, 1); nextCard(); };
    $('#notYet').onclick = () => { S.boxes[cur.id] = 0; save(); queue.splice(Math.min(3, queue.length), 0, cur); nextCard(); };
  }

  // ---------- quiz ----------
  let quiz = null;
  function quizSetup(sel) {
    quiz = null;
    $('#quizArea').innerHTML = `<div class="panel"><h2>Tio frågor, en planet</h2>
      <div class="planets" id="quizPlanets">${planetsHTML(sel || 'all', true)}</div>
      <div class="row" style="justify-content:center;margin-top:10px"><button class="btn pink" id="startQuiz">Kör</button></div></div>`;
    let chosen = sel || 'all';
    $('#quizPlanets').addEventListener('click', e => { const b = e.target.closest('[data-deck]'); if (!b) return; chosen = b.dataset.deck; $$('#quizPlanets .planet').forEach(p => p.classList.toggle('on', p.dataset.deck === chosen)); });
    $('#startQuiz').onclick = () => startQuiz(chosen);
  }
  function startQuiz(deckId) {
    const pool = byLevel(allItems().filter(it => deckId === 'all' || it.deck.id === deckId));
    const gram = shuffle(GRAMMAR.filter(g => g.lvl <= S.level));
    let types = ['mcfe', 'mcef', 'type', 'listen', 'gram', 'mcfe', 'type', 'gram', 'mcef', 'gram'];
    if (!canSpeak()) types = types.map(t => t === 'listen' ? 'mcfe' : t);
    const items = shuffle(pool);
    const qs = shuffle(types).map((t, i) => {
      if (t === 'gram') { const g = gram[i % gram.length]; const opts = shuffle(g.o.map((o, k) => ({ o, ok: k === g.a }))); return { t, g, opts }; }
      const it = items[i % items.length];
      const others = shuffle(pool.filter(x => x.id !== it.id)).slice(0, 3);
      const opts = shuffle([it].concat(others).map(x => ({ o: t === 'mcfe' || t === 'listen' ? x.en : x.sv, ok: x.id === it.id })));
      return { t, it, opts };
    });
    quiz = { deckId, qs, i: 0, score: 0, results: [] };
    if (window.DQ && window.DQ.onQuizStart) window.DQ.onQuizStart();
    renderQ();
  }
  function renderQ() {
    const q = quiz.qs[quiz.i];
    let body = '';
    if (q.t === 'gram') body = `<div class="q"><span class="fr">${esc(q.g.s)}</span></div><div class="opts">${q.opts.map((o, k) => `<button class="opt" data-k="${k}">${esc(o.o)}</button>`).join('')}</div>`;
    else if (q.t === 'mcfe') body = `<div class="q">Vad betyder <span class="fr">${esc(q.it.sv)}</span>?</div><div class="opts">${q.opts.map((o, k) => `<button class="opt" data-k="${k}">${esc(o.o)}</button>`).join('')}</div>`;
    else if (q.t === 'mcef') body = `<div class="q">Hur säger man <span class="fr">${esc(q.it.en)}</span>?</div><div class="opts">${q.opts.map((o, k) => `<button class="opt" data-k="${k}">${esc(o.o)}</button>`).join('')}</div>`;
    else if (q.t === 'listen') body = `<div class="q row">Lyssna och välj. <button class="speak" id="qSpeak">${SPK}</button></div><div class="opts">${q.opts.map((o, k) => `<button class="opt" data-k="${k}">${esc(o.o)}</button>`).join('')}</div>`;
    else body = `<div class="q">Skriv på svenska: <span class="fr">${esc(q.it.en)}</span></div>
      <form id="typeForm"><input type="text" id="typeIn" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="med en, ett eller att, om det passar"><div class="accents" id="acc"></div>
      <div class="row" style="margin-top:12px"><button class="btn lilac" type="submit">Kolla</button></div></form>`;
    $('#quizArea').innerHTML = `<div class="panel">
      <div class="orbit"><div class="track"></div>${quiz.qs.map((_, k) => `<span class="dot ${quiz.results[k] === true ? 'done' : quiz.results[k] === false ? 'miss' : ''}" style="left:calc(14px + (100% - 28px) * ${k / 9})"></span>`).join('')}<div class="ship" style="left:calc(14px + (100% - 28px) * ${quiz.i / 9})">${BALL}</div></div>
      ${body}<div class="feedback" id="fb"></div><div class="row" style="margin-top:14px;justify-content:space-between"><button class="btn sm plain" id="quitQuiz">Sluta</button><button class="btn pink" id="nextQ" hidden>Nästa</button></div></div>`;
    $('#quitQuiz').onclick = () => quizSetup(quiz.deckId);
    $('#nextQ').onclick = () => { quiz.i++; quiz.i >= quiz.qs.length ? endQuiz() : renderQ(); };
    if (q.t === 'listen') { $('#qSpeak').onclick = () => speak(headword(q.it.sv)); setTimeout(() => speak(headword(q.it.sv)), 300); }
    $$('.opt').forEach(b => b.onclick = () => {
      const o = q.opts[+b.dataset.k];
      $$('.opt').forEach(x => { x.disabled = true; if (q.opts[+x.dataset.k].ok) x.classList.add('right'); });
      if (!o.ok) b.classList.add('wrong');
      finish(o.ok, b, q.t === 'gram' ? esc(q.g.x) : `${esc(q.it.sv)}: ${esc(q.it.en)}. ${esc(q.it.exSv)}`);
      if (q.t !== 'gram') speak(headword(q.it.sv));
    });
    if (q.t === 'type') {
      const inp = $('#typeIn'); accentRow($('#acc'), inp); inp.focus();
      $('#typeForm').onsubmit = e => {
        e.preventDefault(); const v = norm(inp.value); if (!v) return;
        const target = norm(headword(q.it.sv)), alts = headword(q.it.sv).split(',').map(x => norm(x));
        const exact = alts.includes(v) || v === target;
        const noAcc = alts.some(x => strip(x) === strip(v)) || strip(v) === strip(target);
        const noArt = alts.some(x => strip(norm(bare(x))) === strip(v)) || strip(v) === strip(norm(bare(q.it.sv)));
        const ok = exact || noAcc || noArt; inp.disabled = true;
        let msg = `${esc(headword(q.it.sv))}: ${esc(q.it.en)}.`;
        if (ok && !exact && noAcc) msg += ' Nästan perfekt, kolla å, ä och ö.';
        else if (ok && !exact && noArt) msg += ' Rätt svar. Tänk på en, ett eller att nästa gång.';
        finish(ok, inp, msg); speak(headword(q.it.sv));
      };
    }
    function finish(ok, el, note) {
      quiz.results[quiz.i] = ok; if (ok) { quiz.score++; award(el, 1); }
      if (window.DQ && window.DQ.onAnswer) window.DQ.onAnswer(ok, el);
      $('#fb').innerHTML = `<span class="cheer">${ok ? rnd(window.DQ_CHEERS) : rnd(window.DQ_SOFT)}</span><div class="note">${note}</div>`;
      $('#nextQ').hidden = false; $('#nextQ').focus();
    }
  }
  function endQuiz() {
    const sc = quiz.score; S.quiz.push({ d: today, score: sc }); S.quiz = S.quiz.slice(-200); save();
    const msg = sc === 10 ? 'Tio av tio. Glittra snurrar av glädje. Fem bonusstjärnor.' : sc >= 8 ? 'Riktigt stabilt. En till så har du alla.' : sc >= 5 ? 'Bra jobbat. Missarna är de bästa lärarna.' : 'Tung dag, än sen. Ta korten för den här planeten igen och kom tillbaka.';
    $('#quizArea').innerHTML = `<div class="panel pink"><h2>${sc} av 10</h2><p class="big">${msg}</p><div class="row"><button class="btn pink" id="againQ">Tio till</button><button class="btn plain" data-go="cards">Repetera korten</button></div></div>`;
    if (sc === 10) award($('#againQ'), 5);
    if (sc === 10 && window.DQ.confetti) window.DQ.confetti(140);
    $('#againQ').onclick = () => startQuiz(quiz.deckId);
  }

  function accentRow(el, inp) {
    el.innerHTML = (FI ? 'ä ö å Ä Ö Å' : 'å ä ö é Å Ä Ö').split(' ').map(c => `<button type="button">${c}</button>`).join('');
    el.onclick = e => { if (e.target.tagName !== 'BUTTON') return; const p = inp.selectionStart || inp.value.length; inp.value = inp.value.slice(0, p) + e.target.textContent + inp.value.slice(p); inp.focus(); inp.setSelectionRange(p + 1, p + 1); };
  }

  // ---------- verbs ----------
  // Swedish verbs do not change with the person, so one form per tense. The pronoun is only there for flavour.
  const GROUP_NOTE = {
    '1': 'Grupp 1: -ar, -ade, -at. Den största gruppen, nästan alla nya verb hamnar här.',
    '2a': 'Grupp 2a: -er, -de, -t. Stammen slutar på en tonande konsonant.',
    '2b': 'Grupp 2b: -er, -te, -t. Stammen slutar på en tonlös konsonant som k, p, s, t eller x.',
    '3': 'Grupp 3: korta verb som slutar på vokal: -r, -dde, -tt.',
    '4': 'Grupp 4: starkt eller oregelbundet verb. Vokalen byts, och formerna får man helt enkelt lära sig.',
    's': 'Deponens: verbet slutar på -s i alla former utan att vara passivt.'
  };
  // Finnish verbs change with the person, so the Finnish set carries six forms per tense.
  const TYPE_NOTE = {
    '1': 'Verbityyppi 1: vartalo + persoonapääte. Astevaihtelu heikkenee minä-, sinä-, me- ja te-muodoissa.',
    '2': 'Verbityyppi 2: infinitiivi päättyy -da tai -dä, hän-muodossa ei ole päätettä.',
    '3': 'Verbityyppi 3: infinitiivi päättyy -lla, -nna, -rra tai -sta, vartaloon tulee e.',
    '4': 'Verbityyppi 4: infinitiivi päättyy vokaali + ta tai tä, t katoaa ja vokaali jää.',
    '5': 'Verbityyppi 5: infinitiivi päättyy -ita tai -itä, vartaloon tulee -itse-.',
    '6': 'Verbityyppi 6: infinitiivi päättyy -eta tai -etä, vartaloon tulee -ene-.'
  };
  function conj(v, tense, p) {
    let answers, note;
    if (FI) {
      note = TYPE_NOTE[v.type] || '';
      if (tense === 'pres') answers = [v.pres[p]];
      else if (tense === 'imp') answers = [v.imp[p]];
      else if (tense === 'perf') { const olla = VERBS[0].pres[p]; answers = [olla + ' ' + (p < 3 ? v.part : v.part.slice(0, -2) + 'eet')]; note = 'Perfekti: olla-verbi taivutettuna + NUT-partisiippi, monikossa -neet. ' + note; }
      else answers = [v.cond[p]];
      return { answers, core: answers[0], note };
    }
    note = GROUP_NOTE[v.grp] || '';
    const alt = (v.alt && v.alt[tense]) || [];
    if (tense === 'pres') answers = [v.pres].concat(alt);
    else if (tense === 'pret') answers = [v.pret].concat(alt);
    else if (tense === 'perf') { answers = ['har ' + v.sup]; note = 'Perfekt bildas med har plus supinum. ' + note; }
    else { answers = ['ska ' + v.inf, 'kommer att ' + v.inf]; note = 'Futurum: ska eller kommer att plus infinitiv. Båda godkänns.'; }
    return { answers, core: answers[0], note };
  }
  let vq = null;
  function fillVerbSel() {
    const sel = $('#verbSel'); if (sel.options.length) return;
    VERBS.forEach((v, i) => { const o = document.createElement('option'); o.value = i; o.textContent = (FI ? '' : 'att ') + v.inf + ' (' + v.en + ')'; sel.appendChild(o); });
    const ts = $('#tenseSel'); ts.innerHTML = Object.keys(TENSES).map(k => `<option value="${k}">${TENSES[k]}</option>`).join('');
  }
  function verbNew() {
    fillVerbSel();
    const v = VERBS[+$('#verbSel').value || 0], tense = $('#tenseSel').value, p = Math.floor(Math.random() * PRONOUNS.length), pron = PRONOUNS[p];
    vq = { v, tense, pron, p, c: conj(v, tense, p) };
    vq.display = pron + ' ' + vq.c.core;
    const ph = tense === 'perf' ? 'med har' : tense === 'fut' || tense === 'cond' ? 'med ska eller kommer att' : 'bara verbet';
    $('#verbArea').innerHTML = `<div class="q"><span class="fr">${esc(pron)} ___</span> <span class="muted">(${FI ? '' : 'att '}${esc(v.inf)}, ${TENSES[tense]})</span></div>
      <form id="verbForm"><input type="text" id="verbIn" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${ph}"><div class="accents" id="vacc"></div>
      <div class="row" style="margin-top:12px"><button class="btn lilac" type="submit">Kolla</button><button class="btn sm plain" type="button" id="verbSkip">Jag vet inte</button></div></form><div class="feedback" id="vfb"></div>`;
    const inp = $('#verbIn'); accentRow($('#vacc'), inp); inp.focus();
    $('#verbForm').onsubmit = e => { e.preventDefault(); const val = norm(inp.value).replace(new RegExp('^' + pron + ' '), ''); if (!val) return; const ok = vq.c.answers.some(a => norm(a) === val), near = !ok && vq.c.answers.some(a => strip(norm(a)) === strip(val)); verbDone(ok || near, near, inp); };
    $('#verbSkip').onclick = () => verbDone(false, false, inp);
    renderVerbTable(false);
  }
  function verbDone(ok, near, inp) {
    inp.disabled = true;
    $('#vfb').innerHTML = `<span class="cheer">${ok ? rnd(window.DQ_CHEERS) : rnd(window.DQ_SOFT)}</span><div class="note"><span class="fr big">${esc(vq.display)}</span>${near ? '<br>Nästan, kolla å, ä och ö.' : ''}${vq.c.note ? '<br>' + esc(vq.c.note) : ''}</div><div class="row" style="margin-top:12px"><button class="speak" id="vSpeak">${SPK}</button><button class="btn pink" id="vNext">Nästa</button></div>`;
    $('#vSpeak').onclick = () => speak(vq.display); speak(vq.display);
    $('#vNext').onclick = verbNew; $('#vNext').focus();
    if (ok) award(inp, near ? 1 : 2);
  }
  let tableOpen = false;
  function renderVerbTable(toggle) {
    if (toggle) tableOpen = !tableOpen;
    $('#verbTable').textContent = tableOpen ? 'Dölj tabellen' : 'Visa tabellen';
    if (!tableOpen || !vq) { $('#verbTableArea').innerHTML = ''; return; }
    const rows = FI
      ? PRONOUNS.map((pr, p) => { const c = conj(vq.v, vq.tense, p); return `<tr><td>${esc(pr)}</td><td>${esc(c.core)}</td></tr>`; }).join('')
      : Object.keys(TENSES).map(t => { const c = conj(vq.v, t, 0); return `<tr><td>${TENSES[t]}</td><td>jag ${esc(c.core)}</td></tr>`; }).join('');
    $('#verbTableArea').innerHTML = `<table><tr><td>${FI ? 'infinitiivi' : 'infinitiv'}</td><td>${FI ? '' : 'att '}${esc(vq.v.inf)}</td></tr>${rows}</table>`;
  }
  $('#verbTable').onclick = () => renderVerbTable(true);
  $('#verbSel').onchange = verbNew; $('#tenseSel').onchange = verbNew;

  // ---------- phrases ----------
  let phraseOrder = PHRASES.map((_, i) => i), challenge = false;
  function renderPhrases() {
    const list = $('#phraseList');
    list.innerHTML = phraseOrder.filter(i => PHRASES[i][2] <= S.level || S.level === 3).map(i => { const p = PHRASES[i]; return `<div class="phrase ${challenge ? 'hidden' : ''}" data-i="${i}"><button class="speak" aria-label="Lyssna">${SPK}</button><div><div class="fr">${esc(p[0])}</div><div class="en">${esc(p[1])}</div></div></div>`; }).join('');
    list.onclick = e => { const row = e.target.closest('.phrase'); if (!row) return; const p = PHRASES[+row.dataset.i]; if (e.target.closest('.speak')) speak(p[0]); else if (row.classList.contains('hidden')) { row.classList.remove('hidden'); speak(p[0]); } };
  }
  $('#toggleEn').onclick = e => { const list = $('#phraseList'); list.classList.toggle('hide-en'); e.target.textContent = list.classList.contains('hide-en') ? 'Visa engelskan' : 'Dölj engelskan'; };
  $('#challengeMode').onclick = e => { challenge = !challenge; e.target.textContent = challenge ? 'Lugnt läge' : 'Utmaning'; if (challenge) $('#phraseList').classList.remove('hide-en'); renderPhrases(); };
  $('#shufflePhrases').onclick = () => { phraseOrder = shuffle(phraseOrder); renderPhrases(); };

  // ---------- radio ----------
  const radio = $('#radio'); let yt = null, ytReady = false, pendingPlay = false, custom = null;
  radio.classList.toggle('min', !S.radioOpen); $('#radioToggle').textContent = S.radioOpen ? '–' : '+';
  function renderStations() {
    $('#stations').innerHTML = window.DQ_STATIONS.map(s => `<button class="station ${S.station === s.id ? 'on' : ''}" data-st="${s.id}">${esc(s.name)}<small>${esc(s.note)}</small></button>`).join('');
  }
  renderStations();
  $('#radioToggle').onclick = () => { S.radioOpen = !S.radioOpen; save(); radio.classList.toggle('min', !S.radioOpen); $('#radioToggle').textContent = S.radioOpen ? '–' : '+'; };
  $('#stations').onclick = e => { const b = e.target.closest('[data-st]'); if (!b) return; S.station = b.dataset.st; custom = null; save(); renderStations(); play(); };
  $('#radioPlay').onclick = () => { if (yt && ytReady && radio.classList.contains('playing')) { const st = yt.getPlayerState(); st === 1 ? yt.pauseVideo() : yt.playVideo(); } else play(); };
  $('#customForm').onsubmit = e => {
    e.preventDefault(); const u = $('#customUrl').value.trim(); if (!u) return;
    const list = (u.match(/[?&]list=([\w-]+)/) || [])[1], vid = (u.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/) || [])[1];
    if (!list && !vid) { $('#nowPlaying').textContent = 'Det där ser inte ut som en YouTube-länk.'; return; }
    custom = list ? { list } : { videos: [vid] }; $$('.station').forEach(s => s.classList.remove('on')); play();
  };
  function play() {
    S.radioOpen = true; save(); radio.classList.remove('min'); radio.classList.add('playing'); $('#radioToggle').textContent = '–';
    if (!window.YT || !window.YT.Player) { pendingPlay = true; if (!document.getElementById('ytapi')) { const s = document.createElement('script'); s.id = 'ytapi'; s.src = 'https://www.youtube.com/iframe_api'; document.head.appendChild(s); } $('#nowPlaying').textContent = 'Laddar radion...'; return; }
    const src = custom || window.DQ_STATIONS.find(s => s.id === S.station) || window.DQ_STATIONS[0];
    if (!yt) {
      yt = new YT.Player('ytPlayer', { host: 'https://www.youtube-nocookie.com', width: '100%', height: '100%', playerVars: { rel: 0, modestbranding: 1, playsinline: 1 }, events: {
        onReady: () => { ytReady = true; load(src); },
        onStateChange: ev => { const d = yt.getVideoData && yt.getVideoData(); if (d && d.title) $('#nowPlaying').textContent = d.title; $('#radioPlay').textContent = ev.data === 1 ? 'Paus' : 'Spela'; },
        onError: () => { $('#nowPlaying').textContent = 'Den går inte att spela här, hoppar över.'; setTimeout(() => yt.nextVideo(), 800); }
      } });
    } else if (ytReady) load(src);
  }
  function load(src) { if (src.list) yt.loadPlaylist({ list: src.list, listType: 'playlist' }); else yt.loadPlaylist(src.videos); }
  window.onYouTubeIframeAPIReady = () => { if (pendingPlay) { pendingPlay = false; play(); } };

  // ---------- highlight to translate ----------
  const trBtn = document.createElement('button'); trBtn.className = 'tr-btn'; trBtn.textContent = 'Översätt'; trBtn.hidden = true; document.body.appendChild(trBtn);
  const trPop = document.createElement('div'); trPop.className = 'tr-pop'; trPop.hidden = true; document.body.appendChild(trPop);
  let selText = '', selRect = null;
  function updateSel() {
    const sel = window.getSelection(); const t = sel && sel.toString().trim();
    if (!t || t.length > 400 || sel.rangeCount === 0 || trPop.contains(sel.anchorNode)) { trBtn.hidden = true; return; }
    const r = sel.getRangeAt(0).getBoundingClientRect(); if (!r.width && !r.height) { trBtn.hidden = true; return; }
    selText = t; selRect = r; trPop.hidden = true;
    trBtn.hidden = false; trBtn.style.left = Math.max(8, Math.min(innerWidth - 110, r.left + r.width / 2 - 50)) + 'px'; trBtn.style.top = Math.max(8, r.top + scrollY - 44) + 'px';
  }
  document.addEventListener('selectionchange', () => { clearTimeout(window._selT); window._selT = setTimeout(updateSel, 250); });
  document.addEventListener('mousedown', e => { if (!trBtn.contains(e.target) && !trPop.contains(e.target)) { trPop.hidden = true; } });
  function localLookup(t) {
    const n = norm(t); const hits = allItems().filter(it => norm(headword(it.sv)) === n || norm(bare(it.sv)) === n || norm(it.exSv) === n);
    if (hits.length) return hits[0].exSv && norm(hits[0].exSv) === n ? hits[0].exEn : hits[0].en;
    const ph = PHRASES.find(p => norm(p[0]) === n); return ph ? ph[1] : null;
  }
  async function translate(t) {
    const local = localLookup(t); if (local) return local;
    try {
      const r = await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=' + LANG + '&tl=en&dt=t&q=' + encodeURIComponent(t));
      if (r.ok) { const j = await r.json(); const out = (j[0] || []).map(x => x[0]).join(''); if (out) return out; }
    } catch (e) {}
    try {
      const r = await fetch('https://api.mymemory.translated.net/get?langpair=' + LANG + '|en&q=' + encodeURIComponent(t));
      if (r.ok) { const j = await r.json(); if (j.responseData && j.responseData.translatedText) return j.responseData.translatedText; }
    } catch (e) {}
    return null;
  }
  trBtn.addEventListener('mousedown', e => e.preventDefault());
  trBtn.addEventListener('click', async () => {
    trBtn.hidden = true; const t = selText; if (!t) return;
    trPop.hidden = false; trPop.innerHTML = '<div class="tr-fr">' + esc(t) + '</div><div class="tr-en muted">Översätter...</div>';
    trPop.style.left = Math.max(8, Math.min(innerWidth - 300, selRect.left)) + 'px'; trPop.style.top = (selRect.bottom + scrollY + 8) + 'px';
    const out = await translate(t);
    trPop.innerHTML = '<div class="tr-fr">' + esc(t) + ' <button class="speak sm" aria-label="Lyssna">' + SPK + '</button></div><div class="tr-en">' + (out ? esc(out) : 'Ingen översättning kom tillbaka. Kolla uppkopplingen och försök igen.') + '</div>';
    trPop.querySelector('.speak').onclick = () => speak(t);
  });

  window.DQ = { $, $$, esc, rnd, shuffle, speak, award, norm, strip, SPK, INK, FI, allItems, byLevel, headword, level: () => S.level };
  // ---------- boot ----------
  renderSky(); renderHome();
})();
