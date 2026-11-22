/* FORKY — Google Drive: copia de seguridad semanal. Lógica: drive.js. */

import { hoyISO } from "./model.js";

let C = null;
export function init(ctx) { C = ctx; }
const N = { ocupado: null, error: null };

const aj = () => { const a = C.S.ajustes.app; a.drive = a.drive || {}; return a.drive; };
const cada = () => aj().cadaDias || 7;
const diasDesde = iso => Math.floor((new Date(hoyISO() + "T00:00:00") - new Date(iso + "T00:00:00")) / 86400000);
export const usaDrive = () => !!aj().carpeta;
const ultimaCopiaDrive = () => aj().ultimaSubida || null;
export const copiaDriveDebida = () => usaDrive() && (!ultimaCopiaDrive() || diasDesde(ultimaCopiaDrive()) >= cada());
const fallo = e => { N.ocupado = null; N.error = C.mensajeError(e); C.toast(N.error, 7000); C.render(); };

/* Guarda en Ajustes los ids de la carpeta y de la copia (si han cambiado) */
async function ids() {
  const antes = JSON.stringify({ carpeta: aj().carpeta, ultima: aj().ultima });
  const r = await C.DR.asegurar({ carpeta: aj().carpeta, ultima: aj().ultima });
  Object.assign(aj(), r);
  if (JSON.stringify({ carpeta: r.carpeta, ultima: r.ultima }) !== antes) await C.DB.guardarAjustes(C.S.user.uid, C.S.ajustes).catch(() => {});
  return r;
}

/* Siempre desde un toque: el permiso de Google lo necesita */
function copia() {
  N.ocupado = "copia"; N.error = null; C.render();
  C.DR.permiso().then(async () => {
    const r = await ids();
    C.EN.guardarYa();
    Object.assign(aj(), await C.DR.subirCopia(r, C.crearCopia(C.S), hoyISO()));
    aj().ultimaSubida = hoyISO(); C.S.ajustes.app.ultimaCopia = hoyISO();
    await C.DB.guardarAjustes(C.S.user.uid, C.S.ajustes).catch(() => {});
    N.ocupado = null;
    C.toast("Copia guardada en Drive (carpeta «FORKY»).", 4000);
    C.render();
  }).catch(fallo);
}

/* ---------- vistas ---------- */
export function avisoHoy() {
  if (!copiaDriveDebida()) return "";
  const u = ultimaCopiaDrive();
  return `<div class="notice">${C.icon("nube", 20, "var(--acc)")}<div style="flex:1">
    <div>${u ? `Tu última copia en Drive es de hace ${diasDesde(u)} días.` : "Aún no has guardado ninguna copia en Drive."} Toca subirla (cada ${cada()} días).</div>
    <div class="btn-row" style="margin-top:8px"><button class="btn primary" data-act="drive-copia" ${N.ocupado ? "disabled" : ""}>${N.ocupado === "copia" ? "Subiendo…" : "Subir copia a Drive"}</button></div></div></div>`;
}
export function vAjustes() {
  const con = usaDrive(), u = ultimaCopiaDrive();
  return `<div class="card" data-sec="aj-drive" id="aj-drive"><p class="card-title">Google Drive</p>
    <div class="row"><span>Copia en Drive</span><span>${u ? `${C.esc(C.fecha(u))}${diasDesde(u) >= cada() ? ` <span class="muted">· toca otra</span>` : ""}` : "nunca"}</span></div>
    <div class="btn-row">
      <button class="btn primary" data-act="drive-copia" ${N.ocupado ? "disabled" : ""}>${N.ocupado === "copia" ? "Subiendo…" : con ? "Guardar copia en Drive" : "Conectar Drive y guardar copia"}</button>
    </div>
    ${N.error ? `<p class="err" style="margin:0">${C.esc(N.error)}</p>` : ""}
    <p class="muted" style="margin:0">Se guarda en la carpeta «FORKY» de tu Drive: «forky-copia-ultima.json» y las 8 últimas con fecha. FORKY solo puede ver los archivos que ella crea, no el resto de tu Drive. Google pide un toque tuyo cada vez, por eso te avisa en Hoy cada ${cada()} días.</p>
  </div>`;
}

export function click(b) {
  if (b.dataset.act === "drive-copia") { copia(); return true; }
  return false;
}
