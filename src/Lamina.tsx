/**
 * El motor de láminas.
 *
 * `contenido.ts` declara qué dice cada lámina; este archivo decide cómo se ve.
 *
 * Tres decisiones que vienen de analizar cómo se comportan los carruseles de
 * Coderhouse por dentro, y que son lo contrario de lo que hace una plantilla:
 *
 *   1. CERO CROMO. Ni logo, ni @, ni web, ni paginador. Instagram ya pone el
 *      nombre y la foto de perfil encima del post.
 *   2. NADA DE TARJETAS. Ni cajas, ni franjas de color al costado, ni íconos
 *      en cuadrito. Los datos van en chips de papel, una palabra cada uno.
 *   3. UN SOLO MUNDO de fondo para todo el carrusel (ver Mundo.tsx).
 *
 * TODO ES ESTÁTICO: no se llama a `useCurrentFrame()` en ninguna parte, así el
 * PNG es determinista y no depende de acertar en qué frame se asentó todo.
 */
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { loadFont as loadSans } from "@remotion/google-fonts/Archivo";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { color, escala, espacio, fuente, interlineado, tracking } from "./theme";
import { Mundo, TINTA_DE_MUNDO } from "./Mundo";
import { PIEZAS_3D, type NombrePieza3D } from "./Piezas3D";
import {
  CARRUSEL,
  LAMINAS,
  type Bloque,
  type Lamina as TLamina,
  type Titular,
} from "./contenido";

// Solo los pesos y el subset que se usan: sin esto son ~130 peticiones de red
// por cada lámina que se exporta.
const sans = loadSans("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
}).fontFamily;

/**
 * La serif itálica es la firma de la cuenta. Playfair Display es la que más se
 * acerca a la de los carruseles publicados: didona, contraste alto, remates de
 * bola. Si el brandbook define otra, se cambia aquí y nada más.
 */
const serif = loadSerif("italic", {
  weights: ["400", "500"],
  subsets: ["latin"],
}).fontFamily;

const useK = () => useVideoConfig().width / 1080;

const tinta = TINTA_DE_MUNDO[CARRUSEL.mundo];

// ---------------------------------------------------------------------------
// Titular
// ---------------------------------------------------------------------------

const Titular: React.FC<{ t: Titular }> = ({ t }) => {
  const k = useK();
  const centro = (t.alineado ?? "centro") === "centro";
  const acento = (t.peso === "grande" ? escala.acentoGrande : escala.acento) * k;
  const remate = (t.peso === "grande" ? escala.remate : escala.remateChico) * k;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: centro ? "center" : "flex-start",
        textAlign: centro ? "center" : "left",
        gap: 8 * k,
      }}
    >
      {t.ojo ? (
        <div
          style={{
            fontFamily: sans,
            fontSize: escala.ojo * k,
            fontWeight: fuente.fuerte,
            letterSpacing: tracking.ojo * k,
            textTransform: "uppercase",
            color: tinta.fuerte,
            opacity: 0.88,
            marginBottom: 10 * k,
          }}
        >
          {t.ojo}
        </div>
      ) : null}

      {t.acento ? (
        <div
          style={{
            fontFamily: serif,
            fontStyle: "italic",
            fontSize: acento,
            fontWeight: 400,
            letterSpacing: tracking.acento * k,
            lineHeight: interlineado.acento,
            color: tinta.acento,
            textWrap: "balance",
            // La itálica tiene descendentes largos (p, g, ñ, y). Sin este aire
            // el remate en bold se le monta encima y se lee como un error.
            paddingBottom: acento * 0.1,
            marginBottom: t.remate ? acento * 0.02 : 0,
          }}
        >
          {t.acento}
        </div>
      ) : null}

      {t.remate ? (
        <div
          style={{
            fontFamily: sans,
            fontSize: remate,
            fontWeight: fuente.ultra,
            letterSpacing: tracking.remate * k,
            lineHeight: interlineado.titular,
            textTransform: "uppercase",
            color: tinta.fuerte,
            textWrap: "balance",
          }}
        >
          {t.remate}
        </div>
      ) : null}
    </div>
  );
};

/**
 * La nota va al pie de la lámina, separada del titular.
 *
 * Es la letra chica: la aclaración legal, el CTA. Coderhouse la usa igual —
 * pequeña, en itálica, abajo — y funciona porque no compite con el titular
 * pero queda dentro del encuadre de quien ya se detuvo a leer.
 */
const Nota: React.FC<{ texto: string }> = ({ texto }) => {
  const k = useK();
  return (
    <div
      style={{
        fontFamily: serif,
        fontStyle: "italic",
        fontSize: escala.nota * k,
        lineHeight: interlineado.nota,
        color: tinta.suave,
        textAlign: "center",
        maxWidth: 760 * k,
        textWrap: "balance",
      }}
    >
      {texto}
    </div>
  );
};

/**
 * La pastilla de la portada — el "Desliza bajo tu propio riesgo" de SOLVO.
 *
 * Es de contorno, no rellena: rellena se lee como un botón de anuncio pagado.
 * Va solo en la primera lámina; repetida en todas se convierte en cromo, que
 * es justo lo que este carrusel no lleva.
 */
const Pastilla: React.FC<{ texto: string }> = ({ texto }) => {
  const k = useK();
  return (
    <div
      style={{
        border: `${2.5 * k}px solid ${tinta.fuerte}`,
        borderRadius: 999,
        padding: `${20 * k}px ${44 * k}px`,
        fontFamily: sans,
        fontSize: 34 * k,
        fontWeight: fuente.fuerte,
        color: tinta.fuerte,
        lineHeight: 1,
      }}
    >
      {texto}
    </div>
  );
};

const Flecha: React.FC = () => {
  const k = useK();
  return (
    <div
      style={{
        fontFamily: sans,
        fontSize: escala.flecha * k,
        fontWeight: fuente.regular,
        color: tinta.suave,
        lineHeight: 1,
      }}
    >
      →
    </div>
  );
};

// ---------------------------------------------------------------------------
// Bloques
// ---------------------------------------------------------------------------

/**
 * Chips de papel.
 *
 * Reemplazan a las tarjetas con franja de color, que se ven genéricas y son
 * uno de los delatores clásicos de "esto lo maquetó una IA": cajas iguales,
 * ícono en cuadrito, rótulo en versalitas, texto de relleno.
 *
 * Un chip lleva UNA palabra. La rotación es de ±1.4° y sale del índice, no de
 * un aleatorio: así el PNG es idéntico en cada export y no baila entre
 * versiones.
 */
const Chips: React.FC<{ textos: string[] }> = ({ textos }) => {
  const k = useK();
  const giros = [-1.4, 0.9, -0.7, 1.3, -1.1, 0.6];
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 22 * k,
        justifyContent: "center",
        maxWidth: 860 * k,
      }}
    >
      {textos.map((t, i) => (
        <div
          key={i}
          style={{
            transform: `rotate(${giros[i % giros.length]}deg)`,
            background: color.papel,
            color: color.tinta,
            fontFamily: sans,
            fontSize: escala.chip * k,
            fontWeight: fuente.fuerte,
            padding: `${22 * k}px ${40 * k}px`,
            borderRadius: espacio.radio * k,
            boxShadow: `${7 * k}px ${10 * k}px 0 rgba(0,12,30,0.22)`,
          }}
        >
          {t}
        </div>
      ))}
    </div>
  );
};

/** El círculo de acento. Sostiene una frase corta y rompe la retícula. */
const Circulo: React.FC<{ texto: string }> = ({ texto }) => {
  const k = useK();
  const d = 500 * k;
  return (
    <div
      style={{
        width: d,
        height: d,
        borderRadius: "50%",
        background: tinta.claro ? color.azul : color.blanco,
        color: tinta.claro ? color.blanco : color.tinta,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 54 * k,
        fontFamily: sans,
        fontSize: 48 * k,
        fontWeight: fuente.fuerte,
        lineHeight: 1.24,
        boxShadow: `0 ${14 * k}px ${44 * k}px rgba(0,10,26,0.28)`,
      }}
    >
      {texto}
    </div>
  );
};

/**
 * El objeto isométrico de Piezas3D, congelado en su estado asentado.
 *
 * `Figura3D` anima con spring y flotación; aquí se reproduce el resultado final
 * para que el PNG sea determinista. La geometría de las nueve piezas se reusa
 * tal cual, sin copiarla.
 */
const Figura: React.FC<{ nombre: NombrePieza3D; ancho: number }> = ({
  nombre,
  ancho,
}) => {
  const Geometria = PIEZAS_3D[nombre];
  return (
    <svg
      width={ancho}
      height={ancho}
      viewBox="0 0 400 400"
      style={{ overflow: "visible", display: "block" }}
    >
      <defs>
        <filter id={`sombra-${nombre}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      <ellipse
        cx={200}
        cy={352}
        rx={126}
        ry={28}
        fill="#000A18"
        opacity={0.34}
        filter={`url(#sombra-${nombre})`}
      />
      <g transform="translate(200,196) scale(1.28)">
        <Geometria />
      </g>
    </svg>
  );
};

const Bloque: React.FC<{ b: Bloque }> = ({ b }) => {
  const k = useK();
  switch (b.tipo) {
    case "chips":
      return <Chips textos={b.textos} />;
    case "circulo":
      return <Circulo texto={b.texto} />;
    case "figura":
      return <Figura nombre={b.nombre} ancho={(b.ancho ?? 420) * k} />;
    case "dato":
      return (
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: sans,
              fontSize: escala.dato * k,
              fontWeight: fuente.ultra,
              letterSpacing: -9 * k,
              lineHeight: 1,
              color: tinta.fuerte,
            }}
          >
            {b.dato}
          </div>
          {b.rotulo ? (
            <div
              style={{
                fontFamily: sans,
                fontSize: escala.ojo * k,
                fontWeight: fuente.medio,
                letterSpacing: tracking.ojo * k,
                textTransform: "uppercase",
                color: tinta.suave,
                marginTop: 10 * k,
              }}
            >
              {b.rotulo}
            </div>
          ) : null}
        </div>
      );
  }
};

// ---------------------------------------------------------------------------

export const TOTAL_LAMINAS = LAMINAS.length;

export const Lamina: React.FC<{ indice: number }> = ({ indice }) => {
  const k = useK();
  const l: TLamina | undefined = LAMINAS[indice];

  if (!l) {
    throw new Error(
      `No existe la lámina ${indice}: contenido.ts tiene ${LAMINAS.length} (índices 0 a ${LAMINAS.length - 1}).`,
    );
  }

  const posicion = l.titular?.posicion ?? "centro";
  // Cuando el titular va abajo, el bloque entra primero: así la figura o los
  // chips quedan arriba y el titular remata la lámina.
  const titularPrimero = posicion !== "abajo";

  const titular = l.titular ? <Titular t={l.titular} /> : null;
  const bloque = l.bloque ? <Bloque b={l.bloque} /> : null;

  return (
    <AbsoluteFill>
      <Mundo mundo={CARRUSEL.mundo} foto={l.foto} />

      <AbsoluteFill
        style={{
          padding: espacio.margen * k,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* El grupo principal ocupa todo el alto disponible y se centra ahí.
            La nota queda fuera de ese grupo, anclada al pie: si entrara en el
            flujo empujaría el titular hacia arriba y cada lámina quedaría
            centrada en un sitio distinto según tuviera nota o no. */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent:
              posicion === "arriba"
                ? "flex-start"
                : posicion === "abajo"
                  ? "flex-end"
                  : "center",
            gap: 46 * k,
          }}
        >
          {titularPrimero ? titular : bloque}
          {titularPrimero ? bloque : titular}
          {l.titular?.pastilla ? <Pastilla texto={l.titular.pastilla} /> : null}
          {l.titular?.flecha ? <Flecha /> : null}
        </div>

        {l.titular?.nota ? (
          <div style={{ flexShrink: 0, paddingTop: 24 * k }}>
            <Nota texto={l.titular.nota} />
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
