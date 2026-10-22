// Tokenizer, highlighter and answer checker for Java (and a bit of XML / SQL).

const WORD_START = /[A-Za-z_$áéíóúñÁÉÍÓÚÑüÜ]/;
const WORD_CHAR = /[A-Za-z0-9_$áéíóúñÁÉÍÓÚÑüÜ]/;

/** Splits source into tokens: word | num | str | chr | com | sym | ws */
export function tokenize(src, keepTrivia = false) {
  const out = [];
  let i = 0;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    const start = i;
    if (/\s/.test(c)) {
      while (i < n && /\s/.test(src[i])) i++;
      if (keepTrivia) out.push({ t: 'ws', v: src.slice(start, i) });
      continue;
    }
    if (c === '/' && src[i + 1] === '/') {
      while (i < n && src[i] !== '\n') i++;
      if (keepTrivia) out.push({ t: 'com', v: src.slice(start, i) });
      continue;
    }
    if (c === '/' && src[i + 1] === '*') {
      i += 2;
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++;
      i = Math.min(n, i + 2);
      if (keepTrivia) out.push({ t: 'com', v: src.slice(start, i) });
      continue;
    }
    if (c === '"' || c === "'") {
      i++;
      while (i < n && src[i] !== c && src[i] !== '\n') {
        if (src[i] === '\\') i++;
        i++;
      }
      if (src[i] === c) i++;
      out.push({ t: c === '"' ? 'str' : 'chr', v: src.slice(start, i) });
      continue;
    }
    if (/[0-9]/.test(c)) {
      while (i < n && /[0-9A-Za-z_.]/.test(src[i])) i++;
      out.push({ t: 'num', v: src.slice(start, i) });
      continue;
    }
    if (WORD_START.test(c)) {
      while (i < n && WORD_CHAR.test(src[i])) i++;
      out.push({ t: 'word', v: src.slice(start, i) });
      continue;
    }
    out.push({ t: 'sym', v: c });
    i++;
  }
  return out;
}

/** Canonical form: comments removed, a single space only between two word-like tokens (names, numbers, literals). */
export function tight(src) {
  const toks = tokenize(String(src ?? ''));
  let s = '';
  let prevWord = false;
  for (const tk of toks) {
    const isWord = tk.t === 'word' || tk.t === 'num' || tk.t === 'str' || tk.t === 'chr';
    if (isWord && prevWord) s += ' ';
    s += tk.v;
    prevWord = isWord;
  }
  return s;
}

/** Returns null when brackets are balanced, otherwise a friendly message. */
export function bracketProblem(src) {
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const names = { '(': 'un paréntesis "("', '[': 'un corchete "["', '{': 'una llave "{"' };
  const stack = [];
  for (const tk of tokenize(src)) {
    if (tk.t !== 'sym') continue;
    if ('([{'.includes(tk.v)) stack.push(tk.v);
    else if (pairs[tk.v]) {
      if (stack[stack.length - 1] !== pairs[tk.v]) {
        return `Sobra un "${tk.v}" o falta abrir su pareja. Revisa tus llaves y paréntesis.`;
      }
      stack.pop();
    }
  }
  if (stack.length) return `Te falta cerrar ${names[stack[stack.length - 1]]}.`;
  return null;
}

function toMatcher(p) {
  if (Array.isArray(p)) {
    const any = p.map(toMatcher);
    return (code) => any.some((m) => m(code));
  }
  if (p instanceof RegExp) return (code) => p.test(code);
  const lit = tight(p);
  return (code) => code.includes(lit);
}

/**
 * checks: array of [pattern, label] or {not: pattern, label}
 * pattern: string literal (compared after tight()) or RegExp (tested on tight code)
 */
export function runChecks(src, checks) {
  const code = tight(src);
  return checks.map((c) => {
    if (Array.isArray(c)) {
      return { label: c[1], ok: toMatcher(c[0])(code) };
    }
    return { label: c.label, ok: !toMatcher(c.not)(code) };
  });
}

export function sameToken(a, b) {
  return tight(a) === tight(b);
}

export function normalizeOutput(s) {
  const lines = String(s ?? '').replace(/\r/g, '').split('\n').map((l) => l.trim());
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  while (lines.length && lines[0] === '') lines.shift();
  return lines.join('\n');
}

/* ---------------- Highlighting ---------------- */

const JAVA_KW = new Set(('abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while var true false null record').split(' '));
const SQL_KW = new Set(('select from where insert into values update set delete create table database use primary key auto_increment not null int varchar decimal and or order by like drop alter join on as count limit desc asc').split(' '));

export function isKeyword(word) {
  return JAVA_KW.has(word);
}

export function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightXml(src) {
  return esc(src)
    .replace(/([\w:.-]+)=("[^"]*")/g, '\u0001$1\u0002=\u0003$2\u0004')
    .replace(/(&lt;\/?)([\w:.-]+)/g, '$1<span class="tk-tag">$2</span>')
    .replace(/\u0001/g, '<span class="tk-attr">').replace(/\u0003/g, '<span class="tk-str">')
    .replace(/[\u0002\u0004]/g, '</span>');
}

export function highlight(src, lang = 'java') {
  if (lang === 'xml') return highlightXml(src);
  if (lang === 'text') return esc(src);
  const toks = tokenize(src, true);
  let html = '';
  for (let i = 0; i < toks.length; i++) {
    const tk = toks[i];
    const v = esc(tk.v);
    if (tk.t === 'ws' || tk.t === 'sym') {
      html += v;
    } else if (tk.t === 'com') {
      html += `<span class="tk-com">${v}</span>`;
    } else if (tk.t === 'str' || tk.t === 'chr') {
      html += `<span class="tk-str">${v}</span>`;
    } else if (tk.t === 'num') {
      html += `<span class="tk-num">${v}</span>`;
    } else if (tk.t === 'word') {
      const prev = toks[i - 1];
      if (lang === 'sql') {
        html += SQL_KW.has(tk.v.toLowerCase()) ? `<span class="tk-kw">${v}</span>` : v;
      } else if (prev && prev.t === 'sym' && prev.v === '@') {
        html = html.slice(0, -1) + `<span class="tk-ann">@${v}</span>`;
      } else if (JAVA_KW.has(tk.v)) {
        html += `<span class="tk-kw">${v}</span>`;
      } else if (/^[A-Z]/.test(tk.v)) {
        html += `<span class="tk-type">${v}</span>`;
      } else {
        let j = i + 1;
        while (toks[j] && toks[j].t === 'ws') j++;
        if (toks[j] && toks[j].v === '(') html += `<span class="tk-fn">${v}</span>`;
        else html += v;
      }
    }
  }
  return html;
}
