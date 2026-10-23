// Study plan towards the exam, Javi's per-unit guidance, real-IDE missions and the mock exam (simulacro).
import { esc, highlight } from './code.js';
import { mascot, play, confetti } from './fx.js';
import { md, toast, openModal, enrich } from './ui.js';
import { runLesson } from './lesson.js';
import { PALETTE } from './courses.js';
import { dueSteps, mistakeSteps, weakLevels } from './srs.js';
import { openFocusPicker } from './focus.js';

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const WEEKDAYS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

function parseDay(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function fmtDay(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function addDays(s, n) {
  const d = parseDay(s);
  d.setDate(d.getDate() + n);
  return fmtDay(d);
}
function daysBetween(a, b) {
  return Math.round((parseDay(b) - parseDay(a)) / 86400000);
}
export function humanDate(s) {
  const d = parseDay(s);
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()} de ${MONTHS[d.getMonth()]}`;
}

/** Chilean scale, 60% requirement. */
export function grade(correct, total) {
  if (!total) return 1;
  const p = correct / total;
  const g = p >= 0.6 ? 4 + 3 * ((p - 0.6) / 0.4) : 1 + 3 * (p / 0.6);
  return Math.round(g * 10) / 10;
}

export function missionDone(progress, unit) {
  return !!(unit.mision && progress.missions && progress.missions[unit.mision.id]);
}

/* ---------------- Plan computation ---------------- */

export function planInfo(crs, progress, today) {
  const exam = crs.exam;
  if (!exam) return null;
  const lv = (id) => progress.levels[id] || null;
  const daysLeft = daysBetween(today, exam.date);
  const items = [];
  let doneToday = 0;
  let doneCount = 0;
  let totalCount = 0;
  for (const u of exam.units) {
    for (const l of u.levels) {
      totalCount++;
      const rec = lv(l.id);
      if (rec?.done) { doneCount++; if (rec.at === today) doneToday++; } else items.push({ type: 'level', level: l, unit: u, label: `${l.title}` });
    }
    if (u.mision) {
      totalCount++;
      const rec = progress.missions?.[u.mision.id];
      if (rec) { doneCount++; if (rec.at === today) doneToday++; } else items.push({ type: 'mision', unit: u, label: `🧪 Misión: ${u.mision.title}` });
    }
  }
  const remaining = items.length;
  const info = { exam, daysLeft, doneCount, totalCount, remaining, doneToday, days: [], todayItems: [] };
  if (daysLeft < 0) { info.status = 'past'; return info; }

  // Study until two days before; the day before is for the simulacro + review.
  const studyDays = Math.max(1, daysLeft - 1);
  const todayTarget = Math.ceil((remaining + doneToday) / studyDays);
  const todayRemaining = Math.max(0, Math.min(remaining, todayTarget - doneToday));
  info.todayTarget = Math.max(todayTarget, doneToday);
  info.todayItems = items.slice(0, todayRemaining);
  info.perDay = Math.ceil(remaining / studyDays);
  info.status = remaining === 0 ? 'ready' : todayRemaining === 0 ? 'ok' : info.perDay > 6 ? 'late' : 'pending';

  let cursor = todayRemaining;
  const restDays = studyDays - 1;
  for (let i = 0; i < studyDays; i++) {
    const date = addDays(today, i);
    let dayItems;
    if (i === 0) dayItems = items.slice(0, todayRemaining);
    else {
      const left = remaining - cursor;
      const per = Math.ceil(left / (restDays - (i - 1)));
      dayItems = items.slice(cursor, cursor + per);
      cursor += per;
    }
    info.days.push({ date, items: dayItems, today: i === 0, doneToday: i === 0 ? doneToday : 0 });
  }
  if (daysLeft >= 1) info.days.push({ date: addDays(exam.date, -1), items: [{ type: 'simulacro', label: '📝 Simulacro de prueba + repaso de tus errores' }], today: daysLeft === 1 });
  info.days.push({ date: exam.date, items: [{ type: 'exam', label: `🎯 ${exam.title} (${exam.scope})` }], exam: true, today: daysLeft === 0 });
  return info;
}

export function countdownHtml(info, due = 0) {
  if (!info || info.status === 'past') return '';
  const pct = Math.round((info.doneCount / info.totalCount) * 100);
  const pill = {
    ready: '<span class="status-pill done">🏆 Todo listo: haz simulacros</span>',
    ok: '<span class="status-pill ok">✅ Meta de hoy cumplida</span>',
    pending: `<span class="status-pill ok">Hoy: ${info.todayItems.length} por hacer</span>`,
    late: `<span class="status-pill late">⚠️ Vas justo: ~${info.perDay} por día</span>`,
  }[info.status];
  const when = info.daysLeft === 0 ? '¡ES HOY!' : info.daysLeft === 1 ? 'mañana' : `en ${info.daysLeft} días`;
  return `<button class="countdown" data-nav="plan">
    <div class="big">${info.daysLeft}<small>${info.daysLeft === 1 ? 'día' : 'días'}</small></div>
    <div class="info">
      <b>📅 ${esc(info.exam.title)} · ${when}</b>
      <p>${info.doneCount} de ${info.totalCount} pasos listos (${pct}%) · ${esc(info.exam.scope)}</p>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><div class="bar" style="flex:1;min-width:90px;height:12px"><span style="width:${pct}%;background:var(--green)"></span></div>${due ? `<span class="status-pill" style="background:var(--blue-soft);color:var(--blue-dark)">🔁 ${due} por repasar</span>` : ''}${pill}</div>
    </div>
  </button>`;
}

/* ---------------- Coach ---------------- */

export function coachHtml(unit, { compact = false } = {}) {
  if (!unit || !unit.coach) return '';
  return `<div class="coach">${mascot('happy')}<div>
    <p>${md(unit.coach.focus)}</p>
    ${compact ? '' : `<b style="font-size:14px">🎯 Para la prueba:</b><ul>${unit.coach.exam.map((t) => `<li>${md(t)}</li>`).join('')}</ul>`}
  </div></div>`;
}

/* ---------------- Missions ---------------- */

function linesOf(text) {
  return String(text || '').replace(/\r/g, '').split('\n').map((l) => l.trim()).filter(Boolean);
}

export function checkMission(mision, pasted) {
  if (mision.expect === 'json') {
    let data;
    try { data = JSON.parse(pasted); } catch { return 'Eso no es JSON válido. Copia el archivo completo, desde el [ hasta el ].'; }
    if (!Array.isArray(data)) return 'El archivo debería ser una lista: empezar con [ y terminar con ].';
    if (data.length < 2) return 'Guarda al menos 2 estudiantes antes de copiar el archivo.';
    const keys = ['id', 'nombre', 'correo', 'edad'];
    const bad = data.find((o) => !o || keys.some((k) => !(k in o)));
    if (bad) return `Cada estudiante necesita ${keys.join(', ')}. Revisa tus getters y el constructor vacío.`;
    return null;
  }
  const lines = linesOf(pasted);
  let i = 0;
  for (const e of mision.expect) {
    let found = false;
    while (i < lines.length) {
      const ok = e instanceof RegExp ? e.test(lines[i]) : lines[i] === e;
      i++;
      if (ok) { found = true; break; }
    }
    if (!found) {
      const shown = e instanceof RegExp ? 'una línea tipo "' + e.source.replace(/^\^|\$$/g, '').replace(/\\S\+|\.\+/g, '…') + '"' : `"${e}"`;
      return `No encontré ${shown} (en el orden esperado). Revisa ese mensaje en tu código: mayúsculas, espacios y signos cuentan.`;
    }
  }
  return null;
}

export function openMission(unit, ctx) {
  const m = unit.mision;
  if (!m) return;
  const p = ctx.state.progress;
  p.missionSteps = p.missionSteps || {};
  const ticks = p.missionSteps[m.id] || [];
  const done = missionDone(p, unit);
  const modal = openModal(`
    <div class="ex-kind new" style="margin-bottom:4px">🧪 Misión real · ${esc(unit.label)} · +30 XP</div>
    <h2>${esc(m.title)}</h2>
    <p style="color:var(--text-soft);margin:6px 0 0">${md(m.intro)}</p>
    <div class="hint-box" style="border-color:var(--purple);background:transparent">💻 Esto se hace en <b>IntelliJ IDEA</b>, no aquí. Ejecútalo con el <b>▶ verde</b> junto a <code>main</code>. Programar en un IDE real es lo que te piden en la prueba: ¡el error que veas ahí es el que aprendes!</div>
    <ol class="mission-steps">${m.steps.map((s, i) => `<li><input type="checkbox" data-step="${i}" ${ticks[i] || done ? 'checked' : ''} aria-label="Paso ${i + 1}"><span><b>${i + 1}.</b> ${md(s)}</span></li>`).join('')}</ol>
    ${(m.files || []).map((f, i) => `<div class="file-head"><span>📄 ${esc(f.name)}</span><button class="chip" data-copyfile="${i}">📋 Copiar</button></div><pre class="code">${highlight(f.code, f.lang || 'java')}</pre>`).join('')}
    ${m.note ? `<div class="theory"><div class="warn">💡 ${md(m.note)}</div></div>` : ''}
    <h3 style="margin:18px 0 6px">${done ? '✅ Misión completada' : m.expect === 'json' ? 'Pega aquí el contenido de estudiantes.json' : 'Pega aquí lo que muestra la consola'}</h3>
    ${done ? `<p style="color:var(--text-soft)">La completaste el ${humanDate(p.missions[m.id].at)}. Puedes volver a hacerla cuando quieras para practicar.</p>` : ''}
    <textarea class="answer-box" id="ms-out" spellcheck="false" placeholder="${m.expect === 'json' ? '[ { &quot;id&quot;: 1, ... } ]' : 'Copia la consola de IntelliJ (Ctrl+A, Ctrl+C) y pégala aquí'}"></textarea>
    <div class="login-error" id="ms-err" style="text-align:left;margin-top:8px"></div>
    <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:10px">
      <button class="btn" data-validate>Validar</button>
    </div>`);
  enrich(modal.el.querySelector('.mission-steps'));
  modal.el.querySelectorAll('[data-step]').forEach((cb) => {
    cb.onchange = () => {
      const arr = p.missionSteps[m.id] || [];
      arr[+cb.dataset.step] = cb.checked;
      p.missionSteps[m.id] = arr;
      ctx.save();
    };
  });
  modal.el.querySelectorAll('[data-copyfile]').forEach((b) => {
    b.onclick = async () => {
      try { await navigator.clipboard.writeText(m.files[+b.dataset.copyfile].code); toast('Copiado 📋 Pégalo en IntelliJ'); } catch { toast('Selecciona el código y usa Ctrl+C'); }
    };
  });
  modal.el.querySelector('[data-validate]').onclick = () => {
    const err = checkMission(m, modal.el.querySelector('#ms-out').value);
    const $err = modal.el.querySelector('#ms-err');
    if (err) { $err.textContent = err; play('bad'); return; }
    $err.textContent = '';
    play('win');
    confetti();
    if (!done) {
      p.missions = p.missions || {};
      p.missions[m.id] = { at: ctx.today() };
      ctx.awardXp(30);
      ctx.save();
      toast('🧪 ¡Misión cumplida! +30 XP');
    } else {
      toast('¡Funciona de nuevo! 💪');
    }
    modal.close();
    ctx.rerender();
  };
}

/* ---------------- Simulacro ---------------- */

function shuffle(a) {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function simulacroSteps(crs) {
  const all = crs.exam.levels.flatMap((l) => l.steps.filter((s) => s.t !== 'teoria'));
  const by = (types) => shuffle(all.filter((s) => types.includes(s.t)));
  const picked = [...by(['write', 'fix']).slice(0, 5), ...by(['line']).slice(0, 4), ...by(['fill']).slice(0, 3), ...by(['output']).slice(0, 3)];
  return shuffle(picked);
}

export function startSimulacro(ctx) {
  const crs = ctx.course();
  const steps = simulacroSteps(crs);
  runLesson({
    title: 'Simulacro de prueba',
    color: PALETTE.blue,
    steps,
    exam: true,
    onFinish: (r) => {
      ctx.recordAnswers(r);
      const g = grade(r.firstTry, r.total);
      const p = ctx.state.progress;
      p.simulacros = p.simulacros || [];
      p.simulacros.push({ at: ctx.today(), grade: g, correct: r.firstTry, total: r.total });
      const xp = 20 + (g >= 4 ? 10 : 0);
      ctx.awardXp(xp);
      ctx.save();
      return {
        xp,
        stars: 3,
        grade: g,
        extraHtml: `<p style="color:var(--text-soft);margin:0">Escala de 1.0 a 7.0 con 60% de exigencia, como en Duoc. ${g >= 4 ? 'Repite el simulacro: cada vez salen otros ejercicios.' : 'Repasa las unidades donde fallaste y vuelve a intentarlo.'}</p>`,
      };
    },
    onClose: () => ctx.rerender(),
  });
}

/* ---------------- Plan view ---------------- */

export function renderPlan(main, ctx) {
  const crs = ctx.course();
  const p = ctx.state.progress;
  const info = planInfo(crs, p, ctx.today());
  if (!info) { main.innerHTML = '<p>Este ramo aún no tiene plan.</p>'; return; }
  const due = dueSteps(crs, p, ctx.today());
  const mistakes = mistakeSteps(crs, p);
  const weak = weakLevels(crs, p);
  const sims = p.simulacros || [];
  const best = sims.length ? Math.max(...sims.map((s) => s.grade)) : null;
  const last = sims[sims.length - 1];
  const dayHtml = (d) => {
    const date = parseDay(d.date);
    const items = d.items.map((it) => `<li>${esc(it.type === 'level' ? `${it.unit.number ? it.unit.number + ". " + it.unit.title : it.unit.label} → ${it.label}` : it.label)}</li>`).join('');
    const extra = d.today && d.doneToday ? `<li class="done">${d.doneToday} ${d.doneToday === 1 ? 'paso completado' : 'pasos completados'} hoy ✔</li>` : '';
    const empty = !items && !extra ? '<li>Día libre: haz un 🏋️ repaso de 5 minutos</li>' : '';
    return `<div class="day ${d.today ? 'today' : ''} ${d.exam ? 'exam' : ''}">
      <div class="date"><div class="d">${date.getDate()}</div><div class="m">${WEEKDAYS[date.getDay()]} · ${MONTHS[date.getMonth()]}</div></div>
      <div style="flex:1;min-width:0"><b style="font-size:14px">${d.today ? 'HOY' : d.exam ? 'Día de la prueba' : humanDate(d.date)}</b><ul>${extra}${items}${empty}</ul></div>
    </div>`;
  };
  const lv = (id) => p.levels[id] || null;
  main.innerHTML = `
    <div style="max-width:680px;margin:0 auto">
      <h1 class="page-title">📅 Plan hacia la prueba</h1>
      <p class="page-sub">${esc(crs.exam.title)}: <b>${humanDate(crs.exam.date)}</b> · ${esc(crs.exam.scope)}. La materia 3.x (unidad 12) queda para después.</p>
      ${info.status === 'past' ? '<div class="panel"><h3>La prueba ya pasó 🎉</h3><p>Sigue con la unidad 12 (bases de datos) a tu ritmo.</p></div>' : countdownHtml(info, due.length).replace('data-nav="plan"', '')}
      ${routineHtml(info, due.length, mistakes.length)}
      ${weak.length ? `<div class="panel" style="margin-bottom:16px;border-color:var(--red)">
        <h3>🎯 Tus temas más débiles</h3>
        <p style="margin-bottom:10px">Donde más te has equivocado. Repetir estos niveles es el atajo más corto para subir tu nota.</p>
        ${weak.map((w) => `<div class="material-row"><span class="name">${esc(w.level.unit.label)} · ${esc(w.level.title)}</span><span class="pct" style="width:auto">${Math.round(w.rate * 100)}% errores</span><button class="chip" data-replay="${w.level.id}">Repetir</button></div>`).join('')}
      </div>` : ''}

      ${(() => {
        const pu = crs.units.find((u) => u.key === 'prueba1');
        if (!pu) return '';
        const d = pu.levels.filter((l) => lv(l.id)?.done).length;
        return `<div class="panel" style="margin-bottom:16px;border-color:var(--yellow)">
          <h3>📋 Cómo hacer la prueba <span class="status-pill done">${d}/${pu.levels.length} niveles</span></h3>
          <p style="margin-bottom:12px">El método de tu Prueba 1 (Resumen_Prueba): tabla del enunciado → 5 moldes → tabla de datos → IntelliJ y entrega. Léelo antes de cada simulacro.</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <button class="btn yellow small" data-howto>Ver el método</button>
            <button class="btn ghost small" data-howto-go>Practicarlo</button>
          </div>
        </div>`;
      })()}
      <div class="panel" style="margin-bottom:22px">
        <h3>📝 Simulacro de prueba ${best !== null ? `<span class="status-pill ${best >= 4 ? 'ok' : 'late'}">Mejor nota: ${best.toFixed(1)}</span>` : ''}</h3>
        <p style="margin-bottom:12px">15 ejercicios al azar de toda la materia 1.x y 2.x, un solo intento por pregunta, sin pistas ni vidas. Te da una nota de 1.0 a 7.0.${last ? ` Último: <b>${last.grade.toFixed(1)}</b> (${last.correct}/${last.total}) el ${humanDate(last.at)}.` : ''}</p>
        <button class="btn blue" data-sim>Empezar simulacro</button>
      </div>

      ${info.status !== 'past' ? `<h2 style="margin-bottom:12px">Día a día</h2>
      <p class="page-sub" style="margin-top:-6px;font-size:15px">El plan se reacomoda solo: si un día avanzas más, los siguientes se alivianan.</p>
      <div class="day-list">${info.days.map(dayHtml).join('')}</div>` : ''}

      <h2 style="margin:26px 0 12px">Material de la prueba</h2>
      <p class="page-sub" style="margin-top:-6px;font-size:15px">Cada archivo de la plataforma y cuánto de él ya dominas en la página.</p>
      <div class="material">${crs.material.map((m) => {
        const d = m.levels.filter((l) => lv(l.id)?.done).length;
        const pct = Math.round((d / m.levels.length) * 100);
        return `<div class="material-row"><span class="name">${pct === 100 ? '✅' : '📄'} ${esc(m.file)}</span><div class="bar"><span style="width:${pct}%"></span></div><span class="pct">${pct}%</span></div>`;
      }).join('')}</div>
    </div>`;
  main.querySelector('[data-sim]').onclick = () => startSimulacro(ctx);
  bindRoutine(main, ctx);
  main.querySelectorAll('[data-replay]').forEach((b) => {
    b.onclick = () => ctx.startLevel(crs.levels.find((l) => l.id === b.dataset.replay));
  });
  const pu = crs.units.find((u) => u.key === 'prueba1');
  const howto = main.querySelector('[data-howto]');
  if (howto) howto.onclick = () => ctx.openGuide(pu);
  const go = main.querySelector('[data-howto-go]');
  if (go) go.onclick = () => ctx.goToUnit(pu);
}

/* ---------------- Learning routine & the science behind it ---------------- */

export function routineHtml(info, due, mistakes) {
  const todayNew = info && info.todayItems ? info.todayItems.length : 0;
  return `<div class="panel" style="margin-bottom:16px;border-color:var(--blue)">
    <h3>🚀 Tu rutina diaria (≈ 45 min)</h3>
    <ol class="routine">
      <li><b>🔁 Repaso del día</b> · 10 min<span>${due ? `Tienes <b>${due}</b> ejercicios que tu memoria está por olvidar.` : 'Hoy no tienes pendientes: ¡al día!'}</span>${due ? '<button class="chip" data-review>Repasar</button>' : ''}</li>
      <li><b>📈 Lo nuevo del plan</b> · 25 min<span>${todayNew ? `Hoy te tocan <b>${todayNew}</b> pasos (están en "Día a día").` : 'Meta de hoy cumplida ✅'}</span></li>
      <li><b>🗣️ Cerrar el día</b> · 5 min<span>Repasa tus errores o explica en voz alta lo que aprendiste.</span>${mistakes ? `<button class="chip" data-errors>📕 Errores (${mistakes})</button>` : ''}</li>
      <li><b>🧪 Misión en IntelliJ</b><span>Cuando termines una unidad: programar en el IDE real es lo que te piden en la prueba.</span></li>
      <li><b>😴 Dormir bien</b><span>Lo estudiado se consolida durante el sueño. No trasnoches la noche antes de la prueba.</span></li>
    </ol>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px">
      <button class="btn small" data-focus>⏱️ Modo enfoque</button>
      <button class="btn ghost small" data-science>🧠 Por qué funciona</button>
    </div>
  </div>`;
}

export function bindRoutine(root, ctx) {
  root.querySelectorAll('[data-review]').forEach((b) => { b.onclick = () => ctx.startReview(); });
  root.querySelectorAll('[data-errors]').forEach((b) => { b.onclick = () => ctx.startReview('errors'); });
  root.querySelectorAll('[data-focus]').forEach((b) => { b.onclick = () => openFocusPicker(); });
  root.querySelectorAll('[data-science]').forEach((b) => { b.onclick = () => openScience(); });
}

const SOURCES = {
  dunlosky: ['Dunlosky et al. (2013): qué técnicas de estudio funcionan (resumen de la APS)', 'https://www.psychologicalscience.org/news/releases/which-study-strategies-make-the-grade.html'],
  roediger: ['Roediger y Karpicke (2006): Test-Enhanced Learning', 'https://psychology.ecu.edu/wp-content/pv-uploads/sites/216/2019/03/Roediger-Karpicke-2006.pdf'],
  cepeda: ['Cepeda et al. (2008): Spacing effects in learning', 'https://www.evullab.org/pdf/CepedaVulRohrerWixtedPashler-PS-2008.pdf'],
  scientists: ['The Learning Scientists: seis estrategias para aprender', 'https://ctl.wustl.edu/learningcenter/?p=767'],
  metcalfe: ['Metcalfe (2017): Learning from Errors', 'https://wesleyan.edu/ofcd/resources/OFCD Resource Docs/Learning from Errors.pdf'],
  pomodoro: ['Revisión sobre la técnica Pomodoro (BMC Medical Education, 2025)', 'https://link.springer.com/article/10.1186/s12909-025-08001-0'],
};
const src = (k) => `<a href="${encodeURI(SOURCES[k][1])}" target="_blank" rel="noopener">${SOURCES[k][0]}</a>`;

export function openScience() {
  openModal(`
    <h2>🧠 Por qué esta página te hace aprender más rápido</h2>
    <p style="color:var(--text-soft)">No son trucos de motivación: son técnicas medidas en estudios con estudiantes reales. Esto es lo que usa cada parte de la página.</p>
    <div class="theory" style="padding:0;border:0">
    <table>
      <tr><th>Técnica</th><th>Qué es</th><th>Evidencia</th><th>Dónde está aquí</th></tr>
      <tr><td><b>Practicar recordando</b></td><td>Sacar la respuesta de tu memoria en vez de releer.</td><td>⭐⭐⭐ Alta</td><td>Todos los ejercicios y el simulacro</td></tr>
      <tr><td><b>Repaso espaciado</b></td><td>Repasar justo cuando empiezas a olvidar, en días distintos.</td><td>⭐⭐⭐ Alta</td><td>🔁 Repaso del día (cajas de Leitner)</td></tr>
      <tr><td><b>Mezclar temas</b></td><td>Alternar tipos de problema en vez de hacer muchos iguales seguidos.</td><td>⭐⭐ Moderada</td><td>El repaso y el simulacro mezclan unidades</td></tr>
      <tr><td><b>Explicarte a ti mismo</b></td><td>Decir con tus palabras el "por qué" y el "cómo".</td><td>⭐⭐ Moderada</td><td>🗣️ Explícalo con tus palabras</td></tr>
      <tr><td><b>Aprender del error</b></td><td>Intentar, equivocarte y recibir la corrección al tiro fija mejor la respuesta correcta.</td><td>⭐⭐ Sólida en laboratorio</td><td>💡 Pistas, solución y 📕 cuaderno de errores</td></tr>
      <tr><td><b>Ejemplos concretos + dibujos</b></td><td>Unir la idea abstracta con algo real y con una imagen.</td><td>⭐⭐ Recomendada</td><td>🧠 Para recordar, diagramas y 👀 Python Tutor</td></tr>
      <tr><td><b>Saber lo que sabes</b></td><td>Comparar lo seguro que te sientes con tu resultado real.</td><td>⭐⭐ Mejora con retroalimentación</td><td>"¿Qué tan claro te quedó?" al final de cada nivel</td></tr>
      <tr><td><b>Pausas planificadas</b></td><td>Bloques sin distracciones con descansos fijos.</td><td>⭐ Mixta</td><td>⏱️ Modo enfoque (opcional)</td></tr>
    </table>
    <div class="warn">📉 <b>Lo que menos sirve</b> según la misma revisión: releer apuntes, subrayar y hacer resúmenes. Se sienten productivos, pero se olvidan rápido. En el estudio de Roediger y Karpicke, quienes releían se sentían <i>más</i> seguros, pero días después recordaban <i>menos</i> que quienes se evaluaban.</div>
    <div class="tip">⏳ <b>¿Por qué repasos tan seguidos?</b> Para una prueba en ~2 semanas, el mejor espacio entre repasos es de pocos días (Cepeda et al.: cerca del 20–40% del tiempo que falta). Por eso las cajas van a 1 → 2 → 4 → 7 días.</div>
    </div>
    <h3 style="margin-top:16px">Fuentes</h3>
    <ul style="font-size:14px;line-height:1.7">${Object.keys(SOURCES).map((k) => `<li>${src(k)}</li>`).join('')}</ul>
  `);
}
