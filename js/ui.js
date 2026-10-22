// Shared UI helpers.
import { esc, highlight } from './code.js';

export function md(text) {
  return String(text ?? '')
    .split(/(`[^`]+`)/g)
    .map((part) => (part.startsWith('`') && part.endsWith('`') && part.length > 1
      ? `<code>${esc(part.slice(1, -1))}</code>`
      : part.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')))
    .join('');
}

export function codeBlock(code, lang = 'java') {
  return `<pre class="code">${highlight(code, lang)}</pre>`;
}

export function theoryHtml(step) {
  return step.parts.map((p) => (typeof p === 'string' ? `<div>${md(p)}</div>` : codeBlock(p.code, p.lang))).join('');
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
