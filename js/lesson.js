// Lesson runner: shows steps one by one, checks answers, tracks hearts, and shows the result screen.
import { esc, highlight, runChecks, bracketProblem, sameToken, normalizeOutput } from './code.js';
import { createEditor } from './editor.js';
import { mascot, play, confetti } from './fx.js';
import { md, codeBlock, theoryHtml, openModal, toast } from './ui.js';
import { hintsFor } from './hints.js';

const PRAISE = ['¡Excelente!', '¡Bien hecho!', '¡Perfecto!', '¡Eso es!', '¡Crack!', '¡Impecable!', '¡Vas volando!', '¡Código limpio!'];
const OOPS = ['Casi...', 'Uy, no del todo', 'Revisa esto', 'No te rindas', 'Se te escapó algo'];
const pick = (a) => a[(Math.random() * a.length) | 0];

const KIND = {
  teoria: ['💡', 'Nuevo concepto', 'new'],
  fill: ['✏️', 'Completa el código', ''],
  line: ['💬', 'Escríbelo en una línea', ''],
  write: ['⌨️', 'Escribe el código', ''],
  fix: ['🐛', 'Encuentra y corrige el error', ''],
  output: ['🖥️', '¿Qué imprime?', ''],
};

const SNIPPETS = {
  java: ['{ }', '( )', ';', '"', 'this.', 'return ', 'System.out.println();', '@Override', 'private ', 'public '],
  xml: ['< >', '</ >', '"'],
  sql: ["'", '?', ';', '*'],
  text: ['{', '}', '"', ':', ','],
};

function blankParts(code) {
  const parts = [];
  const re = /\[\[(.+?)\]\]/g;
  let last = 0;
  let m;
  while ((m = re.exec(code))) {
    parts.push({ text: code.slice(last, m.index) });
    parts.push({ answers: m[1].split('|') });
    last = re.lastIndex;
  }
  parts.push({ text: code.slice(last) });
  return parts;
}

/* ---------------- Step renderers ---------------- */
// Each returns { canCheck(), check() -> {ok, warn, message, items}, solutionHtml(), focus(), onChange(cb) }

function renderTeoria(step, host) {
  host.innerHTML = `<div class="theory">${theoryHtml(step)}</div>`;
  return { teoria: true, canCheck: () => true, focus() {}, onChange() {} };
}

function renderFill(step, host, ctx) {
  const lang = step.lang || 'java';
  const parts = blankParts(step.code);
  let html = '';
  let bi = 0;
  for (const p of parts) {
    if (p.text !== undefined) html += highlight(p.text, lang);
    else {
      const w = Math.max(3, ...p.answers.map((a) => a.length)) + 1;
      html += `<input class="blank" data-i="${bi++}" style="width:calc(${w}ch + 12px)" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="Espacio ${bi}">`;
    }
  }
  host.innerHTML = `<pre class="code">${html}</pre>`;
  const inputs = [...host.querySelectorAll('.blank')];
  const answers = parts.filter((p) => p.answers).map((p) => p.answers);
  let changeCb = () => {};
  inputs.forEach((inp, i) => {
    inp.addEventListener('input', () => { inp.classList.remove('ok', 'bad'); changeCb(); });
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && ctx.isChecking()) {
        e.preventDefault();
        e.stopPropagation();
        const next = inputs.slice(i + 1).find((x) => !x.value.trim());
        if (next) next.focus();
        else ctx.submit();
      }
    });
  });
  return {
    canCheck: () => inputs.every((i) => i.value.trim()),
    focus: () => inputs[0] && inputs[0].focus(),
    onChange: (cb) => { changeCb = cb; },
    check() {
      let wrong = 0;
      inputs.forEach((inp, i) => {
        const ok = answers[i].some((a) => sameToken(inp.value, a));
        inp.classList.toggle('ok', ok);
        inp.classList.toggle('bad', !ok);
        if (!ok) wrong++;
      });
      return wrong
        ? { ok: false, message: wrong === 1 ? 'Hay un espacio incorrecto (marcado en rojo).' : `Hay ${wrong} espacios incorrectos (marcados en rojo).` }
        : { ok: true };
    },
    solutionHtml: () => codeBlock(parts.map((p) => (p.text !== undefined ? p.text : p.answers[0])).join(''), lang),
  };
}

function checklistHtml(items) {
  return `<ul class="checklist">${items.map((it) => `<li class="${it.ok ? 'ok' : 'bad'}"><span class="mark">${it.ok ? '✓' : '✕'}</span><span>${md(it.label)}</span></li>`).join('')}</ul>`;
}

function renderLine(step, host, ctx) {
  host.innerHTML = '<input class="oneline" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="Escribe aquí tu línea de código…" aria-label="Tu respuesta"><div class="extra"></div>';
  const inp = host.querySelector('input');
  const extra = host.querySelector('.extra');
  let changeCb = () => {};
  inp.addEventListener('input', () => { inp.style.borderColor = ''; changeCb(); });
  inp.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && ctx.isChecking()) { e.preventDefault(); e.stopPropagation(); ctx.submit(); }
  });
  return {
    canCheck: () => !!inp.value.trim(),
    focus: () => inp.focus(),
    onChange: (cb) => { changeCb = cb; },
    check() {
      // Single lines can legitimately leave a "{" open (e.g. a class header), so only the checks decide.
      const items = runChecks(inp.value, step.checks);
      const ok = items.every((i) => i.ok);
      inp.style.borderColor = ok ? 'var(--green)' : 'var(--red)';
      extra.innerHTML = '';
      if (ok) return { ok: true };
      const v = inp.value.trim();
      const wantsSemi = /;\s*$/.test(step.solution) && !/[;{]\s*$/.test(v);
      return {
        ok: false,
        message: wantsSemi
          ? 'Te falta el punto y coma ; al final de la instrucción.'
          : 'Tu línea no hace exactamente lo pedido. Revisa nombres, mayúsculas y símbolos.',
      };
    },
    solutionHtml: () => codeBlock(step.solution, step.lang || 'java'),
  };
}

function renderEditorStep(step, host, ctx) {
  const lang = step.lang || 'java';
  const starter = step.starter || '';
  host.innerHTML = `<div class="editor-slot"></div>
    <div class="editor-tools">
      ${(SNIPPETS[lang] || SNIPPETS.java).map((s) => `<button class="chip" data-snip="${esc(s)}">${esc(s.trim())}</button>`).join('')}
    </div>
    <div style="display:flex;gap:4px;flex-wrap:wrap;align-items:center">
      ${step.t === 'fix' || starter ? '<button class="link-btn" data-reset>↺ Restaurar código</button>' : ''}
      <span class="kbd">Ctrl + Enter para comprobar · Tab para indentar</span>
    </div>
    <div class="extra"></div>`;
  const editor = createEditor({ value: starter, lang, onSubmit: () => ctx.submit(), minLines: step.t === 'fix' ? 4 : 8 });
  host.querySelector('.editor-slot').appendChild(editor.el);
  const extra = host.querySelector('.extra');
  let changeCb = () => {};
  editor.textarea.addEventListener('input', () => { editor.setState(null); changeCb(); });
  host.querySelectorAll('[data-snip]').forEach((b) => {
    b.onclick = () => {
      const s = b.dataset.snip;
      const map = { '{ }': '{\n    \n}', '( )': '()', '< >': '<>', '</ >': '</>' };
      editor.insert(map[s] || s);
      changeCb();
    };
  });
  const resetBtn = host.querySelector('[data-reset]');
  if (resetBtn) resetBtn.onclick = () => { editor.value = starter; editor.setState(null); extra.innerHTML = ''; changeCb(); editor.focus(); };

  return {
    getCode: () => editor.value,
    canCheck: () => !!editor.value.trim(),
    focus: () => {
      editor.focus();
      const ta = editor.textarea;
      // Leave the caret on the first empty indented line of the starter, if any.
      const m = /\n( +)\n/.exec(ta.value);
      if (m && step.t !== 'fix') { const p = m.index + 1 + m[1].length; ta.setSelectionRange(p, p); }
      else ta.setSelectionRange(ta.value.length, ta.value.length);
    },
    onChange: (cb) => { changeCb = cb; },
    check() {
      const br = bracketProblem(editor.value);
      if (br) return { warn: br };
      const items = runChecks(editor.value, step.checks);
      const ok = items.every((i) => i.ok);
      editor.setState(ok ? 'ok' : 'bad');
      extra.innerHTML = checklistHtml(items);
      const failing = items.filter((i) => !i.ok);
      return ok
        ? { ok: true }
        : { ok: false, message: `Te falta cumplir ${failing.length} ${failing.length === 1 ? 'requisito' : 'requisitos'}. Revisa la lista ✕ debajo del editor.` };
    },
    solutionHtml: () => codeBlock(step.solution, lang),
  };
}

function renderOutput(step, host, ctx) {
  host.innerHTML = `${codeBlock(step.code)}
    <textarea class="answer-box" spellcheck="false" placeholder="Escribe aquí lo que aparece en la consola (una línea por cada println)…" aria-label="Salida del programa"></textarea>
    <span class="kbd">Ctrl + Enter para comprobar</span>`;
  const ta = host.querySelector('textarea');
  let changeCb = () => {};
  ta.addEventListener('input', () => { ta.classList.remove('ok', 'bad'); changeCb(); });
  ta.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && ctx.isChecking()) { e.preventDefault(); e.stopPropagation(); ctx.submit(); }
  });
  return {
    canCheck: () => !!ta.value.trim(),
    focus: () => ta.focus(),
    onChange: (cb) => { changeCb = cb; },
    check() {
      const got = normalizeOutput(ta.value);
      const want = normalizeOutput(step.answer);
      const ok = got === want;
      ta.classList.toggle('ok', ok);
      ta.classList.toggle('bad', !ok);
      if (ok) return { ok: true };
      const gl = got.split('\n').length;
      const wl = want.split('\n').length;
      return {
        ok: false,
        message: gl !== wl
          ? `La consola muestra ${wl} ${wl === 1 ? 'línea' : 'líneas'} y tú escribiste ${gl}.`
          : 'Revisa cada línea con calma: espacios, mayúsculas y decimales cuentan.',
      };
    },
    solutionHtml: () => `<pre class="code">${esc(step.answer)}</pre>`,
  };
}

const RENDERERS = { teoria: renderTeoria, fill: renderFill, line: renderLine, write: renderEditorStep, fix: renderEditorStep, output: renderOutput };

/* ---------------- Runner ---------------- */


/**
 * steps: exercises to run · hearts: lives (ignored in exam mode)
 * exam: simulacro mode — one attempt per exercise, no hints, no lives, the solution is shown when wrong
 * onFinish(r) → { xp, stars, grade?, extraHtml? } | null   (r = { passed, mistakes, firstTry, answered, hints, total })
 */
export function runLesson(opts) {
  const { title, color, steps, hearts: maxHearts = 5, exam = false, onFinish, onClose } = opts;
  const root = document.createElement('div');
  root.className = 'lesson';
  root.style.setProperty('--uc', color[0]);
  root.innerHTML = `
    <div class="lesson-top">
      <button class="icon-btn" data-quit aria-label="Salir">✕</button>
      <div class="bar" title="${esc(title)}"><span style="width:0%;background:var(--green)"></span></div>
      ${exam
        ? `<div class="hearts" style="color:var(--blue)"><span class="heart">📝</span><span class="n">1/${steps.length}</span></div>`
        : `<div class="hearts"><span class="heart">❤️</span><span class="n">${maxHearts}</span></div>`}
    </div>
    <div class="lesson-body"><div class="ex"></div></div>
    <div class="lesson-foot"><div class="inner"></div></div>`;
  document.body.appendChild(root);
  document.body.style.overflow = 'hidden';

  const $bar = root.querySelector('.bar > span');
  const $hearts = root.querySelector('.hearts');
  const $body = root.querySelector('.lesson-body');
  const $ex = root.querySelector('.ex');
  const $foot = root.querySelector('.lesson-foot');
  const $footInner = $foot.querySelector('.inner');

  const queue = steps.map((s) => ({ step: s, tries: 0, sawSolution: false }));
  const total = queue.length;
  let completed = 0;
  let hearts = maxHearts;
  let mistakes = 0;
  let firstTry = 0;
  let answered = 0;
  let hintsUsed = 0;
  let combo = 0;
  let current = null;
  let ctrl = null;
  let footState = 'check';
  let primaryAction = null;
  const startedAt = Date.now();

  function close() {
    document.removeEventListener('keydown', onKey);
    document.body.style.overflow = '';
    root.remove();
    onClose && onClose();
  }

  function setProgress() {
    $bar.style.width = `${(completed / total) * 100}%`;
    if (exam) $hearts.querySelector('.n').textContent = `${Math.min(completed + 1, total)}/${total}`;
  }

  function setFoot(stateName, html) {
    footState = stateName;
    $foot.className = `lesson-foot fs-${stateName}`;
    $footInner.innerHTML = html;
  }

  function bindPrimary(action) {
    primaryAction = action;
    const btn = $footInner.querySelector('[data-primary]');
    if (btn) btn.onclick = () => primaryAction();
  }

  function footCheck() {
    const isTeoria = ctrl && ctrl.teoria;
    setFoot('check', `<div></div><div class="foot-actions">
      <button class="btn ${isTeoria ? 'blue' : ''}" data-primary ${isTeoria || ctrl.canCheck() ? '' : 'disabled'}>${isTeoria ? '¡Entendido!' : 'Comprobar'}</button></div>`);
    bindPrimary(isTeoria ? next : submit);
  }

  function refreshCheckButton() {
    if (footState !== 'check') {
      if (footState === 'bad' || footState === 'warn') footCheck();
      else return;
    }
    const btn = $footInner.querySelector('[data-primary]');
    if (btn && !(ctrl && ctrl.teoria)) btn.disabled = !ctrl.canCheck();
  }

  function setupHints(s) {
    const area = $ex.querySelector('.hint-area');
    if (!area) return;
    const hints = hintsFor(s);
    if (!hints.length) { area.remove(); return; }
    const list = area.querySelector('.hint-list');
    const btn = area.querySelector('[data-hint]');
    let shown = 0;
    const label = () => {
      btn.textContent = shown === 0 ? `💡 Pista (${hints.length} disponibles)` : `💡 Otra pista (${shown}/${hints.length})`;
      btn.disabled = shown >= hints.length;
      btn.style.display = shown >= hints.length ? 'none' : '';
    };
    btn.onclick = () => {
      const h = hints[shown++];
      hintsUsed++;
      list.insertAdjacentHTML('beforeend', `<div class="hint-box"><b>${h.title}</b><div>${h.html}</div></div>`);
      label();
      play('tap');
    };
    label();
  }

  function showStep() {
    current = queue.shift();
    const s = current.step;
    const [ico, label, cls] = KIND[s.t];
    const retry = current.tries > 0 || current.sawSolution;
    $ex.innerHTML = `
      <div class="ex-kind ${cls}">${ico} ${label}${retry ? ' · <span style="color:var(--red)">Repetición</span>' : ''}</div>
      ${s.t === 'teoria'
        ? `<h2>${esc(s.title)}</h2>`
        : `<div class="speech">${mascot(s.t === 'fix' ? 'think' : 'happy')}<div class="bubble prompt">${md(s.prompt)}</div></div>`}
      <div class="step-host"></div>
      ${s.t !== 'teoria' && !exam ? '<div class="hint-area"><div class="hint-list"></div><button class="link-btn" data-hint></button></div>' : ''}`;
    // Re-trigger the entry animation.
    $ex.style.animation = 'none'; void $ex.offsetWidth; $ex.style.animation = '';
    const host = $ex.querySelector('.step-host');
    ctrl = RENDERERS[s.t](s, host, {
      submit: () => { if (footState === 'check' && ctrl.canCheck()) submit(); },
      isChecking: () => footState === 'check',
    });
    ctrl.onChange(refreshCheckButton);
    setupHints(s);
    footCheck();
    $body.scrollTop = 0;
    setTimeout(() => ctrl.focus(), 60);
  }

  function copyButtonHtml(s) {
    return (s.t === 'write' || s.t === 'fix') && ctrl.getCode && (s.lang || 'java') === 'java'
      ? '<button class="link-btn" data-copy style="padding:6px 0">📋 Copiar mi código para probarlo en IntelliJ</button>'
      : '';
  }

  function bindCopy() {
    const b = $footInner.querySelector('[data-copy]');
    if (!b) return;
    b.onclick = async () => {
      try {
        await navigator.clipboard.writeText(ctrl.getCode());
        toast('Copiado 📋 Pégalo en IntelliJ y ejecútalo');
      } catch {
        toast('No se pudo copiar: selecciona el código y usa Ctrl+C');
      }
    };
  }

  function submit() {
    const s = current.step;
    const r = ctrl.check();
    if (r.warn) {
      setFoot('warn', `<div class="feedback"><div class="fb-ico">🧐</div><div><h3>¡Ojo!</h3><div class="fb-text">${esc(r.warn)}</div></div></div>
        <div class="foot-actions"><button class="btn yellow" data-primary>Seguir editando</button></div>`);
      bindPrimary(() => { footCheck(); ctrl.focus(); });
      return;
    }
    if (r.ok) {
      play('ok');
      if (current.tries === 0 && !current.sawSolution) { firstTry++; combo++; } else combo = 0;
      answered++;
      completed++;
      setProgress();
      if (combo >= 3 && !exam) showCombo(combo);
      document.activeElement && document.activeElement.blur && document.activeElement.blur();
      setFoot('ok', `<div class="feedback"><div class="fb-ico">${pick(['🎉', '✨', '🙌', '💪', '🚀'])}</div><div>
          <h3>${pick(PRAISE)}</h3>
          ${s.explain ? `<div class="fb-text">${md(s.explain)}</div>` : ''}
          ${exam ? '' : copyButtonHtml(s)}</div></div>
        <div class="foot-actions"><button class="btn" data-primary>Continuar</button></div>`);
      bindPrimary(next);
      bindCopy();
      return;
    }
    // Wrong answer
    play('bad');
    current.tries++;
    mistakes++;
    combo = 0;
    if (exam) {
      answered++;
      completed++;
      setProgress();
      document.activeElement && document.activeElement.blur && document.activeElement.blur();
      setFoot('solution', `<div class="feedback"><div class="fb-ico">📘</div><div style="min-width:0;flex:1">
          <h3>Incorrecta</h3>
          <div class="fb-text">${esc(r.message || '')} Así era:${ctrl.solutionHtml()}</div></div></div>
        <div class="foot-actions"><button class="btn red" data-primary>Continuar</button></div>`);
      bindPrimary(next);
      return;
    }
    hearts = Math.max(0, hearts - 1);
    $hearts.querySelector('.n').textContent = hearts;
    $hearts.classList.remove('hit'); void $hearts.offsetWidth; $hearts.classList.add('hit');
    if (hearts === 0) {
      setTimeout(showFail, 650);
      setFoot('bad', `<div class="feedback"><div class="fb-ico">💔</div><div><h3>Sin vidas</h3><div class="fb-text">${esc(r.message || '')}</div></div></div><div class="foot-actions"></div>`);
      return;
    }
    const hintBtn = $ex.querySelector('[data-hint]');
    const nudge = hintBtn && hintBtn.style.display !== 'none' ? ' ¿Te ayudo con una 💡 pista?' : '';
    setFoot('bad', `<div class="feedback"><div class="fb-ico">${pick(['😬', '🤔', '🙈'])}</div><div>
        <h3>${pick(OOPS)}</h3><div class="fb-text">${esc(r.message || 'Respuesta incorrecta.')}${nudge}</div></div></div>
      <div class="foot-actions">
        ${nudge ? '<button class="btn ghost" data-hintfoot>💡 Pista</button>' : '<button class="btn ghost gray" data-sol>Ver solución</button>'}
        <button class="btn red" data-primary>Reintentar</button>
      </div>`);
    bindPrimary(() => { footCheck(); ctrl.focus(); });
    const sol = $footInner.querySelector('[data-sol]');
    if (sol) sol.onclick = showSolution;
    const hf = $footInner.querySelector('[data-hintfoot]');
    if (hf) hf.onclick = () => { hintBtn.click(); footCheck(); hintBtn.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); };
  }

  function showSolution() {
    const s = current.step;
    current.sawSolution = true;
    setFoot('solution', `<div class="feedback"><div class="fb-ico">📘</div><div style="min-width:0;flex:1">
        <h3>Solución</h3>
        <div class="fb-text">${s.explain ? md(s.explain) : 'Estúdiala: este ejercicio volverá al final de la lección.'}${ctrl.solutionHtml()}</div></div></div>
      <div class="foot-actions"><button class="btn red" data-primary>Continuar</button></div>`);
    bindPrimary(() => {
      queue.push({ ...current });
      next(true);
    });
  }

  function showCombo(n) {
    const el = document.createElement('div');
    el.className = 'combo';
    el.textContent = `🔥 ¡${n} seguidas!`;
    root.appendChild(el);
    setTimeout(() => el.remove(), 1400);
  }

  function next(requeued = false) {
    if (current && current.step.t === 'teoria' && !requeued) { completed++; setProgress(); }
    if (!queue.length) return finish();
    showStep();
  }

  function fmtTime(ms) {
    const s = Math.round(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  function finish() {
    const r = { passed: true, mistakes, firstTry, answered, hints: hintsUsed, total };
    const result = (onFinish && onFinish(r)) || { xp: 0, stars: 3 };
    play('win');
    if (!exam || (result.grade && result.grade >= 4)) confetti();
    const acc = answered ? Math.round((firstTry / answered) * 100) : 100;
    const time = fmtTime(Date.now() - startedAt);
    const cards = exam
      ? `<div class="rcard" style="--c:${result.grade >= 4 ? 'var(--green)' : 'var(--red)'}"><div class="t">Nota</div><div class="v">📝 ${result.grade.toFixed(1)}</div></div>
         <div class="rcard" style="--c:var(--blue)"><div class="t">Correctas</div><div class="v">✅ ${firstTry}/${answered}</div></div>
         <div class="rcard" style="--c:var(--yellow)"><div class="t">XP ganada</div><div class="v">⚡ ${result.xp}</div></div>`
      : `<div class="rcard" style="--c:var(--yellow)"><div class="t">XP ganada</div><div class="v">⚡ ${result.xp}</div></div>
         <div class="rcard" style="--c:var(--green)"><div class="t">Precisión</div><div class="v">🎯 ${acc}%</div></div>
         <div class="rcard" style="--c:var(--blue)"><div class="t">Tiempo</div><div class="v">⏱️ ${time}</div></div>`;
    const heading = exam
      ? (result.grade >= 6 ? '¡Estás listo para la prueba!' : result.grade >= 4 ? '¡Aprobado! Sigue puliendo' : 'Aún no: repasemos')
      : (mistakes === 0 && hintsUsed === 0 ? '¡Nivel perfecto!' : '¡Nivel completado!');
    $ex.innerHTML = `
      <div class="result ${exam && result.grade < 4 ? 'fail' : ''}">
        ${mascot(exam && result.grade < 4 ? 'sad' : 'happy')}
        <h1>${heading}</h1>
        ${exam ? '' : `<div class="result-stars">${[1, 2, 3].map((i) => `<span class="${i <= result.stars ? '' : 'off'}">⭐</span>`).join('')}</div>`}
        <div class="result-cards">${cards}</div>
        ${!exam && hintsUsed ? `<p style="color:var(--text-soft);margin:0">💡 Usaste ${hintsUsed} ${hintsUsed === 1 ? 'pista' : 'pistas'}. ¡Bien por pedir ayuda! La próxima intenta con menos.</p>` : ''}
        ${result.extraHtml || ''}
      </div>`;
    root.querySelector('.lesson-top').style.visibility = 'hidden';
    setFoot('result', '<div></div><div class="foot-actions"><button class="btn" data-primary>Continuar</button></div>');
    bindPrimary(close);
    $ex.querySelectorAll('[data-result-action]').forEach((b) => {
      b.onclick = () => { close(); result.onAction && result.onAction(b.dataset.resultAction); };
    });
  }

  function showFail() {
    play('lose');
    if (onFinish) onFinish({ passed: false, mistakes, firstTry, answered, hints: hintsUsed, total });
    $ex.innerHTML = `
      <div class="result fail">
        ${mascot('sad')}
        <h1>Te quedaste sin vidas</h1>
        <p style="color:var(--text-soft);font-size:17px;margin:0">Equivocarse es parte de aprender. Esta vez usa las 💡 pistas antes de responder y repasa la 📖 guía de la unidad. ¡Tú puedes! 💪</p>
      </div>`;
    root.querySelector('.lesson-top').style.visibility = 'hidden';
    setFoot('result', `<div class="foot-actions" style="width:100%;justify-content:space-between">
      <button class="btn ghost gray" data-exit>Salir</button><button class="btn" data-primary>Reintentar</button></div>`);
    bindPrimary(() => { root.remove(); document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; runLesson(opts); });
    $footInner.querySelector('[data-exit]').onclick = close;
  }

  function onKey(e) {
    if (document.getElementById('modal-root').innerHTML) return;
    if (e.key === 'Enter' && !e.shiftKey && ['ok', 'solution', 'warn', 'result'].includes(footState)) {
      e.preventDefault();
      primaryAction && primaryAction();
    } else if (e.key === 'Enter' && footState === 'check' && ctrl && ctrl.teoria) {
      e.preventDefault();
      primaryAction && primaryAction();
    } else if (e.key === 'Escape') {
      root.querySelector('[data-quit]').click();
    }
  }
  document.addEventListener('keydown', onKey);

  root.querySelector('[data-quit]').onclick = () => {
    if (footState === 'result') return close();
    const m = openModal(`<div style="text-align:center">${mascot('sad')}<h2 style="padding:0">¡Espera, no te vayas!</h2>
      <p style="color:var(--text-soft)">Si sales ahora perderás el progreso de esta ${exam ? 'prueba' : 'lección'}.</p>
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:16px">
        <button class="btn blue" data-stay>Seguir ${exam ? 'respondiendo' : 'aprendiendo'}</button>
        <button class="link-btn" data-leave style="color:var(--red)">Salir</button></div></div>`);
    m.el.querySelector('.mascot').style.cssText = 'width:110px;height:110px';
    m.el.querySelector('[data-stay]').onclick = m.close;
    m.el.querySelector('[data-leave]').onclick = () => { m.close(); close(); };
  };

  setProgress();
  showStep();
}
