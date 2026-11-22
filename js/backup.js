/* FORKY — copia de seguridad única. El archivo es autodescriptivo: lleva su
   propia documentación de campos, unidades y reglas. */

import { APP_VERSION, SCHEMA_VERSION, hoyISO } from "./model.js";

export const FORMATO_COPIA = 1;

export const DOCUMENTACION = {
  lee_esto: [
    "Copia completa de FORKY, app personal de entrenamiento de fuerza. Todo el contenido está en 'datos'.",
    "Fechas en AAAA-MM-DD, hora local. La semana empieza en lunes.",
    "Un día o una fecha ausente significa 'sin registrar', nunca cero."
  ],
  unidades: { peso: "kilogramos (kg)", altura: "centímetros (cm)", duracion: "minutos" },
  reglas_de_registro_entreno: {
    barra: "Con barra, el peso es el TOTAL: barra + discos.",
    mancuernas: "Con mancuernas, el peso es el de UNA mancuerna.",
    unilateral: "En ejercicios unilaterales, peso y series son por lado: 3 series = 3 por cada lado.",
    grupos: "Cada ejercicio reparte sus series entre grupos con un peso: {grupo: 1} cuenta la serie entera en ese grupo.",
    series_vacias: "Una serie con peso o reps a null no se hizo (puede ser una sesión copiada aún sin rellenar). sugPeso y sugReps son la marca a batir que se mostraba en gris, no datos realizados."
  },
  secciones: {
    ajustes: "Perfil (sexo, nacimiento, altura, peso), preferencias de entreno, rangos de volumen y preferencias de la app.",
    ejercicios: "Catálogo de ejercicios (máquinas): id, nombre, grupos {grupo: peso}, unilateral.",
    planes: "Semanas planificadas (sin fechas): id, nombre, dias[7] de lunes a domingo { nombre, ejercicios[] { ejercicioId, series } }. El plan activo es ajustes.entreno.planActivo.",
    sesiones: "Una por fecha. ejercicios[]: ejercicioId, nombre y grupos tal como estaban, unilateral, series[] {peso, reps, sugPeso?, sugReps?}. copiadaDe = fecha de la sesión copiada; plan = {id, nombre, dia (0 = lunes), sesion} si se aplicó un día de un plan."
  },
  formulas: {
    rm1: "1RM estimado (Epley) = peso · (1 + reps/30), solo hasta 12 repeticiones.",
    volumen: "Volumen de una serie = peso · repeticiones."
  }
};

export function crearCopia(S) {
  return {
    app: "forky",
    version_app: APP_VERSION,
    esquema: SCHEMA_VERSION,
    formato: FORMATO_COPIA,
    exportado: new Date().toISOString(),
    documentacion: DOCUMENTACION,
    datos: {
      ajustes: S.ajustes,
      ejercicios: S.ejercicios,
      sesiones: S.sesiones.slice().sort((a, b) => a.fecha < b.fecha ? -1 : 1),
      planes: S.planes || []
    }
  };
}

export function esCopia(j) { return !!(j && j.app === "forky" && j.datos && j.datos.ajustes); }

export function descargar(json, nombre = `forky-copia-${hoyISO()}.json`) {
  const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = nombre;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
}
