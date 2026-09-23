"""Crea un proyecto de carrusel listo para trabajar.

Copia la plantilla, ajusta la marca, instala dependencias y deja los scripts
adentro para que el proyecto sea autónomo.

Uso:
    python nuevo_carrusel.py "carrusel-vacaciones"
    python nuevo_carrusel.py "carrusel-vacaciones" --marca asignar
    python nuevo_carrusel.py "carrusel-vacaciones" --en ~/Desktop
    python nuevo_carrusel.py "carrusel-vacaciones" --formato cuadrado
    python nuevo_carrusel.py "carrusel-vacaciones" --sin-instalar
"""
import argparse
import os
import re
import shutil
import subprocess
import sys

# La consola de Windows usa cp1252 por defecto y rompe los acentos.
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass


AQUI = os.path.dirname(os.path.abspath(__file__))
SKILL = os.path.dirname(AQUI)
PLANTILLA = os.path.join(SKILL, "assets", "plantilla")

# Presets. Para agregar uno, copia el bloque y cambia los valores; la guía para
# derivar la escala completa está en references/marcas.md.
MARCAS = {
    "generica": {"handle": "@mi_empresa", "pie": "miempresa.com", "colores": {}},
    "asignar": {
        "handle": "@asignar_sas",
        "pie": "asignar.com.co",
        "colores": {
            "azul": "#007AFE",
            "azulProfundo": "#00337A",
            "azulMedio": "#0062CC",
            "azulClaro": "#3D9BFF",
            "celeste": "#E4F1FF",
            "celesteBorde": "#B8DAFF",
            "fondo": "#F2F8FF",
            "crema": "#EFE6D6",
            "tinta": "#001934",
            "tintaSuave": "#5A7391",
        },
        "nota": (
            "Los colores salen del brand kit ASIGNAR 2026 y están verificados\n"
            "  contra los carruseles ya publicados. Ver references/estilo.md."
        ),
    },
}


def escribir(ruta, texto):
    with open(ruta, "w", encoding="utf-8", newline="\n") as f:
        f.write(texto)


def leer(ruta):
    with open(ruta, encoding="utf-8") as f:
        return f.read()


def aplicar_marca(destino, marca):
    """Reescribe theme.ts y contenido.ts con los valores de la marca."""
    preset = MARCAS[marca]

    if preset["colores"]:
        theme = os.path.join(destino, "src", "theme.ts")
        t = leer(theme)
        for token, valor in preset["colores"].items():
            # Solo el valor: se conserva el comentario que explica cada token.
            t = re.sub(
                rf'(\b{token}:\s*)"#[0-9A-Fa-f]{{3,8}}"',
                rf'\g<1>"{valor}"',
                t,
                count=1,
            )
        escribir(theme, t)

    contenido = os.path.join(destino, "src", "contenido.ts")
    c = leer(contenido)
    c = re.sub(r'(handle:\s*)"[^"]*"', rf'\g<1>"{preset["handle"]}"', c, count=1)
    c = re.sub(r'(pie:\s*)"[^"]*"', rf'\g<1>"{preset["pie"]}"', c, count=1)
    escribir(contenido, c)


def aplicar_formato(destino, formato):
    contenido = os.path.join(destino, "src", "contenido.ts")
    c = leer(contenido)
    c = re.sub(
        r'(formato:\s*)"[^"]*"', rf'\g<1>"{formato}"', c, count=1
    )
    escribir(contenido, c)


def main():
    p = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("nombre", help="nombre de la carpeta del proyecto")
    p.add_argument("--marca", default="asignar", choices=sorted(MARCAS),
                   help="preset de references/marcas.md (por defecto: asignar)")
    p.add_argument("--formato", default="vertical",
                   choices=["vertical", "cuadrado", "historia"],
                   help="vertical = 1080x1350, el recomendado")
    p.add_argument("--en", default=os.getcwd(), help="dónde crearlo")
    p.add_argument("--sin-instalar", action="store_true",
                   help="no correr npm install")
    a = p.parse_args()

    destino = os.path.abspath(os.path.join(os.path.expanduser(a.en), a.nombre))
    if os.path.exists(destino):
        sys.exit(f"Ya existe {destino}. Elige otro nombre o bórralo primero.")
    if not os.path.isdir(PLANTILLA):
        sys.exit(f"No encuentro la plantilla en {PLANTILLA}.")

    shutil.copytree(PLANTILLA, destino,
                    ignore=shutil.ignore_patterns("node_modules", "salida"))
    os.makedirs(os.path.join(destino, "salida"), exist_ok=True)
    os.makedirs(os.path.join(destino, "referencia"), exist_ok=True)
    os.makedirs(os.path.join(destino, "public", "fotos"), exist_ok=True)

    aplicar_marca(destino, a.marca)
    aplicar_formato(destino, a.formato)

    print(f"Proyecto creado en {destino}")
    nota = MARCAS[a.marca].get("nota")
    if nota:
        print(f"  {nota}")

    if a.sin_instalar:
        print("\nFalta instalar dependencias:  npm install")
    else:
        print("\nInstalando dependencias (tarda unos minutos)…")
        r = subprocess.run(["npm", "install", "--no-fund", "--no-audit"],
                           cwd=destino, shell=(os.name == "nt"))
        if r.returncode != 0:
            print("npm install falló. Córrelo a mano dentro de la carpeta.")
            return

    print("\nSiguiente paso: escribir src/contenido.ts y hacerlo aprobar.")
    print("Después:  npm run exportar")


if __name__ == "__main__":
    main()
