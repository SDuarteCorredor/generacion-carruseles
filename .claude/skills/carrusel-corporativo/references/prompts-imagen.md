# Prompts de imagen para ChatGPT

Santiago genera las imágenes en ChatGPT con los prompts que le paso en el chat.

## Reglas

- **Siempre en inglés.** Los generadores están entrenados sobre pies de foto y
  metadatos en inglés. Un prompt en español y descriptivo da una imagen genérica.
- **Siempre con specs técnicos** de fotografía. Primera versión rechazada por
  ser descriptiva y en español.
- **Máximo 5 imágenes por carrusel.**
- Un prompt por lámina, en **un solo bloque de texto** en el chat, numerado,
  listo para copiar. Cada prompt completo y autocontenido (el bloque de estilo
  ya pegado al final), porque se pega uno por uno.

## Anatomía de un prompt (en este orden)

1. **Sujeto y acción** — qué pasa en la imagen.
2. **Encuadre y ángulo** — *one-point perspective, camera at chest height*;
   *high three-quarter angle looking down*; *wide shot, camera low near the floor*.
3. **Óptica y foco** — *24/28/35/50/85mm lens*, y dónde cae el foco.
4. **Luz** — fuente, dirección, temperatura en kelvin, calidad:
   *hard raking window light from frame left*, *heat lamps overhead at 2400K*.
5. **Exposición** — *f/2.0, 1/125s, ISO 2000*.
6. **Grade de color** — *split tone, amber highlights, cool blue-green shadows,
   desaturated to 45%*.
7. **Grano y textura** — *fine natural film grain, slight halation*.
8. **Formato y espacio negativo** — *vertical 4:5, 1080x1350; empty negative
   space where the headline goes* (decir DÓNDE: tercio superior, inferior…).
9. **Exclusiones** — *no text, no signage, no logos, no watermarks, no
   recognisable faces, no people looking at camera*.

Los puntos 5–9 son **iguales en todo el carrusel**: eso es lo que hace que cinco
imágenes generadas por separado se vean como una sola sesión. Los puntos 1–4
cambian por lámina. **Variar la óptica** entre láminas (no todas a 35mm).

## Bloque de estilo aprobado — registro "nadie aplaude" (noir)

```
Photorealistic editorial photograph — not an illustration, painting or 3D render. Shot on a full-frame camera, prime lens, f/2.0, 1/125s, ISO 2000. Low-key lighting: one dominant source, no fill, steep falloff, crushed blacks; roughly 70% of the frame sits below mid-grey. Colour grade: split tone with amber highlights and cool blue-green shadows, desaturated to about 45%, high contrast with clipped shadows. Fine natural film grain, slight halation on the brightest highlights. Shallow depth of field. No recognisable faces — backs, hands, silhouettes or partial framing only. No text, no signage, no logos, no watermarks, no brand marks, no people looking at camera. Contemporary Colombian hotel setting. Vertical 4:5 aspect ratio, 1080x1350 px. Compose with empty, dark negative space across the upper third and the lower third — the subject occupies the middle band only, because headline type is laid over the top and bottom.
```

Dio seis imágenes cohesivas a la primera (15-sep-2026). Para otros registros
(foto emocional de día, bodegón sobre crema) escribir un bloque nuevo con la
misma estructura y agregarlo aquí cuando se apruebe.

## Lo que se aprendió

- **Sin caras reconocibles**: una cara a cámara se lleva la atención del
  titular, y las caras generadas son lo primero que delata que es sintético.
- **Pedir el espacio negativo explícito**: si el generador llena el cuadro, no
  hay dónde poner el texto.
- **Animales**: la pose sola no basta; pedir vestuario/accesorios explícitos
  (*WEARING…*). Aprendido en el intento de meme — el formato meme se descartó,
  pero la lección de prompt sirve.
- ChatGPT entrega **PNG** aunque el archivo se llame distinto; al importar se
  reconvierte con ffmpeg (ya lo hace `scripts/fotos.mjs --importar`).
