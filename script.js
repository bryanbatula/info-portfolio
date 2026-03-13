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

/* ─── Contact form ────────────────────────────────────────────── */
const form = document.getElementById('contactForm');
form.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Message Sent ✓';
  btn.style.background = '#4ade80';
  btn.style.cursor = 'default';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Send Message →';
    btn.style.background = '';
    btn.style.cursor = '';
    btn.disabled = false;
    form.reset();
  }, 3000);
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

/* ─── Add cert badge glow on hover ──────────────────────────── */
document.querySelectorAll('.project-tag').forEach(tag => {
  tag.closest('.project-card').addEventListener('mouseenter', () => {
    tag.style.boxShadow = '0 0 12px rgba(124,106,255,0.4)';
  });
  tag.closest('.project-card').addEventListener('mouseleave', () => {
    tag.style.boxShadow = '';
  });
});
