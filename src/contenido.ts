/**
 * Todo el contenido del carrusel, en un solo lugar.
 *
 * ---------------------------------------------------------------------------
 * LAS TRES REGLAS QUE NO SE NEGOCIAN
 *
 * 1. MÁXIMO 6 LÁMINAS. El export falla si hay más.
 * 2. UNA IDEA POR LÁMINA. Ni listas, ni tarjetas, ni párrafos.
 * 3. CERO CROMO. Ni logo, ni @, ni web, ni paginador.
 * ---------------------------------------------------------------------------
 *
 * NUNCA INVENTAR DATOS. Estos carruseles comunican políticas de la empresa y
 * ofertas reales: plazos, montos, requisitos, vacantes, ciudades. Un dato
 * verosímil puesto para rellenar una lámina se convierte en un compromiso que
 * la empresa no hizo. Si el encargo no lo trae: preguntar, o dejarlo en el
 * nivel de generalidad que sí dieron — y decirlo al entregar.
 */
import type { NombrePieza3D } from "./Piezas3D";
import type { Foto, NombreMundo } from "./Mundo";
import type { NombreFormato } from "./theme";

export const CARRUSEL = {
  formato: "vertical" as NombreFormato,
  /**
   * El mundo de fondo, declarado UNA vez para todas las láminas. Es lo que
   * hace que el carrusel se lea como una sola pieza.
   * "foto" · "cielo" · "noche" · "papel" · "estudio"
   */
  mundo: "foto" as NombreMundo,

  /**
   * Se anexa a TODOS los prompts de imagen.
   *
   * Es lo que hace que las seis fotos se parezcan entre sí. Generarlas una por
   * una sin este bloque da seis imágenes bonitas que no pegan: distinta luz,
   * distinta saturación, distinto contraste, y el carrusel deja de leerse como
   * una pieza.
   *
   * VA EN INGLÉS Y CON ESPECIFICACIONES TÉCNICAS. Los generadores de imagen
   * están entrenados sobre pies de foto y metadatos en inglés: "luz tenue de
   * interior" es una intención, "single practical source, no fill, ISO 2000,
   * f/2.0" es una instrucción. Un prompt descriptivo en español da una imagen
   * genérica; uno con cuerpo, diafragma, temperatura de color y curva de grade
   * da algo que parece fotografía.
   *
   * Lo que este bloque fija —y por eso no se toca por lámina—: exposición,
   * filosofía de luz, grade de color, grano, y el espacio negativo donde va el
   * texto. Lo que cada lámina sí decide: sujeto, encuadre, ángulo, óptica y
   * dirección de la luz.
   */
  estiloFoto:
    "Photorealistic editorial photograph — not an illustration, painting or 3D " +
    "render. Shot on a full-frame camera, prime lens, f/2.0, 1/125s, ISO 2000. " +
    "Low-key lighting: one dominant source, no fill, steep falloff, crushed " +
    "blacks; roughly 70% of the frame sits below mid-grey. Colour grade: split " +
    "tone with amber highlights and cool blue-green shadows, desaturated to " +
    "about 45%, high contrast with clipped shadows. Fine natural film grain, " +
    "slight halation on the brightest highlights. Shallow depth of field. " +
    "No recognisable faces — backs, hands, silhouettes or partial framing only. " +
    "No text, no signage, no logos, no watermarks, no brand marks, no people " +
    "looking at camera. Contemporary Colombian hotel setting. Vertical 4:5 " +
    "aspect ratio, 1080x1350 px. Compose with empty, dark negative space across " +
    "the upper third and the lower third — the subject occupies the middle band " +
    "only, because headline type is laid over the top and bottom.",
} as const;

/**
 * El titular en sándwich, la firma tipográfica de @asignar_sas:
 *
 *     HOY EL MUNDO CELEBRA LA HUMANIDAD   ← ojo, versalitas
 *     Colombia                            ← acento, serif itálica: la emoción
 *     la demuestra cada día               ← remate, sans bold
 *
 * `nota` es la línea fina de abajo — la aclaración o el CTA.
 * `flecha` pinta una → que empuja a seguir deslizando.
 * `pastilla` es el botón de contorno de la portada, como el "Desliza bajo tu
 * propio riesgo" de SOLVO: ancla la vista y da permiso para deslizar.
 */
export type Titular = {
  ojo?: string;
  acento?: string;
  remate?: string;
  nota?: string;
  flecha?: boolean;
  pastilla?: string;
  alineado?: "izquierda" | "centro";
  posicion?: "arriba" | "centro" | "abajo";
  /** `grande` cuando la itálica es el titular principal de la lámina. */
  peso?: "normal" | "grande";
};

export type Bloque =
  | { tipo: "chips"; textos: string[] }
  | { tipo: "figura"; nombre: NombrePieza3D; ancho?: number }
  | { tipo: "circulo"; texto: string }
  | { tipo: "dato"; dato: string; rotulo?: string };

export type Lamina = {
  titular?: Titular;
  bloque?: Bloque;
  foto?: Foto;
};

/**
 * El motor del carrusel es la ANÁFORA: una construcción que se repite con el
 * final cambiado, y una lámina que rompe el patrón.
 *
 * SOLVO lo usa con "WTF es ___" en las siete láminas de su carrusel de
 * vacantes. Coderhouse con "Va a reemplazar ___". Aquí la constante va en el
 * `ojo` en versalitas y la variable en la itálica — así la línea que cambia es
 * justo la que lleva la firma tipográfica de ASIGNAR.
 *
 * Eso es lo que hace que se reconozca sin logo y sin azul: SOLVO no tiene
 * serif itálica en ninguna lámina.
 */
export const LAMINAS: Lamina[] = [
  // 01 — Portada. El gancho.
  {
    foto: {
      archivo: "fotos/01.jpg",
      prompt:
        "An empty hotel corridor before dawn. Patterned carpet receding to a " +
        "vanishing point, warm tungsten wall sconces at 2800K spaced down both " +
        "walls and falling off into darkness, an unattended housekeeping cart " +
        "out of focus at the far end. One-point perspective, camera at chest " +
        "height, dead centre. 35mm lens. Nobody in frame.",
    },
    titular: {
      acento: "nadie aplaude",
      remate: "A QUIEN SOSTIENE EL TURNO",
      peso: "grande",
      posicion: "centro",
      pastilla: "Desliza",
    },
  },

  // 02
  {
    foto: {
      archivo: "fotos/02.jpg",
      prompt:
        "Close crop on a pair of hands smoothing the top sheet of a freshly " +
        "made hotel bed. High three-quarter angle looking down across the bed. " +
        "Hard raking window light from frame left skimming the linen and " +
        "revealing its weave; the rest of the room in deep shadow. 50mm lens, " +
        "focus on the knuckles, headboard falling into bokeh.",
    },
    titular: {
      ojo: "NADIE APLAUDE",
      acento: "a quien dejó la habitación impecable",
      posicion: "centro",
    },
  },

  // 03
  {
    foto: {
      archivo: "fotos/03.jpg",
      prompt:
        "A hotel event hall half set up before dawn: stacked banquet chairs, " +
        "bare round tables, one worker seen from behind carrying a folding " +
        "table. Cold blue pre-dawn daylight through tall windows on the right " +
        "as the only source, interior otherwise unlit. Wide shot, 24mm lens, " +
        "camera low near the floor, the worker small within the room.",
    },
    titular: {
      ojo: "NADIE APLAUDE",
      acento: "a quien montó el salón a las cinco de la mañana",
      posicion: "centro",
    },
  },

  // 04
  {
    foto: {
      archivo: "fotos/04.jpg",
      prompt:
        "Tight shot of hands plating a dish on a stainless steel kitchen pass, " +
        "lit only by orange heat lamps directly overhead at 2400K. Steam " +
        "drifting through the beam, specular highlights on the steel. 85mm " +
        "lens, focus on the plate rim, the brigade behind dissolving into " +
        "dark bokeh.",
    },
    titular: {
      ojo: "NADIE APLAUDE",
      acento: "a quien sirvió doscientos platos sin que se enfriara uno",
      posicion: "centro",
    },
  },

  // 05 — Rompe el patrón. Es el giro del carrusel.
  {
    foto: {
      archivo: "fotos/05.jpg",
      prompt:
        "A person in hotel uniform photographed from behind, standing still in " +
        "a finished, empty lobby before opening. Warm pools of lamp light on " +
        "a polished floor that reflects the figure. Wide shot, 28mm lens, " +
        "camera at eye level, the figure small and centred in a large space.",
    },
    titular: {
      acento: "nosotros sí.",
      remate: "Y QUEDA POR ESCRITO",
      peso: "grande",
      posicion: "centro",
      // Los tres conceptos salen del video de contratación, revisado por
      // Control Interno en agosto de 2026. No agregar nada a esta lista sin
      // volver a consultar.
      nota: "Contrato, seguridad social y prestaciones de ley.",
    },
  },

  // 06 — Cierre.
  {
    foto: {
      archivo: "fotos/06.jpg",
      prompt:
        "A hotel service door standing open at dawn, shot from inside a dark " +
        "interior looking out toward cold blue morning light. Two people " +
        "leaving their shift rendered as full silhouettes in the doorway, " +
        "seen from behind, no features visible. 35mm lens, exposed for the " +
        "exterior so the interior reads as near-black.",
    },
    titular: {
      ojo: "SI ESTÁS BUSCANDO TURNO",
      acento: "hablemos.",
      peso: "grande",
      posicion: "centro",
      nota: "Escríbenos por aquí.",
    },
  },
];
