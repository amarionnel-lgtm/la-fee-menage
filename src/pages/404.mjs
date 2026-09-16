import { svg } from '../site.mjs';
import { layout } from '../partials.mjs';

const corps = `
    <section class="section p404">
      <div class="container">
        <img src="/assets/images/fee-magenta-480.png" alt="" width="480" height="611">
        <p class="sur-titre">Erreur 404</p>
        <h1>Cette page a été rangée ailleurs</h1>
        <p class="lead">L'adresse n'existe pas ou plus. Le plus simple est de repartir de l'accueil.</p>
        <p><a href="/" class="btn btn--primaire">Retour à l'accueil ${svg.fleche}</a></p>
      </div>
    </section>
`;

export default {
  path: '/404.html',
  fichier: 'dist/404.html',
  noindex: true,
  html: layout({ path: '/404.html', titre: 'Page introuvable | La Fée Ménage', description: 'Page introuvable.', corps, noindex: true }),
};
