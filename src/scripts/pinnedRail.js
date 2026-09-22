// Carril horizontal anclado: la sección se queda fija mientras sus paneles
// se desplazan de lado. El scroll vertical de la página alimenta el avance
// horizontal, así que no hay que capturar la rueda ni secuestrar el gesto.
//
// La altura de la sección la define el CSS a partir de cuánto tiene que
// recorrer el carril, y el JS solo traduce "cuánto llevo de la sección"
// en "cuánto desplazo el carril".
(function () {
  const secciones = document.querySelectorAll('[data-pinned-rail]');
  if (!secciones.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const carriles = [...secciones].map((seccion) => {
    const pista = seccion.querySelector('[data-rail-track]');
    return pista ? { seccion, pista, recorrido: 0 } : null;
  }).filter(Boolean);

  if (!carriles.length) return;

  // Sin movimiento o en móvil el carril se lee como scroll horizontal normal
  const anclado = () => !reduceMotion && window.matchMedia('(min-width: 861px)').matches;

  const medir = () => {
    carriles.forEach((c) => {
      // Lo que sobra de la pista respecto al ancho ÚTIL de la ventana.
      // clientWidth incluye el padding, y el de la izquierda alinea la pista
      // con la rejilla, así que hay que descontarlo o el recorrido sale corto.
      const vista = c.pista.parentElement;
      const cs = getComputedStyle(vista);
      const util = vista.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      c.recorrido = Math.max(0, c.pista.scrollWidth - util);
      vista.scrollLeft = 0;
      // La sección se alarga para dar scroll con el que empujar el carril
      c.seccion.style.setProperty('--recorrido', `${c.recorrido}px`);
      c.seccion.classList.toggle('is-pinned', anclado() && c.recorrido > 0);
      if (!anclado() || c.recorrido === 0) c.pista.style.translate = '';
    });
  };

  let frame = 0;
  const pintar = () => {
    frame = 0;
    if (!anclado()) return;
    carriles.forEach(({ seccion, pista, recorrido }) => {
      if (recorrido === 0) return;
      const r = seccion.getBoundingClientRect();
      const alturaFija = seccion.firstElementChild.clientHeight || window.innerHeight;
      const total = r.height - alturaFija;
      if (total <= 0) return;
      // 0 al llegar el borde superior, 1 cuando queda una pantalla por salir
      const avance = Math.min(1, Math.max(0, -r.top / total));
      pista.style.translate = `${-(avance * recorrido).toFixed(1)}px 0`;
    });
  };

  const encolar = () => {
    if (!frame) frame = requestAnimationFrame(pintar);
  };

  window.addEventListener('scroll', encolar, { passive: true });
  window.addEventListener('resize', () => { medir(); encolar(); }, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { medir(); encolar(); });

  medir();
  encolar();
})();
