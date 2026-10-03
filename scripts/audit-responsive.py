"""
Audit responsive sous WebKit, le moteur de Safari.

    python scripts/audit-responsive.py http://localhost:4322

Chaque page est ouverte à chaque largeur, et le script mesure ce qui casse
réellement plutôt que ce qui a l'air de casser :

  - débordement horizontal de la page, et l'élément qui en est la cause
  - éléments qui sortent du viewport
  - texte sous 12 px, illisible sur un téléphone
  - cibles tactiles sous 44 px (hors liens en pleine phrase, exemptés par WCAG)
  - chevauchements entre blocs voisins
  - images plus lourdes que nécessaire pour la largeur affichée

WebKit et non Chromium : c'est Safari qui sert de référence, et il diffère
sur les grilles, les unités de viewport et les polices.
"""
import sys
from playwright.sync_api import sync_playwright

BASE = (sys.argv[1] if len(sys.argv) > 1 else "http://localhost:4322").rstrip("/")

PAGES = [
    ("/", "accueil"),
    ("/services/menage-entretien-regulier-morbihan/", "prestation principale"),
    ("/services/nettoyage-bureaux-morbihan/", "prestation"),
    ("/services/nettoyage-coproprietes-morbihan/", "prestation"),
    ("/services/nettoyage-vitres-morbihan/", "prestation"),
    ("/services/nettoyage-terrasse-morbihan/", "prestation"),
    ("/services/nettoyage-demenagement-morbihan/", "prestation"),
    ("/services/nettoyage-fin-de-chantier-morbihan/", "prestation"),
    ("/services/nettoyage-syndrome-diogene-morbihan/", "prestation + étapes"),
    ("/pontivy/", "ville"),
    ("/lorient/", "ville"),
    ("/auray/", "ville"),
    ("/vannes/", "ville"),
    ("/melrand/", "ville"),
    ("/morbihan/", "carte"),
    ("/a-propos/", "à propos"),
    ("/contact/", "contact + formulaire"),
    ("/contact/?commune=Pontivy&prestation=Nettoyage+extr%C3%AAme+et+syndrome+de+Diog%C3%A8ne", "contact prérempli"),
    ("/mentions-legales/", "texte long"),
    ("/cette-page-n-existe-pas/", "404"),
]

LARGEURS = [
    (320, "petit téléphone"),
    (375, "iPhone SE"),
    (390, "iPhone 15"),
    (430, "iPhone Pro Max"),
    (599, "sous le point 600"),
    (600, "au-dessus du point 600"),
    (767, "sous le point 768"),
    (768, "iPad portrait"),
    (844, "téléphone en paysage"),
    (899, "sous le point 900"),
    (900, "au-dessus du point 900"),
    (1023, "sous le point 1024, menu mobile"),
    (1024, "iPad paysage, menu bureau"),
    (1080, "seuil tactile"),
    (1180, "petit portable"),
    (1280, "portable"),
    (1440, "portable large"),
    (1920, "grand écran"),
    (2560, "très grand écran"),
]

MESURE = """
() => {
  const de = document.documentElement;
  const vw = de.clientWidth;
  const probleme = [];

  // ce qui dépasse à droite
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.right > vw + 1.5) {
      const s = getComputedStyle(el);
      if (s.position === 'fixed' || s.overflowX === 'auto' || s.overflowX === 'scroll') continue;
      // un élément à l'intérieur d'un conteneur défilant ne déborde pas la page
      let p = el.parentElement, dansDefilant = false;
      while (p && p !== document.body) {
        const ps = getComputedStyle(p);
        if (ps.overflowX === 'auto' || ps.overflowX === 'scroll') { dansDefilant = true; break; }
        p = p.parentElement;
      }
      if (dansDefilant) continue;
      probleme.push({
        type: 'deborde',
        el: el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\\s+/)[0] : ''),
        de: Math.round(r.right - vw),
      });
    }
  }

  // texte trop petit
  const petits = new Set();
  for (const el of document.querySelectorAll('p, li, span, a, dd, dt, small, figcaption, td, th')) {
    if (!el.textContent.trim()) continue;
    const t = parseFloat(getComputedStyle(el).fontSize);
    if (t < 12) petits.add(el.tagName.toLowerCase() + ' ' + t + 'px');
  }

  // cibles tactiles : les liens en pleine phrase sont exemptés (WCAG 2.5.8)
  const petitesCibles = [];
  for (const el of document.querySelectorAll('a[href], button, input, select, textarea')) {
    // une case dans un label se clique par le label : c'est lui la vraie cible
    const enveloppe = el.closest('label');
    const r = (enveloppe && (el.type === 'checkbox' || el.type === 'radio') ? enveloppe : el).getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const dansTexte = el.closest('p, dd, li:not(.plan-liste li)') && el.tagName === 'A';
    if (dansTexte) continue;
    // WCAG 2.5.8 exige 24 px partout. Les 44 px viennent des recommandations
    // tactiles : on ne les impose donc que sur les largeurs d'un écran tactile.
    const tactile = vw <= 1080;
    const seuil = tactile ? 44 : 24;
    if (r.height < seuil) {
      const etiquette = ((el.innerText || el.value || el.tagName) + '').trim().slice(0, 26);
      petitesCibles.push(etiquette + ' · ' + Math.round(r.height) + 'px' + (r.height < 24 ? ' (sous le seuil AA de 24px)' : ' (sous les 44px tactiles)'));
    }
  }

  // chevauchements entre frères
  const chevauche = [];
  for (const parent of document.querySelectorAll('main *')) {
    if (parent.closest('svg')) continue;   // un SVG superpose ses formes par construction
    // un <br> n'a pas de boîte utile, et un enfant positionné en absolu est sorti
    // du flux : sa superposition aux frères est voulue (calques image/canvas/libellé)
    // un élément en ligne (lien dans une phrase) qui passe à la ligne a une boîte qui
    // recouvre la suivante : ce n'est pas un chevauchement de blocs
    const enfants = [...parent.children].filter(c => c.tagName !== 'BR' && c.getBoundingClientRect().height > 0
      && getComputedStyle(c).position !== 'absolute' && getComputedStyle(c).display !== 'inline');
    for (let i = 0; i < enfants.length - 1; i++) {
      const a = enfants[i].getBoundingClientRect(), b = enfants[i + 1].getBoundingClientRect();
      if (getComputedStyle(parent).display.includes('grid') || getComputedStyle(parent).display.includes('flex')) continue;
      if (b.top < a.bottom - 2 && b.left < a.right - 2 && a.left < b.right - 2) {
        chevauche.push(enfants[i].tagName + '/' + enfants[i + 1].tagName);
      }
    }
  }

  // textes courts coupés sur deux lignes : un numéro de téléphone ou un libellé
  // de bouton qui se casse en deux passe inaperçu dans un audit de débordement.
  const coupes = [];
  const texteCoupe = (el) => {
    for (const n of el.childNodes) {
      if (n.nodeType !== 3 || !n.textContent.trim()) continue;
      const rg = document.createRange();
      rg.selectNodeContents(n);
      if (rg.getClientRects().length > 1) return true;
    }
    return false;
  };
  for (const el of document.querySelectorAll('.bouton, .entete__tel-num, .entete__nav a, .tel-contact, .ligne__famille, .tuile__famille, th')) {
    const t = (el.innerText || '').trim();
    if (t.length === 0 || t.length > 32) continue;
    if (texteCoupe(el)) coupes.push(t.slice(0, 28));
  }

  // images servies bien plus larges que leur affichage
  const imagesLourdes = [];
  for (const img of document.images) {
    const r = img.getBoundingClientRect();
    if (/\.svg($|\?)/i.test(img.currentSrc)) continue;   // un SVG n'a pas de résolution
    if (r.width > 0 && img.naturalWidth > r.width * 3) {
      imagesLourdes.push(img.currentSrc.split('/').pop() + ' : ' + img.naturalWidth + 'px pour ' + Math.round(r.width) + 'px');
    }
  }

  return {
    deborde: document.body.scrollWidth > vw + 1,
    scrollWidth: document.body.scrollWidth,
    vw,
    coupables: probleme.slice(0, 4),
    petits: [...petits].slice(0, 4),
    petitesCibles: petitesCibles.slice(0, 4),
    chevauche: [...new Set(chevauche)].slice(0, 3),
    coupes: [...new Set(coupes)].slice(0, 4),
    imagesLourdes: imagesLourdes.slice(0, 3),
  };
}
"""

VERT, ROUGE, JAUNE, GRIS, FIN = "\033[32m", "\033[31m", "\033[33m", "\033[90m", "\033[0m"

def main() -> int:
    anomalies = 0
    with sync_playwright() as p:
        nav = p.webkit.launch()
        print(f"\nAUDIT RESPONSIVE · WebKit · {BASE}")
        print("─" * 74)
        for largeur, appareil in LARGEURS:
            page = nav.new_page(viewport={"width": largeur, "height": 900})
            defauts_largeur = []
            for chemin, nom in PAGES:
                page.goto(BASE + chemin, wait_until="load")
                page.wait_for_timeout(120)
                r = page.evaluate(MESURE)
                messages = []
                if r["deborde"]:
                    detail = ", ".join(f"{c['el']} (+{c['de']}px)" for c in r["coupables"]) or "cause non localisée"
                    messages.append(f"déborde de {r['scrollWidth'] - r['vw']}px · {detail}")
                if r["petits"]:
                    messages.append("texte sous 12px : " + ", ".join(r["petits"]))
                if r["petitesCibles"]:
                    messages.append("cibles < 44px : " + ", ".join(r["petitesCibles"]))
                if r["chevauche"]:
                    messages.append("chevauchement : " + ", ".join(r["chevauche"]))
                if r["coupes"]:
                    messages.append("texte court coupé sur deux lignes : " + ", ".join(r["coupes"]))
                if r["imagesLourdes"]:
                    messages.append("image surdimensionnée : " + ", ".join(r["imagesLourdes"]))
                if messages:
                    defauts_largeur.append((nom, chemin, messages))
            page.close()

            if defauts_largeur:
                anomalies += len(defauts_largeur)
                print(f"\n{ROUGE}✗{FIN} {largeur:>4}px {GRIS}{appareil}{FIN}")
                for nom, chemin, messages in defauts_largeur:
                    print(f"    {chemin} {GRIS}({nom}){FIN}")
                    for m in messages:
                        print(f"      · {m}")
            else:
                print(f"{VERT}✓{FIN} {largeur:>4}px {GRIS}{appareil} — {len(PAGES)} pages sans défaut{FIN}")
        nav.close()

    print("─" * 74)
    if anomalies == 0:
        print(f"  {VERT}Aucun défaut sur {len(PAGES)} pages × {len(LARGEURS)} largeurs.{FIN}\n")
        return 0
    print(f"  {ROUGE}{anomalies} page(s) en défaut à corriger.{FIN}\n")
    return 1

if __name__ == "__main__":
    sys.exit(main())
