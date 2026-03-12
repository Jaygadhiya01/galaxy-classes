/* ============================================================
   Galaxy Classes - Main JavaScript
   Features: Navbar, Hamburger, Scroll Reveal, Course Tabs,
             Form Validation, WhatsApp Enquiry
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── 1. NAVBAR: Scroll effect & active link ───────────── */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

  // Mark active page link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Add scrolled class when page scrolled
  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }
  });

  /* ── 2. HAMBURGER MENU ────────────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    // Close mobile menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ── 3. SCROLL REVEAL (Intersection Observer) ─────────── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  /* ── 4. COURSE TABS (index.html & courses.html) ───────── */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const courseCards = document.querySelectorAll('.course-card');

  function filterCourses(category) {
    courseCards.forEach(card => {
      if (category === 'all' || card.dataset.category === category) {
        card.classList.add('visible');
      } else {
        card.classList.remove('visible');
      }
    });
  }

  if (tabBtns.length > 0) {
    // Show all initially
    filterCourses('all');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterCourses(btn.dataset.tab);
      });
    });
  }

  /* ── 5. ADMISSION FORM VALIDATION ────────────────────── */
  const admissionForm = document.getElementById('admissionForm');
  if (admissionForm) {
    admissionForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateAdmissionForm()) {
        showSuccess('admissionSuccess');
        admissionForm.reset();
      }
    });
  }

  /* ── 6. CONTACT FORM VALIDATION ──────────────────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateContactForm()) {
        showSuccess('contactSuccess');
        contactForm.reset();
      }
    });
  }

  /* ── 7. WHATSAPP ENQUIRY BUTTON ──────────────────────── */
  const waBtn = document.getElementById('whatsappBtn');
  if (waBtn) {
    waBtn.addEventListener('click', function () {
      sendWhatsApp();
    });
  }

  /* ─────────────────────────────────────────────────────── */
  /* HELPER FUNCTIONS                                         */
  /* ─────────────────────────────────────────────────────── */

  /**
   * Validate the Admission Form fields
   * Returns true if all required fields pass
   */
  function validateAdmissionForm() {
    let valid = true;

    const fields = [
      { id: 'studentName', msg: 'Please enter student name' },
      { id: 'fatherName', msg: 'Please enter father name' },
      { id: 'motherName', msg: 'Please enter mother name' },
      { id: 'mobile', msg: 'Please enter valid 10-digit mobile number', pattern: /^[6-9]\d{9}$/ },
      { id: 'parentMobile', msg: 'Please enter valid 10-digit parent mobile', pattern: /^[6-9]\d{9}$/ },
      { id: 'standard', msg: 'Please select standard' },
      { id: 'medium', msg: 'Please select medium' },
      { id: 'schoolName', msg: 'Please enter school name' },
    ];

    // Email validation (optional but format-checked if filled)
    const emailEl = document.getElementById('email');
    if (emailEl && emailEl.value.trim() !== '') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
        showFieldError('email', 'Please enter a valid email address');
        valid = false;
      } else {
        clearFieldError('email');
      }
    }

    fields.forEach(({ id, msg, pattern }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const val = el.value.trim();
      if (!val || (pattern && !pattern.test(val))) {
        showFieldError(id, msg);
        valid = false;
      } else {
        clearFieldError(id);
      }
    });

    return valid;
  }

  /**
   * Validate the Contact Form
   */
  function validateContactForm() {
    let valid = true;
    const fields = [
      { id: 'cName', msg: 'Please enter your name' },
      { id: 'cEmail', msg: 'Please enter a valid email', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      { id: 'cSubject', msg: 'Please enter a subject' },
      { id: 'cMessage', msg: 'Please enter your message' },
    ];
    fields.forEach(({ id, msg, pattern }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const val = el.value.trim();
      if (!val || (pattern && !pattern.test(val))) {
        showFieldError(id, msg);
        valid = false;
      } else {
        clearFieldError(id);
      }
    });
    return valid;
  }

  /**
   * Mark a field as error and show error message
   */
  function showFieldError(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('error');
    const errEl = document.getElementById(id + 'Err');
    if (errEl) {
      errEl.textContent = msg;
      errEl.style.display = 'block';
    }
  }

  /**
   * Clear field error styling
   */
  function clearFieldError(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('error');
    const errEl = document.getElementById(id + 'Err');
    if (errEl) {
      errEl.style.display = 'none';
    }
  }

  /**
   * Show success banner after form submission
   */
  function showSuccess(bannerId) {
    const banner = document.getElementById(bannerId);
    if (banner) {
      banner.style.display = 'flex';
      banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => { banner.style.display = 'none'; }, 6000);
    }
  }

  /**
   * Generate WhatsApp message from admission form and open WhatsApp
   * Uses the form values to build a pre-filled message
   */
  function sendWhatsApp() {
    // Collect form values (some may be empty)
    const studentName = getVal('studentName') || 'Not provided';
    const standard    = getVal('standard')    || 'Not provided';
    const medium      = getVal('medium')      || 'Not provided';
    const schoolName  = getVal('schoolName')  || 'Not provided';
    const mobile      = getVal('mobile')      || 'Not provided';

    // Build the WhatsApp message in the required format
    const message =
      `Hello Galaxy Classes,\n\n` +
      `I want admission for:\n` +
      `👤 Student Name: ${studentName}\n` +
      `📚 Standard: ${standard}\n` +
      `🌐 Medium: ${medium}\n` +
      `🏫 School: ${schoolName}\n` +
      `📞 Mobile Number: ${mobile}\n\n` +
      `Please share more details.`;

    // Replace with actual WhatsApp number of Galaxy Classes
    const phone = '919999999999'; // ← Update this number
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${phone}?text=${encoded}`;

    window.open(url, '_blank');
  }

  /** Get trimmed value of a form field by id */
  function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  /* ── 8. CLEAR ERRORS ON FOCUS ─────────────────────────── */
  document.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('focus', () => {
      clearFieldError(el.id);
    });
  });

  /* ── 9. SMOOTH SCROLL for anchor links ───────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── 10. ANIMATED COUNTER (hero stats) ───────────────── */
  function animateCounter(el, target, suffix = '') {
    let start = 0;
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start) + suffix;
      }
    }, stepTime);
  }

  // Only animate counters when hero is visible
  const heroStats = document.querySelectorAll('.stat-number');
  if (heroStats.length > 0) {
    const values = [500, 12, 95, 10]; // students, standards, results%, years
    const suffixes = ['+', '', '%', '+'];
    heroStats.forEach((el, i) => {
      // Small delay so page loads first
      setTimeout(() => {
        animateCounter(el, values[i], suffixes[i]);
      }, 600 + i * 200);
    });
  }

});
