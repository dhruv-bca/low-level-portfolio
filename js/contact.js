/**
 * ============================================================================
 * VESTOR INNOVATORS — CONTACT DISPATCH ENGINE (low/js/contact.js)
 * Scroll-Triggered Form Popup & Outro, Direct WhatsApp & Email Routing
 * ============================================================================
 */

const CAPTAIN_CONFIG = {
  name: 'Chhotu Kumar',
  role: 'League Captain',
  degree: 'MBA (2025–2027)',
  roll: '69',
  phone: '+91 90066 80736',
  phoneRaw: '919006680736',
  email: 'dhruvraj10370@gmail.com'
};

document.addEventListener('DOMContentLoaded', () => {
  initContactScrollStages();
  initContactDispatchButtons();
});

/* --------------------------------------------------------------------------
   1. Scroll Stages: Pop-up Form Console & Outro to Institutional Channels
   -------------------------------------------------------------------------- */
function initContactScrollStages() {
  const formCard = document.querySelector('.form-console-card');
  const instSection = document.querySelector('.institutional-channels-section');

  if (!formCard || !instSection) return;

  function onContactScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    const windowH = window.innerHeight;

    // Stage 1: Reveal Form Console as user begins scrolling past Hero
    if (scrollY > windowH * 0.15) {
      formCard.classList.add('active-popup');
    } else {
      formCard.classList.remove('active-popup');
    }

    // Stage 2: When scrolled deeper, activate Institutional Channels
    const instRect = instSection.getBoundingClientRect();
    if (instRect.top < windowH * 0.8) {
      instSection.classList.add('active-popup');
    } else {
      instSection.classList.remove('active-popup');
    }
  }

  window.addEventListener('scroll', onContactScroll, { passive: true });
  onContactScroll();
}

/* --------------------------------------------------------------------------
   2. Dual Dispatch Handlers (WhatsApp & Email Direct to Captain)
   -------------------------------------------------------------------------- */
function getContactFormData() {
  const name = document.getElementById('senderName')?.value.trim() || '';
  const email = document.getElementById('senderEmail')?.value.trim() || '';
  const phone = document.getElementById('senderPhone')?.value.trim() || '';
  const roll = document.getElementById('senderRoll')?.value.trim() || '';
  const categorySelect = document.getElementById('inquiryCategory');
  const category = categorySelect?.value || 'general';
  const categoryLabel = categorySelect ? categorySelect.options[categorySelect.selectedIndex]?.text : 'General Inquiry';
  const subject = document.getElementById('senderSubject')?.value.trim() || '';
  const message = document.getElementById('senderMessage')?.value.trim() || '';

  return { name, email, phone, roll, category, categoryLabel, subject, message };
}

function validateContactForm(data) {
  if (!data.name) {
    if (window.showToast) showToast('Please enter your full name');
    document.getElementById('senderName')?.focus();
    return false;
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    if (window.showToast) showToast('Please enter a valid email address');
    document.getElementById('senderEmail')?.focus();
    return false;
  }
  if (!data.subject) {
    if (window.showToast) showToast('Please enter a subject line');
    document.getElementById('senderSubject')?.focus();
    return false;
  }
  if (!data.message) {
    if (window.showToast) showToast('Please enter your dispatch message');
    document.getElementById('senderMessage')?.focus();
    return false;
  }
  return true;
}

function initContactDispatchButtons() {
  const whatsAppBtn = document.getElementById('sendWhatsAppBtn');
  const emailBtn = document.getElementById('sendEmailBtn');

  // WhatsApp Button Click
  if (whatsAppBtn) {
    whatsAppBtn.addEventListener('click', () => {
      const data = getContactFormData();
      if (!validateContactForm(data)) return;

      let waMsg = `*VESTOR INNOVATORS - DIRECT DISPATCH*\n`;
      waMsg += `━━━━━━━━━━━━━━━━━━━━\n`;
      waMsg += `👤 *Sender:* ${data.name}\n`;
      waMsg += `📧 *Email:* ${data.email}\n`;
      if (data.phone) waMsg += `📞 *Phone:* ${data.phone}\n`;
      if (data.roll) waMsg += `🎓 *Roll / Affiliation:* ${data.roll}\n`;
      waMsg += `📂 *Category:* ${data.categoryLabel}\n`;
      waMsg += `📌 *Subject:* ${data.subject}\n`;
      waMsg += `━━━━━━━━━━━━━━━━━━━━\n`;
      waMsg += `📝 *Message:*\n${data.message}\n`;

      const waUrl = `https://wa.me/${CAPTAIN_CONFIG.phoneRaw}?text=${encodeURIComponent(waMsg)}`;
      window.open(waUrl, '_blank');

      if (window.showToast) {
        showToast(`Routing dispatch to Captain Chhotu Kumar (${CAPTAIN_CONFIG.phone})...`);
      }
    });
  }

  // Email Button Click
  if (emailBtn) {
    emailBtn.addEventListener('click', () => {
      const data = getContactFormData();
      if (!validateContactForm(data)) return;

      const emailSubject = `[Vestor Innovators - ${data.categoryLabel}] ${data.subject}`;
      let emailBody = `VESTOR INNOVATORS - TRANSMISSION TO CAPTAIN\n`;
      emailBody += `====================================\n`;
      emailBody += `From: ${data.name}\n`;
      emailBody += `Email: ${data.email}\n`;
      if (data.phone) emailBody += `Phone: ${data.phone}\n`;
      if (data.roll) emailBody += `Roll / Affiliation: ${data.roll}\n`;
      emailBody += `Category: ${data.categoryLabel}\n`;
      emailBody += `Subject: ${data.subject}\n`;
      emailBody += `====================================\n\n`;
      emailBody += `Message:\n${data.message}\n`;

      const mailtoUrl = `mailto:${CAPTAIN_CONFIG.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      window.location.href = mailtoUrl;

      if (window.showToast) {
        showToast(`Opening email client to Captain Chhotu Kumar (${CAPTAIN_CONFIG.email})...`);
      }
    });
  }
}
