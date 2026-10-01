/* ==============================
   DATOS DE EQUIPOS — ZONA SUR
   (temporada regular 2026, los 6 que
   clasificaron a playoffs)

   Fuente única: tanto la pantalla
   "EQUIPOS" como la marquesina de
   inicio se pintan a partir de este
   arreglo.

   Para usar el logo real de un equipo,
   súbelo a /img y pon su ruta en
   "logo". Mientras no haya logo, se
   muestra un círculo de color con las
   iniciales ("color" / "colorOscuro" /
   "iniciales").
============================== */

const equiposZonaSur = [

  {
    nombre: "Diablos Rojos",
    subtitulo: "64-29 · 1er lugar",
    logo: "img/diablos_rojos.png",
    color: "#B91C1C",
    colorOscuro: "#450A0A",
    iniciales: "DR"
  },

  {
    nombre: "Olmecas de Tabasco",
    subtitulo: "54-38 · 2do lugar",
    logo: null,
    color: "#0B6E4F",
    colorOscuro: "#063D2C",
    iniciales: "OT"
  },

  {
    nombre: "Piratas de Campeche",
    subtitulo: "52-41 · 3er lugar",
    logo: null,
    color: "#2B2B2B",
    colorOscuro: "#000000",
    iniciales: "PC"
  },

  {
    nombre: "Pericos de Puebla",
    subtitulo: "50-42 · 4to lugar",
    logo: null,
    color: "#2E7D32",
    colorOscuro: "#1B4F20",
    iniciales: "PP"
  },

  {
    nombre: "Bravos de León",
    subtitulo: "50-43 · 5to lugar",
    logo: null,
    color: "#D96A1F",
    colorOscuro: "#8C4312",
    iniciales: "BL"
  },

  {
    nombre: "Guerreros de Oaxaca",
    subtitulo: "48-45 · 6to lugar",
    logo: null,
    color: "#7A1F3D",
    colorOscuro: "#4A1225",
    iniciales: "GO"
  }

];


/* Círculo pequeño: logo real si existe, si no, iniciales de color */

function crearCirculoEquipo(equipo) {

  if (equipo.logo) {
    return `<div class="circulo-equipo">
              <img src="${equipo.logo}" alt="${equipo.nombre}">
            </div>`;
  }

  return `<div class="circulo-equipo"
               style="background:${equipo.color}; color:white; font-weight:bold; font-size:15px;">
            ${equipo.iniciales}
          </div>`;
}


/* Pantalla "EQUIPOS": una tarjeta por equipo */

function renderListaEquipos() {

  const contenedor = document.querySelector("#equipos .lista-equipos");

  if (!contenedor) return;

  contenedor.innerHTML = equiposZonaSur.map((equipo) => `
    <button class="fila-equipo"
            onclick="mostrarMensaje('${equipo.nombre}')">

      ${crearCirculoEquipo(equipo)}

      <div class="lineas-equipo">
        <span>${equipo.nombre}</span>
        <small>${equipo.subtitulo}</small>
      </div>

      <span class="fila-equipo-flecha">›</span>

    </button>
  `).join("");
}


/* Marquesina de inicio: franja compacta que se desplaza sola,
   sin botones. El truco del loop infinito: se pinta la lista
   de equipos DOS VECES seguidas, y la animación CSS recorre
   exactamente el 50% del ancho total, así cuando "reinicia"
   nadie nota el corte porque la segunda copia es idéntica. */

function crearChipEquipo(equipo) {

  return `
    <button class="chip-equipo"
            onclick="mostrarPantalla('equipos')">

      ${crearCirculoEquipo(equipo)}

      <span>${equipo.nombre}</span>

    </button>
  `;
}


function renderMarquesinaEquipos() {

  const track = document.getElementById("marquesinaTrack");

  if (!track) return;

  const chips = equiposZonaSur.map(crearChipEquipo).join("");

  /* Equipos duplicados para que el recorrido sea infinito */
  track.innerHTML = chips + chips;
}


document.addEventListener("DOMContentLoaded", () => {
  renderListaEquipos();
  renderMarquesinaEquipos();
});
