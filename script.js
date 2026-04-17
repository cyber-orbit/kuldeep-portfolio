/* ============================================================
   CYBER-ORBIT PORTFOLIO — script.js
   Author: Kuldeep Singh | Brand: Cyber-Orbit
   ============================================================ */

'use strict';

/* ---- CUSTOM CURSOR ---- */
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let mouseX = 0, mouseY = 0, trailX = 0, trailY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top  = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

/* hover enlarge cursor */
document.querySelectorAll('a, button, .project-card, .blog-card, .filter-btn').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
    cursorTrail.style.transform = 'translate(-50%,-50%) scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorTrail.style.transform = 'translate(-50%,-50%) scale(1)';
  });
});

/* ---- NAVBAR SCROLL ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ---- HAMBURGER MENU ---- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ---- SMOOTH ACTIVE NAV ---- */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navItems.forEach(n => n.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => observer.observe(s));

/* ---- TYPING ANIMATION ---- */
const phrases = [
  'AI Developer',
  'Cybersecurity Enthusiast',
  'Full Stack Builder',
  'OSINT Researcher',
  'Linux Hacker',
];
let phraseIdx = 0, charIdx = 0, isDeleting = false;
const typedEl = document.getElementById('typedText');

function type() {
  const current = phrases[phraseIdx];
  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIdx--);
  } else {
    typedEl.textContent = current.substring(0, charIdx++);
  }

  let delay = isDeleting ? 60 : 110;

  if (!isDeleting && charIdx > current.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIdx < 0) {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    delay = 400;
    charIdx = 0;
  }
  setTimeout(type, delay);
}
type();

/* ---- CANVAS PARTICLE / CYBER-GRID BG ---- */
const canvas = document.getElementById('bgCanvas');
const ctx    = canvas.getContext('2d');

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const PARTICLES = 90;
const particles = Array.from({length: PARTICLES}, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  vx: (Math.random() - 0.5) * 0.5,
  vy: (Math.random() - 0.5) * 0.5,
  r: Math.random() * 2 + 0.5,
  alpha: Math.random() * 0.6 + 0.1,
}));

let animMouse = { x: canvas.width / 2, y: canvas.height / 2 };
window.addEventListener('mousemove', e => {
  animMouse.x = e.clientX;
  animMouse.y = e.clientY;
});

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  /* Draw connections */
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,255,136,${0.12 * (1 - dist / 130)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }

    /* Mouse connections */
    const mx = animMouse.x - particles[i].x;
    const my = animMouse.y - particles[i].y;
    const md = Math.sqrt(mx * mx + my * my);
    if (md < 180) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(0,207,255,${0.25 * (1 - md / 180)})`;
      ctx.lineWidth = 0.8;
      ctx.moveTo(particles[i].x, particles[i].y);
      ctx.lineTo(animMouse.x, animMouse.y);
      ctx.stroke();
    }

    /* Particle dot */
    ctx.beginPath();
    ctx.arc(particles[i].x, particles[i].y, particles[i].r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,255,136,${particles[i].alpha})`;
    ctx.fill();

    /* Update */
    particles[i].x += particles[i].vx;
    particles[i].y += particles[i].vy;
    if (particles[i].x < 0 || particles[i].x > canvas.width)  particles[i].vx *= -1;
    if (particles[i].y < 0 || particles[i].y > canvas.height) particles[i].vy *= -1;
  }

  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ---- REVEAL ON SCROLL ---- */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => {
        e.target.classList.add('visible');
        triggerSkillBars(e.target);
        triggerCounters(e.target);
      }, i * 80);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObs.observe(el));

/* ---- SKILL BARS ---- */
function triggerSkillBars(container) {
  const bars = container.querySelectorAll('.bar-fill');
  bars.forEach(bar => {
    const pct = bar.getAttribute('data-pct');
    setTimeout(() => { bar.style.width = pct + '%'; }, 200);
  });
}

/* ---- COUNTER ANIMATION ---- */
function triggerCounters(container) {
  const counters = container.querySelectorAll('.stat-number[data-target]');
  counters.forEach(el => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = Math.ceil(target / 40);
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(interval);
    }, 40);
  });
}

/* ---- PROJECT FILTER ---- */
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      if (filter === 'all' || card.dataset.cat.includes(filter)) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ---- TERMINAL INTERACTIVITY ---- */
const termInput = document.getElementById('termInput');
const termBody  = document.getElementById('terminalBody');

const commands = {
  help: `Available commands:<br>
  <span style="color:var(--neon-green)">whoami</span>     — display identity<br>
  <span style="color:var(--neon-green)">projects</span>   — list all projects<br>
  <span style="color:var(--neon-green)">skills</span>     — show tech stack<br>
  <span style="color:var(--neon-green)">contact</span>    — get contact info<br>
  <span style="color:var(--neon-green)">clear</span>      — clear terminal<br>
  <span style="color:var(--neon-green)">github</span>     — open GitHub profile`,
  whoami: 'Kuldeep Singh — AI Developer · Cybersecurity Researcher · Full Stack Builder<br>Location: Punjab, India | Status: <span style="color:var(--neon-green)">ONLINE</span>',
  projects: 'KAI_CYBER_AI | aegis_ai | Kai_cli | CyberForge | ReportX | OrbitTrace',
  skills: 'Python · Bash · JavaScript · C | Nmap · Wireshark · Burp Suite · Aircrack-ng | Kali Linux',
  contact: 'Email: <span style="color:var(--neon-cyan)">ks8124708@gmail.com</span> | Phone: +91 7681903497 | GitHub: cyber-orbit',
  github: 'Opening GitHub... → <a href="https://github.com/cyber-orbit" target="_blank" style="color:var(--neon-cyan)">github.com/cyber-orbit</a>',
};

function appendTermLine(cmd, output) {
  const cmdLine = document.createElement('div');
  cmdLine.className = 'term-line';
  cmdLine.innerHTML = `<span class="prompt">kai@cyber-orbit:~$</span> <span class="t-cmd">${cmd}</span>`;
  termBody.appendChild(cmdLine);

  if (output) {
    const outEl = document.createElement('div');
    outEl.className = 'term-output';
    outEl.innerHTML = output;
    termBody.appendChild(outEl);
  }
  termBody.scrollTop = termBody.scrollHeight;
}

termInput.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const raw = termInput.value.trim().toLowerCase();
  termInput.value = '';
  if (!raw) return;

  if (raw === 'clear') {
    termBody.innerHTML = '';
    return;
  }

  const response = commands[raw] || `Command not found: <span style="color:var(--neon-red)">${raw}</span>. Type <span style="color:var(--neon-green)">help</span> for commands.`;
  appendTermLine(raw, response);
});

/* ---- CONTACT FORM ---- */
const form       = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

form && form.addEventListener('submit', async e => {
  e.preventDefault();
  formStatus.textContent = 'Sending...';
  formStatus.style.color = 'var(--neon-cyan)';
  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' },
    });
    if (res.ok) {
      formStatus.textContent = '✓ Message sent successfully!';
      formStatus.style.color = 'var(--neon-green)';
      form.reset();
    } else {
      throw new Error('Server error');
    }
  } catch {
    formStatus.textContent = '✗ Failed to send. Email directly: ks8124708@gmail.com';
    formStatus.style.color = 'var(--neon-red)';
  }
});

/* ---- DARK/LIGHT THEME TOGGLE ---- */
const themeToggle = document.getElementById('themeToggle');
let isDark = true;

themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? '' : 'light');
  themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

/* ---- GLITCH TEXT RANDOM SHUFFLE ---- */
const glitchEl = document.querySelector('.glitch');
const original = glitchEl ? glitchEl.textContent : '';
const chars    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

function randomChar() {
  return chars[Math.floor(Math.random() * chars.length)];
}

function triggerGlitchText() {
  if (!glitchEl) return;
  let iterations = 0;
  const interval = setInterval(() => {
    glitchEl.textContent = original.split('').map((c, i) => {
      if (i < iterations) return original[i];
      return c === ' ' ? ' ' : randomChar();
    }).join('');
    glitchEl.dataset.text = glitchEl.textContent;
    if (iterations >= original.length) {
      clearInterval(interval);
      glitchEl.textContent = original;
      glitchEl.dataset.text = original;
    }
    iterations += 1.5;
  }, 40);
}

setInterval(triggerGlitchText, 6000);

/* ---- ACTIVE NAV STYLE ---- */
const style = document.createElement('style');
style.textContent = `.nav-link.active { color: var(--neon-green); }
.nav-link.active::after { width: 100%; }`;
document.head.appendChild(style);

console.log('%c CYBER-ORBIT :: SYSTEM ONLINE ', 'background:#00ff88;color:#050a0f;font-family:monospace;font-size:14px;font-weight:bold;padding:8px 16px;border-radius:4px;');
console.log('%c Kuldeep Singh | AI + Cybersecurity + Full Stack ', 'color:#00cfff;font-family:monospace;');
