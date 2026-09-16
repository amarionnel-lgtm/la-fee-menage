import { site, svg } from '../site.mjs';
import { layout, ariane, arianeSchema, sectionDevis, entrepriseSchema } from '../partials.mjs';

const fil = [['Accueil', '/'], ['Florence Marionnel', '/a-propos/']];
const corps = `
    ${ariane(fil)}
    <section class="page-hero">
      <div class="container page-hero__inner">
        <div>
          <p class="sur-titre">Qui vient chez vous</p>
          <h1>Florence Marionnel, <em>la fée</em> derrière La Fée Ménage</h1>
          <p class="lead">Installée à Melrand, au 38 Kerlay, je nettoie et j'entretiens des maisons, des bureaux et des immeubles dans le Morbihan. Pas de franchise, pas de sous-traitance : c'est moi qui réponds, moi qui viens, moi qui reviens.</p>
          <div class="hero__actions">
            <a href="/contact/#devis" class="btn btn--primaire">Demander un devis ${svg.fleche}</a>
            <a href="${site.telHref}" class="hero__tel">${svg.tel} ${site.tel}</a>
          </div>
        </div>
        <div class="hero__visuel">
          <div class="hero__tache" aria-hidden="true"></div>
          <div class="hero__photo">
            <picture>
              <source srcset="/assets/images/florence-marionnel-900.webp 900w, /assets/images/florence-marionnel.webp 1532w" sizes="(max-width: 899px) 100vw, 45vw" type="image/webp">
              <img src="/assets/images/florence-marionnel-900.jpg" srcset="/assets/images/florence-marionnel-900.jpg 900w, /assets/images/florence-marionnel.jpg 1532w" sizes="(max-width: 899px) 100vw, 45vw" alt="Florence Marionnel devant sa camionnette, au bord de la mer" width="1532" height="1532" decoding="async">
            </picture>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--rose" aria-labelledby="methode-titre">
      <div class="container florence">
        <div class="prose">
          <h2 id="methode-titre">Comment je travaille</h2>
          <p>Chaque intervention commence par une visite. On fait le tour du lieu ensemble, on note pièce par pièce ce que vous attendez, et cette fiche devient la base du devis, puis de chaque passage. Vous savez exactement ce qui est fait, et je sais exactement ce que vous attendez.</p>
          <p>Je viens avec mon matériel et mes produits, écologiques et biodégradables, sans composé organique volatil. Après mon passage, ça ne sent pas le produit, ça sent le propre.</p>
          <p>Je me suis formée pour les situations compliquées aussi : logements insalubres, syndrome de Diogène, fins de chantier. Ce sont des interventions qui demandent de la méthode et, avant tout, du respect pour les personnes.</p>
        </div>
        <ul class="florence__faits" role="list">
          <li><b>Statut</b><span>Entreprise individuelle, SIRET ${site.siret}.</span></li>
          <li><b>Formation</b><span>Certifiée BGE (création et gestion d'entreprise) et Certibiocides (usage professionnel des produits de désinfection).</span></li>
          <li><b>Assurance</b><span>Responsabilité civile professionnelle, attestation fournie avec le devis.</span></li>
          <li><b>Avis</b><span>${site.note} sur 5 sur Google, ${site.nbAvis} avis.</span></li>
          <li><b>Où</b><span>Melrand, Pontivy, Lorient, Auray, Vannes et tout le Morbihan.</span></li>
        </ul>
      </div>
    </section>

    <section class="section" aria-labelledby="engagements-titre">
      <div class="container--narrow prose">
        <h2 id="engagements-titre">Ce à quoi je m'engage</h2>
        <ul>
          <li><strong>Un devis écrit après visite</strong>, et un prix qui ne change pas en cours d'intervention.</li>
          <li><strong>La même personne à chaque passage</strong> : moi. Vous n'avez pas à réexpliquer.</li>
          <li><strong>Une réponse sous 24 heures</strong>, par téléphone ou par mail, souvent le jour même.</li>
          <li><strong>La discrétion</strong>, en particulier pour les situations difficiles : rien n'est dit à des tiers sans votre accord.</li>
          <li><strong>Des produits sains</strong> pour vous, vos enfants, vos animaux et pour les personnes qui occuperont le lieu après moi.</li>
        </ul>
      </div>
    </section>

    ${sectionDevis({ titre: 'Faisons connaissance autour de votre besoin' })}
`;

export default {
  path: '/a-propos/',
  html: layout({
    path: '/a-propos/',
    titre: 'Florence Marionnel, fondatrice de La Fée Ménage à Melrand',
    description: 'Florence Marionnel, La Fée Ménage à Melrand (Morbihan) : une seule interlocutrice, certifiée BGE et Certibiocides, produits écologiques, devis écrit après visite.',
    corps,
    schema: [entrepriseSchema(), { '@type': 'Person', name: site.proprietaire, jobTitle: 'Fondatrice', worksFor: { '@id': site.url + '/#entreprise' }, url: site.url + '/a-propos/' }, arianeSchema(fil)],
  }),
};
