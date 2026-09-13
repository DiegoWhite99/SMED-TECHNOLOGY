// Video de fondo del cierre: se carga solo cuando la sección se acerca a la
// pantalla y se pausa fuera de ella. Con movimiento reducido o ahorro de datos
// no se descarga y la sección queda con su fondo oscuro.
(function () {
  const video = document.querySelector('.cta-video-el');
  if (!video) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection && navigator.connection.saveData;
  if (reduceMotion || saveData || !('IntersectionObserver' in window)) return;

  video.muted = true;
  video.addEventListener('playing', () => video.classList.add('is-playing'), { once: true });

  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      if (!video.getAttribute('src')) video.src = video.dataset.src;
      video.play().catch(() => {});
    } else if (video.getAttribute('src')) {
      video.pause();
    }
  }, { rootMargin: '300px 0px' }).observe(video.closest('section') || video);
})();
