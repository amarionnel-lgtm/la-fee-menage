/**
 * Assemble le site dans dist/ à partir de src/ (aucune dépendance).
 *   node scripts/build.mjs
 */
import { mkdirSync, rmSync, writeFileSync, cpSync, readdirSync, statSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { site } from '../src/site.mjs';

const DIST = 'dist';
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

// Pages : chaque module exporte { path, html } ou un tableau de ces objets.
const modules = ['index', 'prestations', 'villes', 'a-propos', 'contact', 'morbihan', 'mentions-legales', '404'];
const pages = [];
for (const m of modules) {
  const mod = (await import(`../src/pages/${m}.mjs`)).default;
  for (const p of Array.isArray(mod) ? mod : [mod]) pages.push(p);
}

for (const p of pages) {
  const fichier = p.fichier || (p.path.endsWith('/') ? join(DIST, p.path, 'index.html') : join(DIST, p.path));
  mkdirSync(dirname(fichier), { recursive: true });
  writeFileSync(fichier, p.html);
}

// Ressources statiques
cpSync('assets', join(DIST, 'assets'), { recursive: true, filter: (s) => !s.endsWith('.DS_Store') });

// Sitemap : uniquement les pages indexables
const indexables = pages.filter((p) => !p.noindex && p.path && !p.fichier);
const aujourdhui = new Date().toISOString().slice(0, 10);
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexables.map((p) => `  <url><loc>${site.url}${p.path}</loc><lastmod>${aujourdhui}</lastmod><priority>${p.priorite ?? (p.path === '/' ? '1.0' : '0.8')}</priority></url>`).join('\n')}
</urlset>
`);

// robots.txt : les robots d'IA sont nommés, sinon ils ne sont pas couverts par `*`
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *
Allow: /
Disallow: /mentions-legales/
Disallow: /api/

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${site.url}/sitemap.xml
`);

// llms.txt : la fiche de l'entreprise pour les moteurs de réponse
const { prestations } = await import('../src/data/prestations.mjs');
const { villes } = await import('../src/data/villes.mjs');
writeFileSync(join(DIST, 'llms.txt'), `# ${site.nom}

> Entreprise de nettoyage installée à ${site.adresse.ville} (${site.adresse.dep}, Bretagne), dirigée par ${site.proprietaire}, qui intervient elle-même chez les particuliers et les professionnels autour de Pontivy, Lorient, Auray et Vannes. Devis gratuit après visite du lieu. Produits écologiques. Note ${site.note}/5 sur Google.

Téléphone : ${site.tel}. Adresse : ${site.adresse.rue}, ${site.adresse.cp} ${site.adresse.ville}. Horaires : lundi au vendredi 8 h à 18 h, samedi 9 h à 12 h. SIRET ${site.siret}. Certifiée BGE et Certibiocides.

## Prestations

${prestations.map((p) => `- [${p.nom}](${site.url}/services/${p.slug}/) : ${p.court}`).join('\n')}

## Communes

${villes.map((v) => `- [${v.nom}](${site.url}/${v.slug}/) : ${v.temps === 'siège' ? "siège de l'entreprise" : v.temps + ' de route depuis Melrand'}`).join('\n')}
- [Tout le Morbihan](${site.url}/morbihan/)

## Pages utiles

- [À propos de Florence Marionnel](${site.url}/a-propos/)
- [Contact et devis](${site.url}/contact/)
`);

// Contrôle : aucune adresse mail en clair, aucun attribut style=
let erreurs = 0;
(function parcourir(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) parcourir(p);
    else if (e.endsWith('.html')) {
      const html = readFileSync(p, 'utf8');
      if (/[\w.-]+@[\w-]+\.[a-z]{2,}/i.test(html.replace(/https?:\/\/[^"'\s]+/g, ''))) { console.error('Adresse mail en clair :', p); erreurs++; }
      if (/\sstyle="/.test(html)) { console.error('Attribut style inline :', p); erreurs++; }
    }
  }
})(DIST);

console.log(`${pages.length} pages écrites dans ${DIST}/${erreurs ? `, ${erreurs} problème(s)` : ''}`);
if (erreurs) process.exit(1);
