(function () {
  var bar = document.querySelector('.s-bar'), burger = document.querySelector('.s-bar__burger');
  if (bar && burger) {
    burger.addEventListener('click', function () { var o = bar.classList.toggle('is-open'); burger.setAttribute('aria-expanded', o ? 'true' : 'false'); });
    bar.querySelectorAll('.s-bar__nav a').forEach(function (a) { a.addEventListener('click', function () { bar.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }); });
  }
  var links = [].slice.call(document.querySelectorAll('.s-bar__nav a'));
  var map = links.map(function (a) { return { a: a, el: document.querySelector(a.getAttribute('href')) }; }).filter(function (m) { return m.el; });

  /* сцена «входим в комнату»: пролёт 0..1 делится на комнаты, камера приближается, комнаты сменяют друг друга */
  var rooms = document.querySelector('[data-x-rooms]'), still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var imgs = rooms ? [].slice.call(rooms.querySelectorAll('.x-rooms__img')) : [], txt = rooms ? [].slice.call(rooms.querySelectorAll('.x-room')) : [];
  var dots = rooms ? [].slice.call(rooms.querySelectorAll('.x-rooms__dots li')) : [], counter = rooms ? rooms.querySelector('[data-x-count]') : null;
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function scene() {
    var track = rooms.querySelector('.x-rooms__track'), r = track.getBoundingClientRect();
    var p = clamp(-r.top / Math.max(r.height - innerHeight, 1), 0, 1), n = imgs.length, f = p * n, cur = clamp(Math.floor(f), 0, n - 1);
    imgs.forEach(function (im, i) {
      var d = Math.abs(f - (i + 0.5)), o = clamp((0.64 - d) / 0.16, 0, 1);
      if (i === 0 && f < 0.5) o = 1; if (i === n - 1 && f > n - 0.5) o = 1;
      var local = f - i, sc = 1.04 + 0.2 * clamp((local + 0.45) / 1.9, 0, 1);
      im.style.opacity = o.toFixed(3); im.style.transform = 'scale(' + sc.toFixed(4) + ')';
    });
    txt.forEach(function (t, i) {
      var d = Math.abs(f - (i + 0.5)), o = clamp((0.5 - d) / 0.12, 0, 1);
      if (i === 0 && f < 0.5) o = 1; if (i === n - 1 && f > n - 0.5) o = 1;
      var local = clamp(f - i, 0, 1);
      t.style.opacity = o.toFixed(3); t.style.transform = 'translateY(' + ((1 - o) * 14).toFixed(1) + 'px)';
      t.style.setProperty('--ls', (0.26 - 0.2 * clamp(local * 1.6, 0, 1)).toFixed(3) + 'em');
    });
    dots.forEach(function (d, i) { d.classList.toggle('is-on', i === cur); });
    if (counter) counter.textContent = '0' + (cur + 1) + ' / 0' + n;
  }

  var tick = false;
  function frame() {
    tick = false;
    var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.setProperty('--sp', h > 0 ? Math.min(y / h, 1).toFixed(4) : 0);
    var probe = y + innerHeight * 0.4, cur = null;
    map.forEach(function (m) { if (m.el.getBoundingClientRect().top + y <= probe) cur = m; });
    map.forEach(function (m) { m.a.classList.toggle('is-on', m === cur); });
    if (rooms && !still) scene();
  }
  addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(frame); } }, { passive: true });
  addEventListener('resize', frame); frame();

  /* «55 м²» контуром на первом экране следует за ползунком площади */
  var area = document.getElementById('f-area'), big = document.querySelector('.x-big');
  if (area && big) { var upd = function () { big.innerHTML = area.value + '<small>м²</small>'; }; area.addEventListener('input', upd); upd(); }

  /* волна на кнопках */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.s-btn'); if (!b) return;
    var r = b.getBoundingClientRect(), s = Math.max(r.width, r.height), x = document.createElement('span');
    x.className = 'x-ripple'; x.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + (e.clientX - r.left - s / 2) + 'px;top:' + (e.clientY - r.top - s / 2) + 'px';
    b.appendChild(x); setTimeout(function () { x.remove(); }, 650);
  });
})();
