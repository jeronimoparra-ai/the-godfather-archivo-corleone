/* ==============================================
   The Godfather — Archivo Corleone
   Sistema de Banda Sonora Ambiental
   audioPlayer.js — Módulo principal de reproducción
   ============================================== */

/**
 * Estados posibles del reproductor.
 * @enum {string}
 */
export const PlayerState = {
  LOADING:        'loading',        // Cargando fuente de audio
  AVAILABLE:      'available',      // Fuente disponible, sin reproducir
  PLAYING:        'playing',        // Reproduciendo
  PAUSED:         'paused',         // Pausado por el usuario
  BLOCKED:        'blocked',        // Bloqueado por política de autoplay
  NO_SOURCE:      'no_source',      // No hay fuente configurada
  ERROR:          'error',          // Error de reproducción
};

/**
 * Clave de sessionStorage para persistir preferencias del reproductor.
 * @const {string}
 */
const SESSION_KEY = 'gf_player_prefs';

/**
 * Preferencias por defecto.
 * @const {object}
 */
const DEFAULT_PREFS = {
  volume:   0.2,    // 20 % inicial
  muted:    false,
  expanded: true,   // Reproductor visible por defecto
  enabled:  true,   // El usuario quiere escuchar música
};

/* --------------------------------------------------
   AudioPlayerCore — instancia única de HTMLAudioElement
   -------------------------------------------------- */
class AudioPlayerCore {
  constructor() {
    /** @type {HTMLAudioElement|null} */
    this._audio = null;

    /** @type {PlayerState} */
    this._state = PlayerState.NO_SOURCE;

    /** @type {object} */
    this._prefs = this._loadPrefs();

    /** @type {string|null} */
    this._sourceUrl = null;

    /** @type {Set<Function>} */
    this._listeners = new Map();

    /** @type {boolean} Evita inicializaciones duplicadas */
    this._initialized = false;
  }

  /* ------------------------------------------------
     Getters públicos
     ------------------------------------------------ */

  get state()    { return this._state; }
  get volume()   { return this._prefs.volume; }
  get muted()    { return this._prefs.muted; }
  get expanded() { return this._prefs.expanded; }
  get enabled()  { return this._prefs.enabled; }
  get hasSource(){ return Boolean(this._sourceUrl); }

  /* ------------------------------------------------
     Inicialización
     ------------------------------------------------ */

  /**
   * Inicializa el reproductor.
   * Seguro de llamar varias veces: solo ejecuta la lógica una vez.
   */
  init() {
    if (this._initialized) return;
    this._initialized = true;

    // Leer URL desde variable de entorno de Vite
    const envUrl = this._readEnvUrl();

    if (!envUrl) {
      this._setState(PlayerState.NO_SOURCE);
      console.info('[AudioPlayer] VITE_SOUNDTRACK_URL no configurada. Reproductor listo para recibir fuente.');
      return;
    }

    this._sourceUrl = envUrl;
    this._createAudioElement();
  }

  /* ------------------------------------------------
     Controles públicos
     ------------------------------------------------ */

  /**
   * Inicia la reproducción. Gestiona la promesa de play() y el bloqueo de autoplay.
   * @returns {Promise<void>}
   */
  async play() {
    if (!this._audio) return;
    if (this._state === PlayerState.PLAYING) return;

    try {
      this._setState(PlayerState.LOADING);
      await this._audio.play();
      // El evento 'play' actualizará el estado a PLAYING
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        // Política de autoplay: necesita gesto del usuario
        this._setState(PlayerState.BLOCKED);
        console.info('[AudioPlayer] Autoplay bloqueado por el navegador. Esperando interacción del usuario.');
      } else {
        this._setState(PlayerState.ERROR);
        console.error('[AudioPlayer] Error de reproducción:', err.message);
      }
    }
  }

  /**
   * Pausa la reproducción.
   */
  pause() {
    if (!this._audio) return;
    this._audio.pause();
    // El evento 'pause' actualizará el estado a PAUSED
  }

  /**
   * Alterna entre reproducción y pausa.
   */
  toggle() {
    if (this._state === PlayerState.PLAYING) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * Establece el volumen (0 a 1).
   * @param {number} value
   */
  setVolume(value) {
    const clamped = Math.max(0, Math.min(1, value));
    this._prefs.volume = clamped;
    if (this._audio) {
      this._audio.volume = clamped;
      // Si sube el volumen y estaba silenciado, desactivar mute
      if (clamped > 0 && this._prefs.muted) {
        this.setMuted(false);
      }
    }
    this._savePrefs();
    this._emit('volumechange', { volume: clamped, muted: this._prefs.muted });
  }

  /**
   * Activa o desactiva el silencio.
   * @param {boolean} muted
   */
  setMuted(muted) {
    this._prefs.muted = muted;
    if (this._audio) this._audio.muted = muted;
    this._savePrefs();
    this._emit('mutedchange', { muted });
  }

  /**
   * Alterna el silencio.
   */
  toggleMute() {
    this.setMuted(!this._prefs.muted);
  }

  /**
   * Expande o colapsa el panel del reproductor.
   * @param {boolean} expanded
   */
  setExpanded(expanded) {
    this._prefs.expanded = expanded;
    this._savePrefs();
    this._emit('expandedchange', { expanded });
  }

  toggleExpanded() {
    this.setExpanded(!this._prefs.expanded);
  }

  /**
   * Suscribirse a eventos del reproductor.
   * @param {string} event
   * @param {Function} handler
   */
  on(event, handler) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, new Set());
    }
    this._listeners.get(event).add(handler);
  }

  /**
   * Desuscribirse de un evento.
   * @param {string} event
   * @param {Function} handler
   */
  off(event, handler) {
    if (this._listeners.has(event)) {
      this._listeners.get(event).delete(handler);
    }
  }

  /* ------------------------------------------------
     Privados
     ------------------------------------------------ */

  /**
   * Lee la URL de la banda sonora desde las variables de entorno de Vite.
   * @returns {string|null}
   */
  _readEnvUrl() {
    try {
      // import.meta.env solo está disponible en el contexto de Vite
      const url = import.meta.env?.VITE_SOUNDTRACK_URL;
      return url && url.trim() !== '' ? url.trim() : null;
    } catch {
      return null;
    }
  }

  /**
   * Crea y configura la instancia única de HTMLAudioElement.
   */
  _createAudioElement() {
    if (this._audio) return; // No crear duplicados

    this._audio = new Audio();
    this._audio.src          = this._sourceUrl;
    this._audio.loop         = true;
    this._audio.preload      = 'metadata';
    this._audio.volume       = this._prefs.volume;
    this._audio.muted        = this._prefs.muted;
    this._audio.crossOrigin  = 'anonymous';

    this._setState(PlayerState.LOADING);
    this._attachAudioEvents();
  }

  /**
   * Adjunta todos los eventos del HTMLAudioElement.
   * Usa referencias nombradas para poder limpiarlos si fuera necesario.
   */
  _attachAudioEvents() {
    const a = this._audio;

    a.addEventListener('loadedmetadata', () => {
      if (this._state === PlayerState.LOADING) {
        this._setState(PlayerState.AVAILABLE);
      }
    });

    a.addEventListener('canplay', () => {
      if (this._state === PlayerState.LOADING || this._state === PlayerState.AVAILABLE) {
        this._setState(PlayerState.AVAILABLE);
      }
    });

    a.addEventListener('play', () => {
      this._setState(PlayerState.PLAYING);
    });

    a.addEventListener('pause', () => {
      // Solo cambia a PAUSED si no fue un error
      if (this._state !== PlayerState.ERROR) {
        this._setState(PlayerState.PAUSED);
      }
    });

    a.addEventListener('ended', () => {
      // loop=true, pero por si acaso
      this._setState(PlayerState.AVAILABLE);
    });

    a.addEventListener('volumechange', () => {
      this._emit('volumechange', {
        volume: a.volume,
        muted:  a.muted,
      });
    });

    a.addEventListener('timeupdate', () => {
      this._emit('timeupdate', {
        currentTime: a.currentTime,
        duration:    a.duration || 0,
      });
    });

    a.addEventListener('error', (e) => {
      const codes = {
        1: 'Carga abortada',
        2: 'Error de red',
        3: 'Error de decodificación',
        4: 'Formato no soportado o fuente no encontrada',
      };
      const code    = a.error?.code;
      const message = codes[code] || 'Error desconocido';
      console.error(`[AudioPlayer] Error de audio (${code}): ${message}`);
      this._setState(PlayerState.ERROR);
    });
  }

  /**
   * Actualiza el estado interno y emite el evento 'statechange'.
   * @param {PlayerState} newState
   */
  _setState(newState) {
    const previous = this._state;
    this._state = newState;
    if (previous !== newState) {
      this._emit('statechange', { state: newState, previous });
    }
  }

  /**
   * Emite un evento a todos los listeners suscritos.
   * @param {string} event
   * @param {object} data
   */
  _emit(event, data = {}) {
    const handlers = this._listeners.get(event);
    if (handlers) {
      handlers.forEach(fn => {
        try {
          fn(data);
        } catch (err) {
          console.error(`[AudioPlayer] Error en handler de evento '${event}':`, err);
        }
      });
    }
  }

  /* ------------------------------------------------
     Persistencia de preferencias
     ------------------------------------------------ */

  /**
   * Carga preferencias desde sessionStorage.
   * @returns {object}
   */
  _loadPrefs() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
      }
    } catch {
      // sessionStorage puede estar deshabilitado
    }
    return { ...DEFAULT_PREFS };
  }

  /**
   * Guarda preferencias en sessionStorage.
   */
  _savePrefs() {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(this._prefs));
    } catch {
      // Silencioso: el almacenamiento puede estar lleno o deshabilitado
    }
  }
}

/* --------------------------------------------------
   Exportación de instancia única (Singleton)
   -------------------------------------------------- */
export const audioPlayer = new AudioPlayerCore();
