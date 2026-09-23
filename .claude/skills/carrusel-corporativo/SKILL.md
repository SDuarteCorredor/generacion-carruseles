---
name: carrusel-corporativo
description: Crea carruseles y posts estáticos para Instagram, Facebook y LinkedIn — láminas en PNG a 1080×1350 listas para publicar o para llevar a Canva, con tipografía, color y ritmo de la marca. Úsala siempre que alguien pida un carrusel, un post, una pieza para redes, "las láminas" de una campaña, adaptar un contenido a Instagram, o rehacer una pieza que quedó mal armada. También cuando pidan analizar los carruseles de una cuenta —propia o de la competencia— para extraer su estilo, o decidir qué publicar y cuándo. Sirve para cualquier marca; trae la configuración de ASIGNAR lista y verificada contra lo ya publicado.
---

# Carruseles corporativos

Esta skill construye carruseles donde **el contenido vive separado del diseño**.
Cambiar una palabra es editar una línea y volver a exportar, no rehacer el arte.

Es la hermana de `video-corporativo`: mismo principio, mismos objetos 3D, misma
marca. Un video y un carrusel de la misma campaña se ven de la misma pieza.

## Si estás en `Generacion_Carruseles`

Esa carpeta tiene su propio `CLAUDE.md` y `.context/` con el flujo acordado con
Santiago (link de referente → guion y prompts en el chat → él sube las fotos a
`marcas/<marca>/carruseles/<carpeta>/fotos/` → carrusel final en Claude Design, que lanza él
con `/design`). **Lo de `.context/` manda sobre esta skill** cuando difieran.
Ver también `references/adaptar-referentes.md` y `references/prompts-imagen.md`.

**No proponer memes**: se probaron y se descartaron.

---

## Con quién estás hablando

Casi siempre es alguien de marketing o comunicaciones, **sin perfil técnico**.
Encárgate tú de lo técnico y háblale de lo que sí le importa: el gancho, la
marca, cuántas láminas, cómo se ve. Nunca le pidas que edite código: pídele el
texto y tú lo pones donde va.

---

## Las tres reglas que no se negocian

Salen de analizar carruseles reales que funcionan, no de preferencia estética.

### 1. Máximo 6 láminas

El export **falla** si hay más. Que falle en vez de advertir es deliberado: una
advertencia en consola se ignora, un error obliga a decidir qué sobra.

### 2. Una idea por lámina, y una sola frase

Tres a cinco palabras por línea, dos a cuatro líneas, en grande. **Nunca una
tarjeta, nunca una lista con viñetas, nunca un párrafo.** Si una lámina
necesita explicar dos cosas, son dos láminas — o sobra una.

### 3. Cero cromo

Ni logo, ni @, ni página web, ni paginador. Instagram ya pone el nombre y la
foto de perfil encima del post; repetirlo adentro ocupa espacio y grita "esto
es publicidad".

---

## El flujo

### 1. Decide el tema antes que el diseño

**No siempre el mismo tema.** Una cuenta que solo explica su producto se vuelve
un manual, y nadie sigue un manual. `references/calendario.md` trae seis
pilares que rotan y el calendario de momentos —festivos, primas, temporada
alta— en los que la gente ya está pensando en el tema.

Tres preguntas, en orden:

1. ¿Hay un momento esta semana? Si lo hay, gana.
2. ¿Cuál fue el pilar del post anterior? Cualquiera menos ese.
3. ¿Esto le sirve a alguien, o solo nos sirve a nosotros? Si es lo segundo, no
   se publica. Eso es exactamente "subir por subir".

### 2. Analiza lo que la cuenta ya publica

Casi siempre existe un estilo de casa que nadie escribió, y proponer otro es
tirarlo a la basura sin darse cuenta. Cómo hacerlo está más abajo.

### 3. Crea el proyecto

```bash
python scripts/nuevo_carrusel.py "carrusel-primas" --marca asignar
```

### 4. Escribe el contenido — y hazlo aprobar antes de maquetar

Un solo archivo: **`src/contenido.ts`**.

**El motor de un carrusel es la ANÁFORA**: una construcción que se repite con
el final cambiado, y una lámina final que rompe el patrón.

```
Va a reemplazar tareas repetitivas
Va a reemplazar nuestro always-on
Va a reemplazar esas reuniones eternas
Y todo ese TIEMPO vuelve a ser NUESTRO   ← rompe
```

Deslizar deja de ser leer una lista y pasa a ser completar algo. Es la
diferencia entre un carrusel que se abandona en la lámina 2 y uno que se
termina.

**Nunca inventes datos.** Estos carruseles comunican políticas de la empresa:
porcentajes, plazos, montos, requisitos. Un dato puesto para rellenar una
lámina se convierte en un compromiso que la empresa no hizo. Si el encargo no
lo trae: pregunta, o déjalo en el nivel de generalidad que sí te dieron — y
dilo al entregar, no lo entierres en un comentario del código.

Marca las correcciones de terceros con quién las pidió:

```ts
// [CONTROL INTERNO] se elimina "abierto": no pueden existir contratos abiertos
nota: "Vigencia máxima de un año.",
```

En seis meses alguien va a querer "mejorar" esa frase sin saber que fue una
corrección negociada. El comentario lo frena.

### 5. Exporta y revisa

```bash
npm run exportar
```

Verifica el tamaño de cada PNG y arma una hoja de contacto en
`referencia/hoja_salida.png`. **Mírala antes de entregar**: un PNG suelto no
muestra si el carrusel se lee como una pieza. Busca texto sobre una nube, letra
chica ilegible, láminas que se parecen demasiado.

### 6. Escribe el caption

Se entrega junto con los PNG, no por separado. Cuatro reglas fijas:

- **Sin hashtags.**
- **Corto** — unas pocas líneas, nunca un párrafo.
- **Arranca con el CTA** (compartir, comentar, etiquetar, referir), no lo dejes
  para el final. Es lo primero que se lee antes del "ver más".
- **Emojis discretos** — dos o tres en todo el caption, nunca uno por línea.

Cuando el encargo llegó como "aquí tienes un referente" (un link, no un guion),
el texto de las láminas y del caption es redacción propia: **decirlo al
entregar**, salvo que reuse contenido ya aprobado (como el bloque de Control
Interno del video de contratación).

---

## Anatomía de una lámina

```ts
{
  titular: {
    ojo:    "LO FIRMASTE EN DOS MINUTOS",   // versalitas
    acento: "¿y sabes qué firmaste?",       // serif itálica — LA FIRMA
    remate: "TU CONTRATO",                  // sans bold
    nota:   "Vigencia máxima de un año.",   // letra chica al pie
    flecha: true,                           // → que empuja a deslizar
  },
  bloque: { tipo: "figura", nombre: "contrato" },
}
```

**El `acento` en serif itálica es lo que hace que la lámina se vea de la marca
y no de cualquiera.** Va en medio, nunca arriba ni al final. Quitarlo "porque
es un carrusel informativo" es el error más común.

`bloque` es el elemento gráfico, opcional:

| Tipo | Qué es |
|---|---|
| `chips` | Etiquetas de papel, una palabra cada una |
| `figura` | Objeto isométrico de `Piezas3D.tsx` |
| `circulo` | Círculo de acento con una frase corta |
| `dato` | Una cifra grande |

**Una lámina sin bloque es la que respira**, y conviene tener al menos una: es
lo que hace que las cargadas se sientan densas en vez de agotadoras.

## El mundo de fondo

`CARRUSEL.mundo` define el fondo de **todas** las láminas: `cielo`, `noche`,
`papel` o `estudio`. Que sea uno solo para todo el carrusel es lo que hace que
se lea como una pieza — mucho más que cualquier logo repetido.

Se dibuja en código (nubes, semitono, grano), así que **no hace falta generar
ni comprar imágenes para publicar**. Si hay foto de apoyo, entra con duotono y
el mismo semitono, de modo que cualquier imagen sale con el tratamiento de la
casa.

Las nubes viven en los bordes y el centro queda limpio. No es estética: es la
única forma de que un fondo con figuras no se coma el texto.

---

## Los prompts de imagen

Cuando el mundo es `foto`, cada lámina declara su `prompt` en `contenido.ts` y
`scripts/fotos.mjs` los imprime listos para pegar.

**Los prompts van SIEMPRE en inglés y con especificaciones técnicas de
fotografía.** No es preferencia: los generadores de imagen están entrenados
sobre pies de foto y metadatos EXIF en inglés. "Luz tenue de interior" es una
intención y devuelve una imagen genérica; `single dominant source, no fill,
f/2.0, ISO 2000, 2800K tungsten` es una instrucción y devuelve algo que parece
fotografía.

Un prompt completo lleva, en este orden:

1. **Sujeto y acción** — qué pasa en la imagen
2. **Encuadre y ángulo** — *one-point perspective, camera at chest height*;
   *high three-quarter angle looking down*; *wide shot, camera low near the floor*
3. **Óptica** — *24mm / 35mm / 50mm / 85mm lens*, y dónde está el foco
4. **Luz** — fuente, dirección, temperatura en kelvin, calidad:
   *hard raking window light from frame left*, *heat lamps overhead at 2400K*
5. **Exposición** — *f/2.0, 1/125s, ISO 2000*
6. **Grade de color** — *split tone, amber highlights, cool blue-green shadows,
   desaturated to 45%, clipped shadows*
7. **Grano y textura** — *fine natural film grain, slight halation*
8. **Formato y espacio negativo** — *vertical 4:5, 1080x1350; empty dark
   negative space across the upper and lower thirds*
9. **Exclusiones** — *no text, no signage, no logos, no watermarks, no
   recognisable faces, no people looking at camera*

Los puntos 5 a 9 **no se repiten por lámina**: viven en `CARRUSEL.estiloFoto`,
que el script anexa a todos. Ahí está la unidad del carrusel — seis imágenes
generadas por separado con el mismo grade y la misma exposición pegan entre sí;
sin ese bloque salen seis imágenes bonitas que no son un carrusel.

Cada lámina decide solo del 1 al 4: sujeto, encuadre, óptica y dirección de luz.

**Sin caras reconocibles.** Dos razones: una cara mirando a cámara se lleva
toda la atención y compite con el titular, y las caras generadas son lo primero
que delata que la imagen es sintética. De espaldas, manos, siluetas o encuadre
parcial.

**Pide espacio negativo explícitamente.** El titular va encima. Si el generador
llena el encuadre, no hay dónde poner texto y la lámina se pierde.

---


## Analizar los carruseles de una cuenta

1. Abre la publicación en el navegador y recorre el carrusel recogiendo los
   `src` de las imágenes de 1080 o más. Instagram carga las láminas a medida
   que se avanza, así que hay que hacer clic en "Siguiente" entre capturas.
2. Descarga los JPG y arma una hoja de contacto:
   ```bash
   ffmpeg -i post/%02d.jpg -vf "scale=470:-1,tile=3x2:margin=8:padding=8" -frames:v 1 hoja.png
   ```
3. **Recorre el carrusel completo, no solo la portada.** Lo que hay que sacar
   es el comportamiento: cuántas láminas, si hay anáfora, si el fondo es
   continuo, dónde va la letra chica, cómo cierran.
4. **Muestrea los colores del JPG, no los estimes.** Un crop de un trazo
   grueso, contando píxeles por saturación, da el hex real. En ASIGNAR ese
   ejercicio demostró que la cuenta ya usaba el azul correcto del brand kit —
   lo que evitó "corregir" algo que estaba bien.

---

## Errores que cuestan caro

**Maquetar antes de aprobar el texto.** El más caro de todos.

**Tarjetas con franja de color al costado.** Cajas iguales, ícono en cuadrito,
rótulo en versalitas y texto de relleno: es el delator número uno de
maquetación automática. Los datos van en chips de papel, una palabra cada uno.

**Usar Inter.** Es la fuente que todo el mundo pone por defecto y está
señalada como delator de diseño generado. Este motor usa Archivo.

**Meter el logo "para que se sepa de quién es".** Instagram ya lo dice arriba.

**Generar la lámina con un modelo de imagen.** Un carrusel es 90% tipografía y
los modelos deforman el texto, no aciertan un hex de marca y no respetan un
lienzo exacto. La imagen generada sirve como **fondo**, debajo del texto.

**Todas las láminas llenas.** Cansa en la tercera.

**Foto y figura 3D en la misma lámina.** Compiten y las dos pierden.

**Dejar PNG viejos en `salida/`.** El export limpia la carpeta por eso.

## Recursos

- `references/estilo.md` — el estilo de @asignar_sas y el comportamiento de los
  carruseles de Coderhouse, medidos. **Léelo antes de proponer una línea gráfica.**
- `references/calendario.md` — qué publicar y cuándo: pilares, festivos, tendencias
- `references/marcas.md` — preset de ASIGNAR y cómo configurar una marca nueva
- `assets/plantilla/` — proyecto base que copia `nuevo_carrusel.py`
- `scripts/nuevo_carrusel.py` · `scripts/exportar.mjs` — ambos aceptan `--help`
