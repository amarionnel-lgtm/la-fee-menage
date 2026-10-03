// Données communes à tout le site.
export const site = {
  nom: 'La Fée Ménage',
  proprietaire: 'Florence Marionnel',
  url: 'https://www.la-fee-menage.fr',
  tel: '06 41 84 36 34',
  telHref: 'tel:+33641843634',
  // L'adresse mail n'apparaît jamais en clair dans le HTML (règle anti-spam) :
  // elle est recomposée en JavaScript à partir de ces deux parties.
  mailParts: ['lafeemenage6', 'gmail.com'],
  adresse: { rue: '38 Kerlay', cp: '56310', ville: 'Melrand', dep: 'Morbihan' },
  siret: '982 704 652 00022',
  siretBrut: '98270465200022',
  horaires: [
    ['Lundi au vendredi', '8 h à 18 h'],
    ['Samedi', '9 h à 12 h'],
    ['Dimanche', 'fermé'],
  ],
  avisUrl: 'https://g.page/r/ChIJO04JueNJEEgR9HvGzNV5fms/review',
  ficheGoogle: 'https://g.page/r/ChIJO04JueNJEEgR9HvGzNV5fms',
  note: '5,0',
  nbAvis: 10,
  ogImage: '/assets/images/og-accueil.jpg',
};

// Communes avec page dédiée, temps de route depuis Melrand (voiture, hors trafic).
export const communes = [
  { slug: 'melrand', nom: 'Melrand', temps: 'siège', tempsMin: 0 },
  { slug: 'pontivy', nom: 'Pontivy', temps: '≈ 25 min', tempsMin: 25 },
  { slug: 'lorient', nom: 'Lorient', temps: '≈ 45 min', tempsMin: 45 },
  { slug: 'auray', nom: 'Auray', temps: '≈ 45 min', tempsMin: 45 },
  { slug: 'vannes', nom: 'Vannes', temps: '≈ 55 min', tempsMin: 55 },
];

export const svg = {
  fleche: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
  tel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  lieu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  coche: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  etoile: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
  feuille: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
  bouclier: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 7 10-7"/></svg>',
  horloge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  poignee: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6-6 6 6 6M15 6l6 6-6 6"/></svg>',
};
