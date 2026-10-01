/* ==============================
   PANTALLAS
============================== */

function mostrarPantalla(id) {

  const pantallaAnterior =
    document.querySelector(".pantalla.activa");

  const idAnterior =
    pantallaAnterior ? pantallaAnterior.id : null;

  const pantallas =
    document.querySelectorAll(".pantalla");

  pantallas.forEach(pantalla => {
    pantalla.classList.remove("activa");
  });

  const destino =
    document.getElementById(id);

  if (destino) {
    destino.classList.add("activa");
  }

  window.scrollTo(0, 0);


  /* Control de la cámara AR: se enciende solo
     al entrar a 'scanner' y se apaga al salir */

  if (id === "scanner") {

    if (typeof iniciarEscanerAR === "function") {
      iniciarEscanerAR();
    }

  } else if (idAnterior === "scanner") {

    if (typeof detenerEscanerAR === "function") {
      detenerEscanerAR();
    }

  }
}


/* ==============================
   MENÚ
============================== */

function abrirMenu() {

  document
    .getElementById("menuLateral")
    .classList.add("abierto");

  document
    .getElementById("overlay")
    .classList.add("activo");
}


function cerrarMenu() {

  document
    .getElementById("menuLateral")
    .classList.remove("abierto");

  document
    .getElementById("overlay")
    .classList.remove("activo");
}


function irDesdeMenu(id) {

  mostrarPantalla(id);

  cerrarMenu();
}


function toggleJuegos() {

  document
    .getElementById("submenuJuegos")
    .classList.toggle("abierto");
}


/* ==============================
   RECOMPENSAS
============================== */

function mostrarRecompensa(id, boton) {

  const contenidos =
    document.querySelectorAll(
      ".contenido-recompensa"
    );

  contenidos.forEach(contenido => {

    contenido.classList.remove(
      "activo"
    );

  });


  const tabs =
    document.querySelectorAll(
      ".tab-recompensa"
    );

  tabs.forEach(tab => {

    tab.classList.remove(
      "activo"
    );

  });


  document
    .getElementById(id)
    .classList.add("activo");


  boton.classList.add("activo");
}


/* ==============================
   TRIVIA
============================== */

function seleccionarRespuesta(boton) {

  const respuestas =
    document.querySelectorAll(
      ".respuestas button"
    );

  respuestas.forEach(respuesta => {

    respuesta.classList.remove(
      "seleccionado"
    );

  });

  boton.classList.add(
    "seleccionado"
  );
}


/* ==============================
   FILTROS
============================== */

function activarFiltro(boton) {

  const filtros =
    document.querySelectorAll(
      ".filtros-video button"
    );

  filtros.forEach(filtro => {

    filtro.classList.remove(
      "activo"
    );

  });

  boton.classList.add("activo");

  mostrarMensaje(
    "Filtro seleccionado"
  );
}


/* ==============================
   CONFIGURACIÓN
============================== */

function toggleConfig(boton) {

  if (
    boton.textContent.trim()
    === "Activado"
  ) {

    boton.textContent =
      "Desactivado";

  }

  else {

    boton.textContent =
      "Activado";

  }
}


/* ==============================
   RESULTADOS — SELECTOR DE FECHA
============================== */

function cambiarFechaResultados(direccion) {

  mostrarMensaje(
    "La temporada 2026 ya concluyó — sin más partidos por ahora"
  );
}


/* ==============================
   MENSAJES
============================== */

function mostrarMensaje(texto) {

  const mensaje =
    document.getElementById("mensaje");

  mensaje.textContent = texto;

  mensaje.classList.add("mostrar");


  setTimeout(() => {

    mensaje.classList.remove(
      "mostrar"
    );

  }, 1500);
}


/* ==============================
   SPLASH
============================== */

window.addEventListener(
  "DOMContentLoaded",
  () => {

    setTimeout(() => {

      mostrarPantalla("inicio");

    }, 2300);

  }
);

/* ==============================
   ROMPECABEZAS
============================== */

const puzzleSolucion = [0, 1, 2, 3, 4, 5, 6, 7, null];

let puzzleEstado = [...puzzleSolucion];
let puzzleMovimientos = 0;

function puzzleVecinos(posicion) {
  const fila = Math.floor(posicion / 3);
  const columna = posicion % 3;

  return [
    fila > 0 ? posicion - 3 : -1,
    fila < 2 ? posicion + 3 : -1,
    columna > 0 ? posicion - 1 : -1,
    columna < 2 ? posicion + 1 : -1
  ].filter(valor => valor !== -1);
}

function dibujarPuzzle() {
  const tablero = document.getElementById('puzzle-tablero');

  if (!tablero) return;

  tablero.replaceChildren();

  puzzleEstado.forEach((pieza, posicion) => {
    const boton = document.createElement('button');
    boton.type = 'button';

    if (pieza === null) {
      boton.className = 'puzzle-vacio';
      boton.disabled = true;
      boton.setAttribute('aria-label', 'Espacio vacío');
    } else {
      boton.style.backgroundPosition =
        `${(pieza % 3) * 50}% ${Math.floor(pieza / 3) * 50}%`;

      boton.setAttribute('aria-label', `Mover pieza ${pieza + 1}`);

      boton.addEventListener('click', () => {
        moverPiezaPuzzle(posicion);
      });
    }

    tablero.appendChild(boton);
  });

  document.getElementById('puzzle-movimientos').textContent =
    puzzleMovimientos;
}

function moverPiezaPuzzle(posicion) {
  const vacio = puzzleEstado.indexOf(null);

  // Solo se puede mover una pieza pegada al espacio vacío.
  if (!puzzleVecinos(vacio).includes(posicion)) return;

  [puzzleEstado[vacio], puzzleEstado[posicion]] =
    [puzzleEstado[posicion], puzzleEstado[vacio]];

  puzzleMovimientos++;
  dibujarPuzzle();

  if (puzzleEstado.every(
    (pieza, indice) => pieza === puzzleSolucion[indice]
  )) {
    mostrarMensaje(
      `¡Completaste el logo en ${puzzleMovimientos} movimientos!`
    );
  }
}

function prepararPuzzle() {
  // Mezclar con movimientos válidos hace que siempre se pueda resolver.
  let posicionAnterior = -1;

  for (let i = 0; i < 35; i++) {
    const vacio = puzzleEstado.indexOf(null);

    const opciones = puzzleVecinos(vacio).filter(
      posicion => posicion !== posicionAnterior
    );

    const siguiente =
      opciones[Math.floor(Math.random() * opciones.length)];

    [puzzleEstado[vacio], puzzleEstado[siguiente]] =
      [puzzleEstado[siguiente], puzzleEstado[vacio]];

    posicionAnterior = vacio;
  }

  dibujarPuzzle();
}

document.addEventListener('DOMContentLoaded', prepararPuzzle);
