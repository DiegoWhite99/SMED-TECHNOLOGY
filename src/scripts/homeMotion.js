// Animaciones del home: el contenido entra flotando y se asienta al aparecer,
// y las cifras cuentan hasta su valor. Sin JS o con movimiento reducido,
// todo se muestra en su estado final.
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  // The <head> failsafe un-hides [data-reveal] content if this flag never gets set
  window.__smedMotion = true;
  document.documentElement.classList.add('motion-ready');

  document.querySelectorAll('[data-reveal-group]').forEach((group) => {
    const step = Number(group.dataset.revealGroup) || 120;
    group.querySelectorAll('[data-reveal]').forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${i * step}ms`);
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });

  // The hero plays its entrance on load: its offset start state can sit below the
  // fold, so waiting for intersection would leave a blank gap until the user scrolls
  const firstSection = document.querySelector('[data-scene]');
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    if (firstSection && firstSection.contains(el)) {
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-in')));
    } else {
      revealObserver.observe(el);
    }
  });

  // Parallax sutil: las marcas de agua (palabras MISIÓN/VISIÓN y las cifras de
  // cada caso) se quedan atrás del scroll y se leen como una capa de fondo.
  // Solo escribe --py; el CSS decide qué elemento se mueve.
  const layers = [];
  const addLayer = (selector, amplitude) => {
    document.querySelectorAll(selector).forEach((el) => layers.push({ el, amplitude }));
  };
  addLayer('.identity-ghost', 34);
  addLayer('.case', 26);

  if (layers.length) {
    // Solo se recalculan las capas que están en pantalla
    const onScreen = new Set();
    let layerFrame = 0;
    const queueLayers = () => {
      if (layerFrame) return;
      layerFrame = requestAnimationFrame(updateLayers);
    };
    const layerObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) onScreen.add(entry.target);
        else onScreen.delete(entry.target);
      });
      queueLayers();
    }, { rootMargin: '20% 0px' });
    layers.forEach(({ el }) => layerObserver.observe(el));

    const updateLayers = () => {
      layerFrame = 0;
      const vh = window.innerHeight;
      layers.forEach(({ el, amplitude }) => {
        if (!onScreen.has(el)) return;
        const rect = el.getBoundingClientRect();
        // +1 al entrar por abajo, -1 al salir por arriba
        const raw = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
        const progress = Math.max(-1, Math.min(1, raw));
        // Signo negativo: la capa se rezaga respecto al scroll y parece más lejana
        el.style.setProperty('--py', `${(-progress * amplitude).toFixed(1)}px`);
      });
    };
    window.addEventListener('scroll', queueLayers, { passive: true });
    window.addEventListener('resize', queueLayers, { passive: true });
    updateLayers();
  }

  // Spotlight: la tarjeta de cada caso se ilumina donde está el cursor
  document.querySelectorAll('.case').forEach((card) => {
    let spotFrame = 0;
    card.addEventListener('pointermove', (event) => {
      const { clientX, clientY } = event;
      if (spotFrame) return;
      spotFrame = requestAnimationFrame(() => {
        spotFrame = 0;
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${(((clientX - rect.left) / rect.width) * 100).toFixed(1)}%`);
        card.style.setProperty('--my', `${(((clientY - rect.top) / rect.height) * 100).toFixed(1)}%`);
      });
    }, { passive: true });
  });

  const render = (el, value) => {
    el.textContent = `${Math.round(value)}${el.dataset.suffix || ''}`;
  };

  const count = (el) => {
    const from = Number(el.dataset.from || 0);
    const to = Number(el.dataset.count);
    const duration = Number(el.dataset.duration || 1800);
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      render(el, from + (to - from) * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.closest('.stat')?.classList.add('is-counting');
      count(entry.target);
      countObserver.unobserve(entry.target);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('[data-count]').forEach((el) => {
    render(el, Number(el.dataset.from || 0));
    countObserver.observe(el);
  });
})();
