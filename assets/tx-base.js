/* Titan Express redesign: small shared behaviours (reveal on scroll, sticky action bar, quick-quote hand-off). No libraries. */
(function () {
  if (window.__txBase) return; window.__txBase = true;
  document.documentElement.classList.add('tx-js');

  // Reveal elements as they scroll into view.
  var els = document.querySelectorAll('.tx-reveal, .tx-imgreveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('is-in'); }); }

  // Mobile action bar: shows once the hero buttons scroll out of view, hides near the final call band.
  var bar = document.querySelector('.tx-actionbar'), hero = document.querySelector('[data-tx-hero-ctas]'), end = document.querySelector('[data-tx-end]');
  if (bar && hero && 'IntersectionObserver' in window) {
    var heroVisible = true, endVisible = false;
    var upd = function () { bar.classList.toggle('is-on', !heroVisible && !endVisible); };
    new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; upd(); }).observe(hero);
    if (end) new IntersectionObserver(function (e) { endVisible = e[0].isIntersecting; upd(); }).observe(end);
  }

  // Count-up numbers (e.g. "59 reviews").
  document.querySelectorAll('[data-tx-count]').forEach(function (el) {
    var to = parseFloat(el.getAttribute('data-tx-count')), dec = (el.getAttribute('data-tx-count').split('.')[1] || '').length, done = false;
    var run = function () {
      if (done) return; done = true; var t0 = performance.now();
      (function step(t) { var p = Math.min(1, (t - t0) / 1100), v = to * (1 - Math.pow(1 - p, 3)); el.textContent = v.toFixed(dec); if (p < 1) requestAnimationFrame(step); })(t0);
    };
    if ('IntersectionObserver' in window) new IntersectionObserver(function (e, o) { if (e[0].isIntersecting) { run(); o.disconnect(); } }).observe(el); else run();
  });
})();
