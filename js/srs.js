// Spaced repetition (Leitner boxes) + error notebook.
// Every answered exercise gets a box. Right on the first try → next box (longer wait).
// Wrong → back to box 1 (tomorrow). With hints → stays where it is, but comes back tomorrow.
//
// Intervals are short on purpose: the exam is ~2 weeks away, and for that horizon the best gap
// between reviews is a few days (Cepeda et al., 2008: ~20–40% of the time until the test).

export const INTERVALS = [0, 1, 2, 4, 7, 14]; // days, by box 1..5

function addDays(day, n) {
  const [y, m, d] = day.split('-').map(Number);
  const dt = new Date(y, m - 1, d + n);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

/** results: [{ id, ok, hinted }] from a lesson. */
export function recordResults(progress, results, today) {
  progress.srs = progress.srs || {};
  for (const r of results) {
    const card = progress.srs[r.id] || { box: 0, seen: 0, wrong: 0 };
    card.seen++;
    card.last = today;
    if (!r.ok) {
      card.box = 1;
      card.wrong++;
      card.lastWrong = today;
    } else if (r.hinted) {
      card.box = Math.max(1, card.box);
    } else {
      card.box = Math.min(5, card.box + 1);
    }
    card.due = addDays(today, r.ok && !r.hinted ? INTERVALS[card.box] : 1);
    progress.srs[r.id] = card;
  }
}

/** Pushes every exercise of a level back to "tomorrow" (used when the student says it wasn't clear). */
export function resetLevel(progress, level, today) {
  progress.srs = progress.srs || {};
  for (const s of level.steps) {
    if (s.t === 'teoria') continue;
    const card = progress.srs[s.id] || { box: 1, seen: 0, wrong: 0 };
    card.box = 1;
    card.due = addDays(today, 1);
    progress.srs[s.id] = card;
  }
}

export function dueSteps(course, progress, today) {
  const srs = progress.srs || {};
  return Object.entries(srs)
    .filter(([id, c]) => c.due && c.due <= today && course.stepById.has(id))
    .sort(([, a], [, b]) => (b.wrong - a.wrong) || (a.box - b.box) || (a.due < b.due ? -1 : 1))
    .map(([id]) => course.stepById.get(id));
}

export function mistakeSteps(course, progress) {
  const srs = progress.srs || {};
  return Object.entries(srs)
    .filter(([id, c]) => c.wrong > 0 && course.stepById.has(id))
    .sort(([, a], [, b]) => (b.lastWrong || '').localeCompare(a.lastWrong || '') || b.wrong - a.wrong)
    .map(([id]) => course.stepById.get(id));
}

/** Levels where the student fails the most (only those with enough answers). */
export function weakLevels(course, progress, limit = 3) {
  const srs = progress.srs || {};
  const rows = course.levels.map((l) => {
    let seen = 0;
    let wrong = 0;
    for (const s of l.steps) {
      const c = srs[s.id];
      if (c) { seen += c.seen; wrong += c.wrong; }
    }
    return { level: l, seen, wrong, rate: seen ? wrong / seen : 0 };
  }).filter((r) => r.seen >= 3 && r.wrong > 0);
  return rows.sort((a, b) => b.rate - a.rate).slice(0, limit);
}

/** Mixes topics (interleaving) while keeping the most urgent first overall. */
export function interleave(steps, max = 15) {
  const byUnit = new Map();
  for (const s of steps) {
    const u = s.id.split('-l')[0];
    if (!byUnit.has(u)) byUnit.set(u, []);
    byUnit.get(u).push(s);
  }
  const queues = [...byUnit.values()];
  const out = [];
  while (out.length < max && queues.some((q) => q.length)) {
    for (const q of queues) if (q.length && out.length < max) out.push(q.shift());
  }
  return out;
}
