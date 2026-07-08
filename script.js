'use strict';

/**
 * Portfolio interactivity:
 * 1. Mobile nav toggle
 * 2. Active nav link while scrolling + smooth close on click
 * 3. Scroll-reveal (fade-up) via IntersectionObserver
 * 4. Animated skill progress bars, triggered once when in view
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------------
     1. Mobile navigation toggle
     --------------------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  const closeMenu = () => {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  /* ---------------------------------------------------------------------
     2. Nav links: smooth scroll (native CSS handles the scroll itself),
        close mobile menu on click, and highlight the active section.
     --------------------------------------------------------------------- */
  const navLinks = document.querySelectorAll('[data-nav-link]');
  const sections = document.querySelectorAll('main section[id]');

  navLinks.forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveLink(entry.target.id);
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  /* ---------------------------------------------------------------------
     3. Scroll-reveal fade-up animation for elements marked [data-reveal]
     --------------------------------------------------------------------- */
  const revealTargets = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));

  /* ---------------------------------------------------------------------
     4. Animate skill progress bars + percentage counters once visible
     --------------------------------------------------------------------- */
  const skillCards = document.querySelectorAll('.skill-card');

  const animatePercentCounter = (el, target) => {
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.round(progress * target);
      el.textContent = `${value}%`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const skillsObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const card = entry.target;
        const bar = card.querySelector('.progress__bar');
        const percentLabel = card.querySelector('.skill-card__percent');
        const targetValue = Number(bar.dataset.progress);

        bar.style.width = `${targetValue}%`;
        animatePercentCounter(percentLabel, targetValue);

        observer.unobserve(card);
      });
    },
    { threshold: 0.35 }
  );

  skillCards.forEach((card) => skillsObserver.observe(card));

  /* ---------------------------------------------------------------------
     Navbar background intensifies slightly once the page is scrolled.
     --------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');

  const onScroll = () => {
    navbar.style.background = window.scrollY > 20
      ? 'rgba(7, 10, 18, 0.85)'
      : 'rgba(7, 10, 18, 0.6)';
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

});
