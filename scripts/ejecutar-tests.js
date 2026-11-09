#!/usr/bin/env node
/* ==============================================
   Evidencia 21 — Pruebas de verificación técnica
   Ejecuta el verificador de requisitos y revisa
   el artefacto de producción generado por Vite.
   Uso: node scripts/ejecutar-tests.js  (requiere npm run build)
   ============================================== */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
let fallos = 0;

function paso(nombre, fn) {
  try {
    const detalle = fn();
    console.log(`✔ ${nombre}${detalle ? ` — ${detalle}` : ''}`);
  } catch (error) {
    fallos += 1;
    console.log(`✘ ${nombre} — ${error.message}`);
  }
}

console.log('\n  PRUEBAS TÉCNICAS — ARCHIVO CORLEONE\n');

/* 1. Requisitos académicos y estructurales */
paso('Verificación de requisitos', () => {
  execFileSync('node', ['scripts/check-requirements.js'], { cwd: ROOT, stdio: 'pipe' });
  return 'sin fallos';
});

/* 2. Build de producción */
paso('Build de producción existente', () => {
  if (!fs.existsSync(path.join(DIST, 'index.html'))) {
    throw new Error('ejecuta "npm run build" antes de esta prueba');
  }
  return 'dist/index.html';
});

/* 3. CSS y JS empaquetados con hash */
paso('CSS empaquetado', () => {
  const css = fs.readdirSync(path.join(DIST, 'assets')).find((f) => /^index-.*\.css$/.test(f));
  if (!css) throw new Error('no se encontró el CSS generado');
  const tamano = fs.statSync(path.join(DIST, 'assets', css)).size;
  if (tamano < 5000) throw new Error('el CSS es sospechosamente pequeño');
  return `${css} (${Math.round(tamano / 1024)} KB)`;
});

paso('JavaScript empaquetado', () => {
  const js = fs.readdirSync(path.join(DIST, 'assets')).find((f) => /^index-.*\.js$/.test(f));
  if (!js) throw new Error('no se encontró el JS generado');
  const codigo = fs.readFileSync(path.join(DIST, 'assets', js), 'utf8');
  ['movieFacts', 'charactersGrid', 'quizQuestions', 'reviewsList'].forEach((id) => {
    if (!codigo.includes(id)) throw new Error(`falta la referencia a #${id}`);
  });
  return js;
});

/* 4. Recursos estáticos publicados */
paso('Imágenes de personajes publicadas', () => {
  const dir = path.join(DIST, 'assets/images/characters');
  const total = fs.readdirSync(dir).filter((f) => /\.(jpg|png)$/.test(f)).length;
  if (total < 7) throw new Error(`solo ${total} imágenes en dist`);
  return `${total} imágenes`;
});

paso('favicon publicado', () => {
  if (!fs.existsSync(path.join(DIST, 'assets/images/favicon.svg'))) {
    throw new Error('falta favicon.svg');
  }
  return 'ok';
});

/* 5. Sin rastros de desarrollo en el artefacto */
paso('Sin restos de desarrollo en dist/index.html', () => {
  const html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
  if (html.includes('localhost:5183') || html.includes('/src/assets/js/main.js')) {
    throw new Error('el HTML de producción referencia archivos de desarrollo');
  }
  return 'ok';
});

console.log(`\n  ${fallos === 0 ? 'TODAS LAS PRUEBAS PASARON' : `${fallos} PRUEBA(S) FALLARON`}\n`);
process.exit(fallos === 0 ? 0 : 1);
