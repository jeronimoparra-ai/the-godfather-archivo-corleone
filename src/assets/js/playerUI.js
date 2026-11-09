/* ==============================================
   The Godfather — Archivo Corleone
   Sistema de Banda Sonora Ambiental
   playerUI.js — Reproductor flotante con disco de vinilo
   ============================================== */

import { audioPlayer, PlayerState } from './audioPlayer.js';

/* --------------------------------------------------
   Plantilla HTML del reproductor flotante
   -------------------------------------------------- */
const PLAYER_TEMPLATE = `
<div
  id="gf-player"
  class="gf-player"
  role="region"
  aria-label="Reproductor de banda sonora — The Godfather"
  aria-live="polite"
>
  <!-- Cabecera compacta siempre visible -->
  <div class="gf-player__header" id="gf-player-header">
    <!-- Disco de vinilo -->
    <div class="gf-player__vinyl-wrap" aria-hidden="true">
      <div class="gf-player__vinyl" id="gf-vinyl">
        <div class="gf-player__vinyl-label">
          <span class="gf-player__vinyl-text">NR</span>
        </div>
        <!-- Surcos decorativos -->
        <div class="gf-player__vinyl-groove gf-player__vinyl-groove--1"></div>
        <div class="gf-player__vinyl-groove gf-player__vinyl-groove--2"></div>
        <div class="gf-player__vinyl-groove gf-player__vinyl-groove--3"></div>
        <!-- Aguja -->
        <div class="gf-player__needle" id="gf-needle"></div>
      </div>
    </div>

    <!-- Info + control de play/pausa principal -->
    <div class="gf-player__info">
      <p class="gf-player__track-name" id="gf-track-name">The Godfather Waltz</p>
      <p class="gf-player__composer">Nino Rota · Original Soundtrack</p>
      <p class="gf-player__status" id="gf-status-text" aria-live="assertive"></p>
    </div>

    <!-- Botones rápidos -->
    <div class="gf-player__quick-controls">
      <!-- Play / Pause -->
      <button
        class="gf-player__btn gf-player__btn--play"
        id="gf-btn-play"
        aria-label="Reproducir banda sonora"
        title="Reproducir / Pausar"
        type="button"
      >
        <i class="bi bi-play-fill" id="gf-play-icon" aria-hidden="true"></i>
      </button>

      <!-- Silencio -->
      <button
        class="gf-player__btn gf-player__btn--mute"
        id="gf-btn-mute"
        aria-label="Activar silencio"
        title="Silenciar / Activar sonido"
        type="button"
      >
        <i class="bi bi-volume-up-fill" id="gf-mute-icon" aria-hidden="true"></i>
      </button>

      <!-- Expandir / Colapsar -->
      <button
        class="gf-player__btn gf-player__btn--expand"
        id="gf-btn-expand"
        aria-label="Expandir reproductor"
        aria-expanded="true"
        aria-controls="gf-player-panel"
        title="Expandir / Minimizar"
        type="button"
      >
        <i class="bi bi-chevron-down" id="gf-expand-icon" aria-hidden="true"></i>
      </button>
    </div>
  </div>

  <!-- Panel expandible -->
  <div class="gf-player__panel" id="gf-player-panel" aria-hidden="false">
    <!-- Control de volumen -->
    <div class="gf-player__volume-row">
      <i class="bi bi-volume-down-fill gf-player__vol-icon" aria-hidden="true"></i>
      <label for="gf-volume-slider" class="visually-hidden">Volumen</label>
      <input
        type="range"
        id="gf-volume-slider"
        class="gf-player__volume-slider"
        min="0"
        max="100"
        value="20"
        step="1"
        aria-label="Control de volumen"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="20"
      >
      <span class="gf-player__vol-pct" id="gf-vol-pct">20%</span>
      <i class="bi bi-volume-up-fill gf-player__vol-icon" aria-hidden="true"></i>
    </div>

    <!-- Indicador de estado de fuente -->
    <div class="gf-player__source-status" id="gf-source-status">
      <i class="bi bi-info-circle-fill me-1" aria-hidden="true"></i>
      <span id="gf-source-msg">Banda sonora no configurada</span>
    </div>

    <!-- Prompt de autoplay bloqueado -->
    <div class="gf-player__autoplay-prompt d-none" id="gf-autoplay-prompt">
      <p class="mb-2">
        <i class="bi bi-music-note-beamed me-1" aria-hidden="true"></i>
        ¿Deseas escuchar la banda sonora?
      </p>
      <button
        type="button"
        class="gf-player__btn-activate"
        id="gf-btn-activate"
        aria-label="Activar reproducción de la banda sonora"
      >
        <i class="bi bi-play-circle-fill me-1" aria-hidden="true"></i>Activar música
      </button>
    </div>
  </div>
</div>
`;

/* --------------------------------------------------
   CSS del reproductor (inyectado en <head>)
   -------------------------------------------------- */
const PLAYER_STYLES = `
/* =============================================
   Reproductor flotante — The Godfather
   ============================================= */
.gf-player {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 1040;
  width: 280px;
  background: linear-gradient(145deg, #191817 0%, #10100F 100%);
  border: 1px solid #3A1118;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,.55), 0 0 0 1px rgba(185,154,88,.15);
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #EAE2D2;
  overflow: hidden;
  transition: box-shadow .3s ease, transform .3s ease;
}
.gf-player:hover {
  box-shadow: 0 12px 40px rgba(0,0,0,.7), 0 0 0 1px rgba(185,154,88,.35);
}
.gf-player::before {
  content: '';
  display: block;
  height: 3px;
  background: linear-gradient(90deg, #3A1118, #B99A58, #3A1118);
}

/* Cabecera */
.gf-player__header {
  display: flex;
  align-items: center;
  gap: .75rem;
  padding: .75rem 1rem;
  cursor: default;
}

/* Disco de vinilo */
.gf-player__vinyl-wrap {
  flex-shrink: 0;
  position: relative;
  width: 54px;
  height: 54px;
}
.gf-player__vinyl {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 50% 50%, #1a1a1a 0%, #0a0a0a 40%, #111 41%, #0d0d0d 55%, #111 56%, #0a0a0a 70%, #111 71%, #0a0a0a 85%, #0d0d0d 100%);
  box-shadow:
    inset 0 0 8px rgba(0,0,0,.9),
    0 2px 8px rgba(0,0,0,.5);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Animación detenida por defecto */
  animation: gfVinylSpin 4s linear infinite;
  animation-play-state: paused;
}
.gf-player__vinyl.is-spinning {
  animation-play-state: running;
}
/* Surcos del vinilo */
.gf-player__vinyl-groove {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,.06);
  pointer-events: none;
}
.gf-player__vinyl-groove--1 { width: 44px; height: 44px; }
.gf-player__vinyl-groove--2 { width: 34px; height: 34px; }
.gf-player__vinyl-groove--3 { width: 24px; height: 24px; }
/* Etiqueta central */
.gf-player__vinyl-label {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: radial-gradient(circle, #B99A58 0%, #8a7040 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  position: relative;
}
.gf-player__vinyl-text {
  font-size: .45rem;
  font-weight: 700;
  color: #10100F;
  letter-spacing: .5px;
  user-select: none;
}
/* Aguja (decorativa) */
.gf-player__needle {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 2px;
  height: 22px;
  background: linear-gradient(180deg, #B99A58 0%, #858078 100%);
  transform-origin: top center;
  transform: rotate(-30deg);
  border-radius: 1px;
  opacity: .9;
  pointer-events: none;
}
.gf-player__vinyl.is-spinning ~ .gf-player__needle {
  /* La aguja no gira con el disco */
}

@keyframes gfVinylSpin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* Respetar prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .gf-player__vinyl,
  .gf-player__vinyl.is-spinning {
    animation: none !important;
  }
}

/* Info de pista */
.gf-player__info {
  flex: 1;
  min-width: 0;
  line-height: 1.3;
}
.gf-player__track-name {
  font-size: .82rem;
  font-weight: 600;
  color: #B99A58;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'Playfair Display', Georgia, serif;
}
.gf-player__composer {
  font-size: .7rem;
  color: #858078;
  margin: .15rem 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.gf-player__status {
  font-size: .66rem;
  color: #858078;
  margin: .2rem 0 0;
  min-height: 1em;
}

/* Botones rápidos */
.gf-player__quick-controls {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: .3rem;
  align-items: center;
}
.gf-player__btn {
  background: transparent;
  border: 1px solid #3A1118;
  color: #B99A58;
  border-radius: 6px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background .2s, color .2s, border-color .2s;
  font-size: .85rem;
  padding: 0;
  line-height: 1;
}
.gf-player__btn:hover {
  background: rgba(185,154,88,.15);
  border-color: #B99A58;
  color: #EAE2D2;
}
.gf-player__btn:focus-visible {
  outline: 2px solid #B99A58;
  outline-offset: 2px;
}
.gf-player__btn--play {
  background: rgba(58,17,24,.6);
  border-color: #B99A58;
  color: #B99A58;
  width: 32px;
  height: 32px;
  font-size: 1rem;
}
.gf-player__btn--play:hover {
  background: rgba(185,154,88,.25);
}
.gf-player__btn--play.is-playing {
  background: rgba(185,154,88,.2);
  border-color: #B99A58;
  color: #EAE2D2;
  box-shadow: 0 0 8px rgba(185,154,88,.3);
}

/* Panel expandible */
.gf-player__panel {
  border-top: 1px solid rgba(58,17,24,.5);
  padding: .75rem 1rem .875rem;
  transition: max-height .3s ease, opacity .3s ease, padding .3s ease;
  max-height: 200px;
  opacity: 1;
  overflow: hidden;
}
.gf-player__panel.is-collapsed {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}

/* Volumen */
.gf-player__volume-row {
  display: flex;
  align-items: center;
  gap: .4rem;
  margin-bottom: .6rem;
}
.gf-player__vol-icon {
  color: #858078;
  font-size: .75rem;
  flex-shrink: 0;
}
.gf-player__vol-pct {
  font-size: .7rem;
  color: #858078;
  min-width: 2.5rem;
  text-align: right;
}
.gf-player__volume-slider {
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(to right, #B99A58 0%, #3A1118 0%);
  outline: none;
  cursor: pointer;
  border: none;
}
.gf-player__volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #B99A58;
  border: 2px solid #10100F;
  box-shadow: 0 0 4px rgba(185,154,88,.5);
  cursor: pointer;
  transition: transform .15s;
}
.gf-player__volume-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #B99A58;
  border: 2px solid #10100F;
  cursor: pointer;
}
.gf-player__volume-slider:focus-visible {
  outline: 2px solid #B99A58;
  outline-offset: 2px;
}
.gf-player__volume-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

/* Estado de fuente */
.gf-player__source-status {
  font-size: .68rem;
  color: #858078;
  text-align: center;
  padding: .35rem .5rem;
  background: rgba(0,0,0,.25);
  border-radius: 6px;
  border: 1px solid rgba(58,17,24,.4);
  line-height: 1.4;
}
.gf-player__source-status.is-ok {
  color: #6a9a6a;
  border-color: rgba(58,120,58,.4);
}
.gf-player__source-status.is-error {
  color: #a05050;
  border-color: rgba(120,30,30,.4);
}
.gf-player__source-status.is-blocked {
  color: #B99A58;
  border-color: rgba(185,154,88,.4);
}

/* Prompt de activación manual */
.gf-player__autoplay-prompt {
  margin-top: .6rem;
  text-align: center;
  font-size: .72rem;
  color: #B99A58;
}
.gf-player__autoplay-prompt p {
  margin-bottom: .4rem;
}
.gf-player__btn-activate {
  background: linear-gradient(135deg, #3A1118, #B99A58);
  border: none;
  color: #10100F;
  font-weight: 700;
  padding: .4rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: .75rem;
  transition: opacity .2s, transform .15s;
  letter-spacing: .5px;
  text-transform: uppercase;
}
.gf-player__btn-activate:hover {
  opacity: .85;
  transform: translateY(-1px);
}
.gf-player__btn-activate:focus-visible {
  outline: 2px solid #B99A58;
  outline-offset: 2px;
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .gf-player {
    width: calc(100vw - 2rem);
    right: 1rem;
    bottom: 1rem;
  }
}
@media (max-width: 375px) {
  .gf-player {
    width: calc(100vw - 1.5rem);
    right: .75rem;
    bottom: .75rem;
  }
  .gf-player__vinyl-wrap { width: 44px; height: 44px; }
  .gf-player__vinyl      { width: 44px; height: 44px; }
}
`;

/* --------------------------------------------------
   Clase principal del reproductor flotante UI
   -------------------------------------------------- */
class PlayerUI {
  constructor() {
    /** @type {HTMLElement|null} */
    this._el = null;
    this._initialized = false;
  }

  /**
   * Monta el reproductor en el DOM e inicializa todos los bindings.
   * Seguro de llamar varias veces.
   */
  mount() {
    if (this._initialized) return;
    this._initialized = true;

    this._injectStyles();
    this._renderDOM();
    this._bindAudioEvents();
    this._bindUIEvents();
    this._restorePrefs();
    this._syncWithPlayer();

    // Iniciar audioPlayer y lanzar autoplay
    audioPlayer.init();
    this._attemptAutoplay();
  }

  /* ------------------------------------------------
     Configuración del DOM
     ------------------------------------------------ */
  _injectStyles() {
    if (document.getElementById('gf-player-styles')) return;
    const style = document.createElement('style');
    style.id = 'gf-player-styles';
    style.textContent = PLAYER_STYLES;
    document.head.appendChild(style);
  }

  _renderDOM() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = PLAYER_TEMPLATE.trim();
    this._el = wrapper.firstChild;
    document.body.appendChild(this._el);
  }

  /* ------------------------------------------------
     Binding de eventos del audioPlayer
     ------------------------------------------------ */
  _bindAudioEvents() {
    audioPlayer.on('statechange', ({ state }) => this._onStateChange(state));
    audioPlayer.on('volumechange', ({ volume, muted }) => this._onVolumeChange(volume, muted));
  }

  /* ------------------------------------------------
     Binding de eventos de la UI
     ------------------------------------------------ */
  _bindUIEvents() {
    // Play / Pause
    document.getElementById('gf-btn-play').addEventListener('click', () => {
      if (audioPlayer.state === PlayerState.BLOCKED ||
          audioPlayer.state === PlayerState.AVAILABLE ||
          audioPlayer.state === PlayerState.PAUSED) {
        audioPlayer.play();
      } else if (audioPlayer.state === PlayerState.PLAYING) {
        audioPlayer.pause();
      }
    });

    // Silencio
    document.getElementById('gf-btn-mute').addEventListener('click', () => {
      audioPlayer.toggleMute();
    });

    // Expandir / Colapsar
    document.getElementById('gf-btn-expand').addEventListener('click', () => {
      audioPlayer.toggleExpanded();
    });

    // Botón de activación manual (prompt de autoplay bloqueado)
    document.getElementById('gf-btn-activate').addEventListener('click', () => {
      audioPlayer.play();
    });

    // Control de volumen
    const slider = document.getElementById('gf-volume-slider');
    slider.addEventListener('input', () => {
      const value = parseInt(slider.value, 10) / 100;
      audioPlayer.setVolume(value);
    });
    // Accesibilidad: también responde a teclado (el range ya lo hace nativamente)
    slider.addEventListener('change', () => {
      const value = parseInt(slider.value, 10) / 100;
      audioPlayer.setVolume(value);
    });

    // Suscribirse a cambios de expanded
    audioPlayer.on('expandedchange', ({ expanded }) => {
      this._applyExpanded(expanded);
    });
    audioPlayer.on('mutedchange', ({ muted }) => {
      this._applyMuted(muted);
    });
  }

  /* ------------------------------------------------
     Sincronización del estado inicial
     ------------------------------------------------ */
  _restorePrefs() {
    // Volumen
    const vol = Math.round(audioPlayer.volume * 100);
    const slider = document.getElementById('gf-volume-slider');
    slider.value = vol;
    slider.setAttribute('aria-valuenow', vol);
    this._updateSliderFill(vol);
    document.getElementById('gf-vol-pct').textContent = `${vol}%`;

    // Muted
    this._applyMuted(audioPlayer.muted);

    // Expanded
    this._applyExpanded(audioPlayer.expanded);
  }

  _syncWithPlayer() {
    this._onStateChange(audioPlayer.state);
  }

  /* ------------------------------------------------
     Handlers de cambio de estado
     ------------------------------------------------ */
  _onStateChange(state) {
    const playBtn   = document.getElementById('gf-btn-play');
    const playIcon  = document.getElementById('gf-play-icon');
    const vinyl     = document.getElementById('gf-vinyl');
    const statusTxt = document.getElementById('gf-status-text');
    const srcStatus = document.getElementById('gf-source-status');
    const srcMsg    = document.getElementById('gf-source-msg');
    const prompt    = document.getElementById('gf-autoplay-prompt');

    // Reset clases de estado
    srcStatus.classList.remove('is-ok', 'is-error', 'is-blocked');
    prompt.classList.add('d-none');
    prompt.setAttribute('aria-hidden', 'true');

    switch (state) {
      case PlayerState.PLAYING:
        playIcon.className        = 'bi bi-pause-fill';
        playBtn.setAttribute('aria-label', 'Pausar banda sonora');
        playBtn.classList.add('is-playing');
        vinyl.classList.add('is-spinning');
        statusTxt.textContent     = '♪ Reproduciendo';
        srcStatus.classList.add('is-ok');
        srcMsg.textContent        = 'Banda sonora activa';
        break;

      case PlayerState.PAUSED:
        playIcon.className        = 'bi bi-play-fill';
        playBtn.setAttribute('aria-label', 'Reproducir banda sonora');
        playBtn.classList.remove('is-playing');
        vinyl.classList.remove('is-spinning');
        statusTxt.textContent     = 'Pausado';
        srcStatus.classList.add('is-ok');
        srcMsg.textContent        = 'Banda sonora disponible';
        break;

      case PlayerState.BLOCKED:
        playIcon.className        = 'bi bi-play-fill';
        playBtn.setAttribute('aria-label', 'Reproducir banda sonora');
        playBtn.classList.remove('is-playing');
        vinyl.classList.remove('is-spinning');
        statusTxt.textContent     = '';
        srcStatus.classList.add('is-blocked');
        srcMsg.textContent        = 'Clic para activar música';
        prompt.classList.remove('d-none');
        prompt.setAttribute('aria-hidden', 'false');
        break;

      case PlayerState.LOADING:
        playIcon.className        = 'bi bi-hourglass-split';
        playBtn.setAttribute('aria-label', 'Cargando...');
        playBtn.classList.remove('is-playing');
        vinyl.classList.remove('is-spinning');
        statusTxt.textContent     = 'Cargando…';
        srcMsg.textContent        = 'Cargando banda sonora…';
        break;

      case PlayerState.AVAILABLE:
        playIcon.className        = 'bi bi-play-fill';
        playBtn.setAttribute('aria-label', 'Reproducir banda sonora');
        playBtn.classList.remove('is-playing');
        vinyl.classList.remove('is-spinning');
        statusTxt.textContent     = 'Listo';
        srcStatus.classList.add('is-ok');
        srcMsg.textContent        = 'Banda sonora disponible';
        break;

      case PlayerState.NO_SOURCE:
        playIcon.className        = 'bi bi-music-note-beamed';
        playBtn.setAttribute('aria-label', 'Sin fuente de audio');
        playBtn.classList.remove('is-playing');
        vinyl.classList.remove('is-spinning');
        statusTxt.textContent     = '';
        srcMsg.textContent        = 'Fuente no configurada — ver instrucciones';
        break;

      case PlayerState.ERROR:
        playIcon.className        = 'bi bi-exclamation-triangle-fill';
        playBtn.setAttribute('aria-label', 'Error en la reproducción');
        playBtn.classList.remove('is-playing');
        vinyl.classList.remove('is-spinning');
        statusTxt.textContent     = 'Error de audio';
        srcStatus.classList.add('is-error');
        srcMsg.textContent        = 'No se pudo cargar la fuente de audio';
        break;

      default:
        break;
    }
  }

  _onVolumeChange(volume, muted) {
    const vol    = Math.round(volume * 100);
    const slider = document.getElementById('gf-volume-slider');
    slider.value = vol;
    slider.setAttribute('aria-valuenow', vol);
    this._updateSliderFill(vol);
    document.getElementById('gf-vol-pct').textContent = `${vol}%`;
    this._applyMuted(muted);
  }

  /* ------------------------------------------------
     Helpers de UI
     ------------------------------------------------ */
  _applyExpanded(expanded) {
    const panel     = document.getElementById('gf-player-panel');
    const expandBtn = document.getElementById('gf-btn-expand');
    const icon      = document.getElementById('gf-expand-icon');

    if (expanded) {
      panel.classList.remove('is-collapsed');
      panel.setAttribute('aria-hidden', 'false');
      icon.className = 'bi bi-chevron-down';
      expandBtn.setAttribute('aria-label', 'Minimizar reproductor');
      expandBtn.setAttribute('aria-expanded', 'true');
    } else {
      panel.classList.add('is-collapsed');
      panel.setAttribute('aria-hidden', 'true');
      icon.className = 'bi bi-chevron-up';
      expandBtn.setAttribute('aria-label', 'Expandir reproductor');
      expandBtn.setAttribute('aria-expanded', 'false');
    }
  }

  _applyMuted(muted) {
    const muteBtn  = document.getElementById('gf-btn-mute');
    const muteIcon = document.getElementById('gf-mute-icon');
    if (muted) {
      muteIcon.className = 'bi bi-volume-mute-fill';
      muteBtn.setAttribute('aria-label', 'Activar sonido');
      muteBtn.style.color = '#858078';
    } else {
      muteIcon.className = 'bi bi-volume-up-fill';
      muteBtn.setAttribute('aria-label', 'Silenciar');
      muteBtn.style.color = '';
    }
  }

  /**
   * Actualiza el degradado de fondo del slider para indicar el nivel.
   * @param {number} pct — 0..100
   */
  _updateSliderFill(pct) {
    const slider = document.getElementById('gf-volume-slider');
    if (slider) {
      slider.style.background =
        `linear-gradient(to right, #B99A58 ${pct}%, #3A1118 ${pct}%)`;
    }
  }

  /* ------------------------------------------------
     Autoplay inicial
     ------------------------------------------------ */
  async _attemptAutoplay() {
    // Solo intentar si hay fuente configurada
    if (!audioPlayer.hasSource) return;

    // Pequeño retardo para que la página cargue, mejorando UX
    await new Promise(resolve => setTimeout(resolve, 600));
    await audioPlayer.play();
  }
}

/* --------------------------------------------------
   Exportación de instancia única
   -------------------------------------------------- */
export const playerUI = new PlayerUI();
