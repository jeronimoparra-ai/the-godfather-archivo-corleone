# Estado actual del proyecto

**Última actualización:** 9 de noviembre de 2026  
**Build:** `dist/` generado correctamente  
**Rama:** sin commits pendientes de publicar

## Resumen

La aplicación **The Godfather — Archivo Corleone** está completa y verificada sobre
el build de producción. Se rediseñó por completo la interfaz para usar Bootstrap 5.3
de forma demostrable (navbar, grid, cards, forms, modals, alerts, badges y utilidades)
con una capa de identidad cinematográfica.

## Verificación ejecutada

```
npm run check:requirements     36/36 comprobaciones superadas
npm run build                  correcto (CSS 25,6 KB / JS 24,9 KB)
node scripts/ejecutar-tests.js 6/6 pruebas superadas
```

En navegador (build de producción, Chrome DevTools):

- 7 tarjetas de personaje, 7 imágenes de galería, 8 preguntas, 8 datos técnicos.
- Modales de personaje y galería: apertura y cierre correctos.
- Quiz: 8/8 respuestas correctas y reinicio funcional.
- Formulario: 4 campos validados y opinión persistida en modo local.
- 0 errores de consola, 0 imágenes rotas (14/14) y sin desbordamiento horizontal
  en 375, 768 y 1440 px.

Informe: `docs/screenshots/verificacion.json`.

## Cambios principales del rediseño

1. `index.html` reescrito con Bootstrap nativo y contenedores renderizados por JS.
2. `src/assets/css/main.css` convertido en capa de identidad sobre variables de Bootstrap.
3. `main.js` reescrito: scrollspy, modales, quiz, validación, persistencia y toasts.
4. Tarjetas de personaje convertidas en pósteres con superposición y viñeta.
5. Retratos optimizados de ~6,7 MB a ~820 KB; `fredo-corleone.png` pasó a JPG.
6. Migración SQL corregida: RLS real, políticas idempotentes y validaciones.
7. Scripts de verificación reemplazados por comprobaciones reales del proyecto.
8. README y documento de evidencia actualizados; documentos obsoletos movidos a
   `docs/historico/`.

## Pendientes

| Tarea | Bloqueo |
|---|---|
| Documento Word de la evidencia | ✅ Generado en la raíz del proyecto |
| Publicación en GitHub | Requiere cuenta y repositorio del aprendiz |
| Despliegue público | Requiere credenciales de Supabase y cuenta de hosting |
| Sustituir retratos por material licenciado | Requiere banco de imágenes con licencia |

## Notas técnicas

- Bootstrap 5.3.3 y Bootstrap Icons 1.11.3 se cargan por CDN.
- Supabase es opcional: sin credenciales se usa `localStorage` (`corleone_reviews`)
  y la interfaz lo informa.
- Solo se usa la clave anónima publicable; nunca `service_role`.
- `npm run dev` usa el puerto 3000; `npm run preview` sirve el build en 4173.
