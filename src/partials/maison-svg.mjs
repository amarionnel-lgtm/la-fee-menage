// La maison en coupe. Chaque pièce est un groupe `.piece[data-piece]` que le
// défilement allume (classe `allumee`) quand la fiche correspondante est à l'écran.
const etoile = (x, y, s = 1) => {
  const r = (v) => Math.round(v * s * 10) / 10;
  return `<g transform="translate(${x} ${y})"><path class="piece__etoile" d="M0,${r(-7)} C${r(1)},${r(-2.5)} ${r(2.5)},${r(-1)} ${r(7)},0 C${r(2.5)},${r(1)} ${r(1)},${r(2.5)} 0,${r(7)} C${r(-1)},${r(2.5)} ${r(-2.5)},${r(1)} ${r(-7)},0 C${r(-2.5)},${r(-1)} ${r(-1)},${r(-2.5)} 0,${r(-7)}Z"/></g>`;
};

export const maisonSvg = `
<svg class="maison__svg" viewBox="10 14 580 456" role="img" aria-labelledby="maison-titre-svg" xmlns="http://www.w3.org/2000/svg">
  <title id="maison-titre-svg">Plan en coupe d'une maison : cuisine, séjour, chambres, salle de bain, vitres et terrasse</title>

  <!-- Herbe et sol -->
  <rect class="maison__herbe" x="0" y="404" width="600" height="66" rx="0"/>
  <line class="maison__sol" x1="14" y1="404" x2="586" y2="404"/>

  <!-- Extérieur : terrasse, arbre, plante -->
  <g class="piece" data-piece="exterieur">
    <rect class="piece__fond" x="470" y="384" width="112" height="20" rx="3"/>
    <g class="piece__meuble">
      <path d="M470 392h112M470 398h112M486 384v20M502 384v20M518 384v20M534 384v20M550 384v20M566 384v20"/>
      <path d="M520 384v-22M508 366h24l-4 -18h-16z"/>
      <path d="M62 404v-56"/>
      <path d="M62 348c-26 0-40-16-40-34 0-20 18-36 40-36s40 16 40 36c0 18-14 34-40 34z"/>
      <path d="M62 318v30M62 330l-12-10M62 336l12-10"/>
      <path d="M92 404v-14c0-6 6-8 10-4M92 396c-4-6-12-4-12 2"/>
    </g>
    ${etoile(548, 372, .9)}${etoile(30, 300, .8)}${etoile(505, 356, .7)}
  </g>

  <!-- Toit -->
  <polygon class="maison__toit" points="104,116 300,26 496,116"/>
  <rect class="maison__toit" x="380" y="52" width="22" height="34"/>

  <!-- Séjour (rez-de-chaussée gauche) -->
  <g class="piece" data-piece="sejour">
    <rect class="piece__fond" x="132" y="252" width="176" height="152"/>
    <g class="piece__meuble">
      <rect x="152" y="340" width="86" height="34" rx="8"/>
      <path d="M152 352h86M164 340v-16c0-4 4-8 8-8h46c4 0 8 4 8 8v16"/>
      <path d="M254 374v-30h30v30M254 358h30"/>
      <path d="M268 344v-18M258 326h20l-4-14h-12z"/>
      <path d="M150 300h44v26h-44zM172 300v26M150 313h44"/>
      <path d="M132 404v-56h14v56"/>
    </g>
    ${etoile(220, 290, 1)}${etoile(278, 312, .8)}${etoile(176, 388, .7)}
  </g>

  <!-- Cuisine (rez-de-chaussée droite) -->
  <g class="piece" data-piece="cuisine">
    <rect class="piece__fond" x="308" y="252" width="160" height="152"/>
    <g class="piece__meuble">
      <path d="M318 404v-42h140v42"/>
      <path d="M318 362h140"/>
      <path d="M330 362v42M348 362v42M370 372h10M400 362v42M430 362v42"/>
      <circle cx="376" cy="356" r="4"/><circle cx="388" cy="356" r="4"/>
      <path d="M408 352h40v8h-40zM428 338v14"/>
      <path d="M322 272h136v40h-136zM356 272v40M390 272v40M424 272v40"/>
      <path d="M330 294h14M364 294h14M398 294h14M432 294h14"/>
      <path d="M318 322h32v18h-32zM326 331h16"/>
    </g>
    ${etoile(340, 340, 1)}${etoile(450, 330, .8)}${etoile(392, 328, .7)}
  </g>

  <!-- Chambre (étage gauche) -->
  <g class="piece" data-piece="chambre">
    <rect class="piece__fond" x="132" y="116" width="168" height="136"/>
    <g class="piece__meuble">
      <path d="M150 252v-60h24v-14h96v14h10v60"/>
      <path d="M150 222h130M150 236h130"/>
      <path d="M178 204h26v12h-26z"/>
      <path d="M150 192h130"/>
      <path d="M244 192v-40M210 192v-40M210 152h34"/>
      <path d="M150 166h26v26h-26zM163 166v26"/>
    </g>
    ${etoile(160, 140, .9)}${etoile(270, 150, .8)}${etoile(226, 176, .7)}
  </g>

  <!-- Salle de bain (étage droite) -->
  <g class="piece" data-piece="sdb">
    <rect class="piece__fond" x="300" y="116" width="168" height="136"/>
    <g class="piece__meuble">
      <rect x="316" y="214" width="74" height="30" rx="10"/>
      <path d="M316 226h74M326 214v-16c0-6 4-10 10-10M336 190v6"/>
      <path d="M420 252v-28h34v28M420 238h34"/>
      <path d="M416 224c0-8 8-14 21-14s21 6 21 14"/>
      <path d="M437 210v-8"/>
      <rect x="418" y="150" width="38" height="44" rx="6"/>
      <path d="M340 148h30v30h-30z"/>
    </g>
    ${etoile(310, 140, .9)}${etoile(400, 200, .8)}${etoile(452, 136, .7)}
  </g>

  <!-- Vitres : les fenêtres de toutes les pièces -->
  <g class="piece" data-piece="vitres">
    <rect class="piece__fond" x="216" y="140" width="40" height="40" rx="3"/>
    <rect class="piece__fond" x="336" y="144" width="38" height="38" rx="3"/>
    <rect class="piece__fond" x="150" y="298" width="44" height="30" rx="3"/>
    <rect class="piece__fond" x="440" y="272" width="30" height="46" rx="3"/>
    <g class="piece__meuble">
      <rect x="216" y="140" width="40" height="40" rx="3"/><path d="M236 140v40M216 160h40"/>
      <rect x="336" y="144" width="38" height="38" rx="3"/><path d="M355 144v38M336 163h38"/>
      <rect x="150" y="298" width="44" height="30" rx="3"/><path d="M172 298v30"/>
      <rect x="440" y="272" width="30" height="46" rx="3"/><path d="M440 295h30"/>
    </g>
    ${etoile(236, 160, .9)}${etoile(355, 163, .8)}${etoile(172, 313, .7)}
  </g>

  <!-- Murs et planchers -->
  <g class="maison__mur">
    <rect x="132" y="116" width="336" height="288"/>
    <path d="M132 252h336"/>
    <path d="M300 116v136M308 252v152"/>
  </g>
  <!-- Porte d'entrée et escalier -->
  <g class="piece__trait">
    <path d="M132 404v-56a7 7 0 0 1 7-7h0"/>
    <path d="M280 252l-8 8h-8l-8 8h-8l-8 8h-8l-8 8h-8l-8 8"/>
  </g>
  <!-- Cheminée fumée -->
  <path class="piece__trait" d="M391 44c-6-8 6-14 0-22" opacity=".6"/>
</svg>`;
