// Auth + progress persistence. Uses Firebase when configured, localStorage otherwise.
import { firebaseConfig } from './firebase-config.js';

const SDK = 'https://www.gstatic.com/firebasejs/10.12.2';
export const firebaseEnabled = !String(firebaseConfig.apiKey || '').startsWith('TU_');

let fb = null; // { auth, db, mod }

async function loadFirebase() {
  if (fb) return fb;
  const [appMod, authMod, fsMod] = await Promise.all([
    import(`${SDK}/firebase-app.js`),
    import(`${SDK}/firebase-auth.js`),
    import(`${SDK}/firebase-firestore.js`),
  ]);
  const app = appMod.initializeApp(firebaseConfig);
  fb = { auth: authMod.getAuth(app), db: fsMod.getFirestore(app), authMod, fsMod };
  return fb;
}

const LOCAL_USER_KEY = 'ser.localUser';
const progressKey = (uid) => `ser.progress.${uid}`;

function safeGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function safeSet(key, value) {
  try { localStorage.setItem(key, value); } catch { /* storage unavailable */ }
}
function safeRemove(key) {
  try { localStorage.removeItem(key); } catch { /* storage unavailable */ }
}

/** Calls cb(user|null). user = { uid, name, email, photo, local } */
export async function watchAuth(cb) {
  if (!firebaseEnabled) {
    const raw = safeGet(LOCAL_USER_KEY);
    cb(raw ? JSON.parse(raw) : null);
    return;
  }
  const { auth, authMod } = await loadFirebase();
  authMod.onAuthStateChanged(auth, (u) => {
    if (u) cb({ uid: u.uid, name: u.displayName || (u.email || '').split('@')[0], email: u.email, photo: u.photoURL, local: false });
    else {
      const raw = safeGet(LOCAL_USER_KEY);
      cb(raw ? JSON.parse(raw) : null);
    }
  });
}

export async function loginGoogle() {
  const { auth, authMod } = await loadFirebase();
  const provider = new authMod.GoogleAuthProvider();
  await authMod.signInWithPopup(auth, provider);
}

export async function loginEmail(email, pass) {
  const { auth, authMod } = await loadFirebase();
  await authMod.signInWithEmailAndPassword(auth, email, pass);
}

export async function registerEmail(name, email, pass) {
  const { auth, authMod } = await loadFirebase();
  const cred = await authMod.createUserWithEmailAndPassword(auth, email, pass);
  if (name) await authMod.updateProfile(cred.user, { displayName: name });
}

export async function resetPassword(email) {
  const { auth, authMod } = await loadFirebase();
  await authMod.sendPasswordResetEmail(auth, email);
}

export function loginGuest(name) {
  const user = { uid: 'local', name: name || 'Invitado', email: null, photo: null, local: true };
  safeSet(LOCAL_USER_KEY, JSON.stringify(user));
  return user;
}

export async function logout() {
  safeRemove(LOCAL_USER_KEY);
  if (firebaseEnabled) {
    const { auth, authMod } = await loadFirebase();
    await authMod.signOut(auth);
  }
}

export function authErrorMessage(err) {
  const code = err && err.code ? err.code : '';
  const map = {
    'auth/invalid-email': 'El correo no es válido.',
    'auth/missing-password': 'Escribe tu contraseña.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth/email-already-in-use': 'Ese correo ya tiene cuenta. Inicia sesión.',
    'auth/invalid-credential': 'Correo o contraseña incorrectos.',
    'auth/wrong-password': 'Correo o contraseña incorrectos.',
    'auth/user-not-found': 'No existe una cuenta con ese correo.',
    'auth/too-many-requests': 'Demasiados intentos. Espera un poco.',
    'auth/popup-closed-by-user': 'Cerraste la ventana de Google.',
    'auth/unauthorized-domain': 'Este dominio no está autorizado en Firebase (Authentication → Settings → Authorized domains).',
    'auth/network-request-failed': 'Sin conexión. Revisa tu internet.',
  };
  return map[code] || (err && err.message) || 'Ocurrió un error.';
}

/* ---------------- Progress ---------------- */

export function emptyProgress() {
  return {
    xp: 0,
    streak: 0,
    lastDay: null,
    daily: { day: null, xp: 0 },
    dailyGoal: 30,
    levels: {},      // levelId -> { done, stars, times, at }
    missions: {},    // missionId -> { at }
    missionSteps: {},
    simulacros: [],  // { at, grade, correct, total }
    stats: { exercises: 0, correct: 0, lessons: 0, perfect: 0 },
    sound: true,
    updatedAt: 0,
  };
}

export async function loadProgress(user) {
  const local = safeGet(progressKey(user.uid));
  let data = local ? JSON.parse(local) : null;
  if (!user.local && firebaseEnabled) {
    try {
      const { db, fsMod } = await loadFirebase();
      const snap = await fsMod.getDoc(fsMod.doc(db, 'users', user.uid));
      if (snap.exists()) {
        const remote = snap.data().progress;
        if (remote && (!data || (remote.updatedAt || 0) >= (data.updatedAt || 0))) data = remote;
      }
    } catch (e) {
      console.warn('No se pudo leer el progreso remoto', e);
    }
  }
  return { ...emptyProgress(), ...(data || {}) };
}

let saveTimer = null;
export function saveProgress(user, progress) {
  progress.updatedAt = Date.now();
  safeSet(progressKey(user.uid), JSON.stringify(progress));
  if (user.local || !firebaseEnabled) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      const { db, fsMod } = await loadFirebase();
      await fsMod.setDoc(fsMod.doc(db, 'users', user.uid), {
        name: user.name || null,
        progress,
      }, { merge: true });
    } catch (e) {
      console.warn('No se pudo guardar en Firebase', e);
    }
  }, 800);
}
