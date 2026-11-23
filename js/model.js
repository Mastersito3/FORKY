/* FORKY — modelo de datos y valores por defecto.
   Todo lo que aquí se define es la "fuente de verdad" de nombres y unidades.
   Unidades: peso en kg, altura en cm, fechas AAAA-MM-DD en hora local.
   La semana empieza en lunes. */

export const APP_VERSION = "1.1.0";
export const SCHEMA_VERSION = 1;

/* Grupos musculares. Cada rango semanal es solo «desde–hasta» (series).
   Son valores de partida: se cambian en Ajustes. */
export const GRUPOS = [
  "Pecho", "Dorsal", "Espalda media",
  "Hombro anterior", "Hombro lateral", "Hombro posterior",
  "Bíceps", "Tríceps", "Antebrazo",
  "Cuádriceps", "Femoral/Glúteo", "Gemelos", "Core"
];

export const RANGOS_POR_DEFECTO = {
  "Pecho":          { min: 12, max: 20 },
  "Dorsal":         null,
  "Espalda media":  null,
  "Hombro anterior": null,
  "Hombro lateral": null,
  "Hombro posterior": null,
  "Bíceps":         { min: 14, max: 20 },
  "Tríceps":        { min: 10, max: 14 },
  "Antebrazo":      { min: 8, max: 12 },
  "Cuádriceps":     { min: 12, max: 18 },
  "Femoral/Glúteo": { min: 10, max: 16 },
  "Gemelos":        { min: 12, max: 16 },
  "Core":           { min: 8, max: 16 }
};

export const CRITERIOS_POR_DEFECTO = [
  "Barra: se apunta el peso TOTAL (barra + discos).",
  "Mancuernas: se apunta el peso de UNA mancuerna.",
  "Unilateral: peso y series por lado (3 series = 3 por cada lado).",
  "Todas las series a RIR 1-2."
];

/* Ajustes iniciales. */
export function ajustesPorDefecto() {
  return {
    schema: SCHEMA_VERSION,
    perfil: {
      // Los datos personales no van en el código: se rellenan en Ajustes.
      sexo: null,                  // "hombre" | "mujer": texto explícito, evita el choque de códigos h/m/f
      nacimiento: null,            // AAAA-MM-DD
      altura: null,                // cm
      peso: null                   // kg
    },
    entreno: {
      segundosSerie: 60,
      descansoMin: 2,
      sonido: true,
      criterios: CRITERIOS_POR_DEFECTO.slice(),
      rangos: JSON.parse(JSON.stringify(RANGOS_POR_DEFECTO))
    },
    app: {
      tema: "oscuro",
      semanaEmpieza: "lunes",
      recordatorioCopiaDias: 15,
      ultimaCopia: null
    }
  };
}

/* Utilidades de fecha (hora local) */
const pad = n => String(n).padStart(2, "0");
export const toISO = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const hoyISO = () => toISO(new Date());
export function edadEn(nacimientoISO, fechaISO = hoyISO()) {
  if (!nacimientoISO) return null;
  const [y, m, d] = nacimientoISO.split("-").map(Number);
  const [Y, M, D] = fechaISO.split("-").map(Number);
  return Y - y - ((M < m || (M === m && D < d)) ? 1 : 0);
}
