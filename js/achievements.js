/**
 * ============================================================================
 * VESTOR INNOVATORS — ACHIEVEMENTS & SCOREBOARD LOGIC (low/js/achievements.js)
 * Parallax SVG Circuits, 3D Scoreboard Rising Podiums & 3D Perspective Room
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initCircuitScrollEngine();
  initScoreboardPodium();
  init3DRoom();
});

/* --------------------------------------------------------------------------
   1. Circuit Flow & 3D Tablet Parallax Scroll Engine
   -------------------------------------------------------------------------- */
function initCircuitScrollEngine() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const flowingSection = document.querySelector('.flowing-circuits-section');
  if (!flowingSection) return;

  // Move SVG circuit paths and 3D tablet as user scrolls through the section
  gsap.to("body", {
    scrollTrigger: {
      trigger: flowingSection,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const tabletMovement = 0.45 * window.innerHeight;

        const strokeOffset = -(2600 * progress);
        document.body.style.setProperty("--strokeDashoffset", strokeOffset);

        const tabletOffset = -(tabletMovement * progress) + "px";
        document.body.style.setProperty("--tabletVerticaloffset", tabletOffset);
      }
    }
  });

  // Fade-in animation for each card wrapper as it enters the viewport
  const cardWrappers = document.querySelectorAll('.cardWrapper');
  cardWrappers.forEach((wrapper) => {
    gsap.fromTo(wrapper, 
      { y: 60, opacity: 0.3 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: wrapper,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Fade out 3D tablet when leaving the flowing circuits section
  ScrollTrigger.create({
    trigger: flowingSection,
    start: "bottom 60%",
    onEnter: () => gsap.to("#world3d", { opacity: 0, duration: 0.4 }),
    onLeaveBack: () => gsap.to("#world3d", { opacity: 0.25, duration: 0.4 })
  });
}

/* --------------------------------------------------------------------------
   2. 3D Scoreboard Podium Rising Animation (GSAP Powered)
   -------------------------------------------------------------------------- */
function initScoreboardPodium() {
  if (!window.gsap || !window.ScrollTrigger) return;

  const podiumSection = document.getElementById('stage-podium') || document.querySelector('.stage-section') || document.querySelector('.stage');
  if (!podiumSection) return;

  // Set initial flat positions
  gsap.set('.tower.first > .top', { z: 0 });
  gsap.set('.tower.first > .front', { height: 0 });
  gsap.set('.tower.second > .top', { z: 0 });
  gsap.set('.tower.second > .front', { height: 0 });
  gsap.set('.tower.second > .left', { height: 0 });
  gsap.set('.tower.third > .top', { z: 0 });
  gsap.set('.tower.third > .front', { height: 0 });
  gsap.set('.tower.third > .right', { height: 0 });

  let podiumAnimated = false;

  // Animate towers rising up when entering viewport
  ScrollTrigger.create({
    trigger: podiumSection,
    start: "top 75%",
    onEnter: () => {
      if (podiumAnimated) return;
      podiumAnimated = true;

      // 1st Place: Vestor Innovators (Highest, 190px)
      gsap.to('.tower.first > .top', { z: 190, duration: 1.8, ease: "power3.out" });
      gsap.to('.tower.first > .front', { height: 190, duration: 1.8, ease: "power3.out" });

      // 2nd Place: Vestor Achievers (140px, staggered)
      gsap.to('.tower.second > .top', { z: 140, duration: 1.8, delay: 0.2, ease: "power3.out" });
      gsap.to('.tower.second > .front', { height: 140, duration: 1.8, delay: 0.2, ease: "power3.out" });
      gsap.to('.tower.second > .left', { height: 140, duration: 1.8, delay: 0.2, ease: "power3.out" });

      // 3rd Place: Vestor Igniters (100px, staggered)
      gsap.to('.tower.third > .top', { z: 100, duration: 1.8, delay: 0.4, ease: "power3.out" });
      gsap.to('.tower.third > .front', { height: 100, duration: 1.8, delay: 0.4, ease: "power3.out" });
      gsap.to('.tower.third > .right', { height: 100, duration: 1.8, delay: 0.4, ease: "power3.out" });
    }
  });
}

/* --------------------------------------------------------------------------
   3. 3D Perspective Cube Room (Poem Insertion & Responsive Scaling)
   -------------------------------------------------------------------------- */
function init3DRoom() {
  // Vestor Innovators All-Time Winners Creed & Championship Proclamation
  const singleCreed = `VESTOR INNOVATORS &bull; <span>ALL-TIME WINNERS</span> &bull; THREE TOURNAMENTS ENTERED &bull; <span>THREE CHAMPIONSHIPS SEIZED</span> &bull; 100% TOURNAMENT WIN RATE &bull; <span>UNDEFEATED LEAGUE LEADERS</span> &bull; ENGLISH GRAMMAR CHAMPIONSHIP <span>1ST PLACE GOLD</span> &bull; STORY RELAY SHOWDOWN <span>1ST PLACE GOLD</span> &bull; MICROSOFT OFFICE CHALLENGE <span>1ST PLACE GOLD</span> &bull; WE DO NOT COMPETE MERELY TO PARTICIPATE &bull; <span>WE PLAY TO CONQUER</span> &bull; SIXTEEN VANGUARD MINDS UNITED &bull; STEERED BY <span>CAPTAIN CHHOTU KUMAR</span> &bull; VESTOR COLLEGE OF MANAGEMENT &bull; <span>ALWAYS FIRST &bull; ALWAYS FORWARD</span> &bull; THE UNDEFEATED ENCLAVE OF EXCELLENCE &bull; NO SHORTCUTS ONLY MERIT &bull; <span>SUPREME ALL-TIME CHAMPIONS</span> &bull; `;
  const allTimeWinnersText = `<p>${singleCreed.repeat(16)}</p>`;

  // Insert team proclamation text into .room-container-wrapper .text divs
  const textDivs = document.querySelectorAll(".room-container-wrapper .text");
  textDivs.forEach((div) => {
    div.innerHTML = allTimeWinnersText;
  });

  // Responsive scaler for room
  function adjustContentSize() {
    const contentDiv = document.querySelector(".room-container-wrapper .content");
    if (!contentDiv) return;
    const viewportWidth = window.innerWidth;
    const baseWidth = 1000;
    const scaleFactor = viewportWidth < (baseWidth + 40) ? (viewportWidth - 32) / baseWidth : 1;
    contentDiv.style.transform = `scale(${scaleFactor})`;
    contentDiv.style.transformOrigin = "center center";
  }

  adjustContentSize();
  window.addEventListener("resize", adjustContentSize);
}
