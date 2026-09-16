/**
 * Audit GEO/AEO : le site est-il exploitable par un moteur de réponse ?
 *
 *   node audit-geo.mjs                    depuis la racine d'un projet, sur dist/
 *   node audit-geo.mjs https://un-site    sur un site en ligne
 *
 * Ce script mesure ce qui est mesurable : accès des robots, présence des faits,
 * autonomie des phrases. Il ne prétend pas prédire si un modèle citera le site.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';

/* Accepte le type simple et le balisage multi-types, plus précis. */
const aFicheEtablissement = (h) =>
  /"@type":\s*(?:"LocalBusiness"|\[[^\]]*"LocalBusiness"[^\]]*\])/.test(h);
import { join } from 'node:path';

const cible = process.argv[2];
const enLigne = Boolean(cible?.startsWith('http'));

const ROBOTS_IA = [
  ['GPTBot', 'OpenAI, entraînement'],
  ['OAI-SearchBot', 'OpenAI, recherche ChatGPT'],
  ['ChatGPT-User', 'OpenAI, navigation à la demande'],
  ['ClaudeBot', 'Anthropic'],
  ['Claude-User', 'Anthropic, navigation à la demande'],
  ['PerplexityBot', 'Perplexity'],
  ['Perplexity-User', 'Perplexity, navigation'],
  ['Google-Extended', 'Gemini et AI Overviews'],
  ['Applebot-Extended', 'Apple Intelligence'],
  ['CCBot', 'Common Crawl'],
];

// Un passage qui commence par un pronom perd son sens une fois extrait.
const ANAPHORES = /^\s*(il|elle|ils|elles|celui-ci|celle-ci|ceux-ci|cela|ça|c'est|on\s|y\s|en\s)/i;

let points = 0, total = 0;
const remarques = [];
const test = (ok, libelle, poids = 1) => {
  total += poids;
  if (ok) points += poids;
  else remarques.push(libelle);
};

const vert = '[32m', rouge = '[31m', jaune = '[33m', gris = '[90m', fin = '[0m';

/* ── récupération des pages ─────────────────────────────────────────────── */
let pages = [];
let robots = '';
let llms = null;

if (enLigne) {
  const base = cible.replace(/\/$/, '');
  const get = async (u) => {
    const r = await fetch(u, { headers: { 'user-agent': 'audit-geo/1.0' } });
    return r.ok ? await r.text() : null;
  };
  robots = (await get(`${base}/robots.txt`)) ?? '';
  llms = await get(`${base}/llms.txt`);
  const accueil = await get(`${base}/`);
  if (!accueil) {
    console.error(`\n  Impossible de lire ${base}/ — le site répond-il ?\n`);
    process.exit(1);
  }
  pages = [['/', accueil]];
  // on suit les liens internes trouvés sur l'accueil, sans récursion
  const liens = [...new Set([...accueil.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1]))].slice(0, 25);
  for (const l of liens) {
    const h = await get(base + l);
    if (h) pages.push([l, h]);
  }
} else {
  const fichiers = [];
  (function scan(d) {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) scan(p);
      else if (e.endsWith('.html')) fichiers.push(p);
    }
  })('dist');
  pages = fichiers.map((f) => [f === 'dist/index.html' ? '/' : f.replace('dist/', '').replace('/index.html', ''), readFileSync(f, 'utf8')]);
  robots = existsSync('dist/robots.txt') ? readFileSync('dist/robots.txt', 'utf8') : '';
  llms = existsSync('dist/llms.txt') ? readFileSync('dist/llms.txt', 'utf8') : null;
}

/* ── 1. accès des robots d'IA ───────────────────────────────────────────── */
console.log(`\nAUDIT GEO / AEO · ${pages.length} pages`);
console.log('───────────────────────────────────────────────────────────');
console.log('Accès des robots d\'IA');

const blocageGlobal = /User-agent:\s*\*[\s\S]*?Disallow:\s*\/\s*$/im.test(robots.split(/User-agent:/i)[1] ?? '');
for (const [bot, role] of ROBOTS_IA) {
  const bloc = new RegExp(`User-agent:\\s*${bot}[\\s\\S]*?(?=User-agent:|$)`, 'i').exec(robots)?.[0] ?? '';
  const nomme = bloc.length > 0;
  const interdit = /Disallow:\s*\/\s*(\n|$)/.test(bloc);
  total += 2;
  if (nomme && !interdit) {
    points += 2;
    console.log(`  ${vert}✓${fin} ${bot.padEnd(20)} ${gris}${role}${fin}`);
  } else if (nomme && interdit) {
    console.log(`  ${rouge}✗${fin} ${bot.padEnd(20)} ${rouge}explicitement bloqué${fin}`);
    remarques.push(`${bot} est bloqué dans robots.txt`);
  } else {
    console.log(`  ${jaune}~${fin} ${bot.padEnd(20)} ${gris}non nommé (soumis à la règle générale)${fin}`);
    remarques.push(`${bot} n'est pas autorisé explicitement`);
  }
}
if (blocageGlobal) {
  console.log(`\n  ${jaune}Le site est en Disallow: / pour tout le monde : aucun robot n'entre,${fin}`);
  console.log(`  ${jaune}IA comprises. Tout le reste de cet audit ne vaut qu'après ouverture.${fin}`);
}

/* ── 2. faits et structure ──────────────────────────────────────────────── */
console.log('\nFaits exploitables');
const accueil = pages.find(([n]) => n === '/')?.[1] ?? '';
const texteBrut = (h) => h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();

const controles = [
  [aFicheEtablissement(accueil), 'fiche d\'établissement en données structurées', 2],
  [/"openingHoursSpecification"/.test(accueil), 'horaires structurés', 1],
  [/"latitude"/.test(accueil), 'coordonnées géographiques', 1],
  [/"dateModified"/.test(accueil), 'date de mise à jour (fraîcheur)', 2],
  [pages.some(([, h]) => /"@type":"FAQPage"/.test(h)), 'au moins une page en questions-réponses balisées', 2],
  [pages.some(([, h]) => /"@type":"HowTo"/.test(h)), 'au moins une méthode balisée', 1],
  [llms !== null, 'llms.txt présent', 1],
];
for (const [ok, libelle, poids] of controles) {
  test(ok, libelle, poids);
  console.log(`  ${ok ? vert + '✓' : rouge + '✗'}${fin} ${libelle}`);
}

/* ── 3. citabilité ──────────────────────────────────────────────────────── */
console.log('\nCitabilité du contenu');
let phrases = 0, anaphores = 0, longues = 0, questions = 0;
for (const [, h] of pages) {
  const corps = /<main[\s\S]*?>([\s\S]*?)<\/main>/.exec(h)?.[1] ?? h;
  questions += (corps.match(/<h[23][^>]*>[^<]*\?[^<]*<\/h[23]>/g) ?? []).length;
  for (const p of corps.match(/<p[^>]*>[\s\S]*?<\/p>/g) ?? []) {
    const t = texteBrut(p);
    if (t.length < 40) continue;
    for (const ph of t.split(/(?<=[.!?])\s+/)) {
      if (ph.length < 30) continue;
      phrases++;
      if (ANAPHORES.test(ph)) anaphores++;
      if (ph.split(/\s+/).length > 35) longues++;
    }
  }
}
const partAnaphores = phrases ? Math.round((anaphores / phrases) * 100) : 0;
const partLongues = phrases ? Math.round((longues / phrases) * 100) : 0;

test(partAnaphores <= 12, `${partAnaphores} % de phrases commencent par un pronom (viser 12 % ou moins)`, 3);
test(partLongues <= 12, `${partLongues} % de phrases dépassent 35 mots (viser 12 % ou moins)`, 2);
test(questions >= 3, `seulement ${questions} titre(s) formulé(s) en question sur le site`, 2);
console.log(`  ${partAnaphores <= 12 ? vert + '✓' : rouge + '✗'}${fin} phrases ouvrant sur un pronom : ${partAnaphores} % ${gris}(${anaphores}/${phrases})${fin}`);
console.log(`  ${partLongues <= 12 ? vert + '✓' : rouge + '✗'}${fin} phrases de plus de 35 mots : ${partLongues} %`);
console.log(`  ${questions >= 3 ? vert + '✓' : rouge + '✗'}${fin} titres formulés en question : ${questions}`);

/* ── 4. résultat ────────────────────────────────────────────────────────── */
const note = Math.round((points / total) * 100);
console.log('───────────────────────────────────────────────────────────');
if (remarques.length) {
  console.log('À corriger :');
  for (const r of remarques) console.log('  ✗', r);
  console.log('───────────────────────────────────────────────────────────');
}
const couleur = note >= 90 ? vert : note >= 70 ? jaune : rouge;
console.log(`  Note : ${couleur}${note}/100${fin}   (${points} points sur ${total})`);
console.log(`  ${gris}Cet audit mesure l'accès et la forme. Il ne prédit pas si un modèle${fin}`);
console.log(`  ${gris}citera le site : cela dépend aussi de sources tierces, hors du site.${fin}\n`);
