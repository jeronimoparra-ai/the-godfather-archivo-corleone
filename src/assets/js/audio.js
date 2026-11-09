/* ============================================================
   THE GODFATHER — ARCHIVO CORLEONE
   Módulo de ambientación sonora accesible y progresivo.
   ============================================================ */

const STORAGE_KEY = 'corleone_sound';
const TARGET_VOLUME = 0.18;
const FADE_IN_MS = 1200;
const FADE_OUT_MS = 400;

export const initAudio = () => {
  const button = document.getElementById('audioToggle');
  const audioElement = document.getElementById('bgAudio');
  if (!button || !audioElement) return;

  let fadeTimer = null;

  const cancelFade = () => {
    if (fadeTimer) {
      clearInterval(fadeTimer);
      fadeTimer = null;
    }
  };

  const setButtonState = (isPlaying) => {
    button.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
    const label = isPlaying ? 'Silenciar música de fondo' : 'Activar música de fondo';
    button.setAttribute('aria-label', label);
    button.title = label;
    button.classList.toggle('is-playing', isPlaying);

    const icon = button.querySelector('i');
    if (icon) {
      icon.className = isPlaying ? 'bi bi-volume-up-fill' : 'bi bi-volume-mute';
    }
    const textSpan = button.querySelector('.audio-btn__text');
    if (textSpan) {
      textSpan.textContent = isPlaying ? 'Silenciar' : 'Sonido';
    }
  };

  const disablePlayer = (reason) => {
    cancelFade();
    button.disabled = true;
    button.setAttribute('aria-disabled', 'true');
    button.classList.remove('is-playing');
    button.title = reason || 'Banda sonora no disponible (pista pendiente de archivo)';
    const textSpan = button.querySelector('.audio-btn__text');
    if (textSpan) textSpan.textContent = 'Sin audio';
  };

  // Manejo explícito de error sin emitir excepciones en la consola
  audioElement.addEventListener('error', () => {
    disablePlayer('Banda sonora no disponible. Revisa public/assets/audio/soundtrack.mp3');
  });
  const sourceEl = audioElement.querySelector('source');
  if (sourceEl) {
    sourceEl.addEventListener('error', () => {
      disablePlayer('Banda sonora no disponible. Revisa public/assets/audio/soundtrack.mp3');
    });
  }

  const fadeIn = () => {
    cancelFade();
    audioElement.volume = 0;
    const playPromise = audioElement.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Solo se persiste como activo una vez que el navegador concede la reproducción
          try {
            localStorage.setItem(STORAGE_KEY, 'enabled');
          } catch {
            /* Ignorar fallo de almacenamiento en modo privado */
          }
          setButtonState(true);
          const steps = 24;
          const stepInterval = FADE_IN_MS / steps;
          const volumeIncrement = TARGET_VOLUME / steps;
          let currentStep = 0;

          fadeTimer = setInterval(() => {
            currentStep += 1;
            const newVol = Math.min(TARGET_VOLUME, currentStep * volumeIncrement);
            audioElement.volume = Number(newVol.toFixed(3));
            if (currentStep >= steps) {
              cancelFade();
              audioElement.volume = TARGET_VOLUME;
            }
          }, stepInterval);
        })
        .catch((err) => {
          cancelFade();
          audioElement.pause();
          audioElement.volume = 0;
          setButtonState(false);
          try {
            localStorage.setItem(STORAGE_KEY, 'muted');
          } catch {
            /* Ignorar */
          }
          // Si el bloqueo proviene de la política de autoplay o gesto no confiable (NotAllowedError / AbortError),
          // no deshabilitamos el botón: se mantiene operativo para permitir el reintento con gesto real.
          if (err && err.name !== 'NotAllowedError' && err.name !== 'AbortError') {
            disablePlayer('Banda sonora no disponible (error al reproducir archivo)');
          }
        });
    }
  };

  const fadeOut = () => {
    cancelFade();
    const startVolume = audioElement.volume;
    const steps = 12;
    const stepInterval = FADE_OUT_MS / steps;
    let currentStep = 0;

    fadeTimer = setInterval(() => {
      currentStep += 1;
      const progress = currentStep / steps;
      const newVol = Math.max(0, startVolume * (1 - progress));
      audioElement.volume = Number(newVol.toFixed(3));

      if (currentStep >= steps) {
        cancelFade();
        audioElement.pause();
        audioElement.volume = 0;
        setButtonState(false);
      }
    }, stepInterval);
  };

  const toggleAudio = () => {
    if (button.disabled) return;
    if (audioElement.paused) {
      fadeIn();
    } else {
      try {
        localStorage.setItem(STORAGE_KEY, 'muted');
      } catch {
        /* Ignorar fallo de almacenamiento */
      }
      fadeOut();
    }
  };

  button.addEventListener('click', toggleAudio);

  // Estado inicial siempre pausado (sin autoplay con sonido)
  audioElement.volume = 0;
  setButtonState(false);

  // Verificación preventiva si el archivo 404
  const probeSource = audioElement.querySelector('source');
  const sourceUrl = probeSource ? probeSource.getAttribute('src') : audioElement.getAttribute('src');
  if (sourceUrl) {
    fetch(sourceUrl, { method: 'HEAD' })
      .then((res) => {
        if (!res.ok && res.status === 404) {
          disablePlayer('Banda sonora no disponible (archivo soundtrack.mp3 no encontrado)');
        }
      })
      .catch(() => {
        /* Si falla la petición previa, el listener nativo de error actuará */
      });
  }
};
