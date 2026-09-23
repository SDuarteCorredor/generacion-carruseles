/**
 * Objetos 3D isométricos para el panel derecho.
 *
 * DOCA narra las dos primeras escenas y se despide en la última. En medio, el
 * panel muestra un objeto relacionado con el tema de la lámina, para que la
 * imagen acompañe lo que se dice en vez de repetir siempre la misma pose.
 *
 * Todo se construye con proyección isométrica real (no son PNG): así queda
 * nítido a cualquier resolución, usa exactamente los colores de theme.ts y se
 * anima sin depender de archivos externos.
 *
 * Para cambiar un objeto se edita solo su función aquí abajo; para asignarlo a
 * una escena, el campo `figura` en content.ts.
 */
import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

// ---------------------------------------------------------------------------
// Proyección
// ---------------------------------------------------------------------------

/** Isométrica clásica 2:1 en pantalla. +x baja a la derecha, +y baja a la izquierda, +z sube. */
const COS30 = Math.cos(Math.PI / 6);
const iso = (x: number, y: number, z: number): [number, number] => [
  (x - y) * COS30,
  (x + y) * 0.5 - z,
];
const pt = (x: number, y: number, z: number) => iso(x, y, z).join(",");
const poly = (...p: [number, number, number][]) => p.map((c) => pt(...c)).join(" ");

/** Polilínea sobre un plano horizontal a altura z (para dibujar encima de una cara). */
const trazo = (puntos: [number, number][], z: number) =>
  "M " + puntos.map(([x, y]) => iso(x, y, z).join(",")).join(" L ");

// ---------------------------------------------------------------------------
// Materiales — tres tonos por material: cima, cara izquierda, cara derecha.
// La luz entra por arriba a la izquierda, igual que la sombra de DOCA.
// ---------------------------------------------------------------------------

type Material = { cima: string; izq: string; der: string };

const MAT = {
  papel: { cima: "#FFFFFF", izq: "#DCEBFF", der: "#B4D3F5" },
  azul: { cima: "#4FA6FF", izq: "#0F7AE8", der: "#0A57A8" },
  azulHondo: { cima: "#1F6FD0", izq: "#0E4E96", der: "#08325F" },
  ambar: { cima: "#F5B44E", izq: "#D98A22", der: "#B45309" },
  verde: { cima: "#34C48D", izq: "#149468", der: "#0B6647" },
} satisfies Record<string, Material>;

// ---------------------------------------------------------------------------
// Primitivas
// ---------------------------------------------------------------------------

/** Caja isométrica: dibuja las tres caras visibles con sombreado propio. */
const Caja: React.FC<{
  x?: number;
  y?: number;
  z?: number;
  w: number;
  d: number;
  h: number;
  mat: Material;
}> = ({ x = 0, y = 0, z = 0, w, d, h, mat }) => (
  <g>
    <polygon
      points={poly([x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h])}
      fill={mat.izq}
    />
    <polygon
      points={poly([x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h])}
      fill={mat.der}
    />
    <polygon
      points={poly([x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h])}
      fill={mat.cima}
    />
  </g>
);

/** Rectángulo apoyado sobre una cara superior — para detalles impresos. */
const Sobre: React.FC<{
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  fill: string;
  opacidad?: number;
}> = ({ x, y, z, w, d, fill, opacidad = 1 }) => (
  <polygon
    points={poly([x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z])}
    fill={fill}
    opacity={opacidad}
  />
);

/**
 * Cilindro vertical (moneda, ficha). Un círculo en el plano xy proyecta a una
 * elipse de semiejes r·√1.5 y r·√0.5; el canto se arma con la elipse inferior
 * tapada por un rectángulo, así no hay que pelear con los flags de arco.
 */
const Cilindro: React.FC<{
  cx: number;
  cy: number;
  z: number;
  r: number;
  h: number;
  mat: Material;
}> = ({ cx, cy, z, r, h, mat }) => {
  const [sx, sy] = iso(cx, cy, z);
  const rx = r * 1.22474;
  const ry = r * 0.70711;
  return (
    <g>
      <ellipse cx={sx} cy={sy + h} rx={rx} ry={ry} fill={mat.der} />
      <rect x={sx - rx} y={sy} width={rx * 2} height={h} fill={mat.der} />
      <rect x={sx - rx} y={sy} width={rx} height={h} fill={mat.izq} />
      <ellipse cx={sx} cy={sy} rx={rx} ry={ry} fill={mat.cima} />
    </g>
  );
};

/**
 * Silueta plana con espesor: se pinta la misma forma dos veces, la de atrás
 * desplazada en la diagonal isométrica. Es la manera limpia de dar volumen a
 * escudos, marcas de verificación y triángulos sin modelarlos cara por cara.
 */
const Extruido: React.FC<{
  d: string;
  mat: Material;
  prof?: number;
  rot?: number;
}> = ({ d, mat, prof = 15, rot = 0 }) => (
  <g transform={`rotate(${rot})`}>
    <path d={d} fill={mat.der} transform={`translate(${prof * COS30},${prof * 0.5})`} />
    <path d={d} fill={mat.izq} transform={`translate(${prof * COS30 * 0.5},${prof * 0.25})`} />
    <path d={d} fill={mat.cima} />
  </g>
);

// ---------------------------------------------------------------------------
// Objetos
// ---------------------------------------------------------------------------

/** 03 · Contrato por requerimiento — pila de hojas con sello. */
const Contrato: React.FC = () => (
  <g>
    <Caja x={-66} y={-46} z={-26} w={132} d={96} h={10} mat={MAT.papel} />
    <Caja x={-74} y={-54} z={-12} w={140} d={102} h={10} mat={MAT.papel} />
    <Caja x={-82} y={-62} z={2} w={148} d={108} h={12} mat={MAT.papel} />
    {/* Renglones impresos sobre la hoja de arriba. */}
    {[0, 1, 2].map((i) => (
      <Sobre key={i} x={-64} y={-44 + i * 20} z={14} w={i === 2 ? 54 : 92} d={8} fill="#B4D3F5" />
    ))}
    {/* Sello: firmado y en regla. */}
    <g transform={`translate(${iso(34, 22, 14)[0]},${iso(34, 22, 14)[1]})`}>
      <ellipse rx={30} ry={17} fill={MAT.azul.cima} />
      <path
        d="M-13,0 L-4,8 L14,-8"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </g>
);

/** 04 · Lo de ley — escudo con visto bueno. */
const Escudo: React.FC = () => (
  <g transform="translate(0,-14)">
    <Extruido
      mat={MAT.papel}
      prof={22}
      d="M0,-96 L78,-62 C78,18 46,76 0,100 C-46,76 -78,18 -78,-62 Z"
    />
    <path
      d="M-34,2 L-10,28 L36,-30"
      fill="none"
      stroke={MAT.azul.izq}
      strokeWidth={17}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </g>
);

/** 05 · Pagos — pila de monedas y una de canto. */
const Monedas: React.FC = () => {
  const [cx, cy] = iso(-30, -30, 4);
  return (
    <g>
      <Cilindro cx={-30} cy={-30} z={-52} r={62} h={20} mat={MAT.papel} />
      <Cilindro cx={-30} cy={-30} z={-28} r={62} h={20} mat={MAT.papel} />
      <Cilindro cx={-30} cy={-30} z={-4} r={62} h={20} mat={MAT.papel} />
      {/* Cara de la moneda de arriba. El símbolo se aplasta en vertical para
          que quede acostado sobre la cara y no parado sobre ella. */}
      <g transform={`translate(${cx},${cy}) scale(1,0.57735)`}>
        <circle r={52} fill="none" stroke={MAT.azul.cima} strokeWidth={7} />
        <path
          d="M0,-40 L0,40"
          stroke={MAT.azul.izq}
          strokeWidth={9}
          strokeLinecap="round"
        />
        <path
          d="M19,-24 C19,-37 -19,-37 -19,-20 C-19,-5 19,-5 19,12 C19,29 -19,29 -19,16"
          fill="none"
          stroke={MAT.azul.izq}
          strokeWidth={9}
          strokeLinecap="round"
        />
      </g>
      {/* Moneda de canto al frente: rompe la simetría de la pila. */}
      <g transform={`translate(${iso(4, 108, -44)[0]},${iso(4, 108, -44)[1]}) rotate(-14)`}>
        <circle r={50} fill={MAT.papel.der} />
        <circle r={50} fill={MAT.papel.cima} transform="translate(-9,-6)" />
        <circle
          r={34}
          fill="none"
          stroke={MAT.azul.cima}
          strokeWidth={7}
          transform="translate(-9,-6)"
        />
      </g>
    </g>
  );
};

/** 06 · Firma digital — tableta con la rúbrica y el lápiz. */
const Firma: React.FC = () => {
  // Rúbrica muestreada sobre el plano de la tableta, para que siga la
  // perspectiva en vez de flotar plana encima.
  const rubrica: [number, number][] = Array.from({ length: 40 }, (_, i) => {
    const t = i / 39;
    const x = -62 + t * 118;
    const y = 14 - Math.sin(t * Math.PI * 2.4) * 26 - t * 12;
    return [x, y];
  });
  return (
    <g>
      <Caja x={-88} y={-66} z={-16} w={176} d={132} h={14} mat={MAT.azulHondo} />
      <Sobre x={-76} y={-54} z={-2} w={152} d={108} fill="#FFFFFF" />
      <path
        d={trazo(rubrica, -1)}
        fill="none"
        stroke={MAT.azul.izq}
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* El lápiz va en coordenadas de pantalla: una caja isométrica no se
          puede inclinar, y un stylus recto se vería como un ladrillo. La punta
          cae justo donde termina la rúbrica. */}
      <g transform="translate(72,-7) rotate(34)">
        <rect x={-9} y={-124} width={18} height={140} rx={9} fill={MAT.papel.cima} />
        <rect x={-9} y={-124} width={9} height={140} rx={4.5} fill={MAT.papel.izq} />
        {/* Empuñadura: sin ella el lápiz se lee como un palo blanco. */}
        <rect x={-9} y={-40} width={18} height={30} fill={MAT.azul.cima} />
        <rect x={-9} y={-40} width={9} height={30} fill={MAT.azul.izq} />
        <path d="M-9,16 L9,16 L0,44 Z" fill={MAT.azulHondo.izq} />
      </g>
    </g>
  );
};

/** 07 · Pasos antes de guardar — tablero con la lista chuleada. */
const Checklist: React.FC = () => (
  <g>
    <Caja x={-84} y={-76} z={-14} w={168} d={152} h={14} mat={MAT.papel} />
    {/* Pinza apoyada sobre el borde de atrás: sin ella la caja no se lee como
        portapapeles. */}
    <Caja x={-34} y={-76} z={0} w={68} d={22} h={12} mat={MAT.azul} />
    {[0, 1, 2].map((i) => {
      const y = -38 + i * 40;
      return (
        <g key={i}>
          <Sobre x={-58} y={y} z={0.4} w={28} d={28} fill="#C7DFF7" />
          <path
            d={trazo(
              [
                [-51, y + 15],
                [-44, y + 21],
                [-32, y + 5],
              ],
              1,
            )}
            fill="none"
            stroke={MAT.verde.izq}
            strokeWidth={8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Sobre x={-18} y={y + 8} z={0.4} w={66} d={13} fill="#9CC4F2" />
        </g>
      );
    })}
  </g>
);

/** 08 · Seguridad social — el mes, con los días cumplidos marcados. */
const Calendario: React.FC = () => (
  <g>
    <Caja x={-84} y={-76} z={-18} w={168} d={152} h={18} mat={MAT.papel} />
    {/* Cabecera azul del mes. */}
    <Sobre x={-84} y={-76} z={0.4} w={168} d={36} fill={MAT.azul.cima} />
    {Array.from({ length: 4 }).map((_, fila) =>
      Array.from({ length: 5 }).map((_, col) => {
        const activo = fila * 5 + col < 13;
        return (
          <Sobre
            key={`${fila}-${col}`}
            x={-70 + col * 28}
            y={-28 + fila * 26}
            z={0.6}
            w={20}
            d={18}
            fill={activo ? MAT.azul.cima : "#DCEBFF"}
            opacidad={activo ? 0.9 : 1}
          />
        );
      }),
    )}
    {/* Argollas: sin ellas la caja no se lee como calendario. */}
    <Caja x={-52} y={-84} z={0} w={14} d={14} h={28} mat={MAT.azulHondo} />
    <Caja x={26} y={-84} z={0} w={14} d={14} h={28} mat={MAT.azulHondo} />
  </g>
);

/** 09 · Si no cumples ninguna — señal de atención. */
const Alerta: React.FC = () => (
  <g transform="translate(0,-6)">
    <Extruido
      mat={MAT.ambar}
      prof={20}
      d="M0,-92 L86,62 C93,74 84,86 70,86 L-70,86 C-84,86 -93,74 -86,62 Z"
    />
    <rect x={-10} y={-42} width={20} height={62} rx={10} fill="#FFFFFF" />
    <circle cx={0} cy={44} r={12} fill="#FFFFFF" />
  </g>
);

/** 10 · Cuenta bancaria — tarjeta y celular. */
const Tarjeta: React.FC = () => (
  // Tarjeta y celular juntos son la pieza más ancha: se encoge y se recentra
  // para que no se salga por el borde derecho del panel.
  <g transform="translate(18,0) scale(0.9)">
    {/* Celular al fondo: la escena también ofrece DaviPlata. */}
    <g transform="translate(52,-110)">
      <Caja x={-40} y={-76} z={0} w={80} d={152} h={14} mat={MAT.azulHondo} />
      <Sobre x={-31} y={-62} z={14.4} w={62} d={126} fill="#EAF4FF" />
      {/* Auricular y barra de inicio: lo que hace que se lea celular. */}
      <Sobre x={-11} y={-70} z={14.4} w={22} d={5} fill="#7FA9D6" />
      <Sobre x={-15} y={68} z={14.4} w={30} d={5} fill="#7FA9D6" />
      <Sobre x={-22} y={-34} z={15} w={44} d={30} fill={MAT.azul.cima} />
      <Sobre x={-22} y={8} z={15} w={44} d={11} fill="#9CC4F2" />
      <Sobre x={-22} y={26} z={15} w={28} d={11} fill="#9CC4F2" />
    </g>
    {/* Tarjeta al frente, levemente elevada. */}
    <g transform="translate(-34,48)">
      <Caja x={-96} y={-60} z={0} w={192} d={120} h={12} mat={MAT.papel} />
      <Sobre x={-96} y={-60} z={12.4} w={192} d={22} fill={MAT.azul.cima} />
      <Sobre x={-78} y={-26} z={12.6} w={36} d={28} fill="#F5B44E" />
      <Sobre x={-78} y={20} z={12.6} w={110} d={13} fill="#9CC4F2" />
      <Sobre x={-78} y={40} z={12.6} w={64} d={11} fill="#C7DFF7" />
    </g>
  </g>
);

/** 11 · Resumen — el visto bueno final. */
const Listo: React.FC = () => (
  <g transform="translate(0,-6)">
    <Extruido mat={MAT.verde} prof={22} d="M-104,0 a104,104 0 1,1 208,0 a104,104 0 1,1 -208,0" />
    <path
      d="M-46,4 L-15,37 L48,-37"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth={20}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </g>
);

// ---------------------------------------------------------------------------
// Registro y escenario
// ---------------------------------------------------------------------------

export const PIEZAS_3D = {
  contrato: Contrato,
  escudo: Escudo,
  monedas: Monedas,
  firma: Firma,
  checklist: Checklist,
  calendario: Calendario,
  alerta: Alerta,
  tarjeta: Tarjeta,
  listo: Listo,
} as const;

export type NombrePieza3D = keyof typeof PIEZAS_3D;

/**
 * Escenario del objeto: halo, sombra de contacto, entrada con resorte y
 * flotación continua. Es el mismo tratamiento para las nueve piezas, igual que
 * DOCA tenía un tratamiento único en todas las escenas.
 */
export const Figura3D: React.FC<{ nombre: NombrePieza3D; ancho: number }> = ({
  nombre,
  ancho,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Pieza = PIEZAS_3D[nombre];

  const entrada = spring({
    frame: frame - 8,
    fps,
    config: { damping: 200, mass: 0.9 },
    durationInFrames: 30,
  });
  const flota = Math.sin(frame / 36) * 12;
  const inclina = Math.sin(frame / 52) * 2.2;

  return (
    <svg width={ancho} height={ancho} viewBox="0 0 400 400" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`halo-${nombre}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <filter id={`difusa-${nombre}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>

      <circle cx={200} cy={188} r={186} fill={`url(#halo-${nombre})`} opacity={entrada} />

      <g opacity={entrada}>
        {/* La sombra se achica cuando el objeto sube: sin eso, la flotación
            parece un objeto pegado que se desliza. */}
        <ellipse
          cx={200}
          cy={348}
          rx={128 - flota * 1.8}
          ry={30 - flota * 0.5}
          fill="#001B3D"
          opacity={0.42}
          filter={`url(#difusa-${nombre})`}
        />
      </g>

      <g
        transform={`translate(200,${196 + flota}) rotate(${inclina}) scale(${0.95 + entrada * 0.33})`}
        opacity={entrada}
      >
        <Pieza />
      </g>
    </svg>
  );
};
