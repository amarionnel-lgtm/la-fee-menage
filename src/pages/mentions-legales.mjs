import { site } from '../site.mjs';
import { layout, ariane } from '../partials.mjs';

const fil = [['Accueil', '/'], ['Mentions légales', '/mentions-legales/']];
const corps = `
    ${ariane(fil)}
    <section class="section">
      <div class="container--narrow prose">
        <p class="sur-titre">Informations légales</p>
        <h1>Mentions légales et confidentialité</h1>
        <p>Conformément aux articles 6-III et 19 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique et au règlement général sur la protection des données (RGPD, règlement UE 2016/679).</p>

        <h2>Éditeur du site</h2>
        <p>${site.nom}, entreprise individuelle exploitée par ${site.proprietaire}<br>${site.adresse.rue}, ${site.adresse.cp} ${site.adresse.ville}, ${site.adresse.dep}, France<br>SIRET ${site.siret}<br>Téléphone : ${site.tel}<br>Adresse électronique : <span data-mail-texte>affichée par votre navigateur</span></p>
        <p>Directrice de la publication : ${site.proprietaire}.</p>

        <h2>Hébergement</h2>
        <p>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (vercel.com).</p>

        <h2>Propriété intellectuelle</h2>
        <p>L'ensemble du contenu de ce site (textes, images, logo, structure) appartient à ${site.nom}, sauf mention contraire. Toute reproduction ou représentation, totale ou partielle, sans autorisation écrite préalable est interdite.</p>

        <h2>Responsabilité</h2>
        <p>${site.nom} s'efforce de tenir ce site à jour mais ne peut garantir l'exactitude de toutes les informations à tout instant. Les liens vers des sites tiers n'engagent pas sa responsabilité.</p>

        <h2>Données personnelles</h2>
        <p>Responsable du traitement : ${site.proprietaire}, ${site.adresse.rue}, ${site.adresse.cp} ${site.adresse.ville}.</p>
        <p>Le formulaire de demande de devis transmet à Florence Marionnel les informations que vous y saisissez (nom, commune, téléphone ou adresse électronique, message). Elles servent uniquement à vous répondre et à établir un devis. Elles sont transmises par courrier électronique et ne sont ni revendues ni partagées. Un mécanisme anti-robots (champ caché et horodatage) est utilisé sans cookie ni traceur.</p>
        <p>Les échanges liés à une demande sont conservés le temps de la relation commerciale et au maximum trois ans après le dernier contact.</p>
        <p>Ce site n'utilise aucun cookie publicitaire, aucun outil de mesure d'audience tiers et ne crée aucun compte utilisateur. L'hébergeur peut traiter des données techniques (adresse IP, pages consultées) à des fins de sécurité, conformément à sa politique de confidentialité.</p>
        <p>Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité sur vos données. Pour l'exercer, écrivez à ${site.proprietaire} par courrier ou par messagerie électronique ; réponse sous un mois. Vous pouvez aussi saisir la CNIL (cnil.fr).</p>

        <h2>Crédits</h2>
        <p>Conception et développement : Antoine Marionnel. Photographies : ${site.proprietaire}, droits réservés. Typographies : Sentient et Quicksand (Fontshare, Indian Type Foundry), Grand Hotel (Astigmatic), hébergées sur ce site.</p>
        <p>Dernière mise à jour : septembre 2026.</p>
      </div>
    </section>
`;

export default {
  path: '/mentions-legales/',
  noindex: true,
  html: layout({ path: '/mentions-legales/', titre: 'Mentions légales | La Fée Ménage', description: 'Mentions légales et politique de confidentialité du site La Fée Ménage.', corps, noindex: true }),
};
