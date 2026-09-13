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
