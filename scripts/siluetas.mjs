/**
 * Convierte una foto a contraluz (persona negra sobre fondo blanco) en una
 * silueta PNG de un color, con transparencia y el contorno real.
 *
 *   node scripts/siluetas.mjs <entrada> <salida.png> [color=#EFE6D6] [huecos=40]
 *
 * color = "original": conserva la foto (grises, manos, pelo) y solo quita el
 * fondo. Es lo que Santiago prefiere (24-sep-2026); usar con huecos=0 para que
 * no aparezcan franjas blancas entre brazo y cuerpo.
 *
 * - El fondo es lo claro conectado con el borde: brillos o líneas dentro de la
 *   figura no lo son, así que se rellenan solos (y marcas de agua desaparecen).
 * - `huecos`: separaciones horizontales menores a N px entre brazo y cuerpo se
 *   rellenan, para que el texto no cruce una rendija de foto.
 * - El PNG sale recortado a la figura; el borde conserva el antialias original.
 */
import { execFileSync } from "node:child_process";

const [entrada, salida, color = "#EFE6D6", huecosArg = "40"] = process.argv.slice(2);
if (!entrada || !salida) {
  console.error("Uso: node scripts/siluetas.mjs <entrada> <salida.png> [color] [huecos]");
  process.exit(1);
}
const huecos = Number(huecosArg);

const [W, H] = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0",
  "-show_entries", "stream=width,height", "-of", "csv=p=0", entrada]).toString().trim().split(",").map(Number);
const gris = execFileSync("ffmpeg", ["-v", "error", "-i", entrada, "-f", "rawvideo", "-pix_fmt", "gray", "-"],
  { maxBuffer: W * H + 1024 });

const UMBRAL = 200;
const fondo = new Uint8Array(W * H);
const pila = [];
const semilla = (i) => { if (!fondo[i] && gris[i] >= UMBRAL) { fondo[i] = 1; pila.push(i); } };
for (let x = 0; x < W; x++) { semilla(x); semilla((H - 1) * W + x); }
for (let y = 0; y < H; y++) { semilla(y * W); semilla(y * W + W - 1); }
while (pila.length) {
  const i = pila.pop(), x = i % W;
  if (x > 0) semilla(i - 1);
  if (x < W - 1) semilla(i + 1);
  if (i >= W) semilla(i - W);
  if (i < W * (H - 1)) semilla(i + W);
}

// Rendijas cerradas (entre brazo y cuerpo): claras pero sin tocar el borde.
// En una foto a contraluz nada del cuerpo llega a este blanco.
for (let i = 0; i < W * H; i++) if (!fondo[i] && gris[i] >= 215) fondo[i] = 1;

// Alfa: dentro de la figura 255; en el fondo, la rampa del gris da el antialias.
const alfa = Buffer.alloc(W * H);
for (let i = 0; i < W * H; i++) {
  alfa[i] = fondo[i] ? Math.max(0, Math.min(255, Math.round((235 - gris[i]) * 255 / 95))) : 255;
}
// Rendijas estrechas entre brazo y cuerpo.
// Solo del hombro para abajo: arriba rellenaría entre mechones y cabeza.
if (huecos > 0) {
  let arriba = 0;
  while (arriba < H && !alfa.subarray(arriba * W, arriba * W + W).some((a) => a > 128)) arriba++;
  for (let y = Math.round(arriba + (H - arriba) * 0.3); y < H; y++) {
    let ultimo = -1;
    for (let x = 0; x < W; x++) {
      if (alfa[y * W + x] > 200) {
        if (ultimo >= 0 && x - ultimo > 1 && x - ultimo <= huecos) alfa.fill(255, y * W + ultimo, y * W + x);
        ultimo = x;
      }
    }
  }
}

let x0 = W, y0 = H, x1 = 0, y1 = 0;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  if (alfa[y * W + x] > 128) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
}
const cw = x1 - x0 + 1, ch = y1 - y0 + 1;

const original = color === "original";
const rgb = original
  ? execFileSync("ffmpeg", ["-v", "error", "-i", entrada, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], { maxBuffer: W * H * 3 + 1024 })
  : null;
const hex = original ? "000000" : color.replace("#", "");
const [r, g, b] = [0, 2, 4].map((k) => parseInt(hex.slice(k, k + 2), 16));
const rgba = Buffer.alloc(cw * ch * 4);
for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
  const o = (y * cw + x) * 4, i = (y + y0) * W + x + x0;
  if (original) {
    // En el borde el píxel se mezcla con el blanco del fondo: se oscurece para
    // que no quede halo claro sobre la foto de atrás.
    for (let c = 0; c < 3; c++) rgba[o + c] = fondo[i] ? 20 : rgb[i * 3 + c];
  } else { rgba[o] = r; rgba[o + 1] = g; rgba[o + 2] = b; }
  rgba[o + 3] = alfa[i];
}
execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgba", "-s", `${cw}x${ch}`,
  "-i", "-", "-frames:v", "1", salida], { input: rgba });
console.log(`${salida}: ${cw}x${ch} (recorte de ${W}x${H} en x=${x0}, y=${y0})`);
