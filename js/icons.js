/* Iconos de línea (24×24, trazo 1,7). Un solo trazado por icono. */
export const ICON = {
  hoy: "M12 2.5a9.5 9.5 0 1 0 0 19a9.5 9.5 0 1 0 0-19Z M4.5 12.5H8l1.4-2.6 1.8 5.4 2.6-8.3 1.6 5.5h4.1",
  entreno: "M2.5 10v4 M5 7.5v9 M7.5 9v6 M7.5 12h9 M16.5 9v6 M19 7.5v9 M21.5 10v4",
  progreso: "M3 3v18h18 M6.5 16.5l4-5 3 3 6-7.5 M16 6.5h3.5V10",
  ajustes: "M12 8.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 1 0 0-7Z M12 2.5v3 M12 18.5v3 M2.5 12h3 M18.5 12h3 M5.3 5.3l2.1 2.1 M16.6 16.6l2.1 2.1 M5.3 18.7l2.1-2.1 M16.6 7.4l2.1-2.1",
  sync: "M7 18.5h10a4 4 0 0 0 .7-7.9A6 6 0 0 0 6.4 9.6 4.5 4.5 0 0 0 7 18.5Z M9.8 14l2.2 2.2 4-4",
  nube: "M7 18.5h10a4 4 0 0 0 .7-7.9A6 6 0 0 0 6.4 9.6 4.5 4.5 0 0 0 7 18.5Z M12 11v4.5 M12 17.5v.01",
  escudo: "M12 3l7.5 3v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6Z M8.5 12l2.5 2.5 4.5-5",
  sol: "M12 7.5a4.5 4.5 0 1 0 0 9a4.5 4.5 0 1 0 0-9Z M12 2v2 M12 20v2 M2 12h2 M20 12h2 M4.9 4.9l1.4 1.4 M17.7 17.7l1.4 1.4 M4.9 19.1l1.4-1.4 M17.7 6.3l1.4-1.4",
  luna: "M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z",
  aviso: "M12 3.5 21.5 20h-19Z M12 10v4.5 M12 17v.01",
  reloj: "M12 5.5a7.5 7.5 0 1 0 0 15a7.5 7.5 0 1 0 0-15Z M12 9v4l2.5 1.5 M9.5 2.5h5 M12 2.5v3 M18.5 5.5l1.5 1.5",
  cerrar: "M6 6l12 12 M18 6 6 18",
  mas: "M12 5v14 M5 12h14",
  copiar: "M8.5 8.5h10a1.5 1.5 0 0 1 1.5 1.5v9.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 7 19.5V10a1.5 1.5 0 0 1 1.5-1.5Z M4 15.5V4.5A1.5 1.5 0 0 1 5.5 3h10",
  trofeo: "M7 4h10v5a5 5 0 0 1-10 0Z M7 6H4v1.5A3.5 3.5 0 0 0 7.3 11 M17 6h3v1.5a3.5 3.5 0 0 1-3.3 3.5 M12 14v3.5 M8.5 20.5h7 M9.5 17.5h5v3h-5Z",
  arriba: "M12 19V5 M6 11l6-6 6 6",
  abajo: "M12 5v14 M6 13l6 6 6-6",
  papelera: "M4 6.5h16 M9.5 6.5V4h5v2.5 M6 6.5l1 13.5h10l1-13.5 M10 10.5v6 M14 10.5v6",
  lapiz: "M15 4.5l4.5 4.5L9 19.5H4.5V15Z M12.5 7l4.5 4.5",
  izq: "M15 5l-7 7 7 7",
  der: "M9 5l7 7-7 7",
  objetivo: "M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18Z M12 7.5a4.5 4.5 0 1 0 0 9a4.5 4.5 0 1 0 0-9Z M12 11.2a.8.8 0 1 0 0 1.6a.8.8 0 1 0 0-1.6Z",
  check: "M5 12.5l4.5 4.5L19 7.5"
};

export const icon = (nombre, size = 24, color = "currentColor") =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ICON[nombre]}"/></svg>`;

/* Logo FORKY: hexágono con una «A» de trazo y travesaño, en degradado cian → magenta */
const DEFS = `<defs><linearGradient id="axg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2E8BFF"/><stop offset="0.55" stop-color="#6A4BE0"/><stop offset="1" stop-color="#FF2E4D"/></linearGradient></defs>`;
const HEX = "M120 14 L212 67 L212 173 L120 226 L28 173 L28 67 Z";
const LETRA = "M88 178 V68 H160 M88 124 H148";
export const logo = (size = 30) => `<svg width="${size}" height="${size}" viewBox="0 0 240 240" aria-hidden="true" class="pulse">${DEFS}
  <path d="${HEX}" fill="none" stroke="url(#axg)" stroke-width="12" stroke-linejoin="round" opacity="0.9"/>
  <path d="${LETRA}" fill="none" stroke="url(#axg)" stroke-width="20" stroke-linecap="square" stroke-linejoin="miter"/>
</svg>`;
/* Logo animado para las esperas (index.html lleva una copia del mismo dibujo para la primera pantalla) */
export const logoCarga = (size = 120) => `<div class="cargando" role="status"><svg width="${size}" height="${size}" viewBox="0 0 240 240" aria-hidden="true" class="logo-carga">${DEFS}
  <path class="giro" d="${HEX}" fill="none" stroke="url(#axg)" stroke-width="10" stroke-linejoin="round" stroke-dasharray="60 30" opacity="0.7"/>
  <path class="trazo" d="${LETRA}" fill="none" stroke="url(#axg)" stroke-width="20" stroke-linecap="square"/>
</svg><span class="sr-only">Cargando FORKY</span></div>`;
