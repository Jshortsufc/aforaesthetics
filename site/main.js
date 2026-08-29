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

  // --- contact form (Web3Forms, AJAX with graceful fallback) ---
  var cform = document.querySelector('[data-contact-form]');
  if (cform) {
    var cstatus = cform.querySelector('.form-status');
    var cbtn = cform.querySelector('button[type="submit"]');
    var setStatus = function (msg, ok) {
      cstatus.textContent = msg;
      cstatus.classList.remove('form-status--ok', 'form-status--err');
      cstatus.classList.add(ok ? 'form-status--ok' : 'form-status--err');
      cstatus.hidden = false;
    };
    cform.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!cform.checkValidity()) { cform.reportValidity(); return; }
      var data = Object.fromEntries(new FormData(cform).entries());
      var original = cbtn.textContent;
      cbtn.disabled = true; cbtn.textContent = 'Sending…'; cstatus.hidden = true;
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) { return r.json(); }).then(function (json) {
        if (json.success) {
          cform.reset();
          setStatus('Thanks — your message has been sent. We\'ll be in touch shortly.', true);
        } else {
          setStatus((json.message || 'Something went wrong.') + ' You can also email info@aforaesthetics.com.', false);
        }
      }).catch(function () {
        setStatus('Sorry — we couldn\'t send that just now. Please email info@aforaesthetics.com or call 07758 930674.', false);
      }).finally(function () {
        cbtn.disabled = false; cbtn.textContent = original;
      });
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
