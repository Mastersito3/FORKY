/* Configuración de TU proyecto de Firebase (rellénala antes de publicar).
   Firebase → Configuración del proyecto → Tus apps → App web → «firebaseConfig».
   Estos valores no son secretos: identifican el proyecto. Lo que protege los
   datos son las reglas de Firestore (archivo firestore.rules: cada usuario
   solo puede leer y escribir lo suyo).
   Mientras estén vacíos, la app solo funciona en el modo de prueba local
   (http://localhost:8765/?local&demo). */
export const firebaseConfig = {
  apiKey: "AIzaSyBVOqtkMJ8_v3Uf4f5PkpkbpPWMsCBOmMs",
  authDomain: "forky-a02f0.firebaseapp.com",
  projectId: "forky-a02f0",
  storageBucket: "forky-a02f0.firebasestorage.app",
  messagingSenderId: "900968559175",
  appId: "1:900968559175:web:e12b9c7000e9a6520bf762"
};

/* Versión del SDK web de Firebase. Si se cambia, hay que subir también la
   versión de la caché en sw.js. */
export const FIREBASE_SDK = "13.0.0";

/* «ID de cliente web» de Google (Firebase → Authentication → Método de acceso →
   Google → Configuración del SDK web). Tampoco es secreto. Con él, la entrada
   usa el botón oficial de Google dentro de la página y funciona la copia en
   Google Drive. Vacío = solo la ventana emergente de Firebase y sin Drive. */
export const GOOGLE_CLIENT_ID = "";
