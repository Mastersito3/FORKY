/* FORKY — portada «Hoy», solo de entreno: qué toca hoy, la semana en curso,
   récords recientes y la última sesión. */

import { hoyISO, toISO } from "./model.js";
import { lunesDe, seriesPorGrupo, notaVolumen, volumenKg } from "./semana-calc.js";
import * as PL from "./plan-calc.js";

let C = null;
export function init(ctx) { C = ctx; }

const completa = s => s.peso != null && s.reps != null;
const e1rm = (p, r) => (!p || !r || r > 12) ? 0 : p * (1 + r / 30);
const sumarDias = (iso, n) => { const d = new Date(iso + "T00:00:00"); d.setDate(d.getDate() + n); return toISO(d); };
const conSeries = s => s.ejercicios.some(e => e.series.some(completa));
const LETRAS = ["L", "M", "X", "J", "V", "S", "D"];

/* Planes y día que toca hoy según el plan activo */
function tocaHoy(hoy) {
  const planes = (C.S.planes || []).map(PL.normalizar);
  if (!planes.length) return null;
  const activo = (C.S.ajustes.entreno || {}).planActivo;
  const p = planes.find(x => x.id === activo) || planes[0];
  const d = p.dias[PL.diaDeFecha(hoy)];
  return { p, d };
}

/* Récords: series que superan el mejor 1RM estimado anterior de ese ejercicio */
function recordsDesde(desde) {
  const mejor = {}, out = [];
  C.S.sesiones.slice().sort((a, b) => a.fecha < b.fecha ? -1 : 1).forEach(s => s.ejercicios.forEach(e => {
    e.series.filter(completa).forEach(st => {
      const v = e1rm(st.peso, st.reps); if (!v) return;
      const antes = mejor[e.ejercicioId] || 0;
      if (antes && v > antes * 1.001 && s.fecha >= desde) out.push({ fecha: s.fecha, nombre: e.nombre, peso: st.peso, reps: st.reps, e1: v, sube: v - antes });
      if (v > antes) mejor[e.ejercicioId] = v;
    });
  }));
  // Uno por ejercicio: el más alto
  const porEj = {};
  out.forEach(r => { if (!porEj[r.nombre] || r.e1 > porEj[r.nombre].e1) porEj[r.nombre] = r; });
  return Object.values(porEj).sort((a, b) => a.fecha < b.fecha ? 1 : -1);
}

/* Semanas seguidas con al menos una sesión (cuenta la actual si ya entrenaste, si no desde la anterior) */
function racha(hoy) {
  const semanas = new Set(C.S.sesiones.filter(conSeries).map(s => lunesDe(s.fecha)));
  let lunes = lunesDe(hoy), n = 0;
  if (!semanas.has(lunes)) lunes = sumarDias(lunes, -7);
  while (semanas.has(lunes)) { n++; lunes = sumarDias(lunes, -7); }
  return n;
}

const anillo = (pct, txt, sub) => {
  const r = 52, c = 2 * Math.PI * r, v = Math.max(0, Math.min(1, pct));
  return `<div class="anillo" role="img" aria-label="${C.esc(txt + " " + sub)}">
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="${r}" class="anillo-pista"/>
      <circle cx="60" cy="60" r="${r}" class="anillo-valor" stroke-dasharray="${(c * v).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 60 60)"/>
    </svg>
    <div class="anillo-txt"><b>${txt}</b><span>${sub}</span></div></div>`;
};

export function vista() {
  const hoy = hoyISO(), S = C.S;
  const ses = S.sesiones.find(s => s.fecha === hoy);
  const th = tocaHoy(hoy);
  const out = [];

  /* ---- tarjeta principal ---- */
  if (ses && ses.ejercicios.length) {
    const total = ses.ejercicios.reduce((a, e) => a + e.series.length, 0);
    const hechas = ses.ejercicios.reduce((a, e) => a + e.series.filter(completa).length, 0);
    out.push(`<div class="card hero">
      <div class="hero-fila">${anillo(total ? hechas / total : 0, `${hechas}<small>/${total}</small>`, "series")}
        <div class="hero-info"><span class="kicker">${hechas >= total ? "Sesión completada" : "Sesión en curso"}</span>
          <b class="hero-tit">${C.esc(ses.plan && ses.plan.sesion ? ses.plan.sesion : `${ses.ejercicios.length} ejercicios`)}</b>
          <span class="muted">${C.nf(Math.round(volumenKg(ses)))} kg movidos</span></div></div>
      <div class="btn-row"><button class="btn primary" data-hoy="registrar">${C.icon("entreno", 18)}${hechas >= total ? "Ver sesión" : "Seguir entrenando"}</button></div></div>`);
  } else if (th && th.d.ejercicios.length) {
    const series = PL.seriesTotales(th.d);
    out.push(`<div class="card hero">
      <div class="hero-fila">${anillo(0, String(th.d.ejercicios.length), "ejercicios")}
        <div class="hero-info"><span class="kicker">Toca hoy · ${C.esc(th.p.nombre)}</span>
          <b class="hero-tit">${C.esc(th.d.nombre || PL.DIAS_PLAN[PL.diaDeFecha(hoy)])}</b>
          <span class="muted">${series} series planificadas</span></div></div>
      <div class="btn-row"><button class="btn primary" data-hoy="registrar">${C.icon("entreno", 18)}Empezar entreno</button></div></div>`);
  } else {
    out.push(`<div class="card hero">
      <div class="hero-fila">${anillo(0, "—", th ? "descanso" : "sin plan")}
        <div class="hero-info"><span class="kicker">${th ? "Día de descanso" : "Sin plan activo"}</span>
          <b class="hero-tit">${th ? "Recupera" : "Entreno libre"}</b>
          <span class="muted">${th ? `Tu plan «${C.esc(th.p.nombre)}» no tiene nada para hoy.` : "Crea un plan de semana en Entreno → Planificar."}</span></div></div>
      <div class="btn-row"><button class="btn ${th ? "" : "primary"}" data-hoy="registrar">${C.icon("mas", 18)}Registrar entreno</button></div></div>`);
  }

  /* ---- la semana ---- */
  const lunes = lunesDe(hoy), fechas = Array.from({ length: 7 }, (_, i) => sumarDias(lunes, i));
  const semana = S.sesiones.filter(s => s.fecha >= lunes && s.fecha <= fechas[6] && conSeries(s));
  const conSes = new Set(semana.map(s => s.fecha));
  const row = seriesPorGrupo(semana);
  const series = Object.values(row).reduce((a, v) => a + v, 0);
  const vol = semana.reduce((a, s) => a + volumenKg(s), 0);
  const nota = semana.length ? notaVolumen(row, S.ajustes.entreno.rangos) : null;
  const r = racha(hoy);
  out.push(`<div class="card" data-sec="semana"><p class="card-title">Esta semana</p>
    <div class="semana-tira">${fechas.map((f, i) => `<span class="dia ${conSes.has(f) ? "on" : ""} ${f === hoy ? "hoy" : ""} ${f > hoy ? "futuro" : ""}"><i></i>${LETRAS[i]}</span>`).join("")}</div>
    <div class="grid2">
      <div class="stat"><b>${semana.length}</b><span>sesiones</span></div>
      <div class="stat"><b>${C.nf(series, series % 1 ? 1 : 0)}</b><span>series efectivas</span></div>
      <div class="stat"><b>${C.nf(Math.round(vol))}<small> kg</small></b><span>volumen</span></div>
      <div class="stat"><b>${nota === null ? "—" : nota}<small>/100</small></b><span>nota de volumen</span></div>
    </div>
    ${r ? `<p class="racha">${C.icon("objetivo", 16, "var(--acc2)")} Racha de <b>${r}</b> ${r === 1 ? "semana" : "semanas"} seguidas entrenando</p>` : ""}
    <div class="btn-row"><button class="btn sm" data-hoy="volumen">Ver volumen por músculo</button></div></div>`);

  /* ---- récords ---- */
  const recs = recordsDesde(sumarDias(hoy, -30)).slice(0, 4);
  out.push(`<div class="card" data-sec="records"><p class="card-title">Récords · últimos 30 días</p>
    ${recs.length ? `<div class="items">${recs.map(x => `<div class="item record">
      <span class="item-main"><b>${C.esc(x.nombre)}</b><span class="muted">${C.nf(x.peso, x.peso % 1 ? 1 : 0)} kg × ${x.reps} · ${C.esc(C.fecha(x.fecha))}</span></span>
      <span class="mono acc">${C.nf(Math.round(x.e1))}<small> kg 1RM</small></span></div>`).join("")}</div>`
      : `<p class="muted" style="margin:0">Aún no hay récords nuevos este mes. ¡A por ellos!</p>`}</div>`);

  /* ---- última sesión ---- */
  const ultima = S.sesiones.filter(s => s.fecha < hoy && conSeries(s)).sort((a, b) => a.fecha < b.fecha ? 1 : -1)[0];
  if (ultima) {
    const hechas = ultima.ejercicios.reduce((a, e) => a + e.series.filter(completa).length, 0);
    out.push(`<div class="card" data-sec="ultima"><p class="card-title">Última sesión</p>
      <div class="row"><span>${C.esc(C.fecha(ultima.fecha))}${ultima.plan && ultima.plan.sesion ? ` · ${C.esc(ultima.plan.sesion)}` : ""}</span><span class="mono">${hechas} series · ${C.nf(Math.round(volumenKg(ultima)))} kg</span></div>
      <div class="tags">${ultima.ejercicios.slice(0, 6).map(e => `<span class="tag line">${C.esc(e.nombre)}</span>`).join("")}</div>
      <div class="btn-row"><button class="btn sm" data-hoy="historial">Ver historial</button></div></div>`);
  }
  return out.join("");
}

export function click(e) {
  const b = e.target.closest("[data-hoy]"); if (!b) return false;
  const a = b.dataset.hoy;
  if (a === "registrar") C.EN.irRegistrar(hoyISO());
  else C.EN.irSub(a);
  C.render(); window.scrollTo(0, 0);
  return true;
}
