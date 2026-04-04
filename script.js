// script.js — App logic for Proliance Interview Guide

const S = {
  current: 0,
  notes: {},
  ratings: {},
  choices: {},
  debriefAnswers: {},
  candName: '',
  hasExp: null,
  flags: [],
  user: null,
};

// ── STORAGE ──────────────────────────────────────────────────────────────────

function storageKey(k) { return `proliance_${S.user}_${k}`; }

function save(key, val) {
  try { localStorage.setItem(storageKey(key), JSON.stringify(val)); } catch(e) {}
}

function load(key, fallback) {
  try {
    const v = localStorage.getItem(storageKey(key));
    return v !== null ? JSON.parse(v) : fallback;
  } catch(e) { return fallback; }
}

function saveSession() {
  save('session', {
    current: S.current, notes: S.notes, ratings: S.ratings,
    choices: S.choices, debriefAnswers: S.debriefAnswers,
    candName: S.candName, hasExp: S.hasExp, flags: S.flags,
  });
}

function loadSession() {
  const s = load('session', null);
  if (s) {
    Object.assign(S, s);
    document.getElementById('cand-name').value = S.candName || '';
    updateExpPill();
    updateVerdictPill();
    renderFlags();
  }
}

function saveHistory(candidate) {
  const hist = load('history', []);
  const idx = hist.findIndex(h => h.id === candidate.id);
  if (idx >= 0) hist[idx] = candidate; else hist.unshift(candidate);
  save('history', hist.slice(0, 100));
}

function loadHistory() { return load('history', []); }

function newSession() {
  S.current = 0; S.notes = {}; S.ratings = {}; S.choices = {};
  S.debriefAnswers = {}; S.candName = ''; S.hasExp = null; S.flags = [];
  document.getElementById('cand-name').value = '';
  updateExpPill(); updateVerdictPill(); renderFlags();
  saveSession();
  goTo(0);
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────

function login(user) {
  S.user = user;
  save('lastUser', user);
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app').classList.add('visible');
  loadSession();
  renderStep();
  renderSidebar();
}

function logout() {
  saveSession();
  S.user = null;
  document.getElementById('app').classList.remove('visible');
  document.getElementById('login-screen').style.display = 'flex';
}

// ── NAME HELPERS ──────────────────────────────────────────────────────────────

function fn() { return S.candName ? S.candName.split(' ')[0] : '[name]'; }
function injectName(text) { return text.replace(/\[name\]/g, `<b style="color:#185FA5">${fn()}</b>`); }
function injectNamePlain(text) { return text.replace(/\[name\]/g, fn()); }

// ── FLAGS ─────────────────────────────────────────────────────────────────────

function addFlag(color) {
  const step = SCRIPT_DATA.steps[S.current];
  S.flags.push({ color, step: step.label, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
  renderFlags();
  saveSession();
}

function renderFlags() {
  const strip = document.getElementById('flags-strip');
  if (!S.flags.length) { strip.classList.remove('visible'); return; }
  strip.classList.add('visible');
  const cmap = { green: ['#EAF3DE','#3B6D11','Green'], amber: ['#FAEEDA','#BA7517','Yellow'], red: ['#FCEBEB','#A32D2D','Red'] };
  strip.innerHTML = S.flags.map(f => {
    const [bg, color, label] = cmap[f.color];
    return `<span class="flag-chip" style="background:${bg};color:${color}">${label} · ${f.step} · ${f.time}</span>`;
  }).join('');
}

// ── PILLS ─────────────────────────────────────────────────────────────────────

function updateExpPill() {
  const el = document.getElementById('exp-pill');
  if (!el) return;
  const v = S.hasExp;
  if (!v) { el.style.display = 'none'; return; }
  el.style.display = 'inline-block';
  const map = { yes: ['#E6F1FB','#185FA5','Experienced'], partial: ['#E1F5EE','#0F6E56','Partial exp'], no: ['#FCEBEB','#A32D2D','No experience'] };
  const [bg, color, label] = map[v];
  Object.assign(el.style, { background: bg, color });
  el.textContent = label;
}

function updateVerdictPill() {
  const el = document.getElementById('verdict-pill');
  if (!el) return;
  const s = Object.values(S.ratings).filter(r => r === 'strong').length;
  const c = Object.values(S.ratings).filter(r => r === 'caution').length;
  const e = Object.values(S.ratings).filter(r => r === 'exit').length;
  if (s + c + e === 0) { el.style.display = 'none'; return; }
  el.style.display = 'inline-block';
  if (e > 0) { el.style.background = '#FCEBEB'; el.style.color = '#A32D2D'; el.textContent = 'Exit triggered'; }
  else if (s >= 8) { el.style.background = '#EAF3DE'; el.style.color = '#3B6D11'; el.textContent = 'Strong hire'; }
  else if (s >= 6) { el.style.background = '#FAEEDA'; el.style.color = '#BA7517'; el.textContent = 'Proceed w/ caution'; }
  else { el.style.background = '#FCEBEB'; el.style.color = '#A32D2D'; el.textContent = 'Do not proceed'; }
}

// ── CARD BUILDERS ─────────────────────────────────────────────────────────────

function cardHTML(type, text, editable = true) {
  const tagLabels = { ask: 'ASK', say: 'SAY', note: 'NOTE', rule: 'RULE', listen: 'LISTEN FOR', exit: 'EXIT', branch: 'EXPERIENCED TRACK', context: 'ROLE BRIEFING' };
  const isAsk = type === 'ask';
  const textClass = isAsk ? 'q-text' : 'kv-text';
  const editAttr = editable ? 'contenteditable="true"' : '';
  const editHint = editable ? '<span class="edit-hint">click to edit</span>' : '';
  return `<div class="card">${editHint}<span class="tag t-${type}">${tagLabels[type] || type.toUpperCase()}</span><div class="${textClass} editable" ${editAttr}>${injectName(text)}</div></div>`;
}

function exitBlockHTML(script) {
  return `<div class="exit-block"><div class="exit-lbl">Exit — say verbatim</div><div class="exit-say editable" contenteditable="true">${injectName(script)}</div></div>`;
}

function choiceHTML(key, question, options) {
  const cur = S.choices[key];
  const colorMap = { green: 'sel-g', red: 'sel-r', amber: 'sel-a', blue: 'sel-b' };
  const btns = options.map(o => {
    const sel = cur === o.val ? colorMap[o.color] || '' : '';
    return `<button class="opt-btn ${sel}" onclick="setChoice('${key}','${o.val}')">${o.label}</button>`;
  }).join('');
  return `<div class="choice-card"><div class="choice-q">${question}</div><div class="opts">${btns}</div></div>`;
}

function ratingHTML(id, exitScript) {
  const r = S.ratings[id];
  return `<div style="margin-top:6px">
    <div style="font-size:11px;color:var(--text3);margin-bottom:5px">Your rating</div>
    <div class="rating-row">
      <button class="r-btn r-s ${r==='strong'?'on':''}" onclick="rate('${id}','strong')">Strong</button>
      <button class="r-btn r-c ${r==='caution'?'on':''}" onclick="rate('${id}','caution')">Caution</button>
      <button class="r-btn r-e ${r==='exit'?'on':''}" onclick="rate('${id}','exit')">Exit</button>
    </div>
    ${r === 'exit' && exitScript ? exitBlockHTML(exitScript) : ''}
  </div>`;
}

function noteHTML(id) {
  return `<div class="notes-lbl">Your notes</div><textarea placeholder="Write here..." onchange="S.notes['${id}']=this.value;saveSession()">${S.notes[id] || ''}</textarea>`;
}

function trackBadge() {
  const v = S.hasExp;
  if (!v) return '';
  const map = { yes: ['tb-exp', 'Experienced track'], partial: ['tb-partial', 'Partial experience track'], no: ['tb-noexp', 'No experience track'] };
  const [cls, label] = map[v];
  return `<div class="track-badge ${cls}">${label}</div>`;
}

// ── STEP RENDERERS ────────────────────────────────────────────────────────────

function renderStepContent(step) {
  const exp = S.hasExp;
  let html = '';

  // Track badge for vetting steps
  if (step.section === 'Vetting' && step.id !== 'roleexplain') html += trackBadge();

  // Render main cards
  if (step.cards) step.cards.forEach(c => { html += cardHTML(c.type, c.text); });

  // Step-specific rendering
  if (step.id === 'consent') html += renderConsent(step);
  if (step.id === 'intent') html += renderIntent(step);
  if (step.id === 'background') html += renderBackground(step);
  if (step.id === 'gap') html += renderGap(step);
  if (step.id === 'roleexplain') html += renderRoleExplain(step);
  if (step.id === 'final') html += renderFinal(step);
  if (step.id === 'debrief') html += renderDebrief(step);

  // Exp/no-exp branched cards for vetting steps
  if (['pressure','conviction','field','learning','docs','resilience'].includes(step.id)) {
    if (exp === 'yes' && step.expCards) step.expCards.forEach(c => { html += cardHTML(c.type, c.text || c.label || ''); });
    if ((exp === 'no' || exp === 'partial') && step.noExpCards) step.noExpCards.forEach(c => { html += cardHTML(c.type, c.text); });
    if (step.sharedListenCards) step.sharedListenCards.forEach(c => { html += cardHTML(c.type, c.text); });
  }

  // Rating block for rated steps
  if (step.rated) html += ratingHTML(step.id, step.exitScript || '');

  // Notes
  if (step.id !== 'debrief') html += noteHTML(step.id);

  return html;
}

function renderConsent(step) {
  let html = '';
  step.choices.forEach(ch => { html += choiceHTML(ch.key, ch.question, ch.options); });
  if (S.choices['showTable'] === 'yes') {
    html += `<div class="card"><span class="tag t-note">COMP TABLE</span>
      <table class="comp-table">
        <tr><th></th><th>Old</th><th>New</th><th>Change</th></tr>
        <tr><td colspan="4" style="font-size:11px;color:var(--text3);padding-top:6px">Option 1 — Base</td></tr>
        <tr><td>Base pay</td><td>$900/wk</td><td>$800/wk</td><td class="dn">−$100</td></tr>
        <tr><td>Full approval</td><td>$100</td><td>$150</td><td class="up">+$50</td></tr>
        <tr><td>Partial approval</td><td>$50</td><td>$50</td><td>—</td></tr>
        <tr><td>Denial</td><td>—</td><td>$20</td><td class="up">New</td></tr>
        <tr><td colspan="4" style="font-size:11px;color:var(--text3);padding-top:6px">Option 2 — Commission only</td></tr>
        <tr><td>Full approval</td><td>$200</td><td>$250</td><td class="up">+$50</td></tr>
        <tr><td>Partial approval</td><td>$100</td><td>$150</td><td class="up">+$50</td></tr>
        <tr><td>Denial</td><td>$50</td><td>$50</td><td>—</td></tr>
      </table></div>`;
  }
  const resp = S.choices['consent'];
  if (resp === 'hesitant' || resp === 'no') html += exitBlockHTML(step.exits[resp] || '');
  return html;
}

function renderIntent(step) {
  let html = '';
  step.choices.forEach(ch => { html += choiceHTML(ch.key, ch.question, ch.options); });
  if (S.choices['intent'] === 'spray') html += exitBlockHTML(step.exits.spray || '');
  return html;
}

function renderBackground(step) {
  let html = '';
  step.choices.forEach(ch => { html += choiceHTML(ch.key, ch.question, ch.options); });
  const exp = S.choices['exp'];
  if (exp === 'no') html += exitBlockHTML(step.exits.no || '');
  if (exp === 'partial' && step.partialNote) {
    html += `<div class="partial-note">${injectName(step.partialNote)}</div>`;
  }
  return html;
}

function renderGap(step) {
  let html = '';
  step.choices.forEach(ch => { html += choiceHTML(ch.key, ch.question, ch.options); });
  if (S.choices['gap'] !== 'vague') return html;
  const vf = step.vagueFollowup;
  html += `<div class="card" style="border-color:var(--amber)"><span class="tag t-note">GAP BRANCH</span><div class="kv-text">Gap is unclear. Find the reason for leaving — then test if it's urgent.</div></div>`;
  vf.choices.forEach(ch => { html += choiceHTML(ch.key, ch.question, ch.options); });
  const reason = S.choices['leavingReason'];
  if (!reason) return html;
  if (reason === 'unclear') { html += exitBlockHTML(vf.exits.unclear || ''); return html; }
  const branch = vf[reason];
  if (!branch) return html;
  if (branch.cards) branch.cards.forEach(c => { html += cardHTML(c.type, c.text); });
  if (branch.choices) branch.choices.forEach(ch => { html += choiceHTML(ch.key, ch.question, ch.options); });
  if (branch.exits) {
    Object.entries(branch.exits).forEach(([val, script]) => {
      if (S.choices[branch.choices?.[0]?.key] === val) html += exitBlockHTML(script);
    });
  }
  if (reason === 'financial' && branch.urgency && S.choices['finPain'] === 'yes') {
    const urg = branch.urgency;
    if (urg.cards) urg.cards.forEach(c => { html += cardHTML(c.type, c.text); });
    if (urg.choices) urg.choices.forEach(ch => { html += choiceHTML(ch.key, ch.question, ch.options); });
    if (S.choices['urgency'] === 'later' && urg.exits?.later) html += exitBlockHTML(urg.exits.later);
  }
  return html;
}

function renderRoleExplain(step) {
  const exp = S.hasExp;
  let html = '';
  if (exp === 'yes') {
    html += trackBadge();
    if (step.expCards) step.expCards.forEach(c => { html += cardHTML(c.type, c.text); });
  } else {
    if (exp === 'partial') html += `<div class="track-badge tb-partial">Partial experience track</div>`;
    else if (exp === 'no') html += `<div class="track-badge tb-noexp">No experience track</div>`;
    if (step.noExpCards) step.noExpCards.forEach(c => { html += cardHTML(c.type, c.text); });
  }
  return html;
}

function renderFinal(step) {
  const s = Object.values(S.ratings).filter(r => r === 'strong').length;
  const c = Object.values(S.ratings).filter(r => r === 'caution').length;
  const e = Object.values(S.ratings).filter(r => r === 'exit').length;
  let d = {};
  if (e > 0) d = { bg: '#FCEBEB', c: '#A32D2D', title: 'Do not proceed', sub: 'An exit was triggered. Interview confidence does not override exit signals.' };
  else if (s >= 8 && c <= 2) d = { bg: '#EAF3DE', c: '#3B6D11', title: 'Strong hire', sub: 'Composure, field readiness, learning ability, and process discipline all present.' };
  else if (s >= 6) d = { bg: '#FAEEDA', c: '#BA7517', title: 'Proceed with caution', sub: 'Probe flagged caution areas in a second conversation before deciding.' };
  else d = { bg: '#FCEBEB', c: '#A32D2D', title: 'Do not proceed', sub: 'Fewer than 6 strong ratings. Interview confidence does not override weak signals.' };
  return `<div class="card"><span class="tag t-note">SCORE SUMMARY</span>
    <div class="sum-grid">
      <div class="sum-card"><div class="sum-lbl">Strong</div><div class="sum-val" style="color:var(--green)">${s}</div></div>
      <div class="sum-card"><div class="sum-lbl">Caution</div><div class="sum-val" style="color:var(--amber)">${c}</div></div>
      <div class="sum-card"><div class="sum-lbl">Exit triggers</div><div class="sum-val" style="color:var(--red)">${e}</div></div>
      <div class="sum-card"><div class="sum-lbl">Sections rated</div><div class="sum-val">${s+c+e} of 10</div></div>
    </div>
    <div style="margin-top:10px;padding:11px 13px;border-radius:var(--radius-sm);background:${d.bg};border:0.5px solid ${d.c}40">
      <div style="font-size:10px;font-weight:600;color:${d.c};text-transform:uppercase;letter-spacing:.05em;margin-bottom:3px">Score decision</div>
      <div style="font-size:14px;font-weight:600;color:${d.c};margin-bottom:3px">${d.title}</div>
      <div style="font-size:12.5px;color:var(--text2);line-height:1.6">${d.sub}</div>
    </div>
  </div>
  ${ratingHTML('final', step.exitScript)}`;
}

function renderDebrief(step) {
  const a = S.debriefAnswers;
  const qHTML = step.questions.map(q => {
    const cur = a[q.key];
    const btns = q.opts.map(o => {
      const sel = cur === o.v ? `d-${o.v}` : '';
      return `<button class="d-btn ${sel}" onclick="setDebrief('${q.key}','${o.v}')">${o.l}</button>`;
    }).join('');
    return `<div class="debrief-q"><div class="db-lbl">Reflect</div><div class="db-q">${injectName(q.text)}</div><div class="d-opts">${btns}</div></div>`;
  }).join('');

  const answered = Object.keys(a).length;
  let verdictHTML = '';
  if (answered >= 3) {
    const gs = Object.values(a).filter(v => v === 'g').length;
    const rs = Object.values(a).filter(v => v === 'r').length;
    let v = {};
    if (rs >= 2) v = { bg: '#FCEBEB', c: '#A32D2D', title: 'Reject', sub: `Your gut and your notes are pointing the same direction — ${fn()} is not the right fit right now. Trust that.` };
    else if (gs >= 4) v = { bg: '#EAF3DE', c: '#3B6D11', title: 'Move forward', sub: `Across the board, ${fn()} showed up. Your instincts and the signals are aligned. Proceed with confidence.` };
    else v = { bg: '#FAEEDA', c: '#BA7517', title: '50/50 — needs more', sub: `There's enough here to be curious, but not enough to be confident. A second conversation focused on the flagged areas will tell you more.` };
    verdictHTML = `<div class="verdict-box" style="background:${v.bg};border-color:${v.c}40">
      <div style="font-size:10px;font-weight:600;color:${v.c};text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">Your gut verdict</div>
      <div style="font-size:20px;font-weight:600;color:${v.c};margin-bottom:5px">${v.title}</div>
      <div style="font-size:13px;color:var(--text2);line-height:1.6">${v.sub}</div>
    </div>`;
  } else {
    verdictHTML = `<div class="verdict-pending">Answer at least 3 questions to generate your verdict.</div>`;
  }

  return `<div style="font-size:13px;color:var(--text2);margin-bottom:14px;line-height:1.6">Call is done. Step back and answer honestly — your gut matters as much as the scores.</div>
  ${qHTML}${verdictHTML}
  <div style="margin-top:12px">
    <button class="pdf-btn" onclick="generatePDF()">Export PDF summary</button>
    <button class="save-cand-btn" onclick="saveCandidate()">Save to history</button>
  </div>
  ${noteHTML('debrief')}`;
}

// ── ACTIONS ───────────────────────────────────────────────────────────────────

function setChoice(key, val) {
  S.choices[key] = val;
  if (key === 'exp') { S.hasExp = val; updateExpPill(); }
  saveSession(); renderStep();
}

function setDebrief(key, val) {
  S.debriefAnswers[key] = val;
  saveSession(); renderStep();
}

function rate(id, val) {
  S.ratings[id] = val;
  saveSession(); updateVerdictPill(); renderStep();
}

function saveCandidate() {
  if (!S.candName.trim()) { alert('Enter a candidate name first.'); return; }
  const s = Object.values(S.ratings).filter(r => r === 'strong').length;
  const e = Object.values(S.ratings).filter(r => r === 'exit').length;
  const a = S.debriefAnswers;
  const gs = Object.values(a).filter(v => v === 'g').length;
  const rs = Object.values(a).filter(v => v === 'r').length;
  let verdict = 'Pending';
  if (Object.keys(a).length >= 3) {
    if (rs >= 2) verdict = 'Reject';
    else if (gs >= 4) verdict = 'Move forward';
    else verdict = '50/50';
  }
  const candidate = {
    id: Date.now(),
    name: S.candName,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    exp: S.hasExp,
    strong: s,
    exits: e,
    verdict,
    notes: S.notes,
    ratings: S.ratings,
    flags: S.flags,
  };
  saveHistory(candidate);
  alert(`${S.candName} saved to your history.`);
}

// ── HISTORY MODAL ─────────────────────────────────────────────────────────────

function openHistory() {
  const hist = loadHistory();
  const modal = document.getElementById('hist-modal');
  const list = document.getElementById('hist-list');
  if (!hist.length) {
    list.innerHTML = '<div class="hist-empty">No interviews saved yet.</div>';
  } else {
    const expLabel = { yes: 'Experienced', partial: 'Partial exp', no: 'No experience' };
    const vColors = { 'Move forward': '#3B6D11', 'Reject': '#A32D2D', '50/50': '#BA7517', 'Pending': '#999' };
    list.innerHTML = hist.map(h => `
      <div class="hist-item">
        <div style="display:flex;align-items:center;gap:8px">
          <div class="hist-name">${h.name}</div>
          <span style="font-size:11px;font-weight:600;color:${vColors[h.verdict]||'#999'}">${h.verdict}</span>
        </div>
        <div class="hist-meta">${h.date} · ${expLabel[h.exp]||'—'} · ${h.strong} strong · ${h.exits} exits</div>
      </div>`).join('');
  }
  modal.classList.add('open');
}

function closeHistory() {
  document.getElementById('hist-modal').classList.remove('open');
}

// ── PDF EXPORT ────────────────────────────────────────────────────────────────

function generatePDF() {
  const name = S.candName || 'Candidate';
  const exp = { yes: 'Experienced', partial: 'Partial experience', no: 'No experience' }[S.hasExp] || 'Not assessed';
  const s = Object.values(S.ratings).filter(r => r === 'strong').length;
  const c = Object.values(S.ratings).filter(r => r === 'caution').length;
  const e = Object.values(S.ratings).filter(r => r === 'exit').length;
  const a = S.debriefAnswers;
  const gs = Object.values(a).filter(v => v === 'g').length;
  const rs = Object.values(a).filter(v => v === 'r').length;
  let gut = 'Pending';
  if (Object.keys(a).length >= 3) {
    if (rs >= 2) gut = 'Reject';
    else if (gs >= 4) gut = 'Move forward';
    else gut = '50/50 — second conversation';
  }
  const gutColor = { 'Move forward': '#3B6D11', 'Reject': '#A32D2D' }[gut] || '#BA7517';
  const ratedSteps = SCRIPT_DATA.steps.filter(st => st.rated);
  const ratingsHTML = ratedSteps.map(st => {
    const r = S.ratings[st.id];
    const n = S.notes[st.id];
    if (!r && !n) return '';
    const rColor = r === 'strong' ? '#3B6D11' : r === 'caution' ? '#BA7517' : '#A32D2D';
    return `<tr><td style="padding:7px 10px;font-size:13px;border-bottom:1px solid #eee;color:#333">${st.label}</td><td style="padding:7px 10px;font-size:13px;border-bottom:1px solid #eee;font-weight:600;color:${rColor}">${r ? r.charAt(0).toUpperCase() + r.slice(1) : '—'}</td><td style="padding:7px 10px;font-size:13px;border-bottom:1px solid #eee;color:#555">${n || ''}</td></tr>`;
  }).join('');
  const flagsHTML = S.flags.length ? S.flags.map(f => {
    const [bg, color] = f.color === 'green' ? ['#EAF3DE','#3B6D11'] : f.color === 'amber' ? ['#FAEEDA','#BA7517'] : ['#FCEBEB','#A32D2D'];
    const label = f.color === 'green' ? 'Green' : f.color === 'amber' ? 'Yellow' : 'Red';
    return `<span style="display:inline-block;padding:2px 9px;border-radius:10px;font-size:12px;margin:2px;background:${bg};color:${color}">${label} · ${f.step} · ${f.time}</span>`;
  }).join('') : '<span style="font-size:13px;color:#999">None</span>';
  const addNotes = Object.entries(S.notes).filter(([k, v]) => v && !ratedSteps.map(s => s.id).includes(k));
  const addNotesHTML = addNotes.length ? addNotes.map(([k, v]) => `<div style="margin-bottom:10px"><div style="font-size:11px;color:#888;margin-bottom:2px;text-transform:uppercase;letter-spacing:.05em">${k}</div><div style="font-size:13px;color:#333">${v}</div></div>`).join('') : '<div style="font-size:13px;color:#999">None</div>';
  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head><title>${name} — Interview Summary</title>
  <style>body{font-family:system-ui,sans-serif;color:#1a1a1a;padding:40px;max-width:700px;margin:0 auto}h1{font-size:22px;font-weight:700;margin-bottom:4px}h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#888;margin:24px 0 8px;border-bottom:1px solid #eee;padding-bottom:4px}table{width:100%;border-collapse:collapse}th{text-align:left;font-size:11px;color:#888;padding:6px 10px;background:#f9f9f9;border-bottom:1px solid #ddd;font-weight:600}@media print{.no-print{display:none}}</style></head><body>
  <h1>${name}</h1>
  <div style="font-size:13px;color:#888;margin-bottom:6px">${new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})} · Adjuster Specialist · ${exp} · Interviewed by ${S.user}</div>
  <h2>Quick flags</h2><div style="margin-bottom:4px">${flagsHTML}</div>
  <h2>Ratings & notes</h2>
  <table><tr><th>Section</th><th>Rating</th><th>Notes</th></tr>${ratingsHTML}</table>
  <h2>Score summary</h2>
  <div style="display:flex;gap:10px;margin-bottom:8px;flex-wrap:wrap">
    <div style="background:#EAF3DE;color:#3B6D11;padding:7px 14px;border-radius:7px;font-size:13px;font-weight:600">Strong: ${s}</div>
    <div style="background:#FAEEDA;color:#BA7517;padding:7px 14px;border-radius:7px;font-size:13px;font-weight:600">Caution: ${c}</div>
    <div style="background:#FCEBEB;color:#A32D2D;padding:7px 14px;border-radius:7px;font-size:13px;font-weight:600">Exit: ${e}</div>
  </div>
  <h2>Gut verdict</h2>
  <div style="font-size:18px;font-weight:700;color:${gutColor};margin-bottom:4px">${gut}</div>
  <h2>Additional notes</h2>${addNotesHTML}
  <div style="margin-top:36px;text-align:center" class="no-print"><button onclick="window.print()" style="padding:9px 22px;background:#1a1a1a;color:white;border:none;border-radius:7px;font-size:13px;cursor:pointer;font-weight:500">Print / Save as PDF</button></div>
  </body></html>`);
  w.document.close();
}

// ── NAVIGATION ────────────────────────────────────────────────────────────────

function renderSidebar() {
  const steps = SCRIPT_DATA.steps;
  const secs = {};
  steps.forEach((s, i) => { if (!secs[s.section]) secs[s.section] = []; secs[s.section].push({ ...s, idx: i }); });
  let html = '';
  for (const [sec, items] of Object.entries(secs)) {
    html += `<div class="sb-sec">${sec}</div>`;
    items.forEach(item => {
      const done = item.idx < S.current, active = item.idx === S.current;
      const r = S.ratings[item.id];
      const rColor = r === 'strong' ? '#3B6D11' : r === 'caution' ? '#BA7517' : '#A32D2D';
      let cls = done ? 'done' : ''; if (active) cls = 'active';
      html += `<div class="sb-item ${cls}" onclick="goTo(${item.idx})"><span class="sb-dot"></span><span style="flex:1">${item.label}</span>${r ? `<span class="sb-rating" style="color:${rColor}">${r === 'strong' ? '✓' : r === 'caution' ? '~' : '✗'}</span>` : ''}</div>`;
    });
    html += `<div class="sb-divider"></div>`;
  }
  document.getElementById('sidebar').innerHTML = html;
}

function renderStep() {
  const steps = SCRIPT_DATA.steps;
  const step = steps[S.current];
  document.getElementById('prog-fill').style.width = Math.round((S.current / (steps.length - 1)) * 100) + '%';
  const secLabels = { 'Fast filter': 'Fast filter', 'Vetting': 'Vetting', 'Close': 'Close', 'Debrief': 'Debrief' };
  const sa = document.getElementById('scroll-area');
  sa.innerHTML = `
    <div class="step-eye">${secLabels[step.section] || step.section} · ${S.current + 1} of ${steps.length}</div>
    <div class="step-title">${step.label}</div>
    ${renderStepContent(step)}
    <div class="nav-row">
      ${S.current > 0 ? `<button class="btn-sec" onclick="goTo(${S.current - 1})">← Back</button>` : ''}
      ${S.current < steps.length - 1 ? `<button class="btn-primary" onclick="goTo(${S.current + 1})">Next →</button>` : `<button class="btn-primary" style="background:var(--green)">Done</button>`}
    </div><div style="height:40px"></div>`;
  renderSidebar();
  sa.scrollTop = 0;
}

function goTo(idx) { S.current = idx; saveSession(); renderStep(); }

// ── INIT ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // User buttons
  SCRIPT_DATA.users.forEach(u => {
    const btn = document.createElement('button');
    btn.className = 'user-btn';
    btn.textContent = u;
    btn.onclick = () => login(u);
    document.getElementById('user-btns').appendChild(btn);
  });

  // New interview button
  document.getElementById('new-interview-btn').onclick = () => {
    if (confirm('Start a new interview? Current session will be saved to history if you\'ve entered a name.')) {
      if (S.candName) saveCandidate();
      newSession();
    }
  };

  // Candidate name
  document.getElementById('cand-name').addEventListener('input', function () {
    S.candName = this.value;
    saveSession();
    renderStep();
  });

  // Flag buttons
  document.querySelectorAll('.flag-btn').forEach(btn => {
    btn.addEventListener('click', () => addFlag(btn.dataset.color));
  });

  // Auto-login if returning user
  const last = localStorage.getItem('proliance_lastUser');
  if (last && SCRIPT_DATA.users.includes(last)) login(last);
});
