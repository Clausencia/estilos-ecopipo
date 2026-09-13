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

/* 11. Alinear alto de tarjetas en los carruseles de productos
   El nombre del producto (una o dos lineas) y avisos como "¡Ultima
   unidad!" o "¡Solo quedan N en stock!" no siempre aparecen, asi que
   cada tarjeta tiene un alto natural distinto y el boton de compra
   queda a diferente altura segun la tarjeta. Se iguala por JS (no con
   un alto fijo en CSS) porque ese contenido es dinamico -- aplica a
   CUALQUIER carrusel de productos del sitio (no solo "En familia"),
   igualando cada carrusel contra si mismo. */
document.addEventListener('DOMContentLoaded', () => {
  function alinearAlturaCarruselesDeProductos() {
    document.querySelectorAll('.swiper-wrapper').forEach((wrapper) => {
      const items = [...wrapper.querySelectorAll(':scope > .product-item')];
      if (!items.length) return;

      items.forEach((item) => { item.style.height = 'auto'; });
      const alturaMaxima = Math.max(...items.map((item) => item.getBoundingClientRect().height));
      items.forEach((item) => { item.style.height = alturaMaxima + 'px'; });
    });
  }

  alinearAlturaCarruselesDeProductos();
  window.addEventListener('resize', alinearAlturaCarruselesDeProductos);
  new MutationObserver(alinearAlturaCarruselesDeProductos).observe(document.body, { childList: true, subtree: true });
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

/* 15. Boton de "Agregar al carrito" siempre visible, mensaje
   "Agregando.../¡Listo!" siempre oculto (carruseles y grid de
   productos)
   El tema alterna entre el boton real y el mensaje de feedback
   poniendo "display: none" en el atributo style de cada uno cuando le
   toca estar oculto. El problema: en varios contextos (confirmado en
   "Productos similares", en "La piel de tu bebe merece lo mejor", en
   la plantilla alterna ".buy-button-container" que usan los productos
   con variantes propias, y en el grid de categoria) ese "display:
   none" viene con !important INCLUIDO EN EL TEXTO del atributo style.
   Un !important puesto asi por el propio tema no se puede vencer desde
   NINGUNA regla en una hoja de estilos externa sin importar cuanta
   especificidad tenga -- el origen "inline" siempre gana esa
   comparacion. Se probaron reglas CSS con !important y especificidad
   creciente (incluso artificialmente muy alta): nunca funciono en
   estos casos. La unica forma de ganarle es sobreescribiendo ese MISMO
   atributo style por JS (ahi si funciona, porque no es una regla en
   competencia sino un reemplazo directo del valor inline).
   Se corrigen dos cosas a la vez:
   - El mensaje "Agregando.../¡Listo!" se mantiene siempre oculto (el
     carrito que se abre al agregar ya confirma la compra).
   - El boton/contenedor real se mantiene siempre visible, para que no
     desaparezca mientras dura la animacion (visto en vivo: hasta ~2
     segundos de hueco en blanco donde estaba el boton).
   Se revisa con un intervalo permanente en vez de solo reaccionar a
   mutaciones puntuales, porque la animacion del tema puede tardar
   varios segundos en resolverse por si sola y un click no siempre
   dispara otra mutacion que reactive la revision. */
document.addEventListener('DOMContentLoaded', () => {
  function corregirBotonesAgregar() {
    document.querySelectorAll('.js-addtocart-placeholder').forEach((el) => {
      if (getComputedStyle(el).display !== 'none') {
        el.style.setProperty('display', 'none', 'important');
      }
    });
    // Los productos con selector de tallas (clase "ecopipo-sin-boton",
    // ver seccion 10) deben quedar SIN boton de compra a proposito --
    // no forzarlos a mostrarse aqui, o se pelean con esa regla.
    document.querySelectorAll('.item-submit-container, .buy-button-container').forEach((el) => {
      if (el.closest('.ecopipo-sin-boton')) return;
      if (getComputedStyle(el).display === 'none') {
        el.style.setProperty('display', 'flex', 'important');
      }
    });
    document.querySelectorAll('input.js-addtocart').forEach((el) => {
      if (el.closest('.ecopipo-sin-boton')) return;
      if (getComputedStyle(el).display === 'none') {
        el.style.setProperty('display', 'flex', 'important');
      }
    });
  }

  corregirBotonesAgregar();
  // requestAnimationFrame en vez de setInterval: corre justo antes de
  // cada repintado del navegador (~cada 16ms), en vez de cada 150ms,
  // para reducir al minimo posible la ventana en la que un parpadeo
  // del tema alcanza a pintarse antes de que lo corrijamos.
  function bucleCorreccion() {
    corregirBotonesAgregar();
    requestAnimationFrame(bucleCorreccion);
  }
  requestAnimationFrame(bucleCorreccion);
});

/* 16. Feedback propio de "Agregando..." al hacer click
   Con el mensaje nativo del tema permanentemente oculto (seccion 15),
   ya no queda ningun indicador de que el click funciono mientras se
   agrega el producto -- el usuario ve un vacio de aprox. 1 segundo
   antes de que abra el carrito y no sabe si de verdad le dio al
   boton. En vez de intentar reactivar el mecanismo del tema (la razon
   de la seccion 15 es que ese mecanismo no es confiable), se cambia
   el texto del boton real directamente, algo que controlamos por
   completo y no compite con nada del tema. */
document.addEventListener(
  'click',
  (evento) => {
    const boton = evento.target.closest('input.js-addtocart');
    if (!boton || boton.closest('.ecopipo-sin-boton')) return;

    const valorOriginal = boton.value;
    boton.value = 'Agregando...';
    boton.style.setProperty('pointer-events', 'none', 'important');
    boton.style.setProperty('opacity', '0.85', 'important');

    setTimeout(() => {
      boton.value = valorOriginal;
      boton.style.removeProperty('pointer-events');
      boton.style.removeProperty('opacity');
    }, 1200);
  },
  true
);

/* 17. Tarjeta activa mas grande + ligera inclinacion en el carrusel
   principal de categorias (ver seccion 37 del CSS)
   Inspirado en demo82.leotheme.com (home-2): la tarjeta que queda mas
   cerca del centro visible del carrusel se ve mas grande y derecha,
   mientras las demas se inclinan levemente hacia un lado u otro segun
   de que lado del centro estan (como un abanico de tarjetas), sin
   importar cual categoria sea, y el efecto se actualiza en vivo
   mientras se arrastra. Ese carrusel de referencia usa Slick con
   centerMode, una libreria distinta a la que ya usa este sitio
   (Swiper). En vez de agregar una segunda libreria de carrusel solo
   para este efecto, se mide en cada frame que tan cerca esta cada
   tarjeta del centro del carrusel (con getBoundingClientRect) y se le
   aplica una escala + rotacion proporcional a esa cercania/lado -- el
   resultado visual es el mismo, sin depender de un modo de "centrado"
   que Swiper tendria que inicializar con parametros que no
   controlamos (el carrusel lo arma el propio tema de Tiendanube). */
document.addEventListener('DOMContentLoaded', () => {
  function actualizarEscalaCarruselCategorias() {
    const section = document.getElementById('ns-section-featured_categories_images');
    if (!section) return;

    const viewport = section.querySelector('.js-carousel-slider');
    if (!viewport) return;

    const vp = viewport.getBoundingClientRect();
    const centroX = vp.left + vp.width / 2;
    const tarjetas = [...section.querySelectorAll('.category-item-link')];
    const anguloMaximo = 6;

    /* "paso" = distancia entre los centros de dos tarjetas consecutivas
       (ancho de tarjeta + separacion). Sirve para medir que tan lejos
       esta cada tarjeta del centro en unidades de "cuantas tarjetas de
       distancia", en vez de pixeles crudos, para la formula del giro
       de abajo. */
    const centros = tarjetas.map((t) => {
      const r = t.getBoundingClientRect();
      return r.left + r.width / 2;
    });
    let paso = 0;
    for (let i = 1; i < centros.length; i++) paso += Math.abs(centros[i] - centros[i - 1]);
    paso = centros.length > 1 ? paso / (centros.length - 1) : 1;

    tarjetas.forEach((tarjeta, idx) => {
      const r = tarjeta.getBoundingClientRect();
      const centroTarjeta = centros[idx];
      const distanciaFirmada = centroTarjeta - centroX;
      const distancia = Math.abs(distanciaFirmada);
      const distanciaMaxima = r.width * 1.4;
      const factor = Math.max(0, 1 - distancia / distanciaMaxima);
      const escala = (1 + factor * 0.18).toFixed(3);

      /* Giro en forma de "cerro": 0 grados en la tarjeta central,
         maximo en la tarjeta vecina (a 1 tarjeta de distancia), y de
         vuelta a 0 en las tarjetas de los extremos (a 2 tarjetas de
         distancia) -- estas ultimas ademas bajan un poco (translateY),
         para que el conjunto forme una especie de triangulo con la
         central mas grande y derecha, como en la referencia de diseno. */
      const d = paso ? distanciaFirmada / paso : 0;
      const dAbs = Math.abs(d);
      const magnitudGiro = Math.max(0, 1 - Math.abs(dAbs - 1)) * anguloMaximo;
      const angulo = (Math.sign(d) * magnitudGiro).toFixed(2);
      const bajada = (Math.min(dAbs, 2) * 16).toFixed(1);

      /* translateY va primero en la lista para que se aplique en el
         espacio de pantalla ya rotado/escalado (si fuera al final,
         "bajaria" en el eje ya inclinado de la propia tarjeta en vez
         de bajar recto en pantalla). */
      tarjeta.style.transform =
        'translateY(' + bajada + 'px) rotate(' + angulo + 'deg) scale(' + escala + ')';
      tarjeta.style.transition = 'transform .15s ease-out';
      tarjeta.style.zIndex = factor > 0.5 ? '3' : '1';
    });

    requestAnimationFrame(actualizarEscalaCarruselCategorias);
  }

  requestAnimationFrame(actualizarEscalaCarruselCategorias);
});

/* 18. Contador de productos por tarjeta en el carrusel principal de
   categorias (ver seccion 37 del CSS)
   Tiendanube ya calcula cuantos productos tiene cada categoria y lo
   escribe en un bloque de esa misma pagina (".page-header-count",
   oculto en escritorio, pensado solo para mobile) -- en vez de
   escribir el numero a mano por categoria (que quedaria desactualizado
   en cuanto se agregue o quite un producto), se trae por fetch la
   pagina de cada categoria y se lee ese mismo texto. Se guarda en
   sessionStorage para no repetir las peticiones en cada carga de
   pagina dentro de la misma sesion del navegador. Categorias que no
   son un listado de productos normal (ej. "Look Total") no tienen ese
   bloque -- esa tarjeta simplemente se queda sin subtitulo.
   Funcion compartida con la seccion 19: el modo "loop" del carrusel
   (activado ahi) crea tarjetas clonadas para el scroll infinito, y esos
   clones no traen el contador si todavia no se habia insertado en el
   original al momento de clonar -- se vuelve a llamar esta misma
   funcion despues de activar el loop para completarlas (usa
   sessionStorage, asi que no repite peticiones de red). */
async function ecopipoAgregarConteoCategorias(section) {
  const enlaces = [...section.querySelectorAll('.category-item-link')];

  for (const enlace of enlaces) {
    if (enlace.querySelector('.ecopipo-cat-count')) continue;

    const href = enlace.getAttribute('href');
    if (!href) continue;

    try {
      const claveCache = 'ecopipo-cat-count:' + href;
      let texto = sessionStorage.getItem(claveCache);

      if (texto === null) {
        const respuesta = await fetch(href);
        const html = await respuesta.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const conteo = doc.querySelector('.page-header-count');
        texto = conteo ? conteo.textContent.trim() : '';
        sessionStorage.setItem(claveCache, texto);
      }

      if (texto) {
        const span = document.createElement('span');
        span.className = 'ecopipo-cat-count';
        span.textContent = texto;
        const textoTitulo = enlace.querySelector('.category-item-text');
        if (textoTitulo) textoTitulo.insertAdjacentElement('afterend', span);
      }
    } catch (e) {
      // Si falla el fetch (sin internet, categoria eliminada, etc.)
      // simplemente se deja esa tarjeta sin subtitulo.
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('ns-section-featured_categories_images');
  if (section) ecopipoAgregarConteoCategorias(section);
});

/* 19. Centrar el carrusel de categorias desde que carga la pagina y
   activar el modo "loop" (ver seccion 37 del CSS). Por defecto Swiper
   arranca con la primera tarjeta pegada al borde izquierdo
   (centeredSlides:false, loop:false), por lo que solo se alcanzan a
   ver 4 tarjetas completas, se pierde el efecto de "tarjeta central
   mas grande" hasta que el usuario arrastra el carrusel, y al llegar a
   la ultima categoria queda un espacio vacio en vez de repetir el
   carrusel desde el principio.
   Swiper solo arma su mecanica de loop (duplicando tarjetas en cada
   extremo para el efecto de scroll infinito) al inicializarse, asi que
   activar centeredSlides + loop sobre la instancia que ya crea el tema
   no alcanza con solo cambiar sus parametros -- hay que destruir esa
   instancia y crear una nueva con las mismas opciones mas loop:true.
   Se reintenta con requestAnimationFrame porque el tema inicializa
   Swiper de forma asincrona y el elemento puede no tener ".swiper"
   todavia en DOMContentLoaded. */
document.addEventListener('DOMContentLoaded', () => {
  function centrarYActivarLoopCarruselCategorias(intentos) {
    const section = document.getElementById('ns-section-featured_categories_images');
    if (!section) return;

    const viewport = section.querySelector('.js-carousel-slider');
    let sw = viewport && viewport.swiper;

    if (!sw) {
      if (intentos > 0) {
        requestAnimationFrame(() => centrarYActivarLoopCarruselCategorias(intentos - 1));
      }
      return;
    }

    if (!sw.params.loop) {
      const paramsBase = Object.assign({}, sw.params);
      sw.destroy(true, true);
      sw = new Swiper(
        viewport,
        Object.assign({}, paramsBase, {
          loop: true,
          centeredSlides: true,
          centeredSlidesBounds: false,
          loopAdditionalSlides: 2,
        })
      );
    }

    const indiceCentral = 2;
    sw.slideToLoop(indiceCentral, 0);
    sw.updateActiveIndex();

    /* El calculo interno de Swiper para centrar (slidesGrid) no queda
       exacto despues de ensanchar el contenedor por CSS (seccion 37):
       la tarjeta central queda unos pixeles desplazada del centro real
       de la pantalla, lo que se nota como una ligera inclinacion en la
       tarjeta que deberia verse derecha. Se corrige midiendo el
       desface real en pantalla y ajustando el translate del swiper por
       esa diferencia exacta. Con loop activo, la tarjeta realmente
       centrada se identifica por la clase ".swiper-slide-active" (no
       por indice, porque hay copias duplicadas con el mismo indice de
       categoria). */
    const vpRect = viewport.getBoundingClientRect();
    const centroVp = vpRect.left + vpRect.width / 2;
    const slideActivo = section.querySelector('.swiper-slide-active');
    const tarjetaCentral = slideActivo && slideActivo.querySelector('.category-item-link');
    if (tarjetaCentral) {
      const r = tarjetaCentral.getBoundingClientRect();
      const desface = r.left + r.width / 2 - centroVp;
      sw.setTranslate(sw.translate - desface);
      sw.updateActiveIndex();
      sw.updateSlidesClasses();
    }

    // Completar el contador de productos en las tarjetas clonadas por el loop.
    ecopipoAgregarConteoCategorias(section);
  }

  centrarYActivarLoopCarruselCategorias(120);
});

/* 20. Modal de "compra rapida" para el carrusel de productos del home
   (justo antes de "Pipo responde"). Al hacer click en un producto de
   esta seccion, en vez de navegar a su ficha (PDP) y sacar al usuario
   del home, se abre el modal nativo de "Quick Shop" que ya trae el
   tema Ipanema (imagen, nombre, precio, variantes y boton de agregar
   al carrito) -- ese modal ya existe en el HTML (#quickshop-modal) y
   el tema ya sabe llenarlo (LS.fillQuickshop), solo que normalmente se
   dispara desde botones con la clase ".js-quickshop-modal-open" que
   esta plantilla de carrusel no incluye.
   Se detecto ademas una inconsistencia propia del tema: abrir el modal
   con LS.fillQuickshop(...) le agrega la clase "in" (de un sistema de
   modal viejo, tipo Bootstrap), pero el CSS actual del tema en
   realidad posiciona el modal en pantalla segun la clase
   "modal-visible" (de un sistema mas nuevo) -- sin agregar esa clase
   a mano, el modal se queda montado fuera de la pantalla (mismo bug
   se puede reproducir en la propia demo del tema). Por eso aqui se
   agrega/quita "modal-visible" directamente en vez de depender de que
   el propio tema lo haga. */
document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('ns-section-featured_products');
  const modal = document.getElementById('quickshop-modal');
  if (!section || !modal || !window.LS || !window.LS.fillQuickshop) return;

  section.addEventListener('click', (e) => {
    const link = e.target.closest('.product-item-link');
    if (!link) return;

    e.preventDefault();
    window.LS.fillQuickshop(link);
    requestAnimationFrame(() => modal.classList.add('modal-visible'));
  });

  modal.addEventListener('click', (e) => {
    const cierra =
      e.target.closest('.js-modal-close-private') ||
      e.target.closest('.js-modal-overlay-private') ||
      e.target === modal;
    if (cierra) modal.classList.remove('modal-visible');
  });
});
