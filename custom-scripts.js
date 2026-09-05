/* 1. Nombre Producto Dinamico
   Copia el titulo del producto (h1) a cualquier elemento con clase
   .nombre-producto en la pagina. */
document.addEventListener('DOMContentLoaded', () => {
  const nombre = (
    document.querySelector('h1.js-product-name') ||
    document.querySelector('.js-product-name') ||
    document.querySelector('h1')
  )?.innerText.trim() || '';

  if (nombre) {
    document.querySelectorAll('.nombre-producto').forEach((el) => {
      el.textContent = nombre;
    });
  }
});

/* 2. Corrector Simbolo $
   Envuelve el signo de pesos en un span con fuente Arial para evitar
   que se vea con el trazo doble de la tipografia decorativa del sitio.
   Se corre al cargar y se repite a los 500ms/1500ms para alcanzar
   contenido que aparece despues (ej. el carrusel de recomendados). */
document.addEventListener('DOMContentLoaded', () => {
  const corregirSimboloPeso = () => {
    document.querySelectorAll('span, p, div, a, .price, .js-price-display').forEach((el) => {
      if (el.children.length === 0 && el.textContent.includes('$')) {
        el.innerHTML = el.textContent.replace(
          /\$/g,
          '<span style="font-family:Arial,sans-serif!important;display:inline-block">$</span>'
        );
      }
    });
  };

  corregirSimboloPeso();
  setTimeout(corregirSimboloPeso, 500);
  setTimeout(corregirSimboloPeso, 1500);
});

/* 4. Texto "Agregar al carrito" en grid y carrusel
   El boton del grid y del carrusel de recomendados trae "Comprar" por
   defecto del tema; se renombra para que diga lo mismo que el boton
   del PDP. Se usa un MutationObserver (no un timeout fijo) porque el
   grid pagina por AJAX y el carrusel de recomendados carga su
   contenido de forma asincrona, en momentos que no son predecibles.

   El overlay de feedback ("Agregando.../Listo") tiene ademas su propio
   texto por defecto ("Comprar") hardcodeado en el HTML del tema,
   independiente del value del input real. Si varios clics simultaneos
   dejan ese overlay visible en un estado intermedio (bug ya conocido
   del tema, ver BITACORA.md), ese texto interno tambien debe decir
   "Agregar al carrito" para no mostrar un mismatch visible. */
document.addEventListener('DOMContentLoaded', () => {
  const TEXTO_BOTON = 'Agregar al carrito';
  const renombrarBotones = () => {
    document.querySelectorAll('.product-item .item-submit-container input.js-addtocart').forEach((input) => {
      if (input.value !== TEXTO_BOTON) input.value = TEXTO_BOTON;
    });
    document.querySelectorAll('.product-item .js-addtocart-placeholder .js-addtocart-text').forEach((textEl) => {
      if (textEl.textContent.trim() !== TEXTO_BOTON) textEl.textContent = TEXTO_BOTON;
    });
  };

  renombrarBotones();
  new MutationObserver(renombrarBotones).observe(document.body, { childList: true, subtree: true });
});

/* 5. Auto-Slider Categorias
   Activa el autoplay del slider de categorias (el tema no lo trae
   activado por defecto). Espera a que el swiper exista antes de
   configurarlo. */
document.addEventListener('DOMContentLoaded', () => {
  const intervalo = setInterval(() => {
    const contenedor =
      document.querySelector('[data-store*="categories"] .swiper-container') ||
      document.querySelector('.js-category-slider-container .swiper-container');

    if (contenedor && contenedor.swiper) {
      contenedor.swiper.params.autoplay = { delay: 3000, disableOnInteraction: false };
      contenedor.swiper.autoplay.start();
      clearInterval(intervalo);
    }
  }, 400);
});

/* 6. Segundo Cintillo (envio gratis)
   Tiendanube solo trae un slot nativo de barra de anuncios (el
   "adbar", arriba del header). Para tener un segundo cintillo debajo
   del menu y antes del banner principal -- como en referencias de
   otras tiendas -- se inyecta a mano como seccion hermana de
   .section-header, fuera del wrapper sticky del header para que
   se desplace con el resto del contenido en vez de quedar fijo. */
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('ecopipo-cintillo2')) return;

  const header = document.querySelector('.section-header');
  if (!header) return;

  const ICONO_CAMION =
    '<svg viewBox="0 0 640 512" width="16" height="16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M0 96C0 78.3 14.3 64 32 64H384c17.7 0 32 14.3 32 32V128h60.6c11.3 0 22.2 4.5 30.2 12.5l70.1 70.1c8 8 12.5 18.9 12.5 30.2V352c17.7 0 32 14.3 32 32v32c0 17.7-14.3 32-32 32H592c0 53-43 96-96 96s-96-43-96-96H256c0 53-43 96-96 96s-96-43-96-96H32c-17.7 0-32-14.3-32-32V96zM416 160V352h94.2L448 289.8V196.4L416 160zM496 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM160 416a48 48 0 1 0 0 96 48 48 0 1 0 0-96z"/></svg>';

  const item =
    '<span class="ecopipo-cintillo2-item">Envío sin costo a todo el país a partir de $1,500</span>' +
    '<span class="ecopipo-cintillo2-icon">' + ICONO_CAMION + '</span>';

  const cintillo = document.createElement('div');
  cintillo.id = 'ecopipo-cintillo2';
  cintillo.innerHTML = '<div class="ecopipo-cintillo2-track">' + item.repeat(8) + '</div>';

  header.parentNode.insertBefore(cintillo, header.nextSibling);

  /* Olas decorativas arriba/abajo del cintillo (misma tecnica del
     generador "getwaves.io": un path repetido 4 veces en capas
     .ecopipo-wave-parallaxN, cada una animada a distinta velocidad
     y opacidad, dando el efecto de agua en movimiento). El SVG usa
     fill="currentColor" para heredar el color via CSS. */
  const waveSVG =
    '<svg class="ecopipo-wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none">' +
    '<defs><path id="ecopipo-wave-path" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"></path></defs>' +
    '<g class="ecopipo-wave-parallax1"><use xlink:href="#ecopipo-wave-path" x="50" y="3" fill="currentColor"></use></g>' +
    '<g class="ecopipo-wave-parallax2"><use xlink:href="#ecopipo-wave-path" x="50" y="0" fill="currentColor"></use></g>' +
    '<g class="ecopipo-wave-parallax3"><use xlink:href="#ecopipo-wave-path" x="50" y="9" fill="currentColor"></use></g>' +
    '<g class="ecopipo-wave-parallax4"><use xlink:href="#ecopipo-wave-path" x="50" y="6" fill="currentColor"></use></g>' +
    '</svg>';

  const waveTop = document.createElement('div');
  waveTop.className = 'ecopipo-wave-divider ecopipo-wave-divider-top';
  waveTop.innerHTML = waveSVG;

  const waveBottom = document.createElement('div');
  waveBottom.className = 'ecopipo-wave-divider ecopipo-wave-divider-bottom';
  waveBottom.innerHTML = waveSVG;

  cintillo.parentNode.insertBefore(waveTop, cintillo);
  cintillo.parentNode.insertBefore(waveBottom, cintillo.nextSibling);
});

/* 7. Modal "La mama detras de Ecopipo"
   El boton "CONOCELA" del banner de Ixchel abria (o abrira) una
   pagina aparte para un texto breve -- se reemplaza por un modal para
   no sacar al usuario del home por tan poco contenido. Se intercepta
   el click del boton nativo del banner (que sigue siendo un <a>
   editable desde el admin) y se previene su navegacion por defecto. */
document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('#ns-section-banners_1788583047003');
  if (!section) return;

  const boton = section.querySelectorAll('.btn')[0];
  if (!boton) return;

  const modal = document.createElement('div');
  modal.id = 'ecopipo-modal-ixchel';
  modal.innerHTML =
    '<div class="ecopipo-modal-backdrop"></div>' +
    '<div class="ecopipo-modal-content" role="dialog" aria-modal="true" aria-labelledby="ecopipo-modal-ixchel-title">' +
    '<button type="button" class="ecopipo-modal-close" aria-label="Cerrar">&times;</button>' +
    '<h3 id="ecopipo-modal-ixchel-title">La mamá detrás de Ecopipo</h3>' +
    '<p>Ecopipo nació en 2009 cuando su fundadora, Ixchel Anaya buscó una alternativa práctica, económica y sustentable para cuidar la piel de su bebé sin dañar el planeta. De esa necesidad surgió la marca mexicana hecha por y para mamás.</p>' +
    '<p>Hoy, Ecopipo es un movimiento de alcance internacional con más de 1,900 distribuidoras en 19 países. A través de productos de alta calidad y un modelo de comercio justo, impulsamos la independencia financiera de miles de mujeres mientras llevamos un mensaje de ecología a cada hogar.</p>' +
    '</div>';
  document.body.appendChild(modal);

  const abrirModal = () => {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  const cerrarModal = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  modal.querySelector('.ecopipo-modal-close').addEventListener('click', cerrarModal);
  modal.querySelector('.ecopipo-modal-backdrop').addEventListener('click', cerrarModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarModal();
  });

  boton.addEventListener('click', (e) => {
    e.preventDefault();
    abrirModal();
  });
});
