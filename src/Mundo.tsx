/**
 * El mundo de fondo del carrusel.
 *
 * El hallazgo más importante de analizar a Coderhouse: **todas las láminas de
 * un carrusel comparten el mismo fondo continuo**. Su carrusel del cielo son
 * nueve láminas sobre el mismo cielo de nubes en semitono; algunas cargadas de
 * texto y otras casi vacías. Eso es lo que hace que se lea como una sola pieza
 * y no como nueve imágenes sueltas — mucho más que cualquier logo repetido.
 *
 * Aquí el mundo se dibuja **en código**, no con fotos. Es deliberado: significa
 * que no hay que generar ni comprar imágenes para publicar, y que el fondo sale
 * idéntico en todas las láminas sin depender de que alguien recorte bien.
 *
 * Lo que evita que se vea plano y "hecho por IA" son tres capas que ninguna
 * plantilla trae: semitono real (patrón de puntos, no un degradado), grano de
 * papel (turbulencia), y una viñeta suave. Sin ellas queda un vector limpio, y
 * un vector limpio es exactamente lo que delata.
 */
import React from "react";
import { AbsoluteFill, Img, staticFile, useVideoConfig } from "remotion";
import { color } from "./theme";

export type NombreMundo = "cielo" | "noche" | "papel" | "estudio" | "foto";

/**
 * La foto de una lámina.
 *
 * Se le aplica un velo oscuro, semitono y grano para que cualquier imagen
 * —propia, de banco o generada— salga con el mismo tratamiento y el carrusel
 * se lea como una pieza. Medido sobre el carrusel de SOLVO: su luminancia
 * media en zona sin texto es 64/255, o sea la foto queda a la mitad de brillo.
 *
 * `prompt` guarda con qué se generó la imagen. No se usa al renderizar: está
 * ahí para que dentro de seis meses se pueda repetir el look sin adivinar, y
 * para que `scripts/fotos.mjs` lo imprima listo para pegar en el generador.
 */
export type Foto = {
  archivo: string;
  prompt?: string;
  encuadre?: "centro" | "arriba" | "abajo";
  /**
   * 0 = foto tal cual; 1 = negro. Por defecto 0.45.
   *
   * Es más bajo que el 0.6 que da la medición de SOLVO porque el prompt de
   * `CARRUSEL.estiloFoto` ya pide una imagen subexpuesta: aplicarle encima el
   * velo completo la apaga del todo. Si una foto sale clara, se sube por
   * lámina; es el único número que conviene tocar a mano.
   */
  oscurecer?: number;
};

// ---------------------------------------------------------------------------
// Capas de textura
// ---------------------------------------------------------------------------

/** Semitono: retícula de puntos girada 22°, como una impresión de verdad. */
const Semitono: React.FC<{ id: string; paso: number; radio: number; tinte: string; opacidad: number }> = ({
  id,
  paso,
  radio,
  tinte,
  opacidad,
}) => (
  <svg
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    aria-hidden
  >
    <defs>
      <pattern
        id={id}
        width={paso}
        height={paso}
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(22)"
      >
        <circle cx={paso / 2} cy={paso / 2} r={radio} fill={tinte} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#${id})`} opacity={opacidad} />
  </svg>
);

/** Grano de papel. Es lo que separa "impreso" de "exportado de una plantilla". */
const Grano: React.FC<{ id: string; opacidad: number }> = ({ id, opacidad }) => (
  <svg
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    aria-hidden
  >
    <filter id={id}>
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.82"
        numOctaves={3}
        stitchTiles="stitch"
      />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect
      width="100%"
      height="100%"
      filter={`url(#${id})`}
      opacity={opacidad}
      style={{ mixBlendMode: "overlay" }}
    />
  </svg>
);

/**
 * Nubes de cúmulo, construidas con círculos sólidos que se superponen.
 *
 * La primera versión las hacía con degradados radiales y quedaban como manchas
 * borrosas — el aspecto exacto de un vector genérico. Una nube impresa tiene
 * silueta: lóbulos duros arriba y base plana. Con el semitono encima, esa
 * silueta lee como ilustración de imprenta; una mancha difusa nunca lo hace.
 *
 * Las posiciones son fijas, no aleatorias, para que el fondo salga idéntico en
 * las seis láminas. Ahí está la unidad del carrusel.
 */
type Cumulo = { x: number; y: number; e: number; o: number };

/**
 * Los cúmulos viven en los BORDES, nunca en el centro.
 *
 * La primera versión los repartía por toda la lámina y el resultado fue que la
 * letra chica en blanco caía sobre una nube blanca y desaparecía. Coderhouse
 * mantiene una banda de nubes arriba y otra abajo con el cielo limpio en medio,
 * y el texto siempre va sobre el cielo limpio. No es estética: es la única
 * forma de que un fondo con figuras no pelee con el texto.
 *
 * `y` está en fracciones del alto y puede salirse del lienzo a propósito: una
 * nube que asoma medio cuerpo desde el borde se ve más natural que una nube
 * entera flotando.
 */
const CUMULOS: Cumulo[] = [
  { x: 0.1, y: -0.01, e: 1.0, o: 0.95 },
  { x: 0.56, y: -0.05, e: 0.78, o: 0.68 },
  { x: 0.95, y: 0.01, e: 0.92, o: 0.9 },
  // Las de abajo asoman apenas: la línea de la letra chica va justo encima y
  // sobre nube blanca desaparece.
  { x: 0.05, y: 1.07, e: 0.8, o: 0.6 },
  { x: 0.72, y: 1.1, e: 1.0, o: 0.72 },
];

/** Lóbulos de un cúmulo, en unidades relativas al ancho de la nube. */
const LOBULOS = [
  { dx: -0.34, dy: 0.06, r: 0.2 },
  { dx: -0.14, dy: -0.08, r: 0.27 },
  { dx: 0.12, dy: -0.03, r: 0.23 },
  { dx: 0.34, dy: 0.08, r: 0.18 },
];

const Nubes: React.FC<{ tinte: string }> = ({ tinte }) => {
  const { width, height } = useVideoConfig();
  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden
    >
      <defs>
        {/* Un desenfoque mínimo: suficiente para que el borde no se vea
            recortado con tijera, no tanto como para volver a la mancha. */}
        <filter id="nube-borde" x="-25%" y="-40%" width="150%" height="200%">
          <feGaussianBlur stdDeviation={width * 0.006} />
        </filter>
      </defs>
      {CUMULOS.map((c, i) => {
        const w = width * 0.46 * c.e;
        const cx = c.x * width;
        const cy = c.y * height;
        return (
          <g key={i} opacity={c.o} filter="url(#nube-borde)">
            {LOBULOS.map((l, j) => (
              <circle
                key={j}
                cx={cx + l.dx * w}
                cy={cy + l.dy * w}
                r={l.r * w}
                fill={tinte}
              />
            ))}
            {/* Base plana: es lo que hace que se lea como nube y no como
                racimo de burbujas. */}
            <rect
              x={cx - w * 0.42}
              y={cy + w * 0.02}
              width={w * 0.84}
              height={w * 0.14}
              rx={w * 0.07}
              fill={tinte}
            />
          </g>
        );
      })}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Los mundos
// ---------------------------------------------------------------------------

/** Qué tinta usa el texto sobre cada mundo. */
export const TINTA_DE_MUNDO: Record<
  NombreMundo,
  { claro: boolean; fuerte: string; suave: string; acento: string }
> = {
  cielo: {
    claro: false,
    fuerte: color.blanco,
    suave: "rgba(255,255,255,0.82)",
    acento: color.blanco,
  },
  noche: {
    claro: false,
    fuerte: color.blanco,
    suave: "rgba(255,255,255,0.78)",
    acento: color.azulClaro,
  },
  papel: {
    claro: true,
    fuerte: color.tinta,
    suave: color.tintaSuave,
    acento: color.azul,
  },
  estudio: {
    claro: true,
    fuerte: color.tinta,
    suave: color.tintaSuave,
    acento: color.azul,
  },
  // Sobre foto oscura todo va en blanco. El azul de marca sobre una foto
  // apagada pierde saturación y se lee sucio; el acento se gana con la
  // itálica, no con el color.
  foto: {
    claro: false,
    fuerte: color.blanco,
    suave: "rgba(255,255,255,0.80)",
    acento: color.blanco,
  },
};

export const Mundo: React.FC<{ mundo: NombreMundo; foto?: Foto }> = ({
  mundo,
  foto,
}) => {
  const base = (() => {
    switch (mundo) {
      case "cielo":
        return `linear-gradient(178deg, ${color.azul} 0%, #0069DC 55%, ${color.azulProfundo} 100%)`;
      case "noche":
        return `radial-gradient(125% 95% at 20% 6%, #0B4A96 0%, #032C63 38%, ${color.azulNoche} 100%)`;
      case "papel":
        return color.crema;
      case "estudio":
        return `linear-gradient(170deg, #FFFFFF 0%, #EAF3FF 60%, #DCEBFF 100%)`;
      case "foto":
        // Negro debajo: si una foto falta o tarda, la lámina sale oscura y
        // legible en vez de blanca con el texto blanco encima.
        return "#05070C";
    }
  })();

  const claro = TINTA_DE_MUNDO[mundo].claro;
  const esFoto = mundo === "foto";

  if (esFoto && !foto) {
    throw new Error(
      "El mundo es 'foto' pero esta lámina no declara `foto`. " +
        "Corre `node scripts/fotos.mjs` para ver qué imágenes faltan.",
    );
  }

  const velo = foto?.oscurecer ?? 0.45;

  return (
    <AbsoluteFill style={{ background: base, overflow: "hidden" }}>
      {mundo === "cielo" ? <Nubes tinte="#FFFFFF" /> : null}

      {foto ? (
        <AbsoluteFill>
          <Img
            src={staticFile(foto.archivo)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition:
                foto.encuadre === "arriba"
                  ? "center top"
                  : foto.encuadre === "abajo"
                    ? "center bottom"
                    : "center",
              // Sobre el mundo foto la imagen manda y solo se le baja el brillo.
              // Sobre un mundo de color la foto se desatura y se funde, para que
              // no compita con el fondo dibujado.
              filter: esFoto
                ? "saturate(0.55) contrast(1.12)"
                : "grayscale(1) contrast(1.25)",
              opacity: esFoto ? 1 : 0.45,
              mixBlendMode: esFoto ? "normal" : claro ? "multiply" : "screen",
            }}
          />
          {esFoto ? (
            <>
              {/* El velo plano baja el brillo parejo; el degradado añade peso
                  arriba y abajo, que es donde cae el texto. Medido sobre
                  SOLVO: su foto queda en 64/255 de luminancia media. */}
              <AbsoluteFill style={{ background: `rgba(4,7,14,${velo})` }} />
              <AbsoluteFill
                style={{
                  background:
                    "linear-gradient(180deg, rgba(4,7,14,0.45) 0%, rgba(4,7,14,0) 32%, rgba(4,7,14,0) 62%, rgba(4,7,14,0.55) 100%)",
                }}
              />
            </>
          ) : null}
        </AbsoluteFill>
      ) : null}

      <Semitono
        id={`ht-${mundo}`}
        paso={12}
        radio={claro ? 2.6 : 3.1}
        tinte={claro ? color.tinta : "#000814"}
        opacidad={claro ? 0.1 : 0.16}
      />

      {/* Viñeta: apenas perceptible, pero sin ella el borde se ve plano. */}
      <AbsoluteFill
        style={{
          background: claro
            ? "radial-gradient(120% 100% at 50% 45%, rgba(0,25,52,0) 55%, rgba(0,25,52,0.10) 100%)"
            : "radial-gradient(120% 100% at 50% 45%, rgba(0,8,20,0) 50%, rgba(0,8,20,0.34) 100%)",
        }}
      />

      <Grano id={`grano-${mundo}`} opacidad={claro ? 0.14 : 0.2} />
    </AbsoluteFill>
  );
};
