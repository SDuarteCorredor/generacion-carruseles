# El estilo, medido

Esto no es una propuesta: es lo que ya está publicado, medido sobre tres
carruseles de `@asignar_sas` y dos completos de `@coderhouse` (ver
`referencia/aprobados/` y los referentes externos, que solo están en local). El motor lo codifica para
que deje de rehacerse a mano.

---

# Parte 1 — Lo que ya hace @asignar_sas

## La firma: el titular en sándwich

Tres registros visuales muy distintos —foto emocional, bodegón sobre crema,
nocturno cinematográfico— y aun así se reconocen como de la misma cuenta. Lo
que los une es la estructura del titular, en los tres sin excepción:

```
LÍNEA EN VERSALITAS          ← ojo, tracking abierto
línea en serif itálica       ← acento: la línea que carga la emoción
LÍNEA EN SANS BOLD           ← remate
```

| Post | Ojo | Acento | Remate |
|---|---|---|---|
| Humanidad | HOY EL MUNDO CELEBRA LA HUMANIDAD | *Colombia* | LA DEMUESTRA CADA DÍA |
| Oficios | ¿QUÉ LLEVA ENCIMA | *cada* | ¿OFICIO? |
| Arácnido | TU SENTIDO ARÁCNIDO | *debería activarse* | CON ESTAS OFERTAS DE TRABAJO |

**Es lo más valioso que tiene la cuenta.** Una lámina sin la itálica se siente
de otra marca — se probó quitándola y la diferencia es inmediata. La itálica va
**en medio**, nunca arriba ni al final: arriba pierde el efecto de revelación,
al final deja la lámina sin cierre.

## Color: ya estaba bien

Muestreado con ffmpeg directamente de los JPG publicados:

| Elemento | Medido | Oficial | Veredicto |
|---|---|---|---|
| Azul del acento | `#0078FC` | `#007AFE` | El mismo; la diferencia es compresión JPEG |
| Versalitas navy | `#001848` | `#001934` | El mismo |
| Fondo crema del bodegón | `#EFE6D6` | — | No estaba documentado |

**La cuenta ya venía usando los colores correctos del brand kit ASIGNAR 2026.**
No había nada que corregir. El único hallazgo nuevo fue el crema del bodegón,
que era una decisión no escrita y funciona muy bien; quedó registrado en
`theme.ts` para que deje de salir un poco distinto cada vez.

## Tipografía

- **Sans**: grotesca neutra tipo Helvetica, no geométrica. El motor usa
  **Archivo**.
- **Serif itálica**: didona de contraste alto con remates de bola. El motor usa
  **Playfair Display Italic**.

> **Por qué Archivo y no Inter.** La primera versión de este motor usaba Inter.
> Inter es la fuente que todo el mundo pone por defecto, y está señalada
> explícitamente como uno de los delatores de "esto lo generó una IA" junto con
> los degradados morado-azul y las tarjetas anidadas. Archivo se parece más a
> lo que la cuenta ya publica y no arrastra ese olor.

Ninguna está confirmada contra un brandbook: son la aproximación más cercana a
lo publicado. Si diseño define otras, se cambian en `theme.ts`.

---

# Parte 2 — Cómo se comportan los carruseles de Coderhouse

Se analizaron dos carruseles completos, lámina por lámina. Esto es lo que hay
que copiar, y es bastante más específico que "se ven modernos".

## 1. Cero cromo

Ni logo, ni @, ni web, ni paginador. Solo una marca de agua casi invisible.
Instagram ya pone el nombre y la foto de perfil encima del post: repetirlo
adentro ocupa espacio y grita "esto es publicidad".

## 2. Una idea por lámina, y una sola frase

Nunca una tarjeta, nunca una lista con viñetas, nunca un párrafo. Tres a cinco
palabras por línea, dos a cuatro líneas, en grande, sobre el fondo. Nada más.

## 3. La anáfora es el motor

Su carrusel de IA repite **"Va a reemplazar ___"** en cuatro láminas seguidas,
cambiando solo el final: *tareas repetitivas · nuestro always-on · las cuentas
para dividir la cena · esas reuniones eternas*. Y la sexta rompe el patrón:
*"Y todo ese TIEMPO vuelve a ser NUESTRO"*.

Deslizar deja de ser leer una lista y pasa a ser completar algo. Es la
diferencia entre un carrusel que se abandona en la lámina 2 y uno que se
termina.

## 4. Un solo mundo de fondo

Su carrusel del cielo son nueve láminas sobre **el mismo cielo**. Algunas
cargadas, otras casi vacías, pero el fondo nunca cambia. Eso es lo que hace que
se lea como una pieza — mucho más que cualquier logo repetido.

En este motor el mundo se dibuja **en código** (`Mundo.tsx`), no con fotos: no
hay que generar ni comprar imágenes para publicar, y sale idéntico en las seis
láminas sin depender de que alguien recorte bien.

## 5. Ritmo: denso, vacío, denso

En cada carrusel hay al menos una lámina casi vacía —una sola frase sobre el
fondo—. Es lo que hace que las cargadas se sientan densas en vez de agotadoras.
Un carrusel donde todas las láminas están llenas cansa en la tercera.

## 6. Los datos van en papelitos, no en tarjetas

Cuando necesitan listar algo (*Escribir. Resumir. Traducir.*) no usan tarjetas:
usan pequeñas etiquetas de papel blanco roto, ligeramente giradas, con sombra
dura. Una palabra por etiqueta. Sin ícono, sin rótulo, sin borde de color.

**Esto es el reemplazo directo de la tarjeta con franja lateral**, que es un
delator clásico de maquetación automática: cajas iguales, ícono en cuadrito,
rótulo en versalitas y texto de relleno.

## 7. La letra chica, abajo y en itálica

La aclaración, el paréntesis y el CTA van pequeños, en itálica, al pie. No
compiten con el titular pero quedan a la vista de quien ya se detuvo.

## 8. La flecha

Una `→` suelta, discreta, en las láminas que quieren empujar a la siguiente.

## Formato

Coderhouse usa **1080×1440 (3:4)**, el formato vertical que Instagram agregó en
2026: ocupa más alto que el 4:5. El motor trae los dos; se cambia con una
palabra en `contenido.ts`. Por defecto va en 4:5, que es el que ya usa la
cuenta y el más compatible.

## Lo que NO se copia

| De Coderhouse | ¿Se adopta? | Por qué |
|---|---|---|
| Collage retro con semitono | Parcial | Se tomó la textura (semitono + grano), no el collage: es un sistema entero y abrirlo fragmenta la identidad |
| Voz de meme | Con criterio | ASIGNAR comunica políticas laborales. El gancho puede ser cercano; el dato, no |
| Nueve láminas | No | Aquí el tope son 6, y el export falla si hay más |

## Dónde entra Figura3D

Los objetos isométricos de `Piezas3D.tsx` son vector puro: nítidos a cualquier
tamaño, con los colores exactos de marca, sin archivos externos. Funcionan como
el elemento gráfico de la lámina cuando no hay foto — que es casi siempre, y a
propósito.

Lo que **no** hay que hacer es meterlos sobre una foto: compiten con ella y las
dos pierden.
