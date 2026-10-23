// Marks technical words inside rendered text and explains them on hover / tap / focus.
import { GLOSSARY } from './content/glossary.js';
import { esc } from './code.js';

const byForm = new Map();
for (const g of GLOSSARY) for (const f of g.m) byForm.set(f.toLowerCase(), g);
// Longest forms first so "clase abstracta" wins over "clase".
const forms = [...byForm.keys()].sort((a, b) => b.length - a.length)
  .map((f) => f.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&'));
const RE = new RegExp(`(?<![\\p{L}\\p{N}_@.])(${forms.join('|')})(?![\\p{L}\\p{N}_])`, 'giu');

const SKIP = new Set(['PRE', 'TEXTAREA', 'INPUT', 'BUTTON', 'SCRIPT', 'STYLE', 'SVG', 'H1', 'H2']);

export function lookup(word) {
  return byForm.get(String(word).toLowerCase()) || null;
}

/**
 * Wraps the first appearance of each glossary term inside `root` (skipping code blocks and inputs).
 * Returns the list of terms found, in order.
 */
export function annotate(root, { seen = new Set() } = {}) {
  if (!root) return [];
  const found = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      for (let p = node.parentElement; p && p !== root.parentElement; p = p.parentElement) {
        if (SKIP.has(p.tagName) || p.classList.contains('term') || p.classList.contains('no-gloss') || p.classList.contains('code')) return NodeFilter.FILTER_REJECT;
      }
      return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    const text = node.nodeValue;
    RE.lastIndex = 0;
    let m;
    let last = 0;
    const frag = document.createDocumentFragment();
    let changed = false;
    while ((m = RE.exec(text))) {
      const g = lookup(m[1]);
      if (!g || seen.has(g.t)) continue;
      seen.add(g.t);
      found.push(g);
      frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      const span = document.createElement('span');
      span.className = 'term';
      span.tabIndex = 0;
      span.dataset.term = g.t;
      span.textContent = m[1];
      frag.appendChild(span);
      last = m.index + m[1].length;
      changed = true;
    }
    if (changed) {
      frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);
    }
  }
  return found;
}

/** "Abajo qué significa": a small list of the terms used in a card. */
export function glossaryListHtml(terms) {
  if (!terms.length) return '';
  return `<details class="gloss-list" open><summary>📚 Palabras clave de esta tarjeta (${terms.length})</summary><dl>${terms
    .map((g) => `<div><dt>${esc(g.t)}</dt><dd>${esc(g.d)}</dd></div>`).join('')}</dl></details>`;
}

/* ---------------- Tooltip ---------------- */

let tip = null;
let current = null;

function show(el) {
  const g = lookup(el.dataset.term);
  if (!g) return;
  if (!tip) {
    tip = document.createElement('div');
    tip.className = 'gloss-tip';
    tip.setAttribute('role', 'tooltip');
    document.body.appendChild(tip);
  }
  current = el;
  tip.innerHTML = `<b>${esc(g.t)}</b><span>${esc(g.d)}</span>`;
  tip.style.display = 'block';
  const r = el.getBoundingClientRect();
  const w = Math.min(320, window.innerWidth - 24);
  tip.style.width = `${w}px`;
  let left = r.left + r.width / 2 - w / 2;
  left = Math.max(12, Math.min(left, window.innerWidth - w - 12));
  tip.style.left = `${left}px`;
  const h = tip.offsetHeight;
  const below = r.bottom + 8 + h < window.innerHeight;
  tip.style.top = `${below ? r.bottom + 8 : Math.max(8, r.top - h - 8)}px`;
}

function hide() {
  if (tip) tip.style.display = 'none';
  current = null;
}

export function installTooltips() {
  document.addEventListener('mouseover', (e) => {
    const t = e.target.closest && e.target.closest('.term');
    if (t) show(t);
  });
  document.addEventListener('mouseout', (e) => {
    const t = e.target.closest && e.target.closest('.term');
    if (t && !t.contains(e.relatedTarget)) hide();
  });
  document.addEventListener('focusin', (e) => {
    if (e.target.classList && e.target.classList.contains('term')) show(e.target);
  });
  document.addEventListener('focusout', (e) => {
    if (e.target.classList && e.target.classList.contains('term')) hide();
  });
  // Touch screens: tap to open, tap elsewhere to close.
  document.addEventListener('click', (e) => {
    const t = e.target.closest && e.target.closest('.term');
    if (t) { e.preventDefault(); if (current === t) hide(); else show(t); return; }
    hide();
  }, true);
  window.addEventListener('scroll', hide, true);
}
