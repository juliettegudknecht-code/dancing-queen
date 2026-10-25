// Disco touches for Dancing Queen: the retro logo ring around the title, a few drifting sparkles,
// a flying star that is sometimes a tiny disco ball, extra lines for Arianna and Glittra. Pure decoration, loaded last.
(function () {
  'use strict';
  const INK = '#1c1240';
  const seed = n => { const x = Math.sin(n * 9301 + 49297) * 233280; return x - Math.floor(x); };

  // a handful of soft sparkles drifting behind everything
  const sky = document.createElement('div'); sky.className = 'parisSky'; sky.setAttribute('aria-hidden', 'true');
  const spark = c => `<svg viewBox="0 0 100 100"><path d="M50 6 L58 42 L94 50 L58 58 L50 94 L42 58 L6 50 L42 42 Z" fill="${c}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/></svg>`;
  const cols = ['#ffd166', '#ff5fa8', '#fff', '#e6e9f5'];
  sky.innerHTML = [0, 1, 2, 3, 4, 5].map(k => `<span class="drift" style="left:${(4 + seed(k + 11) * 92).toFixed(1)}%;top:${(6 + seed(k + 17) * 80).toFixed(1)}%;animation-duration:${(9 + seed(k + 19) * 8).toFixed(0)}s;animation-delay:${(-seed(k + 23) * 12).toFixed(0)}s;scale:${(.5 + seed(k + 29) * .7).toFixed(2)}">${spark(cols[k % cols.length])}</span>`).join('');
  document.body.insertBefore(sky, document.body.firstChild);

  // retro logo: an orbit ring with a tiny disco ball circling the title, and a glitter floor behind it
  const h1 = document.querySelector('.title h1');
  if (h1) {
    const logo = document.createElement('div'); logo.className = 'logo';
    h1.parentNode.insertBefore(logo, h1); logo.appendChild(h1);
    logo.insertAdjacentHTML('afterbegin', `<svg class="logo-back" viewBox="0 0 600 200" preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id="lgs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff5fa8"/><stop offset="1" stop-color="#ffd166"/></linearGradient></defs>
      <g opacity=".5" fill="url(#lgs)"><rect x="40" y="118" width="520" height="10" rx="5"/><rect x="90" y="138" width="420" height="8" rx="4"/><rect x="150" y="156" width="300" height="6" rx="3"/></g>
      <ellipse cx="300" cy="100" rx="290" ry="74" fill="none" stroke="#fff" stroke-width="5" opacity=".8" transform="rotate(-6 300 100)"/>
      <ellipse cx="300" cy="100" rx="290" ry="74" fill="none" stroke="${INK}" stroke-width="2" opacity=".35" transform="rotate(-6 300 100)"/>
    </svg>`);
    logo.insertAdjacentHTML('beforeend', `<svg class="logo-front" viewBox="0 0 600 200" preserveAspectRatio="none" aria-hidden="true">
      <path id="orbitpath" d="M10 130 A290 74 -6 0 1 590 70" fill="none"/>
      <g><circle r="11" fill="#e6e9f5" stroke="${INK}" stroke-width="3"/><path d="M-11 0 h22 M0 -11 v22 M-8 -6 h16 M-8 6 h16" stroke="#b7bdd6" stroke-width="1.5"/><circle cx="-4" cy="-4" r="2" fill="#ff5fa8"/>
        <animateMotion dur="9s" repeatCount="indefinite" rotate="0"><mpath href="#orbitpath"/></animateMotion></g>
      <g><circle r="3" fill="#ffd166"/><animateMotion dur="9s" begin="-4.5s" repeatCount="indefinite"><mpath href="#orbitpath"/></animateMotion></g>
    </svg>`);
  }

  // a tiny disco ball in the footer
  const foot = document.querySelector('footer');
  const ball = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 4 v10" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><circle cx="50" cy="54" r="40" fill="#e6e9f5" stroke="${INK}" stroke-width="5"/><path d="M10 54h80M18 34h64M18 74h64M50 14v80M30 20v68M70 20v68" stroke="#b7bdd6" stroke-width="3"/><circle cx="36" cy="40" r="5" fill="#ff5fa8"/><circle cx="66" cy="64" r="5" fill="#ffd166"/></svg>`;
  if (foot) foot.insertAdjacentHTML('afterbegin', `<span class="footicon">${ball}</span>`);

  // stars that fly to the badge are sometimes a little disco ball
  const STAR = `<svg viewBox="0 0 100 100"><path d="M50 4 L60 40 L96 50 L60 60 L50 96 L40 60 L4 50 L40 40 Z" fill="#ffd166" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/></svg>`;
  if (window.DQ) window.DQ.flyIcon = () => Math.random() < .8 ? STAR : ball;

  // more things for them to say
  if (window.DQ_LANG !== 'fi' && window.DQ_GLITTRA_SAYS) window.DQ_GLITTRA_SAYS.push('Mamma mia!', 'Gimme gimme gimme.', 'Snurra mig, snälla.', 'Voulez-vous? Nej, på svenska.');
  if (window.DQ_LANG !== 'fi' && window.DQ_ARIANNA_SAYS) window.DQ_ARIANNA_SAYS.push('Mamma mia, här är vi igen.', 'Glittret först, grammatiken sen.', 'Juliette hälsar.', 'The winner takes it all.');
})();
