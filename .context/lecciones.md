# Lecciones técnicas del carrusel (errores reales ya resueltos)

## Entorno

- La carpeta está en el Escritorio **sincronizado con Google Drive**. No borrar
  material sin preguntar; lo que sale del flujo va a `_archivo/`.
- Remotion de este proyecto tiene `node_modules` propio (4.0.x). La primera vez
  que se renderiza descarga Chrome Headless (~113 MB).
- ffmpeg funcionó desde Bash en esta carpeta; si falla, usar PowerShell (ver
  las lecciones del proyecto de video, si existe en ese equipo).

## Motor Remotion (respaldo)

- **Todo estático**: nada en `Lamina.tsx` usa `useCurrentFrame()`. Los
  componentes del video animan con spring y en el frame 0 salen en blanco.
- `scripts/exportar.mjs` empaqueta **una vez** y renderiza todas las láminas;
  `npx remotion still` en bucle re-empaqueta cada vez y tarda minutos.
- El export **falla** si hay más de 6 láminas o si falta una foto — a propósito:
  una advertencia se ignora. La comprobación de fotos va **antes** de empaquetar;
  si no, la foto faltante aparece como un 404 que reintenta dentro del navegador.
- El export **borra `salida/`** antes de renderizar para que no quede un PNG
  viejo de una lámina que ya se quitó.
- `--solo N` renderiza una lámina en segundos, para iterar.

## Imágenes

- **ChatGPT entrega PNG aunque se pida JPG.** Copiar el archivo con otra
  extensión rompe ffmpeg/ffprobe (decoder mjpeg). `scripts/fotos.mjs --importar`
  reconvierte siempre con ffmpeg.
- La importación desde Descargas mapea por **orden de creación** (la más vieja
  = lámina 1) e imprime el mapeo antes de copiar.
- Velo sobre la foto en `mundo: "foto"`: 0.45 por defecto (el prompt ya pide
  subexposición). Se ajusta por lámina con `oscurecer`.

## Diseño

- Nubes con degradado radial se ven como manchas: la versión aprobada usa
  círculos sólidos con base plana, **solo en los bordes**, centro limpio.
- Letra chica blanca sobre nube blanca desaparece: la nota va anclada al pie,
  fuera del grupo centrado.
- Mirar la **hoja de contacto** antes de entregar: ahí saltan texto sobre zonas
  claras, huérfanas y láminas que se parecen demasiado.
- Leer referentes con los PNG originales cuando existan: los JPG de Instagram
  están comprimidos y engañan en tipografía y color.

## Claude Design

- **Lo invoca Santiago con `/design`**; yo no puedo lanzarlo. Dentro de esa
  invocación armo el canvas con las fotos de `marcas/<marca>/carruseles/<carpeta>/fotos/`.
- **Funcionó en el primer carrusel ("Estoy a esto", 23-sep-2026).** Así:
  1. Pasar las fotos a JPG (`ffmpeg -q:v 2`, ~150–230 KB cada una) en
     `marcas/<marca>/carruseles/<carpeta>/fotos/`.
  2. Subir cada una como asset del canvas (`publish` con `asset: true`) y usar
     el `/_blob/<id>` que devuelve en el `<img src>`. Nada de data URIs.
  3. Una lámina = un `.dc.html` de 1080×1350; `canvas.json` en fila, 80 px entre láminas.
  4. Publicar con la ruta LARGA del scratchpad (`C:/Users/PC 15/...`); la
     corta (`PC15~1`) la bloquea una regla de permisos. `files` como lista de
     rutas relativas a `root`.
- Texto sobre fondo de foto variable (mantel blanco, camisa blanca): ir en
  **chip**, no en blanco suelto. **Santiago lo prefiere navy #001934 con texto
  blanco** (lo ajustó él mismo en "Estoy a esto", 23-sep-2026), no crema.
  Mismo chip navy también sobre el azul de marca.
- **Siluetas de personas: nunca dibujadas a mano en SVG.** "Parecen muñecos
  cortados" (24-sep-2026). Van de una persona real: ChatGPT la genera en negro
  plano sobre blanco, yo la convierto en máscara con ffmpeg y la relleno.
  El prompt que sirve pide una **foto a contraluz** (backdrop blanco quemado),
  no "silhouette": esa palabra le da ilustración con líneas blancas. Conversión:
  `node scripts/siluetas.mjs <foto> <salida.png> <color>`. Banco en
  `marcas/asignar/recursos/siluetas/` (s1–s5). Santiago la quiere **como sale
  en la foto, solo sin fondo** (`original 0` → `sN_foto.png`), no rellena de un
  color; texto blanco con acentos azules (chips azules, no navy).
- **Azul como acento estratégico** en palabras clave (la itálica) o en botones,
  no como adorno (se quitó el trazo azul bajo el texto, 24-sep-2026).
- Si Santiago pega las imágenes en el chat en vez de subirlas, quedan en la
  carpeta `images/` de la sesión como `.webp`: convertirlas y guardarlas en
  `fotos/` igual.

## Exportar el canvas a PNG

1. `read` cada `project/*.dc.html` del canvas (versión actual, con los ajustes de Santiago).
2. Convertir a HTML plano: el contenido de `<x-dc>`, el `<helmet>` en el `<head>`,
   y cada `/_blob/<id>` reemplazado por la foto local `file:///…/fotos/0N.jpg`.
3. Capturar con el Chrome que ya trae Remotion:
   `node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe`
   con `--headless --hide-scrollbars --allow-file-access-from-files
   --force-device-scale-factor=1 --window-size=1080,1350
   --virtual-time-budget=10000 --screenshot=<salida>/0N.png <archivo.html>`.
   El `virtual-time-budget` da tiempo a que carguen las fuentes de Google.
4. Verificar tamaño con ffprobe y mirar la hoja de contacto antes de avisar.
5. Santiago también las pide **en 2x** (2160×2700): misma captura con
   `--force-device-scale-factor=2` (la ventana sigue en 1080,1350), guardadas en
   `salida/2x/`. El texto sale más nítido; las fotos, a su resolución original.
