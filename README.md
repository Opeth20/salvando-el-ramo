# ☕ Salvando el Ramo

App estilo Duolingo para aprender **DSY1102 · Desarrollo Orientado a Objetos** escribiendo código.
12 unidades · 37 niveles · ~200 ejercicios basados en la materia oficial (PPTs y guías del ramo).

Tipos de ejercicio (todos se responden escribiendo, nunca eligiendo):

| Tipo | Qué haces |
|---|---|
| ✏️ Completa el código | Rellenas los espacios en blanco dentro del código |
| 💬 Escríbelo en una línea | Escribes una instrucción completa |
| ⌨️ Escribe el código | Escribes métodos o clases completas en un editor con resaltado |
| 🐛 Corrige el error | El editor trae código con un bug y lo arreglas |
| 🖥️ ¿Qué imprime? | Lees el código y escribes la salida exacta de la consola |

Además: vidas ❤️, XP ⚡, racha 🔥, meta diaria, estrellas por nivel, repaso, "Saltar aquí", guía por unidad y logros.

## Probar en tu PC

Necesita un servidor (los módulos JS no funcionan abriendo el archivo directo):

```bash
python -m http.server 5500
```

Luego abre http://localhost:5500.

## Publicar en GitHub Pages (recomendado, sin Firebase)

La app funciona completa sin Firebase: tu progreso se guarda en el navegador y lo puedes pasar a otro
dispositivo con **Perfil → Respaldo** (copias un código `SER1:...` y lo pegas allá en *Restaurar*).

1. Sube esta carpeta a un repositorio de GitHub.
2. En el repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `(root)`** → Save.
3. En 1–2 minutos queda en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.

Cada `git push` actualiza la página sola.

## (Opcional) Firebase: login y progreso en la nube

Solo si más adelante quieres cuentas de verdad. Mientras `js/firebase-config.js` tenga los valores `TU_...`, la app ignora Firebase.

1. Entra a https://console.firebase.google.com y abre tu proyecto (o crea uno).
2. **Authentication → Comenzar → Sign-in method**: activa **Correo/contraseña** y **Google**.
3. **Firestore Database → Crear base de datos** (modo producción, región `southamerica-east1` o la que prefieras).
4. En **Firestore → Reglas**, pega el contenido de [`firestore.rules`](firestore.rules) y publica.
5. **⚙️ Configuración del proyecto → Tus apps → Web (</>)**, registra la app y copia el objeto `firebaseConfig` en [`js/firebase-config.js`](js/firebase-config.js).

> La `apiKey` de Firebase para web no es secreta: la protección real son las reglas de Firestore y los dominios autorizados.

## (Opcional) Publicar en Cloudflare Pages

**Opción A — Subida directa (sin instalar nada):**

1. https://dash.cloudflare.com → **Workers & Pages → Create → Pages → Upload assets**.
2. Nombre del proyecto: `salvando-el-ramo`.
3. Arrastra el **contenido** de esta carpeta (`index.html`, `css/`, `js/`). No hace falta subir `.claude/` ni `tests/`.
4. Deploy. Te quedará algo como `https://salvando-el-ramo.pages.dev`.

**Opción B — Desde GitHub (se actualiza solo con cada push):** sube la carpeta a un repo, y en Cloudflare elige **Connect to Git**. Build command: *(vacío)* · Output directory: `/`.

**Opción C — Wrangler** (requiere Node.js):

```bash
npx wrangler pages deploy . --project-name salvando-el-ramo
```

### ⚠️ Si usas Firebase

En Firebase → **Authentication → Settings → Authorized domains**, agrega el dominio donde publicaste
(por ejemplo `tu-usuario.github.io` o `salvando-el-ramo.pages.dev`). Sin esto, el login con Google falla con `auth/unauthorized-domain`.

## Agregar o editar ejercicios

El contenido está en `js/content/poo-1.js`, `poo-2.js` y `poo-3.js`. Cada ejercicio se arma con helpers (`fill`, `line`, `write`, `fix`, `out`, `teoria`) documentados en [`js/content/helpers.js`](js/content/helpers.js).

Después de editar, abre `http://localhost:5500/tests/selftest.html`: comprueba que cada solución pase sus propios requisitos y que cada código "a corregir" realmente falle.

## Próximos ramos

En "Ramos" ya aparecen como *Próximamente*: Base de Datos Aplicada I, Ingeniería de Requisitos y Matemática Aplicada. Para agregar uno, crea su archivo de contenido y súmalo a `COURSES` en [`js/courses.js`](js/courses.js).
