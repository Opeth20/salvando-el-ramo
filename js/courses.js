import poo1 from './content/poo-1.js';
import poo2 from './content/poo-2.js';
import poo3 from './content/poo-3.js';

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

function build(course) {
  course.units.forEach((u, ui) => {
    u.id = `${course.id}-u${ui + 1}`;
    u.index = ui;
    u.levels.forEach((l, li) => {
      l.id = `${u.id}-l${li + 1}`;
      l.index = li;
      l.unit = u;
      l.steps.forEach((s, si) => { s.id = `${l.id}-s${si + 1}`; });
    });
  });
  course.levels = course.units.flatMap((u) => u.levels);
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
    units: [...poo1, ...poo2, ...poo3],
  }),
];

// Ramos del semestre que aún no tienen contenido (inglés y antropología fuera, a pedido).
export const UPCOMING = [
  { code: 'BDY1101', name: 'Base de Datos Aplicada I', icon: '🗄️', color: 'blue' },
  { code: 'RQY1101', name: 'Ingeniería de Requisitos', icon: '📋', color: 'purple' },
  { code: 'MAT2121', name: 'Matemática Aplicada', icon: '📐', color: 'orange' },
];
