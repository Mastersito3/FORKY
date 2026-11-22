/* Colecciones de Firestore y el campo que hace de identificador en cada una. */
export const COLECCIONES = ["ejercicios", "sesiones", "planes"];
export const CLAVE = { ejercicios: "id", sesiones: "fecha", planes: "id" };
/* Colecciones opcionales: si su escucha falla, la app sigue funcionando sin ellas */
export const OPCIONALES = new Set(["planes"]);
