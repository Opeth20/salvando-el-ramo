// Lesson runner: shows steps one by one, checks answers, tracks hearts, and shows the result screen.
import { esc, highlight, runChecks, bracketProblem, sameToken, normalizeOutput } from './code.js';
import { createEditor } from './editor.js';
import { mascot, play, confetti } from './fx.js';
import { md, codeBlock, theoryHtml, openModal } from './ui.js';

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
      ${step.hint ? '<button class="link-btn" data-hint>💡 Pista</button>' : ''}
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
  const hintBtn = host.querySelector('[data-hint]');
  if (hintBtn) hintBtn.onclick = () => {
    if (!host.querySelector('.hint-box')) extra.insertAdjacentHTML('beforebegin', `<div class="hint-box">💡 ${md(step.hint)}</div>`);
  };
  const resetBtn = host.querySelector('[data-reset]');
  if (resetBtn) resetBtn.onclick = () => { editor.value = starter; editor.setState(null); extra.innerHTML = ''; changeCb(); editor.focus(); };

  return {
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

export function runLesson({ title, color, steps, hearts: maxHearts = 5, onFinish, onClose }) {
  const root = document.createElement('div');
  root.className = 'lesson';
  root.style.setProperty('--uc', color[0]);
  root.innerHTML = `
    <div class="lesson-top">
      <button class="icon-btn" data-quit aria-label="Salir">✕</button>
      <div class="bar" title="${esc(title)}"><span style="width:0%;background:var(--green)"></span></div>
      <div class="hearts"><span class="heart">❤️</span><span class="n">${maxHearts}</span></div>
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

  let queue = steps.map((s) => ({ step: s, tries: 0, sawSolution: false }));
  const total = queue.length;
  let completed = 0;
  let hearts = maxHearts;
  let mistakes = 0;
  let firstTry = 0;
  let answered = 0;
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
  }

  function setFoot(stateName, html) {
    footState = stateName;
    $foot.className = `lesson-foot fs-${stateName}`;
    $footInner.innerHTML = html;
  }

  function footCheck() {
    const isTeoria = ctrl && ctrl.teoria;
    setFoot('check', `<div></div><div class="foot-actions">
      <button class="btn ${isTeoria ? 'blue' : ''}" data-primary ${isTeoria || ctrl.canCheck() ? '' : 'disabled'}>${isTeoria ? '¡Entendido!' : 'Comprobar'}</button></div>`);
    const btn = $footInner.querySelector('[data-primary]');
    primaryAction = isTeoria ? next : submit;
    btn.onclick = () => primaryAction();
  }

  function refreshCheckButton() {
    if (footState !== 'check') {
      if (footState === 'bad' || footState === 'warn') footCheck();
      else return;
    }
    const btn = $footInner.querySelector('[data-primary]');
    if (btn && !(ctrl && ctrl.teoria)) btn.disabled = !ctrl.canCheck();
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
      <div class="step-host"></div>`;
    // Re-trigger the entry animation.
    $ex.style.animation = 'none'; void $ex.offsetWidth; $ex.style.animation = '';
    const host = $ex.querySelector('.step-host');
    ctrl = RENDERERS[s.t](s, host, {
      submit: () => { if (footState === 'check' && ctrl.canCheck()) submit(); },
      isChecking: () => footState === 'check',
    });
    ctrl.onChange(refreshCheckButton);
    footCheck();
    $body.scrollTop = 0;
    setTimeout(() => ctrl.focus(), 60);
  }

  function submit() {
    const s = current.step;
    const r = ctrl.check();
    if (r.warn) {
      setFoot('warn', `<div class="feedback"><div class="fb-ico">🧐</div><div><h3>¡Ojo!</h3><div class="fb-text">${esc(r.warn)}</div></div></div>
        <div class="foot-actions"><button class="btn yellow" data-primary>Seguir editando</button></div>`);
      primaryAction = () => { footCheck(); ctrl.focus(); };
      $footInner.querySelector('[data-primary]').onclick = () => primaryAction();
      return;
    }
    if (r.ok) {
      play('ok');
      if (current.tries === 0 && !current.sawSolution) { firstTry++; combo++; } else combo = 0;
      answered++;
      completed++;
      setProgress();
      if (combo >= 3) showCombo(combo);
      document.activeElement && document.activeElement.blur && document.activeElement.blur();
      setFoot('ok', `<div class="feedback"><div class="fb-ico">${pick(['🎉', '✨', '🙌', '💪', '🚀'])}</div><div>
          <h3>${pick(PRAISE)}</h3>
          ${s.explain ? `<div class="fb-text">${md(s.explain)}</div>` : ''}</div></div>
        <div class="foot-actions"><button class="btn" data-primary>Continuar</button></div>`);
      primaryAction = next;
      $footInner.querySelector('[data-primary]').onclick = () => primaryAction();
      return;
    }
    // Wrong answer
    play('bad');
    current.tries++;
    mistakes++;
    combo = 0;
    hearts = Math.max(0, hearts - 1);
    $hearts.querySelector('.n').textContent = hearts;
    $hearts.classList.remove('hit'); void $hearts.offsetWidth; $hearts.classList.add('hit');
    if (hearts === 0) {
      setTimeout(showFail, 650);
      setFoot('bad', `<div class="feedback"><div class="fb-ico">💔</div><div><h3>Sin vidas</h3><div class="fb-text">${esc(r.message || '')}</div></div></div><div class="foot-actions"></div>`);
      return;
    }
    setFoot('bad', `<div class="feedback"><div class="fb-ico">${pick(['😬', '🤔', '🙈'])}</div><div>
        <h3>${pick(OOPS)}</h3><div class="fb-text">${esc(r.message || 'Respuesta incorrecta.')}</div></div></div>
      <div class="foot-actions">
        <button class="btn ghost gray" data-sol>Ver solución</button>
        <button class="btn red" data-primary>Reintentar</button>
      </div>`);
    primaryAction = () => { footCheck(); ctrl.focus(); };
    $footInner.querySelector('[data-primary]').onclick = () => primaryAction();
    $footInner.querySelector('[data-sol]').onclick = showSolution;
  }

  function showSolution() {
    const s = current.step;
    current.sawSolution = true;
    setFoot('bad', `<div class="feedback"><div class="fb-ico">📘</div><div style="min-width:0;flex:1">
        <h3>Solución</h3>
        <div class="fb-text">${s.explain ? md(s.explain) : 'Estúdiala: este ejercicio volverá al final de la lección.'}${ctrl.solutionHtml()}</div></div></div>
      <div class="foot-actions"><button class="btn red" data-primary>Continuar</button></div>`);
    footState = 'solution';
    primaryAction = () => {
      queue.push({ ...current, tries: current.tries });
      next(true);
    };
    $footInner.querySelector('[data-primary]').onclick = () => primaryAction();
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
    const result = onFinish ? onFinish({ passed: true, mistakes, firstTry, answered, hearts }) : { xp: 0, stars: 3 };
    play('win');
    confetti();
    const acc = answered ? Math.round((firstTry / answered) * 100) : 100;
    $ex.innerHTML = `
      <div class="result">
        ${mascot('happy')}
        <h1>${mistakes === 0 ? '¡Nivel perfecto!' : '¡Nivel completado!'}</h1>
        <div class="result-stars">${[1, 2, 3].map((i) => `<span class="${i <= result.stars ? '' : 'off'}">⭐</span>`).join('')}</div>
        <div class="result-cards">
          <div class="rcard" style="--c:var(--yellow)"><div class="t">XP ganada</div><div class="v">⚡ ${result.xp}</div></div>
          <div class="rcard" style="--c:var(--green)"><div class="t">Precisión</div><div class="v">🎯 ${acc}%</div></div>
          <div class="rcard" style="--c:var(--blue)"><div class="t">Tiempo</div><div class="v">⏱️ ${fmtTime(Date.now() - startedAt)}</div></div>
        </div>
      </div>`;
    root.querySelector('.lesson-top').style.visibility = 'hidden';
    setFoot('result', '<div></div><div class="foot-actions"><button class="btn" data-primary>Continuar</button></div>');
    primaryAction = close;
    $footInner.querySelector('[data-primary]').onclick = () => primaryAction();
  }

  function showFail() {
    play('lose');
    if (onFinish) onFinish({ passed: false, mistakes, firstTry, answered, hearts: 0 });
    $ex.innerHTML = `
      <div class="result fail">
        ${mascot('sad')}
        <h1>Te quedaste sin vidas</h1>
        <p style="color:var(--text-soft);font-size:17px;margin:0">Equivocarse es parte de aprender. Repasa la guía de la unidad y vuelve a intentarlo. 💪</p>
      </div>`;
    root.querySelector('.lesson-top').style.visibility = 'hidden';
    setFoot('result', `<div class="foot-actions" style="width:100%;justify-content:space-between">
      <button class="btn ghost gray" data-exit>Salir</button><button class="btn" data-primary>Reintentar</button></div>`);
    primaryAction = () => { root.remove(); document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; runLesson({ title, color, steps, hearts: maxHearts, onFinish, onClose }); };
    $footInner.querySelector('[data-primary]').onclick = () => primaryAction();
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
      <p style="color:var(--text-soft)">Si sales ahora perderás el progreso de esta lección.</p>
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:16px">
        <button class="btn blue" data-stay>Seguir aprendiendo</button>
        <button class="link-btn" data-leave style="color:var(--red)">Salir de la lección</button></div></div>`);
    m.el.querySelector('.mascot').style.cssText = 'width:110px;height:110px';
    m.el.querySelector('[data-stay]').onclick = m.close;
    m.el.querySelector('[data-leave]').onclick = () => { m.close(); close(); };
  };

  setProgress();
  showStep();
}
