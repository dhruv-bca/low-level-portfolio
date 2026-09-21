/**
 * ============================================================================
 * VESTOR INNOVATORS — HOME PAGE LOGIC (low/js/home.js)
 * Session-Aware Preloader, Text Reveal Engine, Dhruv Card Lens, Clipped Gallery
 * ============================================================================
 */

/* --------------------------------------------------------------------------
   1. Number-Track Preloader with Session Persistence
   -------------------------------------------------------------------------- */
(function () {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  // Check navigation type (reload vs navigating between internal pages)
  let isReload = false;
  try {
    const navEntries = performance.getEntriesByType("navigation");
    if (navEntries.length > 0 && navEntries[0].type === "reload") {
      isReload = true;
    }
  } catch (e) {}

  const hasSeenIntro = sessionStorage.getItem('vi_home_visited');

  // If already seen in this session and NOT a hard refresh, skip preloader
  if (hasSeenIntro && !isReload) {
    preloader.style.display = 'none';
    return;
  }

  sessionStorage.setItem('vi_home_visited', 'true');

  let loadedImages = 0;
  let totalImages = document.images.length;
  let checkInterval;
  let preloaderRemoved = false;

  function getResourceProgress() {
    const resources = performance.getEntriesByType("resource");
    const total = resources.length;
    let loaded = 0;
    if (total === 0) return 100;
    resources.forEach((resource) => {
      if (resource.responseEnd) loaded++;
    });
    return Math.round((loaded / total) * 100);
  }

  function getDocumentProgress() {
    if (document.readyState === "loading") return 25;
    if (document.readyState === "interactive") return 75;
    if (document.readyState === "complete") return 100;
    return 0;
  }

  function getImageProgress() {
    if (totalImages === 0) return 100;
    return Math.round((loadedImages / totalImages) * 100);
  }

  function calculateOverallProgress() {
    let docProgress = getDocumentProgress();
    let resProgress = getResourceProgress();
    let imgProgress = getImageProgress();

    let overallProgress = Math.round(
      docProgress * 0.4 + resProgress * 0.4 + imgProgress * 0.2
    );

    if (overallProgress > 100) overallProgress = 100;
    updatePreloader(overallProgress);
    return overallProgress;
  }

  function trackImageLoading() {
    if (totalImages === 0) return;
    Array.from(document.images).forEach((img) => {
      if (img.complete) {
        loadedImages++;
      } else {
        img.addEventListener("load", () => { loadedImages++; });
        img.addEventListener("error", () => { loadedImages++; });
      }
    });
  }

  function updatePreloader(value) {
    if (typeof value !== "number" || value < 0 || value > 100) return;

    let onesTranslation = value * -2;
    let tensTranslation = Math.floor(value / 10) * -2;
    let hundredsTranslation = value >= 100 ? -2 : 0;

    const el100 = document.querySelector("#number-track-100");
    const el10 = document.querySelector("#number-track-10");
    const el1 = document.querySelector("#number-track-1");

    if (el100) el100.style.transform = `translateY(${hundredsTranslation}ch)`;
    if (el10) el10.style.transform = `translateY(${tensTranslation}ch)`;
    if (el1) el1.style.transform = `translateY(${onesTranslation}ch)`;
  }

  function removePreloader() {
    if (preloaderRemoved) return;
    preloaderRemoved = true;
    clearInterval(checkInterval);

    // Make subtext visible
    const subtext = document.querySelector('.preloader-subtext');
    if (subtext) subtext.classList.add('visible');

    setTimeout(() => {
      // Scale up row gently
      const trackRow = document.querySelector(".preloader-track-row");
      if (trackRow) trackRow.style.transform = "scale(1.15)";

      setTimeout(() => {
        // Move letters to spell final 'welcome':
        // [0] w: line 1 -> -2ch
        // [1] e: line 1 -> -2ch
        // [2] l: line 2 -> -4ch
        // [3] c: index 11 -> -22ch
        // [4] o: index 101 -> -202ch
        // [5] m: line 1 -> -2ch
        // [6] e: line 1 -> -2ch
        const tracks = document.querySelectorAll("#preloader .number-track");
        const finalPositions = [-2, -2, -4, -22, -202, -2, -2];

        tracks.forEach((track, index) => {
          setTimeout(() => {
            if (finalPositions[index] !== undefined) {
              track.style.transform = `translateY(${finalPositions[index]}ch)`;
            }
          }, index * 40);
        });

        // Clean curtain reveal upward without broken shard polygons
        setTimeout(() => {
          preloader.classList.add('revealed');
          setTimeout(() => {
            preloader.style.display = 'none';
          }, 1200);
        }, 1200);

      }, 500);
    }, 300);
  }

  document.onreadystatechange = calculateOverallProgress;
  window.addEventListener("DOMContentLoaded", () => {
    trackImageLoading();
    calculateOverallProgress();
  });
  window.addEventListener("load", () => {
    updatePreloader(100);
    removePreloader();
  });

  checkInterval = setInterval(() => {
    let progress = calculateOverallProgress();
    if (progress >= 100) {
      removePreloader();
    }
  }, 100);

  // Safety fallback after 2.4s
  setTimeout(() => {
    updatePreloader(100);
    removePreloader();
  }, 2400);
})();

/* --------------------------------------------------------------------------
   2. Story Multi-Color Text Reveal Engine
   -------------------------------------------------------------------------- */
const COLOR_LIST = ['#00d2ff', '#f9bd18', '#10b981', '#9333ea', '#38bdf8'];
let $targetList;

function initTextReveal() {
  $targetList = document.querySelectorAll('[data-js="reveal"]');
  if (!$targetList.length) return;
  setupTextReveal();
  window.addEventListener('scroll', onTextRevealScroll, { passive: true });
  onTextRevealScroll();
}

const getArrayRandomValue = (array) => array[Math.floor(Math.random() * array.length)];

function setupTextReveal() {
  for (const $target of $targetList) {
    const content = $target.innerHTML;
    const color = 'revealColor' in $target.dataset ? $target.dataset.revealColor : getArrayRandomValue(COLOR_LIST);
    $target.innerHTML = `<span data-reveal="content"><div data-reveal="cover" style="background-color:${color}"></div><span data-reveal="text">${content}</span></span>`;
  }
}

function onTextRevealScroll() {
  const windowH = window.innerHeight;
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const isMostScroll = document.body.clientHeight <= scrollTop + windowH;

  for (const $target of $targetList) {
    if ($target.classList.contains('loaded')) continue;
    const rect = $target.getBoundingClientRect();
    const top = rect.top + scrollTop;
    if (isMostScroll || top <= scrollTop + (windowH * 0.85)) {
      $target.classList.add('loaded');
    }
  }
}

/* --------------------------------------------------------------------------
   3. Dhruv Raj Creator Card & Interactive Lens (User's Exact GSAP Timeline)
   -------------------------------------------------------------------------- */
function initDhruvCardAnimation() {
  if (!window.gsap) return;

  const topText = document.querySelector(".top-text");
  if (topText && !topText.querySelector('.char')) {
    new SplitText(topText, { type: "chars" });
  }

  var tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".card",
      start: "top 80%",
      toggleActions: "play none none none"
    }
  });

  tl.to(".top-text .char", {
    x: 0,
    opacity: 1,
    duration: 0.8,
    delay: 0.5,
    stagger: {
      amount: 1.3,
      from: "start"
    }
  })
  .to(
    ".card-image",
    {
      filter: "brightness(1)",
      clipPath: "circle(25rem at 82% 82%)",
      scale: 1,
      duration: 3,
      ease: "power3.inOut"
    },
    "-=1"
  )
  .to(".try-it", {
    scale: 1,
    duration: 0.8,
    ease: "back.out(4)"
  })
  .to(
    ".try-it",
    {
      scale: 1.5,
      transformOrigin: "bottom left",
      duration: 1,
      repeat: 5,
      yoyoEase: "true",
      ease: "power"
    },
    "+=0.8"
  );

  // jQuery / Vanilla Magnifying Glass Lens
  const card = document.querySelector(".card");
  const glass = document.querySelector(".magnifying-glass");
  const cardImg = document.querySelector(".card-image");

  if (card && glass && cardImg) {
    glass.style.backgroundImage = `url('${cardImg.getAttribute('src')}')`;
    glass.style.backgroundRepeat = 'no-repeat';

    let subWidth = 0;
    let subHeight = 0;

    const imgObj = new Image();
    imgObj.src = cardImg.src;
    imgObj.onload = () => {
      subWidth = imgObj.naturalWidth || imgObj.width;
      subHeight = imgObj.naturalHeight || imgObj.height;
    };

    function handleLensMove(e) {
      if (!subWidth || !subHeight) {
        subWidth = cardImg.naturalWidth || cardImg.clientWidth * 2;
        subHeight = cardImg.naturalHeight || cardImg.clientHeight * 2;
      }

      const rect = card.getBoundingClientRect();
      const pageX = e.touches ? e.touches[0].clientX : e.clientX;
      const pageY = e.touches ? e.touches[0].clientY : e.clientY;

      const mx = pageX - rect.left;
      const my = pageY - rect.top;

      if (mx > 0 && my > 0 && mx < rect.width && my < rect.height) {
        glass.style.display = 'block';

        const rx = Math.round((mx / cardImg.clientWidth) * subWidth - glass.offsetWidth / 3) * -1;
        const ry = Math.round((my / cardImg.clientHeight) * subHeight - glass.offsetHeight / 3) * -1;

        const bgp = rx + "px " + ry + "px";
        const px = mx - glass.offsetWidth / 2.5;
        const py = my - glass.offsetHeight / 2.5;

        glass.style.left = px + "px";
        glass.style.top = py + "px";
        glass.style.backgroundPosition = bgp;
      } else {
        glass.style.display = 'none';
      }
    }

    card.addEventListener('mousemove', handleLensMove);
    card.addEventListener('mouseleave', () => { glass.style.display = 'none'; });
    card.addEventListener('touchmove', handleLensMove, { passive: true });
    card.addEventListener('touchend', () => { glass.style.display = 'none'; });
  }
}

/* --------------------------------------------------------------------------
   4. Clipped Image Reveal Gallery (GSAP ScrollTrigger)
   -------------------------------------------------------------------------- */
function initImageReveal() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const revealContainers = document.querySelectorAll(".reveal");

  revealContainers.forEach((container) => {
    let clipPath;

    if (container.classList.contains("reveal--left")) {
      clipPath = "inset(0 0 0 100%)";
    } else if (container.classList.contains("reveal--right")) {
      clipPath = "inset(0 100% 0 0)";
    } else if (container.classList.contains("reveal--top")) {
      clipPath = "inset(0 0 100% 0)";
    } else if (container.classList.contains("reveal--bottom")) {
      clipPath = "inset(100% 0 0 0)";
    } else {
      clipPath = "inset(0 0 0 100%)";
    }

    const image = container.querySelector("img");
    if (!image) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 85%",
        toggleActions: "restart none none reset"
      }
    });

    tl.set(container, { autoAlpha: 1 });
    tl.from(container, {
      clipPath: clipPath,
      duration: 1,
      ease: "power4.inOut"
    });

    if (container.classList.contains("reveal--overlay")) {
      tl.from(image, { clipPath: clipPath, duration: 0.6, ease: "power4.out" }, "-=0.4");
    }

    tl.from(image, {
      scale: 1.25,
      duration: 1.2,
      ease: "power2.out"
    }, "-=0.8");
  });

  ScrollTrigger.refresh();
}

document.addEventListener('DOMContentLoaded', () => {
  initTextReveal();
  initDhruvCardAnimation();
  initImageReveal();
});
