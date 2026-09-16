import { site, communes, svg } from '../site.mjs';
import { prestations } from '../data/prestations.mjs';
import { pieces } from '../data/maison.mjs';
import { maisonSvg } from '../partials/maison-svg.mjs';
import { carteSvg } from '../partials/carte-svg.mjs';
import { layout, sectionDevis, entrepriseSchema } from '../partials.mjs';

const avis = [
  ["Reda B.", "Toujours réactive au téléphone, ponctuelle et fiable, et en plus elle fait du super ménage, c'est magique. Elle porte bien son nom, c'est une vraie fée. Je vous la recommande."],
  ["Amandine N.", "Je recommande chaudement cette société de ménage à tous ceux qui recherchent un service fiable et de haute qualité. Un travail exceptionnel, je suis très satisfaite."],
  ["Amélie C.", "Très professionnelle, disponible, organisée et rigoureuse. Je recommande !"],
  ["Stéphanie C.", "Minutieuse et d'un grand sérieux. J'ai eu l'occasion de collaborer avec elle, rien à redire sur son travail."],
];

const [principale, ...autres] = prestations;

const fiches = pieces.map((p, i) => `
        <article class="fiche${i === 0 ? ' active' : ''}" data-piece="${p.id}" id="piece-${p.id}">
          <h3>${p.nom} <small>${p.ou}</small></h3>
          <ul role="list">
            ${p.passage.map((l) => `<li>${l}</li>`).join('')}
            ${p.remise.map((l) => `<li class="remise">${l}</li>`).join('')}
          </ul>
        </article>`).join('');

const corps = `
    <!-- HERO -->
    <section class="hero">
      <div class="container hero__inner">
        <div class="hero__texte">
          <span class="marque">La fée ménage</span>
          <h1>Le ménage bien fait, <em>chez vous</em> comme au bureau</h1>
          <p class="lead">Florence Marionnel nettoie et entretient les maisons, les bureaux et les parties communes autour de Pontivy, Lorient, Auray et Vannes. Une seule personne, du premier appel au dernier coup de chiffon.</p>
          <form class="commune-form" action="/contact/" method="get" data-commune-form>
            <div class="commune-form__champ">
              ${svg.lieu}
              <label for="hero-commune" class="sr-only">Votre commune</label>
              <input id="hero-commune" name="commune" type="text" placeholder="Votre commune" autocomplete="address-level2" list="communes-liste">
              <datalist id="communes-liste">${communes.map((c) => `<option value="${c.nom}">`).join('')}</datalist>
            </div>
            <button type="submit" class="btn btn--primaire">Demander un devis ${svg.fleche}</button>
          </form>
          <p class="hero__tel-ligne petit">Ou par téléphone : <a href="${site.telHref}" class="hero__tel">${svg.tel} ${site.tel}</a></p>
          <ul class="hero__faits" role="list">
            <li>${svg.etoile} <strong>${site.note} / 5</strong> sur Google</li>
            <li>${svg.bouclier} <strong>Certifiée BGE</strong> et Certibiocides</li>
            <li>${svg.feuille} <strong>Produits écologiques</strong>, sans odeur chimique</li>
          </ul>
        </div>
        <div class="hero__visuel reveal">
          <div class="hero__tache" aria-hidden="true"></div>
          <img class="hero__fee" src="/assets/images/fee-magenta.png" alt="" width="705" height="897" aria-hidden="true">
          <div class="hero__photo">
            <picture>
              <source srcset="/assets/images/florence-marionnel.webp" type="image/webp">
              <img src="/assets/images/florence-marionnel.jpg" alt="Florence Marionnel devant sa camionnette La Fée Ménage" width="1532" height="1532" fetchpriority="high" decoding="async">
            </picture>
          </div>
          <div class="hero__etiquette" aria-hidden="true"><span class="etoiles">★★★★★</span><strong>${site.note}</strong>${site.nbAvis} avis Google</div>
        </div>
      </div>
    </section>

    <!-- LA MAISON, PIÈCE PAR PIÈCE -->
    <section class="section section--blanc maison" aria-labelledby="maison-titre">
      <div class="container">
        <div class="entete">
          <p class="sur-titre">Ce que je fais, pièce par pièce</p>
          <h2 id="maison-titre">La maison, telle que je la <em>parcours</em> à chaque passage</h2>
          <p class="lead">Faites défiler : chaque pièce s'allume avec ce que je fais à chaque passage régulier, et ce qui relève d'une remise en état ponctuelle.</p>
        </div>
        <div class="maison__inner">
          <div class="maison__colle">
            ${maisonSvg}
            <p class="maison__legende" aria-live="polite"><span class="puce" aria-hidden="true"></span><strong data-legende>${pieces[0].nom}</strong><span data-legende-ou>${pieces[0].ou}</span></p>
          </div>
          <div class="fiches" data-fiches>
            ${fiches}
            <p class="fiche__note"><span><i></i> à chaque passage</span><span><i class="rond"></i> remise en état ponctuelle</span></p>
          </div>
        </div>
      </div>
    </section>

    <!-- PRESTATIONS -->
    <section class="section" aria-labelledby="prestations-titre">
      <div class="container">
        <div class="entete">
          <p class="sur-titre">Prestations</p>
          <h2 id="prestations-titre">Huit prestations, du passage hebdomadaire au <em>nettoyage extrême</em></h2>
        </div>
        <div class="prestations__principale reveal">
          <div>
            <p class="sur-titre">${principale.surTitre}</p>
            <h3>${principale.nom}</h3>
            <p>${principale.court} Vous choisissez le rythme, je viens à jour fixe avec mon matériel et mes produits, et le tarif ne bouge pas de l'année.</p>
            <a href="/services/${principale.slug}/" class="btn btn--primaire">Le ménage régulier ${svg.fleche}</a>
          </div>
          <img src="/assets/images/panier.png" alt="" width="516" height="480" loading="lazy">
        </div>
        <ul class="prestations__liste" role="list">
          ${autres.map((p) => `<li${p.discret ? ' class="prestations__discret"' : ''}><a href="/services/${p.slug}/"><div><strong>${p.nom}</strong><span>${p.court}</span></div>${svg.fleche}</a></li>`).join('')}
        </ul>
      </div>
    </section>

    <!-- NETTOYAGE EXTRÊME -->
    <section class="section" aria-labelledby="discret-titre">
      <div class="container">
        <div class="discret">
          <div>
            <p class="sur-titre">Situations difficiles</p>
            <h2 id="discret-titre">Logement insalubre, syndrome de Diogène : j'interviens sans jugement</h2>
            <p>Souvent découverte lors d'une hospitalisation ou d'un décès, la situation demande une intervention rapide et, avant tout, humaine. Visite gratuite, déplacement sans véhicule siglé si vous le souhaitez, aucune information transmise à des tiers.</p>
            <div class="discret__actions">
              <a href="/services/nettoyage-syndrome-diogene-morbihan/" class="btn btn--clair">Comment ça se passe ${svg.fleche}</a>
              <a href="/contact/?prestation=Nettoyage+extr%C3%AAme+et+syndrome+de+Diog%C3%A8ne#devis" class="btn btn--fantome">Me contacter discrètement</a>
            </div>
          </div>
          <ul class="discret__engagements" role="list">
            <li><strong>Visite préalable gratuite</strong>J'évalue sur place et je propose un tarif avant toute intervention.</li>
            <li><strong>Objets personnels mis de côté</strong>Papiers, photos, souvenirs : signalés à la famille, jamais jetés sans accord.</li>
            <li><strong>Compte rendu si besoin</strong>Transmissible au tuteur, au curateur ou à l'assistante sociale.</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- FLORENCE -->
    <section class="section section--rose" aria-labelledby="florence-titre">
      <div class="container florence">
        <div class="reveal">
          <img class="florence__illu" src="/assets/images/aspirateur.png" alt="" width="420" height="420" loading="lazy">
          <h2 id="florence-titre" class="sr-only">Florence Marionnel</h2>
          <p class="florence__citation">Je ne fais pas passer une équipe. C'est moi qui réponds au téléphone, moi qui viens, moi qui reviens.</p>
          <p class="florence__signature"><strong>Florence Marionnel</strong>fondatrice de La Fée Ménage, installée à Melrand</p>
          <p class="florence__lien"><a href="/a-propos/" class="lien-fleche">Faire connaissance ${svg.fleche}</a></p>
        </div>
        <ul class="florence__faits reveal reveal--2" role="list">
          <li><b>Statut</b><span>Entreprise individuelle, sans franchise ni sous-traitance.</span></li>
          <li><b>Formation</b><span>Certifiée BGE (création et gestion d'entreprise) et Certibiocides (usage professionnel des produits de désinfection).</span></li>
          <li><b>Produits</b><span>Écologiques et biodégradables, sans composé organique volatil. Aucune odeur chimique après mon passage.</span></li>
          <li><b>Clients</b><span>Particuliers, gîtes et locations saisonnières, bureaux et commerces, syndics de copropriété, agences immobilières.</span></li>
          <li><b>Devis</b><span>Toujours après une visite du lieu. Écrit, détaillé, et le prix ne change pas en cours d'intervention.</span></li>
        </ul>
      </div>
    </section>

    <!-- ZONES -->
    <section class="section" aria-labelledby="zones-titre">
      <div class="container">
        <div class="entete">
          <p class="sur-titre">Depuis Melrand</p>
          <h2 id="zones-titre">Le Morbihan, à moins d'une heure de route</h2>
        </div>
        <div class="zones">
          ${carteSvg}
          <div>
            <ul class="zones__liste" role="list">
              ${communes.map((c) => `<li><a href="/${c.slug}/"><strong>${c.nom}</strong><span class="temps">${c.temps === 'siège' ? 'le point de départ' : c.temps + ' de route'}</span>${svg.fleche}</a></li>`).join('')}
              <li><a href="/morbihan/"><strong>Une autre commune</strong><span class="temps">tout le département</span>${svg.fleche}</a></li>
            </ul>
            <p class="zones__note">Temps de route indicatifs depuis Melrand, en voiture et hors trafic. Pas de frais de déplacement pour Melrand et les communes limitrophes ; au-delà, le déplacement est indiqué sur le devis.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- AVIS -->
    <section class="section section--blanc" aria-labelledby="avis-titre">
      <div class="container">
        <p class="avis__note"><span class="etoiles" aria-hidden="true">★★★★★</span><strong>${site.note}</strong><span>sur Google, ${site.nbAvis} avis</span></p>
        <h2 id="avis-titre" class="sr-only">Avis clients</h2>
        <div class="avis">
          <figure class="reveal">
            <blockquote class="avis__grand">${avis[0][1]}</blockquote>
            <figcaption class="avis__auteur"><span class="etoiles" aria-label="5 étoiles">★★★★★</span><strong>${avis[0][0]}</strong> sur Google</figcaption>
          </figure>
          <ul class="avis__liste reveal reveal--2" role="list">
            ${avis.slice(1).map(([n, t]) => `<li><p>${t}</p><footer><strong>${n}</strong><span>Google · 5 étoiles</span></footer></li>`).join('')}
            <li><a href="${site.avisUrl}" class="lien-fleche" target="_blank" rel="noopener">Lire ou laisser un avis sur Google ${svg.fleche}</a></li>
          </ul>
        </div>
      </div>
    </section>

    ${sectionDevis({ titre: 'Un devis après visite, pas de surprise' })}
`;

export default {
  path: '/',
  html: layout({
    path: '/',
    titre: 'La Fée Ménage, entreprise de nettoyage dans le Morbihan',
    description: 'Ménage régulier, bureaux, copropriétés, vitres, fin de chantier, remise en état et nettoyage extrême dans le Morbihan. Florence Marionnel, installée à Melrand, intervient elle-même. Devis gratuit après visite.',
    corps,
    schema: [entrepriseSchema({ description: 'Entreprise de nettoyage dans le Morbihan : ménage régulier à domicile, bureaux et commerces, copropriétés, vitres, terrasses, remise en état, fin de chantier, nettoyage extrême et syndrome de Diogène.' })],
  }),
};
