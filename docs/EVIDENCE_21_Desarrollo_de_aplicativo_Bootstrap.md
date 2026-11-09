# Evidencia 21 — Desarrollo de aplicativo Bootstrap

**Programa:** Técnico en Programación de Software  
**Código:** 233104  
**Proyecto:** The Godfather — Archivo Corleone  
**Año:** 2026

---

## 1. Descripción del proyecto

Archivo cinematográfico digital interactivo sobre *The Godfather* (1972). La aplicación
permite recorrer la ficha técnica, los personajes, la cronología narrativa, el legado
de la película, una galería de retratos y un quiz de conocimientos. Incluye un módulo
de opiniones que persiste en Supabase o, si no hay credenciales configuradas, en el
almacenamiento local del navegador.

El objetivo es demostrar el uso real de **Bootstrap 5.3** en una interfaz responsiva,
accesible y con identidad visual propia, sin recurrir a frameworks de interfaz como
React, Angular o Vue.

## 2. Requisitos y cumplimiento

| Requisito de la evidencia | Implementación | Estado |
|---|---|---|
| Sistema de rejilla | `container`, `row`, `col-lg-*`, `col-md-*` y utilidades `g-*` en todas las secciones | Cumplido |
| Barra de navegación | `navbar navbar-expand-lg fixed-top` con `collapse` y toggler | Cumplido |
| Tarjetas | `card`, `card-img-top`, `card-body`, `card-title` en personajes y fichas | Cumplido |
| Formularios | `form-control`, `form-select`, `form-label`, `invalid-feedback` | Cumplido |
| Modales | `modal fade`, `modal-dialog`, `modal-content`, `btn-close` | Cumplido |
| Botones y utilidades | `btn`, `btn-primary`, `btn-outline-*`, `d-flex`, `mt-*` | Cumplido |
| Alertas | `alert alert-warning` para el aviso de spoilers | Cumplido |
| Badges | `badge bg-burgundy` en la ficha técnica | Cumplido |
| Diseño adaptable | Verificado a 375 px, 768 px y 1440 px sin desbordamiento horizontal | Cumplido |
| Accesibilidad | HTML semántico, foco visible, teclado, `prefers-reduced-motion` | Cumplido |
| Sin jQuery ni frameworks JS | JavaScript nativo con módulos ES | Cumplido |

## 3. Arquitectura

### 3.1 Estructura real del proyecto

```
godfather-project/
├── index.html                       # Documento único de la aplicación
├── src/
│   ├── assets/
│   │   ├── css/main.css             # Capa de identidad sobre Bootstrap
│   │   └── js/
│   │       ├── main.js              # Renderizado e interacciones
│   │       └── supabase.js          # Cliente Supabase y respaldo local
│   └── data/movie-data.js           # Datos de película, personajes y quiz
├── public/assets/images/            # Retratos, favicon, iconos
├── database/migrations/             # Esquema SQL y políticas RLS
├── docs/                            # Esta evidencia y capturas
├── scripts/                         # Verificación y pruebas técnicas
├── vite.config.ts
└── tsconfig.json
```

### 3.2 Organización del código

- **`index.html`**: estructura semántica y contenedores vacíos que JavaScript
  rellena (`#movieFacts`, `#charactersGrid`, `#galleryGrid`, `#quizQuestions`,
  `#reviewsList`). Los modales y el navbar son componentes nativos de Bootstrap.
- **`main.css`**: no reemplaza Bootstrap; redefine sus variables
  (`--bs-body-bg`, `--bs-primary`, `--bs-border-color`) y estiliza sus componentes.
- **`main.js`**: módulos de renderizado, scrollspy con `IntersectionObserver`,
  quiz, validación del formulario, persistencia y avisos accesibles.
- **`movie-data.js`**: única fuente de verdad del contenido.

## 4. Dirección de arte

- **Paleta:** negro (#10100F), carbón (#191817), borgoña (#3A1118),
  dorado envejecido (#B99A58), marfil (#EAE2D2) y gris cálido (#858078).
- **Tipografía:** Playfair Display para títulos y Source Sans Pro para texto.
- **Composición:** retícula editorial amplia, filetes dorados, viñetas
  cinematográficas y retratos en blanco y negro que recuperan color al pasar el cursor.
- **Movimiento:** transiciones cortas con `cubic-bezier`, revelado al hacer scroll
  y respeto total a `prefers-reduced-motion`.

## 5. Funcionalidades

1. **Navegación** fija con estado activo según la sección visible.
2. **Ficha técnica** generada desde datos: ocho campos, sinopsis y contexto.
3. **Personajes** en tarjetas-póster; el modal muestra intérprete, rol, edad,
   biografía y frases.
4. **Cronología** de producción y cronología narrativa con aviso de spoilers.
5. **Legado** con reconocimientos verificables y oficio cinematográfico.
6. **Galería** de siete retratos ampliables en modal.
7. **Quiz** de ocho preguntas con barra de progreso, calificación inmediata y reinicio.
8. **Opiniones** con validación de cuatro campos, persistencia y listado en vivo.

## 6. Pruebas realizadas

### 6.1 Automáticas

```bash
npm run check:requirements     # 36/36 comprobaciones superadas
npm run build                  # build de producción correcto
node scripts/ejecutar-tests.js # 6/6 pruebas técnicas superadas
```

El verificador comprueba estructura, componentes de Bootstrap, ausencia de jQuery,
seguridad de credenciales, RLS, imágenes y documentación.

### 6.2 En navegador (build de producción)

Verificación ejecutada con Chrome DevTools sobre `dist/`:

| Comprobación | Resultado |
|---|---|
| Tarjetas de personaje renderizadas | 7 |
| Imágenes de galería | 7 |
| Preguntas del quiz | 8 |
| Datos de ficha técnica | 8 |
| Bootstrap JS disponible | Sí |
| Modal de personaje | Abre y cierra |
| Modal de galería | Abre y cierra |
| Quiz con respuestas correctas | 8/8 (100 %) |
| Reinicio del quiz | Estado limpio |
| Validación del formulario | 4 campos marcados |
| Persistencia local de una opinión | Guardada y renderizada |
| Errores de consola | 0 |
| Imágenes rotas | 0 de 14 |
| Desbordamiento horizontal (375/768/1440) | Ninguno |

El informe completo está en `docs/screenshots/verificacion.json`.

### 6.3 Pruebas manuales

- Navegación con teclado y activación de tarjetas con Enter/Espacio.
- Cierre de modales con `Esc` y con el botón correspondiente.
- Menú móvil sólido, sin transparencias sobre el hero.
- Revisión visual en 1440 px, 768 px y 375 px.

## 7. Base de datos

### 7.1 Esquema

La migración `database/migrations/001_initial_setup.sql` crea:

- Tabla `movie_reviews` con validaciones de longitud y rango (1–5).
- Índices por fecha, calificación y personaje.
- **RLS habilitado** con lectura pública e inserción anónima; sin `UPDATE`
  ni `DELETE` desde el cliente.
- Trigger de `updated_at` y vista `review_stats`.

### 7.2 Seguridad

- El cliente solo usa `VITE_SUPABASE_ANON_KEY` (clave publicable).
- La `service_role` no aparece en el código ni en el repositorio.
- Si no hay credenciales, la aplicación informa "Modo local" y usa
  `localStorage` con la clave `corleone_reviews`.

## 8. Diseño responsive

| Rango | Comportamiento |
|---|---|
| ≥ 992 px | Navbar expandido, tres tarjetas por fila, galería de cuatro columnas |
| 768–991 px | Navbar colapsado con panel sólido, dos tarjetas por fila |
| 576–767 px | Una tarjeta por fila, galería de dos columnas |
| < 420 px | Galería de una columna, botones a ancho completo |

## 9. Capturas de pantalla

Las 18 capturas están en `docs/screenshots/`:

| Archivo | Contenido |
|---|---|
| `01-hero-desktop.png` | Portada y navbar |
| `02-pelicula-desktop.png` | Ficha técnica y cronología de producción |
| `03-personajes-desktop.png` | Tarjetas de personajes |
| `04-cronologia-desktop.png` | Cronología narrativa |
| `05-legado-desktop.png` | Legado cinematográfico |
| `06-galeria-desktop.png` | Galería |
| `07-quiz-desktop.png` | Quiz sin responder |
| `08-quiz-resultado.png` | Quiz calificado |
| `09-opiniones-desktop.png` | Formulario de opiniones |
| `10-modal-personaje.png` | Modal de personaje |
| `11-modal-galeria.png` | Modal de galería |
| `12-hero-mobile.png` | Portada en móvil |
| `13-menu-mobile.png` | Menú móvil desplegado |
| `14-personajes-mobile.png` | Personajes en móvil |
| `15-quiz-mobile.png` | Quiz en móvil |
| `16-opiniones-mobile.png` | Formulario en móvil |
| `17-hero-tablet.png` | Portada en tableta |
| `18-personajes-tablet.png` | Personajes en tableta |

## 10. Entregables

| Entregable | Estado |
|---|---|
| Aplicación funcional | ✅ Completa |
| README técnico | ✅ Completo |
| Documento de evidencia | ✅ Este documento |
| Migración SQL con RLS | ✅ Completa |
| Capturas reales | ✅ 18 imágenes |
| Verificación automatizada | ✅ 36/36 y 6/6 |
| Documento Word | ✅ `EVIDENCIA_21_Desarrollo_de_aplicativo_Bootstrap.docx` |
| Repositorio en GitHub | ✅ https://github.com/jeronimoparra-ai/the-godfather-archivo-corleone |
| Despliegue público (Vercel) | ✅ https://the-godfather-archivo-corleone-62hrx2hys.vercel.app (Supabase opcional; opiniones en local si no se configuran claves públicas) |

## 11. Limitaciones conocidas

- Sin credenciales de Supabase configuradas, las opiniones no se comparten entre dispositivos (modo local `localStorage`).
- Los retratos de los intérpretes son material de referencia académica; deben
  sustituirse por imágenes licenciadas para un uso comercial.
- El despliegue público está publicado en Vercel, pero **sin variables `VITE_SUPABASE_*`** configuradas en el hosting las opiniones quedan en modo local por navegador/dispositivo.
- No se ejecutó una auditoría formal con herramientas externas (axe, Lighthouse);
  las comprobaciones de accesibilidad son manuales y estructurales.

## 12. Conclusiones

La aplicación demuestra un uso real de Bootstrap 5.3: la rejilla, el navbar, las
tarjetas, los formularios, los modales, las alertas y las utilidades provienen del
framework, mientras que la capa propia aporta identidad visual. El resultado es
responsivo, accesible, verificable y documentado con evidencia ejecutada sobre el
build de producción.

---

*Documento generado a partir del estado real del proyecto. Las cifras de la sección 6
provienen de `docs/screenshots/verificacion.json`.*
