// Intro con capas en parallax (basado en "Parallax image layers" de Osmo):
// mientras el intro sale de pantalla, cada [data-parallax-layer] baja un
// porcentaje distinto de su propia altura, así el fondo va más lento que el
// frente. Sin GSAP ni Lenis: un rAF con interpolación imita el scrub suave.
(function () {
  const root = document.querySelector('[data-parallax-layers]');
  if (!root) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Same depths as the reference: back layer travels the most
  const DEPTH = { 1: 70, 2: 55, 3: 40, 4: 10 };
  const layers = [...root.querySelectorAll('[data-parallax-layer]')].map((el) => ({
    el,
    depth: DEPTH[el.dataset.parallaxLayer] || 0,
  }));

  let target = 0;
  let current = 0;
  let raf = 0;

  // Progress runs 0 → 1 from the intro's top at the viewport top to its bottom there
  const measure = () => {
    const rect = root.getBoundingClientRect();
    target = Math.min(Math.max(-rect.top / (rect.height || 1), 0), 1);
  };

  const frame = () => {
    current += (target - current) * 0.14;
    if (Math.abs(target - current) < 0.0005) current = target;
    layers.forEach(({ el, depth }) => {
      el.style.transform = `translate3d(0, ${(depth * current).toFixed(3)}%, 0)`;
    });
    raf = current === target ? 0 : requestAnimationFrame(frame);
  };

  const kick = () => {
    measure();
    if (!raf) raf = requestAnimationFrame(frame);
  };

  window.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', kick);
  kick();
})();
