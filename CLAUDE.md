# Generación de Carruseles

Espacio de trabajo para producir carruseles y posts estáticos de Instagram,
Facebook y LinkedIn para una o varias marcas. Todo se trabaja desde esta
carpeta; no crear nada suelto fuera de ella.

@.context/flujo.md
@.context/adaptar-referentes.md

## Antes de todo: ¿primera vez en este computador?

Si **no existe `.local/perfil.md`**, hacer la entrevista de arranque de
`.context/arranque.md` antes de cualquier otra tarea: preguntas en rondas
cortas para conocer a la persona y a la marca. Al terminar se crea
`.local/perfil.md` (solo local, no se sube). Si existe, leerlo al empezar:
dice quién es el usuario y cómo prefiere trabajar.

## Primero: ¿para qué marca?

Cada marca vive en `marcas/<marca>/`. **Antes de proponer nada, saber para
qué marca es el carrusel** (si no lo dicen y hay más de una, preguntar) y leer
de esa carpeta:

- `marca.md` — reglas visuales del carrusel, colores, tipografía, **datos que se
  pueden usar**. Obligatorio antes de escribir un guion.
- `marca-base.md`, `tono.md` — base de marca y tono (si existen).
- `linkedin.md` — su línea de LinkedIn, que suele ser otra audiencia y otro
  sistema visual. Obligatorio antes de una pieza para LinkedIn.
- `carruseles-aprobados.md` — los que funcionaron y por qué.
- `calendario.md` — pilares, fechas, festivos.

Marca nueva: copiar `marcas/_plantilla/` a `marcas/<marca>/` y llenarla con el
usuario **antes** del primer carrusel. Nunca usar datos de una marca en otra.

Marcas configuradas: **asignar** (ASIGNAR SAS, servicios temporales, Colombia).

## Conocimiento común a todas las marcas

- `.context/flujo.md` — el flujo completo, de link de referente a PNG final.
- `.context/adaptar-referentes.md` — qué se conserva de un referente y qué se adapta.
- `.context/prompts-imagen.md` — prompts para ChatGPT: inglés, specs técnicos. **Leerlo antes de entregar prompts.**
- `.context/captions.md` — reglas de caption por red (IG/FB y LinkedIn).
- `.context/lecciones.md` — errores técnicos ya resueltos y cómo exportar. **Leerlo antes de exportar.**

## Estructura

```
CLAUDE.md                     este archivo
.context/                     flujo, adaptación, prompts, captions, lecciones (común)
.claude/skills/               skill carrusel-corporativo (carga sola desde aquí)
.claude/settings.json         permisos para node/remotion/ffmpeg
marcas/<marca>/               todo lo propio de una marca
  marca.md linkedin.md …        su contexto
  carruseles/AAAA-MM-DD_tema/   un carrusel por carpeta
    fotos/                        imágenes generadas en ChatGPT (01.png, 02.png…)
    salida/                       PNG finales 1080×1350
  referencia/aprobados/         sus carruseles aprobados
  referentes/                   capturas de referentes externos — SOLO LOCAL, no se suben
  personas.md                   quién pide y aprueba — SOLO LOCAL, no se sube
marcas/_plantilla/            punto de partida para una marca nueva
src/ scripts/ public/         motor Remotion de respaldo (ver MOTOR.md)
```

## Herramientas

- **Claude Design** — carrusel final editable. **Lo lanza el usuario con
  `/design`**; no se puede invocar por cuenta propia.
- **Navegador integrado** — leer referentes de Instagram (sin login).
- **Nunca abrir LinkedIn con la sesión del usuario en su Chrome**: un acceso
  automatizado terminó en cuenta restringida. Para LinkedIn, pedir capturas.
- Node 20+ · ffmpeg · Remotion 4 (instalado con `npm install`).

## Reglas de trabajo

1. **Guion, prompts y captions en el chat**, nunca en archivo.
2. Guion aprobado antes de que se generen imágenes.
3. Máximo 6 láminas, máximo 5 imágenes, siempre 4:5. **Zona segura:** texto y
   elementos clave entre y = 150 y y = 1200, a 60 px de los lados (Facebook
   recorta las miniaturas).
4. Nunca inventar datos: solo los de `marca.md` de la marca o los que el usuario confirme.
5. Exportar siempre los PNG finales a `salida/` y revisar la hoja de contacto antes de avisar.
6. No borrar material sin preguntar.
7. **No proponer memes por iniciativa propia** (el meme generado con IA se descartó).
   Si el usuario trae los memes (imágenes que él consigue), sí: yo armo la
   plantilla y escribo los textos para que calcen con cada meme.

## Motor Remotion (respaldo)

Ver `MOTOR.md`. Sus colores y tipografías están en `src/theme.ts` y hoy
corresponden a ASIGNAR; para otra marca hay que ajustar ese archivo.
