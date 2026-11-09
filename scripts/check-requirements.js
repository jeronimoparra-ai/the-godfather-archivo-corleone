#!/usr/bin/env node
/* ==============================================
   Evidencia 21 — Verificador de requisitos
   Comprueba, contra los archivos reales del proyecto,
   que se cumplan las condiciones académicas.
   Uso: npm run check:requirements
   ============================================== */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const results = [];

const read = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(ROOT, file));

function check(nombre, condicion, detalle = '') {
  results.push({ nombre, ok: Boolean(condicion), detalle });
}

/* 1. Archivos esenciales */
const archivos = [
  'index.html',
  'src/assets/css/main.css',
  'src/assets/js/main.js',
  'src/assets/js/supabase.js',
  'src/data/movie-data.js',
  'database/migrations/001_initial_setup.sql',
  'README.md',
  'docs/EVIDENCE_21_Desarrollo_de_aplicativo_Bootstrap.md',
];
archivos.forEach((file) => check(`Existe ${file}`, exists(file)));

/* 2. Bootstrap 5.3 real */
const html = read('index.html');
check('Bootstrap 5.3 cargado desde CDN', /bootstrap@5\.3\.\d+/.test(html));
check('Bootstrap Icons cargado', /bootstrap-icons@/.test(html));
check('Metaviewport responsivo', /<meta name="viewport"[^>]*width=device-width/.test(html));
check('Idioma español declarado', /<html lang="es">/.test(html));
check('HTML semántico (header/nav/main/section/footer)', ['<main', '<nav', '<section', '<footer'].every((t) => html.includes(t)));

/* 3. Componentes Bootstrap usados de verdad en el marcado */
const componentes = {
  'grid (.row/.col-*)': /class="[^"]*\b(row|col-(lg|md|sm|xs)?-?\d*)\b/,
  'navbar': /class="[^"]*navbar\b/,
  'cards': /class="[^"]*\bcard\b/,
  'formularios': /class="[^"]*\bform-(control|select|label)\b/,
  'modales': /class="[^"]*\bmodal\b/,
  'botones': /class="[^"]*\bbtn\b/,
  'alertas': /class="[^"]*\balert\b/,
  'badges': /class="[^"]*\bbadge\b/,
  'utilidades de espaciado': /class="[^"]*\b(m|p)[trblxy]?-\d\b/,
};
Object.entries(componentes).forEach(([nombre, re]) => check(`Usa ${nombre}`, re.test(html)));

/* 4. Sin dependencias prohibidas */
const todoElCodigo = [
  html,
  read('src/assets/js/main.js'),
  read('src/assets/js/supabase.js'),
].join('\n');
check('Sin jQuery', !/\bjquery\b/i.test(todoElCodigo));
check('Sin React/Angular/Vue', !/\b(react|angular|vue)\b/i.test(todoElCodigo));
check('Bootstrap JS se carga una sola vez', (html.match(/bootstrap\.bundle\.min\.js/g) || []).length === 1);

/* 5. Seguridad de credenciales */
const supabaseJs = read('src/assets/js/supabase.js');
check('Sin service_role en el cliente', !/service_role/.test(todoElCodigo));
check('Solo variables VITE_ públicas', /VITE_SUPABASE_ANON_KEY/.test(supabaseJs) && !/SUPABASE_SERVICE/.test(supabaseJs));
check('RLS declarado en la migración', /enable row level security/i.test(read('database/migrations/001_initial_setup.sql')));

/* 6. Contenido dinámico e imágenes */
const datos = read('src/data/movie-data.js');
const personajes = [...datos.matchAll(/image:\s*'([^']+)'/g)].map((m) => m[1]);
check('Siete personajes con imagen', personajes.length === 7, `${personajes.length} encontrados`);
const faltantes = personajes.filter(
  (img) => !exists(path.join('public/assets/images/characters', img))
);
check('Todas las imágenes de personajes existen', faltantes.length === 0, faltantes.join(', ') || 'ok');

/* 7. Scripts de npm */
const pkg = JSON.parse(read('package.json'));
['dev', 'build', 'preview', 'check:requirements'].forEach((script) =>
  check(`Script npm "${script}" definido`, Boolean(pkg.scripts[script]))
);

/* 8. Documentación y evidencias */
check('README describe instalación y ejecución', /npm run dev/.test(read('README.md')));
check(
  'Capturas de pantalla presentes',
  exists('docs/screenshots') &&
    fs.readdirSync(path.join(ROOT, 'docs/screenshots')).filter((f) => f.endsWith('.png')).length >= 5
);

/* Salida */
const ancho = Math.max(...results.map((r) => r.nombre.length));
let fallos = 0;
console.log('\n  EVALUACIÓN DE REQUISITOS — EVIDENCIA 21\n');
results.forEach((r) => {
  if (!r.ok) fallos += 1;
  console.log(`  ${r.ok ? '✔' : '✘'} ${r.nombre.padEnd(ancho)} ${r.detalle}`);
});
console.log(`\n  ${results.length - fallos}/${results.length} comprobaciones superadas.\n`);
process.exit(fallos === 0 ? 0 : 1);
