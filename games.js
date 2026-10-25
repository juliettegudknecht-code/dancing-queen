// ABBA games for Arianna. Loaded after app.js; uses window.DQ (helpers exposed by app.js).
(function () {
  'use strict';
  const L = window.DQ; if (!L) return;
  const { $, $$, esc, rnd, shuffle, speak, award, norm, strip, SPK, INK, FI } = L;
  const GOLD = '#ffd166', PINK = '#ff5fa8', SILVER = '#e6e9f5', SKIN = '#f6dcc8', HAIR = '#6b3a2a';
  const F = window.DQ_FI || {};

  // ---------- Arianna with stage outfit layers ----------
  const WEAR = FI ? F.WEAR : [
    { id: 'mantel', sv: 'den silvriga manteln', en: 'the silver cape', ask: 'Sätt på henne den silvriga manteln.' },
    { id: 'boa', sv: 'den rosa fjäderboan', en: 'the pink feather boa', ask: 'Ge henne den rosa fjäderboan.' },
    { id: 'glasogon', sv: 'de stora solglasögonen', en: 'the big sunglasses', ask: 'Sätt på henne de stora solglasögonen.' },
    { id: 'pannband', sv: 'det glittriga pannbandet', en: 'the sparkly headband', ask: 'Sätt på henne det glittriga pannbandet.' },
    { id: 'stovlar', sv: 'de vita platåstövlarna', en: 'the white platform boots', ask: 'Ge henne de vita platåstövlarna.' },
    { id: 'krona', sv: 'den lilla guldkronan', en: 'the little gold crown', ask: 'Sätt på henne den lilla guldkronan.' },
    { id: 'mikrofon', sv: 'mikrofonen', en: 'the microphone', ask: 'Ge henne mikrofonen.' },
    { id: 'halsband', sv: 'det stora guldhalsbandet', en: 'the big gold necklace', ask: 'Sätt på henne det stora guldhalsbandet.' }
  ];
  function icon(id) {
    const s = {
      mantel: `<path d="M50 14 L20 40 L14 88 L86 88 L80 40 Z" fill="${SILVER}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M50 14 v74" stroke="#b7bdd6" stroke-width="3"/><circle cx="50" cy="22" r="5" fill="${PINK}" stroke="${INK}" stroke-width="2.5"/>`,
      boa: `<path d="M12 50 C24 30 36 70 50 50 C64 30 76 70 88 50" fill="none" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M12 50 C24 30 36 70 50 50 C64 30 76 70 88 50" fill="none" stroke="${PINK}" stroke-width="16" stroke-linecap="round"/><path d="M20 44 l-4 -8 M34 60 l-2 9 M64 60 l4 9 M80 42 l5 -8" stroke="${PINK}" stroke-width="4" stroke-linecap="round"/>`,
      glasogon: `<circle cx="28" cy="52" r="20" fill="${INK}"/><circle cx="72" cy="52" r="20" fill="${INK}"/><path d="M48 52 h4" stroke="${INK}" stroke-width="5"/><path d="M18 44 h10 M62 44 h10" stroke="#fff" stroke-width="3" opacity=".7" stroke-linecap="round"/>`,
      pannband: `<path d="M10 60 C30 28 70 28 90 60" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M10 60 C30 28 70 28 90 60" fill="none" stroke="${PINK}" stroke-width="10" stroke-linecap="round"/><path d="M50 26 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4z" fill="${GOLD}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`,
      stovlar: `<path d="M24 14 H46 V70 C46 78 40 84 32 84 H14 C8 84 6 76 12 72 H24 Z" fill="#fff" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M54 14 H76 V70 C76 78 82 84 90 84 H94 C96 84 96 76 90 72 H76 Z" fill="#fff" stroke="${INK}" stroke-width="4" stroke-linejoin="round" transform="translate(-4 0)"/><path d="M8 76 h38 M50 76 h40" stroke="${INK}" stroke-width="3"/>`,
      krona: `<path d="M16 74 L16 36 L34 52 L50 24 L66 52 L84 36 L84 74 Z" fill="${GOLD}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><circle cx="50" cy="24" r="5" fill="${PINK}" stroke="${INK}" stroke-width="3"/><circle cx="16" cy="36" r="4" fill="#5fa8ff" stroke="${INK}" stroke-width="3"/><circle cx="84" cy="36" r="4" fill="#5fa8ff" stroke="${INK}" stroke-width="3"/>`,
      mikrofon: `<rect x="42" y="46" width="16" height="42" rx="6" fill="${SILVER}" stroke="${INK}" stroke-width="4"/><circle cx="50" cy="30" r="20" fill="${INK}"/><path d="M34 24 h32 M34 36 h32 M50 12 v36" stroke="#8a8fb0" stroke-width="2"/>`,
      halsband: `<path d="M12 28 C24 76 76 76 88 28" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M12 28 C24 76 76 76 88 28" fill="none" stroke="${GOLD}" stroke-width="6" stroke-linecap="round"/><circle cx="50" cy="66" r="10" fill="${GOLD}" stroke="${INK}" stroke-width="3"/><circle cx="50" cy="66" r="4" fill="${PINK}"/>`
    };
    return `<svg viewBox="0 0 100 100">${s[id]}</svg>`;
  }
  function ariannaSVG(on) {
    const v = id => on.has(id) ? '' : 'display:none';
    return `<svg viewBox="0 0 200 270" class="cosmo-big">
      <g style="${v('mantel')}"><path d="M60 150 L30 250 L170 250 L140 150 Z" fill="${SILVER}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M100 152 v98 M70 160 L54 246 M130 160 L146 246" stroke="#b7bdd6" stroke-width="2.5"/></g>
      <path d="M52 108 C36 150 38 200 52 232 C60 240 70 232 74 222 L126 222 C130 232 140 240 148 232 C162 200 164 150 148 108 Z" fill="${HAIR}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M70 188 C68 208 58 232 50 250 L94 250 C95 230 97 208 97 188 Z" fill="${GOLD}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M103 188 C103 208 105 230 106 250 L150 250 C142 232 132 208 130 188 Z" fill="${GOLD}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <g style="${on.has('stovlar') ? 'display:none' : ''}"><path d="M48 250 H94 V258 C94 264 88 268 80 268 H50 C44 268 42 262 46 256 Z" fill="${SILVER}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M106 250 H152 C156 256 154 268 148 268 H118 C110 268 106 264 106 258 Z" fill="${SILVER}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M48 259 h46 M106 259 h46" stroke="${INK}" stroke-width="3"/></g>
      <g style="${v('stovlar')}"><path d="M62 206 H94 V258 C94 264 88 268 80 268 H50 C44 268 42 262 46 256 L62 250 Z" fill="#fff" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M106 206 H138 V250 L154 256 C158 262 156 268 150 268 H120 C112 268 106 264 106 258 Z" fill="#fff" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M46 259 h48 M106 259 h48" stroke="${INK}" stroke-width="3"/></g>
      <path d="M64 158 C60 178 62 196 68 196 L132 196 C138 196 140 178 136 158 C126 150 74 150 64 158 Z" fill="${GOLD}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <g fill="#fff" opacity=".75"><circle cx="78" cy="172" r="2"/><circle cx="92" cy="166" r="2"/><circle cx="110" cy="170" r="2"/><circle cx="124" cy="176" r="2"/><circle cx="84" cy="186" r="2"/><circle cx="116" cy="188" r="2"/><circle cx="100" cy="180" r="2"/></g>
      <rect x="64" y="188" width="72" height="11" rx="4" fill="${PINK}" stroke="${INK}" stroke-width="3"/><circle cx="100" cy="193.5" r="5" fill="${GOLD}" stroke="${INK}" stroke-width="2.5"/>
      <path d="M66 164 C46 176 40 196 50 212 L62 208 C56 198 60 184 76 174 Z" fill="${GOLD}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><circle cx="58" cy="212" r="9" fill="${SKIN}" stroke="${INK}" stroke-width="4"/>
      <path d="M134 166 C152 160 164 150 168 132 L156 128 C152 142 144 150 130 156 Z" fill="${GOLD}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><circle cx="166" cy="122" r="9" fill="${SKIN}" stroke="${INK}" stroke-width="4"/>
      <g style="${v('mikrofon')}"><rect x="161" y="84" width="10" height="34" rx="4" fill="${SILVER}" stroke="${INK}" stroke-width="3"/><circle cx="166" cy="76" r="13" fill="${INK}"/><path d="M156 72 h20 M156 80 h20 M166 64 v24" stroke="#8a8fb0" stroke-width="1.5"/></g>
      <path d="M70 150 L100 174 L130 150 L138 162 L100 188 L62 162 Z" fill="${SILVER}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <g style="${v('halsband')}"><path d="M70 152 C80 178 120 178 130 152" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M70 152 C80 178 120 178 130 152" fill="none" stroke="${GOLD}" stroke-width="4" stroke-linecap="round"/><circle cx="100" cy="172" r="7" fill="${GOLD}" stroke="${INK}" stroke-width="2.5"/><circle cx="100" cy="172" r="2.5" fill="${PINK}"/></g>
      <g style="${v('boa')}"><path d="M56 156 C72 142 86 170 100 156 C114 142 128 170 144 156" fill="none" stroke="${INK}" stroke-width="20" stroke-linecap="round"/><path d="M56 156 C72 142 86 170 100 156 C114 142 128 170 144 156" fill="none" stroke="${PINK}" stroke-width="14" stroke-linecap="round"/><path d="M60 150 l-4 -8 M84 166 l-2 8 M116 166 l2 8 M140 150 l4 -8" stroke="${PINK}" stroke-width="4" stroke-linecap="round"/></g>
      <rect x="90" y="140" width="20" height="14" fill="${SKIN}" stroke="${INK}" stroke-width="3"/>
      <circle cx="100" cy="104" r="46" fill="${SKIN}" stroke="${INK}" stroke-width="4"/>
      <path d="M56 100 C56 70 74 52 100 52 C126 52 144 70 144 100 C138 84 128 76 112 80 C106 72 94 72 88 80 C72 76 62 86 56 100 Z" fill="${HAIR}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M58 104 C48 134 50 168 58 200" fill="none" stroke="${HAIR}" stroke-width="12" stroke-linecap="round"/><path d="M142 104 C152 134 150 168 142 200" fill="none" stroke="${HAIR}" stroke-width="12" stroke-linecap="round"/>
      <g style="${v('pannband')}"><path d="M56 80 C70 62 130 62 144 80" fill="none" stroke="${INK}" stroke-width="11" stroke-linecap="round"/><path d="M56 80 C70 62 130 62 144 80" fill="none" stroke="${PINK}" stroke-width="7" stroke-linecap="round"/><path d="M100 58 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" fill="${GOLD}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/></g>
      <circle cx="57" cy="128" r="7" fill="none" stroke="${INK}" stroke-width="5"/><circle cx="57" cy="128" r="7" fill="none" stroke="${GOLD}" stroke-width="2.5"/><circle cx="143" cy="128" r="7" fill="none" stroke="${INK}" stroke-width="5"/><circle cx="143" cy="128" r="7" fill="none" stroke="${GOLD}" stroke-width="2.5"/>
      <path d="M72 97 C78 90 90 90 94 97 M106 97 C110 90 122 90 128 97" fill="none" stroke="#ffe9a8" stroke-width="6" stroke-linecap="round" opacity=".95"/>
      <ellipse cx="83" cy="105" rx="9.5" ry="10.5" fill="#fff" stroke="${INK}" stroke-width="3"/><ellipse cx="117" cy="105" rx="9.5" ry="10.5" fill="#fff" stroke="${INK}" stroke-width="3"/>
      <circle cx="84" cy="106" r="6" fill="#7a4a2a"/><circle cx="118" cy="106" r="6" fill="#7a4a2a"/><circle cx="84" cy="106" r="3" fill="${INK}"/><circle cx="118" cy="106" r="3" fill="${INK}"/><circle cx="86.5" cy="103" r="1.8" fill="#fff"/><circle cx="120.5" cy="103" r="1.8" fill="#fff"/>
      <path d="M72 86 C78 82 88 82 94 85 M106 85 C112 82 122 82 128 86" fill="none" stroke="#4a2a1e" stroke-width="3" stroke-linecap="round"/>
      <g style="${v('glasogon')}"><circle cx="82" cy="104" r="17" fill="${INK}"/><circle cx="118" cy="104" r="17" fill="${INK}"/><path d="M99 104 h2" stroke="${INK}" stroke-width="4"/><path d="M72 98 h10 M108 98 h10" stroke="#fff" stroke-width="2.5" opacity=".7" stroke-linecap="round"/></g>
      <ellipse cx="70" cy="118" rx="7" ry="4" fill="#ffb6c6"/><ellipse cx="130" cy="118" rx="7" ry="4" fill="#ffb6c6"/>
      <path d="M100 110 c-2 6 -1 10 3 10" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="M90 128 C96 134 106 134 112 128" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
      <g style="${v('krona')}"><path d="M76 60 L74 32 L88 46 L100 22 L112 46 L126 32 L124 60 Z" fill="${GOLD}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="100" cy="22" r="4" fill="${PINK}" stroke="${INK}" stroke-width="2.5"/></g>
    </svg>`;
  }

  // ---------- game 1: Klä Arianna ----------
  let outfit = new Set(), dressQueue = [], dressCur = null;
  function dressStart() {
    outfit = new Set(); dressQueue = shuffle(WEAR).slice(0, 6); dressNext();
  }
  function dressNext() {
    const area = $('#gameArea');
    if (!dressQueue.length) {
      area.innerHTML = `<div class="panel pink"><h2>Arianna är redo för scenen!</h2><div class="dress"><div class="cosmo-stage">${ariannaSVG(outfit)}</div><div><p class="big">Hon har på sig: ${Array.from(outfit).map(id => esc(WEAR.find(w => w.id === id).sv)).join(', ')}.</p><p>Tryck på något nedan för att ändra looken, eller börja om.</p><div class="wear" id="freeWear">${WEAR.map(w => `<button class="wearbtn ${outfit.has(w.id) ? 'on' : ''}" data-w="${w.id}" title="${esc(w.sv)}">${icon(w.id)}<span>${esc(w.sv)}</span></button>`).join('')}</div><div class="row" style="margin-top:12px"><button class="btn pink" id="dressAgain">Igen</button><button class="btn plain" id="backGames">Andra spel</button></div></div></div></div>`;
      $('#freeWear').onclick = e => { const b = e.target.closest('[data-w]'); if (!b) return; outfit.has(b.dataset.w) ? outfit.delete(b.dataset.w) : outfit.add(b.dataset.w); b.classList.toggle('on'); $('.cosmo-stage').innerHTML = ariannaSVG(outfit); speak(WEAR.find(w => w.id === b.dataset.w).sv); };
      $('#dressAgain').onclick = dressStart; $('#backGames').onclick = gamesMenu;
      award(area, 2); return;
    }
    dressCur = dressQueue.shift();
    const choices = shuffle(WEAR.filter(w => !outfit.has(w.id)));
    area.innerHTML = `<div class="panel"><div class="dress"><div class="cosmo-stage">${ariannaSVG(outfit)}</div><div>
      <div class="q row"><span class="fr">${esc(dressCur.ask)}</span><button class="speak" id="dressSpeak">${SPK}</button></div>
      <div class="wear" id="wearPick">${choices.map(w => `<button class="wearbtn" data-w="${w.id}" aria-label="${esc(w.en)}">${icon(w.id)}</button>`).join('')}</div>
      <div class="feedback" id="dressFb"></div><p class="small muted">${6 - dressQueue.length} av 6. Inga etiketter, det är det som är spelet.</p></div></div></div>`;
    $('#dressSpeak').onclick = () => speak(dressCur.ask); speak(dressCur.ask);
    $('#wearPick').onclick = e => {
      const b = e.target.closest('[data-w]'); if (!b) return;
      if (b.dataset.w === dressCur.id) { outfit.add(dressCur.id); $('.cosmo-stage').innerHTML = ariannaSVG(outfit); $('#dressFb').innerHTML = `<span class="cheer">${rnd(window.DQ_CHEERS)}</span> ${esc(dressCur.sv)}: ${esc(dressCur.en)}.`; award(b, 1); $$('#wearPick button').forEach(x => x.disabled = true); setTimeout(dressNext, 1300); }
      else { b.classList.add('shake'); const w = WEAR.find(x => x.id === b.dataset.w); $('#dressFb').innerHTML = `<span class="cheer">${rnd(window.DQ_SOFT)}</span> Det där är ${esc(w.sv)} (${esc(w.en)}).`; setTimeout(() => b.classList.remove('shake'), 500); }
    };
  }

  // ---------- game 2: Skyltfönstret (prices in kronor) ----------
  const SHOP = [
    { sv: 'en kanelbulle', def: 'kanelbullen', en: 'cinnamon bun', draw: `<path d="M50 50 m-30 0 a30 30 0 1 0 60 0 a30 30 0 1 0 -60 0" fill="#d9a05b" stroke="${INK}" stroke-width="3"/><path d="M50 50 m-18 0 a18 18 0 1 1 36 0 a18 18 0 1 1 -36 0 M50 50 m-7 0 a7 7 0 1 1 14 0" fill="none" stroke="#8a5a2b" stroke-width="4"/><circle cx="36" cy="40" r="2" fill="#fff"/><circle cx="62" cy="36" r="2" fill="#fff"/><circle cx="58" cy="66" r="2" fill="#fff"/>` },
    { sv: 'ett SL-kort', def: 'SL-kortet', en: 'transit pass', draw: `<rect x="14" y="30" width="72" height="44" rx="8" fill="#5fa8ff" stroke="${INK}" stroke-width="3"/><rect x="22" y="40" width="20" height="14" rx="3" fill="#fff"/><text x="50" y="66" text-anchor="middle" font-size="13" font-family="Comfortaa,Nunito,sans-serif" font-weight="700" fill="#fff">SL</text>` },
    { sv: 'en ABBA-skiva', def: 'ABBA-skivan', en: 'ABBA record', draw: `<circle cx="50" cy="50" r="36" fill="${INK}" stroke="${INK}" stroke-width="3"/><circle cx="50" cy="50" r="24" fill="none" stroke="#5a5f85" stroke-width="2"/><circle cx="50" cy="50" r="12" fill="${PINK}" stroke="${INK}" stroke-width="2"/><circle cx="50" cy="50" r="3" fill="#fff"/>` },
    { sv: 'en ryggsäck', def: 'ryggsäcken', en: 'backpack', draw: `<rect x="24" y="26" width="52" height="60" rx="12" fill="#e03a3a" stroke="${INK}" stroke-width="3"/><rect x="34" y="52" width="32" height="24" rx="6" fill="#ffd166" stroke="${INK}" stroke-width="3"/><path d="M36 26 C40 12 60 12 64 26" fill="none" stroke="${INK}" stroke-width="4"/>` },
    { sv: 'ett par platåskor', def: 'platåskorna', en: 'platform shoes', draw: `<path d="M14 40 H44 V64 C44 70 38 74 30 74 H10 C4 74 4 66 10 64 V40 Z" fill="${SILVER}" stroke="${INK}" stroke-width="3"/><path d="M56 40 H86 V64 C86 70 92 74 96 74 C98 74 98 66 92 64 H70 C62 64 56 70 56 74 Z" fill="${SILVER}" stroke="${INK}" stroke-width="3"/><path d="M6 66 h38 M58 66 h36" stroke="${INK}" stroke-width="3"/>` },
    { sv: 'en tub kaviar', def: 'kaviartuben', en: 'tube of cod roe', draw: `<path d="M24 30 H76 L70 84 H30 Z" fill="#5fa8ff" stroke="${INK}" stroke-width="3"/><rect x="40" y="16" width="20" height="14" rx="3" fill="${GOLD}" stroke="${INK}" stroke-width="3"/><path d="M34 44 h32 M36 56 h28" stroke="#fff" stroke-width="4" stroke-linecap="round"/>` },
    { sv: 'en dalahäst', def: 'dalahästen', en: 'Dala horse', draw: `<path d="M20 82 V48 L34 30 H58 L68 20 L78 32 L72 46 V82 H60 V60 H40 V82 Z" fill="#e03a3a" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M40 44 c6 -4 12 -4 18 0 M46 54 c4 2 8 2 12 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M66 26 c4 -6 8 -6 10 -2" fill="none" stroke="${INK}" stroke-width="3"/>` },
    { sv: 'en paljettklänning', def: 'paljettklänningen', en: 'sequin dress', draw: `<path d="M38 16 L62 16 L58 34 L80 84 L20 84 L42 34 Z" fill="${GOLD}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><g fill="#fff" opacity=".8"><circle cx="40" cy="50" r="2"/><circle cx="56" cy="46" r="2"/><circle cx="48" cy="62" r="2"/><circle cx="34" cy="72" r="2"/><circle cx="64" cy="70" r="2"/></g>` },
    { sv: 'en kaffe', def: 'kaffet', en: 'coffee', draw: `<path d="M24 34 H70 V66 C70 76 62 84 50 84 H44 C32 84 24 76 24 66 Z" fill="#fff" stroke="${INK}" stroke-width="3"/><path d="M70 42 C84 42 84 64 70 64" fill="none" stroke="${INK}" stroke-width="3"/><path d="M30 42 H64 V60 C64 66 60 70 54 70 H40 C34 70 30 66 30 60 Z" fill="#6b3a2a"/><path d="M40 20 c0 6 -4 6 -4 12 M52 18 c0 6 -4 6 -4 12" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round" opacity=".6"/>` },
    { sv: 'ett par vantar', def: 'vantarna', en: 'mittens', draw: `<path d="M26 84 V40 C26 28 40 28 40 40 V30 C40 22 52 22 52 30 V84 Z" fill="${PINK}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M56 84 V40 C56 28 70 28 70 40 V30 C70 22 82 22 82 30 V84 Z" fill="${PINK}" stroke="${INK}" stroke-width="3" stroke-linejoin="round" transform="translate(-4 0)"/><path d="M26 72 h26 M52 72 h26" stroke="#fff" stroke-width="4"/>` }
  ];
  if (FI) F.SHOP.forEach((it, i) => { it.draw = SHOP[i].draw; });
  const ITEMS = FI ? F.SHOP : SHOP;
  const ONES = ['noll', 'ett', 'två', 'tre', 'fyra', 'fem', 'sex', 'sju', 'åtta', 'nio', 'tio', 'elva', 'tolv', 'tretton', 'fjorton', 'femton', 'sexton', 'sjutton', 'arton', 'nitton'];
  const TENS = ['', '', 'tjugo', 'trettio', 'fyrtio', 'femtio', 'sextio', 'sjuttio', 'åttio', 'nittio'];
  function numSv(n) {
    if (n < 20) return ONES[n];
    if (n < 100) { const t = Math.floor(n / 10), u = n % 10; return TENS[t] + (u ? ONES[u] : ''); }
    if (n < 1000) { const h = Math.floor(n / 100), r = n % 100; return (h === 1 ? 'hundra' : ONES[h] + 'hundra') + (r ? numSv(r) : ''); }
    const k = Math.floor(n / 1000), r = n % 1000; return (k === 1 ? 'tusen' : ONES[k] + 'tusen') + (r ? ' ' + numSv(r) : '');
  }
  const FONES = ['nolla', 'yksi', 'kaksi', 'kolme', 'neljä', 'viisi', 'kuusi', 'seitsemän', 'kahdeksan', 'yhdeksän', 'kymmenen'];
  function numFi(n) {
    if (n <= 10) return FONES[n];
    if (n < 20) return FONES[n - 10] + 'toista';
    if (n < 100) { const t = Math.floor(n / 10), u = n % 10; return FONES[t] + 'kymmentä' + (u ? FONES[u] : ''); }
    if (n < 1000) { const h = Math.floor(n / 100), r = n % 100; return (h === 1 ? 'sata' : FONES[h] + 'sataa') + (r ? numFi(r) : ''); }
    const k = Math.floor(n / 1000), r = n % 1000; return (k === 1 ? 'tuhat' : FONES[k] + 'tuhatta') + (r ? ' ' + numFi(r) : '');
  }
  const kr = n => FI ? (n === 1 ? 'yksi euro' : numFi(n) + ' euroa') : (n === 1 ? 'en krona' : numSv(n) + ' kronor');
  const unit = FI ? '€' : 'kr';
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const costs = it => FI ? (it.pl ? 'maksavat' : 'maksaa') : 'kostar';
  const PRICES = FI ? F.PRICES : [15, 25, 39, 45, 59, 69, 79, 99, 129, 149, 179, 199, 249, 299, 349, 399, 499, 599, 799, 999, 1295, 1499, 1990, 2495, 2999, 3995];
  let shop = null;
  function shopStart() { shop = { i: 0, n: 8, score: 0 }; shopNext(); }
  function shopNext() {
    const area = $('#gameArea');
    if (shop.i >= shop.n) { area.innerHTML = `<div class="panel pink"><h2>${shop.score} av ${shop.n}</h2><p class="big">${shop.score === shop.n ? 'Du kan gå på rea i Stockholm utan att blinka.' : shop.score >= 5 ? 'Svenska priser, nästan i hamn.' : 'Sjuttio och sjutton låter lika i farten. En runda till?'}</p><div class="row"><button class="btn pink" id="shopAgain">Igen</button><button class="btn plain" id="backGames">Andra spel</button></div></div>`; $('#shopAgain').onclick = shopStart; $('#backGames').onclick = gamesMenu; if (shop.score === shop.n) award(area, 3); return; }
    const items = shuffle(ITEMS).slice(0, 4).map(it => ({ ...it, price: 0 }));
    const prices = shuffle(PRICES).slice(0, 4); items.forEach((it, k) => it.price = prices[k]);
    const target = rnd(items); const mode = Math.random() < 0.5 ? 'hear' : 'read';
    const question = FI
      ? (mode === 'hear' ? `Paljonko ${target.def} ${costs(target)}? Kuuntele ja valitse tuote.` : `Mikä maksaa ${kr(target.price)}?`)
      : (mode === 'hear' ? `Vad kostar ${target.def}? Lyssna och välj varan.` : `Vad kostar ${kr(target.price)}?`);
    const say = mode === 'hear' ? `${cap(target.def)} ${costs(target)} ${kr(target.price)}.` : question;
    area.innerHTML = `<div class="panel"><div class="q row"><span class="fr">${esc(question)}</span><button class="speak" id="shopSpeak">${SPK}</button></div>
      <div class="shelf" id="shelf">${items.map((it, k) => `<button class="shopitem" data-k="${k}"><svg viewBox="0 0 100 100">${it.draw}</svg><span class="tag">${it.price} ${unit}</span><span class="small">${esc(it.sv)}</span></button>`).join('')}</div>
      <div class="feedback" id="shopFb"></div><p class="small muted">${shop.i + 1} av ${shop.n}</p></div>`;
    $('#shopSpeak').onclick = () => speak(say); speak(say);
    $('#shelf').onclick = e => {
      const b = e.target.closest('[data-k]'); if (!b) return; const it = items[+b.dataset.k]; $$('.shopitem').forEach(x => x.disabled = true);
      const ok = it === target; if (ok) { shop.score++; award(b, 1); b.classList.add('right'); } else { b.classList.add('wrong'); $$('.shopitem')[items.indexOf(target)].classList.add('right'); }
      $('#shopFb').innerHTML = `<span class="cheer">${ok ? rnd(window.DQ_CHEERS) : rnd(window.DQ_SOFT)}</span> ${esc(cap(target.def))} ${costs(target)} ${target.price} ${unit}: ${esc(kr(target.price))}.`;
      shop.i++; setTimeout(shopNext, ok ? 1500 : 2600);
    };
  }

  // ---------- game 3: Catwalken (en, ett, plural) ----------
  const NOUNS = [
    { key: 'dress', sv: 'klänning', g: 'en', en: 'dress', shape: 'M38 18 L62 18 L58 36 L80 84 L20 84 L42 36 Z' },
    { key: 'belt', sv: 'skärp', g: 'ett', en: 'belt', shape: 'M10 42 h80 v16 h-80 Z M42 38 h16 v24 h-16 Z' },
    { key: 'boots', sv: 'stövlar', g: 'pl', en: 'boots', shape: 'M24 14 H46 V70 C46 78 40 84 32 84 H14 C8 84 6 76 12 72 H24 Z M50 14 H72 V70 C72 78 78 84 86 84 H90 C92 84 92 76 86 72 H72 Z' },
    { key: 'hat', sv: 'hatt', g: 'en', en: 'hat', shape: 'M10 62 C8 46 30 36 52 38 C74 40 92 50 88 62 C70 56 40 54 10 62 Z M34 40 C36 26 64 26 66 40 Z' },
    { key: 'necklace', sv: 'halsband', g: 'ett', en: 'necklace', shape: 'M14 30 C26 70 74 70 86 30 C78 56 22 56 14 30 Z M42 62 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0' },
    { key: 'jacket', sv: 'jacka', g: 'en', en: 'jacket', shape: 'M30 20 L50 30 L70 20 L84 30 L78 86 L22 86 L16 30 Z' },
    { key: 'trousers', sv: 'byxor', g: 'pl', en: 'trousers', shape: 'M26 16 H74 L80 84 H58 L50 44 L42 84 H20 Z' },
    { key: 'sunglasses', sv: 'solglasögon', g: 'pl', en: 'sunglasses', shape: 'M6 40 h38 v26 h-38 Z M56 40 h38 v26 h-38 Z M44 48 h12 v6 h-12 Z' },
    { key: 'cape', sv: 'mantel', g: 'en', en: 'cape', shape: 'M50 14 L20 40 L14 88 L86 88 L80 40 Z' },
    { key: 'shoes', sv: 'skor', g: 'pl', en: 'shoes', shape: 'M6 66 C16 54 36 56 48 46 L62 56 C72 60 78 64 78 70 L6 70 Z M22 86 C32 74 52 76 64 66 L78 76 C88 80 94 84 94 90 L22 90 Z' }
  ];
  const COLORS = [
    { f: ['röd', 'rött', 'röda'], hex: '#e03a3a', en: 'red' },
    { f: ['gul', 'gult', 'gula'], hex: '#ffd166', en: 'yellow' },
    { f: ['blå', 'blått', 'blåa'], hex: '#5fa8ff', en: 'blue' },
    { f: ['grön', 'grönt', 'gröna'], hex: '#7ee0a3', en: 'green' },
    { f: ['vit', 'vitt', 'vita'], hex: '#fff8f0', en: 'white' },
    { f: ['svart', 'svart', 'svarta'], hex: '#1c1240', en: 'black' },
    { f: ['silvrig', 'silvrigt', 'silvriga'], hex: '#e6e9f5', en: 'silver' },
    { f: ['glittrig', 'glittrigt', 'glittriga'], hex: '#ffb3dc', en: 'glittery' },
    { f: ['grå', 'grått', 'gråa'], hex: '#9a9aa8', en: 'grey' },
    { f: ['brun', 'brunt', 'bruna'], hex: '#8a5a2b', en: 'brown' }
  ];
  const ART = { en: 'en ', ett: 'ett ', pl: '' };
  const idx = g => g === 'en' ? 0 : g === 'ett' ? 1 : 2;
  function phrase(noun, color, g) { return `${ART[g]}${color.f[idx(g)]} ${noun.sv}`; }
  let runway = null;
  function runwayStart() { runway = { i: 0, n: 10, score: 0 }; runwayNext(); }
  function runwayNext() {
    const area = $('#gameArea');
    if (runway.i >= runway.n) { area.innerHTML = `<div class="panel pink"><h2>${runway.score} av ${runway.n}</h2><p class="big">${runway.score === runway.n ? 'Perfekt kongruens. Agnetha applåderar.' : runway.score >= 7 ? 'Catwalken är din, nästan.' : 'Adjektivet rättar sig efter substantivet: en, ett eller -a. En runda till?'}</p><div class="row"><button class="btn pink" id="rwAgain">Igen</button><button class="btn plain" id="backGames">Andra spel</button></div></div>`; $('#rwAgain').onclick = runwayStart; $('#backGames').onclick = gamesMenu; if (runway.score === runway.n) award(area, 3); return; }
    let noun, color, right, wrongs = new Set(), prompt = 'Vad har hon på sig?', why, plural, hex;
    if (FI) {
      // Finnish: the adjective agrees in number and case. Nominative after "Hänellä on", partitive after "Hänellä ei ole".
      const fn = rnd(F.NOUNS); color = rnd(F.COLORS); noun = NOUNS.find(n => n.key === fn.key) || NOUNS[0];
      plural = !fn.f[0] || Math.random() < 0.5; const part = Math.random() < 0.45;
      const ix = (part ? 2 : 0) + (plural ? 1 : 0);
      prompt = part ? 'Hänellä ei ole ___.' : 'Hänellä on ___.';
      right = `${color.f[ix]} ${fn.f[ix]}`;
      [0, 1, 2, 3].filter(k => k !== ix && fn.f[k]).forEach(k => { wrongs.add(`${color.f[k]} ${fn.f[ix]}`); });
      [0, 1, 2, 3].filter(k => k !== ix && fn.f[k] && color.f[k] !== color.f[ix]).forEach(k => { wrongs.add(`${color.f[ix]} ${fn.f[k]}`); });
      let other; do { other = rnd(F.COLORS); } while (other === color); wrongs.add(`${other.f[ix]} ${fn.f[ix]}`);
      why = `${fn.f[plural ? 1 : 0]} on ${plural ? 'monikossa' : 'yksikössä'} ja ${part ? 'partitiivissa kiellon jälkeen' : 'nominatiivissa'}, ja adjektiivi taipuu samaan muotoon`;
      hex = color.hex; noun = { ...noun, en: fn.en };
    } else {
      do { noun = rnd(NOUNS); color = rnd(COLORS); } while (color.f[0] === color.f[1] && noun.g !== 'pl');
      right = phrase(noun, color, noun.g);
      const others = ['en', 'ett', 'pl'].filter(g => g !== noun.g);
      others.forEach(g => { wrongs.add(`${ART[noun.g]}${color.f[idx(g)]} ${noun.sv}`); wrongs.add(`${ART[g]}${color.f[idx(g)]} ${noun.sv}`); });
      let other; do { other = rnd(COLORS); } while (other === color); wrongs.add(phrase(noun, other, noun.g));
      why = noun.g === 'pl' ? `${noun.sv} är plural, så adjektivet får -a och ingen artikel` : noun.g === 'ett' ? `${noun.sv} är ett ett-ord, så ett och adjektivet får -t` : `${noun.sv} är ett en-ord, så en och grundformen`;
      plural = noun.g === 'pl'; hex = color.hex;
    }
    const opts = shuffle([right].concat(shuffle(Array.from(wrongs).filter(w => w !== right)).slice(0, 3)));
    area.innerHTML = `<div class="panel"><div class="dress"><div class="runway-stage"><svg viewBox="0 0 100 100"><path d="${noun.shape}" fill="${hex}" stroke="${INK}" stroke-width="4" stroke-linejoin="round" fill-rule="evenodd"/></svg><div class="small muted">${plural ? 'plural' : 'singular'} ${esc(noun.en)}, ${color.en}</div></div><div>
      <div class="q"><span class="fr">${esc(prompt)}</span></div>
      <div class="opts" id="rwOpts">${opts.map((o, k) => `<button class="opt" data-k="${k}">${esc(o)}</button>`).join('')}</div>
      <div class="feedback" id="rwFb"></div><p class="small muted">${runway.i + 1} av ${runway.n}</p></div></div></div>`;
    $('#rwOpts').onclick = e => {
      const b = e.target.closest('[data-k]'); if (!b) return; $$('#rwOpts .opt').forEach(x => { x.disabled = true; if (opts[+x.dataset.k] === right) x.classList.add('right'); });
      const ok = opts[+b.dataset.k] === right; if (!ok) b.classList.add('wrong'); else { runway.score++; award(b, 1); }
      $('#rwFb').innerHTML = `<span class="cheer">${ok ? rnd(window.DQ_CHEERS) : rnd(window.DQ_SOFT)}</span> ${esc(right)}. ${esc(why)}.`; speak(right);
      runway.i++; setTimeout(runwayNext, ok ? 1500 : 2800);
    };
  }

  // ---------- menu ----------
  function gamesMenu() {
    $('#gameArea').innerHTML = `<div class="panel"><h2>Ska vi spela?</h2>
      <div class="gamelist">
        <button class="game" id="gDress"><div class="gpic">${ariannaSVG(new Set(['pannband', 'mikrofon']))}</div><div><span class="fr big">Klä Arianna</span><br>Lyssna på instruktionen och välj rätt scenplagg. Inga etiketter, bara öronen.</div></button>
        <button class="game" id="gShop"><div class="gpic"><svg viewBox="0 0 100 100">${SHOP[0].draw}</svg></div><div><span class="fr big">Skyltfönstret</span><br>Svenska priser i ord och i örat. Kanelbullar, SL-kort och platåskor.</div></button>
        <button class="game" id="gRunway"><div class="gpic"><svg viewBox="0 0 100 100"><path d="${NOUNS[0].shape}" fill="${PINK}" stroke="${INK}" stroke-width="4"/></svg></div><div><span class="fr big">Catwalken</span><br>Säg vad hon har på sig med rätt en, ett eller plural och rätt adjektivform.</div></button>
      </div></div>`;
    $('#gDress').onclick = dressStart; $('#gShop').onclick = shopStart; $('#gRunway').onclick = runwayStart;
  }
  L.gamesMenu = gamesMenu;
})();
