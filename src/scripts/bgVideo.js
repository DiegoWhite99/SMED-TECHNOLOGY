// Videos que se cargan solo cuando su sección se acerca a la pantalla y se
// pausan al salir de ella: el del cierre y el de producto de SMED Bakery.
// Con movimiento reducido o ahorro de datos no se descarga nada y cada uno
// queda en su estado estático (fondo oscuro en el cierre, póster en el video).
(function () {
  const videos = document.querySelectorAll('video[data-src]');
  if (!videos.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection && navigator.connection.saveData;
  if (reduceMotion || saveData || !('IntersectionObserver' in window)) return;

  videos.forEach((video) => {
    video.muted = true;
    video.addEventListener('playing', () => video.classList.add('is-playing'), { once: true });

    // La tarjeta o la sección: así el video arranca con su bloque, no con su propia caja
    const scope = video.closest('.case') || video.closest('section') || video;

    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (!video.getAttribute('src')) video.src = video.dataset.src;
        video.play().catch(() => {});
      } else if (video.getAttribute('src')) {
        video.pause();
      }
    }, { rootMargin: '300px 0px' }).observe(scope);
  });
})();
