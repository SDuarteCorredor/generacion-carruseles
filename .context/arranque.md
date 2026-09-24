# Entrevista de arranque (primera vez en un computador)

Se hace cuando **no existe `.local/perfil.md`**: el repo se acaba de clonar, o
lo abre alguien nuevo. Un hook de inicio (`scripts/arranque.mjs`) lo avisa;
si el aviso no llega, igual se revisa al leer `CLAUDE.md`.

**Va antes que cualquier otra cosa**, aunque el primer mensaje pida un
carrusel: saludar en una línea, decir que primero son unas preguntas cortas
para conocerlo y conocer la marca, y empezar. Si el usuario dice que no quiere
hacerlo ahora, respetarlo, trabajar con lo que haya y volver a proponerlo al
final.

## Cómo preguntar

- **En rondas cortas**, no un cuestionario de 30 preguntas de una vez.
  Tres o cuatro preguntas por ronda. Usar la herramienta de preguntas con
  opciones cuando las respuestas son elegibles (red social, tono, sí/no); texto
  libre cuando no.
- Cada ronda arranca con lo que ya se sabe, para que el usuario confirme en vez
  de repetir.
- **Nada se inventa.** Lo que no sepa queda como `PENDIENTE` y se pregunta
  cuando haga falta.
- Pedir **links y archivos** en vez de descripciones: el brand kit, el logo en
  SVG, 2–3 carruseles propios, 1–2 cuentas que admire. Se analizan, no se
  adivinan (colores del SVG o del brand kit, nunca de un pantallazo).

## Ronda 1 — Quién es

1. Nombre y cómo prefiere que le hable.
2. Rol: ¿es la marca, trabaja en ella (marketing, comunicaciones), o es una
   agencia/freelance con varias marcas?
3. Nivel técnico: ¿quiere ver el proceso o solo el resultado?
4. Con qué genera imágenes (ChatGPT, Gemini, Midjourney, banco de fotos,
   fotos propias) y si usa Canva u otra herramienta para retocar.

## Ronda 2 — La marca

1. ¿Para qué marca es? Si ya existe en `marcas/` (p. ej. `asignar`), confirmar
   que es esa y que los datos siguen vigentes; si no, crearla desde
   `marcas/_plantilla/`.
2. Qué es la marca en una frase: sector, qué vende u ofrece, país y ciudades.
3. Web y cuentas (Instagram, Facebook, LinkedIn, TikTok): links.
4. A quién le habla en cada red. Si IG y LinkedIn tienen audiencias distintas
   (ASIGNAR: trabajador en IG, cliente en LinkedIn), anotarlo desde ya.

## Ronda 3 — Cómo se ve y cómo suena

1. Brand kit o manual de marca (archivo o link). Si no hay: logo en SVG.
2. Colores y tipografías, si los sabe. Lo que no, se saca del brand kit.
3. Tono: tú/usted/vos, formal o cercano, palabras que usa y que nunca usaría.
4. Qué **no** quiere ver nunca (logo en la lámina, fondos oscuros, emojis,
   memes, estilos que le parezcan "hechos con IA").

## Ronda 4 — Referencias y datos

1. 2–3 carruseles propios que le gustaron (y, si hay, uno que no). Se descargan
   y analizan igual que un referente (ver `flujo.md`).
2. 1–2 cuentas que admire por diseño o contenido.
3. Datos que se pueden publicar: años, sedes, clientes, cifras, certificaciones.
   Con fuente. Si no hay, quedan pendientes.
4. Quién aprueba los carruseles y fechas importantes del año (festivos del
   sector, aniversario, campañas).

## Qué se guarda y dónde

| Qué | Dónde | ¿Se sube al repo? |
|---|---|---|
| Quién es, cómo trabaja, herramientas, preferencias | `.local/perfil.md` | No (`.gitignore`) |
| Reglas visuales, colores, fuentes, datos verificados | `marcas/<marca>/marca.md` | Sí |
| Tono y palabras | `marcas/<marca>/tono.md` | Sí |
| Línea de LinkedIn (si aplica) | `marcas/<marca>/linkedin.md` | Sí |
| Pilares y fechas | `marcas/<marca>/calendario.md` | Sí |
| Quién pide y aprueba (nombres, correos) | `marcas/<marca>/personas.md` | No |
| Capturas de referentes | `marcas/<marca>/referentes/` | No |

`.local/perfil.md` se crea **al terminar la entrevista** (aunque queden
pendientes): su existencia es lo que marca que la entrevista ya se hizo.

## Al terminar

Resumir en 5–8 líneas lo que quedó configurado y lo que quedó pendiente, y
proponer el primer paso: "pásame el link del primer referente".
