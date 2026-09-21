/**
 * ============================================================================
 * VESTOR INNOVATORS — COMMON SCRIPT ENGINE
 * Universal Day/Night Toggle, Mobile Menu, SplitText Polyfill & Toast Manager
 * ============================================================================
 */

// Vanilla SplitText Polyfill for safe, license-independent text splitting
class SplitText {
  constructor(target, options = {}) {
    this.elements = typeof target === 'string' ? document.querySelectorAll(target) : (target.length !== undefined && !target.tagName ? Array.from(target) : [target]);
    this.chars = [];
    this.words = [];
    this.lines = [];
    this.type = options.type || 'chars';

    this.elements.forEach(el => {
      if (!el) return;
      const childNodes = Array.from(el.childNodes);
      el.innerHTML = '';
      
      childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (char === '\n' || char === '\r') continue;
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char;
            if (char === ' ') {
              span.innerHTML = '&nbsp;';
              span.classList.add('char-space');
            }
            el.appendChild(span);
            this.chars.push(span);
          }
        } else if (node.nodeName === 'BR') {
          el.appendChild(document.createElement('br'));
        } else {
          el.appendChild(node);
        }
      });
    });
  }

  revert() {
    this.elements.forEach(el => {
      if (!el) return;
      el.textContent = this.chars.map(c => c.textContent).join('');
    });
  }
}

window.SplitText = SplitText;

document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  initMobileNavigation();
  initActiveNavLink();
});

/* --------------------------------------------------------------------------
   1. Universal Day / Night Toggle Engine (Sun/Moon/Cloud/Stars)
   -------------------------------------------------------------------------- */
function initThemeEngine() {
  const savedTheme = localStorage.getItem('vi_low_theme') || 'dark';
  applyTheme(savedTheme, false);

  const dayBtn = document.getElementById('day');
  const nightBtn = document.getElementById('night');

  if (!dayBtn || !nightBtn) return;

  // Initial state setup using GSAP
  if (window.gsap) {
    if (savedTheme === 'dark') {
      gsap.set("#sun", { x: -157, opacity: 0 });
      gsap.set("#cloud", { opacity: 0 });
      gsap.set("#moon", { x: -157, rotate: -360, transformOrigin: "center", opacity: 1 });
      gsap.set(".star", { opacity: 1, x: 35, y: -5 });
      gsap.set("#night", { opacity: 1, pointerEvents: "all" });
      gsap.set("#day", { opacity: 0, pointerEvents: "none" });
    } else {
      gsap.set("#moon, .star", { opacity: 0 });
      gsap.set("#sun, #cloud, #moon", { x: 15 });
      gsap.set(".star", { x: 35, y: -5 });
      gsap.set("#night", { opacity: 0, pointerEvents: "none" });
      gsap.set("#day", { opacity: 1, pointerEvents: "all" });
    }
  }

  // Click on Day (to switch to Night / Dark mode)
  dayBtn.addEventListener('click', () => {
    applyTheme('dark', true);
    if (window.gsap) {
      gsap.to("#sun", { duration: 1, x: -157, opacity: 0, ease: "power1.inOut" });
      gsap.to("#cloud", { duration: 0.5, opacity: 0, ease: "power1.inOut" });
      gsap.to("#moon", { duration: 1, x: -157, rotate: -360, transformOrigin: "center", opacity: 1, ease: "power1.inOut" });
      gsap.to(".star", { duration: 0.5, opacity: 1, ease: "power1.inOut" });
      gsap.to("#night", { duration: 0.8, opacity: 1, ease: "power1.inOut" });
      gsap.to("#day", { duration: 0.8, opacity: 0, ease: "power1.inOut" });
      dayBtn.style.pointerEvents = "none";
      setTimeout(() => {
        nightBtn.style.pointerEvents = "all";
      }, 700);
    }
  });

  // Click on Night (to switch to Day / Light mode)
  nightBtn.addEventListener('click', () => {
    applyTheme('light', true);
    if (window.gsap) {
      gsap.to("#sun", { duration: 1, x: 15, opacity: 1, ease: "power1.inOut" });
      gsap.to("#cloud", { duration: 1, opacity: 1, ease: "power1.inOut" });
      gsap.to("#moon", { duration: 1, opacity: 0, x: 35, rotate: 360, transformOrigin: "center", ease: "power1.inOut" });
      gsap.to(".star", { duration: 1, opacity: 0, ease: "power1.inOut" });
      gsap.to("#night", { duration: 0.8, opacity: 0, ease: "power1.inOut" });
      gsap.to("#day", { duration: 0.8, opacity: 1, ease: "power1.inOut" });
      nightBtn.style.pointerEvents = "none";
      setTimeout(() => {
        dayBtn.style.pointerEvents = "all";
      }, 700);
    }
  });
}

function applyTheme(theme, notify = false) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('vi_low_theme', theme);
  if (notify) {
    showToast(theme === 'dark' ? 'Obsidian Dark Vault' : 'Liquid Light Day');
  }
}

/* --------------------------------------------------------------------------
   2. Mobile Menu Navigation
   -------------------------------------------------------------------------- */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggleBtn.classList.toggle('open', isOpen);
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  document.addEventListener('click', (e) => {
    if (!toggleBtn.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      toggleBtn.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* --------------------------------------------------------------------------
   3. Active Navigation Indicator
   -------------------------------------------------------------------------- */
function initActiveNavLink() {
  const currentPath = window.location.pathname.replace(/\/$/, '');
  const links = document.querySelectorAll('.nav-link');

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const resolvedHref = new URL(link.href).pathname.replace(/\/$/, '');
    if (resolvedHref === currentPath || (currentPath === '' && href.includes('index.html'))) {
      link.classList.add('active');
    }
  });
}

/* --------------------------------------------------------------------------
   4. Toast Notification Utility
   -------------------------------------------------------------------------- */
function showToast(message, duration = 3000) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>⚡</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, duration);
}

window.showToast = showToast;
