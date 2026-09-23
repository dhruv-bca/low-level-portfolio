/**
 * ============================================================================
 * VESTOR INNOVATORS — MEMBERS DIRECTORY ENGINE (low/js/members.js)
 * Bato Text-Drop, Real-time Search Filter & 17-Card Flowing Circuit Scroll
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initTextDropAnimation();
  initMemberSearch();
  initMembersCircuitScroll();
  initMemberModal();
});

/* --------------------------------------------------------------------------
   1. Bato Text-Drop Animation Engine
   -------------------------------------------------------------------------- */
function initTextDropAnimation() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const lines = document.querySelectorAll(".text-drop__line");
  const images = document.querySelectorAll(".text-drop__img-box");

  lines.forEach((line, index) => {
    gsap.fromTo(
      line,
      { rotateX: -120 },
      {
        rotateX: 0,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: line,
          start: "bottom bottom",
          end: "bottom top",
          scrub: true
        }
      }
    );

    if (images[index]) {
      gsap.to(images[index], {
        opacity: 0.85,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: line,
          start: "bottom bottom-=300",
          end: "bottom top",
          scrub: true
        }
      });
    }
  });

  // Parallax on floating side images
  const prlxElements = document.querySelectorAll(".has-prlx");
  prlxElements.forEach((el) => {
    gsap.to(el, {
      y: -100,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.5
      }
    });
  });
}

/* --------------------------------------------------------------------------
   2. Live Instant Member Search Filter
   -------------------------------------------------------------------------- */
function initMemberSearch() {
  const searchInput = document.getElementById('memberSearchInput');
  const resultCount = document.getElementById('searchResultCount');
  const cards = document.querySelectorAll('.memberCardWrapper');

  if (!searchInput || !cards.length) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    let matchCount = 0;

    cards.forEach((card) => {
      const name = (card.getAttribute('data-name') || '').toLowerCase();
      const roll = (card.getAttribute('data-roll') || '').toLowerCase();
      const course = (card.getAttribute('data-course') || '').toLowerCase();
      const quote = (card.getAttribute('data-quote') || '').toLowerCase();

      const isMatch = name.includes(query) || roll.includes(query) || course.includes(query) || quote.includes(query);

      if (isMatch) {
        card.classList.remove('hidden');
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
        matchCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    if (resultCount) {
      if (query === '') {
        resultCount.textContent = `Showing all ${cards.length} members`;
      } else {
        resultCount.textContent = `Found ${matchCount} member${matchCount === 1 ? '' : 's'} matching "${e.target.value}"`;
      }
    }

    if (window.ScrollTrigger) {
      ScrollTrigger.refresh();
    }
  });
}

/* --------------------------------------------------------------------------
   3. 17-Member Flowing SVG Circuit Scroll Engine
   -------------------------------------------------------------------------- */
function initMembersCircuitScroll() {
  if (!window.gsap || !window.ScrollTrigger) return;

  const section = document.querySelector('.members-circuits-section');
  if (!section) return;

  const svgPaths = document.getElementById("svgPaths");

  ScrollTrigger.create({
    trigger: section,
    start: "top 80%",
    end: "bottom bottom",
    scrub: 1,
    onUpdate: (self) => {
      const thisProgress = self.progress;
      const tabletVerMovement = 0.65 * window.innerHeight;

      const scrollProgress = -(18000 * thisProgress);
      document.body.style.setProperty("--strokeDashoffset", scrollProgress);
      document.documentElement.style.setProperty("--strokeDashoffset", scrollProgress);
      if (svgPaths) {
        svgPaths.style.setProperty("--strokeDashoffset", scrollProgress);
      }

      const scrollProgress2 = -parseInt(tabletVerMovement * thisProgress) + "px";
      document.body.style.setProperty("--tabletVerticaloffset", scrollProgress2);
      document.documentElement.style.setProperty("--tabletVerticaloffset", scrollProgress2);
    }
  });

  // Fade-in cards smoothly on enter
  const cardWrappers = document.querySelectorAll('.memberCardWrapper');
  cardWrappers.forEach((wrapper) => {
    gsap.fromTo(wrapper,
      { y: 50, opacity: 0.3 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: wrapper,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });
}

/* --------------------------------------------------------------------------
   4. Interactive Member Expanded Detail Modal
   -------------------------------------------------------------------------- */
function initMemberModal() {
  const modal = document.getElementById('memberModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const modalImg = document.getElementById('modalMemberImg');
  const modalBadge = document.getElementById('modalMemberBadge');
  const modalName = document.getElementById('modalMemberName');
  const modalQuote = document.getElementById('modalMemberQuote');
  const modalDegree = document.getElementById('modalMemberDegree');
  const modalRoll = document.getElementById('modalMemberRoll');
  const modalSession = document.getElementById('modalMemberSession');
  const modalDiscipline = document.getElementById('modalMemberDiscipline');
  const cardWrappers = document.querySelectorAll('.memberCardWrapper');

  if (!modal) return;

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  cardWrappers.forEach((card) => {
    card.addEventListener('click', (e) => {
      // Don't trigger if user was selecting text
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) return;

      const imgEl = card.querySelector('.member-photo-frame img');
      const badgeEl = card.querySelector('.member-role-badge');
      const nameEl = card.querySelector('.member-name');
      const quoteAttr = card.getAttribute('data-quote') || '';
      const quoteEl = card.querySelector('.member-quote-lines');

      // Detail items
      const detailItems = card.querySelectorAll('.member-detail-item');
      let degree = '--', roll = '--', session = '--', discipline = '--';

      detailItems.forEach((item) => {
        const label = (item.querySelector('.detail-label')?.textContent || '').toLowerCase().trim();
        const val = item.querySelector('.detail-value')?.textContent || '';
        if (label.includes('degree')) degree = val;
        else if (label.includes('roll')) roll = val;
        else if (label.includes('session')) session = val;
        else if (label.includes('discipline')) discipline = val;
      });

      // Fallbacks from data attributes
      if (degree === '--' && card.hasAttribute('data-course')) degree = card.getAttribute('data-course');
      if (roll === '--' && card.hasAttribute('data-roll')) roll = card.getAttribute('data-roll');

      // Populate modal
      if (modalImg && imgEl) {
        modalImg.src = imgEl.src;
        modalImg.alt = imgEl.alt || (nameEl ? nameEl.textContent : 'Member portrait');
      }

      if (modalBadge && badgeEl) {
        modalBadge.textContent = badgeEl.textContent.trim();
        modalBadge.className = badgeEl.className;
      }

      if (modalName && nameEl) {
        modalName.textContent = nameEl.textContent.trim();
      }

      if (modalQuote) {
        if (quoteAttr) {
          modalQuote.textContent = `“${quoteAttr}”`;
        } else if (quoteEl) {
          modalQuote.textContent = quoteEl.textContent.trim();
        }
      }

      if (modalDegree) modalDegree.textContent = degree;
      if (modalRoll) modalRoll.textContent = roll;
      if (modalSession) modalSession.textContent = session;
      if (modalDiscipline) modalDiscipline.textContent = discipline;

      // Open Modal
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

