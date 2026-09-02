# Bitácora del proyecto — estilos-ecopipo

Notas técnicas acumuladas trabajando el CSS personalizado de la tienda Ecopipo (Tiendanube, tema "ipanema"). Sirve como referencia rápida antes de tocar de nuevo los botones de compra o el grid de productos.

## Cómo está montado el proyecto

- Un solo archivo, [custom-styles.css](custom-styles.css), servido por Vercel en `https://estilos-ecopipo.vercel.app/custom-styles.css`.
- Tiendanube lo carga vía `<link>` en el `<head>` de cada página, inyectado **dinámicamente por script** — por eso siempre termina siendo el **último** `<link>` del documento, después incluso de estilos que uno inyecte manualmente más tarde en la misma carga. Al probar overrides con un `<style>` temporáneo hay que insertarlo explícitamente *después* de ese `<link>` (`id="ecopipo-custom-styles"`), si no, parece que "no aplica" cuando en realidad solo pierde el cascade.
- `cache-control: public, max-age=0, must-revalidate` — no hay problema de caché de navegador; cada carga revalida contra el ETag. Confirmar viendo `content-length` contra el tamaño local del archivo si algo parece no reflejar el último deploy.
- Flujo de publicación: commit → push a `main` → Vercel despliega solo (sin intervención manual) en un par de segundos.

## El bug que se repitió tres veces: `width` sin `min-width`/`max-width`

El tema trae reglas viejas (Sección 11, pensadas para una plantilla anterior) que fijan botones dentro de `.swiper-slide` a un ancho **fijo de 160px** vía `min-width` y `max-width`, no solo `width`. Cada vez que reestilicé un botón para que ocupara el 100% de su tarjeta, se me olvidó neutralizar esas dos propiedades además de `width` — y como son propiedades independientes en la cascada, `width:100% !important` gana pero el box sigue clavado en 160px por el `max-width`.

**Lección:** cuando se sobreescribe `width`, comprobar siempre si el elemento (o algún hijo con clase `.btn`) hereda `min-width`/`max-width` de otra regla, y neutralizar los tres a la vez.

## El overlay de feedback ("Agregando..." / "¡Listo!") es frágil

Estructura real (grid, carrusel de "Productos similares" y PDP comparten el mismo patrón):

```
form.js-product-form
 ├─ input (variante oculta)
 ├─ div.item-submit-container   ← contiene el <input type="submit"> real
 └─ div.js-addtocart-placeholder ← overlay de feedback
      └─ div.d-inline-block
           ├─ span.js-addtocart-text     (contiene un mini-botón propio del tema)
           ├─ span.js-addtocart-success  ("¡Listo!")
           └─ div.js-addtocart-adding    ("Agregando...")
```

Problemas encontrados y su causa exacta:

1. **Overlay siempre visible ("botón fantasma").** El tema oculta el placeholder con `style="display:none"` inline (sin `!important`). Cualquier regla nuestra con `display:flex !important` lo gana y lo deja visible todo el tiempo. Arreglo: agregar una regla hermana `[style*="display: none"] { display:none !important }` — como tiene más especificidad (atributo + clases) que la regla base, respeta el toggle real del tema.
2. **El overlay se ancla al ancestro posicionado equivocado.** `position:absolute; top:X; right:0` necesita que el contenedor correcto tenga `position:relative`. Si el `<form>` es `position:static` (como venía por defecto), el navegador sube por el árbol hasta encontrar *cualquier* ancestro posicionado — que varía página a página — y el overlay aparece flotando en un punto impredecible. En PDP además el `<form>` incluye el selector de cantidad (más ancho que el botón), así que anclar a él tampoco basta: hay que anclar a `.buy-button-container`, que envuelve *solo* el botón.
3. **Botón anidado dentro del pill.** El `span.js-addtocart-text` envuelve un mini-`div` con clases propias del tema (`btn btn-primary btn-small`) sin reestilizar — al forzar la visibilidad del overlay (punto 1) ese mini-botón se ve como "botón dentro de botón". Se limpia con un reset universal (`* { background:transparent; border:none; ... }`) sobre los hijos del placeholder.
4. **"Agregando..." y "¡Listo!" se muestran a la vez.** Confirmado deshabilitando por completo nuestro CSS: es comportamiento nativo del tema — ambos arrancan en `opacity:1` y solo una clase `.active` (agregada por el JS del tema) indica cuál corresponde mostrar. Arreglo: forzar `opacity:0` al que *no* tenga `.active`.
5. **El texto del mensaje "flota" fuera del pill.** El tema anima estos mismos elementos con `transform: translateY(-19px)` como parte de un truco de aparición que no siempre alcanza a resetearse antes de que se marque `.active`. Como igual los posicionamos con `position:absolute` cubriendo el 100% del pill, ese transform heredado sobra: hay que anularlo con `transform:none !important`.
6. **Espacio en blanco al agregar (grid/carrusel).** El tema oculta el botón real con `display:none` durante "Agregando...". Sin una altura fija en el `<form>` y su contenedor, ambos colapsan a 0px, y como el overlay se posiciona respecto a ellos, se desplaza dejando un hueco. Arreglo: fijar `height`/`min-height` explícitos en `.product-item-quick-shop-container` y en el `form` (no solo en el botón).

**Patrón general:** cada vez que se toca este overlay, verificar en vivo con `getBoundingClientRect()` del botón real vs. del placeholder durante el ciclo completo (click → "Agregando" → "Listo" → reset), no solo mirar capturas de pantalla — los estados intermedios duran ~1-2s y son fáciles de no notar a simple vista pero muy fáciles de medir en píxeles.

## Selectores muertos en el CSS heredado

Antes de esta serie de fixes, buena parte de las Secciones 11 y 12 apuntaba a clases que **no existen** en el DOM actual del tema ipanema (`.item-actions`, `.section-products-related`, `.grid-item`). Quedaron como código muerto (no rompen nada, pero tampoco hacen nada). Antes de asumir que una regla existente "ya cubre" un caso, confirmar con `elemento.matches(selector)` en la consola en vez de solo leer el CSS.

## La cuadrícula del grid necesita que la tarjeta completa sea flex

El grid (CSS Grid) estira cada `.product-item` a la altura de la fila más alta correctamente, pero si el contenido interno (imagen + bloque de info) no es también un `flex-column` que ocupe el 100% de esa altura estirada, el espacio extra queda "muerto" al fondo de la tarjeta en vez de empujar el botón — visible sobre todo cuando un producto tiene una línea extra (aviso de stock) y sus vecinos no. Arreglo: `.product-item { display:flex; flex-direction:column }`, imagen con `flex:0 0 auto`, bloque de info con `flex:1 1 auto`, y `margin-top:auto` en el contenedor del botón dentro de ese bloque.

## Precauciones al probar en el sitio en vivo

- No hay entorno de staging: las pruebas de "agregar al carrito" ocurren sobre el carrito **real** de la tienda protegida por contraseña. Repetir clicks de prueba muchas veces sobre el mismo producto reduce el "disponible" real y puede hacer que un producto desaparezca del carrusel de recomendados (el tema oculta lo que ya está en el carrito) — eso puede confundirse con un bug de CSS. Si algo "se queda pegado" de forma rara, primero descartar que sea por inventario agotado de tanto probar.
- Al grabar/analizar un video de bug reportado por el usuario, extraer frames con `ffmpeg -vf fps=N` (instalar con `brew install ffmpeg` si falta) es mucho más confiable que confiar en una sola captura — el frame exacto del glitch suele estar a mitad de una transición de ~1-2s.
- Los archivos de video de macOS con nombre "Grabación de pantalla..." a veces incluyen un espacio Unicode angosto (`U+202F`) entre la hora y "p.m." que rompe el quoting normal de shell; resolverlo con `glob.glob()` en Python en vez de pasar la ruta a mano.

## Referencia rápida de selectores reales (tema ipanema)

| Contexto | Contenedor de tarjeta | Botón real | Overlay de feedback |
|---|---|---|---|
| Grid `/productos/` | `.product-item` | `.item-submit-container input.js-addtocart` | `.product-item-quick-shop-container .js-addtocart-placeholder` |
| Carrusel "Productos similares" | `.product-item.swiper-slide` (misma estructura que el grid) | igual que grid | igual que grid |
| PDP | `#product_form` / `#product-form` | `input[type="submit"]` dentro de `.buy-button-container` | `.js-addtocart-placeholder` (anclar a `.buy-button-container`, no al `form`) |
