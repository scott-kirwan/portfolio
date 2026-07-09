/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
const isTouch = window.matchMedia('(pointer: coarse)').matches;

if (!isTouch) {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  let dotX = 0, dotY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    dotX = e.clientX;
    dotY = e.clientY;
    dot.style.left = dotX + 'px';
    dot.style.top  = dotY + 'px';
  });

  /* Lerp ring behind the dot for the lag effect */
  const lerp = (a, b, t) => a + (b - a) * t;

  (function animateRing() {
    ringX = lerp(ringX, dotX, 0.1);
    ringY = lerp(ringY, dotY, 0.1);
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  /* Grow ring on interactive elements */
  document.querySelectorAll('[data-cursor="link"]').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ============================================================
   NAV — scrolled state
   ============================================================ */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 40);
}, { passive: true });

/* ============================================================
   MOBILE MENU
   ============================================================ */
const toggle   = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

function closeMenu() {
  navLinks.classList.remove('is-open');
  toggle.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
}

toggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('is-open');
  toggle.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
});

navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

/* ============================================================
   WORK — cursor-following hover preview
   ============================================================ */
const workPreview    = document.getElementById('workPreview');
const workPreviewImg = document.getElementById('workPreviewImg');
const workItems      = document.querySelectorAll('.work__item');

if (workPreview) {
  let previewX = -300, previewY = -300;
  let targetX  = -300, targetY  = -300;

  /* Single img element reused for all rows */
  const previewLogo = document.createElement('img');
  previewLogo.alt = '';
  previewLogo.setAttribute('aria-hidden', 'true');
  workPreviewImg.appendChild(previewLogo);

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  (function animatePreview() {
    const lerpT = 0.09;
    previewX += (targetX - previewX) * lerpT;
    previewY += (targetY - previewY) * lerpT;
    workPreview.style.left = (previewX - 145) + 'px';
    workPreview.style.top  = (previewY - 95)  + 'px';
    requestAnimationFrame(animatePreview);
  })();

  workItems.forEach(item => {
    const src = item.dataset.previewImage || '';
    item.addEventListener('mouseenter', () => {
      previewLogo.src = src;
      previewLogo.style.display = src ? '' : 'none';
      workPreview.classList.add('is-visible');
    });
    item.addEventListener('mouseleave', () => {
      workPreview.classList.remove('is-visible');
    });
  });

  if (isTouch) workPreview.style.display = 'none';
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

/* ============================================================
   FOOTER YEAR
   ============================================================ */
document.getElementById('year').textContent = new Date().getFullYear();

/* ============================================================
   CONTACT FORM — Formspree
   ============================================================ */
document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const btn  = form.querySelector('.btn-submit');
  const span = btn.querySelector('span');

  btn.disabled = true;
  span.textContent = 'Sending…';

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      span.textContent = 'Sent ✓';
      form.reset();
      setTimeout(() => {
        span.textContent = 'Send Message';
        btn.disabled = false;
      }, 4000);
    } else {
      throw new Error();
    }
  } catch {
    span.textContent = 'Something went wrong';
    btn.disabled = false;
    setTimeout(() => { span.textContent = 'Send Message'; }, 4000);
  }
});
