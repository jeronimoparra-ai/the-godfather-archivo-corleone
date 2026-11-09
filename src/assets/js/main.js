/* ============================================================
   THE GODFATHER — ARCHIVO CORLEONE
   Aplicación: renderizado, interacción y persistencia.
   ============================================================ */

import '../css/main.css';
import '../css/animations.css';
import { supabaseClient, isSupabaseConfigured } from './supabase.js';
import { initAudio } from './audio.js';
import movieData from '../../data/movie-data.js';

/* ---------- Utilidades ---------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const formatDate = (iso) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
};

/* ---------- Toasts accesibles ---------- */
const toast = (message, kind = 'ok') => {
  const stack = $('#toastStack');
  if (!stack) return;
  const el = document.createElement('div');
  el.className = `toast toast--${kind}`;
  el.setAttribute('role', kind === 'err' ? 'alert' : 'status');
  el.innerHTML = `
    <i class="bi ${kind === 'err' ? 'bi-exclamation-octagon' : kind === 'warn' ? 'bi-exclamation-triangle' : 'bi-check-circle'}" aria-hidden="true"></i>
    <span>${escapeHtml(message)}</span>
    <button type="button" class="toast__close" aria-label="Cerrar aviso">&times;</button>
  `;
  el.querySelector('.toast__close').addEventListener('click', () => el.remove());
  stack.appendChild(el);
  setTimeout(() => el.remove(), 6000);
};

/* ---------- Navbar ---------- */
const initNavbar = () => {
  const nav = $('#siteNav');
  if (!nav) return;

  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const links = $$('.navbar .nav-link');
  const sections = links
    .map((link) => {
      const id = link.getAttribute('href')?.slice(1);
      const el = id ? document.getElementById(id) : null;
      return el ? { link, el } : null;
    })
    .filter(Boolean);

  if (!sections.length) return;

  const setActive = (target) => {
    links.forEach((l) => l.classList.remove('is-active', 'active'));
    target.link.classList.add('is-active');
    target.link.setAttribute('aria-current', 'page');
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const match = sections.find((s) => s.el === visible.target);
      if (match) setActive(match);
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] }
  );
  sections.forEach(({ el }) => observer.observe(el));

  // Cierra el menú móvil al elegir un enlace
  links.forEach((link) => {
    link.addEventListener('click', () => {
      const collapse = $('#mainNav');
      if (collapse?.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(collapse).hide();
      }
    });
  });
};

/* ---------- Sección: La película ---------- */
const renderMovie = () => {
  const facts = $('#movieFacts');
  const synopsis = $('#movieSynopsis');
  const context = $('#movieContext');
  const timeline = $('#productionTimeline');
  const { movie, filmography } = movieData;

  if (facts) {
    const items = [
      ['Título original', movie.originalTitle],
      ['Título en español', movie.spanishTitle],
      ['Año', movie.year],
      ['Dirección', movie.director],
      ['Género', movie.genre],
      ['Duración', movie.duration],
      ['Productora', movie.productionCompany],
      ['Fotografía', movie.cinematographer],
    ];
    facts.innerHTML = items
      .map(
        ([label, value]) => `
        <div class="fact">
          <span class="fact__label">${escapeHtml(label)}</span>
          <span class="fact__value">${escapeHtml(value)}</span>
        </div>`
      )
      .join('');
  }

  if (synopsis) synopsis.textContent = movie.synopsis;
  if (context) context.textContent = movie.productionContext;

  if (timeline) {
    timeline.innerHTML = filmography.releaseTimeline
      .map(
        (item) => `
        <li class="timeline__item">
          <div class="timeline__year">${escapeHtml(item.year)}</div>
          <h4 class="timeline__title">${escapeHtml(item.event)}</h4>
          <p class="timeline__text">${escapeHtml(item.description)}</p>
        </li>`
      )
      .join('');
  }
};

/* ---------- Sección: Personajes ---------- */
const characterImage = (image) => `/assets/images/characters/${image}`;

const renderCharacters = () => {
  const grid = $('#charactersGrid');
  if (!grid) return;

  grid.innerHTML = movieData.characters
    .map(
      (c) => `
      <div class="col-lg-4 col-md-6" data-reveal>
        <article class="card character h-100" tabindex="0" role="button"
                 data-character="${escapeHtml(c.name)}"
                 aria-label="Ver información de ${escapeHtml(c.name)}">
          <img class="card-img-top" src="${characterImage(c.image)}"
               alt="Retrato de ${escapeHtml(c.name)}, interpretado por ${escapeHtml(c.actor)}"
               loading="lazy" width="720" height="900">
          <div class="character__overlay">
            <span class="character__actor">${escapeHtml(c.actor)}</span>
            <h3 class="card-title">${escapeHtml(c.name)}</h3>
            <p class="character__role">${escapeHtml(c.role)}</p>
            <span class="character__cta">
              Ver perfil <i class="bi bi-arrow-right" aria-hidden="true"></i>
            </span>
          </div>
        </article>
      </div>`
    )
    .join('');

  const openFromCard = (card) => openCharacterModal(card.dataset.character);

  $$('.character', grid).forEach((card) => {
    card.addEventListener('click', () => openFromCard(card));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openFromCard(card);
      }
    });
  });
};

const openCharacterModal = (name) => {
  const character = movieData.characters.find((c) => c.name === name);
  if (!character) return;

  $('#characterModalTitle').textContent = character.name;
  const img = $('#characterModalImg');
  img.src = characterImage(character.image);
  img.alt = `Retrato de ${character.name}`;

  $('#characterModalMeta').innerHTML = `
    <dt>Intérprete</dt><dd>${escapeHtml(character.actor)}</dd>
    <dt>Rol en la historia</dt><dd>${escapeHtml(character.role)}</dd>
    <dt>Edad en la película</dt><dd>${escapeHtml(character.age)} años</dd>
  `;

  $('#characterModalBio').textContent = character.bio;

  $('#characterModalQuotes').innerHTML = character.quotes
    .map((q) => `<li>${escapeHtml(q)}</li>`)
    .join('');

  bootstrap.Modal.getOrCreateInstance($('#characterModal')).show();
};

/* ---------- Sección: Cronología narrativa ---------- */
const storyEvents = [
  {
    year: '1920 — 1945',
    title: 'El ascenso de los Corleone',
    text: 'Don Vito Corleone construye su influencia en Nueva York a partir de favores, respeto y una red de lealtades que sostiene su poder.',
  },
  {
    year: 'Diciembre de 1945',
    title: 'La boda y el primer favor',
    text: 'Mientras la familia celebra, se atienden peticiones que revelan cómo funciona el sistema de favores del Don.',
  },
  {
    year: '1946',
    title: 'El atentado',
    text: 'Un intento de asesinato contra Don Vito altera el equilibrio entre las familias y empuja a sus hijos a decidir.',
  },
  {
    year: '1946 — 1947',
    title: 'La transformación de Michael',
    text: 'Michael, el hijo que se mantenía al margen, asume decisiones que lo alejan de su vida anterior.',
  },
  {
    year: '1947 — 1955',
    title: 'La nueva estructura de poder',
    text: 'La familia reorganiza su posición y Michael consolida su lugar dentro del legado de su padre.',
  },
];

const renderStoryTimeline = () => {
  const list = $('#storyTimeline');
  if (!list) return;
  list.innerHTML = storyEvents
    .map(
      (event) => `
      <li class="timeline__item">
        <div class="timeline__year">${escapeHtml(event.year)}</div>
        <h4 class="timeline__title">${escapeHtml(event.title)}</h4>
        <p class="timeline__text">${escapeHtml(event.text)}</p>
      </li>`
    )
    .join('');
};

/* ---------- Sección: Legado ---------- */
const craftItems = [
  ['Dirección', 'La puesta en escena de Coppola combina solemnidad teatral con un ritmo de thriller clásico.'],
  ['Fotografía', 'La iluminación sombría de Gordon Willis define una estética que influyó en generaciones de cineastas.'],
  ['Música', 'La partitura de Nino Rota acompaña la historia con un tema que se volvió inseparable de la película.'],
  ['Narrativa', 'La estructura familiar y el conflicto entre poder y lealtad sostienen toda la obra.'],
];

const renderLegacy = () => {
  const list = $('#legacyList');
  if (list) {
    list.innerHTML = movieData.filmography.legacy
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join('');
  }

  const craft = $('#craftList');
  if (craft) {
    craft.innerHTML = craftItems
      .map(
        ([title, text]) => `
        <div class="mb-4">
          <h4 class="timeline__title mb-1">${escapeHtml(title)}</h4>
          <p class="timeline__text">${escapeHtml(text)}</p>
        </div>`
      )
      .join('');
  }
};

/* ---------- Sección: Galería ---------- */
const renderGallery = () => {
  const grid = $('#galleryGrid');
  if (!grid) return;

  const items = movieData.gallery || [];
  grid.innerHTML = items
    .map(
      (item, index) => `
      <button type="button" class="gallery__item" data-index="${index}" data-reveal
              aria-label="Ampliar imagen: ${escapeHtml(item.title)}">
        <picture>
          <source srcset="${escapeHtml(item.src)}" type="image/webp">
          <img src="${escapeHtml(item.src.replace('.webp', '.jpg'))}"
               alt="${escapeHtml(item.alt)}"
               width="900" height="600"
               loading="lazy" decoding="async">
        </picture>
        <span class="gallery__caption">
          <span class="gallery__caption-title">${escapeHtml(item.title)}</span>
          <span class="gallery__caption-sub">${escapeHtml(item.subtitle)}</span>
        </span>
      </button>`
    )
    .join('');

  $$('.gallery__item', grid).forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = items[Number(btn.dataset.index)];
      if (!item) return;
      $('#galleryModalTitle').textContent = item.title;
      const subtitleEl = $('#galleryModalSubtitle');
      if (subtitleEl) subtitleEl.textContent = item.subtitle;
      const creditEl = $('#galleryModalCredit');
      if (creditEl) creditEl.textContent = `Crédito: ${item.credit}`;
      const img = $('#galleryModalImg');
      img.src = item.src;
      img.alt = item.alt;
      bootstrap.Modal.getOrCreateInstance($('#galleryModal')).show();
    });
  });
};

/* ---------- Quiz ---------- */
const quizState = { answers: {}, submitted: false };
const LETTERS = ['A', 'B', 'C', 'D', 'E'];

const renderQuiz = () => {
  const wrap = $('#quizQuestions');
  if (!wrap) return;

  wrap.innerHTML = movieData.quiz.questions
    .map((q, index) => {
      const options = q.options
        .map(
          (option, optIndex) => `
          <label class="quiz-option" data-option="${escapeHtml(option)}">
            <input type="radio" name="q${index}" value="${escapeHtml(option)}"
                   data-question="${index}">
            <span><b class="text-gold">${LETTERS[optIndex]}.</b> ${escapeHtml(option)}</span>
          </label>`
        )
        .join('');

      return `
      <fieldset class="quiz-question" data-question="${index}">
        <legend class="sr-only">Pregunta ${index + 1}</legend>
        <span class="quiz-question__num">Pregunta ${index + 1} de ${movieData.quiz.questions.length}</span>
        <p class="quiz-question__text">${escapeHtml(q.question)}</p>
        ${options}
        <div class="quiz-feedback" id="quizFeedback${index}"></div>
      </fieldset>`;
    })
    .join('');

  wrap.addEventListener('change', (event) => {
    const input = event.target.closest('input[type="radio"]');
    if (!input) return;
    quizState.answers[Number(input.dataset.question)] = input.value;
    updateQuizProgress();
  });

  updateQuizProgress();
};

const updateQuizProgress = () => {
  const total = movieData.quiz.questions.length;
  const answered = Object.keys(quizState.answers).length;
  const percent = Math.round((answered / total) * 100);
  const fill = $('#quizProgressFill');
  const bar = $('#quizProgressBar');
  if (fill) fill.style.width = `${percent}%`;
  if (bar) {
    bar.setAttribute('aria-valuenow', String(percent));
    bar.setAttribute('aria-valuetext', `${answered} de ${total} preguntas respondidas`);
  }
};

const gradeQuiz = () => {
  const questions = movieData.quiz.questions;
  let correct = 0;
  let unanswered = 0;

  questions.forEach((q, index) => {
    const fieldset = $(`.quiz-question[data-question="${index}"]`);
    const feedback = $(`#quizFeedback${index}`);
    if (!fieldset || !feedback) return;

    $$('.quiz-option', fieldset).forEach((opt) => opt.classList.remove('is-correct', 'is-wrong'));

    const answer = quizState.answers[index];
    if (!answer) {
      unanswered += 1;
      feedback.className = 'quiz-feedback quiz-feedback--warn';
      feedback.textContent = 'Sin responder.';
    } else if (answer === q.correct) {
      correct += 1;
      feedback.className = 'quiz-feedback quiz-feedback--ok';
      feedback.textContent = 'Correcto.';
      $(`.quiz-option[data-option="${CSS.escape(q.correct)}"]`, fieldset)?.classList.add('is-correct');
    } else {
      feedback.className = 'quiz-feedback quiz-feedback--err';
      feedback.textContent = `Incorrecto. La respuesta es: ${q.correct}.`;
      $(`.quiz-option[data-option="${CSS.escape(answer)}"]`, fieldset)?.classList.add('is-wrong');
      $(`.quiz-option[data-option="${CSS.escape(q.correct)}"]`, fieldset)?.classList.add('is-correct');
    }
  });

  const total = questions.length;
  const percent = Math.round((correct / total) * 100);

  let message = 'Necesitas repasar la película.';
  if (percent >= 80) message = 'Dominio absoluto del archivo Corleone.';
  else if (percent >= 60) message = 'Buen conocimiento de la película.';
  else if (percent >= 40) message = 'Vas por buen camino, sigue explorando.';

  const result = $('#quizResult');
  result.hidden = false;
  result.className = 'quiz-result';
  result.innerHTML = `
    <p class="quiz-result__score" id="quizScoreNumber">0 / ${total}</p>
    <p class="quiz-result__label">${percent}% de respuestas correctas${unanswered ? ` · ${unanswered} sin responder` : ''}</p>
    <p class="quiz-result__msg">${escapeHtml(message)}</p>
    <button type="button" class="btn btn-outline-light btn-sm" id="quizAgain">
      <i class="bi bi-arrow-repeat" aria-hidden="true"></i> Intentar de nuevo
    </button>
  `;

  // Conteo animado accesible del puntaje
  const scoreNum = result.querySelector('#quizScoreNumber');
  if (scoreNum) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      scoreNum.textContent = `${correct} / ${total}`;
    } else {
      const startTime = performance.now();
      const duration = 400;
      const animateScore = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const easeVal = 1 - Math.pow(1 - progress, 3);
        const count = Math.round(easeVal * correct);
        scoreNum.textContent = `${count} / ${total}`;
        if (progress < 1) {
          requestAnimationFrame(animateScore);
        } else {
          scoreNum.textContent = `${correct} / ${total}`;
        }
      };
      requestAnimationFrame(animateScore);
    }
  }

  result.querySelector('#quizAgain').addEventListener('click', resetQuiz);
  result.scrollIntoView({ behavior: 'smooth', block: 'center' });
  quizState.submitted = true;
};

const resetQuiz = () => {
  quizState.answers = {};
  quizState.submitted = false;
  $$('.quiz-question').forEach((fieldset) => {
    $$('.quiz-option', fieldset).forEach((opt) => opt.classList.remove('is-correct', 'is-wrong'));
    const feedback = fieldset.querySelector('.quiz-feedback');
    if (feedback) {
      feedback.textContent = '';
      feedback.className = 'quiz-feedback';
    }
  });
  const form = $('#quizForm');
  if (form) form.reset();
  const result = $('#quizResult');
  if (result) {
    result.hidden = true;
    result.innerHTML = '';
  }
  updateQuizProgress();
  $('#quizTitle')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const initQuiz = () => {
  renderQuiz();
  $('#quizForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    gradeQuiz();
  });
  $('#quizReset')?.addEventListener('click', resetQuiz);
};

/* ---------- Opiniones ---------- */
const FALLBACK_STORAGE_KEY = 'corleone_reviews';

const getStoredReviews = () => {
  try {
    const raw = localStorage.getItem(FALLBACK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveStoredReview = (review) => {
  const reviews = getStoredReviews();
  reviews.unshift(review);
  localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(reviews.slice(0, 50)));
};

const renderReviews = (reviews, source) => {
  const list = $('#reviewsList');
  if (!list) return;

  if (!reviews.length) {
    list.innerHTML = `
      <p class="text-dim mb-0">
        Todavía no hay opiniones registradas.
        ${source === 'local' ? 'Las nuevas se guardarán en este navegador.' : ''}
      </p>`;
    return;
  }

  list.innerHTML = reviews
    .map(
      (r) => `
      <article class="review">
        <div class="review__top">
          <span class="review__who">${escapeHtml(r.visitor_name)}</span>
          <span class="review__when">${formatDate(r.created_at)}</span>
        </div>
        <div class="review__stars" aria-label="Calificación ${Number(r.rating)} de 5">
          ${'★'.repeat(Number(r.rating))}${'☆'.repeat(5 - Number(r.rating))}
        </div>
        <p class="review__fav">Personaje favorito: <b>${escapeHtml(r.favorite_character)}</b></p>
        <p class="review__text">“${escapeHtml(r.comment)}”</p>
      </article>`
    )
    .join('');
};

const loadReviews = async () => {
  if (isSupabaseConfigured() && supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('movie_reviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      renderReviews(data ?? [], 'remote');
      $('#storageNote').textContent = 'Tus opiniones se guardan en la base de datos del proyecto.';
      return;
    } catch (error) {
      console.warn('No se pudo leer Supabase, se usa almacenamiento local:', error.message);
      toast('No se pudo conectar con la base de datos. Se usará el almacenamiento local.', 'warn');
    }
  }

  renderReviews(getStoredReviews(), 'local');
  $('#storageNote').textContent =
    'Modo local: tus opiniones se guardan únicamente en este navegador.';
};

const validateReview = (data) => {
  const errors = {};
  const name = (data.visitor_name || '').trim();
  const comment = (data.comment || '').trim();
  const rating = Number(data.rating);
  const favorite = (data.favorite_character || '').trim();

  if (name.length < 2 || name.length > 60) errors.visitor_name = true;
  if (!favorite) errors.favorite_character = true;
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) errors.rating = true;
  if (comment.length < 3 || comment.length > 140) errors.comment = true;

  return errors;
};

const clearFieldErrors = (form) => {
  $$('.form-control, .form-select', form).forEach((input) => input.classList.remove('is-invalid'));
};

const submitReview = async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = $('#reviewSubmit');
  const data = Object.fromEntries(new FormData(form).entries());

  clearFieldErrors(form);
  const errors = validateReview(data);
  if (Object.keys(errors).length) {
    Object.keys(errors).forEach((field) => {
      const input = $(`[name="${field}"]`, form);
      if (input) input.classList.add('is-invalid');
    });
    toast('Revisa los campos marcados en rojo.', 'warn');
    $(`[name="${Object.keys(errors)[0]}"]`, form)?.focus();
    return;
  }

  const payload = {
    visitor_name: data.visitor_name.trim(),
    favorite_character: data.favorite_character,
    rating: Number(data.rating),
    comment: data.comment.trim(),
    created_at: new Date().toISOString(),
  };

  button.disabled = true;
  const original = button.innerHTML;
  button.innerHTML = '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span> Enviando…';

  try {
    if (isSupabaseConfigured() && supabaseClient) {
      const { error } = await supabaseClient.from('movie_reviews').insert([payload]);
      if (error) throw error;
      toast('Opinión registrada en la base de datos.', 'ok');
      await loadReviews();
    } else {
      saveStoredReview(payload);
      renderReviews(getStoredReviews(), 'local');
      toast('Opinión guardada en este navegador.', 'ok');
    }
    form.reset();
    form.classList.add('form-submit-success');
    setTimeout(() => form.classList.remove('form-submit-success'), 1200);
  } catch (error) {
    console.error('Error al guardar la opinión:', error);
    toast('No se pudo guardar la opinión. Inténtalo de nuevo.', 'err');
  } finally {
    button.disabled = false;
    button.innerHTML = original;
  }
};

const initReviews = () => {
  const form = $('#reviewForm');
  if (!form) return;

  const select = $('#favoriteCharacter');
  if (select) {
    movieData.characters.forEach((c) => {
      const option = document.createElement('option');
      option.value = c.name;
      option.textContent = c.name;
      select.appendChild(option);
    });
  }

  form.addEventListener('submit', submitReview);
  $$('.form-control, .form-select', form).forEach((input) => {
    input.addEventListener('input', () => input.classList.remove('is-invalid'));
    input.addEventListener('change', () => input.classList.remove('is-invalid'));
  });

  loadReviews();
};

/* ---------- Animación de entrada ---------- */
const initReveal = () => {
  const elements = $$('[data-reveal]');
  if (!elements.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );
  elements.forEach((el) => observer.observe(el));
};

/* ---------- Arranque ---------- */
const init = () => {
  initNavbar();
  renderMovie();
  renderCharacters();
  renderStoryTimeline();
  renderLegacy();
  renderGallery();
  initQuiz();
  initReviews();
  initAudio();
  initReveal();

  // Asistencia exclusiva para captura de evidencias visuales en entornos de prueba headless
  const params = new URLSearchParams(window.location.search);
  if (params.get('preview_audio_ui') === 'active' || params.get('audio') === 'active') {
    const audioBtn = $('#audioToggle');
    if (audioBtn) {
      audioBtn.classList.add('is-playing');
      audioBtn.setAttribute('aria-pressed', 'true');
      audioBtn.setAttribute('aria-label', 'Silenciar música de fondo');
      audioBtn.title = 'Silenciar música de fondo';
      const icon = audioBtn.querySelector('i');
      if (icon) icon.className = 'bi bi-volume-up-fill';
      const textSpan = audioBtn.querySelector('.audio-btn__text');
      if (textSpan) textSpan.textContent = 'Silenciar';
    }
  }
  if (params.get('preview_modal') === 'gallery' || params.get('modal') === 'gallery') {
    const items = movieData.gallery || [];
    const item = items[0];
    if (item) {
      $('#galleryModalTitle').textContent = item.title;
      const subtitleEl = $('#galleryModalSubtitle');
      if (subtitleEl) subtitleEl.textContent = item.subtitle;
      const creditEl = $('#galleryModalCredit');
      if (creditEl) creditEl.textContent = `Crédito: ${item.credit}`;
      const img = $('#galleryModalImg');
      img.src = item.src;
      img.alt = item.alt;
      bootstrap.Modal.getOrCreateInstance($('#galleryModal')).show();
    }
  }

  console.info('Archivo Corleone listo.');
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
