/* ─── Navbar scroll effect ────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

/* ─── Hamburger menu ─────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ─── Reveal on scroll ────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const observer  = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings in the same parent
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
revealEls.forEach(el => observer.observe(el));

/* ─── Typewriter effect ───────────────────────────────────────── */
const phrases = [
  'actually ships.',
  'clients pay for.',
  'governments use.',
  'is built with AI.',
  'solves real problems.',
];
const el    = document.getElementById('typewriter');
let phraseIdx = 0;
let charIdx   = 0;
let deleting  = false;
let paused    = false;

function type() {
  if (paused) return;
  const current = phrases[phraseIdx];

  if (deleting) {
    el.textContent = current.slice(0, charIdx--);
    if (charIdx < 0) {
      deleting  = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(type, 400);
      return;
    }
    setTimeout(type, 45);
  } else {
    el.textContent = current.slice(0, charIdx++);
    if (charIdx > current.length) {
      paused = true;
      setTimeout(() => { paused = false; deleting = true; type(); }, 2200);
      return;
    }
    setTimeout(type, 75);
  }
}
setTimeout(type, 1000);

/* ─── Particle canvas ─────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');
  let W, H, particles;
  const COUNT  = 80;
  const ACCENT = '124,106,255';

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function randomParticle() {
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 1.5 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, randomParticle);
  }

  let mouse = { x: null, y: null };
  window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${ACCENT},${(1 - dist / 140) * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Draw particles + mouse interaction
    particles.forEach(p => {
      // Move towards mouse gently
      if (mouse.x !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.vx += (dx / dist) * 0.012;
          p.vy += (dy / dist) * 0.012;
        }
      }

      p.vx *= 0.995;
      p.vy *= 0.995;
      p.x  += p.vx;
      p.y  += p.vy;

      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${ACCENT},${p.opacity})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); });
  init();
  draw();
})();

/* ─── Smooth active nav link ─────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) {
      current = sec.getAttribute('id');
    }
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? '#e2e2f0' : '';
  });
});

/* ─── Contact form — Formspree ───────────────────────────────── */
const FORMSPREE_ID = 'xyknvzvr';

const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

form.addEventListener('submit', async e => {
  e.preventDefault();

  submitBtn.textContent = 'Sending…';
  submitBtn.disabled    = true;
  formStatus.textContent = '';
  formStatus.className   = 'form-status';

  try {
    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method:  'POST',
      headers: { 'Accept': 'application/json' },
      body:    new FormData(form)
    });

    if (res.ok) {
      submitBtn.textContent    = 'Message Sent ✓';
      submitBtn.style.background = 'var(--green, #4ade80)';
      formStatus.textContent   = 'Thanks! I\'ll get back to you shortly.';
      formStatus.classList.add('form-status--ok');
      form.reset();
      setTimeout(() => {
        submitBtn.textContent      = 'Send Message →';
        submitBtn.style.background = '';
        submitBtn.disabled         = false;
        formStatus.textContent     = '';
        formStatus.className       = 'form-status';
      }, 4000);
    } else {
      const data = await res.json();
      throw new Error(data?.errors?.map(err => err.message).join(', ') || 'Submission failed.');
    }
  } catch (err) {
    submitBtn.textContent  = 'Send Message →';
    submitBtn.disabled     = false;
    formStatus.textContent = `Something went wrong: ${err.message}`;
    formStatus.classList.add('form-status--err');
  }
});

/* ─── Animate stat numbers ───────────────────────────────────── */
function animateCount(el, end, suffix = '') {
  const duration = 1200;
  const start    = Date.now();
  const from     = 0;

  function update() {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const val = Math.round(from + (end - from) * ease);
    el.textContent = val + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  update();
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      nums.forEach(n => {
        const text = n.textContent.trim();
        if (text === '∞') return;
        const num  = parseInt(text);
        const sfx  = text.includes('+') ? '+' : '';
        if (!isNaN(num)) animateCount(n, num, sfx);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.about-stats').forEach(s => statsObserver.observe(s));

/* ─── Add tag glow on project row hover ─────────────────────── */
document.querySelectorAll('.project-tag').forEach(tag => {
  const row = tag.closest('.project-row');
  if (!row) return;
  row.addEventListener('mouseenter', () => { tag.style.boxShadow = '0 0 10px rgba(124,106,255,0.3)'; });
  row.addEventListener('mouseleave', () => { tag.style.boxShadow = ''; });
});

/* ─── Scroll progress bar ────────────────────────────────────── */
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrolled  = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.style.width = ((scrolled / maxScroll) * 100) + '%';
}, { passive: true });

/* ─── Cursor glow (lerp follow) ──────────────────────────────── */
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = window.innerWidth  / 2;
let mouseY = window.innerHeight / 2;
let glowX  = mouseX;
let glowY  = mouseY;

window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}, { passive: true });

(function animateGlow() {
  glowX += (mouseX - glowX) * 0.07;
  glowY += (mouseY - glowY) * 0.07;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top  = glowY + 'px';
  requestAnimationFrame(animateGlow);
})();

/* ─── 3D card tilt on hover ──────────────────────────────────── */
document.querySelectorAll('.skill-card, .why-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r    = card.getBoundingClientRect();
    const x    = e.clientX - r.left;
    const y    = e.clientY - r.top;
    const cx   = r.width  / 2;
    const cy   = r.height / 2;
    const rotX = ((y - cy) / cy) * -7;
    const rotY = ((x - cx) / cx) *  7;
    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px) scale(1.01)`;
    card.style.transition = 'box-shadow 0.2s ease, border-color 0.2s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = '';
  });
});

/* ─── Magnetic hero CTA buttons ─────────────────────────────── */
document.querySelectorAll('.hero-cta .btn-primary, .hero-cta .btn-ghost').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r  = btn.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width  / 2) * 0.18;
    const dy = (e.clientY - r.top  - r.height / 2) * 0.18;
    btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-2px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ─── Reveal-right via IntersectionObserver ──────────────────── */
const revealRightEls = document.querySelectorAll('.reveal-right');
const revealRightObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealRightObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
revealRightEls.forEach(el => revealRightObs.observe(el));
