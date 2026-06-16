/* ============================================
   AgroGuardAI Main JavaScript v4
   Clean, modern interactions for the premium site
   ============================================ */
'use strict';

// ── Theme Toggle (Dark/Light Mode) ─────────────────────────────────
(function initTheme() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  const icon = toggle.querySelector('.theme-toggle__icon');
  const STORAGE_KEY = 'agroguardai-theme';

  function setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (icon) icon.textContent = '🌙';
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (icon) icon.textContent = '☀️';
    }
  }

  // Load saved preference or system default
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    setTheme(saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
  }

  toggle.addEventListener('click', () => {
    const isDark = document.documentElement.hasAttribute('data-theme');
    const next = isDark ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  });

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
})();

// ── Header Scroll Effect ───────────────────────────────────────────
(function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > 20);
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
})();

// ── Mobile Menu Toggle (Slide-out Drawer) ────────────────────────────
(function initMobileMenu() {
  const toggle = document.querySelector('.header__mobile-toggle');
  const menu = document.querySelector('.mobile-menu');
  let backdrop = document.querySelector('.mobile-menu-backdrop');

  if (!toggle || !menu) return;

  // Create backdrop if it doesn't exist yet
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'mobile-menu-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdrop);
  }

  function openMenu() {
    menu.classList.add('mobile-menu--open');
    backdrop.classList.add('mobile-menu-backdrop--open');
    backdrop.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // Focus first link in drawer
    setTimeout(() => {
      const firstLink = menu.querySelector('.mobile-menu__link');
      if (firstLink) firstLink.focus();
    }, 400);
  }

  function closeMenu() {
    menu.classList.remove('mobile-menu--open');
    backdrop.classList.remove('mobile-menu-backdrop--open');
    backdrop.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    if (menu.classList.contains('mobile-menu--open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close on backdrop click
  backdrop.addEventListener('click', closeMenu);

  // Close menu on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(closeMenu, 150); // Small delay for smoother feel
    });
  });

  // Keyboard: Escape closes menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('mobile-menu--open')) {
      closeMenu();
    }
  });

  // Trap focus inside mobile menu when open
  menu.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = menu.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
})();

// ── Reduced Motion Check (JS) ────────────────────────────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Intersection Observer (Scroll Animations) ──────────────────────
(function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();

// ── Smooth Scroll for Anchor Links ─────────────────────────────────
(function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();

// ── Active Nav Link Highlighting ────────────────────────────────────
(function initActiveNav() {
  const currentPath = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
  const links = document.querySelectorAll('.header__nav-link');
  links.forEach(link => {
    const href = link.getAttribute('href').replace('.html', '');
    if (href === currentPath || (currentPath === 'index' && href === 'index')) {
      link.classList.add('header__nav-link--active');
    }
  });
})();
