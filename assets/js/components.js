(async function () {
  const slots = document.querySelectorAll('[data-component]');

  await Promise.all(
    Array.from(slots).map(async (slot) => {
      const name = slot.dataset.component;
      try {
        const res = await fetch(`/components/${name}.html`);
        if (!res.ok) throw new Error(`HTTP ${res.status} — ${name}.html`);
        const html = await res.text();
        slot.insertAdjacentHTML('afterend', html);
      } catch (err) {
        console.warn('Composant introuvable :', err.message);
      } finally {
        slot.remove();
      }
    })
  );

  document.dispatchEvent(new CustomEvent('components:loaded'));
})();
