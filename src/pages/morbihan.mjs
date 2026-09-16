import { site, communes, svg } from '../site.mjs';
import { villes } from '../data/villes.mjs';
import { carteSvg } from '../partials/carte-svg.mjs';
import { layout, ariane, arianeSchema, faq, faqSchema, sectionDevis, entrepriseSchema } from '../partials.mjs';

const questions = [
  ["Intervenez-vous vraiment dans tout le Morbihan ?", "Oui. De Lorient à Vannes, de Pontivy à Ploërmel, en passant par Questembert, Muzillac, Locminé ou La Trinité-sur-Mer. Pour les communes éloignées de Melrand, un forfait kilométrique peut s'appliquer, toujours précisé dans le devis avant l'intervention."],
  ["Comment obtenir un devis pour ma commune ?", "Par le formulaire ou par téléphone. Indiquez votre commune, le type de prestation et la surface approximative. Réponse sous 24 heures, puis visite du lieu et devis écrit."],
  ["Y a-t-il des frais de déplacement ?", "Pas de forfait kilométrique dans un rayon d'environ 30 km autour de Melrand. Au-delà, il dépend de la distance et du volume de la prestation, et il figure noir sur blanc dans le devis."],
  ["Intervenez-vous pour les professionnels ?", "Oui, partout dans le Morbihan : bureaux, commerces, professions libérales, agences immobilières, syndics de copropriété, en contrat régulier ou en intervention ponctuelle."],
];
const fil = [['Accueil', '/'], ['Communes', '/morbihan/']];
const corps = `
    ${ariane(fil)}
    <section class="page-hero">
      <div class="container page-hero__inner">
        <div>
          <p class="sur-titre">Tout le département</p>
          <h1>Votre commune n'est pas dans la liste ? <em>Ça ne change rien.</em></h1>
          <p class="lead">Je suis installée à Melrand, au centre du Morbihan, et j'interviens dans tout le département. Écrivez ou appelez, je réponds sous 24 heures.</p>
          <div class="hero__actions">
            <a href="#demande" class="btn btn--primaire">Décrire mon besoin ${svg.fleche}</a>
            <a href="${site.telHref}" class="hero__tel">${svg.tel} ${site.tel}</a>
          </div>
        </div>
        ${carteSvg}
      </div>
    </section>

    <section class="section section--rose" aria-labelledby="pages-titre">
      <div class="container">
        <div class="entete"><h2 id="pages-titre">Les communes avec une page dédiée</h2></div>
        <ul class="zones__liste" role="list">
          ${villes.map((v) => `<li><a href="/${v.slug}/"><strong>${v.nom}</strong><span class="temps">${v.couvertes.slice(1, 4).join(', ')}</span>${svg.fleche}</a></li>`).join('')}
        </ul>
      </div>
    </section>

    ${faq(questions, 'Vos questions sur le déplacement')}

    ${sectionDevis({ titre: "Décrivez le lieu, je m'occupe du reste" })}
`;

export default {
  path: '/morbihan/',
  html: layout({
    path: '/morbihan/',
    titre: 'Nettoyage dans tout le Morbihan, depuis Melrand | La Fée Ménage',
    description: 'La Fée Ménage intervient dans tout le Morbihan depuis Melrand : Pontivy, Lorient, Auray, Vannes et toutes les communes du 56. Devis gratuit sous 24 h, forfait de déplacement précisé dans le devis.',
    corps,
    schema: [entrepriseSchema(), faqSchema(questions), arianeSchema(fil)],
  }),
};
