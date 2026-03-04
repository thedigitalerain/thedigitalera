(() => {
  const navbar = document.querySelector('[data-navbar]');
  const menuBtn = document.querySelector('[data-menu-btn]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('nav-scrolled', window.scrollY > 40);
    });
  }

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  const counters = document.querySelectorAll('[data-counter]');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.counter);
      const suffix = el.dataset.suffix || '';
      const duration = 1700;
      const startTime = performance.now();
      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const val = Math.floor(progress * target);
        el.textContent = `${val.toLocaleString()}${suffix}`;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.4 });

  counters.forEach((c) => countObserver.observe(c));

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('[data-animate-up]').forEach((item) => {
      gsap.from(item, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%'
        }
      });
    });

    const heroVisual = document.querySelector('[data-parallax]');
    if (heroVisual) {
      gsap.to(heroVisual, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: heroVisual,
          scrub: true,
          start: 'top bottom',
          end: 'bottom top'
        }
      });
    }
  }
})();
