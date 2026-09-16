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
   que se vea con el trazo doble de la tipografia decorativa del sitio
   (Palanquin). Se corre al cargar y se repite a los 500ms/1500ms para
   alcanzar contenido que aparece despues (ej. el carrusel de
   recomendados).
   Se expone como funcion global (ecopipoCorregirSimboloPeso) para que
   otras secciones de este archivo puedan volver a llamarla cuando
   inyectan contenido nuevo con precios en momentos que estos timeouts
   fijos no alcanzan a cubrir -- por ejemplo el modal de compra rapida
   (seccion 20), que puede abrirse minutos despues de cargada la
   pagina, mucho mas tarde que el ultimo timeout de aqui. */
function ecopipoCorregirSimboloPeso() {
  document.querySelectorAll('span, p, div, a, .price, .js-price-display').forEach((el) => {
    if (el.children.length === 0 && el.textContent.includes('$')) {
      el.innerHTML = el.textContent.replace(
        /\$/g,
        '<span style="font-family:Arial,sans-serif!important;display:inline-block">$</span>'
      );
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  ecopipoCorregirSimboloPeso();
  setTimeout(ecopipoCorregirSimboloPeso, 500);
  setTimeout(ecopipoCorregirSimboloPeso, 1500);
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
  /* El titulo del modal ("Encuentra tu distribuidora") va en un <div>,
     no en un <h3>: este modal se inyecta una sola vez por pagina y
     queda pegado a document.body (oculto hasta que se abre), asi que
     su HTML esta presente en TODAS las paginas del sitio, PDP
     incluido -- si fuera un h3 real, herramientas de SEO/accesibilidad
     que leen la jerarquia de encabezados de la pagina lo contarian
     como si fuera un encabezado real del PDP (rompiendo su jerarquia
     H1>H2>H3), cuando en realidad es solo el titulo de un dialogo del
     footer. El atributo aria-labelledby del modal (mas abajo) sigue
     funcionando igual de bien apuntando a un <div> por id -- no
     requiere que el elemento referenciado sea un encabezado. */
  const modal = document.createElement('div');
  modal.id = 'ecopipo-modal-distribuidoras';
  modal.innerHTML =
    '<div class="ecopipo-modal-backdrop"></div>' +
    '<div class="ecopipo-modal-content" role="dialog" aria-modal="true" aria-labelledby="ecopipo-modal-dist-title">' +
    '<button type="button" class="ecopipo-modal-close" aria-label="Cerrar">&times;</button>' +
    '<div id="ecopipo-modal-dist-title" class="ecopipo-modal-title">Encuentra tu distribuidora</div>' +
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
   esta seccion (imagen o texto, cualquier area menos el boton de
   agregar al carrito), en vez de navegar a su ficha (PDP) y sacar al
   usuario del home, se abre el modal nativo de "Quick Shop" que ya
   trae el tema Ipanema (imagen, nombre, precio, variantes y boton de
   agregar al carrito) -- ese modal ya existe en el HTML
   (#quickshop-modal) y el tema ya sabe llenarlo (LS.fillQuickshop),
   solo que normalmente se dispara desde botones con la clase
   ".js-quickshop-modal-open" que esta plantilla de carrusel no
   incluye.
   Se detectaron ademas dos inconsistencias propias del tema:
   1) Abrir el modal con LS.fillQuickshop(...) le agrega la clase "in"
      (de un sistema de modal viejo, tipo Bootstrap), pero el CSS
      actual del tema en realidad posiciona el modal en pantalla segun
      la clase "modal-visible" (de un sistema mas nuevo) -- sin esa
      clase el modal se queda montado fuera de la pantalla.
   2) LS.fillQuickshop mueve (no clona) el formulario real de "agregar
      al carrito" del producto hacia el modal, y al cerrar intenta
      devolverlo a un contenedor ".js-item-variants" dentro de la
      tarjeta original -- pero esta plantilla de card (mas simple que
      la de categoria) no tiene ese contenedor, asi que el formulario
      se quedaba atrapado en el modal para siempre: la tarjeta original
      perdia su boton, y al abrir otro producto sin haber corregido
      esto el formulario anterior se quedaba pegado junto al nuevo
      (dos botones). Por eso aqui se lleva registro manual de que
      tarjeta "presto" su formulario y se regresa ahi mismo -- al
      cerrar el modal, y tambien justo antes de abrir un producto
      nuevo (por si el usuario paso de un producto a otro sin cerrar
      primero). */
document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('ns-section-featured_products');
  const modal = document.getElementById('quickshop-modal');
  if (!section || !modal) return;

  let contenedorOrigenForm = null;

  function devolverFormularioQuickshop() {
    const formActual = document.querySelector('#quickshop-form .js-product-form');
    if (formActual && contenedorOrigenForm) {
      contenedorOrigenForm.appendChild(formActual);
    }
    contenedorOrigenForm = null;
  }

  section.addEventListener('click', (e) => {
    if (e.target.closest('.product-item-quick-shop-container')) return;

    const tarjeta = e.target.closest('.js-item-product');
    if (!tarjeta) return;
    if (!e.target.closest('a')) return;

    /* window.LS (jQuery y el bundle de la tienda) se cargan de forma
       asincrona -- en redes mas lentas (tipico en movil) el usuario
       puede tocar un producto antes de que jQuery/LS terminen de
       cargar. Antes esta seccion completa se desactivaba si LS no
       estaba listo justo en el momento de DOMContentLoaded, lo que la
       dejaba inutil en movil (el link navegaba normal a la ficha del
       producto en vez de abrir el modal). Ahora la comprobacion se
       hace en el momento del click, no al cargar la pagina -- para
       cuando el usuario realmente toca algo, LS casi siempre ya esta
       listo. */
    if (!window.LS || !window.LS.fillQuickshop) return;

    e.preventDefault();
    devolverFormularioQuickshop();

    const linkReferencia = tarjeta.querySelector('.product-item-link');
    contenedorOrigenForm = tarjeta.querySelector('.product-item-quick-shop-container');

    modal.removeAttribute('style');
    modal.classList.remove('in', 'modal-visible');
    window.LS.fillQuickshop(linkReferencia);
    requestAnimationFrame(() => modal.classList.add('modal-visible'));

    /* El modal puede abrirse minutos despues de cargada la pagina,
       mucho mas tarde que los timeouts fijos del corrector del simbolo
       $ (seccion 2), asi que su precio y precio tachado quedarian sin
       corregir (fuente Palanquin con el trazo doble). Se vuelve a
       llamar aqui mismo: una vez de inmediato y otra vez a los 400ms
       por si el precio con descuento tarda en llegar (fillQuickshop a
       veces trae los datos de variantes por un fetch aparte). */
    ecopipoCorregirSimboloPeso();
    setTimeout(ecopipoCorregirSimboloPeso, 400);
  });

  /* El listener de cierre se pone en "document" (no en "modal") porque
     el fondo oscurecido en mobile (ver seccion 38 del CSS) es un
     elemento HERMANO de "#quickshop-modal" (hijo directo del <body>,
     propio del tema: ".js-modal-overlay-private[data-target=...]"),
     no un descendiente -- un listener en "modal" nunca recibiria esos
     clicks por burbujeo. Se filtra por "data-target='#quickshop-modal'"
     para no reaccionar a botones de cierre de otros modales del sitio
     (carrito, menu movil) que comparten la misma clase
     ".js-modal-close-private". */
  document.addEventListener('click', (e) => {
    const cierra =
      e.target.closest('[data-target="#quickshop-modal"].js-modal-close-private') ||
      e.target === modal;
    if (cierra) {
      devolverFormularioQuickshop();
      modal.classList.remove('modal-visible');
      /* LS.fillQuickshop le agrega "modal-open" al <body> para
         bloquear el scroll de fondo mientras el modal esta abierto,
         pero esa clase se quita normalmente con el cierre nativo del
         modal (que aqui no se usa, ver nota mas arriba) -- sin esto
         se quedaba bloqueado el scroll de toda la pagina despues de
         cerrar, y solo se liberaba recargando. */
      document.body.classList.remove('modal-open');
    }
  });
});

/* 21. Corregir el "corrimiento" del carrusel "Explora mas de Ecopipo"
   (estilo Timberland, seccion 31 del CSS) al deslizar en mobile.
   Ese carrusel usa slidesPerView:"auto", con el espaciado entre
   tarjetas puesto por nuestro propio CSS (margin-right: 14px) en vez
   del espaciado nativo de Swiper -- pero Swiper seguia configurado
   con su propio spaceBetween en 36px (el que trae por defecto/por
   panel). Como Swiper mide el ancho real de cada tarjeta (que ya
   incluye esos 14px de margen) y ADEMAS le suma su spaceBetween
   configurado al calcular a donde saltar en cada swipe, terminaba
   sumando el espaciado dos veces (14px reales + 36px de mas), y ese
   sobrante se iba acumulando en cada swipe -- por eso la 2a foto ya
   se veia cortada, la 3a mas, etc. Se pone spaceBetween en 0 (el
   espacio real ya lo da el margin-right del CSS) para que Swiper deje
   de sumarlo por su cuenta. */
document.addEventListener('DOMContentLoaded', () => {
  function corregirEspaciadoCarruselExplora(intentos) {
    const section = document.getElementById('ns-section-featured-categories_1788818704159');
    if (!section) return;

    const viewport = section.querySelector('.js-carousel-slider');
    const sw = viewport && viewport.swiper;

    if (!sw) {
      if (intentos > 0) {
        requestAnimationFrame(() => corregirEspaciadoCarruselExplora(intentos - 1));
      }
      return;
    }

    if (sw.params.spaceBetween !== 0) {
      sw.params.spaceBetween = 0;
      sw.update();
    }
  }

  corregirEspaciadoCarruselExplora(120);
});

/* 22. Imagen propia para el placeholder "sin foto" de producto.
   Cuando un producto no tiene fotos, Tiendanube pone su propio icono
   generico (una camara gris) via un <img> real que apunta a
   .../assets/stores/img/no-photo-*.webp (varios tamaños en el
   srcset) -- es un asset compartido de la plataforma, no un archivo
   propio de la tienda que se pueda reemplazar subiendo uno con el
   mismo nombre. Se detecta por el nombre de archivo en src/srcset (y
   sus variantes data-src/data-srcset, usadas por el lazy-load antes
   de que la imagen entre en pantalla) y se reemplaza por la propia.
   Se usa un MutationObserver (no solo un timeout) porque este
   placeholder puede aparecer despues de la carga inicial: al paginar
   el grid de categoria, al abrir el modal de compra rapida (seccion
   20), etc. */
document.addEventListener('DOMContentLoaded', () => {
  const IMAGEN_SIN_FOTO = 'https://estilos-ecopipo.vercel.app/pipo-sin-foto.webp';

  function esPlaceholderSinFoto(img) {
    return (
      (img.getAttribute('src') || '').includes('no-photo') ||
      (img.getAttribute('srcset') || '').includes('no-photo') ||
      (img.getAttribute('data-src') || '').includes('no-photo') ||
      (img.getAttribute('data-srcset') || '').includes('no-photo')
    );
  }

  function reemplazarEnRaiz(raiz) {
    const imgs = raiz.matches && raiz.matches('img') ? [raiz] : [...raiz.querySelectorAll('img')];
    imgs.forEach((img) => {
      if (!esPlaceholderSinFoto(img)) return;
      img.src = IMAGEN_SIN_FOTO;
      img.removeAttribute('srcset');
      if (img.hasAttribute('data-src')) img.setAttribute('data-src', IMAGEN_SIN_FOTO);
      if (img.hasAttribute('data-srcset')) img.removeAttribute('data-srcset');
    });
  }

  reemplazarEnRaiz(document.body);

  new MutationObserver((mutaciones) => {
    mutaciones.forEach((m) => {
      m.addedNodes.forEach((nodo) => {
        if (nodo.nodeType === 1) reemplazarEnRaiz(nodo);
      });
    });
  }).observe(document.body, { childList: true, subtree: true });
});

/* 23. Corregir jerarquia de encabezados en el PDP: el titulo
   "Descripcion" viene fijo en la plantilla Ipanema como H3
   (".product-description-heading"), saltandose el H2 -- la pagina va
   directo de H1 (nombre del producto) a H3, lo cual esta mal para
   SEO/accesibilidad (los lectores de pantalla y buscadores esperan
   que los niveles bajen de uno en uno, sin saltos).
   No se puede cambiar la etiqueta real de un elemento con CSS (solo
   su apariencia), asi que se reemplaza el nodo por un <h2> real,
   conservando clases/id/contenido para que el estilo no cambie. No se
   toca el contenido de la descripcion en si (el texto enriquecido que
   se escribe en el editor de productos), porque ese es contenido de
   cada producto, no parte fija de la plantilla, y su nivel de
   encabezado varia segun lo que haya escrito quien cargo el
   producto. */
document.addEventListener('DOMContentLoaded', () => {
  const viejo = document.querySelector('.product-description-heading');
  if (!viejo || viejo.tagName === 'H2') return;

  const nuevo = document.createElement('h2');
  for (const attr of viejo.attributes) nuevo.setAttribute(attr.name, attr.value);
  nuevo.innerHTML = viejo.innerHTML;
  viejo.replaceWith(nuevo);
});

/* 24. Barra de compra fija (sticky) en el PDP (ver seccion 39 del
   CSS). Al bajar a leer la descripcion, el boton "Agregar al
   carrito" original queda fuera de vista y se pierde la oportunidad
   de compra -- se muestra una barra fija abajo con nombre, precio y
   un boton propio, solo mientras el boton real este fuera de
   pantalla (se usa IntersectionObserver sobre el boton real en vez de
   un umbral de scroll fijo en px, para que funcione igual sin
   importar cuanto contenido tenga cada producto arriba).
   El boton de la barra NO duplica el formulario de compra (que tendria
   que repetir la logica de variantes, cantidad, validaciones y AJAX
   del tema) -- en vez de eso, simplemente hace click en el boton real
   ".js-addtocart" del formulario original, que sigue oculto detras;
   asi cualquier variante/cantidad que el usuario ya haya elegido se
   respeta tal cual, y el feedback (carrito, mensajes de error si falta
   elegir una variante, etc.) es el mismo que ya trae el tema. */
document.addEventListener('DOMContentLoaded', () => {
  const botonReal = document.querySelector('.js-product-form input.js-addtocart, .js-product-form button.js-addtocart');
  const nombreEl = document.querySelector('h1.js-product-name');
  const precioEl = document.querySelector('.js-product-form .js-price-display, .js-price-display');
  if (!botonReal || !nombreEl || !precioEl) return;

  const barra = document.createElement('div');
  barra.id = 'ecopipo-sticky-comprar';
  barra.innerHTML =
    '<div class="ecopipo-sticky-info">' +
    '<span class="ecopipo-sticky-nombre"></span>' +
    '<span class="ecopipo-sticky-precio"></span>' +
    '</div>' +
    '<button type="button" class="ecopipo-sticky-boton">Agregar al carrito</button>';
  barra.querySelector('.ecopipo-sticky-nombre').textContent = nombreEl.textContent.trim();
  barra.querySelector('.ecopipo-sticky-precio').textContent = precioEl.textContent.trim();
  document.body.appendChild(barra);

  barra.querySelector('.ecopipo-sticky-boton').addEventListener('click', () => botonReal.click());

  new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        barra.classList.toggle('ecopipo-sticky-visible', !entrada.isIntersecting);
      });
    },
    { threshold: 0 }
  ).observe(botonReal);
});

/* 25. Exigir seleccionar variante antes de agregar al carrito (PDP).
   El tema deja preseleccionada por default la primera opcion de cada
   variante (ej. la primera talla) -- si el usuario no se da cuenta y
   compra sin fijarse, puede terminar con la talla/color equivocado.
   Se quita esa preseleccion al cargar la pagina (ver mas abajo) y, si
   el usuario intenta agregar al carrito sin haber elegido, se bloquea
   el envio, se marcan las opciones en rojo, se muestra "Por favor,
   selecciona una opción" y se hace scroll hasta ahi.
   Escopado a ".js-product-form" (el formulario real del PDP) y no a
   toda la pagina: los carruseles de productos del home (ej. "Los mas
   vendidos") tienen sus propias tarjetas con la misma clase de grupo
   de variantes para su propio selector rapido, y no deben verse
   afectadas por esto.
   El click en el boton real se intercepta en fase de captura (no
   escuchando el evento "submit" del formulario): el tema no dispara
   un submit nativo al agregar al carrito, hace su propio manejo por
   AJAX directamente sobre el click del boton, asi que un listener de
   "submit" nunca se ejecutaria. */
document.addEventListener('DOMContentLoaded', () => {
  const formulario = document.querySelector('.js-product-form');
  if (!formulario) return;

  const grupos = [...formulario.querySelectorAll('.js-product-variants-group')].filter((grupo) => {
    const select = grupo.querySelector('select.js-variation-option');
    return select && select.options.length > 1;
  });
  if (!grupos.length) return;

  grupos.forEach((grupo) => {
    const select = grupo.querySelector('select.js-variation-option');
    select.selectedIndex = -1;
    grupo.querySelectorAll('.js-variant-button.selected').forEach((boton) => boton.classList.remove('selected'));
    const etiqueta = grupo.querySelector('.js-insta-variation-label');
    if (etiqueta) etiqueta.textContent = '';
  });

  function grupoSinSeleccion() {
    return grupos.find((grupo) => grupo.querySelector('select.js-variation-option').selectedIndex === -1);
  }

  function mostrarError(grupo) {
    let mensaje = grupo.querySelector('.ecopipo-variante-error');
    if (!mensaje) {
      mensaje = document.createElement('p');
      mensaje.className = 'ecopipo-variante-error';
      mensaje.textContent = 'Por favor, selecciona una opción';
      grupo.appendChild(mensaje);
    }
    grupo.classList.add('ecopipo-variante-invalida');
  }

  function limpiarError(grupo) {
    grupo.classList.remove('ecopipo-variante-invalida');
    const mensaje = grupo.querySelector('.ecopipo-variante-error');
    if (mensaje) mensaje.remove();
  }

  grupos.forEach((grupo) => {
    grupo.querySelectorAll('.js-variant-button').forEach((boton) => {
      boton.addEventListener('click', () => limpiarError(grupo));
    });
  });

  const botonComprar = formulario.querySelector('input.js-addtocart, button.js-addtocart');
  if (!botonComprar) return;

  botonComprar.addEventListener(
    'click',
    (e) => {
      const grupo = grupoSinSeleccion();
      if (!grupo) return;

      e.preventDefault();
      e.stopImmediatePropagation();

      grupos.forEach((g) => {
        if (g !== grupo) limpiarError(g);
      });
      mostrarError(grupo);
      grupo.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
    true
  );
});

/* 26. Separador "Tallas de adulto" / "Tallas de niños" en productos
   para toda la familia (ej. sudaderas), cuyo selector de talla mezcla
   ambos sistemas en una sola lista plana (S, M, L, XL, 2, 4, 6...) sin
   ninguna indicacion de cual es cual. Tiendanube no permite subtitulos
   dentro de un mismo grupo de variantes desde el admin, asi que se
   inserta aqui.
   Regla deliberadamente conservadora: solo distingue tallas letra
   estandar de adulto (XS/S/M/L/XL/XXL/XXXL) de tallas puramente
   numericas -- otros valores personalizados del catalogo (ej.
   "Chico", "Grande", "Bebé", "Adulto", "28 - 32", "6 - 8 años") son
   ambiguos fuera de contexto (su significado real depende de en que
   producto aparecen) y NO se etiquetan automaticamente para no
   arriesgar una etiqueta incorrecta -- revisar esos caso por caso si
   hace falta. */
document.addEventListener('DOMContentLoaded', () => {
  const ADULTO_REGEX = /^(XS|S|M|L|XL|XXL|XXXL|\dXL)$/i;
  const NUMERICO_REGEX = /^\d+$/;

  document.querySelectorAll('.js-product-variants-group').forEach((grupo) => {
    const botones = [...grupo.querySelectorAll('.js-variant-button')];
    if (botones.length < 2) return;

    const tieneAdulto = botones.some((b) => ADULTO_REGEX.test((b.dataset.option || '').trim()));
    const primerNumerico = botones.find((b) => NUMERICO_REGEX.test((b.dataset.option || '').trim()));
    if (!tieneAdulto || !primerNumerico) return;

    const separadorNinos = document.createElement('span');
    separadorNinos.className = 'ecopipo-talla-separador';
    separadorNinos.textContent = 'Tallas de niños';
    primerNumerico.insertAdjacentElement('beforebegin', separadorNinos);

    const primerBoton = botones[0];
    if (ADULTO_REGEX.test((primerBoton.dataset.option || '').trim())) {
      const separadorAdulto = document.createElement('span');
      separadorAdulto.className = 'ecopipo-talla-separador';
      separadorAdulto.textContent = 'Tallas de adulto';
      primerBoton.insertAdjacentElement('beforebegin', separadorAdulto);
    }
  });
});

/* 27. Convertir a H3 real los titulos de los acordeones (details/
   summary) pegados dentro de la descripcion de producto -- por
   ejemplo los pañales de la categoria 40832534 ("¿Cuántos pañales de
   tela necesito para empezar?", etc.), donde el titulo de cada
   pregunta es un <summary> con estilo inline copiado/pegado en el
   editor de cada producto, sin ninguna etiqueta de encabezado real
   (invisible para SEO como titulo de seccion).
   No se puede editar la plantilla para esto porque el HTML vive
   dentro del contenido de cada producto, no en un bloque del tema --
   se envuelve el contenido de cada <summary> en un <h3> por JS al
   cargar la pagina, en vez de pedir editar cada producto uno por uno.
   El <h3> hereda todo el estilo (color, tamaño, negritas) del
   <summary> que lo contiene via "font/color: inherit" y
   "display:inline", asi que no cambia nada visualmente ni el
   comportamiento nativo de abrir/cerrar del <details>. Aplica a
   CUALQUIER producto que use este mismo patron (details/summary
   dentro de ".product-description-content"), no solo a una categoria
   en particular. */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.product-description-content details > summary').forEach((summary) => {
    if (summary.querySelector('h3')) return;

    const titulo = document.createElement('h3');
    titulo.style.cssText = 'display:inline; margin:0; padding:0; font:inherit; font-weight:inherit; color:inherit;';
    while (summary.firstChild) titulo.appendChild(summary.firstChild);
    summary.appendChild(titulo);
  });
});
