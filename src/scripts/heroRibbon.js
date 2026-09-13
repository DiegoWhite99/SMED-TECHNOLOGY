// Cinta 3D del hero: una tira que gira sobre una curva de Bézier y se sombrea
// según cuánto mira al frente. Se pausa fuera de pantalla y queda quieta con
// movimiento reducido.
(function () {
  const canvas = document.querySelector('.hero-ribbon');
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SEGMENTS = 260;
  // Curve from lower-left to upper-right, in units of the ribbon's box
  const P = [[0.04, 1.02], [0.42, 0.9], [0.52, 0.32], [0.98, -0.04]];
  // Palettes from shadow to highlight, for the two faces of the strip
  const FRONT = [[16, 70, 180], [60, 150, 236], [196, 232, 255]];
  const BACK = [[9, 36, 104], [28, 96, 196], [110, 182, 244]];

  let width = 0;
  let height = 0;
  let phase = 0;
  let frame = 0;
  let visible = true;
  let pointerX = 0;

  const bezier = (t) => {
    const u = 1 - t;
    const a = u * u * u;
    const b = 3 * u * u * t;
    const c = 3 * u * t * t;
    const d = t * t * t;
    return [0, 1].map((k) => a * P[0][k] + b * P[1][k] + c * P[2][k] + d * P[3][k]);
  };

  const tangent = (t) => {
    const u = 1 - t;
    return [0, 1].map((k) =>
      3 * u * u * (P[1][k] - P[0][k]) + 6 * u * t * (P[2][k] - P[1][k]) + 3 * t * t * (P[3][k] - P[2][k]));
  };

  const mix = (a, b, k) => a.map((v, i) => Math.round(v + (b[i] - v) * k));
  const shade = (pal, k) => (k < 0.5 ? mix(pal[0], pal[1], k * 2) : mix(pal[1], pal[2], (k - 0.5) * 2));

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    const wide = width > 900;
    const box = wide
      ? { x: width * 0.12 + pointerX * 18, y: -height * 0.02, w: width * 0.88, h: height * 0.8 }
      : { x: 0, y: height * 0.04, w: width, h: height * 0.5 };
    const base = Math.min(box.w, box.h) * (wide ? 0.085 : 0.12);

    let prev = null;
    for (let i = 0; i <= SEGMENTS; i++) {
      const t = i / SEGMENTS;
      const [cx, cy] = bezier(t);
      const [tx, ty] = tangent(t);
      const len = Math.hypot(tx * box.w, ty * box.h) || 1;
      const nx = -(ty * box.h) / len;
      const ny = (tx * box.w) / len;
      const x = box.x + cx * box.w;
      const y = box.y + cy * box.h;

      const theta = t * Math.PI * 3.2 + phase;
      const c = Math.cos(theta);
      // Tapered ends instead of an alpha fade: overlapping translucent quads show as stripes
      const w = base * (0.1 + 0.9 * Math.sin(Math.PI * t));
      const e1 = [x + nx * w * c, y + ny * w * c];
      const e2 = [x - nx * w * c, y - ny * w * c];

      if (prev) {
        const spec = Math.pow(Math.max(0, Math.sin(theta + 0.9)), 18) * 0.55;
        const k = Math.min(1, 0.22 + 0.72 * Math.pow(Math.abs(c), 1.2) + spec);
        const [r, g, b] = shade(c >= 0 ? FRONT : BACK, k);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(prev[0][0], prev[0][1]);
        ctx.lineTo(e1[0], e1[1]);
        ctx.lineTo(e2[0], e2[1]);
        ctx.lineTo(prev[1][0], prev[1][1]);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      prev = [e1, e2];
    }

    phase += 0.006;
    if (!reduceMotion && visible && !document.hidden) frame = requestAnimationFrame(draw);
  };

  const restart = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(draw);
  };

  resize();
  draw();

  new ResizeObserver(() => {
    resize();
    if (reduceMotion) draw();
  }).observe(canvas);

  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible && !reduceMotion) restart();
  }).observe(canvas);

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && visible && !reduceMotion) restart();
  });

  window.addEventListener('pointermove', (e) => {
    pointerX = e.clientX / window.innerWidth - 0.5;
  }, { passive: true });
})();
