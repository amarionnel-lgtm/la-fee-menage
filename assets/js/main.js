/* La Fée Ménage v2 : comportement du site, sans dépendance. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* En-tête : ombre après défilement */
  const entete = $('#entete');
  if (entete) {
    const maj = () => entete.classList.toggle('defile', scrollY > 8);
    addEventListener('scroll', maj, { passive: true });
    maj();
  }

  /* Menu mobile */
  const burger = $('#burger');
  const navMobile = $('#nav-mobile');
  if (burger && navMobile) {
    const bascule = (ouvrir) => {
      burger.setAttribute('aria-expanded', String(ouvrir));
      burger.setAttribute('aria-label', ouvrir ? 'Fermer le menu' : 'Ouvrir le menu');
      navMobile.dataset.ouvert = String(ouvrir);
      document.body.classList.toggle('menu-ouvert', ouvrir);
    };
    burger.addEventListener('click', () => bascule(burger.getAttribute('aria-expanded') !== 'true'));
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && navMobile.dataset.ouvert === 'true') { bascule(false); burger.focus(); } });
  }

  /* Menus déroulants : ouverture au clavier, état aria */
  $$('.nav__item--menu').forEach((item) => {
    const lien = $('[aria-expanded]', item);
    if (!lien) return;
    const poser = (v) => lien.setAttribute('aria-expanded', String(v));
    item.addEventListener('mouseenter', () => poser(true));
    item.addEventListener('mouseleave', () => poser(false));
    item.addEventListener('focusin', () => poser(true));
    item.addEventListener('focusout', (e) => { if (!item.contains(e.relatedTarget)) poser(false); });
  });

  /* Lien de la page courante */
  const chemin = location.pathname.replace(/\/$/, '') || '/';
  $$('.nav__lien, .nav__menu a').forEach((a) => {
    const h = (a.getAttribute('href') || '').replace(/\/$/, '') || '/';
    if (h !== '/' && (chemin === h || chemin.startsWith(h + '/'))) a.setAttribute('aria-current', 'page');
  });

  /* Adresse mail recomposée (jamais en clair dans le HTML) */
  const parts = ['lafeemenage6', 'gmail.com'];
  const mail = parts.join('@');
  $$('[data-mail]').forEach((a) => {
    a.href = 'mailto:' + mail;
    if (a.dataset.mailLabel !== undefined && !a.dataset.mailLabel) a.textContent = mail;
  });
  $$('[data-mail-texte]').forEach((el) => { el.textContent = mail; });

  /* Année du pied de page */
  $$('[data-annee]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  /* Apparitions à l'entrée dans l'écran */
  const reveals = $$('.reveal');
  if (reveals.length) {
    if (reduit || !('IntersectionObserver' in window)) reveals.forEach((el) => el.classList.add('visible'));
    else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      reveals.forEach((el) => io.observe(el));
    }
  }

  /* La maison pièce par pièce : la fiche au centre de l'écran allume sa pièce */
  const fiches = $$('.fiche[data-piece]');
  if (fiches.length) {
    const svg = $('.maison__svg');
    const legende = $('[data-legende]');
    const legendeOu = $('[data-legende-ou]');
    const pieces = new Map($$('.piece[data-piece]', svg).map((g) => [g.dataset.piece, g]));
    const allumer = (id) => {
      pieces.forEach((g, k) => g.classList.toggle('allumee', k === id));
      fiches.forEach((f) => f.classList.toggle('active', f.dataset.piece === id));
      const f = fiches.find((x) => x.dataset.piece === id);
      if (f && legende) { legende.textContent = $('h3', f).firstChild.textContent.trim(); legendeOu.textContent = $('h3 small', f).textContent; }
    };
    allumer(fiches[0].dataset.piece);
    if ('IntersectionObserver' in window) {
      // Bande étroite au milieu de l'écran : la fiche qui la traverse est la fiche active.
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) allumer(e.target.dataset.piece); });
      }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
      fiches.forEach((f) => io.observe(f));
    }
    fiches.forEach((f) => f.addEventListener('click', () => allumer(f.dataset.piece)));
  }

  /* Barre mobile : se cache quand le formulaire de devis est visible */
  const barre = $('#barre-mobile');
  const formDevis = $('#devis');
  if (barre && formDevis && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      entries.forEach((e) => barre.classList.toggle('cachee', e.isIntersecting));
    }, { threshold: 0.15 }).observe(formDevis);
  }

  /* Formulaire du hero : commune vers la page contact, ou vers la page ville si elle existe */
  const villes = { melrand: '/melrand/', pontivy: '/pontivy/', lorient: '/lorient/', auray: '/auray/', vannes: '/vannes/' };
  $$('[data-commune-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      const v = ($('input[name=commune]', form).value || '').trim();
      const cle = v.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
      if (villes[cle]) { e.preventDefault(); location.href = villes[cle] + '#demande'; }
      else if (v) { e.preventDefault(); location.href = '/contact/?commune=' + encodeURIComponent(v) + '#devis'; }
    });
  });

  /* Formulaire de devis : préremplissage depuis l'adresse, horodatage, envoi */
  if (formDevis) {
    const q = new URLSearchParams(location.search);
    const commune = $('input[name=commune]', formDevis);
    const prestation = $('select[name=prestation]', formDevis);
    if (q.get('commune') && commune && !commune.value) commune.value = q.get('commune');
    if (q.get('prestation') && prestation) prestation.value = q.get('prestation');
    const depuis = $('input[name=depuis]', formDevis);
    if (depuis) depuis.value = String(Date.now());
    const retour = $('.formulaire__retour', formDevis);
    const bouton = $('button[type=submit]', formDevis);
    const dire = (etat, texte) => { retour.dataset.etat = etat; retour.textContent = texte; };

    formDevis.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nom = $('input[name=nom]', formDevis).value.trim();
      const tel = $('input[name=tel]', formDevis).value.trim();
      const courriel = $('input[name=mail]', formDevis).value.trim();
      if (!nom || !commune.value.trim()) return dire('erreur', 'Votre nom et votre commune suffisent pour commencer.');
      if (!tel && !courriel) return dire('erreur', 'Indiquez un téléphone ou un e-mail pour que Florence puisse vous répondre.');
      bouton.disabled = true;
      try {
        const res = await fetch(formDevis.action, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(formDevis))) });
        if (res.ok) { dire('ok', 'Demande envoyée. Florence vous répond sous 24 h, souvent le jour même.'); formDevis.reset(); }
        else if (res.status === 503) ouvrirMessagerie();
        else { const j = await res.json().catch(() => ({})); dire('erreur', j.erreur || "L'envoi n'a pas abouti. Vous pouvez appeler le 06 41 84 36 34."); }
      } catch { ouvrirMessagerie(); }
      bouton.disabled = false;
    });

    // Repli si le service d'envoi n'est pas disponible : la messagerie du visiteur s'ouvre, préremplie.
    function ouvrirMessagerie() {
      const d = Object.fromEntries(new FormData(formDevis));
      const corps = `Bonjour Florence,\n\nNom : ${d.nom}\nCommune : ${d.commune}\nTéléphone : ${d.tel || '-'}\nE-mail : ${d.mail || '-'}\nBesoin : ${d.prestation || 'à définir'}\n\n${d.message || ''}`;
      location.href = 'mailto:' + mail + '?subject=' + encodeURIComponent('Demande de devis, ' + d.commune) + '&body=' + encodeURIComponent(corps);
      dire('ok', "Votre messagerie s'ouvre avec la demande préremplie. Si ce n'est pas le cas, appelez le 06 41 84 36 34.");
    }
  }

  /* Avant / après */
  $$('.avant-apres').forEach((bloc) => {
    const r = $('input[type=range]', bloc);
    if (!r) return;
    const maj = () => bloc.style.setProperty('--pos', r.value + '%');
    r.addEventListener('input', maj); maj();
  });
})();
