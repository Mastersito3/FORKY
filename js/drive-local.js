/* Sustituto en memoria de drive.js para el modo local de pruebas (?local). */
const mem = { copias: [], conectado: false };
window.__drive = mem;
export function preparar() {}
export const conectado = () => mem.conectado;
export async function permiso() { mem.conectado = true; return "local"; }
export async function asegurar(ids = {}) { return { carpeta: ids.carpeta || "c-local", ultima: ids.ultima || null }; }
export async function subirCopia(ids, copia, fecha) { mem.copias.push({ fecha, bytes: JSON.stringify(copia).length }); return { ...ids, ultima: "u-local" }; }
