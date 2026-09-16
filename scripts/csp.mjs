/**
 * Génère vercel.json (en-têtes de sécurité, cache, redirections) à partir du build.
 *   node scripts/csp.mjs --ecrire   régénère vercel.json (en local, à committer)
 *   node scripts/csp.mjs            vérifie que vercel.json correspond au build, échoue sinon
 * Vercel lit vercel.json avant de compiler : il doit être à jour dans le dépôt.
 * Toute règle se règle ICI, jamais à la main dans vercel.json.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const pages = [];
(function parcourir(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) parcourir(p);
    else if (e.endsWith('.html')) pages.push(p);
  }
})('dist');

// Seuls les scripts exécutables comptent : application/ld+json n'est jamais exécuté.
const hachages = new Set();
for (const f of pages) {
  const html = readFileSync(f, 'utf8');
  for (const m of html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)) {
    const type = /type="([^"]+)"/.exec(m[1])?.[1];
    if (type && type !== 'text/javascript' && type !== 'module') continue;
    hachages.add(`'sha256-${createHash('sha256').update(m[2]).digest('base64')}'`);
  }
}

const csp = [
  "default-src 'none'",
  `script-src 'self'${hachages.size ? ' ' + [...hachages].sort().join(' ') : ''}`,
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "form-action 'self'",
  "base-uri 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

const securite = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
];

const config = {
  $schema: 'https://openapi.vercel.sh/vercel.json',
  framework: null,
  buildCommand: 'npm run build',
  outputDirectory: 'dist',
  cleanUrls: true,
  trailingSlash: true,
  headers: [
    { source: '/(.*)', headers: securite },
    // Les polices ne changent jamais sous le même nom : cache long.
    { source: '/assets/fonts/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    { source: '/assets/images/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000' }] },
    // CSS et JS sans condensat dans le nom : jamais immutable (voir ERRORS.md).
    { source: '/assets/(css|js)/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }] },
    { source: '/api/(.*)', headers: [{ key: 'Cache-Control', value: 'no-store' }] },
  ],
  redirects: [
    { source: '/(.*)', has: [{ type: 'host', value: 'la-fee-menage.fr' }], destination: 'https://www.la-fee-menage.fr/$1', permanent: true },
  ],
};

const attendu = JSON.stringify(config, null, 2) + '\n';
if (process.argv.includes('--ecrire')) {
  writeFileSync('vercel.json', attendu);
  console.log(`vercel.json écrit (${hachages.size} hachage(s) de script inline).`);
} else {
  let actuel = '';
  try { actuel = readFileSync('vercel.json', 'utf8'); } catch {}
  if (actuel !== attendu) {
    console.error('vercel.json ne correspond pas au build. Lancer : node scripts/csp.mjs --ecrire');
    const a = JSON.parse(actuel || '{}').headers?.[0]?.headers?.[0]?.value;
    console.error('CSP actuelle  :', a); console.error('CSP attendue  :', csp);
    process.exit(1);
  }
  console.log('vercel.json à jour.');
}
