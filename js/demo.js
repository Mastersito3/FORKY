/* Datos de ejemplo (solo para ?local&demo y las pruebas con node): un
   catálogo de máquinas, un plan de 4 días y ~10 semanas de sesiones con
   progresión. Siempre salen iguales (generador con semilla fija). */

import { ajustesPorDefecto, toISO } from "./model.js";

const EJ = [
  ["prensa", "Prensa de piernas", { "Cuádriceps": 1 }, 140, 10],
  ["ext", "Extensión de cuádriceps", { "Cuádriceps": 1 }, 55, 12],
  ["curl-fem", "Curl femoral sentado", { "Femoral/Glúteo": 1 }, 45, 12],
  ["hip", "Hip thrust en máquina", { "Femoral/Glúteo": 1 }, 90, 10],
  ["gemelo", "Gemelo en prensa", { "Gemelos": 1 }, 100, 15],
  ["press-pecho", "Press de pecho en máquina", { "Pecho": 1 }, 60, 10],
  ["contractor", "Contractor de pecho", { "Pecho": 1 }, 45, 12],
  ["jalon", "Jalón al pecho", { "Dorsal": 1 }, 55, 10],
  ["remo", "Remo sentado en polea", { "Espalda media": 1 }, 50, 10],
  ["press-hombro", "Press de hombro en máquina", { "Hombro anterior": 1 }, 35, 10],
  ["lateral", "Elevaciones laterales en polea", { "Hombro lateral": 1 }, 10, 15],
  ["face", "Face pull", { "Hombro posterior": 1 }, 25, 15],
  ["curl", "Curl de bíceps en polea", { "Bíceps": 1 }, 25, 12],
  ["triceps", "Extensión de tríceps en polea", { "Tríceps": 1 }, 30, 12],
  ["crunch", "Crunch en máquina", { "Core": 1 }, 40, 15]
];
const DIAS = [
  { nombre: "Torso A", ej: [["press-pecho", 3], ["jalon", 3], ["press-hombro", 3], ["remo", 3], ["lateral", 3], ["triceps", 3]] },
  null,
  { nombre: "Pierna A", ej: [["prensa", 4], ["curl-fem", 3], ["ext", 3], ["gemelo", 3], ["crunch", 3]] },
  null,
  { nombre: "Torso B", ej: [["jalon", 3], ["contractor", 3], ["remo", 3], ["face", 3], ["curl", 3], ["lateral", 3]] },
  { nombre: "Pierna B", ej: [["hip", 4], ["prensa", 3], ["curl-fem", 3], ["gemelo", 3]] },
  null
];

export function datosDemo(hoy = new Date()) {
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const ejercicios = EJ.map(([id, nombre, grupos]) => ({ id, nombre, grupos, unilateral: false }));
  const mapa = Object.fromEntries(EJ.map(x => [x[0], x]));
  const plan = {
    id: "plan-demo", nombre: "Torso / Pierna", creado: "2026-09-01T10:00:00Z",
    dias: DIAS.map(d => d ? { nombre: d.nombre, ejercicios: d.ej.map(([ejercicioId, series]) => ({ ejercicioId, series })) } : { nombre: "", ejercicios: [] })
  };
  const sesiones = [];
  const hoyISO = toISO(hoy);
  for (let back = 70; back >= 1; back--) {
    const d = new Date(hoy); d.setDate(d.getDate() - back);
    const dia = (d.getDay() + 6) % 7, p = DIAS[dia];
    if (!p || rnd() < 0.12) continue;   // algún día saltado
    const semanas = (70 - back) / 7;
    sesiones.push({
      fecha: toISO(d),
      plan: { id: plan.id, nombre: plan.nombre, dia, sesion: p.nombre },
      ejercicios: p.ej.map(([id, n]) => {
        const [, nombre, grupos, base, reps] = mapa[id];
        const peso = Math.round((base * (1 + semanas * 0.018)) / 2.5) * 2.5;
        return { ejercicioId: id, nombre, grupos: { ...grupos }, unilateral: false,
          series: Array.from({ length: n }, (_, j) => ({ peso, reps: Math.max(5, reps - j - (rnd() < 0.3 ? 1 : 0)) })) };
      })
    });
  }
  // Hoy: sesión empezada si toca entreno
  const dHoy = (hoy.getDay() + 6) % 7, pHoy = DIAS[dHoy];
  if (pHoy) {
    sesiones.push({
      fecha: hoyISO, plan: { id: plan.id, nombre: plan.nombre, dia: dHoy, sesion: pHoy.nombre },
      ejercicios: pHoy.ej.map(([id, n], k) => {
        const [, nombre, grupos, base, reps] = mapa[id];
        const peso = Math.round((base * (1 + 10 * 0.018) + 2.5) / 2.5) * 2.5;
        return { ejercicioId: id, nombre, grupos: { ...grupos }, unilateral: false,
          series: Array.from({ length: n }, (_, j) => k < 2 ? { peso, reps: reps - j } : { peso: null, reps: null, sugPeso: peso - 2.5, sugReps: reps - j }) };
      })
    });
  }
  const ajustes = ajustesPorDefecto();
  ajustes.entreno.planActivo = plan.id;
  ajustes.perfil = { ...ajustes.perfil, sexo: "hombre", nacimiento: "1997-05-10", altura: 178, peso: 80 };
  ajustes.app.ultimaCopia = hoyISO;
  return { ajustes, ejercicios, sesiones, planes: [plan] };
}
