import { Config } from "@remotion/cli/config";

// PNG, no JPEG: el carrusel es casi todo tipografía y bordes duros, y el
// artefacto de JPEG se ve justo en el filo de las letras.
Config.setVideoImageFormat("png");
Config.setStillImageFormat("png");
Config.setOverwriteOutput(true);

// Escala 1: el lienzo ya es 1080x1350, que es el tamaño de entrega.
Config.setScale(1);
