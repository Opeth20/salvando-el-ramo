import {
  firebaseEnabled, watchAuth, loginGoogle, loginEmail, registerEmail, resetPassword,
  loginGuest, logout, authErrorMessage, loadProgress, saveProgress, emptyProgress,
} from './backend.js';
import { COURSES, UPCOMING, PALETTE } from './courses.js';
import { esc } from './code.js';
import { mascot, play, setSound } from './fx.js';
import { theoryHtml, toast, openModal } from './ui.js';
import { runLesson } from './lesson.js';
import { planInfo, countdownHtml, coachHtml, openMission, missionDone, renderPlan } from './plan.js';

const $app = document.getElementById('app');

const state = {
  user: null,
  progress: null,
  view: 'learn',
  courseId: 'poo',
  popover: null, // level id with open popover
};

/* ---------------- Utilities ---------------- */

function today(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const course = () => COURSES.find((c) => c.id === state.courseId) || COURSES[0];
const lv = (id) => state.progress.levels[id] || null;
const colorOf = (name) => PALETTE[name] || PALETTE.green;

function currentStreak() {
  const p = state.progress;
  if (p.lastDay === today() || p.lastDay === today(-1)) return p.streak;
  return 0;
}
function dailyXp() {
  const p = state.progress;
  return p.daily && p.daily.day === today() ? p.daily.xp : 0;
}

function levelStatus(crs, level) {
  if (lv(level.id)?.done) return 'done';
  const idx = crs.levels.indexOf(level);
  if (idx === 0) return 'open';
  // Special units (like the Prueba 1 method) can be started any time; inside them, levels go in order.
  if (level.unit.key) return level.index === 0 || lv(level.unit.levels[level.index - 1].id)?.done ? 'open' : 'locked';
  const prev = crs.levels[idx - 1];
  if (prev.unit.key) {
    // After a special unit you need both: that unit finished and the previous regular level done.
    const prevRegular = crs.levels.slice(0, idx).reverse().find((l) => !l.unit.key);
    return lv(prev.id)?.done && (!prevRegular || lv(prevRegular.id)?.done) ? 'open' : 'locked';
  }
  return lv(crs.levels[idx - 1].id)?.done ? 'open' : 'locked';
}

function unitDone(u) {
  return u.levels.every((l) => lv(l.id)?.done);
}

function save() {
  saveProgress(state.user, state.progress);
}

/** What plan.js needs from the app. */
const ctx = {
  state,
  course: () => course(),
  today: () => today(),
  save: () => save(),
  awardXp: (xp) => awardXp(xp),
  recordAnswers: (r) => recordAnswers(r),
  rerender: () => renderShell(),
  openGuide: (u) => openGuide(u),
  goToUnit: (u) => {
    state.view = 'learn';
    state.popover = null;
    renderPath.scrolled = true;
    renderShell();
    setTimeout(() => document.getElementById(u.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  },
};

/** The unit the student is working on now (first one with an open level). */
function currentUnit(crs) {
  const open = crs.levels.find((l) => levelStatus(crs, l) === 'open');
  return open ? open.unit : crs.units[crs.units.length - 1];
}

/* ---------------- Login ---------------- */

function googleIcon() {
  return '<svg class="google-ico" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
}

function renderLogin(mode = 'login') {
  const reg = mode === 'register';
  $app.innerHTML = `
  <div class="login">
    <div class="login-hero">
      ${mascot('happy')}
      <h1>Salvando el Ramo</h1>
      <p>Aprende Desarrollo Orientado a Objetos <b>escribiendo código</b>, nivel por nivel. Sin alternativas, sin trampa. 💪</p>
    </div>
    <form class="login-card" id="login-form" novalidate>
      <h2>${reg ? 'Crea tu cuenta' : 'Inicia sesión'}</h2>
      ${firebaseEnabled ? `
        <button type="button" class="btn ghost gray block" id="google-btn">${googleIcon()} Continuar con Google</button>
        <div class="divider">o con tu correo</div>
        ${reg ? '<input class="field" id="f-name" placeholder="Tu nombre" autocomplete="name">' : ''}
        <input class="field" id="f-email" type="email" placeholder="Correo" autocomplete="email" required>
        <input class="field" id="f-pass" type="password" placeholder="Contraseña" autocomplete="${reg ? 'new-password' : 'current-password'}" required>
        <div class="login-error" id="login-error"></div>
        <button class="btn block" type="submit">${reg ? 'Crear cuenta' : 'Entrar'}</button>
        <div style="display:flex;justify-content:space-between;flex-wrap:wrap">
          <button type="button" class="link-btn" id="swap-mode">${reg ? 'Ya tengo cuenta' : 'Crear cuenta'}</button>
          ${reg ? '' : '<button type="button" class="link-btn" id="forgot">¿Olvidaste tu clave?</button>'}
        </div>
        <div class="divider">o</div>
      ` : `
        <p style="margin:0;color:var(--text-soft);text-align:center;font-size:15px">Tu progreso se guarda en este navegador. Para seguir en otro dispositivo usa <b>Perfil → Respaldo</b>.</p>
        <input class="field" id="f-guest" placeholder="¿Cómo te llamas?" autocomplete="nickname">
      `}
      <button type="button" class="btn ${firebaseEnabled ? 'ghost' : ''} block" id="guest-btn">${firebaseEnabled ? 'Probar sin cuenta' : 'Empezar'}</button>
      ${firebaseEnabled ? '' : '<button type="button" class="link-btn" id="restore-btn">Tengo un código de respaldo</button>'}
    </form>
  </div>`;

  const err = (m) => { const e = document.getElementById('login-error'); if (e) e.textContent = m; };
  const guestBtn = document.getElementById('guest-btn');
  guestBtn.onclick = () => {
    const name = document.getElementById('f-guest')?.value.trim();
    onUser(loginGuest(name || 'Estudiante'));
  };
  document.getElementById('f-guest')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); guestBtn.click(); }
  });
  const restoreBtn = document.getElementById('restore-btn');
  if (restoreBtn) restoreBtn.onclick = () => openRestore();
  if (!firebaseEnabled) return;

  document.getElementById('google-btn').onclick = async () => {
    try { await loginGoogle(); } catch (e) { err(authErrorMessage(e)); }
  };
  document.getElementById('swap-mode').onclick = () => renderLogin(reg ? 'login' : 'register');
  const forgot = document.getElementById('forgot');
  if (forgot) forgot.onclick = async () => {
    const email = document.getElementById('f-email').value.trim();
    if (!email) return err('Escribe tu correo y vuelve a presionar.');
    try { await resetPassword(email); err(''); toast('Te enviamos un correo para recuperar tu clave 📬'); } catch (e) { err(authErrorMessage(e)); }
  };
  document.getElementById('login-form').onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('f-email').value.trim();
    const pass = document.getElementById('f-pass').value;
    const btn = e.target.querySelector('button[type=submit]');
    btn.disabled = true;
    try {
      if (reg) await registerEmail(document.getElementById('f-name').value.trim(), email, pass);
      else await loginEmail(email, pass);
    } catch (ex) {
      err(authErrorMessage(ex));
      btn.disabled = false;
    }
  };
}

/* ---------------- Shell ---------------- */

const NAV = [
  { id: 'learn', ico: '🏠', label: 'Aprender' },
  { id: 'plan', ico: '📅', label: 'Plan' },
  { id: 'review', ico: '🏋️', label: 'Repaso' },
  { id: 'subjects', ico: '📚', label: 'Ramos' },
  { id: 'profile', ico: '👤', label: 'Perfil' },
];

function statsHtml() {
  const streak = currentStreak();
  const crs = course();
  return `
    <button class="stat subject" data-nav="subjects" title="Cambiar ramo">${crs.icon} ${esc(crs.short)}</button>
    <span class="stat streak ${streak ? '' : 'dim'}" title="Racha de días"><span class="ico">🔥</span>${streak}</span>
    <span class="stat xp" title="Experiencia total"><span class="ico">⚡</span>${state.progress.xp}</span>`;
}

function renderShell() {
  const navHtml = (cls) => NAV.map((n) => `
    <button class="nav-item ${state.view === n.id ? 'active' : ''}" data-nav="${n.id}" aria-label="${n.label}" title="${n.label}">
      <span class="ico">${n.ico}</span><span class="lbl">${n.label}</span>
    </button>`).join('');

  $app.innerHTML = `
  <div class="shell">
    <aside class="sidebar">
      <div class="brand">☕ <span>salvando</span></div>
      ${navHtml()}
      <div class="spacer"></div>
    </aside>
    <div>
      <div class="mobile-top">${statsHtml()}</div>
      <main class="main" id="main"></main>
    </div>
    <aside class="rightbar" id="rightbar"></aside>
  </div>
  <nav class="bottom-nav">${navHtml()}</nav>`;

  $app.querySelectorAll('[data-nav]').forEach((b) => {
    b.onclick = () => navigate(b.dataset.nav);
  });
  renderMain();
  renderRightbar();
}

function navigate(view) {
  play('tap');
  if (view === 'review') { startReview(); return; }
  state.view = view;
  state.popover = null;
  renderShell();
  window.scrollTo({ top: 0 });
}

function renderRightbar() {
  const rb = document.getElementById('rightbar');
  if (!rb) return;
  const p = state.progress;
  const goal = p.dailyGoal || 30;
  const dxp = dailyXp();
  const crs = course();
  const next = crs.levels.find((l) => levelStatus(crs, l) === 'open');
  const doneCount = crs.levels.filter((l) => lv(l.id)?.done).length;
  rb.innerHTML = `
    <div class="topstats">${statsHtml()}</div>
    <div class="panel">
      <h3>Meta diaria <span style="font-size:22px">${dxp >= goal ? '🏆' : '🎯'}</span></h3>
      <div class="goal-row">
        <span class="ico">⚡</span>
        <div style="flex:1"><div class="bar"><span style="width:${Math.min(100, (dxp / goal) * 100)}%"></span></div>
        <div class="bar-label">${dxp} / ${goal} XP hoy</div></div>
      </div>
    </div>
    <div class="panel">
      <h3>Tu avance</h3>
      <div class="goal-row">
        <span class="ico">${crs.icon}</span>
        <div style="flex:1"><div class="bar"><span style="width:${(doneCount / crs.levels.length) * 100}%;background:var(--green)"></span></div>
        <div class="bar-label">${doneCount} de ${crs.levels.length} niveles</div></div>
      </div>
      ${next ? `<p style="margin-top:12px">Siguiente: <b>${esc(next.unit.title)}</b> · ${esc(next.title)}</p>` : '<p style="margin-top:12px">¡Terminaste todo! Usa el repaso para no oxidarte.</p>'}
    </div>
    ${coachPanelHtml(crs)}
    ${state.user.local ? `<div class="panel"><h3>Tu progreso 💾</h3><p>Se guarda en este navegador. ${firebaseEnabled ? 'Crea una cuenta para guardarlo en la nube.' : 'Para pasarlo al celular u otro PC, usa <b>Perfil → Respaldo</b>.'}</p></div>` : ''}`;
  rb.querySelectorAll('[data-nav]').forEach((b) => { b.onclick = () => navigate(b.dataset.nav); });
  bindUnitActions(rb, crs);
}

function coachPanelHtml(crs) {
  const u = currentUnit(crs);
  if (!u || !u.coach) return '';
  const info = planInfo(crs, state.progress, today());
  const todayList = info && info.todayItems.length
    ? `<p style="margin:10px 0 4px"><b>Tu tarea de hoy:</b></p><ul style="margin:0;padding-left:18px;font-size:14px">${info.todayItems.map((it) => `<li>${esc(it.label)}</li>`).join('')}</ul>`
    : '';
  return `<div class="panel">
    <h3>Javi te guía <span style="font-size:13px;color:var(--text-soft)">${esc(u.label)}</span></h3>
    ${coachHtml(u)}
    ${todayList}
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">
      <button class="btn ghost small" data-guide="${u.index}">📖 Guía</button>
      ${u.mision ? `<button class="btn ghost small" data-mission="${u.index}">🧪 Misión real</button>` : ''}
    </div>
  </div>`;
}

function bindUnitActions(rootEl, crs) {
  rootEl.querySelectorAll('[data-guide]').forEach((b) => {
    b.onclick = (e) => { e.stopPropagation(); openGuide(crs.units[+b.dataset.guide]); };
  });
  rootEl.querySelectorAll('[data-mission]').forEach((b) => {
    b.onclick = (e) => { e.stopPropagation(); state.popover = null; openMission(crs.units[+b.dataset.mission], ctx); };
  });
}

function renderMain() {
  const main = document.getElementById('main');
  if (state.view === 'subjects') return renderSubjects(main);
  if (state.view === 'profile') return renderProfile(main);
  if (state.view === 'plan') return renderPlan(main, ctx);
  return renderPath(main);
}

/* ---------------- Learning path ---------------- */

function renderPath(main) {
  const crs = course();
  const firstOpen = crs.levels.find((l) => levelStatus(crs, l) === 'open');
  const info = planInfo(crs, state.progress, today());
  main.innerHTML = `${countdownHtml(info)}<div class="path-wrap">${crs.units.map((u, ui) => unitHtml(crs, u, ui, firstOpen)).join('')}</div>`;
  const cd = main.querySelector('.countdown');
  if (cd) cd.onclick = (e) => { e.stopPropagation(); navigate('plan'); };

  main.querySelectorAll('.node').forEach((n) => {
    n.onclick = (e) => {
      e.stopPropagation();
      play('tap');
      state.popover = state.popover === n.dataset.level ? null : n.dataset.level;
      renderPath(main);
    };
  });
  main.querySelectorAll('[data-start]').forEach((b) => {
    b.onclick = (e) => {
      e.stopPropagation();
      const level = crs.levels.find((l) => l.id === b.dataset.start);
      state.popover = null;
      startLevel(level);
    };
  });
  bindUnitActions(main, crs);
  main.querySelectorAll('[data-jump]').forEach((b) => {
    b.onclick = () => startJump(crs, +b.dataset.jump);
  });
  main.onclick = () => { if (state.popover) { state.popover = null; renderPath(main); } };

  const target = main.querySelector('.popover') || main.querySelector('.node.current');
  if (target && !renderPath.scrolled) {
    renderPath.scrolled = true;
    setTimeout(() => target.scrollIntoView({ block: 'center', behavior: 'smooth' }), 80);
  }
}

function unitHtml(crs, u, ui, firstOpen) {
  const [cMain, cDark] = colorOf(u.color);
  const locked = u.levels.every((l) => levelStatus(crs, l) === 'locked');
  const offsets = [0, -52, -78, -52, 0, 52, 78, 52];
  const flip = ui % 2 ? -1 : 1;
  const nodes = u.levels.map((l, li) => {
    const st = levelStatus(crs, l);
    const isCurrent = firstOpen && firstOpen.id === l.id;
    const stars = lv(l.id)?.stars || 0;
    const x = offsets[li % offsets.length] * flip;
    const ico = st === 'done' ? (l.boss ? '🏆' : '<span class="check">✓</span>') : st === 'locked' ? (l.boss ? '🏆' : '🔒') : l.icon;
    const pop = state.popover === l.id ? popoverHtml(crs, l, st, cMain) : '';
    const [nc, ncd] = st === 'done' ? PALETTE.yellow : [cMain, cDark];
    return `
      <div class="node-wrap ${pop ? 'open' : ''} ${isCurrent ? 'is-current' : ''}" style="transform:translateX(${x}px)">
        ${isCurrent && !pop ? '<div class="start-bubble">Empezar</div>' : ''}
        <button class="node ${st === 'locked' ? 'locked' : ''} ${st === 'done' ? 'done' : ''} ${isCurrent ? 'current' : ''} ${l.boss ? 'boss' : ''}"
          style="--nc:${nc};--ncd:${ncd}" data-level="${l.id}" aria-label="${esc(l.title)}">
          <span class="node-ico">${ico}</span>
        </button>
        <div class="node-stars">${st === 'done' ? [1, 2, 3].map((i) => `<span class="${i <= stars ? '' : 'off'}">⭐</span>`).join('') : ''}</div>
        ${pop}
      </div>`;
  }).join('') + missionNodeHtml(u, offsets[u.levels.length % offsets.length] * flip);
  const mascotSide = ui % 2 ? 'left:6%' : 'right:6%';
  return `
  <section class="unit" id="${u.id}">
    <div class="unit-banner" style="--uc:${cMain};--ucd:${cDark}">
      <div>
        <div class="kicker">${esc(u.label)}${unitDone(u) ? ' · ✔ completada' : ''}</div>
        <h2>${esc(u.title)}</h2>
        <div class="desc">${esc(u.desc)}</div>
      </div>
      <div class="unit-actions">
        <button class="unit-btn" data-guide="${ui}">📖 Guía</button>
        ${locked && ui > 0 ? `<button class="unit-btn" data-jump="${ui}">⏩ Saltar aquí</button>` : ''}
      </div>
    </div>
    <div class="path" style="--uc:${cMain}">
      ${nodes}
      <div class="path-mascot" style="top:38%;${mascotSide}">${mascot(locked ? 'think' : 'happy')}</div>
    </div>
  </section>`;
}

function missionNodeHtml(u, x) {
  if (!u.mision) return '';
  const id = u.mision.id;
  const done = missionDone(state.progress, u);
  const open = unitDone(u);
  const st = done ? 'done' : open ? 'open' : 'locked';
  const pop = state.popover === id
    ? `<div class="popover ${st === 'locked' ? 'locked' : ''}" style="--uc:#8b5cf6">
        <h4>🧪 ${esc(u.mision.title)}</h4>
        <p>Misión en IntelliJ · +30 XP. ${st === 'locked' ? 'Se desbloquea al terminar los niveles de la unidad, pero puedes verla desde ya.' : 'Programa esto en un IDE real y valida tu salida aquí.'}</p>
        <button class="btn" data-mission="${u.index}">${done ? 'Ver de nuevo' : 'Abrir misión'}</button>
      </div>`
    : '';
  return `
    <div class="node-wrap ${pop ? 'open' : ''}" style="transform:translateX(${x}px)">
      <button class="node mission ${st === 'locked' ? 'locked' : ''} ${st === 'done' ? 'done' : ''}" data-level="${id}" aria-label="Misión real: ${esc(u.mision.title)}">
        <span class="node-ico">${done ? '<span class="check">✓</span>' : '🧪'}</span>
      </button>
      <div class="node-stars" style="font-size:12px;color:var(--text-soft);font-weight:800">MISIÓN</div>
      ${pop}
    </div>`;
}

function popoverHtml(crs, l, st, color) {
  const exercises = l.steps.filter((s) => s.t !== 'teoria').length;
  const pos = `Nivel ${l.index + 1} de ${l.unit.levels.length}`;
  if (st === 'locked') {
    return `<div class="popover locked"><h4>${esc(l.title)}</h4><p>${pos}. Completa los niveles anteriores para desbloquearlo.</p>
      <button class="btn" disabled>🔒 Bloqueado</button></div>`;
  }
  const done = st === 'done';
  return `<div class="popover" style="--uc:${color}">
    <h4>${esc(l.title)}</h4>
    <p>${pos} · ${exercises} ejercicios${done ? ` · mejor: ${'⭐'.repeat(lv(l.id).stars)}` : ''}</p>
    <button class="btn" data-start="${l.id}">${done ? 'Repasar +5 XP' : `Empezar +${l.boss ? 20 : 10} XP`}</button>
  </div>`;
}

function openGuide(u) {
  const items = u.levels.flatMap((l) => l.steps.filter((s) => s.t === 'teoria').map((s) => ({ s, l })));
  const m = openModal(`
    <h2>📖 Guía: ${esc(u.title)}</h2>
    <p style="color:var(--text-soft);margin:0 0 14px">Resumen de los conceptos de esta unidad. ¡Úsala como torpedo! 😉</p>
    ${u.coach ? `<div class="panel">${coachHtml(u)}${u.mision ? `<div style="margin-top:10px"><button class="btn ghost small" data-gm>🧪 Misión real: ${esc(u.mision.title)}</button></div>` : ''}</div>` : ''}
    ${items.map(({ s, l }) => `<div class="guide-item"><h3>${esc(l.title)} — ${esc(s.title)}</h3><div class="theory">${theoryHtml(s)}</div></div>`).join('')}
  `);
  const gm = m.el.querySelector('[data-gm]');
  if (gm) gm.onclick = () => { m.close(); openMission(u, ctx); };
}

/* ---------------- Subjects ---------------- */

function renderSubjects(main) {
  main.innerHTML = `
    <h1 class="page-title">Mis ramos</h1>
    <p class="page-sub">Segundo semestre · empezamos por POO y vamos sumando.</p>
    <div class="subjects">
      ${COURSES.map((c) => {
        const done = c.levels.filter((l) => lv(l.id)?.done).length;
        return `<button class="subject-card" data-course="${c.id}">
          <div class="cover" style="background:${colorOf(c.color)[0]}">${c.icon}</div>
          <div class="body"><div class="code">${c.code}</div><h3>${esc(c.name)}</h3>
          <span class="pill green">${done} / ${c.levels.length} niveles</span></div></button>`;
      }).join('')}
      ${UPCOMING.map((c) => `<div class="subject-card soon">
          <div class="cover" style="background:${colorOf(c.color)[0]}">${c.icon}</div>
          <div class="body"><div class="code">${c.code}</div><h3>${esc(c.name)}</h3><span class="pill">Próximamente</span></div></div>`).join('')}
    </div>`;
  main.querySelectorAll('[data-course]').forEach((b) => {
    b.onclick = () => { state.courseId = b.dataset.course; navigate('learn'); };
  });
}

/* ---------------- Profile ---------------- */

const BADGES = [
  { id: 'first', ico: '🌱', name: 'Primer código', desc: 'Completa tu primer nivel', test: (p) => p.stats.lessons >= 1 },
  { id: 'perfect', ico: '💎', name: 'Impecable', desc: 'Un nivel sin errores', test: (p) => p.stats.perfect >= 1 },
  { id: 'streak3', ico: '🔥', name: 'En racha', desc: '3 días seguidos', test: (p) => (p.maxStreak || p.streak) >= 3 },
  { id: 'xp100', ico: '⚡', name: '100 XP', desc: 'Junta 100 XP', test: (p) => p.xp >= 100 },
  { id: 'xp500', ico: '🚀', name: '500 XP', desc: 'Junta 500 XP', test: (p) => p.xp >= 500 },
  { id: 'u4', ico: '🔒', name: 'Encapsulador', desc: 'Termina la unidad 4', test: () => unitDone(course().units[3]) },
  { id: 'u6', ico: '🧬', name: 'Heredero', desc: 'Termina la unidad 6', test: () => unitDone(course().units[5]) },
  { id: 'u8', ico: '🗂️', name: 'Rey del Gestor', desc: 'Termina la unidad 8', test: () => unitDone(course().units[7]) },
  { id: 'u10', ico: '🧩', name: 'MVC Master', desc: 'Termina la unidad 10', test: () => unitDone(course().units[9]) },
  { id: 'u12', ico: '🛡️', name: 'SQL sin miedo', desc: 'Termina la unidad 12', test: () => unitDone(course().units[11]) },
  { id: 'review', ico: '🏋️', name: 'Constante', desc: 'Haz un repaso', test: (p) => (p.stats.reviews || 0) >= 1 },
  { id: 'mision1', ico: '🧪', name: 'Programador real', desc: 'Completa una misión en IntelliJ', test: (p) => Object.keys(p.missions || {}).length >= 1 },
  { id: 'mision5', ico: '👩‍💻', name: 'Manos al teclado', desc: 'Completa 5 misiones', test: (p) => Object.keys(p.missions || {}).length >= 5 },
  { id: 'sim4', ico: '📝', name: 'Aprobado', desc: 'Saca 4.0 o más en un simulacro', test: (p) => (p.simulacros || []).some((s) => s.grade >= 4) },
  { id: 'sim6', ico: '🎓', name: 'Listo para la prueba', desc: 'Saca 6.0 o más en un simulacro', test: (p) => (p.simulacros || []).some((s) => s.grade >= 6) },
];

function renderProfile(main) {
  const p = state.progress;
  const u = state.user;
  const acc = p.stats.exercises ? Math.round((p.stats.correct / p.stats.exercises) * 100) : 0;
  const initial = esc((u.name || '?').trim().charAt(0).toUpperCase());
  main.innerHTML = `
    <div class="profile-head">
      <div class="avatar">${u.photo ? `<img src="${esc(u.photo)}" alt="">` : initial}</div>
      <div>
        <h1 class="page-title" style="margin:0">${esc(u.name || 'Estudiante')}</h1>
        <p class="page-sub" style="margin:2px 0 8px">${u.email ? esc(u.email) : 'Sin cuenta'}</p>
        ${u.local ? '<span class="pill">Guardado en este navegador</span>' : '<span class="pill green">Sincronizado con Firebase</span>'}
      </div>
    </div>
    <h2 style="margin-bottom:12px">Estadísticas</h2>
    <div class="stats-grid">
      <div class="stat-card"><span class="ico">🔥</span><div><b>${currentStreak()}</b><span>Racha de días</span></div></div>
      <div class="stat-card"><span class="ico">⚡</span><div><b>${p.xp}</b><span>XP total</span></div></div>
      <div class="stat-card"><span class="ico">✅</span><div><b>${p.stats.lessons}</b><span>Niveles completados</span></div></div>
      <div class="stat-card"><span class="ico">🎯</span><div><b>${acc}%</b><span>Precisión</span></div></div>
    </div>
    <h2 style="margin-bottom:12px">Logros</h2>
    <div class="badges">${BADGES.map((b) => `<div class="badge ${b.test(p) ? '' : 'off'}"><div class="ico">${b.ico}</div><b>${b.name}</b><span>${b.desc}</span></div>`).join('')}</div>
    <h2 style="margin:26px 0 4px">Ajustes</h2>
    <div class="settings-row"><span>🔊 Sonidos</span><button class="toggle ${p.sound ? 'on' : ''}" id="t-sound" aria-label="Sonidos"></button></div>
    <div class="settings-row"><span>🎯 Meta diaria</span>
      <div style="display:flex;gap:6px;flex-wrap:wrap">${[10, 20, 30, 50].map((g) => `<button class="chip" data-goal="${g}" style="${(p.dailyGoal || 30) === g ? 'border-color:var(--blue);color:var(--blue)' : ''}">${g} XP</button>`).join('')}</div></div>
    <div class="settings-row"><span>🌓 Tema</span>
      <div style="display:flex;gap:6px">${[['auto', 'Auto'], ['light', 'Claro'], ['dark', 'Oscuro']].map(([k, t]) => `<button class="chip" data-theme="${k}" style="${(getTheme() === k) ? 'border-color:var(--blue);color:var(--blue)' : ''}">${t}</button>`).join('')}</div></div>
    <h2 style="margin:26px 0 4px">💾 Respaldo</h2>
    <p class="page-sub" style="margin:0 0 12px;font-size:15px">Guarda tu avance o pásalo a otro dispositivo: copia el código y pégalo allá en <b>Restaurar</b>.</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn blue small" id="bk-copy">Copiar código</button>
      <button class="btn ghost small" id="bk-file">Descargar archivo</button>
      <button class="btn ghost small" id="bk-restore">Restaurar</button>
    </div>
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:26px">
      <button class="btn ghost gray" id="logout">Cerrar sesión</button>
      <button class="btn ghost gray" id="reset" style="--fg:var(--red)">Reiniciar progreso</button>
    </div>`;

  document.getElementById('t-sound').onclick = () => {
    p.sound = !p.sound; setSound(p.sound); save(); renderProfile(main);
  };
  main.querySelectorAll('[data-goal]').forEach((b) => {
    b.onclick = () => { p.dailyGoal = +b.dataset.goal; save(); renderProfile(main); renderRightbar(); };
  });
  main.querySelectorAll('[data-theme]').forEach((b) => {
    b.onclick = () => { setTheme(b.dataset.theme); renderProfile(main); };
  });
  document.getElementById('bk-copy').onclick = async () => {
    const code = backupCode();
    try {
      await navigator.clipboard.writeText(code);
      toast('Código copiado 📋 Pégalo en el otro dispositivo');
    } catch {
      const m = openModal(`<h2>Tu código de respaldo</h2><p style="color:var(--text-soft)">Cópialo completo:</p>
        <textarea class="answer-box" readonly style="min-height:160px">${esc(code)}</textarea>`);
      const ta = m.el.querySelector('textarea'); ta.focus(); ta.select();
    }
  };
  document.getElementById('bk-file').onclick = () => {
    const blob = new Blob([backupCode()], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `salvando-el-ramo-${today()}.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  document.getElementById('bk-restore').onclick = () => openRestore();
  document.getElementById('logout').onclick = async () => {
    await logout();
    state.user = null;
    renderLogin();
  };
  document.getElementById('reset').onclick = () => {
    const m = openModal(`<h2>¿Reiniciar todo?</h2><p style="color:var(--text-soft)">Se borrarán tu XP, racha y niveles completados. No se puede deshacer.</p>
      <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:18px"><button class="btn ghost gray" data-no>Cancelar</button><button class="btn red" data-yes>Reiniciar</button></div>`);
    m.el.querySelector('[data-no]').onclick = m.close;
    m.el.querySelector('[data-yes]').onclick = () => {
      state.progress = { ...emptyProgress(), sound: p.sound, dailyGoal: p.dailyGoal };
      save(); m.close(); toast('Progreso reiniciado'); navigate('learn');
    };
  };
}

/* ---------------- Backup ---------------- */

const BACKUP_PREFIX = 'SER1:';

function backupCode() {
  const json = JSON.stringify({ name: state.user.name, progress: state.progress });
  return BACKUP_PREFIX + btoa(unescape(encodeURIComponent(json)));
}

function parseBackup(text) {
  const raw = String(text || '').trim().replace(/\s+/g, '');
  if (!raw.startsWith(BACKUP_PREFIX)) throw new Error('El código debe empezar con SER1:');
  const data = JSON.parse(decodeURIComponent(escape(atob(raw.slice(BACKUP_PREFIX.length)))));
  if (!data || typeof data.progress !== 'object' || typeof data.progress.levels !== 'object') throw new Error('El código no tiene un progreso válido.');
  return data;
}

function openRestore() {
  const m = openModal(`
    <h2>Restaurar progreso</h2>
    <p style="color:var(--text-soft)">Pega tu código de respaldo (empieza con <code>SER1:</code>) o elige el archivo que descargaste.</p>
    <textarea class="answer-box" id="rs-code" placeholder="SER1:..." spellcheck="false"></textarea>
    <input type="file" id="rs-file" accept=".txt,text/plain" style="margin:10px 0;font-size:14px">
    <div class="login-error" id="rs-err" style="text-align:left"></div>
    <p style="color:var(--text-soft);font-size:14px">⚠️ Esto reemplaza el progreso que tengas en este navegador.</p>
    <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:12px">
      <button class="btn ghost gray" data-no>Cancelar</button><button class="btn" data-yes>Restaurar</button>
    </div>`);
  const ta = m.el.querySelector('#rs-code');
  m.el.querySelector('#rs-file').onchange = async (e) => {
    const f = e.target.files[0];
    if (f) ta.value = (await f.text()).trim();
  };
  m.el.querySelector('[data-no]').onclick = m.close;
  m.el.querySelector('[data-yes]').onclick = async () => {
    let data;
    try { data = parseBackup(ta.value); } catch (ex) {
      m.el.querySelector('#rs-err').textContent = ex.message.startsWith('El código') ? ex.message : 'Código inválido o incompleto. Cópialo de nuevo completo.';
      return;
    }
    m.close();
    const user = state.user || loginGuest(data.name || 'Estudiante');
    saveProgress(user, { ...emptyProgress(), ...data.progress });
    toast('¡Progreso restaurado! 🎉');
    await onUser(user);
  };
}

function getTheme() {
  try { return localStorage.getItem('ser.theme') || 'auto'; } catch { return 'auto'; }
}
function setTheme(t) {
  try { localStorage.setItem('ser.theme', t); } catch { /* ignore */ }
  applyTheme();
}
function applyTheme() {
  const t = getTheme();
  if (t === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
}

/* ---------------- Lessons ---------------- */

function shuffle(a) {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function awardXp(xp) {
  const p = state.progress;
  const t = today();
  p.xp += xp;
  if (!p.daily || p.daily.day !== t) p.daily = { day: t, xp: 0 };
  p.daily.xp += xp;
  if (p.lastDay !== t) {
    p.streak = p.lastDay === today(-1) ? p.streak + 1 : 1;
    p.lastDay = t;
  }
  p.maxStreak = Math.max(p.maxStreak || 0, p.streak);
}

function recordAnswers(r) {
  const s = state.progress.stats;
  s.exercises += r.answered;
  s.correct += r.firstTry;
}

function startLevel(level) {
  const replay = !!lv(level.id)?.done;
  runLesson({
    title: level.title,
    color: colorOf(level.unit.color),
    steps: level.steps,
    hearts: 5,
    onFinish: (r) => {
      recordAnswers(r);
      if (!r.passed) { save(); return null; }
      // Every 2 hints count like one mistake for the stars.
      const slips = r.mistakes + Math.floor(r.hints / 2);
      const perfect = r.mistakes === 0 && r.hints === 0;
      const stars = slips === 0 ? 3 : slips <= 2 ? 2 : 1;
      const xp = replay ? 5 : (level.boss ? 20 : 10) + (perfect ? 5 : 0);
      const prev = lv(level.id) || {};
      state.progress.levels[level.id] = {
        done: true,
        stars: Math.max(prev.stars || 0, stars),
        times: (prev.times || 0) + 1,
        at: prev.at || today(),
      };
      if (!replay) state.progress.stats.lessons += 1;
      if (perfect) state.progress.stats.perfect += 1;
      awardXp(xp);
      save();
      const u = level.unit;
      const unlockedMission = !replay && u.mision && unitDone(u) && !missionDone(state.progress, u);
      return {
        xp,
        stars,
        extraHtml: unlockedMission
          ? `<div class="panel" style="width:100%;text-align:left;border-color:#8b5cf6">
              <h3 style="margin-bottom:6px">🧪 ¡Desbloqueaste la misión real!</h3>
              <p style="margin-bottom:12px">Terminaste ${esc(u.label)}. Ahora hazla en IntelliJ: <b>${esc(u.mision.title)}</b> (+30 XP).</p>
              <button class="btn small" style="--c:#8b5cf6;--cd:#6d3fd8" data-result-action="mision">Ver la misión</button></div>`
          : '',
        onAction: (a) => { if (a === 'mision') openMission(u, ctx); },
      };
    },
    onClose: () => { renderPath.scrolled = false; renderShell(); },
  });
}

function startReview() {
  const crs = course();
  const pool = crs.levels.filter((l) => lv(l.id)?.done).flatMap((l) => l.steps.filter((s) => s.t !== 'teoria'));
  if (!pool.length) {
    toast('Completa al menos un nivel para desbloquear el repaso 💪');
    return;
  }
  runLesson({
    title: 'Repaso',
    color: PALETTE.purple,
    steps: shuffle(pool).slice(0, 8),
    hearts: 5,
    onFinish: (r) => {
      recordAnswers(r);
      if (!r.passed) { save(); return null; }
      const xp = 5 + (r.mistakes === 0 ? 5 : 0);
      state.progress.stats.reviews = (state.progress.stats.reviews || 0) + 1;
      awardXp(xp);
      save();
      return { xp, stars: r.mistakes === 0 ? 3 : r.mistakes <= 2 ? 2 : 1 };
    },
    onClose: () => renderShell(),
  });
}

function startJump(crs, unitIndex) {
  const before = crs.units.slice(0, unitIndex);
  const pool = before.flatMap((u) => u.levels.flatMap((l) => l.steps.filter((s) => s.t !== 'teoria' && s.t !== 'write')));
  const m = openModal(`
    <h2>⏩ Saltar a ${esc(crs.units[unitIndex].label)}</h2>
    <p style="color:var(--text-soft)">Responde 10 ejercicios de las unidades anteriores con <b>3 vidas</b>. Si apruebas, se desbloquea todo hasta aquí.</p>
    <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:18px"><button class="btn ghost gray" data-no>Mejor no</button><button class="btn" data-yes>¡Vamos!</button></div>`);
  m.el.querySelector('[data-no]').onclick = m.close;
  m.el.querySelector('[data-yes]').onclick = () => {
    m.close();
    runLesson({
      title: `Prueba de salto · ${crs.units[unitIndex].label}`,
      color: PALETTE.yellow,
      steps: shuffle(pool).slice(0, 10),
      hearts: 3,
      onFinish: (r) => {
        recordAnswers(r);
        if (!r.passed) { save(); return null; }
        before.forEach((u) => u.levels.forEach((l) => {
          if (!lv(l.id)?.done) state.progress.levels[l.id] = { done: true, stars: 1, times: 0 };
        }));
        awardXp(15);
        save();
        return { xp: 15, stars: r.mistakes === 0 ? 3 : r.mistakes <= 1 ? 2 : 1 };
      },
      onClose: () => { renderPath.scrolled = false; renderShell(); },
    });
  };
}

/* ---------------- Boot ---------------- */

async function onUser(user) {
  if (!user) {
    state.user = null;
    renderLogin();
    return;
  }
  state.user = user;
  state.progress = await loadProgress(user);
  setSound(state.progress.sound);
  renderPath.scrolled = false;
  renderShell();
}

applyTheme();
watchAuth(onUser).catch((e) => {
  console.error(e);
  $app.innerHTML = `<div class="boot"><div class="boot-cup">😵</div><p>No se pudo iniciar: ${esc(e.message || e)}</p></div>`;
});
