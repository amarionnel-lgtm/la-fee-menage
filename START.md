# START — La Fée Ménage

## Contexte client
- **Client** : Florence Marionnel — La Fée Ménage
- **Budget** : 1 000€ (mission portfolio sous-facturée)
- **Stack** : vanilla HTML/CSS/JS + Vercel
- **Profil actif** : core + vanilla-site
- **URL actuelle** : https://www.lafeemenage.fr (Webador — à migrer)
- **URL prod** : à définir (domaine client existant)
- **Chemin local** : ~/Documents/Claude Code/la-fee-menage/
- **Adresse** : 38 Kerlay, 56310 Melrand (Morbihan, Bretagne)
- **Zone intervention** : Melrand, Pontivy, Lorient, Auray, Vannes et alentours Morbihan

## État d'avancement
*Mis à jour automatiquement à chaque fin de session*

### ✅ Fait
- Brief client analysé par @the-strategist
- Structure de site validée : 17 pages (1 accueil + 1 à propos + 1 contact + 6 service + 6 villes + 1 Morbihan chapeau)
- Concurrents identifiés : Nova Clean, Sipropre, Eco Ouest Nettoyage
- Vrai problème identifié : architecture SEO locale inexistante (pas design)

### ✅ Dev terminé (6a→6d)
- Scaffolding + design system + composants partagés (header, footer, trust-bar, cta-devis)
- index.html (accueil) + a-propos/index.html (avec photo Florence)
- services/nettoyage-syndrome-diogene-morbihan/ (page tête de gondole SEO, 700+ mots)
- services/nettoyage-bureaux-morbihan/
- services/nettoyage-demenagement-morbihan/
- services/nettoyage-fin-de-chantier-morbihan/
- services/nettoyage-vitres-morbihan/
- services/nettoyage-terrasse-morbihan/
- contact/index.html (CTA forte + mailto + tel + horaires)
- 404.html, robots.txt

### 🔄 En cours
- rien

### ✅ Dev terminé (6e)
- lorient/, vannes/, pontivy/, auray/, melrand/, morbihan/ — 6 pages villes géolocalisées

### ✅ Dev terminé (6f + 6g)
- mentions-legales/index.html — mentions légales + RGPD complet (noindex)
- sitemap.xml — 15 URLs avec priorités (tête de gondole Diogène p=0.9)
- robots.txt mis à jour (sitemap URL corrigée en non-www)
- Canonicals unifiés : 6 pages `www.lafeemenage.fr` → `lafeemenage.fr` (fix SEO critique)

### ⏳ Reste à faire
- QA (@site-reviewer + @design-system + @performance) — Lighthouse ≥ 90
- Déploiement Vercel + configuration domaine lafeemenage.fr
- Soumettre sitemap.xml à Google Search Console
- Contenu validé Florence (textes = placeholders pour l'instant)
- Livraison + proposition contrat maintenance 80€/mois

## Prochaine action
> **DEV COMPLET** — 16 pages HTML, sitemap, robots, canonicals, Schema.org partout.
> Prochaine : QA Lighthouse + Vercel deploy. Lancer `npx serve .` pour tester en local avant déploiement.

## Résultats audit SEO (session 1)
- **Score SEO actuel** : 8/100 (Webador, zéro optimisation)
- **Score cible** : ≥ 70/100 au lancement Vercel
- **Type schema.org** : `CleaningService` (sous-type `HomeAndConstructionBusiness`)
- **Slugs validés** :
  - `/services/nettoyage-syndrome-diogene-morbihan` ← tête de gondole P0
  - `/services/nettoyage-bureaux-morbihan`
  - `/services/nettoyage-demenagement-morbihan`
  - `/services/nettoyage-fin-de-chantier-morbihan`
  - `/services/nettoyage-vitres-morbihan`
  - `/services/nettoyage-terrasse-morbihan`
  - `/lorient`, `/vannes`, `/pontivy`, `/auray`, `/melrand`, `/morbihan`
- **Quick wins** :
  1. GBP : catégories + description + URL (avant lancement) — déléguer `seo-maps`
  2. Schema.org `LocalBusiness` + `AggregateRating` (5.0/10 avis) → étoiles dans SERPs
  3. NAP unifié footer : format exact "38 Kerlay, 56310 Melrand"
  4. robots.txt + sitemap.xml propres dès lancement Vercel — déléguer `seo-sitemap`
- **Avantage vs Nova Clean** : page Diogène humanisée + angle écologique fil rouge + étoiles schema → plus fort que la duplication de pages génériques de Nova Clean

## Informations client clés
- **Services** : Diogène/nettoyage extrême, bureaux, avant/après déménagement, fin de chantier, vitres, terrasses
- **Atouts** : 5,0 étoiles / 10 avis Google, produits 100% écologiques, certifiée BGE, logo disponible
- **Point bloquant corrigé** : mention "Sarzeau" dans textes → remplacer partout par Melrand / Morbihan
- **Ton** : humain, rassurant, discret — artisan local de confiance (important pour Diogène)

## Direction créative retenue (à valider)
- **Direction A — "Blanc de lin breton"** (recommandée par @the-site-architect)
- Typo : `DM Serif Display` (titres) + `DM Sans` (corps)
- Palette : `#F7F4EF` (fond lin), `#2D4A3E` (vert forêt), `#C8B89A` (sable Morbihan)
- 8 étapes d'implémentation définies
- Composants : header, footer, trust-bar, cta-devis, zone-intervention, template page-service, template page-ville

## Agents utilisés sur ce projet
- @the-strategist — brief structuré + stratégie (session 1) ✅
- @the-seo-specialist — audit mots-clés locaux + slugs + titles/meta (session 1) ✅
- @the-site-architect — direction créative + architecture complète + plan 8 étapes (session 1) ✅

## Notes importantes
- Page Diogène = tête de gondole SEO, niche quasi-vide localement — à traiter en priorité
- Proposer contrat maintenance 80€/mois à la livraison — SANS EXCEPTION
- Ne pas afficher de tarifs (modèle devis uniquement)
- Schema.org LocalBusiness + AggregateRating (5.0/10 avis) = quick win SERPs

---
*Dernière mise à jour : 2026-04-26 — Session 2 (6a+6b+6c+6d terminés — 6 pages service + contact créées — prochaine : 6e pages villes)*
