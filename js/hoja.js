/* FORKY — ventana inferior de confirmación («¿Seguro?»), pintada en #hoja.
   Se cierra con el botón atrás del móvil, como una pantalla más. */

import { icon } from "./icons.js";

let hoja = null, enHistorial = false;
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function pintar() {
  const host = document.getElementById("hoja"); if (!host) return;
  document.body.classList.toggle("con-hoja", !!hoja);
  if (!hoja) { host.innerHTML = ""; return; }
  host.innerHTML = `<div class="hoja-fondo" data-h="no"></div>
    <div class="hoja" role="dialog" aria-modal="true" aria-label="${esc(hoja.titulo)}">
      <div class="hoja-cab"><b>${esc(hoja.titulo)}</b><button class="icon-btn sm" data-h="no" aria-label="Cerrar">${icon("cerrar", 18)}</button></div>
      <div class="hoja-cuerpo">
        <p style="margin:0;white-space:pre-line">${esc(hoja.texto)}</p>
        <div class="btn-row"><button class="btn" data-h="no">Cancelar</button><button class="btn ${hoja.peligro ? "danger" : "primary"}" data-h="si">${esc(hoja.boton)}</button></div>
      </div></div>`;
}
function cerrar() {
  hoja = null; pintar();
  if (enHistorial) { enHistorial = false; history.back(); }
}
window.addEventListener("popstate", () => { if (hoja) { enHistorial = false; hoja = null; pintar(); } });

export function confirmar(titulo, texto, boton, accion, peligro = true) {
  hoja = { titulo, texto, boton, accion, peligro };
  if (!enHistorial) { history.pushState({ forkyHoja: 1 }, ""); enHistorial = true; }
  pintar();
}
/* Devuelve true si el toque era de la hoja */
export function click(e) {
  const b = e.target.closest("[data-h]"); if (!b || !hoja) return false;
  const acc = hoja.accion;
  cerrar();
  if (b.dataset.h === "si") acc();
  return true;
}
