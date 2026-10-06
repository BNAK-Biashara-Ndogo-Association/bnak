(() => {
  'use strict';

  const header = document.querySelector('[data-site-header]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileOverlay = document.querySelector('[data-mobile-overlay]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setMenuOpen = (open) => {
    if (!header || !menuToggle || !mobileOverlay) return;
    header.classList.toggle('menu-open', open);
    mobileOverlay.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menuToggle.querySelector('[data-menu-open-icon]')?.classList.toggle('hidden', open);
    menuToggle.querySelector('[data-menu-close-icon]')?.classList.toggle('hidden', !open);
    document.body.classList.toggle('overflow-hidden', open);
  };

  menuToggle?.addEventListener('click', () => {
    setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  mobileOverlay?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  document.querySelectorAll('[data-hero-carousel]').forEach((carousel) => {
    const slides = [...carousel.querySelectorAll('[data-hero-slide]')];
    const current = carousel.querySelector('[data-hero-current]');
    const label = carousel.querySelector('[data-hero-label]');
    const frame = carousel.querySelector('img')?.parentElement;
    const previous = document.querySelector('[data-hero-previous]');
    const next = document.querySelector('[data-hero-next]');
    if (!slides.length || !current || !label || !frame) return;

    let index = 0;
    const showSlide = (nextIndex) => {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === index;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
      });
      current.textContent = String(index + 1).padStart(2, '0');
      label.textContent = slides[index].dataset.label || '';
    };

    previous?.addEventListener('click', () => showSlide(index - 1));
    next?.addEventListener('click', () => showSlide(index + 1));

    if (!prefersReducedMotion) {
      window.setInterval(() => {
        if (!document.hidden && !frame.matches(':hover, :focus-within')) showSlide(index + 1);
      }, 5400);
    }
  });

  document.querySelectorAll('[data-image-ribbon]').forEach((ribbon) => {
    let pointerStart = null;
    ribbon.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'mouse') return;
      pointerStart = { x: event.clientX, left: ribbon.scrollLeft };
      ribbon.setPointerCapture(event.pointerId);
    });
    ribbon.addEventListener('pointermove', (event) => {
      if (!pointerStart || !ribbon.hasPointerCapture(event.pointerId)) return;
      ribbon.scrollLeft = pointerStart.left - (event.clientX - pointerStart.x);
    });
    ribbon.addEventListener('pointerup', () => { pointerStart = null; });
    ribbon.addEventListener('pointercancel', () => { pointerStart = null; });
  });
})();
