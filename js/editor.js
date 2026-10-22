// Lightweight code editor: textarea over a highlighted <pre>, with auto-indent and bracket pairing.
import { highlight } from './code.js';

const PAIRS = { '(': ')', '[': ']', '{': '}', '"': '"' };
const CLOSERS = new Set([')', ']', '}', '"']);
const INDENT = '    ';

function insert(ta, text) {
  ta.focus();
  // execCommand keeps the native undo stack working; fall back to setRangeText.
  if (!document.execCommand || !document.execCommand('insertText', false, text)) {
    ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, 'end');
    ta.dispatchEvent(new Event('input'));
  }
}

export function createEditor({ value = '', lang = 'java', onSubmit, minLines = 6 }) {
  const wrap = document.createElement('div');
  wrap.className = 'editor';
  wrap.innerHTML = '<div class="gutter"></div><pre class="layer" aria-hidden="true"></pre><textarea class="layer" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-label="Editor de código"></textarea>';
  const gutter = wrap.querySelector('.gutter');
  const pre = wrap.querySelector('pre');
  const ta = wrap.querySelector('textarea');
  ta.value = value;

  function render() {
    const v = ta.value;
    pre.innerHTML = highlight(v, lang) + '\n';
    const lines = Math.max(v.split('\n').length, minLines);
    gutter.innerHTML = Array.from({ length: lines }, (_, i) => `<div>${i + 1}</div>`).join('');
    ta.style.height = 'auto';
    const lineH = parseFloat(getComputedStyle(ta).lineHeight) || 24;
    ta.style.height = Math.max(ta.scrollHeight, lines * lineH + 28) + 'px';
    pre.scrollLeft = ta.scrollLeft;
  }

  ta.addEventListener('input', render);
  ta.addEventListener('scroll', () => { pre.scrollLeft = ta.scrollLeft; });

  ta.addEventListener('keydown', (e) => {
    const { selectionStart: s, selectionEnd: end, value: v } = ta;
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      onSubmit && onSubmit();
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        const lineStart = v.lastIndexOf('\n', s - 1) + 1;
        const m = v.slice(lineStart).match(/^ {1,4}/);
        if (m) {
          ta.setSelectionRange(lineStart, lineStart + m[0].length);
          insert(ta, '');
          ta.setSelectionRange(Math.max(lineStart, s - m[0].length), Math.max(lineStart, s - m[0].length));
        }
      } else {
        insert(ta, INDENT);
      }
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const lineStart = v.lastIndexOf('\n', s - 1) + 1;
      const indent = (v.slice(lineStart, s).match(/^\s*/) || [''])[0];
      const before = v[s - 1];
      const after = v[end];
      if (before === '{' && after === '}') {
        insert(ta, '\n' + indent + INDENT + '\n' + indent);
        const pos = s + 1 + indent.length + INDENT.length;
        ta.setSelectionRange(pos, pos);
      } else if (before === '{') {
        insert(ta, '\n' + indent + INDENT);
      } else {
        insert(ta, '\n' + indent);
      }
      return;
    }
    if (e.key === 'Backspace' && s === end && s > 0) {
      const lineStart = v.lastIndexOf('\n', s - 1) + 1;
      const head = v.slice(lineStart, s);
      if (head.length && /^ +$/.test(head) && head.length % 4 === 0) {
        e.preventDefault();
        ta.setSelectionRange(s - 4, s);
        insert(ta, '');
        return;
      }
      if (PAIRS[v[s - 1]] && PAIRS[v[s - 1]] === v[s]) {
        e.preventDefault();
        ta.setSelectionRange(s - 1, s + 1);
        insert(ta, '');
        return;
      }
    }
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      if (CLOSERS.has(e.key) && s === end && v[s] === e.key) {
        e.preventDefault();
        ta.setSelectionRange(s + 1, s + 1);
        return;
      }
      if (e.key === '}' && s === end) {
        const lineStart = v.lastIndexOf('\n', s - 1) + 1;
        const head = v.slice(lineStart, s);
        if (/^ {4,}$/.test(head)) {
          e.preventDefault();
          ta.setSelectionRange(s - 4, s);
          insert(ta, '}');
          return;
        }
      }
      if (PAIRS[e.key] && s === end) {
        const next = v[s] || '';
        const prev = v[s - 1] || '';
        const okNext = !next || /[\s)\]};,]/.test(next);
        const quoteOk = e.key !== '"' || !/[\w"]/.test(prev);
        if (okNext && quoteOk) {
          e.preventDefault();
          insert(ta, e.key + PAIRS[e.key]);
          ta.setSelectionRange(s + 1, s + 1);
        }
      }
    }
  });

  render();
  requestAnimationFrame(render);

  return {
    el: wrap,
    textarea: ta,
    get value() { return ta.value; },
    set value(v) { ta.value = v; render(); },
    insert(text) { insert(ta, text); },
    focus() { ta.focus(); },
    setState(state) { wrap.classList.remove('ok', 'bad'); if (state) wrap.classList.add(state); },
    refresh: render,
  };
}
