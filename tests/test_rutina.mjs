/* Rutina precargada: node tests/test_rutina.mjs */
import { rutinaParaCargar, RUTINA_ID } from "../js/rutina-pdf.js";
import * as PL from "../js/plan-calc.js";
let fallos = 0; const ok = (c, m) => { if (!c) { fallos++; console.log("FALLO:", m); } };

// Catálogo vacío: crea todos los ejercicios y el plan con las series del PDF
const { ejercicios, plan } = rutinaParaCargar([], "2026-11-23T00:00:00Z");
const mapa = PL.porId(ejercicios);
ok(plan.id === RUTINA_ID && plan.dias.length === 7, "plan de 7 días");
ok(JSON.stringify(plan.dias.map(PL.seriesTotales)) === "[22,20,0,0,21,0,19]", "series por día como en el PDF: " + plan.dias.map(PL.seriesTotales));
ok(plan.dias.every(d => d.ejercicios.every(x => mapa[x.ejercicioId])), "todos los ejercicios en el catálogo");
ok(JSON.stringify(PL.normalizar(plan).dias) === JSON.stringify(plan.dias), "plan ya normalizado");
const g = PL.seriesPlan(plan, mapa);
ok(g["Bíceps"] === 14 && g["Tríceps"] === 12 && g["Pecho"] === 10 && g["Gemelos"] === 6, "volumen semanal por grupo " + JSON.stringify(g));

// Catálogo con ejercicios del mismo nombre (sin tildes / mayúsculas): se reutilizan
const propio = [{ id: "mio1", nombre: "jalon al pecho", grupos: { "Dorsal": 1 } }, { id: "mio2", nombre: "Face Pull", grupos: {} }];
const r2 = rutinaParaCargar(propio);
ok(!r2.ejercicios.some(e => e.nombre === "Jalón al pecho" || e.nombre === "Face pull"), "no duplica ejercicios existentes");
ok(r2.plan.dias[6].ejercicios.some(x => x.ejercicioId === "mio1") && r2.plan.dias[6].ejercicios.some(x => x.ejercicioId === "mio2"), "usa los ids existentes");
ok(r2.ejercicios.length === ejercicios.length - 2, "solo crea los que faltan");

console.log(fallos ? `${fallos} fallos` : "OK rutina");
process.exit(fallos ? 1 : 0);
