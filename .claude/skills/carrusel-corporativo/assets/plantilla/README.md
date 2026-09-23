# Carruseles ASIGNAR

Motor de carruseles para Instagram. Las láminas salen en PNG a 1080×1350,
listas para subir o para llevar a Canva.

## Las tres reglas

1. **Máximo 6 láminas.** El export falla si hay más. No es un límite técnico:
   a partir de ahí la gente deja de deslizar.
2. **Una idea por lámina.** Ni listas, ni tarjetas, ni párrafos.
3. **Cero cromo.** Ni logo, ni @, ni página web, ni paginador. Instagram ya
   pone el nombre y la foto de perfil encima del post.

## Para cambiar un texto

Todo vive en **`src/contenido.ts`**. Se edita ahí y se vuelve a exportar:

```bash
npm run exportar
```

Los PNG quedan en `salida/`, numerados `01.png` … `06.png`. Se suben en ese
orden. Para iterar sobre una sola lámina, en segundos:

```bash
node scripts/exportar.mjs --solo 0
```

## Cómo se declara una lámina

```ts
{
  titular: {
    acento: "tienes",              // serif itálica — la firma de la cuenta
    remate: "SEGURIDAD SOCIAL",    // sans bold
    nota: "Se paga de acuerdo al tiempo efectivamente laborado.",
  },
  bloque: { tipo: "chips", textos: ["EPS", "ARL", "AFP", "CCF"] },
}
```

**`titular`** tiene cuatro partes, todas opcionales:

| Campo | Qué es |
|---|---|
| `ojo` | Versalitas pequeñas arriba |
| `acento` | La serif itálica. **Es la firma de ASIGNAR** — sin ella la lámina se siente de otra marca |
| `remate` | El bold grande |
| `nota` | La letra chica al pie: aclaración legal o CTA |
| `flecha` | Pinta una → que empuja a seguir deslizando |

**`bloque`** es el elemento gráfico, opcional:

| Tipo | Qué es |
|---|---|
| `chips` | Etiquetas de papel, una palabra cada una |
| `figura` | Objeto isométrico (contrato, escudo, monedas, firma, calendario…) |
| `circulo` | Círculo de acento con una frase corta |
| `dato` | Una cifra grande |

Una lámina sin bloque es la que respira. Conviene tener al menos una.

## El mundo

`CARRUSEL.mundo` en `contenido.ts` define el fondo de **todas** las láminas.
Que sea uno solo para todo el carrusel es lo que hace que se lea como una pieza.

| Mundo | Qué es | Necesita imágenes |
|---|---|---|
| `foto` | Foto a sangre oscurecida, con semitono y grano | Sí, una por lámina |
| `cielo` | Cielo azul con nubes de semitono | No |
| `noche` | Degradado nocturno con luz azul | No |
| `papel` | Crema editorial | No |
| `estudio` | Degradado claro | No |

Los cuatro últimos se dibujan en código: no dependen de ninguna imagen.

## El flujo cuando el mundo es `foto`

```bash
npm run fotos                      # imprime los prompts, listos para pegar
# generas las imágenes EN ORDEN y las dejas en Descargas
node scripts/fotos.mjs --importar  # las trae y las nombra sola
npm run exportar
```

El prompt de cada lámina vive en `contenido.ts`, junto al texto que va encima.
`CARRUSEL.estiloFoto` se anexa a todos: es el bloque que hace que las seis
imágenes se parezcan entre sí. Sin él salen seis imágenes bonitas que no pegan.

`node scripts/fotos.mjs --estado` dice cuáles faltan. El export también
comprueba antes de empezar, así que nunca vas a esperar un render para
enterarte de que falta una foto.

Si una foto queda muy clara u oscura, se ajusta por lámina con
`oscurecer: 0.55` — es el único número que conviene tocar a mano.


## Dónde está cada cosa

| Archivo | Qué es |
|---|---|
| `src/contenido.ts` | **Todo el texto del carrusel.** Es el archivo del día a día |
| `src/theme.ts` | Colores, tipografías, escala  |
| `src/Mundo.tsx` | El fondo del carrusel: nubes, semitono, grano, duotono de fotos |
| `src/Lamina.tsx` | Cómo se ve cada lámina del carrusel |
| `src/Piezas3D.tsx` | Los objetos isométricos, heredados del video |
| `referencia/estilo.md` | El estilo de la cuenta y de Coderhouse, medido |
| `referencia/calendario.md` | Qué publicar y cuándo: pilares, festivos, tendencias |
| `referencia/hoja_salida.png` | Hoja de contacto del último export |

## Antes de publicar

Mirar `referencia/hoja_salida.png`. El export la arma solo, y es donde saltan
los problemas que en un PNG suelto no se ven: texto sobre una nube, letra chica
ilegible, láminas que se parecen demasiado entre sí.

## Lo que está pendiente

El contenido actual sale del video de contratación, cuyo texto pasó por Control
Interno en agosto de 2026. Las líneas marcadas `[CONTROL INTERNO]` son correcciones
negociadas: no conviene "mejorarlas" sin volver a consultar.

Archivo y Playfair Display son la aproximación más cercana a lo publicado, no
están confirmadas contra un brandbook.
