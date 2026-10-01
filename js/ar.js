/* ==============================
   REALIDAD AUMENTADA (MindAR)
============================== */

let arEventosListos = false;


function obtenerEscenaAR() {
  return document.getElementById("arScene");
}


/**
 * Enciende la cámara y el tracking del marcador.
 * Se llama cada vez que el usuario entra a la pantalla 'scanner'.
 */
function conEscenaCargada(callback) {

  const escena = obtenerEscenaAR();

  if (!escena) return;

  if (escena.hasLoaded) {
    callback(escena);
  } else {
    escena.addEventListener("loaded", () => callback(escena), { once: true });
  }
}


/**
 * MindAR inserta un <video> con la cámara en vivo, pero lo posiciona
 * pensado para pantalla completa (position: fixed sobre el body).
 * Como nuestra app muestra el escáner dentro de una tarjeta y no a
 * pantalla completa, ese video queda oculto detrás del resto de la UI.
 *
 * Esta función lo mueve dentro de nuestra tarjeta (#camaraAR) y lo
 * posiciona en relación a ella, sin tocar su tamaño (MindAR ya lo
 * calculó correctamente en base al mismo contenedor).
 */
function corregirVideoAR() {

  const contenedor = document.getElementById("camaraAR");
  const escena = obtenerEscenaAR();

  if (!contenedor || !escena) return false;

  const video =
    escena.querySelector("video") || document.querySelector("video");

  if (!video) return false;

  if (video.parentElement !== contenedor) {
    contenedor.insertBefore(video, contenedor.firstChild);
  }

  video.style.position = "absolute";
  video.style.top = "0";
  video.style.left = "0";
  video.style.zIndex = "0";

  return true;
}


function intentarCorregirVideo(intentosRestantes) {

  const listo = corregirVideoAR();

  if (!listo && intentosRestantes > 0) {
    setTimeout(() => intentarCorregirVideo(intentosRestantes - 1), 200);
  }
}


function iniciarEscanerAR() {

  const hint = document.getElementById("scanHint");

  if (hint) {
    hint.textContent = "Apunta la cámara al logo de Diablos";
    hint.classList.remove("oculto");
  }

  conEscenaCargada((escena) => {

    const sistemaAR = escena.systems["mindar-image-system"];

    if (sistemaAR) {
      sistemaAR.start();
    }

    /* Reubicar el <video> de la cámara dentro de nuestra tarjeta.
       Se reintenta varias veces porque MindAR puede crear el
       elemento un instante después de llamar a start(). */

    intentarCorregirVideo(15);

    /* El contenedor pasó de display:none a visible, así que
       forzamos a A-Frame a recalcular el tamaño del canvas */

    requestAnimationFrame(() => {
      window.dispatchEvent(new Event("resize"));
    });

    /* Los listeners de detección solo se agregan una vez */

    if (!arEventosListos) {

      const objetivo = document.getElementById("targetDiablos");

      if (objetivo) {

        objetivo.addEventListener("targetFound", () => {

          const hintActual = document.getElementById("scanHint");

          if (hintActual) {
            hintActual.classList.add("oculto");
          }

        });

        objetivo.addEventListener("targetLost", () => {

          const hintActual = document.getElementById("scanHint");

          if (hintActual) {
            hintActual.classList.remove("oculto");
          }

        });

      }

      arEventosListos = true;
    }

  });
}


/**
 * Apaga la cámara y libera el stream de video.
 * Se llama al salir de la pantalla 'scanner'.
 */
function detenerEscanerAR() {

  const escena = obtenerEscenaAR();

  if (!escena) return;

  const sistemaAR = escena.systems["mindar-image-system"];

  if (sistemaAR) {
    sistemaAR.stop();
  }
}


/* ==============================
   BOTÓN: INFORMACIÓN
============================== */

function abrirInfoAR() {

  const overlay = document.getElementById("overlayInfoAR");
  const panel = document.getElementById("panelInfoGorra");

  if (overlay) overlay.classList.add("activo");
  if (panel) panel.classList.add("abierta");
}


function cerrarInfoAR() {

  const overlay = document.getElementById("overlayInfoAR");
  const panel = document.getElementById("panelInfoGorra");

  if (overlay) overlay.classList.remove("activo");
  if (panel) panel.classList.remove("abierta");
}


/* ==============================
   BOTÓN: ANIMACIÓN
============================== */

let animandoGorra = false;


function toggleAnimacionGorra() {

  const modelo = document.getElementById("modeloAR");

  if (!modelo) return;

  animandoGorra = !animandoGorra;

  if (animandoGorra) {

    modelo.setAttribute("animation__giro", {
      property: "rotation",
      to: "0 360 0",
      loop: true,
      dur: 4000,
      easing: "linear"
    });

    mostrarMensaje("Animación activada");

  } else {

    modelo.removeAttribute("animation__giro");
    modelo.setAttribute("rotation", "0 0 0");

    mostrarMensaje("Animación detenida");
  }
}


/* ==============================
   BOTÓN: EFECTOS (confeti)
============================== */

function lanzarConfetiAR() {

  const contenedor = document.getElementById("camaraAR");

  if (!contenedor) return;

  let capa = document.getElementById("confetiContenedor");

  if (!capa) {
    capa = document.createElement("div");
    capa.id = "confetiContenedor";
    capa.className = "confeti-contenedor";
    contenedor.appendChild(capa);
  }

  const colores = ["#E3131A", "#082B59", "#FFFFFF", "#FFB800"];
  const totalPiezas = 46;

  for (let i = 0; i < totalPiezas; i++) {

    const pieza = document.createElement("div");
    pieza.className = "confeti-pieza";

    /* Elegir un borde al azar: 0 arriba, 1 derecha, 2 abajo, 3 izquierda */

    const borde = Math.floor(Math.random() * 4);
    const distancia = 60 + Math.random() * 90;

    let left, top, dx, dy;

    if (borde === 0) {
      left = Math.random() * 100;
      top = 0;
      dx = (Math.random() - 0.5) * 70;
      dy = distancia;
    } else if (borde === 1) {
      left = 100;
      top = Math.random() * 100;
      dx = -distancia;
      dy = (Math.random() - 0.5) * 70;
    } else if (borde === 2) {
      left = Math.random() * 100;
      top = 100;
      dx = (Math.random() - 0.5) * 70;
      dy = -distancia;
    } else {
      left = 0;
      top = Math.random() * 100;
      dx = distancia;
      dy = (Math.random() - 0.5) * 70;
    }

    pieza.style.left = left + "%";
    pieza.style.top = top + "%";
    pieza.style.background =
      colores[Math.floor(Math.random() * colores.length)];

    pieza.style.setProperty("--dx", dx + "px");
    pieza.style.setProperty("--dy", dy + "px");
    pieza.style.setProperty(
      "--giro",
      (360 + Math.random() * 360) + "deg"
    );
    pieza.style.animationDelay = (Math.random() * 0.25) + "s";

    capa.appendChild(pieza);

    setTimeout(() => pieza.remove(), 2200);
  }
}


/* ==============================
   BOTÓN: CAPTURA DE PANTALLA
============================== */

function capturarPantallaAR() {

  const pantallaScanner = document.getElementById("scanner");
  const camaraBox = document.getElementById("camaraAR");

  if (!pantallaScanner || !camaraBox) return;

  const video = camaraBox.querySelector("video");
  const canvasAR = camaraBox.querySelector("canvas.a-canvas");

  if (!video || !canvasAR) {
    mostrarMensaje("La cámara aún no está lista");
    return;
  }

  /* 1. Forzar a A-Frame a renderizar el frame más reciente
        justo ahora. Sin esto, el navegador puede haber
        limpiado el buffer del canvas antes de leerlo y el
        modelo 3D saldría invisible en la captura. */

  const escena = obtenerEscenaAR();

  if (escena && escena.renderer && escena.object3D && escena.camera) {
    escena.renderer.render(escena.object3D, escena.camera);
  }

  /* 2. Componer cámara + modelo 3D en un solo canvas, del
        tamaño real del recuadro de la cámara */

  const anchoAR = camaraBox.clientWidth;
  const altoAR = camaraBox.clientHeight;

  const lienzoAR = document.createElement("canvas");
  lienzoAR.width = anchoAR;
  lienzoAR.height = altoAR;

  const ctxAR = lienzoAR.getContext("2d");
  ctxAR.drawImage(video, 0, 0, anchoAR, altoAR);
  ctxAR.drawImage(canvasAR, 0, 0, anchoAR, altoAR);

  const imagenAR = lienzoAR.toDataURL("image/png");

  /* 3. Meter esa imagen ya combinada como una <img> estática
        encima del recuadro (html2canvas no sabe leer video
        en vivo ni WebGL directamente, pero sí una <img>
        normal). Se quita justo después de capturar. */

  const imgTemporal = document.createElement("img");
  imgTemporal.src = imagenAR;
  imgTemporal.id = "imgCapturaTemporal";
  imgTemporal.style.position = "absolute";
  imgTemporal.style.top = "0";
  imgTemporal.style.left = "0";
  imgTemporal.style.width = "100%";
  imgTemporal.style.height = "100%";
  imgTemporal.style.zIndex = "10";
  imgTemporal.style.borderRadius = "22px";

  camaraBox.appendChild(imgTemporal);

  mostrarMensaje("Generando captura...");

  /* 4. Capturar TODA la pantalla del escáner (encabezado,
        recuadro AR ya "congelado" y los botones de abajo) */

  html2canvas(pantallaScanner, {
    backgroundColor: null,
    useCORS: true
  })
    .then((lienzoCompleto) => {

      lienzoCompleto.toBlob((blob) => {

        if (!blob) {
          mostrarMensaje("No se pudo generar la captura");
          return;
        }

        const url = URL.createObjectURL(blob);
        const nombreArchivo = `zona-home-ar-${Date.now()}.png`;

        const enlace = document.createElement("a");
        enlace.href = url;
        enlace.download = nombreArchivo;
        document.body.appendChild(enlace);
        enlace.click();
        document.body.removeChild(enlace);

        URL.revokeObjectURL(url);

        mostrarMensaje("Captura guardada");

      }, "image/png");

    })
    .catch((error) => {
      console.error(error);
      mostrarMensaje("No se pudo generar la captura");
    })
    .finally(() => {
      imgTemporal.remove();
    });
}
