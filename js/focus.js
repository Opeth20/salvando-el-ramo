// "Modo enfoque": a focus / break timer that floats over the page (Pomodoro-style, optional).
import { play } from './fx.js';
import { toast, openModal } from './ui.js';

let timer = null;
let pill = null;

function fmt(s) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function focusRunning() {
  return !!timer;
}

export function stopFocus() {
  clearInterval(timer);
  timer = null;
  if (pill) { pill.remove(); pill = null; }
}

function run(seconds, label, onEnd) {
  clearInterval(timer);
  if (!pill) {
    pill = document.createElement('div');
    pill.className = 'focus-pill';
    document.body.appendChild(pill);
  }
  let left = seconds;
  const draw = () => {
    pill.innerHTML = `<span>${label}</span><b>${fmt(left)}</b><button aria-label="Detener">✕</button>`;
    pill.querySelector('button').onclick = stopFocus;
  };
  draw();
  timer = setInterval(() => {
    left--;
    if (left <= 0) { clearInterval(timer); timer = null; onEnd(); return; }
    draw();
  }, 1000);
}

/** work and rest in minutes */
export function startFocus(work = 25, rest = 5) {
  run(work * 60, '🎯 Enfoque', () => {
    play('win');
    const m = openModal(`<h2>⏸️ ¡Pausa de ${rest} minutos!</h2>
      <p style="color:var(--text-soft)">Párate, toma agua y mira lejos de la pantalla. No revises el celular: deja que el cerebro descanse.</p>
      <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:16px">
        <button class="btn ghost gray" data-stop>Terminar por hoy</button><button class="btn" data-rest>Empezar pausa</button></div>`);
    m.el.querySelector('[data-stop]').onclick = () => { m.close(); stopFocus(); toast('¡Buen trabajo! Dormir bien también es estudiar 😴'); };
    m.el.querySelector('[data-rest]').onclick = () => {
      m.close();
      run(rest * 60, '☕ Pausa', () => {
        play('ok');
        stopFocus();
        toast('Pausa terminada. Vuelve con el 🔁 Repaso del día o el siguiente nivel 💪', 5000);
      });
    };
  });
  toast(`Modo enfoque: ${work} minutos sin distracciones 🎯`);
}

export function openFocusPicker() {
  if (focusRunning()) { toast('Ya tienes un temporizador corriendo (abajo a la izquierda)'); return; }
  const m = openModal(`<h2>⏱️ Modo enfoque</h2>
    <p style="color:var(--text-soft)">Estudia un bloque sin distracciones y luego descansa. Deja el celular lejos y en silencio.</p>
    <div style="display:grid;gap:10px;margin-top:14px">
      <button class="btn" data-f="25,5">25 min estudio + 5 de pausa</button>
      <button class="btn blue" data-f="50,10">50 min estudio + 10 de pausa</button>
      <button class="btn ghost" data-f="15,3">15 min (un empujón rápido)</button>
    </div>
    <p style="color:var(--text-soft);font-size:13px;margin-top:12px">La evidencia sobre el pomodoro es mixta: lo que más ayuda es estudiar sin interrupciones y con pausas planificadas. Usa el bloque que te acomode.</p>`);
  m.el.querySelectorAll('[data-f]').forEach((b) => {
    b.onclick = () => { const [w, r] = b.dataset.f.split(',').map(Number); m.close(); startFocus(w, r); };
  });
}
