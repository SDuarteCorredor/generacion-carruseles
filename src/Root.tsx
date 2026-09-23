import React from "react";
import { Composition } from "remotion";
import { Lamina, TOTAL_LAMINAS } from "./Lamina";
import { CARRUSEL } from "./contenido";
import { FORMATOS } from "./theme";

/**
 * Una sola composición, parametrizada por `indice`: agregar una lámina es
 * agregar un objeto a `contenido.ts` y nada más. Siempre 4:5.
 *
 * `durationInFrames: 1` porque un PNG no tiene tiempo. Nada en `Lamina.tsx`
 * depende del frame actual.
 */
const { ancho, alto } = FORMATOS[CARRUSEL.formato];

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Lamina"
      component={Lamina}
      durationInFrames={1}
      fps={30}
      width={ancho}
      height={alto}
      defaultProps={{ indice: 0 }}
      calculateMetadata={({ props }) => {
        if (
          !Number.isInteger(props.indice) ||
          props.indice < 0 ||
          props.indice >= TOTAL_LAMINAS
        ) {
          throw new Error(
            `indice ${props.indice} fuera de rango: el carrusel tiene ${TOTAL_LAMINAS} láminas (0 a ${TOTAL_LAMINAS - 1}).`,
          );
        }
        return {};
      }}
    />
  </>
);
