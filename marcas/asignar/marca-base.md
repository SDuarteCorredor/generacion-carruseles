# Marca ASIGNAR — reglas visuales y de movimiento

ASIGNAR SAS: empresa colombiana de servicios temporales (personal para hoteles,
eventos y otros puntos de cliente). Empresa hermana: CONEXIÓN OUTSOURCING SAS,
con brand kit propio. **No mezclar las dos identidades.**

## Color

Un solo archivo manda en cada proyecto: `src/theme.ts`. Nunca dos azules en un video.

| Token | Hex | Uso |
|---|---|---|
| primario | `#007AFE` | acentos, íconos, panel, segunda línea de títulos |
| profundo | `#00337A` | primera línea de títulos, fondos de énfasis |
| medio | `#0062CC` | degradados |
| claro | `#3D9BFF` | acentos sobre claro |
| tinte | `#E4F1FF` | relleno de tarjetas |
| fondo | `#F2F8FF` / `#F4F8FF` | fondo general |
| tinta | `#001934` | texto principal |
| tintaSuave | `#5A7391` | texto secundario |

- `#007AFE` sale del brand kit **"ASIGNAR 2026" en Canva** (id `kAHJBh1L7AQ`).
  Pendiente sin cerrar: el kit *Logotipo V. 052026* trae también `#3D64FF`; falta
  que diseño confirme cuál es el vigente.
- **Nunca muestrear colores de un video o pantallazo**: la compresión los altera
  (un azul muestreado salió `#0150A6`, el oficial era `#007AFE`).

## Prohibido (lo pidió Santiago explícitamente)

- **Fondo oscuro** (navy profundo, casi negro): *"nunca uses fondo oscuro de fondo"*.
  Fondo blanco/casi blanco por defecto; azul de marca sólido o en degradado para énfasis.
- **Amarillo o dorado** en cualquier elemento: *"no me gusta usar el amarillo"*. Sellos y acentos en azul.
- **Emojis como íconos** en piezas: se ven de plantilla escolar. Usar SVG de línea
  (trazo 2u, viewBox 24×24, remates redondeados — estilo `BIBLIOTECA_ICONOS_ASIGNAR.pptx`).
- **Dibujar el logo a mano.** Usar el SVG oficial (`G:\Mi unidad\1_Marketing 2026\Logotipo V. 052026\SVG`,
  ya vectorizado en `video_contratacion/src/Logo.tsx` y `video_tv/src/Logo.tsx`, con `currentColor`).

## Composición

- Títulos en dos tonos, MAYÚSCULA y negrita: línea 1 en `#00337A`, línea 2 en `#007AFE`.
- Tipografía: Montserrat (títulos) + Inter (cuerpo). Aproximación, **no confirmada contra el brandbook** — decirlo al entregar.
- Personas recortadas sobre formas orgánicas azules, a la derecha del cuadro.
- Tarjetas blancas con borde suave; íconos de línea en círculos azul claro.
- Blobs/formas de fondo confinados al **tercio exterior**: detrás del texto le bajan el contraste.
- **Palabras huérfanas**: ninguna línea con una sola palabra. Títulos: líneas definidas a mano.
  Párrafos: `text-wrap: pretty` (o `balance` si va centrado).
- Mascota **DOCA**: personaje 3D masculino, camisa blanca con logo azul. Si narra, voz masculina.

## Sistema de movimiento (aprobado — "Perfecto, quedó genial")

Base de todos los videos desde el de televisores 2026. Referencia que le gusta a
Santiago: videos de producto de **Google Workspace / Gemini**.

- **Nada de transiciones de plantilla** (slide, wipe, fade plano): se leen como pasar
  diapositivas. Usar la transición de profundidad `compartido/remotion/transicion.tsx`
  (`profundidad({ intensidad })`): la lámina que sale se aleja y desenfoca, la que entra llega de cerca.
- **Una sola curva de easing** en todo el montaje: `cubic-bezier(0.22, 1, 0.36, 1)`. Nada lineal.
- **Entradas desde un desenfoque corto**, no solo opacidad.
- Escalonar entradas con offsets de 3–6 frames.
- Nunca pantalla quieta mucho tiempo: repartir entradas a lo largo de la narración.
- Tomas reales: estabilizar y luego devolverles un zoom lento (Ken Burns) — quietas se ven "básicas".

## Formatos y zonas seguras

- 16:9 (1920×1080) para institucionales/TV/onboarding; 9:16 (1080×1920) para Reels/estados.
- Reels: subtítulos apoyados a ~430 px del borde inferior (Instagram tapa ~380 px).
- Reels: nada legible en los primeros **300 px** de arriba (el encabezado del perfil lo tapa en el feed).
- Márgenes laterales generosos (≥64 px en vertical). Santiago siempre revisa márgenes.

## Recursos

- `G:\Mi unidad\1_Marketing 2026` — logotipo oficial y material de marca.
- Canva — brand kit "ASIGNAR 2026", brandbook, Guía del Trabajador Misional, plantillas.
- `BIBLIOTECA_ICONOS_ASIGNAR.pptx` (Descargas) — 24 íconos oficiales.
