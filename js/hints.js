// Progressive hints, generated from each exercise's own solution and checks.
// Each hint is { title, html }; they go from a nudge to almost the answer, never the full solution.
import { tokenize, tight, isKeyword, esc, highlight, normalizeOutput } from './code.js';
import { md } from './ui.js';

const MASK = '_';

function maskWord(w, keep) {
  return w.length <= keep ? w : w.slice(0, keep) + MASK.repeat(w.length - keep);
}

/** Hides names and literals but keeps the shape: symbols, keywords and the first letter of each word. */
export function maskCode(src, { keepKeywords = true, revealRatio = 0 } = {}) {
  const toks = tokenize(src, true);
  const wordIdx = toks.map((t, i) => (t.t === 'word' || t.t === 'num' || t.t === 'str' || t.t === 'chr' ? i : -1)).filter((i) => i >= 0);
  const reveal = new Set(wordIdx.slice(0, Math.floor(wordIdx.length * revealRatio)));
  return toks.map((t, i) => {
    if (reveal.has(i) || t.t === 'ws' || t.t === 'sym' || t.t === 'com') return t.v;
    if (t.t === 'word') return keepKeywords && isKeyword(t.v) ? t.v : maskWord(t.v, 1);
    if (t.t === 'num') return MASK.repeat(t.v.length);
    // strings / chars: keep the quotes and spaces, show the first letter of each word
    const q = t.v[0];
    const inner = t.v.slice(1, t.v.endsWith(q) && t.v.length > 1 ? -1 : undefined);
    return q + inner.replace(/[^\s]+/g, (w) => maskWord(w, 1)) + (t.v.length > 1 && t.v.endsWith(q) ? q : '');
  }).join('');
}

/** Keeps structural lines (signatures, braces, annotations) and replaces the rest with a placeholder. */
function skeleton(src) {
  const out = [];
  let kept = 0;
  for (const line of src.split('\n')) {
    const t = line.trim();
    const structural = !t || t.endsWith('{') || t.startsWith('}') || t.startsWith('@') || t.startsWith('import ') || /^<\/?[\w:.-]+[^>]*>$/.test(t) && !/\/>$/.test(t);
    if (structural) { out.push(line); if (t) kept++; continue; }
    const indent = line.match(/^\s*/)[0];
    const ph = `${indent}// ✍️ ...`;
    if (out[out.length - 1] !== ph) out.push(ph);
  }
  return kept >= 2 ? out.join('\n') : null;
}

function requirementList(checks) {
  return `<ul class="checklist">${checks.map((c) => {
    const label = Array.isArray(c) ? c[1] : c.label;
    return `<li><span class="mark">•</span><span>${md(label)}</span></li>`;
  }).join('')}</ul>`;
}

/** First line of `starter` that does not appear (ignoring spaces) in the solution. */
function firstChangedLine(starter, solution) {
  const sol = new Set(solution.split('\n').map((l) => tight(l)).filter(Boolean));
  const lines = starter.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const t = tight(lines[i]);
    if (t && !sol.has(t)) return { n: i + 1, text: lines[i].trim() };
  }
  return null;
}

function changedSolutionLines(starter, solution) {
  const st = new Set(starter.split('\n').map((l) => tight(l)).filter(Boolean));
  return solution.split('\n').filter((l) => tight(l) && !st.has(tight(l))).map((l) => l.replace(/^\s+/, '')).join('\n');
}

const pre = (code, lang = 'java') => `<pre class="code">${highlight(code, lang)}</pre>`;

export function hintsFor(step) {
  const lang = step.lang || 'java';
  const custom = (step.hints || (step.hint ? [step.hint] : [])).map((h) => ({ title: '💡 Pista del profe', html: md(h) }));
  let auto = [];

  if (step.t === 'fill') {
    const blanks = [...step.code.matchAll(/\[\[(.+?)\]\]/g)].map((m) => m[1].split('|')[0]);
    auto = [
      { title: '🔤 Primera letra', html: `<ol>${blanks.map((b) => `<li><code>${esc(maskWord(b, 1))}</code> (${b.length} caracteres)</li>`).join('')}</ol>` },
      { title: '🔤 Media palabra', html: `<ol>${blanks.map((b) => `<li><code>${esc(maskWord(b, Math.ceil(b.length / 2)))}</code></li>`).join('')}</ol>` },
    ];
  } else if (step.t === 'line') {
    auto = [
      { title: '🧩 La forma', html: `Tu línea tiene esta forma (cada <code>_</code> es una letra):${pre(maskCode(step.solution), lang)}` },
      { title: '🔤 Más letras', html: pre(maskCode(step.solution, { revealRatio: 0.5 }), lang) },
    ];
  } else if (step.t === 'write') {
    const sk = skeleton(step.solution);
    auto = [
      sk
        ? { title: '🧩 La estructura', html: `Parte por este esqueleto y rellena cada <code>// ✍️ ...</code>:${pre(sk, lang)}` }
        : { title: '🧩 La forma', html: `Cada <code>_</code> es una letra que falta:${pre(maskCode(step.solution), lang)}` },
      { title: '🧭 Qué necesitas', html: `Tu código tiene que cumplir esto:${requirementList(step.checks)}` },
      { title: '🔤 Casi listo', html: `Cada <code>_</code> es una letra que falta:${pre(maskCode(step.solution, { revealRatio: sk ? 0 : 0.5 }), lang)}` },
    ];
  } else if (step.t === 'fix') {
    const where = firstChangedLine(step.starter || '', step.solution);
    const fixed = changedSolutionLines(step.starter || '', step.solution);
    auto = [
      where
        ? { title: '🔎 Dónde mirar', html: `El problema está en la <b>línea ${where.n}</b>: <code>${esc(where.text)}</code>` }
        : { title: '🔎 Dónde mirar', html: 'Falta agregar algo: compara el código con lo que pide el enunciado.' },
      { title: '🧭 Qué debe cumplir', html: requirementList(step.checks) },
      fixed && { title: '🔤 Casi listo', html: `Las líneas corregidas se ven así:${pre(maskCode(fixed), lang)}` },
    ].filter(Boolean);
  } else if (step.t === 'explain') {
    const words = String(step.model).replace(/[*`]/g, '').split(/\s+/);
    auto = [
      { title: '🧭 Ideas que debes incluir', html: `Tu explicación debe mencionar:${requirementList(step.ideas.map(([, label]) => [null, label]))}` },
      { title: '✍️ Empieza así', html: `<i>"${esc(words.slice(0, Math.min(9, Math.ceil(words.length / 3))).join(' '))}…"</i> y sigue con tus palabras.` },
    ];
  } else if (step.t === 'output') {
    const lines = normalizeOutput(step.answer).split('\n');
    auto = [
      { title: '🧠 Cómo pensarlo', html: `Recorre el código línea por línea como si fueras la JVM. Cada <code>println</code> es una línea; <code>print</code> no salta de línea. La consola muestra <b>${lines.length} ${lines.length === 1 ? 'línea' : 'líneas'}</b>.` },
      { title: '👀 Primera línea', html: `La primera línea es:<pre class="code">${esc(lines[0])}</pre>` },
    ];
  }
  return [...custom, ...auto].slice(0, 3);
}
