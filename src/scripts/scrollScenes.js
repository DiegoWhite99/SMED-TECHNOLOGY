// Fondo ligado al scroll: cada [data-scene] declara su color en CSS (--scene-bg)
// y el fondo se mezcla entre secciones vecinas al cruzar el borde entre ellas.
(function () {
  const sections = Array.from(document.querySelectorAll('[data-scene]'));
  if (!sections.length) return;

  const body = document.body;
  let stops = [];
  let ticking = false;

  const parseColor = (value) => {
    const v = value.trim();
    if (v.startsWith('#')) {
      const hex = v.length === 4 ? v.slice(1).split('').map((c) => c + c).join('') : v.slice(1, 7);
      return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
    }
    const nums = v.match(/\d+(\.\d+)?/g);
    return nums ? nums.slice(0, 3).map(Number) : [255, 255, 255];
  };

  const measure = () => {
    const blend = Math.min(window.innerHeight * 0.6, 480);
    stops = sections.map((section) => ({
      top: section.getBoundingClientRect().top + window.scrollY,
      height: section.offsetHeight,
      color: parseColor(getComputedStyle(section).getPropertyValue('--scene-bg')),
    }));
    // Half-width of the blend zone at each section's top edge; capped at half of
    // both neighbours so zones never overlap inside short sections
    stops.forEach((stop, i) => {
      stop.half = i === 0 ? 0 : Math.min(blend, stop.height / 2, stops[i - 1].height / 2);
    });
  };

  const update = () => {
    ticking = false;
    const y = window.scrollY + window.innerHeight / 2;

    let i = stops.length - 1;
    while (i > 0 && stops[i].top > y) i--;

    const cur = stops[i];
    const next = stops[i + 1];
    let from = cur.color;
    let to = from;
    let t = 0;
    if (i > 0 && y - cur.top < cur.half) {
      from = stops[i - 1].color;
      t = 0.5 + (y - cur.top) / (2 * cur.half);
      to = cur.color;
    } else if (next && next.top - y < next.half) {
      to = next.color;
      t = 0.5 - (next.top - y) / (2 * next.half);
    }

    const ease = t * t * (3 - 2 * t);
    const rgb = from.map((v, k) => Math.round(v + (to[k] - v) * ease));
    body.style.setProperty('--bg', `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);

    // Text flips to light once the blended background is dark enough
    const lightness = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
    const tone = lightness < 0.45 ? 'dark' : 'light';
    if (body.dataset.tone !== tone) body.dataset.tone = tone;
  };

  const requestUpdate = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  const refresh = () => {
    measure();
    update();
  };

  refresh();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', refresh);
  window.addEventListener('load', refresh);
  // Lazy images shift section offsets; theme toggle swaps the palette
  new ResizeObserver(refresh).observe(document.querySelector('main') || body);
  new MutationObserver(refresh).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
})();
