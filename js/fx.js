// Mascot, sounds and confetti.

const MOUTHS = {
  happy: '<path d="M48 78 Q60 92 72 78" stroke="#4b2a12" stroke-width="4" fill="#ff7a7a" stroke-linecap="round"/>',
  sad: '<path d="M49 86 Q60 76 71 86" stroke="#4b2a12" stroke-width="4" fill="none" stroke-linecap="round"/>',
  think: '<path d="M52 83 L68 81" stroke="#4b2a12" stroke-width="4" fill="none" stroke-linecap="round"/>',
};

export function mascot(mood = 'happy', cls = '') {
  const eyes = mood === 'sad'
    ? '<path d="M42 62 l10 4 M78 62 l-10 4" stroke="#4b2a12" stroke-width="3" stroke-linecap="round"/><circle cx="47" cy="70" r="5" fill="#2b1608"/><circle cx="73" cy="70" r="5" fill="#2b1608"/>'
    : '<circle cx="47" cy="68" r="7" fill="#fff"/><circle cx="73" cy="68" r="7" fill="#fff"/><circle cx="48.5" cy="69" r="4" fill="#2b1608"/><circle cx="74.5" cy="69" r="4" fill="#2b1608"/><circle cx="50" cy="67.5" r="1.3" fill="#fff"/><circle cx="76" cy="67.5" r="1.3" fill="#fff"/>';
  return `<svg class="mascot ${mood} ${cls}" viewBox="0 0 120 120" aria-hidden="true">
  <g class="steam" fill="none" stroke="#c9b7a6" stroke-width="4" stroke-linecap="round">
    <path d="M46 26 q-6 -8 0 -16"/><path d="M60 24 q-6 -8 0 -16"/><path d="M74 26 q-6 -8 0 -16"/>
  </g>
  <g class="cup">
    <ellipse cx="60" cy="110" rx="38" ry="6" fill="rgba(0,0,0,.08)"/>
    <path d="M92 52 h6 a14 14 0 0 1 0 28 h-6" fill="none" stroke="#e05a2a" stroke-width="7"/>
    <path d="M24 40 h72 l-6 58 a10 10 0 0 1 -10 9 h-40 a10 10 0 0 1 -10 -9 z" fill="#ff7b3d"/>
    <path d="M24 40 h72 l-1.2 11 h-69.6 z" fill="#e05a2a"/>
    <ellipse cx="60" cy="40" rx="36" ry="8" fill="#ffd2b3"/>
    <ellipse cx="60" cy="41" rx="30" ry="5.5" fill="#6b3a1c"/>
    <circle cx="38" cy="80" r="5" fill="#ff9d9d" opacity=".55"/><circle cx="82" cy="80" r="5" fill="#ff9d9d" opacity=".55"/>
    ${eyes}
    ${MOUTHS[mood] || MOUTHS.happy}
  </g>
</svg>`;
}

/* ---------------- Sound ---------------- */
let ctx = null;
let enabled = true;
export function setSound(on) { enabled = !!on; }

function tone(freq, start, dur, type = 'sine', gain = 0.12) {
  const t0 = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

export function play(name) {
  if (!enabled) return;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (name === 'ok') { tone(660, 0, 0.12, 'triangle'); tone(990, 0.09, 0.22, 'triangle'); }
    else if (name === 'bad') { tone(220, 0, 0.18, 'square', 0.06); tone(160, 0.12, 0.25, 'square', 0.05); }
    else if (name === 'win') { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.3, 'triangle', 0.1)); }
    else if (name === 'tap') { tone(880, 0, 0.05, 'sine', 0.05); }
    else if (name === 'lose') { [392, 330, 262].forEach((f, i) => tone(f, i * 0.16, 0.3, 'sawtooth', 0.05)); }
  } catch { /* audio not available */ }
}

/* ---------------- Confetti ---------------- */
export function confetti(amount = 140) {
  const canvas = document.getElementById('confetti');
  if (!canvas) return;
  const c2d = canvas.getContext('2d');
  const W = (canvas.width = innerWidth);
  const H = (canvas.height = innerHeight);
  const colors = ['#58cc02', '#1cb0f6', '#ffc800', '#ff4b4b', '#ce82ff', '#ff9600'];
  const parts = Array.from({ length: amount }, () => ({
    x: W / 2 + (Math.random() - 0.5) * W * 0.3,
    y: H * 0.35,
    vx: (Math.random() - 0.5) * 16,
    vy: -Math.random() * 15 - 5,
    s: Math.random() * 8 + 5,
    r: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.3,
    c: colors[(Math.random() * colors.length) | 0],
  }));
  let frame = 0;
  (function step() {
    c2d.clearRect(0, 0, W, H);
    for (const p of parts) {
      p.vy += 0.42; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      c2d.save(); c2d.translate(p.x, p.y); c2d.rotate(p.r);
      c2d.fillStyle = p.c; c2d.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      c2d.restore();
    }
    if (++frame < 200) requestAnimationFrame(step);
    else c2d.clearRect(0, 0, W, H);
  })();
}
