# Marcas

`nuevo_proyecto.py --marca <nombre>` acepta cualquiera de los presets de aquí, o
`generica` para configurar desde cero.

Todo lo de marca vive en **un solo archivo**: `src/theme.ts`. Cambiar la
identidad completa del video es cambiar ese archivo y volver a renderizar.

---

## Preset: `asignar`

**ASIGNAR SAS** — empresa colombiana de servicios temporales. Provee personal
para hoteles y otros puntos de cliente.

```ts
export const color = {
  primario:  "#007AFE",  // brand kit "ASIGNAR 2026" en Canva
  profundo:  "#00337A",
  medio:     "#0062CC",
  claro:     "#3D9BFF",
  tinte:     "#E4F1FF",
  tinteBorde:"#B8DAFF",
  fondo:     "#F2F8FF",
  blanco:    "#FFFFFF",
  tinta:     "#001934",
  tintaSuave:"#5A7391",
  exito:     "#0E7C5A",
  alerta:    "#B45309",
  peligro:   "#B42318",
};
```

- **Mascota**: DOCA, personaje 3D masculino, camisa blanca con logo azul.
  Narra en primera persona, así que la voz en off debe ser masculina.
- **Voz**: `es-CO-GonzaloNeural`
- **Tipografías**: Montserrat (títulos) + Inter (cuerpo). Aproximación
  profesional, no confirmada contra el brandbook.
- **Recursos**: `G:\Mi unidad\1_Marketing 2026` (logo real) y Canva. La
  biblioteca de íconos oficial es `BIBLIOTECA_ICONOS_ASIGNAR.pptx`.
- **Empresa hermana**: CONEXIÓN OUTSOURCING SAS. Tiene brand kit propio en
  Canva; no mezclar las dos identidades.

---

## Configurar una marca nueva

### 1. Consigue el color primario

En orden de confiabilidad — esto importa, ver `diseno.md`:

1. Brand kit oficial (Canva, Figma)
2. Logo en SVG (el color está en el código)
3. Logo en PNG limpio, muestreando una zona sólida
4. ~~Render 3D o foto~~ — sale sombreado
5. ~~Frame de video o pantallazo~~ — la compresión lo altera

Si hay conector de Canva, `list-brand-kits` devuelve los kits con su miniatura;
la miniatura suele ser el logotipo, y de ahí se muestrea el color exacto.

### 2. Deriva la escala

Del primario salen los demás. Como guía, partiendo de un primario saturado:

| Token | Cómo obtenerlo | Para qué |
|---|---|---|
| `primario` | el de la marca | íconos, acentos, panel |
| `profundo` | ~55% de luminosidad del primario | fondos densos, títulos |
| `medio` | ~80% | degradados |
| `claro` | primario + ~25% de blanco | acentos sobre claro |
| `tinte` | primario + ~90% de blanco | relleno de tarjetas |
| `tinteBorde` | primario + ~72% de blanco | bordes de tarjeta |
| `fondo` | primario + ~96% de blanco | fondo general |
| `tinta` | el navy más oscuro de la marca | texto principal |
| `tintaSuave` | tinta desaturada y aclarada | texto secundario |

Los semánticos (`exito`, `alerta`, `peligro`) pueden quedarse como están salvo
que la marca tenga los suyos. Deben distinguirse claramente del primario.

### 3. Verifica el contraste

El texto sobre fondo tiene que leerse proyectado en una sala, no solo en un
monitor. `tinta` sobre `fondo` debe superar 7:1. `tintaSuave` sobre `fondo`, al
menos 4.5:1 — si queda por debajo, oscurécelo; el texto secundario muy claro es
un problema real en proyección.

### 4. Tipografías

Si el brandbook las define, úsalas. Si no están en Google Fonts, busca la más
cercana que sí esté, y dilo explícitamente al entregar para que nadie asuma que
es la oficial.

Pareja segura cuando no hay nada definido: Montserrat para títulos (geométrica,
funciona bien en bold grande) e Inter para cuerpo (muy legible en tamaños
medios).

### 5. Logo

Si hay SVG, conviértelo a un componente React con `currentColor` en vez de
colores fijos — así se pinta según el fondo donde caiga.

Si solo hay PNG, úsalo con transparencia, pero ten presente que no escala igual
de bien y que no puedes recolorearlo.

**No dibujes el logo a mano.** Una aproximación se nota, y en un video
institucional es un problema serio.
