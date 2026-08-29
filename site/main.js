// A for Aesthetics — shared JS (mobile nav + gentle scroll reveal)
(function () {
  // --- mobile nav ---
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav-toggle');
  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', open ? 'false' : 'true');
      toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
    nav.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.setAttribute('data-open', 'false');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- before/after lightbox ---
  var lb = document.querySelector('.lb');
  if (lb) {
    var lbImg = lb.querySelector('img');
    var lbCap = lb.querySelector('.lb-cap');
    var lastFocus = null;
    function openLb(src, label, desc) {
      lastFocus = document.activeElement;
      lbImg.src = src;
      lbImg.alt = label + ' before and after — A for Aesthetics Sheffield';
      lbCap.innerHTML = '<b>' + label + '</b> — before &amp; after. Genuine client, shared with consent.';
      lb.setAttribute('data-open', 'true');
      document.body.style.overflow = 'hidden';
      lb.querySelector('.lb-close').focus();
    }
    function closeLb() {
      lb.setAttribute('data-open', 'false');
      lbImg.src = '';
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }
    document.querySelectorAll('.ba-figure').forEach(function (fig) {
      fig.addEventListener('click', function () {
        openLb(fig.getAttribute('data-full'), fig.getAttribute('data-label'), '');
      });
    });
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lb-close')) closeLb();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.getAttribute('data-open') === 'true') closeLb();
    });
  }

  // --- scroll reveal (skipped entirely if user prefers reduced motion) ---
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;

  var targets = document.querySelectorAll('.card, .step, .quote, .cta-band, .booking-card, .hero-media, .pricelist, .faq details');
  targets.forEach(function (el, i) {
    el.classList.add('reveal-init');
    el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms';
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.remove('reveal-init');
        e.target.classList.add('reveal-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  targets.forEach(function (el) { io.observe(el); });
})();
