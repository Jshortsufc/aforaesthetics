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
          setStatus((json.message || 'Something went wrong.') + ' You can also email aforaesthetics@hotmail.com.', false);
        }
      }).catch(function () {
        setStatus('Sorry — we couldn\'t send that just now. Please email aforaesthetics@hotmail.com or call 07758 930674.', false);
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

/* --- Cookie consent banner (Google Consent Mode v2) --- */
(function () {
  var KEY = 'afa-consent';
  var META_PIXEL_ID = '548824422421465';

  // Meta Pixel loads only after consent (no Consent Mode equivalent), so it is
  // injected here rather than in the page head.
  function loadMetaPixel() {
    if (window._afaPixelLoaded) return;
    window._afaPixelLoaded = true;
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ?
        n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
      n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', META_PIXEL_ID);
    fbq('track', 'PageView');
  }

  var choice;
  try { choice = localStorage.getItem(KEY); } catch (e) {}
  if (choice === 'granted') { loadMetaPixel(); return; } // consented previously
  if (choice === 'denied') return;                       // declined previously

  var banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Cookie notice');
  banner.innerHTML =
    '<p>We use cookies to measure our advertising and understand how the site is used. ' +
    'You can accept these or decline. See our <a href="/privacy-policy">Privacy Policy</a>.</p>' +
    '<div class="cookie-actions">' +
      '<button type="button" class="btn btn-ghost" data-consent="deny">Decline</button>' +
      '<button type="button" class="btn btn-primary" data-consent="accept">Accept</button>' +
    '</div>';

  function setConsent(granted) {
    try { localStorage.setItem(KEY, granted ? 'granted' : 'denied'); } catch (e) {}
    if (granted && typeof gtag === 'function') {
      gtag('consent', 'update', {
        ad_storage: 'granted', ad_user_data: 'granted',
        ad_personalization: 'granted', analytics_storage: 'granted'
      });
    }
    if (granted) loadMetaPixel();
    if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
  }

  function attach() {
    document.body.appendChild(banner);
    banner.querySelector('[data-consent="accept"]').addEventListener('click', function () { setConsent(true); });
    banner.querySelector('[data-consent="deny"]').addEventListener('click', function () { setConsent(false); });
  }
  if (document.body) attach();
  else document.addEventListener('DOMContentLoaded', attach);
})();
