/**
 * El puente entre el contenido y las imágenes de fondo.
 *
 *   node scripts/fotos.mjs              imprime los prompts, listos para pegar
 *   node scripts/fotos.mjs --importar   trae las imágenes desde Descargas
 *   node scripts/fotos.mjs --estado     qué fotos faltan
 *
 * El flujo es: se escribe el contenido con su `prompt` por lámina, se imprimen,
 * se generan las imágenes afuera, y se importan. El prompt queda guardado en
 * `contenido.ts`, así que dentro de seis meses se puede repetir el look sin
 * adivinar con qué se hizo.
 *
 * La importación mapea por ORDEN DE CREACIÓN: la imagen más vieja de Descargas
 * va a la lámina 1, la siguiente a la 2, y así. Es lo que corresponde si se
 * generan en orden, que es como se generan. Siempre imprime el mapeo antes de
 * copiar nada para que un orden equivocado se vea de inmediato y no aparezca
 * recién en el render.
 */
import * as esbuild from "esbuild";
import { execFile } from "node:child_process";
import { mkdir, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const ejecutar = promisify(execFile);

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLICO = path.join(RAIZ, "public");

const args = process.argv.slice(2);
const importar = args.includes("--importar");
const estado = args.includes("--estado");

const EXTENSIONES = [".jpg", ".jpeg", ".png", ".webp"];

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

/** Descargas, en español o en inglés según cómo esté el Windows. */
function carpetaDescargas() {
  const casa = os.homedir();
  for (const nombre of ["Downloads", "Descargas"]) {
    const p = path.join(casa, nombre);
    if (existsSync(p)) return p;
  }
  return null;
}

const main = async () => {
  const { LAMINAS, CARRUSEL } = await leerContenido();

  const conFoto = LAMINAS.map((l, i) => ({ i, l })).filter(({ l }) => l.foto);

  if (conFoto.length === 0) {
    console.log(
      `Este carrusel no usa fotos (mundo "${CARRUSEL.mundo}"): el fondo se dibuja en código.`,
    );
    return;
  }

  // ---- Estado -------------------------------------------------------------
  const falta = [];
  for (const { i, l } of conFoto) {
    const destino = path.join(PUBLICO, l.foto.archivo);
    if (!existsSync(destino)) falta.push({ i, archivo: l.foto.archivo });
  }

  if (estado) {
    console.log(
      falta.length === 0
        ? `Las ${conFoto.length} fotos están en public/. Puedes exportar.`
        : `Faltan ${falta.length} de ${conFoto.length}:\n` +
            falta.map((f) => `  lámina ${f.i + 1} → public/${f.archivo}`).join("\n"),
    );
    return;
  }

  // ---- Importar -----------------------------------------------------------
  if (importar) {
    const descargas = carpetaDescargas();
    if (!descargas) {
      throw new Error(
        "No encuentro la carpeta de Descargas. Copia las imágenes a mano a public/fotos/.",
      );
    }

    const archivos = [];
    for (const nombre of await readdir(descargas)) {
      if (!EXTENSIONES.includes(path.extname(nombre).toLowerCase())) continue;
      const completo = path.join(descargas, nombre);
      const s = await stat(completo);
      if (!s.isFile()) continue;
      archivos.push({ nombre, completo, t: s.mtimeMs });
    }

    if (archivos.length < conFoto.length) {
      throw new Error(
        `El carrusel necesita ${conFoto.length} imágenes y en Descargas hay ${archivos.length}.`,
      );
    }

    // Las N más recientes, después ordenadas de más vieja a más nueva: así la
    // primera que se generó es la lámina 1.
    const elegidas = archivos
      .sort((a, b) => b.t - a.t)
      .slice(0, conFoto.length)
      .sort((a, b) => a.t - b.t);

    console.log("Mapeo (la más vieja va a la lámina 1):\n");
    for (let k = 0; k < conFoto.length; k++) {
      const { i, l } = conFoto[k];
      console.log(
        `  lámina ${i + 1}  ${elegidas[k].nombre}  →  public/${l.foto.archivo}`,
      );
    }

    // ChatGPT exporta PNG con la extensión que sea. Un PNG guardado como
    // ".jpg" abre bien en casi cualquier visor —que ignora la extensión y lee
    // los bytes— pero rompe ffmpeg/ffprobe, que confían en la extensión. Se
    // reconvierte siempre con ffmpeg, así el archivo en disco es de verdad lo
    // que dice ser, sin importar qué formato haya entregado el generador.
    for (let k = 0; k < conFoto.length; k++) {
      const { l } = conFoto[k];
      const destino = path.join(PUBLICO, l.foto.archivo);
      await mkdir(path.dirname(destino), { recursive: true });
      const args = [
        "-v", "error", "-y",
        "-i", elegidas[k].completo,
      ];
      if ([".jpg", ".jpeg"].includes(path.extname(destino).toLowerCase())) {
        args.push("-q:v", "2"); // calidad JPEG alta, no el default mediocre
      }
      args.push(destino);
      await ejecutar("ffmpeg", args);
    }

    console.log(`\n${conFoto.length} imágenes copiadas. Ya puedes: npm run exportar`);
    console.log("Si alguna quedó en la lámina equivocada, cámbialas en public/fotos/.");
    return;
  }

  // ---- Imprimir prompts ---------------------------------------------------
  console.log(
    `${conFoto.length} imágenes para generar.\n` +
      `Genéralas EN ORDEN y déjalas en Descargas; después: node scripts/fotos.mjs --importar\n`,
  );

  for (const { i, l } of conFoto) {
    const marca = existsSync(path.join(PUBLICO, l.foto.archivo)) ? " (ya está)" : "";
    console.log(`\n${"─".repeat(72)}`);
    console.log(`LÁMINA ${i + 1} → public/${l.foto.archivo}${marca}`);
    if (l.titular?.acento || l.titular?.remate) {
      const t = [l.titular.ojo, l.titular.acento, l.titular.remate]
        .filter(Boolean)
        .join(" / ");
      console.log(`Texto que va encima: ${t}`);
    }
    console.log(`${"─".repeat(72)}`);
    console.log(`${l.foto.prompt} ${CARRUSEL.estiloFoto}`);
  }

  console.log(`\n${"─".repeat(72)}`);
  console.log(
    "El bloque de estilo va anexado a cada prompt a propósito: es lo que hace",
  );
  console.log("que las imágenes se parezcan entre sí y el carrusel se lea como una pieza.");
};

main().catch((e) => {
  console.error("\n" + e.message);
  process.exit(1);
});
