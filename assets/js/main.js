document.addEventListener('components:loaded', () => {
  initHeaderScroll();
  initBurger();
  initDropdowns();
  initActiveNav();
  initEmailObfuscation();
  initFooterYear();
});

function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initBurger() {
  const btn = document.getElementById('burger-btn');
  const nav = document.getElementById('mobile-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    nav.hidden = open;
    document.body.classList.toggle('nav-open', !open);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !nav.hidden) {
      btn.setAttribute('aria-expanded', 'false');
      nav.hidden = true;
      document.body.classList.remove('nav-open');
      btn.focus();
    }
  });
}

function initDropdowns() {
  document.querySelectorAll('.has-dropdown > a').forEach((trigger) => {
    trigger.addEventListener('keydown', (e) => {
      const parent = trigger.closest('.has-dropdown');
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const expanded = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(!expanded));
        parent.classList.toggle('open', !expanded);
      }
      if (e.key === 'Escape') {
        trigger.setAttribute('aria-expanded', 'false');
        parent.classList.remove('open');
        trigger.focus();
      }
    });
  });

  // Sync aria-expanded avec l'état CSS :hover pour les lecteurs d'écran
  document.querySelectorAll('.has-dropdown').forEach((parent) => {
    const trigger = parent.querySelector('[aria-expanded]');
    if (!trigger) return;
    parent.addEventListener('mouseenter', () => trigger.setAttribute('aria-expanded', 'true'));
    parent.addEventListener('mouseleave', () => trigger.setAttribute('aria-expanded', 'false'));
  });

  document.addEventListener('click', (e) => {
    document.querySelectorAll('.has-dropdown.open').forEach((el) => {
      if (!el.contains(e.target)) {
        el.classList.remove('open');
        el.querySelector('[aria-expanded]')?.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

function initActiveNav() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-link').forEach((link) => {
    const href = (link.getAttribute('href') || '').replace(/\/$/, '') || '/';
    const match = href === '/' ? path === '/' : path === href || path.startsWith(href + '/');
    if (match) link.setAttribute('aria-current', 'page');
  });
}

function initEmailObfuscation() {
  document.querySelectorAll('[data-email]').forEach((el) => {
    const raw = el.dataset.email;
    if (!raw) return;
    const atIndex = raw.lastIndexOf('|');
    if (atIndex === -1) return;
    const email = raw.slice(0, atIndex) + '@' + raw.slice(atIndex + 1);
    if (el.tagName === 'A') {
      el.href = `mailto:${email}`;
      const label = el.dataset.emailLabel;
      if (label && !el.querySelector('svg, img')) {
        // Lien texte simple — on peut remplacer le contenu
        el.textContent = label;
      }
      // Si SVG présent (bouton CTA) : on met à jour href seulement, les enfants sont préservés
    } else {
      el.textContent = email;
    }
  });
}

function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}
