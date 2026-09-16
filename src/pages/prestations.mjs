import { site, communes, svg } from '../site.mjs';
import { prestations } from '../data/prestations.mjs';
import { layout, ariane, arianeSchema, faq, faqSchema, sectionDevis, entrepriseSchema, sansBalises } from '../partials.mjs';

function page(p, i) {
  const autres = prestations.filter((x) => x.slug !== p.slug).slice(0, 4);
  const fil = [['Accueil', '/'], ['Prestations', '/services/menage-entretien-regulier-morbihan/'], [p.nom, `/services/${p.slug}/`]];
  const etapes = p.etapes ? `
    <section class="section section--blanc" aria-labelledby="etapes-titre">
      <div class="container">
        <div class="entete"><p class="sur-titre">Comment ça se passe</p><h2 id="etapes-titre">Comment se déroule l'intervention ?</h2></div>
        <ol class="etapes" id="etapes" role="list">
          ${p.etapes.map(([t, d]) => `<li><strong>${t}</strong><p>${d}</p></li>`).join('')}
        </ol>
      </div>
    </section>` : '';

  const corps = `
    ${ariane(fil)}
    <section class="page-hero">
      <div class="container page-hero__inner">
        <div>
          <p class="sur-titre">${p.surTitre}</p>
          <h1>${p.h1}</h1>
          <p class="lead">${p.intro[0]}</p>
          <div class="hero__actions">
            <a href="#demande" class="btn btn--primaire">${p.discret ? 'Me contacter discrètement' : 'Demander un devis'} ${svg.fleche}</a>
            <a href="${site.telHref}" class="hero__tel">${svg.tel} ${site.tel}</a>
          </div>
        </div>
        <ul class="page-hero__points" role="list">
          ${p.points.map(([t, d]) => `<li>${svg.coche}<div><strong>${t}</strong>${d}</div></li>`).join('')}
        </ul>
      </div>
    </section>

    <section class="section ${p.discret ? 'section--sombre' : 'section--rose'}" aria-labelledby="inclus-titre">
      <div class="container florence">
        <div class="prose">
          <h2 id="inclus-titre">Que comprend ${p.discret ? "l'intervention" : 'la prestation'} ?</h2>
          <p>${p.intro[1]}</p>
        </div>
        <ul class="fiche active" role="list" aria-label="Liste détaillée">
          ${p.inclus.map((l) => `<li>${l}</li>`).join('')}
        </ul>
      </div>
    </section>

    ${etapes}

    ${faq(p.faq, p.discret ? 'Ce que les familles me demandent' : 'Vos questions sur ' + p.nom.toLowerCase())}

    <section class="section section--blanc" aria-labelledby="communes-titre">
      <div class="container">
        <div class="entete"><p class="sur-titre">Où</p><h2 id="communes-titre">Où est-ce que j'interviens pour ${p.nom.toLowerCase()} ?</h2>
        <p class="lead">Depuis Melrand, dans tout le Morbihan. Le temps de route est indiqué à titre indicatif.</p></div>
        <div class="communes-voisines">
          ${communes.map((c) => `<a href="/${c.slug}/">${svg.lieu} ${c.nom}${c.temps === 'siège' ? '' : ' · ' + c.temps}</a>`).join('')}
          <a href="/morbihan/">${svg.lieu} Une autre commune</a>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="autres-titre">
      <div class="container">
        <div class="entete"><h2 id="autres-titre">J'interviens aussi pour</h2></div>
        <ul class="prestations__liste" role="list">
          ${autres.map((a) => `<li><a href="/services/${a.slug}/"><div><strong>${a.nom}</strong><span>${a.court}</span></div>${svg.fleche}</a></li>`).join('')}
        </ul>
      </div>
    </section>

    ${sectionDevis({ prestation: p.nom, titre: p.discret ? 'Parlons-en, discrètement' : 'Demander un devis pour ' + p.nom.toLowerCase() })}
  `;

  const schema = [
    entrepriseSchema(),
    {
      '@type': 'Service',
      name: sansBalises(p.titre),
      serviceType: p.nom,
      description: p.description,
      provider: { '@id': site.url + '/#entreprise' },
      areaServed: { '@type': 'AdministrativeArea', name: 'Morbihan' },
      url: `${site.url}/services/${p.slug}/`,
    },
    faqSchema(p.faq),
    arianeSchema(fil),
    ...(p.etapes ? [{
      '@type': 'HowTo',
      name: 'Comment se déroule une intervention après syndrome de Diogène',
      step: p.etapes.map(([t, d], n) => ({ '@type': 'HowToStep', position: n + 1, name: t, text: d })),
    }] : []),
  ];

  return {
    path: `/services/${p.slug}/`,
    priorite: i === 0 ? '0.9' : p.discret ? '0.9' : '0.8',
    html: layout({ path: `/services/${p.slug}/`, titre: `${p.titre} | ${site.nom}`, description: p.description, corps, schema, classe: 'page-prestation' }),
  };
}

export default prestations.map(page);
