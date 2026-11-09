# Créditos y Atribución de Recursos — Archivo Corleone

Este documento detalla la procedencia, autores, términos de licencia y métodos de verificación de todos los recursos audiovisuales (fotografía, texturas y sonido) incorporados en **The Godfather — Archivo Corleone** (Evidencia 21).

> **Aseguramiento de derechos de autor y propiedad intelectual:**
> - **Sin fotogramas de la película:** Ninguna de las imágenes de la galería corresponde a capturas de pantalla, fotogramas protegidos ni material promocional de la película de 1972 (Paramount Pictures).
> - **Contenido temático:** Las piezas son fotografías contemporáneas e históricas de archivo curadas para evocar la atmósfera del universo de la obra (Nueva York de posguerra, Sicilia, interiores de cine negro y claroscuros).
> - **Licencia libre verificable:** Todas las fotografías provienen del repositorio libre de Unsplash bajo la [Licencia Unsplash](https://unsplash.com/license) (que autoriza el uso comercial, académico y la modificación sin costo ni restricciones de derechos). Los activos de origen responden con código HTTP 200 en sus URLs canónicas de CDN.

---

## 1. Galería Cinematográfica (`public/assets/images/gallery/`)

| Archivo | Título editorial | Descripción visual (para auditoría humana) | Fotógrafo | Licencia | URL canónica verificable (HTTP 200) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `01-manhattan-nocturno.webp` | Little Italy y bajo Manhattan | Perspectiva nocturna de arquitectura urbana clásica neoyorquina con luces tenues. | Florian Wehde | [Unsplash License](https://unsplash.com/license) | `https://images.unsplash.com/photo-1514565131-fce0801e5785` |
| `02-campina-siciliana.webp` | Campiña y refugio en Sicilia | Paisaje rural mediterráneo con colinas secas, muros de piedra y vegetación rústica. | Jack Ward | [Unsplash License](https://unsplash.com/license) | `https://images.unsplash.com/photo-1516483638261-f4dbaf036963` |
| `03-despacho-claroscuro.webp` | El despacho familiar | Interior de despacho clásico en penumbra con escritorio de madera y lámpara cálida. | Federica Galli | [Unsplash License](https://unsplash.com/license) | `https://images.unsplash.com/photo-1541123437800-1bb1317badc2` |
| `04-coche-clasico-lluvia.webp` | Sedán clásico de época | Automóvil clásico de los años 40 aparcado sobre asfalto mojado bajo la lluvia. | Stefan Rodriguez | [Unsplash License](https://unsplash.com/license) | `https://images.unsplash.com/photo-1552519507-da3b142c6e3d` |
| `05-telefono-vintage.webp` | Llamada confidencial | Teléfono negro de disco de baquelita en primer plano sobre mesa oscura. | Pavan Trikutam | [Unsplash License](https://unsplash.com/license) | `https://images.unsplash.com/photo-1520923642038-b4259acecbd7` |
| `06-trattoria-bodega.webp` | Bodega y cena privada | Mesa de taberna con copas de vino tinto y barricas de roble en atmósfera de bodega. | Hermes Rivera | [Unsplash License](https://unsplash.com/license) | `https://images.unsplash.com/photo-1510812431401-41d2bd2722f3` |
| `07-maquina-escribir.webp` | Expedientes del consiglieri | Teclas circulares metálicas de máquina de escribir mecánica sobre papel impreso. | Patrick Fore | [Unsplash License](https://unsplash.com/license) | `https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50` |
| `08-catedral-cirios.webp` | Bautismo y juramento solemne | Hileras de velas y cirios encendidos ante las arcadas de piedra de una basílica histórica. | Grant Whitty | [Unsplash License](https://unsplash.com/license) | `https://images.unsplash.com/photo-1519817650390-64a93db51149` |
| `09-muelles-niebla.webp` | Muelles del puerto industrial | Grúas y almacenes portuarios cubiertos de niebla matinal junto al río. | Maxime Gilbert | [Unsplash License](https://unsplash.com/license) | `https://images.unsplash.com/photo-1509440159596-0249088772ff` |
| `10-copas-brindis.webp` | El brindis de respeto | Vaso bajo de cristal tallado con licor ámbar reflejando luz sobre mesa de caoba. | Kobby Mendez | [Unsplash License](https://unsplash.com/license) | `https://images.unsplash.com/photo-1527061011665-3652c757a4d4` |

*Formato técnico:* Cada ítem incluye su versión moderna **WebP** y su respaldo **JPG**, procesados a **900 × 600 px** (proporción 3:2) con un peso unitario menor a 165 KB para garantizar rendimiento y tiempo de carga óptimo.

---

## 2. Fondos y Texturas (`public/assets/images/backdrops/`)

1. **`film-grain.svg`**: Grano cinematográfico de 35 mm modelado mediante filtros procedurales SVG (`feTurbulence` fractal a `0.85` y `feColorMatrix` con opacidad sutil). Licencia MIT.
2. **`dark-marble.webp` / `dark-marble.jpg`**: Textura de mármol negro con vetas minerales borgoña y doradas generada algorítmicamente (1440 × 900 px, 4 KB en WebP). Licencia MIT.
3. **`vintage-paper.webp` / `vintage-paper.jpg`**: Textura de papel de archivo antiguo con microfibras y viñeta perimetral de sombra (1440 × 900 px, 3 KB en WebP). Licencia MIT.

---

## 3. Retratos de Personajes (`public/assets/images/characters/`)

Los siete retratos de personajes (`vito-corleone.jpg`, `michael-corleone.jpg`, `sonny-corleone.jpg`, `tom-hagen.jpg`, `kay-adams.jpg`, `fredo-corleone.jpg`, `connie-corleone.jpg`) corresponden a los activos preexistentes del proyecto original requeridos para las pruebas académicas de la Evidencia 21.

---

## 4. Trazabilidad del Audio (`public/assets/audio/soundtrack.mp3`)

- **Procedencia:** Pista instrumental ambiental original generada algorítmicamente en Python mediante síntesis aditiva (frecuencias senoidales armónicas simulando cuerda pulsada acústica en compás de vals 3/4 en tonalidad de La menor) y codificada con `ffmpeg` a MP3 CBR mono (128 kbps, 44.1 kHz, 18 segundos en bucle cerrado continuo).
- **Licencia:** **Creative Commons Zero 1.0 Universal (CC0)** / Dominio Público.
- **Propósito:** Actuar como marcador de posición (*placeholder*) demostrable, funcional y 100% libre de derechos de autor para evitar cualquier infracción de las obras protegidas de Nino Rota o Paramount Pictures.
- **Reemplazo:** Los instructores, evaluadores o usuarios pueden colocar cualquier archivo MP3 con licencia propia directamente en `public/assets/audio/soundtrack.mp3` conforme a la guía descrita en [`public/assets/audio/README.md`](../audio/README.md).
