/* Titan Express Quote form: no price shown, the customer sends details and optional photos and gets a price by text.
   Made from the TX form (tx-quote.js) on 2026-11-25; that one stays as it is. Plain JS, no build step.
   Opens from [data-tq-open-quote], a [data-tq-quickstart] form, or any link ending in #quote-form. Submits through Shopify's contact form. */
(function () {
  var root = document.getElementById('tqf');
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
  var KEY = 'tq-quote-v1';
  var blank = function () { return { step: 1, from: null, to: null, unitA: '', unitB: '', route: null, items: {}, photos: [], crew: '', accessA: 'No stairs', accessB: 'No stairs', flightsA: 1, flightsB: 1, dis: false, today: true, awayA: false, awayB: false, cnA: '', cpA: '', cnB: '', cpB: '', date: '', time: '', name: '', phone: '', email: '', notes: '' }; };
  var st = blank();
  try { var saved = JSON.parse(localStorage.getItem(KEY) || 'null'); if (saved && typeof saved === 'object') { for (var k in saved) st[k] = saved[k]; } } catch (e) {}
  if (!Array.isArray(st.photos)) st.photos = [];
  var save = function () { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };
  var count = function () { var n = 0; for (var id in st.items) n += st.items[id].q; return n; };
  var toastT; var toast = function (m) { var t = q('[data-q-toast]'); t.textContent = m; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('on'); }, 1800); };

  // ---------- open / close ----------
  var isOpen = false;
  function open(prefill) {
    if (!isOpen) { root.hidden = false; isOpen = true; document.documentElement.classList.add('tqf-open'); try { history.pushState({ tqf: 1 }, '', '#quote-form'); } catch (e) {} }
    if (prefill && (prefill.from || prefill.to)) {
      st.step = 1; go(1, true);
      if (prefill.from && !st.from) { q('#tqf-from').value = prefill.from; search('from', prefill.from); q('#tqf-from').focus(); }
      else if (prefill.to && !st.to) { q('#tqf-to').value = prefill.to; search('to', prefill.to); }
      if (prefill.to && !st.to) q('#tqf-to').value = prefill.to;
    } else { go(st.step === 7 ? 1 : (st.step === 2 && !(st.from && st.to) ? 1 : st.step), true); }
  }
  function close() {
    if (!isOpen) return; root.hidden = true; isOpen = false; document.documentElement.classList.remove('tqf-open');
    if (location.hash === '#quote-form') { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {} }
  }
  q('[data-q-close]').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen) { if (q('[data-q-bsheet]').classList.contains('on')) closeSheet(); else close(); } });
  window.addEventListener('popstate', function () { if (!isOpen) return; if (st.step > 1 && st.step < 7) { goBack(); try { history.pushState({ tqf: 1 }, '', '#quote-form'); } catch (e) {} } else close(); });
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-tq-open-quote], a[href$="#quote-form"]');
    if (!a) return; e.preventDefault(); open();
  });
  // ---------- hero card (tq-book): suburb suggestions as you type, then straight to the route map ----------
  function lookup(text, limit) {
    return fetch('https://photon.komoot.io/api/?limit=' + (limit || 7) + '&lang=en&lat=-33.87&lon=151.05&bbox=150.3,-34.5,151.6,-33.2&q=' + encodeURIComponent(text))
      .then(function (r) { return r.json(); }).then(function (res) {
        var seen = {};
        return (res.features || []).filter(function (f) { return (f.properties.countrycode || '').toUpperCase() === 'AU'; }).map(function (f) {
          var l = label(f.properties); return { main: l.main, sub: l.sub, text: l.sub ? l.main + ', ' + l.sub : l.main, lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0] };
        }).filter(function (a) { var k = a.main + '|' + a.sub; if (seen[k]) return false; seen[k] = 1; return true; });
      });
  }
  var addrOf = function (a) { return a ? { text: a.text, lat: a.lat, lon: a.lon } : null; };
  document.querySelectorAll('[data-tq-quickstart]').forEach(function (f) {
    var picked = { from: null, to: null }, seqs = { from: 0, to: 0 }, timers = {};
    var btn = f.querySelector('[type=submit]'), lbl = f.querySelector('[data-tq-golbl]'), lblTxt = lbl ? lbl.textContent : '';
    ['from', 'to'].forEach(function (key) {
      var inp = f.elements[key]; if (!inp) return;
      var wrap = inp.closest('[data-tq-field]'), box = wrap && wrap.querySelector('[data-tq-sugg]'); if (!box) return;
      var hide = function () { box.hidden = true; inp.setAttribute('aria-expanded', 'false'); };
      var show = function (list) {
        box.innerHTML = '';
        if (!list.length) box.innerHTML = '<button type="button" disabled>' + pinSvg + '<span><b>No match yet</b><small>Try the suburb name</small></span></button>';
        list.slice(0, 5).forEach(function (a) {
          var b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'option');
          b.innerHTML = pinSvg + '<span><b>' + esc(a.main) + '</b><small>' + esc(a.sub) + '</small></span>';
          b.addEventListener('mousedown', function (e) { e.preventDefault(); });
          b.addEventListener('click', function () {
            picked[key] = a; inp.value = a.text; wrap.classList.add('is-set'); hide();
            var other = f.elements[key === 'from' ? 'to' : 'from'];
            if (other && !picked[key === 'from' ? 'to' : 'from'] && !other.value.trim()) other.focus(); else inp.blur();
          });
          box.appendChild(b);
        });
        box.hidden = false; inp.setAttribute('aria-expanded', 'true');
      };
      inp.addEventListener('input', function () {
        picked[key] = null; wrap.classList.remove('is-set'); clearTimeout(timers[key]);
        var v = inp.value.trim(); if (v.length < 3) return hide();
        timers[key] = setTimeout(function () { var my = ++seqs[key]; lookup(v).then(function (list) { if (my === seqs[key] && document.activeElement === inp) show(list); }).catch(hide); }, 200);
      });
      inp.addEventListener('blur', function () { setTimeout(hide, 160); });
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') hide();
        if (e.key === 'Enter' && !box.hidden) { var first = box.querySelector('button:not([disabled])'); if (first) { e.preventDefault(); first.click(); } }
      });
    });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var txt = { from: (f.elements.from && f.elements.from.value || '').trim(), to: (f.elements.to && f.elements.to.value || '').trim() };
      if (!txt.from && !txt.to) return open();
      // typed but not picked from the list: take the best match; the route map on the next screen lets them check it
      var need = ['from', 'to'].map(function (k) {
        if (picked[k]) return Promise.resolve(picked[k]);
        if (txt[k].length < 3) return Promise.resolve(null);
        return lookup(txt[k], 3).then(function (l) { return l[0] || null; }).catch(function () { return null; });
      });
      if (btn) btn.disabled = true; if (lbl) lbl.textContent = 'Finding your route…';
      Promise.all(need).then(function (r) {
        if (btn) btn.disabled = false; if (lbl) lbl.textContent = lblTxt;
        if (r[0]) setAddr('from', addrOf(r[0])); if (r[1]) setAddr('to', addrOf(r[1]));
        if (r[0] && r[1]) { open(); go(2); }
        else open({ from: r[0] ? '' : txt.from, to: r[1] ? '' : txt.to });
      });
    });
  });

  // ---------- navigation ----------
  var LBL = { 1: 'Step 1 of 5 · Route', 2: 'Step 1 of 5 · Check the route', 3: 'Step 2 of 5 · Items', 4: 'Step 3 of 5 · Stairs and day', 5: 'Step 4 of 5 · Your details', 6: 'Step 5 of 5 · Review', 7: 'Quote request sent' };
  var PROG = [0, 1, 1, 2, 3, 4, 5, 6];
  var next = q('[data-q-next]');
  function go(n, back) {
    st.step = n; save();
    qa('.tqf-s').forEach(function (s) { var on = +s.getAttribute('data-s') === n; s.hidden = !on; s.classList.toggle('back', !!back); });
    qa('.tqf-prog i').forEach(function (b, i) { b.classList.toggle('on', i < PROG[n]); });
    q('[data-q-steplbl]').textContent = LBL[n];
    q('[data-q-back]').toggleAttribute('data-hide', n === 1 || n === 7);
    q('[data-q-foot]').hidden = n === 1 || n === 2 || n === 7;
    q('[data-q-sum]').hidden = n !== 3;
    next.textContent = n === 6 ? 'SEND QUOTE REQUEST' : n === 1 ? 'SEE ROUTE' : 'NEXT';
    root.classList.toggle('tqf-white', n === 1 || n === 3);
    if (n === 1) { setTimeout(drawPre, 40); setTimeout(drawPre, 450); }
    if (n === 2) setTimeout(drawMap, 40);
    if (n === 3) { renderGrid(); renderList(); renderPhotos(); }
    if (n === 4) renderAccess();
    if (n === 5) ['name', 'phone', 'email', 'notes'].forEach(function (k) { q('#tqf-' + k).value = st[k]; });
    if (n === 6) renderReview();
    validate();
    q('.tqf-body').scrollTop = 0;
  }
  function goBack() { go(Math.max(1, st.step === 3 ? 2 : st.step === 2 ? 1 : st.step - 1), true); }
  q('[data-q-back]').addEventListener('click', goBack);
  function validate() {
    var ok = true, s = st.step;
    if (s === 1) ok = !!(st.from && st.to);
    if (s === 3) ok = count() > 0;
    if (s === 4) ok = !!(st.today || st.date);
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
    st[key] = val; st.route = null; q('#tqf-' + key).value = val ? val.text : '';
    q('[data-row="' + key + '"]').classList.toggle('done', !!val); save(); validate(); drawPre();
  }
  function label(p) {
    var street = [p.housenumber, p.street].filter(Boolean).join(' ');
    var main = p.name && p.name !== street ? p.name : (street || p.name || '');
    var place = [p.locality || p.district || p.city, p.state === 'New South Wales' ? 'NSW' : p.state, p.postcode].filter(Boolean).join(' ');
    var sub = [main !== street ? street : '', place].filter(Boolean).join(', ');
    return { main: main || place, sub: main ? sub : '' };
  }
  function search(key, text) {
    var my = ++seq; active = key; q('[data-q-slot="' + key + '"]').appendChild(sugg);
    sugg.innerHTML = [1, 2, 3].map(function () { return '<button type="button" disabled><span class="pi"></span><span style="flex:1"><div class="tqf-skel" style="width:60%"></div><div class="tqf-skel" style="width:85%;margin-top:7px;height:10px"></div></span></button>'; }).join('');
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
            var other = key === 'from' ? 'to' : 'from', oi = q('#tqf-' + other);
            if (!st[other]) { oi.focus(); if (oi.value.trim().length >= 3) search(other, oi.value.trim()); } else q('#tqf-' + key).blur();
          });
          sugg.appendChild(b);
        });
      }).catch(function () { sugg.innerHTML = '<button type="button" disabled><span class="pi">' + pinSvg + '</span><span><b>Address search is offline</b><small>Check your connection, or call us</small></span></button>'; });
  }
  ['from', 'to'].forEach(function (key) {
    var inp = q('#tqf-' + key);
    inp.addEventListener('focus', function () { active = key; });
    inp.addEventListener('input', function () {
      if (st[key]) { st[key] = null; q('[data-row="' + key + '"]').classList.remove('done'); validate(); }
      clearTimeout(timer); var v = inp.value.trim();
      if (v.length < 3) { sugg.hidden = true; return; }
      timer = setTimeout(function () { search(key, v); }, 220);
    });
  });
  // "+ Add company name" under each address (Yellow Express style)
  [['a', 'unitA'], ['b', 'unitB']].forEach(function (x) {
    var inp = q('[data-q-unit' + x[0] + ']'), btn = q('[data-q-cobtn="' + x[0] + '"]');
    if (st[x[1]]) { inp.value = st[x[1]]; inp.hidden = false; btn.parentNode.hidden = true; }
    btn.addEventListener('click', function () { inp.hidden = false; btn.parentNode.hidden = true; inp.focus(); });
    inp.addEventListener('input', function () { st[x[1]] = inp.value; save(); });
  });
  // "I won't be at the pickup / drop-off location" -> contact name and number (like Yellow Express, 2026-11-24)
  ['A', 'B'].forEach(function (e) {
    var ck = q('[data-q-awayck="' + e + '"]'), box = q('[data-q-awayf="' + e + '"]'), cn = q('[data-q-cn="' + e + '"]'), cp = q('[data-q-cp2="' + e + '"]');
    if (!ck || !box || !cn || !cp) { st['away' + e] = false; return; }   // option removed from the form (2026-11-25)
    ck.checked = !!st['away' + e]; box.hidden = !ck.checked; cn.value = st['cn' + e] || ''; cp.value = st['cp' + e] || '';
    ck.addEventListener('change', function () { st['away' + e] = ck.checked; box.hidden = !ck.checked; save(); if (ck.checked) cn.focus(); });
    cn.addEventListener('input', function () { st['cn' + e] = cn.value; save(); });
    cp.addEventListener('input', function () { st['cp' + e] = cp.value; save(); });
  });
  var contactOk = function (e) { return !st['away' + e] || ((st['cn' + e] || '').trim().length > 1 && (st['cp' + e] || '').replace(/\D/g, '').length >= 9); };
  var contactTxt = function (e) { return st['away' + e] ? 'Contact: ' + (st['cn' + e] || '').trim() + ', ' + (st['cp' + e] || '').trim() : ''; };
  // small Sydney map under the address boxes, with the Confirm locations button on top
  var pmap, player;
  function drawPre() {
    if (st.step !== 1 || !isOpen) return;
    if (!window.L) return setTimeout(drawPre, 200);
    var L = window.L;
    if (!pmap) {
      pmap = L.map(q('[data-q-premap]'), { zoomControl: false, scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false });
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, attribution: 'Tiles &copy; Esri, HERE, Garmin, &copy; OpenStreetMap' }).addTo(pmap);
    }
    pmap.invalidateSize();
    if (player) player.remove(); player = L.layerGroup().addTo(pmap);
    var pts = [];
    if (st.from) { pts.push([st.from.lat, st.from.lon]); L.marker(pts[pts.length - 1], { icon: pin('A', '#17357f') }).addTo(player); }
    if (st.to) { pts.push([st.to.lat, st.to.lon]); L.marker(pts[pts.length - 1], { icon: pin('B', '#e1261c') }).addTo(player); }
    if (pts.length === 2) pmap.fitBounds(pts, { padding: [50, 60], maxZoom: 14 });
    else if (pts.length) pmap.setView(pts[0], 13);
    else pmap.setView([-33.84, 151.1], 10);
  }
  q('[data-q-go1]').addEventListener('click', function () {
    if (st.from && st.to) {
      var bad = !contactOk('A') ? 'A' : !contactOk('B') ? 'B' : '';
      if (!bad) return go(2);
      q('[data-q-cn="' + bad + '"]').focus();
      return toast(bad === 'A' ? 'Add the pickup contact name and number' : 'Add the drop-off contact name and number');
    }
    var miss = st.from ? 'to' : 'from'; q('#tqf-' + miss).focus();
    toast(miss === 'from' ? 'Type the pickup and pick it from the list' : 'Type the drop-off and pick it from the list');
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
      L.polyline(st.route.line, { color: '#fff', weight: 10, opacity: .95, className: 'tqf-route' }).addTo(layer);
      L.polyline(st.route.line, { color: '#17357f', weight: 5.5, className: 'tqf-route' }).addTo(layer);
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
  // Item names as big buttons, like Yellow Express; the icon shows only once an item is picked (2026-11-24)
  var cq = 1, grid = q('[data-q-grid]');
  var qtyOf = function (k) { var n = 0; for (var id in st.items) if (st.items[id].k === k) n += st.items[id].q; return n; };
  function addItem(id, k, n, v, d) {
    var cur = st.items[id] || { k: k, n: n, v: v || '', q: 0 }; cur.q = Math.max(0, Math.min(99, cur.q + d));
    if (cur.q === 0) delete st.items[id]; else st.items[id] = cur; save(); renderGrid(); renderList(); validate();
  }
  var chip = function (attr, k, name, n) {
    return '<button type="button" class="tqf-chip' + (n ? ' on' : '') + '" ' + attr + '><span class="ci">' + icon(k) + '</span><span class="cn">' + name + '</span>' + (n ? '<span class="q">' + n + '</span>' : '') + '</button>';
  };
  function renderGrid() {
    var own = Object.keys(st.items).filter(function (id) { return id.indexOf('custom:') === 0; });
    grid.innerHTML = ITEMS.filter(function (i) { return !i.custom; }).map(function (i) { return chip('data-k="' + i.k + '"', i.k, i.n, qtyOf(i.k)); }).join('') +
      own.map(function (id) { var it = st.items[id]; return chip('data-own="' + esc(id) + '"', 'other', esc(it.n), it.q); }).join('') +
      '<button type="button" class="tqf-chip tqf-chip--own" data-k="other"><span class="cn">+ Something else</span></button>';
  }
  function renderTiles() { renderGrid(); }
  grid.addEventListener('click', function (e) {
    var t = e.target.closest('.tqf-chip'); if (!t) return;
    var oid = t.getAttribute('data-own'); if (oid) { var o = st.items[oid]; if (o) addItem(oid, o.k, o.n, o.v, 1); return; }
    var it = BYK[t.getAttribute('data-k')];
    if (it.custom) { q('[data-q-custom]').focus(); return toast('Type the item name, then tap Add'); }
    if (it.v) return openSheet(it);
    addItem(it.k, it.k, it.n, '', 1); if (navigator.vibrate) navigator.vibrate(8);
  });
  function renderList() {
    var ids = Object.keys(st.items), n = count();
    q('[data-q-lh]').textContent = ids.length ? 'Your list · ' + n + ' item' + (n === 1 ? '' : 's') : 'Your list';
    if (!ids.length) { q('[data-q-list]').innerHTML = '<div class="tqf-none">Nothing added yet.</div>'; return; }
    q('[data-q-list]').innerHTML = ids.map(function (id) { var it = st.items[id];
      return '<div class="tqf-li" data-id="' + esc(id) + '">' + icon(it.k) + '<div class="t">' + esc(it.n) + (it.v ? '<small>' + esc(it.v) + '</small>' : '') + '</div>' +
        '<div class="tqf-step tqf-step--sm"><button type="button" data-d="-1" aria-label="Fewer">−</button><span>' + it.q + '</span><button type="button" data-d="1" aria-label="More">+</button></div>' +
        '<button class="rm" type="button" aria-label="Remove"><svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13"/></svg></button></div>'; }).join('');
  }
  q('[data-q-list]').addEventListener('click', function (e) {
    var row = e.target.closest('.tqf-li'), b = e.target.closest('button'); if (!row || !b) return; var id = row.getAttribute('data-id'), it = st.items[id];
    if (b.classList.contains('rm')) addItem(id, it.k, it.n, it.v, -it.q); else addItem(id, it.k, it.n, it.v, +b.getAttribute('data-d'));
  });
  q('[data-q-cm]').addEventListener('click', function () { cq = Math.max(1, cq - 1); q('[data-q-cq]').textContent = cq; });
  q('[data-q-cp]').addEventListener('click', function () { cq = Math.min(99, cq + 1); q('[data-q-cq]').textContent = cq; });
  function addCustom() {
    var v = q('[data-q-custom]').value.trim(); if (!v) { q('[data-q-custom]').focus(); return toast('Type an item name first'); }
    var n = v.charAt(0).toUpperCase() + v.slice(1), lc = v.toLowerCase().replace(/s$/, '');
    var hit = ITEMS.filter(function (i) { return !i.custom && i.n.toLowerCase().replace(/s$/, '') === lc; })[0];
    q('[data-q-custom]').value = '';
    if (hit && hit.v) { cq = 1; q('[data-q-cq]').textContent = 1; return openSheet(hit); }
    if (hit) addItem(hit.k, hit.k, hit.n, '', cq); else addItem('custom:' + n.toLowerCase(), 'other', n, '', cq);
    toast('Added ' + cq + ' × ' + (hit ? hit.n : n)); cq = 1; q('[data-q-cq]').textContent = 1;
  }
  q('[data-q-cadd]').addEventListener('click', addCustom);
  q('[data-q-custom]').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); addCustom(); } });
  function openSheet(it) {
    var sh = q('[data-q-bsheet]');
    var draw = function () {
      sh.innerHTML = '<div class="tqf-grab"></div><div class="hd">' + icon(it.k) + '<div><b>' + it.n + '</b><small>Choose the size and how many</small></div></div>' +
        it.v.map(function (v) { var id = it.k + ':' + v, n = st.items[id] ? st.items[id].q : 0;
          return '<div class="tqf-vrow"><span>' + v + '</span><div class="tqf-step tqf-step--sm" data-v="' + esc(v) + '"><button type="button" data-d="-1" aria-label="Fewer">−</button><span>' + n + '</span><button type="button" data-d="1" aria-label="More">+</button></div></div>'; }).join('') +
        '<button class="tqf-cta tqf-cta--block" type="button" style="margin-top:16px" data-q-shdone>DONE</button>';
      sh.querySelectorAll('.tqf-step').forEach(function (s) { s.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; addItem(it.k + ':' + s.getAttribute('data-v'), it.k, it.n, s.getAttribute('data-v'), +b.getAttribute('data-d')); draw(); }); });
      sh.querySelector('[data-q-shdone]').addEventListener('click', closeSheet);
    };
    draw(); q('[data-q-scrim]').classList.add('on'); sh.classList.add('on');
  }
  function closeSheet() { q('[data-q-scrim]').classList.remove('on'); q('[data-q-bsheet]').classList.remove('on'); }
  q('[data-q-scrim]').addEventListener('click', closeSheet);


  // ---------- our time guide: never shown to the customer, it goes in the enquiry email to help price the job ----------
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
  var tMin = function (t) { var m = /^(\d{1,2}):(\d{2}) (am|pm)$/.exec(t || ''); if (!m) return -1; var h = +m[1] % 12 + (m[3] === 'pm' ? 12 : 0); return h * 60 + +m[2]; };
  var tTxt = function (n) { var h = Math.floor(n / 60), m = n % 60; return ((h % 12) || 12) + ':' + ('0' + m).slice(-2) + ' ' + (h < 12 ? 'am' : 'pm'); };
  var FIRST = 7 * 60, LAST = 18 * 60 + 30;
  function earliestToday() { var d = new Date(), n = d.getHours() * 60 + d.getMinutes() + 45; return Math.max(FIRST, Math.ceil(n / 30) * 30); }
  function todayOpen() { return earliestToday() <= LAST; }
  function jobDate() { return st.today ? iso(new Date()) : st.date; }
  var whenTxt = function () { return (st.today ? 'Today' : fmtDate(st.date)) + ', ' + (st.time ? 'around ' + st.time : 'any time'); };
  var hm = function (m) { m = Math.round(m / 5) * 5; var h = Math.floor(m / 60), r = m % 60; return (h ? h + ' hr' + (r ? ' ' : '') : '') + (r ? r + ' min' : ''); };
  function estimate() {
    var h = 0; for (var id in st.items) h += itemMin(st.items[id]) * st.items[id].q;
    var endF = function (e) { var a = st['access' + e]; return a === 'Stairs' ? 1 + 0.25 * st['flights' + e] : a === 'Lift' ? 1.1 : 1; };
    h = h / 2 * endF('A') + h / 2 * endF('B');
    if (crewAdvice().rec === '2') h *= 0.7;
    if (st.dis) h += 20;
    return { mins: Math.max(30, h + (st.route ? st.route.min * 1.3 : 25)) };
  }

  // ---------- photos (2026-11-25) ----------
  // Shopify's contact form cannot carry files. Each photo is shrunk on the phone, then stored in Titan's own Shopify store as a
  // line-item file upload (added to the cart, then taken straight back out). The enquiry email gets the photo links. No outside service.
  var PH_V = (root.getAttribute('data-photo-variant') || '').trim(), PH_MAX = 6, phBusy = 0, phQueue = Promise.resolve();
  function shrink(file) {
    return new Promise(function (res) {
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () {
        try {
          var k = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight)), c = document.createElement('canvas');
          c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
          c.toBlob(function (b) { res(b ? new File([b], 'photo.jpg', { type: 'image/jpeg' }) : file); }, 'image/jpeg', 0.82);
        } catch (e) { res(file); }
      };
      img.onerror = function () { URL.revokeObjectURL(url); res(file); };
      img.src = url;
    });
  }
  function uploadOne(file) {
    return shrink(file).then(function (f) {
      if (f.size > 18 * 1024 * 1024) throw new Error('too big');
      var fd = new FormData(); fd.append('id', PH_V); fd.append('quantity', '1'); fd.append('properties[Photo]', f, f.name || 'photo.jpg');
      return fetch('/cart/add.js', { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
    }).then(function (r) { if (!r.ok) throw new Error('upload ' + r.status); return r.json(); }).then(function (j) {
      var url = j && j.properties && j.properties.Photo;
      var out = function () { return fetch('/cart/change.js', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ id: j.key, quantity: 0 }) }).catch(function () {}); };
      return out().then(function () { if (!/^https:\/\/cdn\.shopify\.com\//.test(url || '')) throw new Error('no link'); return url; });
    });
  }
  function phMsg(t) { var m = q('[data-q-phmsg]'); m.textContent = t || ''; m.hidden = !t; }
  function renderPhotos() {
    var box = q('[data-q-photos]'); if (!box) return;
    if (!PH_V) { box.hidden = true; return; }
    var html = st.photos.map(function (u, i) { return '<div class="tqf-ph"><img src="' + esc(u) + '" alt="Your photo ' + (i + 1) + '" loading="lazy"><button type="button" class="x" data-i="' + i + '" aria-label="Remove photo ' + (i + 1) + '">×</button></div>'; }).join('');
    for (var b = 0; b < phBusy; b++) html += '<div class="tqf-ph tqf-ph--busy" aria-label="Uploading"></div>';
    q('[data-q-phgrid]').innerHTML = html;
    var full = st.photos.length + phBusy >= PH_MAX;
    q('.tqf-phbtn').hidden = full;
    q('[data-q-phlbl]').textContent = phBusy ? 'Uploading…' : st.photos.length ? 'Add more photos' : 'Add photos';
  }
  (function () {
    var inp = q('[data-q-phinput]'); if (!inp) return;
    inp.addEventListener('change', function () {
      var files = Array.prototype.slice.call(inp.files || []).filter(function (f) { return /^image\//.test(f.type) || /\.(jpe?g|png|heic|heif|webp)$/i.test(f.name); });
      inp.value = ''; phMsg('');
      var room = PH_MAX - st.photos.length - phBusy;
      if (files.length > room) { files = files.slice(0, Math.max(0, room)); phMsg('Up to ' + PH_MAX + ' photos. You can text us any others.'); }
      files.forEach(function (file) {
        phBusy++;
        phQueue = phQueue.then(function () { return uploadOne(file); }).then(function (url) { st.photos.push(url); save(); },
          function () { phMsg('A photo did not upload. No problem, you can text it to ' + PHONE + ' after sending.'); })
          .then(function () { phBusy--; renderPhotos(); });
      });
      renderPhotos();
    });
    q('[data-q-phgrid]').addEventListener('click', function (e) { var b = e.target.closest('.x'); if (!b) return; st.photos.splice(+b.getAttribute('data-i'), 1); save(); renderPhotos(); });
  })();

  // ---------- step 4: stairs and day. No "1 or 2 movers" question (user 2026-11-25: Titan decides); crewAdvice() only feeds our own guide in the email ----------
  function crewAdvice() {
    var its = Object.keys(st.items).map(function (id) { return st.items[id]; });
    var heavy = its.filter(function (it) { return HEAVY.indexOf(it.k) > -1 || /L-shape|French|King|Queen|3 door|Upright|8 seater/.test(it.v || ''); }).map(function (it) { return it.n.toLowerCase(); });
    var stairs = st.accessA === 'Stairs' || st.accessB === 'Stairs';
    if (heavy.length || stairs || count() >= 6) return { rec: '2', why: heavy.length ? 'We recommend two movers for the ' + heavy.filter(function (v, i, a) { return a.indexOf(v) === i; }).slice(0, 2).join(' and ') + '.' : stairs ? 'We recommend two movers because of the stairs.' : 'We recommend two movers for this many items.' };
    return { rec: '1', why: 'One mover and a big van is usually enough if you can lend a hand.' };
  }
  // Stairs made simple (2026-11-25): "No stairs" is already picked at both ends, so most people tap nothing here.
  var ACC = [['No stairs', '<path d="M3 20h18M5 20V10l7-5 7 5v10"/><path d="M10 20v-5h4v5"/>'], ['Stairs', '<path d="M3 20h5v-4h4v-4h4V8h5"/>'], ['Lift', '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 9l3-3 3 3M9 15l3 3 3-3"/>']];
  function iso(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function renderAccess() {
    ['A', 'B'].forEach(function (end) {
      var seg = q('[data-q-seg="' + end + '"]'), k = 'access' + end;
      if (!st[k] || st[k] === 'Ground floor') st[k] = 'No stairs';
      seg.innerHTML = ACC.map(function (a) { return '<button type="button" class="' + (st[k] === a[0] ? 'on' : '') + '" data-a="' + a[0] + '"><svg viewBox="0 0 24 24">' + a[1] + '</svg>' + a[0] + '</button>'; }).join('');
      var fl = q('[data-q-fl="' + end + '"]'); fl.hidden = st[k] !== 'Stairs';
      fl.innerHTML = '<span>How many flights?</span><div class="tqf-flc">' + [1, 2, 3, 4].map(function (n) { return '<button type="button" data-n="' + n + '" class="' + (st['flights' + end] === n ? 'on' : '') + '">' + (n === 4 ? '4+' : n) + '</button>'; }).join('') + '</div>';
    });
    q('[data-q-dis]').classList.toggle('on', !!st.dis);
    renderWhen();
  }
  ['A', 'B'].forEach(function (end) {
    q('[data-q-seg="' + end + '"]').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; st['access' + end] = b.getAttribute('data-a'); save(); renderAccess(); validate(); });
    q('[data-q-fl="' + end + '"]').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; st['flights' + end] = +b.getAttribute('data-n') || 1; save(); renderAccess(); });
  });
  q('[data-q-dis]').addEventListener('click', function () { st.dis = !st.dis; save(); renderAccess(); });
  function renderWhen() {
    var open = todayOpen();
    if (st.today && !open) st.today = false;
    qa('[data-q-when] button').forEach(function (b) { var t = b.getAttribute('data-w') === 'today'; b.classList.toggle('on', t ? !!st.today : !st.today); if (t) b.disabled = !open; });
    q('[data-q-todaymsg]').textContent = open ? '' : 'Too late for today';
    var dates = q('[data-q-dates]'); dates.hidden = !!st.today;
    if (!st.today) {
      var now = new Date(), html = '';
      for (var i = 1; i < 15; i++) { var d = new Date(now); d.setDate(now.getDate() + i); var v = iso(d);
        html += '<button type="button" data-d="' + v + '" class="' + (st.date === v ? 'on' : '') + '"><small>' + (i === 1 ? 'Tmrw' : d.toLocaleDateString('en-AU', { weekday: 'short' })) + '</small><b>' + d.getDate() + '</b><span>' + d.toLocaleDateString('en-AU', { month: 'short' }) + '</span></button>'; }
      dates.innerHTML = html;
    }
    var start = st.today ? earliestToday() : FIRST, opts = '<option value="">Any time (flexible)</option>';
    if (st.time && tMin(st.time) < start) st.time = '';
    for (var m = start; m <= LAST; m += 30) { var t = tTxt(m); opts += '<option value="' + t + '"' + (st.time === t ? ' selected' : '') + '>Around ' + t + '</option>'; }
    q('[data-q-timesel]').innerHTML = opts; q('[data-q-timesel]').value = st.time || '';
  }
  q('[data-q-when]').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b || b.disabled) return; st.today = b.getAttribute('data-w') === 'today'; if (st.today) st.date = ''; save(); renderWhen(); validate(); });
  q('[data-q-dates]').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; st.date = b.getAttribute('data-d'); save(); renderWhen(); validate(); });
  q('[data-q-timesel]').addEventListener('change', function () { st.time = this.value; save(); validate(); });

  // ---------- step 5: details ----------
  ['name', 'phone', 'email', 'notes'].forEach(function (k) { q('#tqf-' + k).addEventListener('input', function () { st[k] = this.value; save(); validate(); }); });

  // ---------- step 6: review + send ----------
  var crewTxt = function () { var a = crewAdvice(); return 'Not asked, Titan decides. Our guide: ' + (a.rec === '2' ? '2 movers' : '1 mover') + ' (' + a.why + ')'; };
  var accTxt = function (e) { var n = st['flights' + e]; return st['access' + e] === 'Stairs' ? 'Stairs, ' + (n >= 4 ? '4 or more flights' : n + ' flight' + (n > 1 ? 's' : '')) : (st['access' + e] || 'No stairs'); };
  var fmtDate = function (v) { if (!v) return 'Not chosen'; var p = v.split('-'); return new Date(+p[0], p[1] - 1, +p[2]).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' }); };
  var itemsTxt = function () { return Object.keys(st.items).map(function (id) { var it = st.items[id]; return it.q + ' x ' + it.n + (it.v ? ' (' + it.v + ')' : ''); }); };
  function renderReview() {
    var its = Object.keys(st.items).map(function (id) { return st.items[id]; });
    var row = function (l, v) { return '<div class="r"><span class="mu">' + l + '</span><span>' + v + '</span></div>'; };
    q('[data-q-review]').innerHTML =
      '<div class="tqf-note tqf-note--ok"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7"/></svg><span><b>Free quote, no obligation.</b> We check your details and text you a fixed price. Nothing to pay now.</span></div>' +
      '<div class="tqf-card tqf-rv"><div class="h"><b>Route</b><button type="button" data-go="1">Edit</button></div>' +
        '<div class="r"><span class="tqf-pin tqf-pin--a" style="width:22px;height:22px;font-size:11px">A</span><span>' + esc(st.from.text) + (st.unitA ? '<br><small>' + esc(st.unitA) + '</small>' : '') + (st.awayA ? '<br><small>' + esc(contactTxt('A')) + '</small>' : '') + '</span></div>' +
        '<div class="r"><span class="tqf-pin tqf-pin--b" style="width:22px;height:22px;font-size:11px">B</span><span>' + esc(st.to.text) + (st.unitB ? '<br><small>' + esc(st.unitB) + '</small>' : '') + (st.awayB ? '<br><small>' + esc(contactTxt('B')) + '</small>' : '') + '</span></div>' +
        (st.route ? '<div class="r"><span class="mu">Distance</span><span>' + st.route.km + ' km, about ' + st.route.min + ' min</span></div>' : '') + '</div>' +
      '<div class="tqf-card tqf-rv"><div class="h"><b>Items · ' + count() + '</b><button type="button" data-go="3">Edit</button></div><div>' +
        its.map(function (it) { return '<span class="tqf-pill">' + it.q + ' × ' + esc(it.n) + (it.v ? ' · ' + esc(it.v) : '') + '</span>'; }).join('') + '</div>' +
        (st.photos.length ? '<div class="tqf-rvph">' + st.photos.map(function (u, i) { return '<img src="' + esc(u) + '" alt="Your photo ' + (i + 1) + '" loading="lazy">'; }).join('') + '</div>' : PH_V ? '<button type="button" class="tqf-rvadd" data-go="3">+ Add photos (optional)</button>' : '') + '</div>' +
      '<div class="tqf-card tqf-rv"><div class="h"><b>Stairs and day</b><button type="button" data-go="4">Edit</button></div>' +
        row('Pickup', accTxt('A')) + row('Drop-off', accTxt('B')) + row('When', esc(whenTxt())) + (st.dis ? row('Extra', 'Dismantling / assembly') : '') + '</div>' +
      '<div class="tqf-card tqf-rv"><div class="h"><b>Your details</b><button type="button" data-go="5">Edit</button></div>' +
        row('Name', esc(st.name)) + row('Mobile', esc(st.phone)) + row('Email', esc(st.email)) + (st.notes ? row('Notes', esc(st.notes)) : '') + '</div>';
    qa('[data-go]').forEach(function (b) { b.addEventListener('click', function () { go(+b.getAttribute('data-go'), true); }); });
  }
  function jobInfo() {
    var pickup = st.from.text + (st.unitA ? ' (' + st.unitA + ')' : '') + (st.awayA ? ' - customer not there, ' + contactTxt('A') : ''),
        dropoff = st.to.text + (st.unitB ? ' (' + st.unitB + ')' : '') + (st.awayB ? ' - customer not there, ' + contactTxt('B') : '');
    return { pickup: pickup, dropoff: dropoff, access: 'Pickup: ' + accTxt('A') + ' | Drop-off: ' + accTxt('B'), when: whenTxt(), estLine: 'about ' + hm(estimate().mins) + ' for the whole job' };
  }
  function submit() {
    var f = q('[data-q-form]'); if (!f) return;
    // photos still uploading: finish them first, then send
    if (phBusy) { next.disabled = true; next.textContent = 'FINISHING PHOTOS…'; phQueue.then(function () { setTimeout(submit, 50); }); return; }
    var set = function (n, v) { var el = f.querySelector('[data-f="' + n + '"]'); if (el) el.value = v; };
    var J = jobInfo(), ph = st.photos.slice();
    set('name', st.name.trim()); set('email', st.email.trim()); set('phone', st.phone.trim()); set('pickup', J.pickup); set('dropoff', J.dropoff);
    set('items', itemsTxt().join(', ')); set('crew', crewTxt()); set('access', J.access); set('when', J.when); set('date', jobDate());
    set('photos', ph.length ? ph.join('\n') : 'None added');
    set('estimate', 'Not shown to customer: ' + J.estLine);
    set('body', ['QUOTE REQUEST', 'Pickup: ' + J.pickup, 'Drop-off: ' + J.dropoff, 'Items: ' + itemsTxt().join(', '), 'Movers: ' + crewTxt(), 'Stairs: ' + J.access,
      'When: ' + J.when, st.dis ? 'Needs dismantling / assembly' : '', st.route ? 'Route: ' + st.route.km + ' km, about ' + st.route.min + ' min drive' : '',
      ph.length ? 'Photos (' + ph.length + '):\n' + ph.join('\n') : 'Photos: none added', st.notes ? 'Notes: ' + st.notes.trim() : '', 'Our time guide (not shown to customer): ' + J.estLine].filter(Boolean).join('\n'));
    next.disabled = true; next.textContent = 'SENDING…';
    try { sessionStorage.setItem('tq-quote-sent', '1'); sessionStorage.setItem('tq-quote-photos', String(ph.length)); } catch (e) {}
    // requestSubmit fires the submit event, so Shopify's spam check (hCaptcha) can add its token; plain submit() skips it (2026-11-24)
    if (f.requestSubmit) f.requestSubmit(); else f.querySelector('[type=submit]') ? f.querySelector('[type=submit]').click() : f.submit();
  }

  // ---------- start ----------
  if (st.from) setAddr('from', st.from); if (st.to) setAddr('to', st.to);
  var posted = q('[data-q-posted]'), sent = false; try { sent = sessionStorage.getItem('tq-quote-sent') === '1'; } catch (e) {}
  if (posted && sent) { var hadPh = 0; try { hadPh = +sessionStorage.getItem('tq-quote-photos') || 0; sessionStorage.removeItem('tq-quote-sent'); sessionStorage.removeItem('tq-quote-photos'); localStorage.removeItem(KEY); } catch (e) {}
    st = blank(); open(); go(7); var dp = q('[data-q-donephoto]'); if (dp && hadPh) dp.hidden = true; }
  else if (q('[data-q-errors]') && sent) { try { sessionStorage.removeItem('tq-quote-sent'); } catch (e) {} open(); go(5); toast(q('[data-q-errors]').textContent || 'Please check your details'); }
  else if (location.hash === '#quote-form') open();
})();
