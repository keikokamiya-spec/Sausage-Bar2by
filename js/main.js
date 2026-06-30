/* ============================================================
   Sausage & Bar 2by — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Header: scroll state ---------- */
  const header = document.getElementById('header');
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Hamburger menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isOpen);
    hamburger.classList.toggle('is-open');
    nav.classList.toggle('is-open');
  });
  nav.querySelectorAll('.header__nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.classList.remove('is-open');
      nav.classList.remove('is-open');
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ---------- Number counter animation ---------- */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1600;
      const start = performance.now();
      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.beer__stat-num[data-count]').forEach(el => counterObserver.observe(el));

  /* ---------- Menu tabs ---------- */
  const tabs = document.querySelectorAll('.menu__tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('is-active'));
      document.querySelectorAll('.menu__panel').forEach(p => p.classList.remove('is-active'));
      tab.classList.add('is-active');
      const panel = document.getElementById(`tab-${tab.dataset.tab}`);
      if (panel) panel.classList.add('is-active');
    });
  });

  /* ---------- Slider factory ---------- */
  function initSlider(sliderEl) {
    const track = sliderEl.querySelector('.menu__slider-track');
    const dots = sliderEl.querySelectorAll('.menu__slider-dot');
    const prevBtn = sliderEl.querySelector('.menu__slider-btn--prev');
    const nextBtn = sliderEl.querySelector('.menu__slider-btn--next');
    if (!track) return;

    const slides = Array.from(track.children);
    let current = 0;
    let perView = getPerView();
    let total = Math.max(0, slides.length - perView);

    function getPerView() {
      const w = window.innerWidth;
      if (w <= 480) return 1;
      if (w <= 768) return 1;
      if (w <= 1024) return 2;
      return 3;
    }

    function getSlideWidth() {
      if (!slides.length) return 0;
      const style = getComputedStyle(track);
      const gap = parseFloat(style.gap) || 24;
      return slides[0].offsetWidth + gap;
    }

    function goTo(index) {
      total = Math.max(0, slides.length - perView);
      current = Math.max(0, Math.min(index, total));
      track.style.transform = `translateX(-${current * getSlideWidth()}px)`;
      dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); }));

    /* Touch / swipe */
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    });

    window.addEventListener('resize', () => {
      perView = getPerView();
      goTo(Math.min(current, Math.max(0, slides.length - perView)));
    });

    goTo(0);
  }

  document.querySelectorAll('.menu__slider').forEach(initSlider);

  /* ---------- Floating CTA ---------- */
  const floatingCta = document.getElementById('floatingCta');
  const showCta = () => {
    const heroH = document.getElementById('hero')?.offsetHeight ?? 400;
    floatingCta?.classList.toggle('is-visible', window.scrollY > heroH * 0.6);
  };
  window.addEventListener('scroll', showCta, { passive: true });
  showCta();

});
