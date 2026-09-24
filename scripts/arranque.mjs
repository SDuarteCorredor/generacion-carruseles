/**
 * Hook de inicio de sesión (ver .claude/settings.json → hooks.SessionStart).
 *
 * Si en este computador todavía no existe `.local/perfil.md`, le avisa a
 * Claude que tiene que hacer la entrevista de arranque antes de cualquier otra
 * cosa. Si ya existe, no dice nada.
 */
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
if (!existsSync(join(raiz, ".local", "perfil.md"))) {
  console.log(
    "PRIMERA VEZ EN ESTE COMPUTADOR: no existe .local/perfil.md. " +
      "Antes de cualquier otra tarea, haz la entrevista de arranque de " +
      ".context/arranque.md (preguntas en rondas cortas para conocer a la " +
      "persona y la marca). Si el primer mensaje pide otra cosa, saluda, " +
      "explica en una línea que primero son unas preguntas y empieza.",
  );
}
