// Small builders so course files read like a lesson plan.
//
// Exercise kinds (all of them require typing — no multiple choice):
//   teoria  – concept card shown before practice
//   fill    – complete the blanks inside code. Blanks: [[answer]] or [[answer|alternative]]
//   line    – write a single line of code
//   write   – write a block of code in the editor (validated by checks)
//   fix     – the editor starts with buggy code; repair it (validated by checks)
//   output  – read code and type exactly what it prints
//
// checks: [pattern, label] | {not: pattern, label}
//   pattern = 'literal'  (compared ignoring spaces/comments)
//           | ['alt1', 'alt2']  (any of these literals)
//           | /regex/  (tested on the space-less form of the code)

export const c = (code, lang = 'java') => ({ code, lang });

export const teoria = (title, ...parts) => ({ t: 'teoria', title, parts });
export const fill = (prompt, code, o = {}) => ({ t: 'fill', prompt, code, ...o });
export const line = (prompt, o) => ({ t: 'line', prompt, ...o });
export const write = (prompt, o) => ({ t: 'write', prompt, ...o });
export const fix = (prompt, o) => ({ t: 'fix', prompt, ...o });
export const out = (prompt, code, answer, o = {}) => ({ t: 'output', prompt, code, answer, ...o });

export const level = (title, icon, steps, o = {}) => ({ title, icon, steps, ...o });
export const unit = (title, desc, color, levels) => ({ title, desc, color, levels });

// explain – "Explícalo con tus palabras": free text checked for key ideas (Feynman / self-explanation).
//   ideas: [[/regex sobre texto sin tildes y en minúsculas/, 'idea'], ...] · min: cuántas ideas exigir · model: respuesta modelo
export const explica = (prompt, o) => ({ t: 'explain', prompt, ...o });
