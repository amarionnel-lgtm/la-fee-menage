/**
 * Audit SEO du build : structure, balisage, maillage, cohérence.
 * Tout est vérifié sur dist/, donc sur ce qui sera réellement servi.
 *   node scripts/audit-seo.mjs
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';

/* Accepte le type simple et le balisage multi-types, plus précis. */
const aFicheEtablissement = (h) =>
  /"@type":\s*(?:"LocalBusiness"|\[[^\]]*"LocalBusiness"[^\]]*\])/.test(h);
import { join } from 'node:path';

const pages = [];
(function scan(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) scan(p);
    else if (e.endsWith('.html')) pages.push(p);
  }
})('dist');

const nom = (f) => f === 'dist/index.html' ? '/' : f.replace('dist/', '').replace('/index.html', '');
const lire = (f) => readFileSync(f, 'utf8');
let points = 0, total = 0;
const echecs = [];
const test = (ok, libelle, poids = 1) => {
  total += poids;
  if (ok) points += poids;
  else echecs.push(libelle);
};

// ── par page ───────────────────────────────────────────────────────────────
for (const f of pages) {
  const h = lire(f), n = nom(f);
  if (n === '404.html' || /name="robots" content="noindex/.test(h)) continue;
  const titre = /<title>(.*?)<\/title>/s.exec(h)?.[1] ?? '';
  const desc = /name="description" content="(.*?)"/s.exec(h)?.[1] ?? '';
  test(titre.length > 0 && titre.length <= 65, `${n} : title absent ou > 65 caractères (${titre.length})`);
  test(desc.length >= 70 && desc.length <= 158, `${n} : description hors de 70-158 caractères (${desc.length})`);
  test((h.match(/<h1[ >]/g) ?? []).length === 1, `${n} : il faut exactement un H1`);
  test(h.includes('rel="canonical"'), `${n} : canonique manquante`);
  test(!/<img(?![^>]*\balt=)/.test(h), `${n} : image sans attribut alt`);
  test(!/<[^>]*class="[^"]*"[^>]*class="/.test(h), `${n} : attribut class en double`);
  test(h.includes('"@type":"BreadcrumbList"') || n === '/', `${n} : fil d'ariane structuré manquant`);
  test(h.includes('class="ariane') || n === '/', `${n} : fil d'ariane visible manquant`);
  test(aFicheEtablissement(h), `${n} : fiche d'établissement manquante`);
  // le balisage ne doit pas décrire du contenu absent
  if (h.includes('"@type":"HowTo"')) {
    test(h.includes('id="etapes"'), `${n} : HowTo balisé sans étapes visibles sur la page`);
  }
}

// ── ensemble du site ───────────────────────────────────────────────────────
test(existsSync('dist/sitemap.xml'), 'sitemap absent', 2);
test(existsSync('dist/robots.txt'), 'robots.txt absent', 2);
test(existsSync('dist/404.html'), 'page 404 absente');
test(existsSync('dist/assets/images/og-accueil.jpg'), 'image de partage absente');

const accueil = lire('dist/index.html');
test(/"geo":\{[^}]*"latitude"/.test(accueil), 'coordonnées absentes de la fiche', 2);
test(/"areaServed"/.test(accueil), 'zone desservie absente de la fiche', 2);
test(/"openingHoursSpecification"/.test(accueil), 'horaires absents de la fiche', 2);

// NAP identique partout
const naps = new Set();
for (const f of pages) {
  const m = /"streetAddress":"([^"]+)","postalCode":"([^"]+)"/.exec(lire(f));
  if (m) naps.add(m[1] + '|' + m[2]);
}
test(naps.size === 1, `adresse incohérente entre les pages (${naps.size} variantes)`, 3);

// maillage : chaque page atteignable, et des liens en pleine phrase
const cibles = new Set();
for (const f of pages) for (const m of lire(f).matchAll(/href="(\/[^"#?]*)"/g)) cibles.add(m[1]);
const orphelines = pages.map(nom).filter((n) => n !== '/' && n !== '404.html')
  .filter((n) => !cibles.has('/' + n + '/') && !cibles.has('/' + n));
test(orphelines.length === 0, `pages non reliées : ${orphelines.join(', ')}`, 2);

let contextuels = 0;
for (const f of pages) {
  const corps = /<main[^>]*>(.*?)<\/main>/s.exec(lire(f))?.[1] ?? '';
  contextuels += (corps.match(/<p[^>]*>(?:(?!<\/p>).)*?<a\s/gs) ?? []).length;
}
test(contextuels >= 8, `seulement ${contextuels} liens en pleine phrase sur le site`, 2);

// ── résultat ───────────────────────────────────────────────────────────────
const note = Math.round((points / total) * 100);
console.log(`\nAUDIT SEO · ${pages.length} pages analysées`);
console.log('───────────────────────────────────────────────');
if (echecs.length) { console.log('À corriger :'); for (const e of echecs) console.log('  ✗', e); }
else console.log('  Aucun défaut détecté.');
console.log('───────────────────────────────────────────────');
console.log(`  Note : ${note}/100   (${points} points sur ${total})`);
console.log(`  ${contextuels} liens contextuels · ${cibles.size} URL internes distinctes\n`);
