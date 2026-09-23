/**
 * Sistema de diseño del carrusel ASIGNAR — fuente única de verdad.
 *
 * Los colores salen de medir los carruseles ya publicados en @asignar_sas: el
 * azul del acento da #0078FC y las versalitas #001848, que son el #007AFE y el
 * #001934 del brand kit ASIGNAR 2026 corridos por compresión JPEG.
 *
 * La estructura del sistema sale de analizar cómo se comportan los carruseles
 * de @coderhouse por dentro (ver references/estilo.md). Lo importante de ahí:
 * cero cromo, una idea por lámina, y UN MUNDO de fondo continuo que unifica
 * todo el carrusel.
 */

export const color = {
  azul: "#007AFE", // primario oficial — brand kit ASIGNAR 2026
  azulProfundo: "#00337A",
  azulMedio: "#0062CC",
  azulClaro: "#5CB0FF",
  azulNoche: "#021A3D",

  blanco: "#FFFFFF",
  /** Blanco roto de los chips de papel. El blanco puro se ve digital. */
  papel: "#F7F3EA",
  papelSombra: "#DCD3C2",
  crema: "#EFE6D6",

  tinta: "#001934", // navy del logotipo
  tintaSuave: "#4A6488",
} as const;

/**
 * Instagram fija el recorte de todo el carrusel con la PRIMERA lámina, así que
 * el formato se declara una vez para todas.
 *
 * `vertical` (4:5) es el recomendado y el que ya usa la cuenta. `retrato` (3:4)
 * es el formato nuevo de 2026 y es el que usa Coderhouse: ocupa más alto en el
 * feed. Cambiarlo es una palabra en contenido.ts.
 */
export const FORMATOS = {
  vertical: { ancho: 1080, alto: 1350 },
  retrato: { ancho: 1080, alto: 1440 },
  cuadrado: { ancho: 1080, alto: 1080 },
} as const;

export type NombreFormato = keyof typeof FORMATOS;

/**
 * Archivo, no Inter.
 *
 * Inter es la que todo el mundo usa por defecto, y está señalada como uno de
 * los delatores de "esto lo generó una IA". Archivo es una grotesca con más
 * carácter, más cercana a la Helvetica que ya usan los carruseles publicados,
 * y con una negra de verdad para los titulares grandes.
 */
export const fuente = {
  regular: 400,
  medio: 500,
  fuerte: 600,
  negra: 700,
  ultra: 800,
} as const;

/**
 * Escala sobre 1080 de ancho.
 *
 * Los titulares son grandes a propósito: en el feed la lámina compite a tamaño
 * miniatura, y una lámina con texto de cuerpo no se abre. Tres a cinco palabras
 * por línea, dos a cuatro líneas. Nunca un párrafo.
 */
export const escala = {
  ojo: 32, // versalitas de arriba, tracking abierto
  acento: 104, // la serif itálica
  acentoGrande: 132, // cuando la itálica es el titular principal
  remate: 98, // el bold
  remateChico: 78,
  nota: 32, // la línea fina de abajo
  chip: 46,
  dato: 230,
  flecha: 56,
} as const;

export const espacio = {
  margen: 78,
  radio: 8,
} as const;

export const interlineado = {
  titular: 1.04,
  acento: 1.06,
  nota: 1.4,
} as const;

export const tracking = {
  ojo: 4,
  remate: -2,
  acento: -0.5,
} as const;
