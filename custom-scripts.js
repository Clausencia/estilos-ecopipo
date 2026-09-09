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

/* 8. Buscador de distribuidoras (por codigo postal)
   Reemplaza el formulario nativo de "Newsletter" del footer (que
   estaba duplicado: la misma captura de correo ya vive en la franja
   negra de arriba) por un campo de codigo postal. Al buscar, se abre
   un modal con las distribuidoras de ese estado.

   Fuentes de datos, ambas externas para no requerir tocar codigo
   cuando cambien:
   - Google Sheet leido via URL de exportacion directa
     (/export?format=csv&gid=), NO via "Publicar en la Web": con
     varias pestañas en el mismo archivo, publicar una desactivaba la
     otra (bug/comportamiento confuso de Sheets detectado en vivo).
     El export directo solo requiere que el archivo tenga activado
     "Cualquiera con el enlace puede ver". La dueña edita filas ahi
     (nombre, tienda, url, telefono, ciudad/estado) sin pedir cambios
     de codigo.
   - cp-mexico.json: tabla CP -> [municipio, estado] de SEPOMEX
     (32,247 codigos postales), servida desde este mismo repo, para
     resolver el CP que escribe el usuario a un estado sin depender
     de las APIs de pago de Google (Places/Geocoding). */
document.addEventListener('DOMContentLoaded', () => {
  const DISTRIBUIDORAS_CSV_URL =
    'https://docs.google.com/spreadsheets/d/1D30antKw7uOxgZlKUU6G3COGF3kFPKV10mn95qPE1OI/export?format=csv&gid=0';
  const CP_JSON_URL = 'https://estilos-ecopipo.vercel.app/cp-mexico.json';

  let distribuidoras = null;
  let cpTabla = null;

  const normalizar = (str) =>
    (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .trim();

  // Parser de CSV simple que respeta comillas (necesario porque
  // "Ciudad, Estado" trae una coma dentro de un campo entrecomillado).
  function parseCSV(texto) {
    const filas = [];
    let fila = [];
    let campo = '';
    let entreComillas = false;

    for (let i = 0; i < texto.length; i++) {
      const c = texto[i];
      if (entreComillas) {
        if (c === '"' && texto[i + 1] === '"') {
          campo += '"';
          i++;
        } else if (c === '"') {
          entreComillas = false;
        } else {
          campo += c;
        }
      } else if (c === '"') {
        entreComillas = true;
      } else if (c === ',') {
        fila.push(campo);
        campo = '';
      } else if (c === '\n' || c === '\r') {
        if (c === '\r' && texto[i + 1] === '\n') i++;
        fila.push(campo);
        filas.push(fila);
        fila = [];
        campo = '';
      } else {
        campo += c;
      }
    }
    if (campo || fila.length) {
      fila.push(campo);
      filas.push(fila);
    }
    return filas.filter((f) => f.length > 1 || f[0]);
  }

  function parseCiudadEstado(texto) {
    if (/ciudad de m[eé]xico/i.test(texto)) {
      return { ciudad: 'Ciudad de México', estado: 'Ciudad de México' };
    }
    const partes = texto.split(',');
    if (partes.length >= 2) {
      return { ciudad: partes[0].trim(), estado: partes.slice(1).join(',').trim() };
    }
    return { ciudad: texto.trim(), estado: texto.trim() };
  }

  async function cargarDistribuidoras() {
    if (distribuidoras) return distribuidoras;
    const res = await fetch(DISTRIBUIDORAS_CSV_URL);
    const texto = await res.text();
    // Si el Sheet deja de estar publicado, Google responde con una
    // pagina HTML de error (a veces incluso con status 200) en vez
    // del CSV -- se detecta y se lanza un error explicito en vez de
    // intentar parsear HTML como si fueran filas validas, que dejaba
    // el buscador colgado en "Buscando..." sin avisar del problema.
    if (!res.ok || /^\s*<(!doctype|html)/i.test(texto)) {
      throw new Error('El CSV de distribuidoras no esta disponible (revisar publicacion del Sheet).');
    }
    const filas = parseCSV(texto);
    const encabezado = filas[0].map((h) => h.trim().toLowerCase());
    const idx = {
      nombre: encabezado.indexOf('nombre'),
      tienda: encabezado.indexOf('tienda'),
      url: encabezado.indexOf('url'),
      telefono: encabezado.indexOf('teléfono') !== -1 ? encabezado.indexOf('teléfono') : encabezado.indexOf('telefono'),
      ciudadEstado: encabezado.findIndex((h) => h.includes('ciudad')),
    };

    distribuidoras = filas.slice(1).map((fila) => {
      const { ciudad, estado } = parseCiudadEstado(fila[idx.ciudadEstado] || '');
      return {
        nombre: fila[idx.nombre] || '',
        tienda: fila[idx.tienda] || '',
        url: fila[idx.url] || '#',
        telefono: (fila[idx.telefono] || '').replace(/\D/g, ''),
        ciudad,
        estado,
      };
    });
    return distribuidoras;
  }

  async function cargarTablaCP() {
    if (cpTabla) return cpTabla;
    const res = await fetch(CP_JSON_URL);
    cpTabla = await res.json();
    return cpTabla;
  }

  function renderResultados(contenedor, lista, estadoUsuario) {
    if (!lista.length) {
      contenedor.innerHTML =
        '<p class="ecopipo-dist-empty">Por ahora no tenemos distribuidoras registradas en ' +
        (estadoUsuario || 'tu zona') +
        '. Escríbenos y con gusto te ayudamos a conseguir tu pañal Ecopipo.</p>';
      return;
    }
    contenedor.innerHTML = lista
      .map(
        (d) =>
          '<div class="ecopipo-dist-card">' +
          '<h4>' + d.tienda + '</h4>' +
          '<p class="ecopipo-dist-ciudad">' + d.ciudad + '</p>' +
          '<div class="ecopipo-dist-actions">' +
          (d.telefono
            ? '<a href="https://wa.me/52' + d.telefono + '" target="_blank" rel="noopener">WhatsApp</a>'
            : '') +
          '<a href="' + d.url + '" target="_blank" rel="noopener">Visitar tienda</a>' +
          '</div>' +
          '</div>'
      )
      .join('');
  }

  async function buscarPorCP(cp, contenedor) {
    contenedor.innerHTML = '<p class="ecopipo-dist-empty">Buscando...</p>';
    let lista, tabla;
    try {
      [lista, tabla] = await Promise.all([cargarDistribuidoras(), cargarTablaCP()]);
    } catch (err) {
      contenedor.innerHTML =
        '<p class="ecopipo-dist-empty">No pudimos cargar el directorio de distribuidoras en este momento. Intenta de nuevo en unos minutos o escríbenos por WhatsApp.</p>';
      return;
    }
    const info = tabla[cp];
    if (!info) {
      contenedor.innerHTML =
        '<p class="ecopipo-dist-empty">No reconocemos ese código postal. Verifica que tenga 5 dígitos.</p>';
      return;
    }
    const estadoUsuario = info[1];
    const coincidencias = lista.filter((d) => normalizar(d.estado) === normalizar(estadoUsuario));
    renderResultados(contenedor, coincidencias, estadoUsuario);
  }

  // ---- Modal ----
  const modal = document.createElement('div');
  modal.id = 'ecopipo-modal-distribuidoras';
  modal.innerHTML =
    '<div class="ecopipo-modal-backdrop"></div>' +
    '<div class="ecopipo-modal-content" role="dialog" aria-modal="true" aria-labelledby="ecopipo-modal-dist-title">' +
    '<button type="button" class="ecopipo-modal-close" aria-label="Cerrar">&times;</button>' +
    '<h3 id="ecopipo-modal-dist-title">Encuentra tu distribuidora</h3>' +
    '<div class="ecopipo-dist-buscador">' +
    '<input type="text" inputmode="numeric" maxlength="5" placeholder="Tu código postal" class="ecopipo-dist-input">' +
    '<button type="button" class="ecopipo-dist-buscar">Buscar</button>' +
    '</div>' +
    '<div class="ecopipo-dist-resultados"></div>' +
    '</div>';
  document.body.appendChild(modal);

  const inputModal = modal.querySelector('.ecopipo-dist-input');
  const botonModal = modal.querySelector('.ecopipo-dist-buscar');
  const resultadosModal = modal.querySelector('.ecopipo-dist-resultados');

  const ejecutarBusquedaModal = () => {
    const cp = inputModal.value.trim();
    if (cp.length === 5) buscarPorCP(cp, resultadosModal);
  };
  botonModal.addEventListener('click', ejecutarBusquedaModal);
  inputModal.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') ejecutarBusquedaModal();
  });

  const abrirModalDist = (cpInicial) => {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (cpInicial) {
      inputModal.value = cpInicial;
      ejecutarBusquedaModal();
    }
  };
  const cerrarModalDist = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  };
  modal.querySelector('.ecopipo-modal-close').addEventListener('click', cerrarModalDist);
  modal.querySelector('.ecopipo-modal-backdrop').addEventListener('click', cerrarModalDist);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarModalDist();
  });

  // ---- Reemplazo del formulario de Newsletter en el footer ----
  const contenedorFooter = document.querySelector('.footer-newsletter-container');
  if (!contenedorFooter) return;

  const tituloFooter = contenedorFooter.querySelector('.footer-newsletter-title');
  const descFooter = contenedorFooter.querySelector('.footer-newsletter-description');
  const formFooter = contenedorFooter.querySelector('.footer-newsletter-form');

  if (tituloFooter) tituloFooter.textContent = 'Encuentra tu distribuidora';
  if (descFooter) descFooter.textContent = 'Ingresa tu código postal';
  if (formFooter) formFooter.style.display = 'none';

  const campoFooter = document.createElement('div');
  campoFooter.className = 'ecopipo-dist-footer-field';
  campoFooter.innerHTML =
    '<input type="text" inputmode="numeric" maxlength="5" placeholder="Tu código postal" class="ecopipo-dist-footer-input">' +
    '<button type="button" class="ecopipo-dist-footer-buscar">Buscar</button>';
  contenedorFooter.appendChild(campoFooter);

  const inputFooter = campoFooter.querySelector('.ecopipo-dist-footer-input');
  const botonFooter = campoFooter.querySelector('.ecopipo-dist-footer-buscar');

  const ejecutarBusquedaFooter = () => {
    const cp = inputFooter.value.trim();
    if (cp.length === 5) abrirModalDist(cp);
  };
  botonFooter.addEventListener('click', ejecutarBusquedaFooter);
  inputFooter.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') ejecutarBusquedaFooter();
  });
});

/* 9. Foto estatica junto al carrusel de "Categorias destacadas"
   Reestructura #ns-section-featured_categories_pills (titulo +
   carrusel de pills, antes en una sola fila) para agregar una imagen
   fija a la izquierda -- inspirado en el layout de mezcaleroboots.com.
   La URL de la imagen se lee de una celda de Google Sheets (via URL
   de exportacion directa, ver seccion 8 sobre por que no se usa
   "Publicar en la Web") en vez de venir escrita aqui, para que la
   dueña pueda cambiar la foto ella misma editando esa celda, sin
   pedir cambios
   de codigo. */
document.addEventListener('DOMContentLoaded', () => {
  const FOTO_CATEGORIAS_CSV_URL =
    'https://docs.google.com/spreadsheets/d/1D30antKw7uOxgZlKUU6G3COGF3kFPKV10mn95qPE1OI/export?format=csv&gid=270158370';

  const section = document.getElementById('ns-section-featured_categories_pills');
  if (!section) return;

  const flexRow = section.querySelector('.d-flex.flex-row');
  if (!flexRow) return;

  fetch(FOTO_CATEGORIAS_CSV_URL)
    .then((res) => res.text())
    .then((texto) => {
      const filas = texto.trim().split('\n');
      const url = (filas[1] || '').trim();
      if (!url) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'ecopipo-cat-right';
      while (flexRow.firstChild) {
        wrapper.appendChild(flexRow.firstChild);
      }
      flexRow.appendChild(wrapper);

      const img = document.createElement('img');
      img.className = 'ecopipo-cat-photo';
      img.src = url;
      img.alt = 'Categorías destacadas';
      flexRow.insertBefore(img, wrapper);
    })
    .catch(() => {});
});

/* 10. Selector de talla en hover (grid/carrusel de productos)
   Cada .product-item con mas de una variante trae un atributo
   data-variants (JSON con precio, sku, disponibilidad e id por
   variante) inyectado por el propio tema -- no hace falta pedir esa
   info por otra via. Se construye una fila de tallas superpuesta a
   la imagen, visible en hover (inspirado en timberland.com.mx). Cada
   talla enlaza a "producto?variant=ID", que Tiendanube ya respeta
   para preseleccionar esa variante en el PDP (confirmado en vivo).
   Productos sin variantes reales (data-variants con un solo option0,
   ej. simples/sin tallas) no muestran nada. */
document.addEventListener('DOMContentLoaded', () => {
  function construirSelectoresDeTalla() {
    document.querySelectorAll('.product-item[data-variants]').forEach((item) => {
      if (item.querySelector('.ecopipo-size-hover')) return;

      let variantes;
      try {
        variantes = JSON.parse(item.getAttribute('data-variants'));
      } catch (e) {
        return;
      }

      const opciones = [...new Set(variantes.map((v) => v.option0).filter(Boolean))];
      if (opciones.length < 2) return;

      const enlace = item.querySelector('.js-product-item-image-link-private') || item.querySelector('a[href*="/productos/"]');
      const contenedorImagen = item.querySelector('[class*="product-item-image-container"]');
      if (!enlace || !contenedorImagen) return;

      const urlBase = enlace.getAttribute('href').split('?')[0];

      const overlay = document.createElement('div');
      overlay.className = 'ecopipo-size-hover';
      overlay.innerHTML = opciones
        .map((opcion) => {
          const variante = variantes.find((v) => v.option0 === opcion);
          const disponible = variante ? variante.available : true;
          const href = variante ? urlBase + '?variant=' + variante.id : urlBase;
          return (
            '<a href="' + href + '" class="ecopipo-size-pill' + (disponible ? '' : ' is-disabled') + '">' +
            opcion +
            '</a>'
          );
        })
        .join('');

      contenedorImagen.style.position = 'relative';
      contenedorImagen.appendChild(overlay);
      // Marca el producto para que el CSS (seccion 29) le quite el
      // boton de compra: la foto + el selector ya llevan al producto.
      // Los productos simples (sin variantes) no llegan a este punto
      // porque arriba se corta con "opciones.length < 2 return".
      item.classList.add('ecopipo-sin-boton');
    });
  }

  construirSelectoresDeTalla();
  // Los grids/carruseles paginan por AJAX (ver seccion 4 sobre el
  // mismo patron), asi que se observa el DOM en vez de correr una
  // sola vez al cargar.
  new MutationObserver(construirSelectoresDeTalla).observe(document.body, { childList: true, subtree: true });
});

/* 11. Alinear alto de tarjetas del carrusel "En familia"
   Sin el boton de compra (ver seccion 29 del CSS), la unica fuente
   de diferencia de alto entre tarjetas es el aviso "¡Ultima unidad!"
   que solo se muestra en algunos productos. Se iguala por JS en vez
   de reservar espacio fijo en CSS porque ese aviso puede aparecer o
   desaparecer segun el stock disponible en cualquier momento. */
document.addEventListener('DOMContentLoaded', () => {
  function alinearAlturaCarruselFamilia() {
    const wrapper = document.querySelector('#ns-section-featured_products_2 .swiper-wrapper');
    if (!wrapper) return;

    const items = [...wrapper.querySelectorAll(':scope > .product-item')];
    if (!items.length) return;

    items.forEach((item) => { item.style.height = 'auto'; });
    const alturaMaxima = Math.max(...items.map((item) => item.getBoundingClientRect().height));
    items.forEach((item) => { item.style.height = alturaMaxima + 'px'; });
  }

  alinearAlturaCarruselFamilia();
  window.addEventListener('resize', alinearAlturaCarruselFamilia);
  new MutationObserver(alinearAlturaCarruselFamilia).observe(document.body, { childList: true, subtree: true });
});

/* 12. "Ordenar por" junto al breadcrumb en paginas de categoria
   El dropdown "Ordenar por" vive por defecto en la barra de filtros,
   muy por debajo del breadcrumb, dejando un hueco grande bajo el
   banner. Se reubica junto al breadcrumb (misma fila y altura). El
   widget que se mueve (.product-list-sort-by) ya es exclusivo de
   escritorio (d-none d-md-inline-block por dentro), asi que mover su
   posicion en el DOM no afecta el buscador/orden de categoria en
   mobile, que usa un boton y modal aparte. */
document.addEventListener('DOMContentLoaded', () => {
  function moverOrdenarJuntoABreadcrumb() {
    const titleRow = document.querySelector('.page-header-title-row');
    if (!titleRow) return;

    const wrap = titleRow.firstElementChild;
    if (!wrap) return;

    const breadcrumb = wrap.querySelector('.breadcrumbs');
    const sortWidget = document.querySelector('.product-list-sort-by');
    if (!breadcrumb || !sortWidget) return;
    if (breadcrumb.parentElement.classList.contains('ecopipo-breadcrumb-sort-row')) return;

    const row = document.createElement('div');
    row.className = 'ecopipo-breadcrumb-sort-row';
    wrap.insertBefore(row, breadcrumb);
    row.appendChild(breadcrumb);
    row.appendChild(sortWidget);
  }

  moverOrdenarJuntoABreadcrumb();
  new MutationObserver(moverOrdenarJuntoABreadcrumb).observe(document.body, { childList: true, subtree: true });
});

/* 13. Corregir destino del cintillo "Registrate y recibe 10%..."
   El campo de link de la barra de anuncios quedo mal capturado en el
   admin (guarda el texto literal "news letter" en vez de una URL),
   lo que saca al usuario del sitio. Se corrige por JS en vez de en el
   admin porque la barra se repite varias veces (efecto marquee) y
   Tiendanube puede volver a duplicar ese enlace roto al reflowar el
   carrusel de texto. */
document.addEventListener('DOMContentLoaded', () => {
  function corregirLinkCintilloNewsletter() {
    document.querySelectorAll('a[href="news letter"]').forEach((a) => {
      a.setAttribute('href', '/#ns-section-newsletter');
    });
  }

  corregirLinkCintilloNewsletter();
  new MutationObserver(corregirLinkCintilloNewsletter).observe(document.body, { childList: true, subtree: true });
});

/* 14. Titulo para el carrusel de categorias estilo Timberland
   La plantilla de este bloque de categorias (seccion 31 del CSS) no
   tiene campo de titulo en el editor de Tiendanube. Se agrega uno
   por JS reutilizando las mismas clases del tema (heading-block h4)
   que usan los demas titulos de seccion del sitio, para mantener la
   tipografia uniforme en vez de definir un estilo nuevo. */
document.addEventListener('DOMContentLoaded', () => {
  function agregarTituloCarruselCategorias() {
    const section = document.getElementById('ns-section-featured-categories_1788818704159');
    if (!section) return;
    if (section.querySelector('.ecopipo-carousel-title')) return;

    const carousel = section.querySelector('.js-carousel-section');
    if (!carousel) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'container ecopipo-carousel-title-wrap';
    wrapper.innerHTML = '<div class="heading-block h4 block-fill ecopipo-carousel-title">Explora más de Ecopipo</div>';
    carousel.parentNode.insertBefore(wrapper, carousel);
  }

  agregarTituloCarruselCategorias();
  new MutationObserver(agregarTituloCarruselCategorias).observe(document.body, { childList: true, subtree: true });
});
