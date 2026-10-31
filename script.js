/**
 * NEEV BHARAT — FUTURISTIC PORTFOLIO ENGINE
 * Interactive Canvas Particles, Web Audio SFX, Smooth Reveal, Accordion & Forms
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. SOUND SYNTHESIZER (Web Audio API)
  // --------------------------------------------------------------------------
  let audioCtx = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playCyberTone(type = 'click') {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'expand') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.12);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.setValueAtTime(780, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      }
    } catch (e) {
      // Audio fallback silent
    }
  }

  // Sound Toggle button
  const soundToggle = document.getElementById('soundToggle');
  const soundState = document.getElementById('soundState');

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      initAudio();
      soundEnabled = !soundEnabled;
      soundState.textContent = soundEnabled ? 'ON' : 'OFF';
      soundToggle.classList.toggle('muted', !soundEnabled);
      if (soundEnabled) {
        playCyberTone('click');
        showToast('Audio Synthesis: Enabled');
      } else {
        showToast('Audio Synthesis: Muted');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. PRELOADER INITIALIZATION
  // --------------------------------------------------------------------------
  const loader = document.getElementById('loader');
  const loaderBar = document.getElementById('loaderBar');
  const loaderStatus = document.getElementById('loaderStatus');

  const statusMessages = [
    'CONNECTING QUANTUM CORE [15%]',
    'INITIALIZING NEURAL NETWORKS [45%]',
    'CALIBRATING RED ENERGY MATRICES [75%]',
    'NEEV_OS ONLINE [100%]'
  ];

  let loadProgress = 0;
  const progressInterval = setInterval(() => {
    loadProgress += Math.floor(Math.random() * 14) + 8;
    if (loadProgress > 100) loadProgress = 100;

    if (loaderBar) loaderBar.style.width = `${loadProgress}%`;

    const statusIndex = Math.min(
      Math.floor((loadProgress / 100) * statusMessages.length),
      statusMessages.length - 1
    );
    if (loaderStatus) loaderStatus.textContent = statusMessages[statusIndex];

    if (loadProgress >= 100) {
      clearInterval(progressInterval);
      setTimeout(() => {
        if (loader) loader.classList.add('loaded');
        triggerInitialAnimations();
      }, 350);
    }
  }, 45);

  // --------------------------------------------------------------------------
  // 3. SCI-FI PARTICLES CANVAS
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 18000), 75);

    const mouse = { x: null, y: null, radius: 120 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 1.8 + 0.8;
        this.color = Math.random() > 0.8 ? '#ff7b00' : '#ff2a5f';
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 1.5;
            this.y -= (dy / dist) * force * 1.5;
          }
        }
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.18;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = '#ff2a5f';
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  // --------------------------------------------------------------------------
  // 4. SCI-FI CURSOR GLOW (Pointer devices)
  // --------------------------------------------------------------------------
  const cursorGlow = document.getElementById('cursorGlow');
  const cursorDot = document.getElementById('cursorDot');

  if (cursorGlow && cursorDot && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.opacity = '1';
      cursorDot.style.opacity = '1';
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
    });

    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
      cursorDot.style.opacity = '0';
    });

    // Expand cursor on hoverable elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .glass-card');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorGlow.style.transform = 'translate(-50%, -50%) scale(1.4)';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1.8)';
      });
      el.addEventListener('mouseleave', () => {
        cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
      });
    });
  }

  // --------------------------------------------------------------------------
  // 5. NAVBAR SCROLL & MOBILE MENU
  // --------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
      playCyberTone('click');
    });

    navItems.forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        playCyberTone('click');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 6. SCROLLSPY (ACTIVE LINK HIGHLIGHT)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset + 120;
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-links a[href*="${sectionId}"]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItems.forEach((item) => item.classList.remove('active'));
        if (navLink) navLink.classList.add('active');
      }
    });
  });

  // --------------------------------------------------------------------------
  // 7. SCROLL REVEAL OBSERVER & SKILL BARS
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');
  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');

        // If it's a skill card or skills section, animate bar
        const skillBars = entry.target.querySelectorAll('.bar i');
        skillBars.forEach((bar) => {
          const level = bar.style.getPropertyValue('--level') || '50%';
          bar.style.width = level;
        });

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  function triggerInitialAnimations() {
    revealElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('active');
        const skillBars = el.querySelectorAll('.bar i');
        skillBars.forEach((bar) => {
          const level = bar.style.getPropertyValue('--level') || '50%';
          bar.style.width = level;
        });
      } else {
        revealObserver.observe(el);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 8. INTERACTIVE ZONE (QUESTIONS ACCORDION)
  // --------------------------------------------------------------------------
  const questionCards = document.querySelectorAll('.question-card');
  questionCards.forEach((card) => {
    const answerWrapper = card.querySelector('.answer-wrapper');
    const answerContent = card.querySelector('.answer-content');
    const answerText = card.getAttribute('data-answer') || '';

    // Populate answer text
    if (answerContent && answerText) {
      answerContent.textContent = answerText;
    }

    card.addEventListener('click', () => {
      const isExpanded = card.getAttribute('aria-expanded') === 'true';

      // Close other questions
      questionCards.forEach((otherCard) => {
        if (otherCard !== card) {
          otherCard.setAttribute('aria-expanded', 'false');
          const otherWrapper = otherCard.querySelector('.answer-wrapper');
          if (otherWrapper) otherWrapper.style.maxHeight = '0px';
        }
      });

      // Toggle current
      if (isExpanded) {
        card.setAttribute('aria-expanded', 'false');
        if (answerWrapper) answerWrapper.style.maxHeight = '0px';
        playCyberTone('click');
      } else {
        card.setAttribute('aria-expanded', 'true');
        if (answerWrapper) {
          answerWrapper.style.maxHeight = `${answerWrapper.scrollHeight + 30}px`;
        }
        playCyberTone('expand');
      }
    });
  });

  // --------------------------------------------------------------------------
  // 9. TOAST NOTIFICATIONS
  // --------------------------------------------------------------------------
  const toastContainer = document.getElementById('toastContainer');
  window.showToast = function (message, duration = 3500) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>⚡</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  };

  // --------------------------------------------------------------------------
  // 10. CONTACT FORM HANDLER
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formNote = document.getElementById('formNote');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      initAudio();

      const nameInput = contactForm.querySelector('input[name="name"]');
      const emailInput = contactForm.querySelector('input[name="email"]');
      const messageInput = contactForm.querySelector('textarea[name="message"]');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();

      if (!name || !email || !message) {
        if (formNote) {
          formNote.textContent = 'ERROR: All fields required before transmission.';
          formNote.className = 'form-note error';
        }
        playCyberTone('click');
        return;
      }

      // Transmission simulation
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>TRANSMITTING...</span> <span>⏳</span>`;
      if (formNote) {
        formNote.textContent = 'Uplink established. Sending encrypted data packet...';
        formNote.className = 'form-note';
      }

      playCyberTone('click');

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>TRANSMITTED</span> <span>✓</span>`;
        if (formNote) {
          formNote.textContent = `ACK_200: Thank you, ${name}! Your transmission was received.`;
          formNote.className = 'form-note success';
        }
        playCyberTone('success');
        showToast(`Transmission received from ${name}!`);

        contactForm.reset();

        setTimeout(() => {
          submitBtn.innerHTML = `<span>SEND MESSAGE</span> <span>↗</span>`;
          if (formNote) {
            formNote.textContent = 'Ready to transmit transmission packet to Neev Bharat.';
            formNote.className = 'form-note';
          }
        }, 4000);
      }, 1200);
    });
  }

  // --------------------------------------------------------------------------
  // 11. DYNAMIC YEAR
  // --------------------------------------------------------------------------
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 12. SMOOTH BUTTON CLICK AUDIO ENHANCEMENT
  // --------------------------------------------------------------------------
  document.querySelectorAll('.btn, .social-badge, .btn-project').forEach((btn) => {
    btn.addEventListener('click', () => {
      playCyberTone('click');
    });
  });
});
