// Shared UI helpers.
import { esc, highlight } from './code.js';
import { annotate, glossaryListHtml } from './glossary.js';

export function md(text) {
  return String(text ?? '')
    .split(/(`[^`]+`)/g)
    .map((part) => (part.startsWith('`') && part.endsWith('`') && part.length > 1
      ? `<code>${esc(part.slice(1, -1))}</code>`
      : part.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')))
    .join('');
}

const KNOWN_TYPES = new Set(['String', 'System', 'Math', 'ArrayList', 'List', 'Integer', 'Double', 'Boolean', 'Character', 'Main',
  'IllegalArgumentException', 'Exception', 'NumberFormatException']);

/**
 * Python Tutor link that opens the code ready to run step by step, or null if it can't run on its own
 * (custom classes defined elsewhere, Scanner input, JavaFX, SQL…).
 */
export function tutorUrl(code, lang = 'java') {
  if (lang !== 'java' || /Scanner|javafx|Stage|FXML|Connection|ResultSet|ObjectMapper|@FXML/.test(code)) return null;
  let src = code;
  if (!/static\s+void\s+main\s*\(/.test(src)) {
    if (/\bclass\s|\binterface\s/.test(src)) return null;
    const custom = (src.replace(/"[^"]*"/g, '').match(/\b[A-Z]\w*/g) || []).filter((w) => !KNOWN_TYPES.has(w));
    if (custom.length) return null;
    const body = src.split('\n').map((l) => `        ${l}`).join('\n');
    src = `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n${body}\n    }\n}`;
  }
  return `https://pythontutor.com/visualize.html#code=${encodeURIComponent(src)}&mode=display&origin=opt-frontend.js&py=java&rawInputLstJSON=%5B%5D&cumulative=false&curInstr=0`;
}

export function tutorButton(code, lang, label = '👀 Verlo ejecutarse paso a paso') {
  const url = tutorUrl(code, lang);
  return url ? `<a class="tutor-btn" href="${url}" target="_blank" rel="noopener">${label}</a>` : '';
}

export function codeBlock(code, lang = 'java', { tutor = false } = {}) {
  return `<pre class="code">${highlight(code, lang)}</pre>${tutor ? tutorButton(code, lang) : ''}`;
}

function memoHtml(m) {
  return `<div class="memo">
    <div class="memo-title">🧠 Para recordar</div>
    <p>💭 ${md(m.analogy)}</p>
    ${m.diagram ? `<div class="no-gloss">${m.diagram}</div>` : ''}
    <p class="memo-key">🔑 ${md(m.remember)}</p>
  </div>`;
}

export function theoryHtml(step) {
  return step.parts.map((p) => {
    if (typeof p === 'string') return `<div>${md(p)}</div>`;
    if (p.memo) return memoHtml(p.memo);
    return codeBlock(p.code, p.lang, { tutor: true });
  }).join('');
}

/** Marks technical words (tooltips) and, if `list`, adds the "palabras clave" box at the end. */
export function enrich(el, { list = false, seen } = {}) {
  if (!el) return [];
  const terms = annotate(el, seen ? { seen } : undefined);
  if (list && terms.length) el.insertAdjacentHTML('beforeend', glossaryListHtml(terms));
  return terms;
}

export function toast(msg, ms = 2600) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), ms);
}

export function openModal(html, { onClose } = {}) {
  const root = document.getElementById('modal-root');
  root.innerHTML = `<div class="modal-back"><div class="modal" role="dialog" aria-modal="true">
    <button class="icon-btn close" data-close aria-label="Cerrar">✕</button>${html}</div></div>`;
  const close = () => { root.innerHTML = ''; onClose && onClose(); };
  root.querySelector('[data-close]').onclick = close;
  root.querySelector('.modal-back').onclick = (e) => { if (e.target.classList.contains('modal-back')) close(); };
  return { el: root.querySelector('.modal'), close };
}
