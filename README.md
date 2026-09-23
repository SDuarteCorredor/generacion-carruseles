# Generación de Carruseles

Espacio de trabajo para [Claude Code](https://claude.com/claude-code) que produce
carruseles y posts estáticos de Instagram, Facebook y LinkedIn, listos para
publicar, para una o varias marcas.

El flujo: le pasas a Claude el link de un carrusel de referencia → lo analiza,
extrae el gancho y lo adapta a tu marca → te entrega en el chat el guion y los
prompts de imagen para ChatGPT → generas las fotos y las dejas en la carpeta del
carrusel → Claude arma el diseño final en Claude Design (`/design`) y exporta
los PNG a 1080×1350.

## Instalar en un computador nuevo

Requisitos: [Claude Code](https://claude.com/claude-code), [Node.js](https://nodejs.org) 20 o más,
[ffmpeg](https://ffmpeg.org) y [Git](https://git-scm.com).

```bash
git clone https://github.com/SDuarteCorredor/generacion-carruseles.git
cd generacion-carruseles
npm install
```

Abre Claude Code en esa carpeta. El `CLAUDE.md` y la skill de `.claude/skills/`
cargan solos: no hay que configurar nada más.

La primera exportación descarga un Chrome sin interfaz (~113 MB) que el motor
usa para renderizar. Es automático.

## Usarlo

- **Carrusel nuevo:** "Carrusel para <marca> con este referente: <link>".
- **Marca nueva:** "Quiero configurar una marca nueva". Claude copia
  `marcas/_plantilla/` y te pregunta lo necesario antes del primer carrusel.
- **Carrusel final:** cuando las fotos estén en `marcas/<marca>/carruseles/<carpeta>/fotos/`,
  escribe `/design`.

## Qué hay aquí

| Carpeta | Qué es |
|---|---|
| `CLAUDE.md` | Instrucciones que Claude lee al abrir la carpeta |
| `.context/` | Conocimiento común: flujo, cómo adaptar referentes, prompts de imagen, captions, lecciones técnicas |
| `.claude/` | Skill `carrusel-corporativo` y permisos |
| `marcas/<marca>/` | Todo lo de cada marca: reglas, LinkedIn, calendario, carruseles aprobados y producidos |
| `marcas/_plantilla/` | Punto de partida para una marca nueva |
| `src/`, `scripts/` | Motor Remotion de respaldo (ver `MOTOR.md`) |

## Qué no está en el repo

Por privacidad y derechos de autor, estas carpetas existen solo en el
computador donde se trabajan y están en `.gitignore`:

- `marcas/*/referentes/` — capturas de publicaciones de otras cuentas usadas como referencia.
- `marcas/*/personas.md` — nombres y correos de quién pide y aprueba.
- `_archivo/` — material descartado.

En un computador nuevo esas carpetas empiezan vacías. Los referentes se vuelven
a descargar cuando se necesitan; `personas.md` se recrea a mano si hace falta.

## Licencia

El código, las instrucciones (`CLAUDE.md`, `.context/`, la skill) y la plantilla
de marca están bajo licencia [MIT](LICENSE): puedes usarlos, modificarlos y
usarlos en proyectos comerciales conservando el aviso de autoría.

El material de cada marca en `marcas/<marca>/` —logos, fotos, textos y
carruseles producidos— pertenece a su marca y **no** entra en la licencia MIT.
Está en el repositorio como ejemplo de uso, no para reutilizarlo.
