# FORKY

App web personal de entrenamiento de fuerza: pesos por máquina, temporizador de descanso entre
series, sesiones diarias, planes de semana y estadísticas de progreso. Instalable en el móvil,
funciona sin conexión y se sincroniza con Firebase.

Basada en V.I.T.A. (https://github.com/ivanvalbuena1997/VITA, v0.7.5), quitando toda la parte de
comida y de actividad/cuerpo, con una portada solo de entreno y estética futurista nueva.

## Probarla sin configurar nada

```
python3 -m http.server 8765
```

Abre `http://localhost:8765/?local&demo` (datos de ejemplo en memoria; no se guarda nada) o
`http://localhost:8765/?local` (vacía).

## Ponerla en marcha con tu cuenta (Firebase propio)

1. Crea un proyecto en https://console.firebase.google.com
2. **Authentication → Método de acceso →** activa **Google**. Copia el «ID de cliente web» que
   aparece en *Configuración del SDK web*.
3. **Firestore Database →** crea la base de datos. En **Reglas**, pega `firestore.rules` y publica.
4. **Configuración del proyecto → Tus apps →** añade una **app web** y copia `firebaseConfig`.
5. Pega `firebaseConfig` y el ID de cliente en `js/config.js`.
6. **Authentication → Configuración → Dominios autorizados →** añade el dominio donde la publiques
   (por ejemplo `tuusuario.github.io`).
7. Copia en Google Drive (opcional): en Google Cloud (el mismo proyecto) activa la **API de
   Google Drive** y añade el dominio a los «Orígenes autorizados de JavaScript» del cliente web.

## Estructura

| Ruta | Para qué |
|---|---|
| `index.html` · `css/forky.css` | Página y estilos (neón oscuro y claro) |
| `js/app.js` | Arranque, entrada con Google, pestañas, sincronización, Ajustes y copias |
| `js/hoy.js` | Portada: qué toca hoy, la semana, récords y última sesión |
| `js/entreno.js` · `js/plan-calc.js` · `js/semana-calc.js` | Entreno (registrar, planificar, máquinas) y Progreso (progresión, volumen, historial) |
| `js/hoja.js` | Ventana de confirmación |
| `js/drive.js` · `js/nube.js` | Copia semanal en Google Drive |
| `js/db.js` · `js/db-local.js` · `js/demo.js` | Firebase · sustituto en memoria para `?local` · datos de ejemplo |
| `js/model.js` · `js/backup.js` · `js/config.js` | Modelo y ajustes por defecto · copia de seguridad · configuración |
| `sw.js` · `manifest.webmanifest` | Sin conexión, instalación y aviso de versión nueva |

## Publicar cambios

Cada vez que cambie cualquier archivo, sube `VERSION` en `sw.js` y `APP_VERSION` en `js/model.js`.

## Pruebas

```
node tests/test_plan.mjs
```

Fuentes Orbitron y Rajdhani con licencia SIL OFL 1.1 (`fonts/`).
