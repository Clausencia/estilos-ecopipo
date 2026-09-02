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
