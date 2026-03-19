(() => {
  const navbar = document.querySelector('[data-navbar]');
  const menuBtn = document.querySelector('[data-menu-btn]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (navbar) {
    const onScroll = () => navbar.classList.toggle('nav-scrolled', window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.toggle('hidden');
      menuBtn.setAttribute('aria-expanded', String(!isHidden));
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const reveals = document.querySelectorAll('[data-reveal]');
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.15 });

    reveals.forEach((item) => revealObserver.observe(item));
  } else {
    reveals.forEach((item) => item.classList.add('is-visible'));
  }

  const slider = document.querySelector('[data-slider]');
  if (slider) {
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const dotsWrap = slider.querySelector('[data-slider-dots]');
    const prevBtn = slider.querySelector('[data-slider-prev]');
    const nextBtn = slider.querySelector('[data-slider-next]');
    let activeIndex = 0;
    let autoPlay;

    const dots = slides.map((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index, true));
      dotsWrap.appendChild(dot);
      return dot;
    });

    const updateSlides = () => {
      slides.forEach((slide, index) => {
        slide.classList.toggle('is-active', index === activeIndex);
      });
      dots.forEach((dot, index) => {
        dot.classList.toggle('is-active', index === activeIndex);
      });
    };

    const startAutoplay = () => {
      if (reducedMotion) return;
      window.clearInterval(autoPlay);
      autoPlay = window.setInterval(() => {
        goToSlide((activeIndex + 1) % slides.length);
      }, 4500);
    };

    const goToSlide = (index, resetTimer = false) => {
      activeIndex = (index + slides.length) % slides.length;
      updateSlides();
      if (resetTimer) startAutoplay();
    };

    prevBtn?.addEventListener('click', () => goToSlide(activeIndex - 1, true));
    nextBtn?.addEventListener('click', () => goToSlide(activeIndex + 1, true));

    slider.addEventListener('mouseenter', () => window.clearInterval(autoPlay));
    slider.addEventListener('mouseleave', startAutoplay);
    slider.addEventListener('focusin', () => window.clearInterval(autoPlay));
    slider.addEventListener('focusout', startAutoplay);

    updateSlides();
    startAutoplay();
  }
})();
