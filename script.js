/**
 * script.js — Mohsin Raza Portfolio
 * 3D motion engine + mobile menu + async contact form.
 */

(function () {
  "use strict";

  /* ==========================
     DOM REFERENCES
     ========================== */
  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-list");
  const navLinks = document.querySelectorAll('.nav-list a[href^="#"]');
  const contactForm = document.getElementById("contact-form");
  const currentYearSpan = document.getElementById("current-year");
  const heroGlow = document.querySelector(".hero-glow");
  const hero = document.getElementById("hero");
  const heroContent = document.querySelector(".hero-content");
  const particleCanvas = document.getElementById("particle-canvas");
  const tiltCards = document.querySelectorAll(".about-card, .skill-card, .project-card, .experience-card");

  /* ==========================
     MOBILE MENU TOGGLE
     ========================== */
  function toggleMenu() {
    const isOpen = navList.classList.toggle("active");
    navToggle.classList.toggle("active");
    navToggle.setAttribute("aria-expanded", isOpen);
  }

  function closeMenu() {
    navList.classList.remove("active");
    navToggle.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && navList) {
    navToggle.addEventListener("click", toggleMenu);
    navLinks.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navList.classList.contains("active")) {
        closeMenu();
        navToggle.focus();
      }
    });
  }

  /* ==========================
     FOOTER YEAR
     ========================== */
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  /* ==========================
     PARTICLE SYSTEM
     ========================== */
  let particleCtx, particles, particleAnimId;
  const PARTICLE_COUNT = 80;
  const PARTICLE_MAX_RADIUS = 2.5;
  const PARTICLE_CONNECT_DIST = 130;

  function initParticles() {
    if (!particleCanvas) return;
    const canvas = particleCanvas;
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    particleCtx = canvas.getContext("2d");
    particleCtx.scale(window.devicePixelRatio, window.devicePixelRatio);

    particles = [];
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * PARTICLE_MAX_RADIUS + 0.5,
      });
    }
  }

  function drawParticles() {
    if (!particleCtx || !particles) return;
    const canvas = particleCanvas;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    particleCtx.clearRect(0, 0, w, h);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      /* Move */
      p.x += p.vx;
      p.y += p.vy;

      /* Wrap edges */
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      /* Draw particle */
      particleCtx.beginPath();
      particleCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      particleCtx.fillStyle = "rgba(88, 166, 255, 0.35)";
      particleCtx.fill();
    }

    /* Draw connections */
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < PARTICLE_CONNECT_DIST) {
          var opacity = (1 - dist / PARTICLE_CONNECT_DIST) * 0.15;
          particleCtx.beginPath();
          particleCtx.moveTo(particles[i].x, particles[i].y);
          particleCtx.lineTo(particles[j].x, particles[j].y);
          particleCtx.strokeStyle = "rgba(88, 166, 255, " + opacity + ")";
          particleCtx.lineWidth = 0.5;
          particleCtx.stroke();
        }
      }
    }

    particleAnimId = requestAnimationFrame(drawParticles);
  }

  function handleCanvasResize() {
    if (!particleCanvas) return;
    const canvas = particleCanvas;
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    if (particleCtx) {
      particleCtx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    }
  }

  /* ==========================
     MOUSE-TRACKING HERO GLOW
     ========================== */
  function updateHeroGlow(e) {
    if (!heroGlow || !hero) return;
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    heroGlow.style.left = x + "px";
    heroGlow.style.top = y + "px";
    heroGlow.classList.add("active");
  }

  function hideHeroGlow() {
    if (heroGlow) heroGlow.classList.remove("active");
  }

  if (hero) {
    hero.addEventListener("mousemove", updateHeroGlow);
    hero.addEventListener("mouseleave", hideHeroGlow);
  }

  /* ==========================
     HERO PARALLAX SCROLL
     ========================== */
  function applyHeroParallax() {
    if (!heroContent) return;
    const scrollY = window.pageYOffset;
    const speed = 0.15;
    heroContent.style.transform =
      "translateZ(0) translateY(" + scrollY * speed + "px)";
  }

  /* ==========================
     3D CARD TILT ON HOVER
     ========================== */
  function handleTiltEnter(e) {
    var card = e.currentTarget;
    var rect = card.getBoundingClientRect();
    var centerX = rect.left + rect.width / 2;
    var centerY = rect.top + rect.height / 2;
    var mouseX = e.clientX - centerX;
    var mouseY = e.clientY - centerY;
    var maxTilt = 12;
    var rotateY = (mouseX / (rect.width / 2)) * maxTilt;
    var rotateX = -(mouseY / (rect.height / 2)) * maxTilt;

    card.style.transform =
      "perspective(800px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateY(-4px)";
    card.style.transition = "transform 0.1s ease, border-color 150ms ease, box-shadow 150ms ease";
  }

  function handleTiltMove(e) {
    var card = e.currentTarget;
    var rect = card.getBoundingClientRect();
    var centerX = rect.left + rect.width / 2;
    var centerY = rect.top + rect.height / 2;
    var mouseX = e.clientX - centerX;
    var mouseY = e.clientY - centerY;
    var maxTilt = 12;
    var rotateY = (mouseX / (rect.width / 2)) * maxTilt;
    var rotateX = -(mouseY / (rect.height / 2)) * maxTilt;

    card.style.transform =
      "perspective(800px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateY(-2px)";
  }

  function handleTiltLeave(e) {
    var card = e.currentTarget;
    var baseTransform = "";
    if (card.classList.contains("skill-card")) {
      baseTransform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
    } else {
      baseTransform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
    }
    card.style.transform = baseTransform;
    card.style.transition = "transform 400ms ease, border-color 150ms ease, box-shadow 150ms ease";
  }

  tiltCards.forEach(function (card) {
    card.addEventListener("mouseenter", handleTiltEnter);
    card.addEventListener("mousemove", handleTiltMove);
    card.addEventListener("mouseleave", handleTiltLeave);
  });

  /* ==========================
     SCROLL-TRIGGERED SECTION ANIMATIONS
     ========================== */
  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-visible");
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".section").forEach(function (section) {
    sectionObserver.observe(section);
  });

  /* ==========================
     CONTACT FORM — ASYNC HANDLER
     ========================== */
  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmit);
  }

  function validateField(input) {
    const errorSpan = input.parentElement.querySelector(".form-error");
    if (errorSpan) errorSpan.textContent = "";

    if (input.hasAttribute("required") && !input.value.trim()) {
      if (errorSpan) errorSpan.textContent = "This field is required.";
      return false;
    }

    if (input.type === "email" && input.value.trim()) {
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value.trim())) {
        if (errorSpan) errorSpan.textContent = "Please enter a valid email address.";
        return false;
      }
    }

    return true;
  }

  async function handleFormSubmit(event) {
    event.preventDefault();

    var form = event.target;
    var fields = form.querySelectorAll("input, textarea");
    var submitBtn = form.querySelector('button[type="submit"]');
    var successMsg = form.querySelector(".form-success");

    var isValid = true;
    fields.forEach(function (field) {
      if (!validateField(field)) isValid = false;
    });
    if (!isValid) return;

    var formData = {
      name: form.querySelector("#name").value.trim(),
      email: form.querySelector("#email").value.trim(),
      message: form.querySelector("#message").value.trim(),
    };

    submitBtn.classList.add("loading");
    submitBtn.disabled = true;
    if (successMsg) successMsg.textContent = "";

    fields.forEach(function (field) {
      var err = field.parentElement.querySelector(".form-error");
      if (err) err.textContent = "";
    });

    try {
      await simulateSubmission(1200);
      if (successMsg) {
        successMsg.style.color = "";
        successMsg.textContent = "Message sent successfully! I'll get back to you soon.";
      }
      form.reset();
      setTimeout(function () {
        if (successMsg) successMsg.textContent = "";
      }, 8000);
    } catch (error) {
      if (successMsg) {
        successMsg.style.color = "var(--clr-error)";
        successMsg.textContent = "Something went wrong. Please try again or email me directly.";
      }
    } finally {
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
    }
  }

  function simulateSubmission(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  document.querySelectorAll("#contact-form input, #contact-form textarea").forEach(function (input) {
    input.addEventListener("blur", function () {
      validateField(input);
    });
    input.addEventListener("input", function () {
      var errorSpan = input.parentElement.querySelector(".form-error");
      if (errorSpan && errorSpan.textContent) {
        validateField(input);
      }
    });
  });

  /* ==========================
     INIT & EVENT LISTENERS
     ========================== */
  function init() {
    initParticles();
    if (particleCanvas) {
      particleAnimId = requestAnimationFrame(drawParticles);
    }
    window.addEventListener("resize", handleCanvasResize);
    window.addEventListener("scroll", applyHeroParallax, { passive: true });
  }

  init();

})();
