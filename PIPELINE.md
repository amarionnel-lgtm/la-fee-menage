# PIPELINE — La Fée Ménage

## Infos projet
- **Type** : refonte complète (Webador → vanilla HTML/CSS/JS)
- **Stack** : vanilla HTML/CSS/JS + Vercel
- **Profil** : core + vanilla-site
- **Budget** : 1 000€
- **Deadline** : à confirmer avec Florence
- **Client** : Florence Marionnel — 38 Kerlay, 56310 Melrand

## Étapes

| # | Étape | Agent | Skills | Validation | Statut |
|---|-------|-------|--------|-----------|--------|
| 1 | Brief + stratégie | @the-strategist | — | Brief validé ✅ | ✅ |
| 2 | Audit SEO mots-clés | @the-seo-specialist | seo-expert | Liste mots-clés prioritaires validée | ✅ |
| 3 | Voix de marque | @the-brand-voice-analyzer | — | Ton validé | ⬜ |
| 4 | Architecture | @the-site-architect | seo-expert | Plan pages + wireframes validés | ✅ |
| 5 | Visuels IA | @media-director | mario-genesis-master, fal-generate | Images dans assets/images/ (si besoin) | ⬜ |
| 6a | Dev — scaffolding + design system + composants | Claude Code direct | securite-web | Composants OK, design system visible | ✅ |
| 6b | Dev — Étape 2 page d'accueil + à propos | Claude Code direct | — | index.html + a-propos + photo Florence | ✅ |
| 6c | Dev — Étape 3 page Diogène | Claude Code direct | — | 700+ mots, FAQ, Schema.org complet | ✅ |
| 6d | Dev — Étape 4 pages service ×5 + contact | Claude Code direct | — | 5 pages service + contact/index.html | ✅ |
| 6e | Dev — Étape 5 pages villes ×6 | Claude Code direct | — | 6 pages géolocalisées | ✅ |
| 6f | Dev — Étape 6 mentions légales + RGPD | Claude Code direct | — | mentions-legales/index.html + SIRET | ✅ |
| 6g | Dev — Étape 7 SEO technique | Claude Code direct | seo-expert | sitemap.xml + canonicals unifiés | ✅ |
| 7 | Contenu | @contenu-pro | — | Textes validés Florence | ⬜ |
| 8 | QA post-code | @site-reviewer + @design-system + @performance | fixing-accessibility | WCAG AA + Lighthouse ≥ 90 | ⬜ |
| 9 | Sécurité | @the-security-reviewer | securite-web | 0 vulnérabilité BLOQUANT | ⬜ |
| 10 | Déploiement | @the-domain-controller | vercel-deploy | URL prod active | ⬜ |
| 11 | Livraison | @workflow-livraison | — | Rapport + contrat maintenance 80€/mois envoyés | ⬜ |

## Légende statuts
- ⬜ À faire
- 🔄 En cours
- ✅ Fait
- ⏸ Bloqué (raison : )

## Direction créative validée
- **"Charte rose/vert printemps féminine"** — imposée par le logo fourni
- Palette : `#F2A7B8` rose doux · `#5A9E3A` vert feuille · `#FDFAF7` blanc cassé · `#2D5A1B` vert foncé · `#FDE8EE` rose poudré
- Typo : DM Serif Display (titres) + DM Sans (corps)
- Logo : `assets/images/logo/logo-la-fee-menage.svg` (placeholder — remplacer par fichier Florence)

## Stack technique Étape 1
- `/assets/css/main.css` — design system complet (tokens + reset + typo + composants)
- `/assets/js/components.js` — loader HTML async (fetch + inject)
- `/assets/js/main.js` — burger + email obfuscation + header scroll + nav active
- `/components/` — header, footer, trust-bar, cta-devis
- Test local : `npx serve` ou `python3 -m http.server 8080` (fetch ne marche pas en file://)

## Décisions stratégiques
- **Tête de gondole SEO** : page Diogène — niche quasi-vide localement
- **Architecture SEO** : 1 page par service + 1 page par ville (modèle Nova Clean à battre)
- **Quick win** : Schema.org LocalBusiness + AggregateRating 5.0/10 avis
- **Correction bloquante** : Sarzeau → Melrand partout (signaux géographiques Google)
- **Maintenance** : proposer 80€/mois à la livraison

## Notes pipeline
- Budget serré (1 000€) : templates HTML partagés header/footer/components pour les 6 pages service + 6 pages villes
- Ton : humain et rassurant — essentiel pour Diogène (situation de détresse familiale)
- Pas de tarifs affichés — modèle 100% devis

---
*Créé le : 2026-04-26*
*Dernière mise à jour : 2026-04-26 — 6a→6g terminés. DEV COMPLET. Prochaine : QA (étape 8) + déploiement Vercel (étape 10)*
