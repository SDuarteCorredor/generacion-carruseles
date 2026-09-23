/**
 * Exporta el carrusel a PNG listos para publicar.
 *
 *   node scripts/exportar.mjs            todas las láminas
 *   node scripts/exportar.mjs --solo 0   solo la portada (para iterar rápido)
 *   node scripts/exportar.mjs --sin-hoja no arma la hoja de contacto
 *
 * Empaqueta el proyecto UNA vez y renderiza todas las láminas contra ese
 * mismo bundle. Llamar `npx remotion still` en un bucle vuelve a empaquetar en
 * cada lámina y tarda varios minutos en vez de segundos.
 *
 * Al final verifica el tamaño real de cada PNG. Si Instagram recibe láminas de
 * distinto tamaño recorta todo el carrusel con el de la primera, así que un
 * PNG de tamaño equivocado no es un detalle: arruina la publicación entera.
 */
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import * as esbuild from "esbuild";
import { execFile } from "node:child_process";
import { mkdir, readdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const ejecutar = promisify(execFile);
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SALIDA = path.join(RAIZ, "salida");

const args = process.argv.slice(2);
const soloIdx = args.indexOf("--solo");
const solo = soloIdx >= 0 ? Number(args[soloIdx + 1]) : null;
const sinHoja = args.includes("--sin-hoja");

/**
 * Lee `contenido.ts` sin escribir archivos intermedios: esbuild lo compila en
 * memoria y se importa como módulo de datos. Así el número de láminas sale del
 * contenido real y no de contarlas a mano en dos lugares.
 */
async function leerContenido() {
  const out = await esbuild.build({
    entryPoints: [path.join(RAIZ, "src/contenido.ts")],
    bundle: true,
    format: "esm",
    platform: "node",
    write: false,
    logLevel: "silent",
  });
  const b64 = Buffer.from(out.outputFiles[0].text).toString("base64");
  return import(`data:text/javascript;base64,${b64}`);
}

async function dimensiones(archivo) {
  const { stdout } = await ejecutar("ffprobe", [
    "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "stream=width,height",
    "-of", "csv=p=0",
    archivo,
  ]);
  const [w, h] = stdout.trim().split(",").map(Number);
  return { w, h };
}

const main = async () => {
  const { LAMINAS, CARRUSEL } = await leerContenido();
  const total = LAMINAS.length;

  if (total === 0) throw new Error("contenido.ts no tiene láminas.");
  // Seis es el tope, y no es una limitación técnica: a partir de ahí la gente
  // deja de deslizar. Que el export falle en vez de advertir es deliberado —
  // una advertencia en consola se ignora, un error obliga a decidir qué sobra.
  if (total > 6) {
    throw new Error(
      `El carrusel tiene ${total} láminas y el máximo son 6.\n` +
        `Quita ${total - 6} en src/contenido.ts, o parte el tema en dos publicaciones.`,
    );
  }
  if (solo !== null && (!Number.isInteger(solo) || solo < 0 || solo >= total)) {
    throw new Error(`--solo ${solo} fuera de rango (0 a ${total - 1}).`);
  }

  // Las fotos se comprueban ANTES de empaquetar. Sin esto, una imagen que
  // falta se descubre dentro del navegador headless como un 404 que reintenta
  // varias veces: tarda, y el error que sale no dice qué hacer.
  const sinFoto = LAMINAS.map((l, i) => ({ i, l }))
    .filter(({ l }) => l.foto)
    .filter(({ l }) => !existsSync(path.join(RAIZ, "public", l.foto.archivo)));

  if (sinFoto.length > 0) {
    throw new Error(
      `Faltan ${sinFoto.length} imágenes de fondo:\n` +
        sinFoto
          .map((f) => `  lámina ${f.i + 1} → public/${f.l.foto.archivo}`)
          .join("\n") +
        `\n\nPara ver los prompts:      node scripts/fotos.mjs` +
        `\nPara traerlas de Descargas: node scripts/fotos.mjs --importar`,
    );
  }

  const indices = solo !== null ? [solo] : [...Array(total).keys()];

  // Limpiar la salida completa evita el peor error de este flujo: quitar una
  // lámina de contenido.ts y que el PNG viejo se quede ahí, listo para que
  // alguien lo suba sin darse cuenta.
  if (solo === null) {
    await rm(SALIDA, { recursive: true, force: true });
  }
  await mkdir(SALIDA, { recursive: true });

  process.stdout.write("Empaquetando… ");
  const serveUrl = await bundle({
    entryPoint: path.join(RAIZ, "src/index.ts"),
    onProgress: () => {},
  });
  console.log("listo\n");

  for (const i of indices) {
    const nombre = `${String(i + 1).padStart(2, "0")}.png`;
    const destino = path.join(SALIDA, nombre);
    const inputProps = { indice: i };

    const composition = await selectComposition({
      serveUrl,
      id: "Lamina",
      inputProps,
    });

    await renderStill({
      composition,
      serveUrl,
      output: destino,
      inputProps,
      imageFormat: "png",
      overwrite: true,
    });

    const { w, h } = await dimensiones(destino);
    const ok = w === composition.width && h === composition.height;
    const que = LAMINAS[i].bloque?.tipo ?? "solo titular";
    console.log(`  ${nombre}  ${w}×${h}  ${ok ? "ok" : "TAMAÑO INCORRECTO"}  ${que}`);
    if (!ok) {
      throw new Error(
        `${nombre} salió ${w}×${h} y debía ser ${composition.width}×${composition.height}.`,
      );
    }
  }

  // Hoja de contacto: es la forma barata de ver el carrusel completo antes de
  // publicarlo. Los errores de márgenes y de contraste saltan aquí, no en el
  // PNG suelto.
  if (!sinHoja && solo === null) {
    const columnas = Math.min(3, total);
    const filas = Math.ceil(total / columnas);
    try {
      await ejecutar("ffmpeg", [
        "-v", "error", "-y",
        "-i", path.join(SALIDA, "%02d.png"),
        "-vf", `scale=380:-1,tile=${columnas}x${filas}:margin=10:padding=10:color=0x1A1A1A`,
        "-frames:v", "1",
        path.join(RAIZ, "referencia", "hoja_salida.png"),
      ]);
      console.log("\nHoja de contacto: referencia/hoja_salida.png");
    } catch {
      console.log("\n(no se pudo armar la hoja de contacto; ffmpeg no respondió)");
    }
  }

  const archivos = (await readdir(SALIDA)).filter((f) => f.endsWith(".png"));
  console.log(
    `\n${archivos.length} láminas en salida/ — formato ${CARRUSEL.formato}, mundo ${CARRUSEL.mundo}.` +
      ` Se suben en orden de nombre.`,
  );
};

main().catch((e) => {
  console.error("\n" + e.message);
  process.exit(1);
});
