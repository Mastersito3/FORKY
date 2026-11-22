/* Cálculos de volumen semanal por músculo (series y nota /100).
   Sin pantalla: se prueba con node. */

import { GRUPOS, toISO } from "./model.js";

export const PRIORITARIOS = new Set(["Pecho", "Dorsal", "Espalda media", "Hombro lateral", "Hombro posterior", "Bíceps", "Tríceps"]);
export const OPCIONALES = new Set(["Core", "Antebrazo", "Hombro anterior"]);   // solo cuentan si se entrenan
export const lunesDe = iso => { const d = new Date(iso + "T00:00:00"); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return toISO(d); };
const completa = s => s.peso != null && s.reps != null;

/* ---------- volumen ---------- */
/* Nota de un grupo: 100 en rango; por debajo, proporcional; por encima, se resta el exceso (mínimo 50) */
export function notaGrupo(sets, lm) {
  if (!lm) return null;
  if (!sets) return 0;
  if (sets < lm.min) return Math.round(sets / lm.min * 100);
  if (sets <= lm.max) return 100;
  return Math.max(50, Math.round(100 - (sets - lm.max) / lm.max * 100));
}
/* Nota de la semana: media de los grupos con rango; prioritarios ×1,5; opcionales solo si se entrenan */
export function notaVolumen(row, rangos) {
  let pts = 0, pesos = 0;
  GRUPOS.forEach(g => {
    const lm = (rangos || {})[g]; if (!lm) return;
    const sets = row[g] || 0;
    if (OPCIONALES.has(g) && !sets) return;
    const p = PRIORITARIOS.has(g) ? 1.5 : 1;
    pts += notaGrupo(sets, lm) * p; pesos += p;
  });
  return pesos ? Math.round(pts / pesos) : null;
}
export function seriesPorGrupo(sesiones) {
  const row = {};
  sesiones.forEach(s => s.ejercicios.forEach(e => {
    const n = e.series.filter(completa).length; if (!n) return;
    Object.entries(e.grupos || {}).forEach(([g, w]) => { row[g] = (row[g] || 0) + n * w; });
  }));
  return row;
}
export const volumenKg = s => s.ejercicios.reduce((a, e) => a + e.series.reduce((t, x) => t + (completa(x) ? x.peso * x.reps : 0), 0), 0);
