/* ==============================================
   The Godfather - Archivo Corleone - Componentes JavaScript
   Componentes reutilizables para Bootstrap 5.3
   ============================================== */

import App from './main.js';

// Componente: CharacterCard - Tarjeta de personaje reutilizable
class CharacterCard {
  constructor(container, character) {
    this.container = container;
    this.character = character;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="card character-card h-100 hover-lift">
        <div class="position-relative">
          <img src="${this.character.image}" class="card-img-top" alt="${this.character.name}" loading="lazy">
          <div class="position-absolute top-0 end-0 p-2">
            <span class="badge bg-gold text-dark">
              <i class="bi bi-star-fill me-1"></i>${this.character.role}
            </span>
          </div>
        </div>
        <div class="card-body">
          <h3 class="card-title text-gold mb-1">
            <i class="bi bi-person-fill me-2"></i>
            ${this.character.name}
          </h3>
          <p class="card-subtitle text-muted small mb-3">
            <i class="bi bi-camera-fill me-1"></i>
            Interpretado por ${this.character.actor}
          </p>
          <p class="card-text text-muted">
            ${this.character.description}
          </p>
          <div class="d-grid gap-2">
            <button class="btn btn-primary btn-sm view-character-btn" data-character="${this.character.name}">
              <i class="bi bi-info-circle-fill me-1"></i>Ver Perfil Completo
            </button>
            <button class="btn btn-outline-light btn-sm favorite-btn" data-character="${this.character.name}">
              <i class="bi bi-heart-fill me-1"></i>Agregar a Favoritos
            </button>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const viewBtn = this.container.querySelector('.view-character-btn');
    const favoriteBtn = this.container.querySelector('.favorite-btn');

    if (viewBtn) {
      viewBtn.addEventListener('click', () => {
        App.openCharacterModal(this.character.name);
      });
    }

    if (favoriteBtn) {
      favoriteBtn.addEventListener('click', () => {
        this.toggleFavorite(this.character.name);
      });
    }
  }

  toggleFavorite(characterName) {
    let favorites = JSON.parse(localStorage.getItem('characterFavorites') || '[]');
    
    const index = favorites.indexOf(characterName);
    if (index > -1) {
      favorites.splice(index, 1);
      this.showToast(`${characterName} eliminado de favoritos`, 'warning');
    } else {
      favorites.push(characterName);
      this.showToast(`${characterName} agregado a favoritos`, 'success');
    }
    
    localStorage.setItem('characterFavorites', JSON.stringify(favorites));
  }

  showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container') || this.createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'gold' : type === 'warning' ? 'burgundy' : 'primary'} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : type === 'warning' ? 'bi-exclamation-triangle-fill' : 'bi-info-fill'} me-2"></i>
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;
    
    toastContainer.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    setTimeout(() => toast.remove(), 3000);
  }

  createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = '1070';
    document.body.appendChild(container);
    return container;
  }
}

// Componente: QuizComponent - Componente de quiz reutilizable
class QuizComponent {
  constructor(container, quizData) {
    this.container = container;
    this.quizData = quizData;
    this.currentQuestion = 0;
    this.score = 0;
    this.userAnswers = [];
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="quiz-container">
        <div class="progress mb-4">
          <div class="progress-bar progress-bar-striped progress-bar-animated" 
               style="width: ${(this.currentQuestion + 1) / this.quizData.questions.length * 100}%">
            Pregunta ${this.currentQuestion + 1} de ${this.quizData.questions.length}
          </div>
        </div>
        
        <div class="question-card card">
          <div class="card-body">
            <h4 class="card-title text-gold mb-4">
              <span class="badge bg-burgundy me-2">Q${this.currentQuestion + 1}</span>
              ${this.quizData.questions[this.currentQuestion].question}
            </h4>
            
            <div class="options-grid">
              ${this.quizData.questions[this.currentQuestion].options.map((option, index) => `
                <div class="option-item" data-option="${option}" data-index="${index}">
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="option" id="option${index}" value="${option}">
                    <label class="form-check-label" for="option${index}">
                      <span class="option-letter me-2">${String.fromCharCode(65 + index)}.</span>
                      ${option}
                    </label>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        
        <div class="navigation-buttons mt-4">
          <button class="btn btn-primary me-2" id="next-btn" ${this.currentQuestion === this.quizData.questions.length - 1 ? 'disabled' : ''}>Siguiente</button>
          <button class="btn btn-outline-secondary" id="prev-btn" ${this.currentQuestion === 0 ? 'disabled' : ''}>Anterior</button>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const nextBtn = this.container.querySelector('#next-btn');
    const prevBtn = this.container.querySelector('#prev-btn');
    const options = this.container.querySelectorAll('.option-item');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.currentQuestion < this.quizData.questions.length - 1) {
          this.saveCurrentAnswer();
          this.currentQuestion++;
          this.render();
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentQuestion > 0) {
          this.saveCurrentAnswer();
          this.currentQuestion--;
          this.render();
        }
      });
    }

    options.forEach(option => {
      option.addEventListener('click', () => {
        const radio = option.querySelector('input');
        if (radio) radio.checked = true;
      });
    });
  }

  saveCurrentAnswer() {
    const selectedOption = this.container.querySelector('input[name="option"]:checked');
    if (selectedOption) {
      this.userAnswers[this.currentQuestion] = selectedOption.value;
    }
  }

  calculateScore() {
    let correct = 0;
    this.userAnswers.forEach((answer, index) => {
      if (answer === this.quizData.questions[index].correct) {
        correct++;
      }
    });
    return correct;
  }

  getResults() {
    const percentage = Math.round((this.score / this.quizData.questions.length) * 100);
    const feedback = this.getFeedback(percentage);
    
    return {
      score: this.score,
      total: this.quizData.questions.length,
      percentage,
      feedback,
      userAnswers: this.userAnswers
    };
  }

  getFeedback(percentage) {
    if (percentage >= 80) {
      return {
        message: '¡Excelente! Conoces muy bien The Godfather.',
        icon: 'bi-trophy-fill',
        class: 'text-success'
      };
    } else if (percentage >= 60) {
      return {
        message: '¡Bien! Conoces bastante sobre la película.',
        icon: 'bi-emoji-smile-fill',
        class: 'text-primary'
      };
    } else if (percentage >= 40) {
      return {
        message: 'Regular. Sigue viendo The Godfather para aprender.',
        icon: 'bi-emoji-neutral-fill',
        class: 'text-warning'
      };
    } else {
      return {
        message: 'Necesitas ver The Godfather más veces.',
        icon: 'bi-emoji-frown-fill',
        class: 'text-danger'
      };
    }
  }
}

// Componente: TimelineComponent - Componente de línea de tiempo reutilizable
class TimelineComponent {
  constructor(container, events) {
    this.container = container;
    this.events = events;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="timeline-container">
        ${this.events.map((event, index) => `
          <div class="timeline-item ${index % 2 === 0 ? 'left' : 'right'}">
            <div class="timeline-content card">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <h5 class="text-gold mb-0">
                    <i class="bi bi-clock-fill me-2"></i>
                    ${event.year}
                  </h5>
                  <span class="badge bg-burgundy">Evento ${index + 1}</span>
                </div>
                <h4 class="text-light mt-2">${event.event}</h4>
                <p class="text-muted mt-2">${event.description}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    this.addTimelineStyles();
  }

  addTimelineStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .timeline-container {
        position: relative;
        padding: 2rem 0;
      }
      
      .timeline-container::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        width: 3px;
        background: linear-gradient(180deg, var(--accent-burgundy), var(--accent-gold));
        transform: translateX(-50%);
        border-radius: 2px;
      }
      
      .timeline-item {
        position: relative;
        width: 50%;
        padding: 1rem 2rem;
        margin-bottom: 2rem;
      }
      
      .timeline-item.left {
        left: 0;
        text-align: right;
      }
      
      .timeline-item.right {
        left: 50%;
        text-align: left;
      }
      
      .timeline-content {
        transition: transform 0.3s ease;
      }
      
      .timeline-content:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      }
      
      .timeline-marker {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: linear-gradient(45deg, var(--accent-burgundy), var(--accent-gold));
        border: 3px solid var(--primary-dark);
        z-index: 1;
      }
      
      .left .timeline-marker {
        right: -10px;
      }
      
      .right .timeline-marker {
        left: -10px;
      }
      
      @media (max-width: 768px) {
        .timeline-container::before {
          left: 20px;
        }
        
        .timeline-item {
          width: 100%;
          left: 0 !important;
          text-align: left;
          padding-left: 3rem;
          padding-right: 1rem;
        }
        
        .timeline-item .timeline-marker {
          left: 10px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Componente: GalleryComponent - Componente de galería reutilizable
class GalleryComponent {
  constructor(container, images) {
    this.container = container;
    this.images = images;
    this.currentIndex = 0;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="gallery-container">
        <div class="gallery-grid row g-4">
          ${this.images.map((image, index) => `
            <div class="col-lg-4 col-md-6">
              <div class="gallery-item card hover-lift">
                <div class="position-relative overflow-hidden">
                  <img src="${image.src}" alt="${image.alt}" class="card-img-top gallery-img" loading="lazy">
                  <div class="gallery-overlay">
                    <button class="btn btn-primary gallery-btn" data-index="${index}">
                      <i class="bi bi-zoom-in me-2"></i>Ampliar
                    </button>
                  </div>
                </div>
                <div class="card-body">
                  <h5 class="card-title text-gold small mb-2">${image.title}</h5>
                  <p class="card-text text-muted small">${image.description}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="modal fade" id="galleryModal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content bg-transparent border-0">
              <div class="modal-header border-0">
                <h5 class="modal-title text-gold" id="galleryModalTitle">Imagen Ampliada</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body text-center">
                <img id="galleryModalImage" src="" class="img-fluid rounded" alt="Image enlarged">
              </div>
              <div class="modal-footer border-0 justify-content-center">
                <button type="button" class="btn btn-outline-light" data-bs-dismiss="modal">
                  <i class="bi bi-x-circle-fill me-2"></i>Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const galleryBtns = this.container.querySelectorAll('.gallery-btn');

    galleryBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.dataset.index);
        this.openImageModal(index);
      });
    });
  }

  openImageModal(index) {
    const image = this.images[index];
    const modalImage = this.container.querySelector('#galleryModalImage');
    const modalTitle = this.container.querySelector('#galleryModalTitle');
    
    modalImage.src = image.src;
    modalImage.alt = image.alt;
    modalTitle.textContent = image.title;
    
    const modal = new bootstrap.Modal(this.container.querySelector('#galleryModal'));
    modal.show();
  }
}

// Componente: ReviewsComponent - Componente de reseñas reutilizable
class ReviewsComponent {
  constructor(container, reviews = []) {
    this.container = container;
    this.reviews = reviews;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="reviews-container">
        ${this.reviews.map(review => `
          <div class="review-card card mb-4">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 class="text-gold mb-1">
                    <i class="bi bi-person-fill me-2"></i>
                    ${review.visitor_name}
                  </h5>
                  <p class="text-muted small mb-0">
                    <i class="bi bi-star-fill text-warning me-1"></i>
                    ${'⭐'.repeat(review.rating)} (${review.rating}/5)
                  </p>
                </div>
                <div class="text-muted small">
                  <i class="bi bi-clock-fill me-1"></i>
                  ${new Date(review.created_at).toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              
              <div class="mb-3">
                <strong class="text-light">Personaje Favorito:</strong>
                <span class="badge bg-burgundy ms-2">
                  <i class="bi bi-heart-fill me-1"></i>
                  ${review.favorite_character}
                </span>
              </div>
              
              <p class="card-text text-muted">
                "${review.comment}"
              </p>
              
              <div class="review-actions mt-3">
                <button class="btn btn-sm btn-outline-light me-2">
                  <i class="bi bi-hand-thumbs-up-fill me-1"></i>
                  Útil (${Math.floor(Math.random() * 20) + 5})
                </button>
                <button class="btn btn-sm btn-outline-danger">
                  <i class="bi bi-flag-fill me-1"></i>
                  Reportar
                </button>
              </div>
            </div>
          </div>
        `).join('')}
        
        ${this.reviews.length === 0 ? `
          <div class="text-center py-5">
            <i class="bi bi-chat-dots display-1 text-muted mb-3 d-block"></i>
            <h5 class="text-muted">Sé el primero en compartir tu opinión sobre The Godfather</h5>
            <p class="text-muted">¡Tu reseña podría ser la primera!</p>
          </div>
        ` : ''}
      </div>
    `;
  }

  addReview(reviewData) {
    this.reviews.unshift(reviewData);
    this.render();
  }

  removeReview(id) {
    this.reviews = this.reviews.filter(review => review.id !== id);
    this.render();
  }
}

// Exportar componentes para uso global
window.CharacterCard = CharacterCard;
window.QuizComponent = QuizComponent;
window.TimelineComponent = TimelineComponent;
window.GalleryComponent = GalleryComponent;
window.ReviewsComponent = ReviewsComponent;

// Factory function para inicializar componentes
export const componentFactory = {
  createCharacterCard: (container, character) => new CharacterCard(container, character),
  createQuiz: (container, quizData) => new QuizComponent(container, quizData),
  createTimeline: (container, events) => new TimelineComponent(container, events),
  createGallery: (container, images) => new GalleryComponent(container, images),
  createReviews: (container, reviews) => new ReviewsComponent(container, reviews)
};