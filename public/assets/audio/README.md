# Instrucciones de la Banda Sonora — Archivo Corleone

Este directorio (`public/assets/audio/`) aloja la pista musical ambiental que acompaña la experiencia cinematográfica interactiva de **The Godfather — Archivo Corleone**.

---

## 1. Archivo esperado

- **Ruta de destino:** `public/assets/audio/soundtrack.mp3`
- **Pista actual instalada:** Pista ambiental rústica en vals menor, generada algorítmicamente mediante síntesis aditiva en Python y `ffmpeg` (MP3 mono 128 kbps, 18 s loop continuo) bajo licencia **Creative Commons Zero 1.0 (CC0)** / Dominio Público.
- **Propósito:** Actuar como marcador de posición funcional (*placeholder*) libre de derechos que permite comprobar la funcionalidad del reproductor web sin utilizar música protegida de Nino Rota o Paramount Pictures.
- **Registro unificado:** Consulta la ficha completa en [`public/assets/images/CREDITS.md`](../images/CREDITS.md).

---

## 2. Reemplazo de la pista por el usuario

Para incorporar tu propia pista o una grabación que cuente con licencia de uso (por ejemplo, interpretaciones con licencia Creative Commons, material libre de regalías o grabación original autorizada):

1. Nombra el archivo de audio exactamente como `soundtrack.mp3`.
2. Colócalo dentro de `public/assets/audio/soundtrack.mp3` reemplazando el archivo actual.
3. El reproductor integrado (`src/assets/js/audio.js`) tomará automáticamente la nueva pista sin necesidad de recompilar ni alterar el código fuente.

### Especificaciones recomendadas
- **Formato:** MP3 (MPEG Audio Layer 3), CBR o VBR.
- **Tasa de muestreo:** 44.1 kHz o 48 kHz, estéreo o mono.
- **Bitrate:** 128 kbps a 192 kbps (peso óptimo para transferencia web).
- **Normalización:** Volumen integrado a -14 LUFS o -16 LUFS. El reproductor web aplica automáticamente un *fade-in* suave de 1.2 segundos hasta un volumen sutil del 18% (`0.18`) para que funcione como música de fondo sin perturbar la lectura.
- **Bucle:** El elemento `<audio>` tiene activado el atributo `loop`.

---

## 3. Política de reproducción y accesibilidad

- **Sin reproducción automática (No Autoplay):** El audio jamás se reproduce sin una interacción explícita del visitante (clic en el botón de la barra de navegación).
- **Manejo de contingencia:** Si el archivo no existe o ocurre un error de red, el botón de sonido se deshabilita automáticamente con un mensaje informativo y sin emitir advertencias en la consola del navegador.
- **Persistencia de preferencia:** La elección del usuario se conserva en `localStorage` con la clave `corleone_sound`.
- **Independencia de preferencias:** La preferencia del sistema `prefers-reduced-motion` no desactiva el sonido, respetando que el movimiento visual y el audio son canales sensoriales distintos.
