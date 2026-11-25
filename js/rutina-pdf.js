/* FORKY — rutina precargada «Rutina 4 días» (de la infografía de David).
   Lunes = Día 1, Martes = Día 2, Viernes = Día 5, Domingo = Día 4
   (David lo prefiere en domingo); miércoles, jueves y sábado, descanso.
   Se carga UNA sola vez por cuenta (marca en ajustes.entreno.rutinasCargadas):
   añade los ejercicios que falten en el catálogo y el plan, sin tocar nada
   de lo que ya hay. Si David borra el plan, no vuelve a aparecer. */

export const RUTINA_ID = "rutina-4-dias";

/* [id, nombre, grupos, unilateral] */
const EJ = [
  ["r-curl-inclinado", "Curl inclinado en banco o Bayesian", { "Bíceps": 1 }, false],
  ["r-martillo", "Curl martillo", { "Bíceps": 1 }, false],
  ["r-predicador", "Curl predicador", { "Bíceps": 1 }, false],
  ["r-barra-z", "Curl con barra Z", { "Bíceps": 1 }, false],
  ["r-pullover", "Pull over en polea", { "Dorsal": 1 }, false],
  ["r-remo-t", "Remo T", { "Espalda media": 1 }, false],
  ["r-remo-dorian", "Remo Dorian unilateral", { "Dorsal": 1 }, true],
  ["r-face-pull", "Face pull", { "Espalda media": 1 }, false],
  ["r-jalon", "Jalón al pecho", { "Dorsal": 1 }, false],
  ["r-remo-gironda", "Remo Gironda", { "Espalda media": 1 }, false],
  ["r-trasnuca", "Extensión de tríceps trasnuca", { "Tríceps": 1 }, false],
  ["r-ext-triceps", "Extensión de tríceps", { "Tríceps": 1 }, false],
  ["r-aperturas", "Aperturas", { "Pecho": 1 }, false],
  ["r-press-inclinado", "Press inclinado", { "Pecho": 1 }, false],
  ["r-press-plano", "Press plano", { "Pecho": 1 }, false],
  ["r-fondos", "Fondos", { "Pecho": 1 }, false],
  ["r-laterales", "Elevaciones laterales (mancuernas o polea)", { "Hombro lateral": 1 }, false],
  ["r-posterior", "Hombro posterior en máquina", { "Hombro posterior": 1 }, false],
  ["r-militar", "Press militar", { "Hombro anterior": 1 }, false],
  ["r-abdominales", "Abdominales (ejercicio libre)", { "Core": 1 }, false],
  ["r-ext-cuadriceps", "Extensión de cuádriceps", { "Cuádriceps": 1 }, false],
  ["r-rumano", "Peso muerto rumano o hip thrust", { "Femoral/Glúteo": 1 }, false],
  ["r-sentadilla", "Patrón de sentadilla (barra, prensa, hack o jaca)", { "Cuádriceps": 1 }, false],
  ["r-curl-femoral", "Curl femoral", { "Femoral/Glúteo": 1 }, false],
  ["r-gemelos", "Elevación de gemelos", { "Gemelos": 1 }, false]
];

/* 7 días de lunes a domingo; null = descanso */
const DIAS = [
  { nombre: "Día 1 · Bíceps, espalda y pierna", ej: [
    ["r-curl-inclinado", 2], ["r-martillo", 3], ["r-predicador", 2],
    ["r-pullover", 3], ["r-remo-t", 2], ["r-remo-dorian", 2],
    ["r-ext-cuadriceps", 3], ["r-rumano", 2], ["r-gemelos", 3]] },
  { nombre: "Día 2 · Tríceps, pecho y hombro", ej: [
    ["r-trasnuca", 3], ["r-ext-triceps", 3],
    ["r-aperturas", 2], ["r-press-inclinado", 2], ["r-fondos", 2],
    ["r-laterales", 3], ["r-posterior", 2], ["r-abdominales", 3]] },
  null,
  null,
  { nombre: "Día 5 · Tríceps, pecho, hombro y pierna", ej: [
    ["r-trasnuca", 3], ["r-ext-triceps", 3],
    ["r-aperturas", 2], ["r-press-plano", 2],
    ["r-militar", 3],
    ["r-sentadilla", 2], ["r-curl-femoral", 3], ["r-gemelos", 3]] },
  null,
  { nombre: "Día 4 · Bíceps, espalda y hombro", ej: [
    ["r-curl-inclinado", 2], ["r-martillo", 3], ["r-barra-z", 2],
    ["r-face-pull", 2], ["r-jalon", 2], ["r-remo-gironda", 2],
    ["r-laterales", 3], ["r-abdominales", 3]] }
];

const clave = s => String(s || "").toLocaleLowerCase("es").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim();

/* Devuelve lo que hay que guardar: ejercicios nuevos para el catálogo y el plan.
   Si en el catálogo ya hay un ejercicio con el mismo nombre (o el mismo id),
   se usa ese y no se duplica. */
export function rutinaParaCargar(catalogo, ahora = new Date().toISOString()) {
  const porNombre = new Map(catalogo.map(e => [clave(e.nombre), e]));
  const porIdCat = new Map(catalogo.map(e => [e.id, e]));
  const idFinal = {}, nuevos = [];
  EJ.forEach(([id, nombre, grupos, unilateral]) => {
    const ya = porIdCat.get(id) || porNombre.get(clave(nombre));
    if (ya) { idFinal[id] = ya.id; return; }
    idFinal[id] = id;
    nuevos.push({ id, nombre, grupos: { ...grupos }, unilateral });
  });
  const plan = {
    id: RUTINA_ID, nombre: "Rutina 4 días", creado: ahora, actualizado: ahora,
    dias: DIAS.map(d => d
      ? { nombre: d.nombre, ejercicios: d.ej.map(([id, series]) => ({ ejercicioId: idFinal[id], series })) }
      : { nombre: "", ejercicios: [] })
  };
  return { ejercicios: nuevos, plan };
}
