import { site, communes, svg } from './site.mjs';
import { prestations } from './data/prestations.mjs';

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const sansBalises = (s) => String(s).replace(/<[^>]+>/g, '');

/* Adresse affichée en deux morceaux, l'arobase est ajoutée par le CSS : elle est donc
   lisible sans JavaScript, elle ne provoque aucun décalage au chargement, et elle
   n'apparaît jamais en clair dans le HTML (robots de collecte). */
export const adresseAffichee = () =>
  `<span class="courriel"><span>${site.mailParts[0]}</span><span>${site.mailParts[1]}</span></span>`;

/* ---------- liens contextuels en pleine phrase ---------- */
const motsPrestations = [
  [/\bménage régulier\b|\bentretien régulier\b/i, 'menage-entretien-regulier-morbihan'],
  [/\bbureaux\b/i, 'nettoyage-bureaux-morbihan'],
  [/\bparties communes\b|\bcopropriétés?\b/i, 'nettoyage-coproprietes-morbihan'],
  [/\bvitres\b/i, 'nettoyage-vitres-morbihan'],
  [/\bterrasses?\b/i, 'nettoyage-terrasse-morbihan'],
  [/\bremise en état\b|\bdéménagement\b/i, 'nettoyage-demenagement-morbihan'],
  [/\bfins? de chantier\b/i, 'nettoyage-fin-de-chantier-morbihan'],
  [/\bsyndrome de Diogène\b|\bnettoyage extrême\b/i, 'nettoyage-syndrome-diogene-morbihan'],
];
const motsCommunes = communes.map((c) => [new RegExp(`\\b${c.nom}\\b`), c.slug]);
// Pose un lien sur la première occurrence de chaque expression, en évitant la page courante
// et tout ce qui est déjà dans une balise.
function lier(html, regles, prefixe, exclure) {
  let out = html;
  for (const [re, slug] of regles) {
    if (slug === exclure) continue;
    const m = re.exec(out);
    if (!m) continue;
    const avant = out.slice(0, m.index);
    if ((avant.match(/<a\b/g) || []).length !== (avant.match(/<\/a>/g) || []).length) continue;
    out = avant + `<a href="${prefixe}${slug}/">${m[0]}</a>` + out.slice(m.index + m[0].length);
  }
  return out;
}
export const lierPrestations = (html, exclure) => lier(html, motsPrestations, '/services/', exclure);
export const lierCommunes = (html, exclure) => lier(html, motsCommunes, '/', exclure);

/* ---------- gabarit de page ---------- */
export function layout({ path, titre, description, corps, schema = [], classe = '', noindex = false, ogImage = site.ogImage, preloadImage = null }) {
  const url = site.url + path;
  const ld = schema.length
    ? `<script type="application/ld+json">${JSON.stringify(schema.length === 1 ? schema[0] : { '@context': 'https://schema.org', '@graph': schema })}</script>`
    : '';
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(titre)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${url}">
  ${noindex || process.env.SITE_PREVIEW ? '<meta name="robots" content="noindex, nofollow">' : ''}
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(titre)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${site.url}${ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Florence Marionnel devant sa camionnette La Fée Ménage">
  <meta name="twitter:image" content="${site.url}${ogImage}">
  <meta property="og:locale" content="fr_FR">
  <meta property="og:site_name" content="${site.nom}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#F3E1E6">
  ${preloadImage ? `<link rel="preload" as="image" href="${preloadImage.src}" imagesrcset="${preloadImage.srcset}" imagesizes="${preloadImage.sizes}" fetchpriority="high">` : ''}
  <link rel="preload" href="/assets/fonts/sentient-500.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/sentient-500-italic.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/quicksand-500.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/fonts/fonts.css">
  <link rel="stylesheet" href="/assets/css/main.css">
  <link rel="icon" href="/assets/images/logo/fee-favicon.png" type="image/png">
  ${ld}
</head>
<body class="${classe}">
  <a href="#contenu" class="skip-link">Aller au contenu</a>
  ${header(path)}
  <main id="contenu">
${corps}
  </main>
  ${footer()}
  ${barreMobile()}
  <script src="/assets/js/main.js" defer></script>
</body>
</html>
`;
}

/* ---------- en-tête ---------- */
export function logo(petit = false) {
  return `<a href="/" class="logo" title="Accueil">
      <img src="/assets/images/fee-logo.png" alt="" width="44" height="56">
      <span class="logo__texte"><span class="logo__nom">La fée ménage</span><span class="logo__sous">Nettoyage · entretien</span></span>
    </a>`;
}

export function header(path = '/') {
  const menuPrestations = prestations.map((p) => `<a href="/services/${p.slug}/"><strong>${p.nom}</strong><span>${esc(p.court)}</span></a>`).join('');
  const menuCommunes = communes.map((c) => `<a href="/${c.slug}/"><strong>${c.nom}</strong><span>${c.temps === 'siège' ? 'le point de départ' : c.temps + ' de route'}</span></a>`).join('')
    + `<a href="/morbihan/"><strong>Une autre commune ?</strong><span>Tout le Morbihan, devis sous 24 h</span></a>`;
  return `<header class="entete-site" id="entete">
  <div class="container entete-site__inner">
    ${logo()}
    <nav class="nav" aria-label="Navigation principale">
      <ul class="nav__liste" role="list">
        <li class="nav__item nav__item--menu">
          <a href="/services/menage-entretien-regulier-morbihan/" class="nav__lien" aria-haspopup="true" aria-expanded="false">Prestations ${svg.chevron}</a>
          <div class="nav__menu nav__menu--large">${menuPrestations}</div>
        </li>
        <li class="nav__item nav__item--menu">
          <a href="/morbihan/" class="nav__lien" aria-haspopup="true" aria-expanded="false">Communes ${svg.chevron}</a>
          <div class="nav__menu">${menuCommunes}</div>
        </li>
        <li><a href="/a-propos/" class="nav__lien">Florence</a></li>
        <li><a href="/contact/" class="nav__lien">Contact</a></li>
      </ul>
      <a href="/contact/#devis" class="btn btn--primaire btn--petit nav__cta">Demander un devis</a>
    </nav>
    <div class="entete-site__droite">
      <a href="/contact/#devis" class="btn btn--primaire btn--petit entete-site__cta">Demander un devis</a>
      <button class="burger" id="burger" aria-expanded="false" aria-controls="nav-mobile" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button>
    </div>
  </div>
  <nav class="nav-mobile" id="nav-mobile" data-ouvert="false" aria-label="Navigation mobile">
    <div class="container">
      <div class="nav-mobile__groupe"><p class="nav-mobile__titre">Prestations</p><div class="nav-mobile__deux">${prestations.map((p) => `<a href="/services/${p.slug}/">${p.nom}</a>`).join('')}</div></div>
      <div class="nav-mobile__groupe"><p class="nav-mobile__titre">Communes</p><div class="nav-mobile__deux">${communes.map((c) => `<a href="/${c.slug}/">${c.nom}</a>`).join('')}<a href="/morbihan/">Une autre commune ?</a></div></div>
      <div class="nav-mobile__groupe"><a href="/a-propos/">Florence Marionnel</a><a href="/contact/">Contact et devis</a><a href="${site.telHref}">${site.tel}</a></div>
    </div>
  </nav>
</header>`;
}

/* ---------- pied de page ---------- */
export function footer() {
  return `<footer class="pied">
  <div class="container">
    <div class="pied__grille">
      <div class="pied__marque">
        ${logo()}
        <p>Entreprise de nettoyage installée à ${site.adresse.ville}, dans le Morbihan. Une seule interlocutrice, des produits écologiques, un devis après visite.</p>
      </div>
      <nav aria-labelledby="pied-prestations">
        <h2 id="pied-prestations">Prestations</h2>
        <ul role="list">${prestations.map((p) => `<li><a href="/services/${p.slug}/">${p.nom}</a></li>`).join('')}</ul>
      </nav>
      <nav aria-labelledby="pied-communes">
        <h2 id="pied-communes">Communes</h2>
        <ul role="list">${communes.map((c) => `<li><a href="/${c.slug}/">Nettoyage à ${c.nom}</a></li>`).join('')}<li><a href="/morbihan/">Tout le Morbihan</a></li></ul>
      </nav>
      <div>
        <h2>Contact</h2>
        <address>${site.nom}, ${site.proprietaire}<br>${site.adresse.rue}<br>${site.adresse.cp} ${site.adresse.ville}</address>
        <ul role="list">
          <li><a href="${site.telHref}">${site.tel}</a></li>
          <li><a href="#" data-mail>Écrire un mail</a></li>
          <li><a href="/contact/#devis">Demander un devis</a></li>
        </ul>
      </div>
    </div>
    <div class="pied__bas">
      <p>© <span data-annee>2026</span> ${site.nom}, ${site.proprietaire}. SIRET ${site.siret}.</p>
      <nav aria-label="Liens légaux"><a href="/mentions-legales/">Mentions légales</a><a href="${site.avisUrl}" rel="noopener" target="_blank">Laisser un avis Google</a></nav>
    </div>
  </div>
</footer>`;
}

/* ---------- barre mobile fixe ---------- */
export function barreMobile() {
  return `<div class="barre-mobile" id="barre-mobile">
    <a href="#" data-mail class="btn btn--primaire">${svg.mail} M'écrire un mail</a>
    <a href="${site.telHref}" class="btn btn--secondaire" aria-label="Appeler Florence au ${site.tel}">${svg.tel}</a>
  </div>`;
}

/* ---------- fil d'Ariane ---------- */
export function ariane(items) {
  const li = items.map(([nom, href], i) => (href && i < items.length - 1) ? `<li><a href="${href}">${nom}</a></li>` : `<li aria-current="page">${nom}</li>`).join('');
  return `<nav class="ariane container" aria-label="Fil d'Ariane"><ol role="list">${li}</ol></nav>`;
}
export function arianeSchema(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([nom, href], i) => ({ '@type': 'ListItem', position: i + 1, name: sansBalises(nom), item: site.url + (href || '') })),
  };
}

/* ---------- FAQ ---------- */
export function faq(items, titre = 'Vos questions', id = 'faq') {
  return `<section class="section" aria-labelledby="${id}-titre">
    <div class="container--narrow">
      <div class="entete"><p class="sur-titre">Questions fréquentes</p><h2 id="${id}-titre">${titre}</h2></div>
      <div class="faq">
        ${items.map(([q, r]) => `<details><summary>${q}</summary><div class="faq__reponse"><p>${r}</p></div></details>`).join('\n')}
      </div>
    </div>
  </section>`;
}
export function faqSchema(items) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map(([q, r]) => ({ '@type': 'Question', name: sansBalises(q), acceptedAnswer: { '@type': 'Answer', text: sansBalises(r) } })),
  };
}

/* ---------- section devis : étapes + carte de contact ---------- */
export function sectionDevis({ titre = 'Demander un devis', commune = '', prestation = '' } = {}) {
  return `<section class="section" id="demande" aria-labelledby="devis-titre">
    <div class="container devis">
      <div class="devis__aside">
        <p class="sur-titre">Devis gratuit</p>
        <h2 id="devis-titre">${titre}</h2>
        <p class="lead">Écrivez-moi ou appelez-moi. Je vous rappelle, on convient d'une visite, et vous recevez un devis écrit qui ne bouge plus.</p>
        <ol class="devis__etapes" role="list">
          <li><strong>Vous m'écrivez ou vous m'appelez</strong>Réponse sous 24 h, souvent le jour même.</li>
          <li><strong>Je viens voir le lieu</strong>Visite gratuite, on note ensemble ce qu'il faut faire, pièce par pièce.</li>
          <li><strong>Vous recevez le devis</strong>Écrit et détaillé. Vous restez libre de donner suite, et le prix tient jusqu'à la fin du chantier.</li>
        </ol>
      </div>
      <div class="carte-contact" id="devis">
        <p class="carte-contact__titre">Un mail, ou un coup de fil</p>
        <p class="petit">Dites-moi votre commune, ce dont vous avez besoin et quand vous êtes joignable. Le reste, on le voit ensemble.</p>
        <a href="#" data-mail class="btn btn--primaire">${svg.mail} M'écrire un mail</a>
        <a href="${site.telHref}" class="btn btn--secondaire">${svg.tel} ${site.tel}</a>
        <p class="carte-contact__adresse petit">Adresse : ${adresseAffichee()}</p>
        <p class="petit">${site.horaires[0][0]} ${site.horaires[0][1]}, ${site.horaires[1][0].toLowerCase()} ${site.horaires[1][1]}. Vos coordonnées restent dans votre messagerie et dans la mienne.</p>
      </div>
    </div>
  </section>`;
}

/* ---------- bandeau d'appel (bas de page intérieure) ---------- */
export function appel({ titre = 'Un devis après visite, un prix qui tient', texte = 'Décrivez votre besoin, je vous réponds sous 24 h.', commune = '', prestation = '' } = {}) {
  const href = '/contact/#devis';
  return `<section class="section" aria-label="Demander un devis">
    <div class="container"><div class="appel">
      <div><h2>${titre}</h2><p class="lead">${texte}</p></div>
      <div class="appel__actions"><a href="#" data-mail class="btn btn--primaire">${svg.mail} M'écrire un mail</a><a href="${site.telHref}" class="btn btn--secondaire">${svg.tel} ${site.tel}</a></div>
    </div></div>
  </section>`;
}

/* ---------- données structurées de l'entreprise ---------- */
export function entrepriseSchema(extra = {}) {
  return {
    '@type': ['LocalBusiness', 'CleaningService'],
    '@id': site.url + '/#entreprise',
    name: site.nom,
    founder: { '@type': 'Person', name: site.proprietaire },
    url: site.url,
    logo: site.url + '/assets/images/logo/logo-la-fee-menage.png',
    image: site.url + site.ogImage,
    telephone: '+33641843634',
    taxID: site.siretBrut,
    address: { '@type': 'PostalAddress', streetAddress: site.adresse.rue, postalCode: site.adresse.cp, addressLocality: site.adresse.ville, addressRegion: 'Bretagne', addressCountry: 'FR' },
    geo: { '@type': 'GeoCoordinates', latitude: 47.946204, longitude: -3.087061 },
    hasMap: 'https://www.google.com/maps/place/?q=place_id:ChIJO04JueNJEEgR9HvGzNV5fms',
    sameAs: ['https://g.page/r/ChIJO04JueNJEEgR9HvGzNV5fms'],
    knowsAbout: ['ménage à domicile', 'entretien régulier', 'nettoyage de bureaux', 'nettoyage de copropriétés', 'nettoyage de vitres', 'nettoyage de terrasses', 'remise en état de logement', 'nettoyage de fin de chantier', 'nettoyage extrême', 'syndrome de Diogène'],
    foundingLocation: { '@type': 'Place', name: 'Melrand, Morbihan' },

    areaServed: [...communes.map((c) => ({ '@type': 'City', name: c.nom })), { '@type': 'AdministrativeArea', name: 'Morbihan' }],
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '12:00' },
    ],
    priceRange: 'Devis après visite',
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '5', reviewCount: String(site.nbAvis), bestRating: '5', worstRating: '1' },
    hasCredential: { '@type': 'EducationalOccupationalCredential', name: 'Certifiée BGE' },
    dateModified: new Date().toISOString().slice(0, 10),
    ...extra,
  };
}
