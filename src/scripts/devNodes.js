// Estructura 3D de nodos del hero de Desarrollo: una arquitectura de software
// en capas (clientes → servicios → datos) que gira sobre su eje.
//
// No hay librería 3D: los nodos viven en coordenadas (x, y, z), se rotan con
// matrices y se proyectan en perspectiva sobre el SVG en cada frame. La
// profundidad manda sobre el radio, la opacidad y el orden de pintado, que es
// lo que da la sensación de volumen.
(function () {
  const host = document.querySelector('[data-dev-nodes]');
  if (!host) return;

  const NS = 'http://www.w3.org/2000/svg';
  const VIEW = 400;          // lado del viewBox
  const CENTER = VIEW / 2;
  const SCALE = 118;         // unidades de mundo → px
  const DIST = 4.2;          // distancia de la cámara (perspectiva)

  // ── El grafo: tres capas y un núcleo ──
  const ring = (count, radius, y, phase = 0) =>
    Array.from({ length: count }, (_, i) => {
      const a = phase + (i / count) * Math.PI * 2;
      return { x: Math.cos(a) * radius, y, z: Math.sin(a) * radius };
    });

  const core = [{ x: 0, y: 0, z: 0, core: true }];
  const clientes = ring(4, 0.78, -1.15, 0.4);
  const servicios = ring(6, 1.2, 0, 0);
  const datos = ring(3, 0.72, 1.15, 0.9);

  const nodes = [...core, ...clientes, ...servicios, ...datos];
  const iCore = 0;
  const iCli = 1;
  const iSrv = iCli + clientes.length;
  const iDat = iSrv + servicios.length;

  const edges = [];
  // cada cliente baja a dos servicios
  clientes.forEach((_, i) => {
    edges.push([iCli + i, iSrv + (i * 2) % servicios.length]);
    edges.push([iCli + i, iSrv + (i * 2 + 1) % servicios.length]);
  });
  // anillo de servicios y bajada al núcleo
  servicios.forEach((_, i) => {
    edges.push([iSrv + i, iSrv + ((i + 1) % servicios.length)]);
    edges.push([iSrv + i, iCore]);
  });
  // el núcleo alimenta la capa de datos
  datos.forEach((_, i) => edges.push([iCore, iDat + i]));

  // ── SVG ──
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${VIEW} ${VIEW}`);
  svg.setAttribute('role', 'presentation');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('dev-nodes-svg');
  host.appendChild(svg);

  const gEdges = document.createElementNS(NS, 'g');
  const gNodes = document.createElementNS(NS, 'g');
  svg.append(gEdges, gNodes);

  const lines = edges.map(() => {
    const l = document.createElementNS(NS, 'line');
    l.setAttribute('class', 'dev-node-edge');
    gEdges.appendChild(l);
    return l;
  });

  const dots = nodes.map((n) => {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('class', n.core ? 'dev-node dev-node--core' : 'dev-node');
    gNodes.appendChild(c);
    return c;
  });

  // ── Proyección ──
  const projected = nodes.map(() => ({ x: 0, y: 0, depth: 1 }));

  function project(t) {
    const ry = t * 0.00022;                    // giro continuo sobre Y
    const rx = -0.32 + Math.sin(t * 0.00013) * 0.12;  // cabeceo suave
    const cy = Math.cos(ry), sy = Math.sin(ry);
    const cx = Math.cos(rx), sx = Math.sin(rx);

    nodes.forEach((n, i) => {
      // rotar en Y, luego en X
      const x1 = n.x * cy - n.z * sy;
      const z1 = n.x * sy + n.z * cy;
      const y2 = n.y * cx - z1 * sx;
      const z2 = n.y * sx + z1 * cx;

      const k = DIST / (DIST - z2);            // perspectiva
      const p = projected[i];
      p.x = CENTER + x1 * SCALE * k;
      p.y = CENTER + y2 * SCALE * k;
      p.depth = k;                              // >1 cerca, <1 lejos
    });
  }

  function paint() {
    // el orden de pintado es la clave del volumen: lo lejano primero
    const orden = projected.map((p, i) => i).sort((a, b) => projected[a].depth - projected[b].depth);

    lines.forEach((l, i) => {
      const [a, b] = edges[i];
      const pa = projected[a], pb = projected[b];
      l.setAttribute('x1', pa.x.toFixed(1));
      l.setAttribute('y1', pa.y.toFixed(1));
      l.setAttribute('x2', pb.x.toFixed(1));
      l.setAttribute('y2', pb.y.toFixed(1));
      const d = (pa.depth + pb.depth) / 2;
      l.setAttribute('opacity', Math.max(0.06, Math.min(0.5, (d - 0.72) * 1.5)).toFixed(3));
      l.setAttribute('stroke-width', (d * 1.1).toFixed(2));
    });

    orden.forEach((i) => {
      const p = projected[i];
      const c = dots[i];
      const base = nodes[i].core ? 9 : 5.2;
      c.setAttribute('cx', p.x.toFixed(1));
      c.setAttribute('cy', p.y.toFixed(1));
      c.setAttribute('r', (base * p.depth).toFixed(2));
      c.setAttribute('opacity', Math.max(0.28, Math.min(1, (p.depth - 0.6) * 1.9)).toFixed(3));
      gNodes.appendChild(c); // reordena por profundidad
    });
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    project(3200); // un fotograma fijo, en un ángulo que se lee bien
    paint();
    return;
  }

  // Solo anima mientras se ve: fuera de pantalla no gasta frames
  let visible = true;
  let raf = 0;
  const loop = (t) => {
    project(t);
    paint();
    raf = visible ? requestAnimationFrame(loop) : 0;
  };

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    }, { rootMargin: '120px 0px' }).observe(host);
  }
  raf = requestAnimationFrame(loop);
})();
