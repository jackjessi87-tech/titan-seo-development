/* Titan Express instant quote overlay (redesign 2026-11). Plain JS, no build step.
   Opens from [data-tx-open-quote], the hero quick start form, or a #instant-quote link. Submits through Shopify's contact form. */
(function () {
  var root = document.getElementById('txq');
  if (!root || root.__ready) return; root.__ready = true;
  var q = function (sel) { return root.querySelector(sel); };
  var qa = function (sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var IC = function () { return window.TITAN_ICONS || {}; };
  var icon = function (k) { var I = IC(); return '<svg class="ic" viewBox="0 0 64 64" aria-hidden="true">' + (I[k] || I.other || '') + '</svg>'; };
  var PHONE = root.getAttribute('data-phone') || '';

  // ---------- catalogue ----------
  var SIZES = ['Single', 'King single', 'Double', 'Queen', 'King'];
  var CATS = [['all', 'All'], ['custom', '+ Your own item'], ['living', 'Living'], ['bed', 'Bedroom'], ['kitchen', 'Kitchen & laundry'], ['office', 'Office'], ['outdoor', 'Outdoor'], ['boxes', 'Boxes & more']];
  var ITEMS = [
    { k: 'sofa', n: 'Sofa', c: 'living', v: ['2 seater', '3 seater', 'L-shape / modular', 'Sofa bed'] }, { k: 'armchair', n: 'Armchair / recliner', c: 'living' },
    { k: 'coffee', n: 'Coffee table', c: 'living' }, { k: 'tv', n: 'TV', c: 'living', v: ['Up to 55 inch', '65 inch and over'] }, { k: 'tvunit', n: 'TV unit', c: 'living' },
    { k: 'bookcase', n: 'Bookcase', c: 'living' }, { k: 'sidetable', n: 'Side table', c: 'living' }, { k: 'rug', n: 'Rug', c: 'living' }, { k: 'lamp', n: 'Floor lamp', c: 'living' },
    { k: 'mirror', n: 'Mirror', c: 'living' }, { k: 'buffet', n: 'Buffet / hutch', c: 'living' }, { k: 'ottoman', n: 'Ottoman', c: 'living' }, { k: 'shelving', n: 'Shelving unit', c: 'living' }, { k: 'artwork', n: 'Artwork', c: 'living' },
    { k: 'bed', n: 'Bed frame', c: 'bed', v: SIZES }, { k: 'mattress', n: 'Mattress', c: 'bed', v: SIZES }, { k: 'wardrobe', n: 'Wardrobe', c: 'bed', v: ['1 door', '2 door', '3 door or more'] },
    { k: 'dresser', n: 'Chest of drawers', c: 'bed' }, { k: 'bedside', n: 'Bedside table', c: 'bed' }, { k: 'cot', n: 'Cot', c: 'bed' }, { k: 'bunkbed', n: 'Bunk bed', c: 'bed' },
    { k: 'dining', n: 'Dining table', c: 'kitchen', v: ['4 seater', '6 seater', '8 seater or more'] }, { k: 'chair', n: 'Dining chair', c: 'kitchen' },
    { k: 'fridge', n: 'Fridge', c: 'kitchen', v: ['Bar fridge', 'Single door', 'Double / French door'] }, { k: 'washer', n: 'Washing machine', c: 'kitchen' },
    { k: 'dryer', n: 'Dryer', c: 'kitchen' }, { k: 'dishwasher', n: 'Dishwasher', c: 'kitchen' }, { k: 'microwave', n: 'Microwave', c: 'kitchen' }, { k: 'barstool', n: 'Bar stool', c: 'kitchen' },
    { k: 'desk', n: 'Desk', c: 'office', v: ['Standard', 'Corner / L-shape', 'Standing desk'] }, { k: 'officechair', n: 'Office chair', c: 'office' },
    { k: 'filing', n: 'Filing cabinet', c: 'office' }, { k: 'monitor', n: 'Computer / monitor', c: 'office' },
    { k: 'outdoor', n: 'Outdoor setting', c: 'outdoor' }, { k: 'bbq', n: 'BBQ', c: 'outdoor' }, { k: 'bike', n: 'Bike', c: 'outdoor' }, { k: 'treadmill', n: 'Treadmill / gym', c: 'outdoor' },
    { k: 'plant', n: 'Pot plant', c: 'outdoor' }, { k: 'pooltable', n: 'Pool table', c: 'outdoor' }, { k: 'pram', n: 'Pram', c: 'boxes' }, { k: 'box', n: 'Box', c: 'boxes', v: ['Small', 'Medium', 'Large'] }, { k: 'suitcase', n: 'Suitcase / bag', c: 'boxes' },
    { k: 'tub', n: 'Storage tub', c: 'boxes' }, { k: 'piano', n: 'Piano', c: 'boxes', v: ['Keyboard / digital', 'Upright piano'] }, { k: 'other', n: 'Something else', c: 'boxes', custom: true }
  ];
  var BYK = {}; ITEMS.forEach(function (i) { BYK[i.k] = i; });
  var HEAVY = ['fridge', 'washer', 'dryer', 'dishwasher', 'piano', 'wardrobe', 'treadmill', 'dresser', 'buffet', 'pooltable', 'bunkbed'];

  // ---------- state ----------
  var KEY = 'tx-quote-v1';
  var blank = function () { return { step: 1, from: null, to: null, unitA: '', unitB: '', route: null, items: {}, crew: '', ack: false, accessA: '', accessB: '', flightsA: 1, flightsB: 1, dis: false, date: '', time: '', name: '', phone: '', email: '', notes: '', terms: false }; };
  var st = blank();
  try { var saved = JSON.parse(localStorage.getItem(KEY) || 'null'); if (saved && typeof saved === 'object') { for (var k in saved) st[k] = saved[k]; } } catch (e) {}
  var save = function () { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };
  var count = function () { var n = 0; for (var id in st.items) n += st.items[id].q; return n; };
  var toastT; var toast = function (m) { var t = q('[data-q-toast]'); t.textContent = m; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('on'); }, 1800); };

  // ---------- open / close ----------
  var isOpen = false;
  function open(prefill) {
    if (!isOpen) { root.hidden = false; isOpen = true; document.documentElement.classList.add('txq-open'); try { history.pushState({ txq: 1 }, '', '#instant-quote'); } catch (e) {} }
    if (prefill && (prefill.from || prefill.to)) {
      st.step = 1; go(1, true);
      if (prefill.from && !st.from) { q('#txq-from').value = prefill.from; search('from', prefill.from); q('#txq-from').focus(); }
      else if (prefill.to && !st.to) { q('#txq-to').value = prefill.to; search('to', prefill.to); }
      if (prefill.to && !st.to) q('#txq-to').value = prefill.to;
    } else { go(st.step === 7 ? 1 : (st.step === 2 && !(st.from && st.to) ? 1 : st.step), true); }
  }
  function close() {
    if (!isOpen) return; root.hidden = true; isOpen = false; document.documentElement.classList.remove('txq-open');
    if (location.hash === '#instant-quote') { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {} }
  }
  q('[data-q-close]').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen) { if (q('[data-q-bsheet]').classList.contains('on')) closeSheet(); else close(); } });
  window.addEventListener('popstate', function () { if (!isOpen) return; if (st.step > 1 && st.step < 7) { goBack(); try { history.pushState({ txq: 1 }, '', '#instant-quote'); } catch (e) {} } else close(); });
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-tx-open-quote], a[href$="#instant-quote"]');
    if (!a) return; e.preventDefault(); open();
  });
  document.querySelectorAll('[data-tx-quickstart]').forEach(function (f) {
    f.addEventListener('submit', function (e) { e.preventDefault(); open({ from: (f.elements.from && f.elements.from.value || '').trim(), to: (f.elements.to && f.elements.to.value || '').trim() }); });
  });

  // ---------- navigation ----------
  var LBL = { 1: 'Step 1 of 5 · Route', 2: 'Step 1 of 5 · Check the route', 3: 'Step 2 of 5 · Items', 4: 'Step 3 of 5 · Crew and access', 5: 'Step 4 of 5 · Your details', 6: 'Step 5 of 5 · Review', 7: 'Quote request sent' };
  var PROG = [0, 1, 1, 2, 3, 4, 5, 6];
  var next = q('[data-q-next]');
  function go(n, back) {
    st.step = n; save();
    qa('.txq-s').forEach(function (s) { var on = +s.getAttribute('data-s') === n; s.hidden = !on; s.classList.toggle('back', !!back); });
    qa('.txq-prog i').forEach(function (b, i) { b.classList.toggle('on', i < PROG[n]); });
    q('[data-q-steplbl]').textContent = LBL[n];
    q('[data-q-back]').toggleAttribute('data-hide', n === 1 || n === 7);
    q('[data-q-foot]').hidden = n === 2 || n === 7;
    q('[data-q-sum]').hidden = n !== 3;
    next.textContent = n === 6 ? 'SEND BOOKING REQUEST' : n === 1 ? 'SEE ROUTE' : 'NEXT';
    if (n === 2) setTimeout(drawMap, 40);
    if (n === 3) { renderGrid(); renderList(); }
    if (n === 4) renderAccess();
    if (n === 5) ['name', 'phone', 'email', 'notes'].forEach(function (k) { q('#txq-' + k).value = st[k]; });
    if (n === 6) renderReview();
    validate();
    q('.txq-body').scrollTop = 0;
  }
  function goBack() { go(Math.max(1, st.step === 3 ? 2 : st.step === 2 ? 1 : st.step - 1), true); }
  q('[data-q-back]').addEventListener('click', goBack);
  function validate() {
    var ok = true, s = st.step;
    if (s === 1) ok = !!(st.from && st.to);
    if (s === 3) ok = count() > 0;
    if (s === 4) ok = !!(st.crew && (st.crew !== '1' || st.ack) && st.accessA && st.accessB && st.date);
    if (s === 6) ok = !!st.terms;
    if (s === 5) ok = st.name.trim().length > 1 && st.phone.replace(/\D/g, '').length >= 9 && /.+@.+\..+/.test(st.email.trim());
    next.disabled = !ok;
    q('[data-q-sumn]').textContent = count();
  }
  next.addEventListener('click', function () {
    if (next.disabled) return;
    var s = st.step;
    if (s === 1) return go(2); if (s === 3) return go(4); if (s === 4) return go(5); if (s === 5) return go(6); if (s === 6) return submit();
  });

  // ---------- step 1: addresses ----------
  var sugg = q('[data-q-sugg]'), active = 'from', seq = 0, timer;
  var pinSvg = '<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';
  function setAddr(key, val) {
    st[key] = val; st.route = null; q('#txq-' + key).value = val ? val.text : '';
    q('[data-row="' + key + '"]').classList.toggle('done', !!val); save(); validate();
  }
  function label(p) {
    var street = [p.housenumber, p.street].filter(Boolean).join(' ');
    var main = p.name && p.name !== street ? p.name : (street || p.name || '');
    var place = [p.locality || p.district || p.city, p.state === 'New South Wales' ? 'NSW' : p.state, p.postcode].filter(Boolean).join(' ');
    var sub = [main !== street ? street : '', place].filter(Boolean).join(', ');
    return { main: main || place, sub: main ? sub : '' };
  }
  function search(key, text) {
    var my = ++seq; active = key;
    sugg.innerHTML = [1, 2, 3].map(function () { return '<button type="button" disabled><span class="pi"></span><span style="flex:1"><div class="txq-skel" style="width:60%"></div><div class="txq-skel" style="width:85%;margin-top:7px;height:10px"></div></span></button>'; }).join('');
    sugg.hidden = false;
    fetch('https://photon.komoot.io/api/?limit=7&lang=en&lat=-33.87&lon=151.05&bbox=150.3,-34.5,151.6,-33.2&q=' + encodeURIComponent(text))
      .then(function (r) { return r.json(); }).then(function (j) {
        if (my !== seq) return;
        var seen = {}, feats = (j.features || []).filter(function (f) { return (f.properties.countrycode || '').toUpperCase() === 'AU'; }).filter(function (f) {
          var l = label(f.properties), k = l.main + '|' + l.sub; if (seen[k]) return false; seen[k] = 1; return true; }).slice(0, 5);
        sugg.innerHTML = '';
        if (!feats.length) { sugg.innerHTML = '<button type="button" disabled><span class="pi">' + pinSvg + '</span><span><b>No match yet</b><small>Try the suburb name</small></span></button>'; return; }
        feats.forEach(function (f) {
          var l = label(f.properties), b = document.createElement('button'); b.type = 'button';
          b.innerHTML = '<span class="pi">' + pinSvg + '</span><span><b>' + esc(l.main) + '</b><small>' + esc(l.sub) + '</small></span>';
          b.addEventListener('mousedown', function (e) { e.preventDefault(); });
          b.addEventListener('click', function () {
            setAddr(key, { text: l.sub ? l.main + ', ' + l.sub : l.main, lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0] }); sugg.hidden = true;
            var other = key === 'from' ? 'to' : 'from', oi = q('#txq-' + other);
            if (!st[other]) { oi.focus(); if (oi.value.trim().length >= 3) search(other, oi.value.trim()); } else q('#txq-' + key).blur();
          });
          sugg.appendChild(b);
        });
      }).catch(function () { sugg.innerHTML = '<button type="button" disabled><span class="pi">' + pinSvg + '</span><span><b>Address search is offline</b><small>Check your connection, or call us</small></span></button>'; });
  }
  ['from', 'to'].forEach(function (key) {
    var inp = q('#txq-' + key);
    inp.addEventListener('focus', function () { active = key; });
    inp.addEventListener('input', function () {
      if (st[key]) { st[key] = null; q('[data-row="' + key + '"]').classList.remove('done'); validate(); }
      clearTimeout(timer); var v = inp.value.trim();
      if (v.length < 3) { sugg.hidden = true; return; }
      timer = setTimeout(function () { search(key, v); }, 220);
    });
  });
  q('[data-q-swap]').addEventListener('click', function () { var a = st.from, b = st.to; setAddr('from', b); setAddr('to', a); var u = st.unitA; st.unitA = st.unitB; st.unitB = u; q('[data-q-unita]').value = st.unitA; q('[data-q-unitb]').value = st.unitB; save(); });
  q('[data-q-unitbtn]').addEventListener('click', function () { var u = q('[data-q-unit]'); u.hidden = !u.hidden; if (!u.hidden) q('[data-q-unita]').focus(); });
  q('[data-q-unita]').addEventListener('input', function (e) { st.unitA = e.target.value; save(); });
  q('[data-q-unitb]').addEventListener('input', function (e) { st.unitB = e.target.value; save(); });
  q('[data-q-locate]').addEventListener('click', function () {
    if (!navigator.geolocation) return toast('Location is not available on this device');
    toast('Finding you…');
    navigator.geolocation.getCurrentPosition(function (p) {
      fetch('https://photon.komoot.io/reverse?lat=' + p.coords.latitude + '&lon=' + p.coords.longitude + '&lang=en').then(function (r) { return r.json(); }).then(function (j) {
        var f = j.features && j.features[0]; if (!f) throw 0; var l = label(f.properties);
        setAddr('from', { text: l.sub ? l.main + ', ' + l.sub : l.main, lat: p.coords.latitude, lon: p.coords.longitude }); toast('Pickup set to your location');
      }).catch(function () { toast('Could not find an address here'); });
    }, function () { toast('Location permission was declined'); }, { enableHighAccuracy: true, timeout: 9000 });
  });

  // ---------- step 2: map ----------
  var map, layer;
  function pin(t, c) { return window.L.divIcon({ className: '', iconSize: [34, 44], iconAnchor: [17, 42], html: '<svg width="34" height="44" viewBox="0 0 34 44" style="stroke:none"><path d="M17 43s15-14.5 15-26A15 15 0 0 0 2 17c0 11.5 15 26 15 26z" fill="' + c + '" stroke="#fff" stroke-width="2.5"/><text x="17" y="22" text-anchor="middle" font-family="system-ui" font-weight="800" font-size="14" fill="#fff" stroke="none">' + t + '</text></svg>' }); }
  function snap(p) {
    return fetch('https://router.project-osrm.org/nearest/v1/driving/' + p.lon + ',' + p.lat + '?number=10').then(function (r) { return r.json(); }).then(function (j) {
      var w = (j.waypoints || []).filter(function (w) { return !/tunnel|motorway|freeway|tollway/i.test(w.name || ''); })[0]; return w ? w.location : [p.lon, p.lat];
    }).catch(function () { return [p.lon, p.lat]; });
  }
  function drawMap() {
    if (!st.from || !st.to) return go(1, true);
    if (!window.L) return setTimeout(drawMap, 200);
    var L = window.L;
    q('[data-q-fa]').textContent = st.from.text; q('[data-q-fb]').textContent = st.to.text;
    if (!map) {
      map = L.map(q('[data-q-map]'), { zoomControl: false });
      L.control.zoom({ position: 'topright' }).addTo(map);
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, attribution: 'Tiles &copy; Esri, HERE, Garmin, &copy; OpenStreetMap' }).addTo(map);
    }
    map.invalidateSize();
    if (layer) layer.remove(); layer = L.layerGroup().addTo(map);
    var a = [st.from.lat, st.from.lon], b = [st.to.lat, st.to.lon], pad = { paddingTopLeft: [30, 120], paddingBottomRight: [30, 210], maxZoom: 15 };
    map.fitBounds(L.latLngBounds([a, b]), pad);
    q('[data-q-km]').textContent = '…'; q('[data-q-min]').textContent = '…';
    var done = function () { L.marker(a, { icon: pin('A', '#17357f') }).addTo(layer); L.marker(b, { icon: pin('B', '#e1261c') }).addTo(layer); };
    var draw = function () {
      L.polyline(st.route.line, { color: '#fff', weight: 10, opacity: .95, className: 'txq-route' }).addTo(layer);
      L.polyline(st.route.line, { color: '#17357f', weight: 5.5, className: 'txq-route' }).addTo(layer);
      map.fitBounds(L.latLngBounds(st.route.line), pad);
      q('[data-q-km]').textContent = st.route.km + ' km'; q('[data-q-min]').textContent = st.route.min + ' min'; done();
    };
    if (st.route) return draw();
    Promise.all([snap(st.from), snap(st.to)]).then(function (s) {
      return fetch('https://router.project-osrm.org/route/v1/driving/' + s[0][0] + ',' + s[0][1] + ';' + s[1][0] + ',' + s[1][1] + '?overview=full&geometries=geojson').then(function (r) { return r.json(); });
    }).then(function (j) {
      var r = j.routes[0]; st.route = { km: +(r.distance / 1000).toFixed(1), min: Math.round(r.duration / 60), line: r.geometry.coordinates.map(function (c) { return [+c[1].toFixed(5), +c[0].toFixed(5)]; }) };
      save(); draw();
    }).catch(function () {
      L.polyline([a, b], { color: '#17357f', weight: 4, dashArray: '8 10' }).addTo(layer);
      q('[data-q-km]').textContent = (map.distance(a, b) / 1000).toFixed(1) + ' km'; q('[data-q-min]').textContent = '–'; done();
    });
  }
  q('[data-q-confirm]').addEventListener('click', function () { go(3); });

  // ---------- step 3: items ----------
  var cat = 'all', cq = 1, grid = q('[data-q-grid]');
  q('[data-q-cats]').innerHTML = CATS.map(function (c) { return '<button type="button" data-c="' + c[0] + '" class="' + (c[0] === 'all' ? 'on' : '') + (c[0] === 'custom' ? ' own' : '') + '">' + c[1] + '</button>'; }).join('');
  q('[data-q-cats]').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; cat = b.getAttribute('data-c'); q('[data-q-find]').value = '';
    qa('[data-q-cats] button').forEach(function (x) { x.classList.toggle('on', x === b); }); renderGrid(); if (cat === 'custom') q('[data-q-custom]').focus(); });
  q('[data-q-find]').addEventListener('input', function () { if (this.value) { cat = 'all'; qa('[data-q-cats] button').forEach(function (x) { x.classList.toggle('on', x.getAttribute('data-c') === 'all'); }); } renderGrid(); });
  var qtyOf = function (k) { var n = 0; for (var id in st.items) if (st.items[id].k === k) n += st.items[id].q; return n; };
  function addItem(id, k, n, v, d) {
    var cur = st.items[id] || { k: k, n: n, v: v || '', q: 0 }; cur.q = Math.max(0, Math.min(99, cur.q + d));
    if (cur.q === 0) delete st.items[id]; else st.items[id] = cur; save(); renderTiles(); renderList(); validate();
  }
  function renderGrid() {
    var t = q('[data-q-find]').value.trim().toLowerCase();
    q('.txq-custom').classList.toggle('hl', cat === 'custom');
    if (cat === 'custom') {
      var own = Object.keys(st.items).filter(function (id) { return id.indexOf('custom:') === 0; });
      grid.innerHTML = '<div class="txq-own"><b>Can\u2019t see your item?</b><span>Small or large, we move it all. Type it in the box above, set how many, then tap Add.</span></div>' +
        own.map(function (id) { var it = st.items[id]; return '<div class="txq-tile on" role="button" tabindex="0" data-own="' + esc(id) + '"><span class="q">' + it.q + '</span>' + icon('other') + '<div class="nm">' + esc(it.n) + '</div><div class="more">Tap to add one more</div></div>'; }).join('');
      return;
    }
    var list = ITEMS.filter(function (i) { return (cat === 'all' || i.c === cat) && (!t || (i.n + ' ' + (i.v || []).join(' ')).toLowerCase().indexOf(t) > -1); });
    grid.innerHTML = list.length ? list.map(function (i) { return '<div class="txq-tile" role="button" tabindex="0" data-k="' + i.k + '"><span class="q"></span>' + icon(i.k) + '<div class="nm">' + i.n + '</div><div class="more">' + (i.v ? 'Choose size' : '&nbsp;') + '</div></div>'; }).join('')
      : '<div class="txq-empty">No match. Add “' + esc(q('[data-q-find]').value) + '” as your own item above.</div>';
    renderTiles();
  }
  function renderTiles() { qa('.txq-tile').forEach(function (t) { var n = qtyOf(t.getAttribute('data-k')); t.classList.toggle('on', n > 0); t.querySelector('.q').textContent = n; }); }
  grid.addEventListener('click', function (e) {
    var t = e.target.closest('.txq-tile'); if (!t) return;
    var oid = t.getAttribute('data-own'); if (oid) { var o = st.items[oid]; if (o) { addItem(oid, o.k, o.n, o.v, 1); renderGrid(); } return; }
    var it = BYK[t.getAttribute('data-k')];
    if (it.custom) { q('[data-q-custom]').focus(); return toast('Type the item name, then tap Add'); }
    if (it.v) return openSheet(it);
    addItem(it.k, it.k, it.n, '', 1); if (navigator.vibrate) navigator.vibrate(8);
  });
  grid.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('txq-tile')) { e.preventDefault(); e.target.click(); } });
  function renderList() {
    var ids = Object.keys(st.items), n = count();
    q('[data-q-lh]').textContent = ids.length ? 'Your list · ' + n + ' item' + (n === 1 ? '' : 's') : 'Your list';
    if (!ids.length) { q('[data-q-list]').innerHTML = '<div class="txq-none">Nothing added yet.</div>'; return; }
    q('[data-q-list]').innerHTML = ids.map(function (id) { var it = st.items[id];
      return '<div class="txq-li" data-id="' + esc(id) + '">' + icon(it.k) + '<div class="t">' + esc(it.n) + (it.v ? '<small>' + esc(it.v) + '</small>' : '') + '</div>' +
        '<div class="txq-step txq-step--sm"><button type="button" data-d="-1" aria-label="Fewer">−</button><span>' + it.q + '</span><button type="button" data-d="1" aria-label="More">+</button></div>' +
        '<button class="rm" type="button" aria-label="Remove"><svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13"/></svg></button></div>'; }).join('');
  }
  q('[data-q-list]').addEventListener('click', function (e) {
    var row = e.target.closest('.txq-li'), b = e.target.closest('button'); if (!row || !b) return; var id = row.getAttribute('data-id'), it = st.items[id];
    if (b.classList.contains('rm')) addItem(id, it.k, it.n, it.v, -it.q); else addItem(id, it.k, it.n, it.v, +b.getAttribute('data-d'));
  });
  q('[data-q-cm]').addEventListener('click', function () { cq = Math.max(1, cq - 1); q('[data-q-cq]').textContent = cq; });
  q('[data-q-cp]').addEventListener('click', function () { cq = Math.min(99, cq + 1); q('[data-q-cq]').textContent = cq; });
  function addCustom() {
    var v = q('[data-q-custom]').value.trim(); if (!v) { q('[data-q-custom]').focus(); return toast('Type an item name first'); }
    var n = v.charAt(0).toUpperCase() + v.slice(1); addItem('custom:' + n.toLowerCase(), 'other', n, '', cq);
    toast('Added ' + cq + ' × ' + n); q('[data-q-custom]').value = ''; cq = 1; q('[data-q-cq]').textContent = 1; if (cat === 'custom') renderGrid();
  }
  q('[data-q-cadd]').addEventListener('click', addCustom);
  q('[data-q-custom]').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); addCustom(); } });
  function openSheet(it) {
    var sh = q('[data-q-bsheet]');
    var draw = function () {
      sh.innerHTML = '<div class="txq-grab"></div><div class="hd">' + icon(it.k) + '<div><b>' + it.n + '</b><small>Choose the size and how many</small></div></div>' +
        it.v.map(function (v) { var id = it.k + ':' + v, n = st.items[id] ? st.items[id].q : 0;
          return '<div class="txq-vrow"><span>' + v + '</span><div class="txq-step txq-step--sm" data-v="' + esc(v) + '"><button type="button" data-d="-1" aria-label="Fewer">−</button><span>' + n + '</span><button type="button" data-d="1" aria-label="More">+</button></div></div>'; }).join('') +
        '<button class="txq-cta txq-cta--block" type="button" style="margin-top:16px" data-q-shdone>DONE</button>';
      sh.querySelectorAll('.txq-step').forEach(function (s) { s.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; addItem(it.k + ':' + s.getAttribute('data-v'), it.k, it.n, s.getAttribute('data-v'), +b.getAttribute('data-d')); draw(); }); });
      sh.querySelector('[data-q-shdone]').addEventListener('click', closeSheet);
    };
    draw(); q('[data-q-scrim]').classList.add('on'); sh.classList.add('on');
  }
  function closeSheet() { q('[data-q-scrim]').classList.remove('on'); q('[data-q-bsheet]').classList.remove('on'); }
  q('[data-q-scrim]').addEventListener('click', closeSheet);


  // ---------- hourly price estimate ----------
  var R = { f: +root.getAttribute('data-rate-first') || 99, b: +root.getAttribute('data-rate-block') || 52,
            af: +root.getAttribute('data-after-first') || 198, ab: +root.getAttribute('data-after-block') || 104 };
  // minutes to load and unload one item (both ends together), one mover with the customer helping
  var MIN = { sofa: 12, armchair: 8, coffee: 5, tv: 6, tvunit: 8, bookcase: 8, sidetable: 3, rug: 3, lamp: 3, mirror: 4, artwork: 3, buffet: 15, ottoman: 4, shelving: 8,
    bed: 12, mattress: 6, wardrobe: 15, dresser: 10, bedside: 3, cot: 8, bunkbed: 18, dining: 10, chair: 2, fridge: 12, washer: 12, dryer: 10, dishwasher: 12,
    microwave: 3, barstool: 2, desk: 10, officechair: 3, filing: 8, monitor: 3, outdoor: 12, bbq: 12, bike: 4, treadmill: 18, plant: 3, pooltable: 40, pram: 3,
    box: 2, suitcase: 1.5, tub: 2, piano: 12, other: 8 };
  function itemMin(it) {
    var m = MIN[it.k] || 8, v = it.v || '';
    if (it.k === 'sofa') m = { '3 seater': 14, 'L-shape / modular': 22, 'Sofa bed': 18 }[v] || m;
    if (it.k === 'tv' && /65/.test(v)) m = 8;
    if ((it.k === 'bed' || it.k === 'mattress') && /^(Queen|King)$/.test(v)) m += 3;
    if (it.k === 'wardrobe') m = { '1 door': 10, '3 door or more': 22 }[v] || m;
    if (it.k === 'dining' && /8/.test(v)) m = 15;
    if (it.k === 'fridge') m = { 'Bar fridge': 5, 'Double / French door': 18 }[v] || m;
    if (it.k === 'desk' && /Corner/.test(v)) m = 15;
    if (it.k === 'piano' && /Upright/.test(v)) m = 30;
    if (it.k === 'box') m = { Small: 1.5, Large: 3 }[v] || 2;
    return m;
  }
  function isAfter() {
    if (st.time === 'Evening') return true;
    if (!st.date) return false;
    var p = st.date.split('-'), day = new Date(+p[0], p[1] - 1, +p[2]).getDay();
    return day === 0 || day === 6;
  }
  var money = function (n) { return '$' + Math.round(n); };
  var hm = function (m) { m = Math.round(m / 5) * 5; var h = Math.floor(m / 60), r = m % 60; return (h ? h + ' hr' + (r ? ' ' : '') : '') + (r ? r + ' min' : ''); };
  function estimate() {
    var h = 0; for (var id in st.items) h += itemMin(st.items[id]) * st.items[id].q;
    var endF = function (e) { var a = st['access' + e]; return a === 'Stairs' ? 1 + 0.25 * st['flights' + e] : a === 'Lift' ? 1.1 : 1; };
    h = h / 2 * endF('A') + h / 2 * endF('B');
    if (st.crew === '2') h *= 0.7;
    if (st.dis) h += 20;
    var mins = Math.max(30, h + (st.route ? st.route.min * 1.3 : 25));
    var blocks = Math.ceil(mins / 30), after = isAfter(), f = after ? R.af : R.f, b = after ? R.ab : R.b;
    var lo = f + (blocks - 1) * b;
    return { mins: mins, blocks: blocks, lo: lo, hi: lo + b, after: after, f: f, b: b };
  }
  var estTxt = function (e) { return money(e.lo) + ' to ' + money(e.hi); };
  function renderEst() {
    var el = q('[data-q-est]'); if (!el) return;
    if (!count()) { el.innerHTML = ''; return; }
    var e = estimate();
    el.innerHTML = '<div class="txq-estc"><span class="lb">Estimated price</span><b>' + estTxt(e) + '</b>' +
      '<span class="d">About ' + hm(e.mins) + ' including the drive. ' + (e.after ? 'Weekend / evening rate' : 'Weekday rate') + ': ' + money(e.f) + ' for the first 30 min, then ' + money(e.b) + ' per extra 30 min.' +
      (st.crew === '2' ? ' Plus the second-mover fee, which we confirm by text.' : '') + '</span></div>';
  }
  function howHtml(e) {
    return '<div class="txq-card txq-how"><b class="t">How the price works</b><ol>' +
      '<li><b>' + money(R.f) + ' covers the first 30 minutes</b> on weekdays. After that it is ' + money(R.b) + ' for each extra 30 minutes, or part of it.</li>' +
      '<li><b>Weekends, public holidays and evenings after 5pm</b> are ' + money(R.af) + ' for the first 30 minutes, then ' + money(R.ab) + ' for each extra 30 minutes.</li>' +
      '<li><b>The clock starts</b> when we arrive at the pickup and stops when the last item is placed at the drop-off. You pay for the actual time, so the estimate is a guide.</li>' +
      '<li><b>1 mover:</b> you help load and unload the heavy items. <b>2 movers:</b> an extra fee, which we confirm by text before the job.</li>' +
      '<li><b>Extras at cost:</b> tolls, paid parking, and waiting time if the items are not ready.</li>' +
      '<li><b>Nothing to pay now.</b> We text you to confirm the time before the job.</li></ol></div>';
  }

  // ---------- step 4: crew, access, time ----------
  function crewAdvice() {
    var its = Object.keys(st.items).map(function (id) { return st.items[id]; });
    var heavy = its.filter(function (it) { return HEAVY.indexOf(it.k) > -1 || /L-shape|French|King|Queen|3 door|Upright|8 seater/.test(it.v || ''); }).map(function (it) { return it.n.toLowerCase(); });
    var stairs = st.accessA === 'Stairs' || st.accessB === 'Stairs';
    if (heavy.length || stairs || count() >= 6) return { rec: '2', why: heavy.length ? 'We recommend two movers for the ' + heavy.filter(function (v, i, a) { return a.indexOf(v) === i; }).slice(0, 2).join(' and ') + '.' : stairs ? 'We recommend two movers because of the stairs.' : 'We recommend two movers for this many items.' };
    return { rec: '1', why: 'One mover and a big van is usually enough if you can lend a hand.' };
  }
  var ACC = [['Ground floor', '<path d="M3 20h18M5 20V10l7-5 7 5v10"/><path d="M10 20v-5h4v5"/>'], ['Stairs', '<path d="M3 20h5v-4h4v-4h4V8h5"/>'], ['Lift', '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 9l3-3 3 3M9 15l3 3 3-3"/>']];
  function iso(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function renderAccess() {
    var adv = crewAdvice();
    var C = [['1', 'mover1', '1 mover + big van', 'Like most single-item jobs. You help load and unload the heavy items.', 'From $' + R.f + ' for 30 min'],
             ['2', 'mover2', '2 movers + big van', 'We do all the lifting, wrapping and carrying.', 'Extra fee, confirmed by text']];
    q('[data-q-crew]').innerHTML = C.map(function (c) { return '<button type="button" class="txq-crewc ' + (st.crew === c[0] ? 'on' : '') + '" data-v="' + c[0] + '">' + (adv.rec === c[0] ? '<span class="rec">RECOMMENDED</span>' : '') + icon(c[1]) +
      '<div><b>' + c[2] + '</b><span class="d">' + c[3] + '</span><span class="fee">' + c[4] + '</span></div><span class="radio"></span></button>'; }).join('');
    q('[data-q-crewhint]').textContent = adv.why;
    q('[data-q-ackwrap]').hidden = st.crew !== '1'; q('[data-q-ack]').checked = !!st.ack;
    q('[data-q-acca]').textContent = st.from ? st.from.text : ''; q('[data-q-accb]').textContent = st.to ? st.to.text : '';
    ['A', 'B'].forEach(function (end) {
      var seg = q('[data-q-seg="' + end + '"]'), k = 'access' + end;
      seg.innerHTML = ACC.map(function (a) { return '<button type="button" class="' + (st[k] === a[0] ? 'on' : '') + '" data-a="' + a[0] + '"><svg viewBox="0 0 24 24">' + a[1] + '</svg>' + a[0] + '</button>'; }).join('');
      var fl = q('[data-q-fl="' + end + '"]'); fl.hidden = st[k] !== 'Stairs'; fl.querySelector('span:nth-child(2), .txq-step span').textContent = st['flights' + end];
    });
    q('[data-q-dis]').classList.toggle('on', !!st.dis);
    var now = new Date(), html = '';
    for (var i = 0; i < 14; i++) { var d = new Date(now); d.setDate(now.getDate() + i); var v = iso(d);
      html += '<button type="button" data-d="' + v + '" class="' + (st.date === v ? 'on' : '') + '"><small>' + (i === 0 ? 'Today' : i === 1 ? 'Tmrw' : d.toLocaleDateString('en-AU', { weekday: 'short' })) + '</small><b>' + d.getDate() + '</b><span>' + d.toLocaleDateString('en-AU', { month: 'short' }) + '</span></button>'; }
    q('[data-q-dates]').innerHTML = html;
    var T = [['Morning', '7am to 11am'], ['Midday', '11am to 2pm'], ['Afternoon', '2pm to 5pm'], ['Evening', '5pm to 7pm, after-hours rate'], ['Flexible', 'Any time']];
    if (st.date === iso(now)) T.unshift(['ASAP', 'Next available today']);
    q('[data-q-times]').innerHTML = T.map(function (t) { return '<button type="button" class="' + (st.time === t[0] ? 'on' : '') + '" data-t="' + t[0] + '"><b>' + t[0] + '</b><small>' + t[1] + '</small></button>'; }).join('');
    renderEst();
  }
  q('[data-q-crew]').addEventListener('click', function (e) { var b = e.target.closest('.txq-crewc'); if (!b) return; st.crew = b.getAttribute('data-v'); save(); renderAccess(); validate(); });
  q('[data-q-ack]').addEventListener('change', function () { st.ack = this.checked; save(); validate(); });
  ['A', 'B'].forEach(function (end) {
    q('[data-q-seg="' + end + '"]').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; st['access' + end] = b.getAttribute('data-a'); save(); renderAccess(); validate(); });
    q('[data-q-fl="' + end + '"] .txq-step').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return;
      st['flights' + end] = Math.max(1, Math.min(10, st['flights' + end] + (b.textContent === '+' ? 1 : -1))); save(); renderAccess(); });
  });
  q('[data-q-dis]').addEventListener('click', function () { st.dis = !st.dis; save(); renderAccess(); });
  q('[data-q-dates]').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; st.date = b.getAttribute('data-d'); if (st.time === 'ASAP' && st.date !== iso(new Date())) st.time = ''; save(); renderAccess(); validate(); });
  q('[data-q-times]').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; st.time = b.getAttribute('data-t'); save(); renderAccess(); });

  // ---------- step 5: details ----------
  ['name', 'phone', 'email', 'notes'].forEach(function (k) { q('#txq-' + k).addEventListener('input', function () { st[k] = this.value; save(); validate(); }); });

  // ---------- step 6: review + submit ----------
  var crewTxt = function () { return { '1': '1 mover + big van (customer helps)', '2': '2 movers + big van (extra fee)' }[st.crew] || 'Not chosen'; };
  var accTxt = function (e) { return st['access' + e] === 'Stairs' ? 'Stairs, ' + st['flights' + e] + ' flight' + (st['flights' + e] > 1 ? 's' : '') : (st['access' + e] || 'Not chosen'); };
  var fmtDate = function (v) { if (!v) return 'Not chosen'; var p = v.split('-'); return new Date(+p[0], p[1] - 1, +p[2]).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' }); };
  var itemsTxt = function () { return Object.keys(st.items).map(function (id) { var it = st.items[id]; return it.q + ' x ' + it.n + (it.v ? ' (' + it.v + ')' : ''); }); };
  function renderReview() {
    var its = Object.keys(st.items).map(function (id) { return st.items[id]; });
    var row = function (l, v) { return '<div class="r"><span class="mu">' + l + '</span><span>' + v + '</span></div>'; };
    var e = estimate();
    q('[data-q-review]').innerHTML =
      '<div class="txq-estc txq-estc--big"><span class="lb">Estimated price</span><b>' + estTxt(e) + '</b><span class="d">About ' + hm(e.mins) + ' including the drive, ' + (e.after ? 'weekend / evening rate' : 'weekday rate') + (st.crew === '2' ? ', plus the second-mover fee' : '') + '.</span></div>' + howHtml(e) +
      '<label class="txq-ack txq-terms"><input type="checkbox" data-q-terms' + (st.terms ? ' checked' : '') + '><span>I understand the price is by time, from ' + money(e.f) + ' for the first 30 minutes, and the final amount depends on the actual time.</span></label>' +
      '<div class="txq-card txq-rv"><div class="h"><b>Route</b><button type="button" data-go="1">Edit</button></div>' +
        '<div class="r"><span class="txq-pin txq-pin--a" style="width:22px;height:22px;font-size:11px">A</span><span>' + esc(st.from.text) + (st.unitA ? '<br><small>' + esc(st.unitA) + '</small>' : '') + '</span></div>' +
        '<div class="r"><span class="txq-pin txq-pin--b" style="width:22px;height:22px;font-size:11px">B</span><span>' + esc(st.to.text) + (st.unitB ? '<br><small>' + esc(st.unitB) + '</small>' : '') + '</span></div>' +
        (st.route ? '<div class="r"><span class="mu">Distance</span><span>' + st.route.km + ' km, about ' + st.route.min + ' min</span></div>' : '') + '</div>' +
      '<div class="txq-card txq-rv"><div class="h"><b>Items · ' + count() + '</b><button type="button" data-go="3">Edit</button></div><div>' +
        its.map(function (it) { return '<span class="txq-pill">' + it.q + ' × ' + esc(it.n) + (it.v ? ' · ' + esc(it.v) : '') + '</span>'; }).join('') + '</div></div>' +
      '<div class="txq-card txq-rv"><div class="h"><b>Crew, access and time</b><button type="button" data-go="4">Edit</button></div>' +
        row('Crew', crewTxt()) + row('Pickup', accTxt('A')) + row('Drop-off', accTxt('B')) + row('When', fmtDate(st.date) + (st.time ? ', ' + st.time.toLowerCase() : '')) + (st.dis ? row('Extra', 'Dismantling / assembly') : '') + '</div>' +
      '<div class="txq-card txq-rv"><div class="h"><b>Your details</b><button type="button" data-go="5">Edit</button></div>' +
        row('Name', esc(st.name)) + row('Mobile', esc(st.phone)) + row('Email', esc(st.email)) + (st.notes ? row('Notes', esc(st.notes)) : '') + '</div>';
    qa('[data-go]').forEach(function (b) { b.addEventListener('click', function () { go(+b.getAttribute('data-go'), true); }); });
    q('[data-q-terms]').addEventListener('change', function () { st.terms = this.checked; save(); validate(); });
  }
  function submit() {
    var f = q('[data-q-form]'); if (!f) return;
    var set = function (n, v) { var el = f.querySelector('[data-f="' + n + '"]'); if (el) el.value = v; };
    var pickup = st.from.text + (st.unitA ? ' (' + st.unitA + ')' : ''), dropoff = st.to.text + (st.unitB ? ' (' + st.unitB + ')' : '');
    var access = 'Pickup: ' + accTxt('A') + ' | Drop-off: ' + accTxt('B');
    var when = fmtDate(st.date) + (st.time ? ', ' + st.time : '');
    set('name', st.name.trim()); set('email', st.email.trim()); set('phone', st.phone.trim()); set('pickup', pickup); set('dropoff', dropoff);
    set('items', itemsTxt().join(', ')); set('crew', crewTxt()); set('access', access); set('when', when); set('date', st.date);
    var e = estimate(), estLine = estTxt(e) + ' (about ' + hm(e.mins) + ', ' + (e.after ? 'weekend / evening' : 'weekday') + ' rate' + (st.crew === '2' ? ', plus second-mover fee' : '') + ')'; set('estimate', estLine);
    set('body', ['Items: ' + itemsTxt().join(', '), 'Crew: ' + crewTxt() + (st.crew === '1' ? ', customer agreed to help load and unload' : ''), 'Access: ' + access,
      'When: ' + when, 'Estimate shown: ' + estLine, 'Customer agreed to the hourly terms', st.dis ? 'Needs dismantling / assembly' : '', st.route ? 'Route: ' + st.route.km + ' km, about ' + st.route.min + ' min drive' : '', st.notes ? 'Notes: ' + st.notes.trim() : ''].filter(Boolean).join('\n'));
    next.disabled = true; next.textContent = 'SENDING…';
    try { sessionStorage.setItem('tx-quote-sent', '1'); } catch (e) {}
    f.submit();
  }

  // ---------- start ----------
  if (st.from) setAddr('from', st.from); if (st.to) setAddr('to', st.to);
  q('[data-q-unita]').value = st.unitA || ''; q('[data-q-unitb]').value = st.unitB || ''; if (st.unitA || st.unitB) q('[data-q-unit]').hidden = false;
  var posted = q('[data-q-posted]'), sent = false; try { sent = sessionStorage.getItem('tx-quote-sent') === '1'; } catch (e) {}
  if (posted && sent) { try { sessionStorage.removeItem('tx-quote-sent'); localStorage.removeItem(KEY); } catch (e) {} st = blank(); open(); go(7); }
  else if (q('[data-q-errors]') && sent) { try { sessionStorage.removeItem('tx-quote-sent'); } catch (e) {} open(); go(5); toast(q('[data-q-errors]').textContent || 'Please check your details'); }
  else if (location.hash === '#instant-quote') open();
})();
