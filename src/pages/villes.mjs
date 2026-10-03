import { site, communes, svg } from '../site.mjs';
import { villes } from '../data/villes.mjs';
import { prestations } from '../data/prestations.mjs';
import { layout, ariane, arianeSchema, faq, faqSchema, sectionDevis, entrepriseSchema, lierCommunes, lierPrestations } from '../partials.mjs';

function page(v) {
  const fil = [['Accueil', '/'], ['Communes', '/morbihan/'], [v.nom, `/${v.slug}/`]];
  const autres = communes.filter((c) => c.slug !== v.slug);
  const corps = `
    ${ariane(fil)}
    <section class="page-hero">
      <div class="container page-hero__inner">
        <div>
          <p class="sur-titre">${v.temps === 'siège' ? 'Le point de départ' : v.temps + ' de route depuis Melrand'}</p>
          <h1>${v.h1}</h1>
          <p class="lead">${v.intro[0]}</p>
          <div class="hero__actions">
            <a href="#demande" class="btn btn--primaire">Demander un devis à ${v.nom} ${svg.fleche}</a>
            <a href="${site.telHref}" class="hero__tel">${svg.tel} ${site.tel}</a>
          </div>
        </div>
        <div>
          <p class="sur-titre">Communes couvertes</p>
          <div class="communes-voisines">${v.couvertes.map((c) => `<span>${svg.lieu} ${c}</span>`).join('')}</div>
          <p class="petit zones__note">${lierPrestations(lierCommunes(v.intro[1], v.slug))}</p>
        </div>
      </div>
    </section>

    <section class="section section--rose" aria-labelledby="presta-titre">
      <div class="container">
        <div class="entete"><p class="sur-titre">À ${v.nom}</p><h2 id="presta-titre">Ce que je fais à ${v.nom}</h2></div>
        <ul class="prestations__liste" role="list">
          ${prestations.map((p) => `<li><a href="/services/${p.slug}/"><div><strong>${p.nom}</strong><span>${p.court}</span></div>${svg.fleche}</a></li>`).join('')}
        </ul>
      </div>
    </section>

    ${faq(v.faq, 'Vos questions, à ' + v.nom)}

    <section class="section section--blanc" aria-labelledby="voisines-titre">
      <div class="container">
        <div class="entete"><h2 id="voisines-titre">Les autres communes</h2></div>
        <div class="communes-voisines">
          ${autres.map((c) => `<a href="/${c.slug}/">${svg.lieu} ${c.nom}${c.temps === 'siège' ? '' : ' · ' + c.temps}</a>`).join('')}
          <a href="/morbihan/">${svg.lieu} Une autre commune</a>
        </div>
      </div>
    </section>

    ${sectionDevis({ commune: v.nom, titre: 'Demander un devis à ' + v.nom })}
  `;
  const schema = [
    entrepriseSchema({ '@id': undefined, areaServed: { '@type': 'City', name: v.nom }, url: `${site.url}/${v.slug}/` }),
    faqSchema(v.faq),
    arianeSchema(fil),
  ];
  return {
    path: `/${v.slug}/`,
    html: layout({ path: `/${v.slug}/`, titre: `${v.titre} | ${site.nom}`, description: v.description, corps, schema, classe: 'page-ville' }),
  };
}

export default villes.map(page);
