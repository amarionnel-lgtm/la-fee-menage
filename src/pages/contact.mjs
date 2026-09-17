import { site, communes, svg } from '../site.mjs';
import { layout, ariane, arianeSchema, sectionDevis, entrepriseSchema } from '../partials.mjs';

const fil = [['Accueil', '/'], ['Contact', '/contact/']];
const corps = `
    ${ariane(fil)}
    <section class="page-hero">
      <div class="container page-hero__inner">
        <div>
          <p class="sur-titre">Contact</p>
          <h1>Parlons de <em>votre lieu</em></h1>
          <p class="lead">Je réponds personnellement sous 24 heures, souvent le jour même. Pas de standard, pas d'intermédiaire.</p>
          <div class="hero__actions">
            <a href="#" data-mail class="btn btn--primaire">${svg.mail} M'écrire un mail</a>
            <a href="${site.telHref}" class="hero__tel">${svg.tel} ${site.tel}</a>
          </div>
        </div>
        <ul class="page-hero__points" role="list">
          <li>${svg.tel}<div><strong><a href="${site.telHref}">${site.tel}</a></strong>${site.horaires[0][0]} ${site.horaires[0][1]}, ${site.horaires[1][0].toLowerCase()} ${site.horaires[1][1]}</div></li>
          <li>${svg.mail}<div><strong><a href="#" data-mail data-mail-label="">adresse affichée par votre navigateur</a></strong>Réponse sous 24 h</div></li>
          <li>${svg.lieu}<div><strong>${site.adresse.rue}, ${site.adresse.cp} ${site.adresse.ville}</strong>Le point de départ. Interventions dans tout le Morbihan.</div></li>
        </ul>
      </div>
    </section>

    ${sectionDevis({ titre: 'Un devis après visite, pas de surprise' })}

    <section class="section section--rose" aria-labelledby="horaires-titre">
      <div class="container florence">
        <div>
          <h2 id="horaires-titre">Horaires</h2>
          <table class="tableau" aria-describedby="horaires-titre">
            <tbody>
              ${site.horaires.map(([j, h]) => `<tr><th scope="row">${j}</th><td>${h}</td></tr>`).join('')}
            </tbody>
          </table>
          <p class="petit zones__note">Interventions en dehors de ces horaires sur demande : précisez votre contrainte dans le message.</p>
        </div>
        <div>
          <h2>Où j'interviens</h2>
          <div class="communes-voisines">
            ${communes.map((c) => `<a href="/${c.slug}/">${svg.lieu} ${c.nom}${c.temps === 'siège' ? '' : ' · ' + c.temps}</a>`).join('')}
            <a href="/morbihan/">${svg.lieu} Une autre commune</a>
          </div>
          <p class="petit zones__note"><a href="https://www.google.com/maps/search/?api=1&query=38+Kerlay+56310+Melrand" rel="noopener" target="_blank">Voir Melrand sur Google Maps</a></p>
        </div>
      </div>
    </section>
`;

export default {
  path: '/contact/',
  html: layout({
    path: '/contact/',
    titre: 'Contact et devis gratuit | La Fée Ménage, nettoyage Morbihan',
    description: 'Devis gratuit La Fée Ménage : par mail ou au 06 41 84 36 34, réponse sous 24 h. Florence Marionnel, Melrand, interventions dans tout le Morbihan.',
    corps,
    schema: [entrepriseSchema(), arianeSchema(fil)],
  }),
};
