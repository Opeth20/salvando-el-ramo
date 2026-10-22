import poo1 from './content/poo-1.js';
import poo2 from './content/poo-2.js';
import poo3 from './content/poo-3.js';
import prueba1 from './content/poo-prueba.js';
import { COACH, MISSIONS, EXAM, MATERIAL } from './content/poo-extra.js';

export const PALETTE = {
  green: ['#58cc02', '#58a700'],
  purple: ['#ce82ff', '#a568cc'],
  blue: ['#1cb0f6', '#1899d6'],
  orange: ['#ff9600', '#e08600'],
  pink: ['#ff86d0', '#e070b5'],
  teal: ['#00cd9c', '#00a87f'],
  red: ['#ff4b4b', '#ea2b2b'],
  yellow: ['#ffc800', '#e5a400'],
};

function build(course, { coach = [], missions = [], exam = null, material = [] } = {}) {
  // Numbered units keep ids poo-u1..poo-u12 even when special units (with a `key`) are inserted between them.
  let n = 0;
  course.units.forEach((u, ui) => {
    if (u.key) {
      u.id = `${course.id}-${u.key}`;
      u.number = null;
      u.inExam = !!exam;
    } else {
      n++;
      u.id = `${course.id}-u${n}`;
      u.number = n;
      u.label = `Unidad ${n}`;
      u.coach = coach[n - 1] || null;
      u.mision = missions[n - 1] || null;
      u.inExam = !!exam && n <= exam.units;
    }
    if (u.mision) u.mision = { ...u.mision, id: `${u.id}-m` };
    u.index = ui;
    u.levels.forEach((l, li) => {
      l.id = `${u.id}-l${li + 1}`;
      l.index = li;
      l.unit = u;
      l.steps.forEach((s, si) => { s.id = `${l.id}-s${si + 1}`; });
    });
  });
  course.levels = course.units.flatMap((u) => u.levels);
  const examUnits = course.units.filter((u) => u.inExam);
  course.exam = exam && {
    ...exam,
    levels: examUnits.flatMap((u) => u.levels),
    units: examUnits,
  };
  const numbered = course.units.filter((u) => u.number);
  course.material = material.map((m) => ({
    file: m.file,
    levels: m.refs.flatMap(([ref, li]) => {
      const u = typeof ref === 'string' ? course.units.find((x) => x.key === ref) : numbered[ref - 1];
      return li ? [u.levels[li - 1]] : u.levels;
    }),
  }));
  return course;
}

export const COURSES = [
  build({
    id: 'poo',
    code: 'DSY1102',
    name: 'Desarrollo Orientado a Objetos',
    short: 'POO · Java',
    icon: '☕',
    color: 'green',
    // La Prueba 1 va después de "Colecciones y Gestor": usa todo lo de las unidades 4 a 8.
    units: [...poo1, ...poo2, prueba1, ...poo3],
  }, { coach: COACH, missions: MISSIONS, exam: EXAM, material: MATERIAL }),
];

// Ramos del semestre que aún no tienen contenido (inglés y antropología fuera, a pedido).
export const UPCOMING = [
  { code: 'BDY1101', name: 'Base de Datos Aplicada I', icon: '🗄️', color: 'blue' },
  { code: 'RQY1101', name: 'Ingeniería de Requisitos', icon: '📋', color: 'purple' },
  { code: 'MAT2121', name: 'Matemática Aplicada', icon: '📐', color: 'orange' },
];
