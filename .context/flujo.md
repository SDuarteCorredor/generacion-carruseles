# El flujo de un carrusel (acordado con Santiago, 23-sep-2026)

## Paso a paso

1. **Santiago pasa el link de un referente** (Instagram, casi siempre).
2. **Lo analizo por dentro, sin mostrarle el análisis.** Descargo las láminas
   (ver "Cómo leer un referente" abajo), armo hoja de contacto y saco: el
   gancho, la estructura, cuántas láminas, dónde rompe el patrón, cómo cierra.
3. **Le entrego en el chat, en este orden:**
   - **Guion básico** en texto: lámina por lámina, con los hooks y textos ya
     adaptados a la marca. Nada de explicación del análisis salvo una línea de
     "qué tomé del referente".
   - **Un bloque de texto con los prompts** para ChatGPT, uno por lámina que
     lleve foto, **en inglés y con specs técnicos** (ver `prompts-imagen.md`).
     **Máximo 5 imágenes por carrusel.**
4. **Él genera las imágenes y las sube a** `marcas/<marca>/carruseles/AAAA-MM-DD_tema/fotos/`
   con nombre `01.png`, `02.png`… en el orden de las láminas. Yo creo esa
   carpeta al entregar el guion y le digo la ruta exacta.
   (Alternativa que ya funciona: dejarlas en Descargas y yo las traigo.)
5. **Carrusel final:**
   - **Claude Design** — el camino que Santiago quiere. **Lo lanza él con
     `/design`**: yo no puedo invocarlo por mi cuenta. Dentro de esa
     invocación armo las láminas con sus fotos y él puede retocar a mano y
     exportar PNG.
   - **Motor Remotion** (`src/` + `scripts/`) — respaldo probado: es con el
     que salió "nadie aplaude". Úsalo si Claude Design no da el resultado o
     si hay que reproducir un carrusel exacto.
6. **Siempre exportar los PNG finales a `marcas/<marca>/carruseles/<carpeta>/salida/`**
   (01.png … 06.png, 1080×1350) apenas Santiago apruebe o ajuste el canvas —
   desde la versión ACTUAL del canvas (releer los `.dc.html`), no desde lo que
   yo publiqué. Se me pasó en el primero; es parte de cerrar el carrusel, no
   un extra. Cómo: `.context/lecciones.md` → "Exportar el canvas a PNG".
   Luego el **caption en el chat** (ver `captions.md`).

## Reglas del flujo

- **Todo texto para Santiago va en el chat**, nunca en `.md` ni `.txt`: guion,
  prompts, captions. Los archivos son solo para entregables (PNG).
- El guion se aprueba **antes** de que él genere imágenes. Si cambia el texto
  después, puede cambiar lo que tiene que mostrar la foto.
- Máximo **6 láminas** y **5 imágenes**. Si el carrusel tiene 6 láminas, una va
  sin foto (la que respira, sobre color plano) o repite imagen.
- **Formato siempre 4:5** (1080×1350).

## Cómo leer un referente de Instagram

Instagram carga las láminas a medida que se avanza. Con el navegador:
abrir el post, cerrar el modal de login, y recorrer con el botón "Siguiente"
recogiendo `currentSrc` de las `img` de 1000 px o más. Descargar con `curl` a
`marcas/<marca>/referentes/<nombre>/` (solo local, no se sube), y armar la hoja de contacto con ffmpeg.

Si las láminas vienen en tamaños distintos, normalizar cada una **antes** de
armar la grilla (el `tile` de ffmpeg se corta en la primera que cambia de
tamaño y deja una hoja con una sola imagen).
