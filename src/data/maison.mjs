// La maison de Florence, pièce par pièce.
// `passage` : ce qui est fait à chaque passage régulier (trait magenta).
// `remise` : ce qui relève d'une remise en état ponctuelle (point vert).
// À faire valider par Florence ligne par ligne.
export const pieces = [
  {
    id: "cuisine",
    nom: "Cuisine",
    ou: "Rez-de-chaussée, à droite",
    passage: ["Plan de travail, plaques et crédence dégraissés", "Évier et robinetterie détartrés", "Façades de meubles et extérieur des appareils", "Table, chaises, poubelle vidée", "Sol aspiré et lavé"],
    remise: ["Intérieur du four, de la hotte et du réfrigérateur", "Placards vidés et lavés", "Joints et silicones"],
  },
  {
    id: "sejour",
    nom: "Séjour et entrée",
    ou: "Rez-de-chaussée, à gauche",
    passage: ["Meubles, étagères et objets dépoussiérés", "Écrans et surfaces vitrées essuyés", "Canapé et coussins aspirés", "Interrupteurs et poignées", "Sol aspiré et lavé, tapis aspirés"],
    remise: ["Plinthes, radiateurs et hauts de portes", "Traces sur les murs et les portes", "Luminaires"],
  },
  {
    id: "chambre",
    nom: "Chambres",
    ou: "Étage, à gauche",
    passage: ["Lits refaits, draps changés si le linge est prêt", "Tables de nuit, commodes et rebords", "Miroirs", "Sol aspiré, dessous de lit compris"],
    remise: ["Matelas et sommier aspirés", "Intérieur des placards", "Volets et encadrements"],
  },
  {
    id: "sdb",
    nom: "Salle de bain et WC",
    ou: "Étage, à droite",
    passage: ["Douche ou baignoire et parois détartrées", "Lavabo, robinetterie et miroir", "Cuvette, abattant et réservoir désinfectés", "Serviettes changées si fournies", "Sol lavé"],
    remise: ["Joints de carrelage et silicones", "Bonde et siphon", "Traces de calcaire anciennes"],
  },
  {
    id: "vitres",
    nom: "Vitres",
    ou: "Toutes les fenêtres",
    passage: ["Traces de doigts sur les portes vitrées", "Miroirs"],
    remise: ["Vitres intérieures et extérieures à la raclette", "Châssis, rails et joints", "Véranda et baies vitrées"],
  },
  {
    id: "exterieur",
    nom: "Terrasse et abords",
    ou: "Dehors",
    passage: ["Entrée balayée, paillasson", "Feuilles ramassées devant la porte"],
    remise: ["Terrasse démoussée, pression adaptée au revêtement", "Mobilier de jardin nettoyé", "Allées et bordures désherbées"],
  },
];
