// Language switch. Reads the saved choice and, for Finnish, swaps the DQ_* content globals for the Finnish set
// before app.js runs. UI copy is swapped by fi.js. Progress is kept separately per language.
(function () {
  'use strict';
  let lang = 'sv';
  try { lang = localStorage.getItem('dq_lang') || 'sv'; } catch (e) {}
  if (lang !== 'fi' || !window.DQ_FI) lang = 'sv';
  window.DQ_LANG = lang;
  document.documentElement.lang = lang;
  if (lang === 'fi') {
    const F = window.DQ_FI;
    window.DQ_DECKS = F.DECKS; window.DQ_VERBS = F.VERBS; window.DQ_GRAMMAR = F.GRAMMAR; window.DQ_PHRASES = F.PHRASES;
    window.DQ_CHEERS = F.CHEERS; window.DQ_SOFT = F.SOFT; window.DQ_GLITTRA_SAYS = F.GLITTRA_SAYS; window.DQ_ARIANNA_SAYS = F.ARIANNA_SAYS;
    window.DQ_STATIONS = F.STATIONS;
  }
  window.DQ_SET_LANG = l => { try { localStorage.setItem('dq_lang', l); } catch (e) {} location.reload(); };
})();
