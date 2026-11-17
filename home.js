



const $ = (id) => document.getElementById(id);
const ALL_YEAR = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const TRIPS = {
  ericeira:  { name: 'Ericeira Escape',      city: 'Ericeira',   meta: '🇵🇹 PORTUGAL · EUROPE',  days: 7,  price: 890,  months: [5,6,7,8,9,10],       label: 'May – Oct',
    description: 'Discover Portugal’s surf capital. Spend a week exploring beautiful beaches, traditional coastal villages and some of Europe’s most iconic surf spots.',
    level: 'Beginner to intermediate', waves: 'Beach breaks', stay: 'Shared surf house', included: 'Surf lessons, board rental, accommodation and local transport' },
  biarritz:  { name: 'Biarritz Sessions',    city: 'Biarritz',   meta: '🇫🇷 FRANCE · EUROPE',    days: 6,  price: 950,  months: [6,7,8,9],            label: 'Jun – Sep',
    description: 'Experience the French Basque coast, powerful Atlantic swells and a unique surf culture. Improve your technique with experienced local coaches.',
    level: 'Intermediate', waves: 'Beach breaks', stay: 'Coastal surf lodge', included: 'Surf coaching, accommodation, equipment and local transport' },
  taghazout: { name: 'Taghazout Adventure',  city: 'Taghazout',  meta: '🇲🇦 MOROCCO · AFRICA',   days: 8,  price: 790,  months: [9,10,11,12,1,2,3,4], label: 'Sep – Apr',
    description: 'Discover Morocco’s legendary coastline. Enjoy long right-hand waves, warm sunshine, local food and the relaxed atmosphere of Taghazout.',
    level: 'All levels', waves: 'Point breaks', stay: 'Surf camp', included: 'Surf sessions, accommodation, breakfast and local transport' },
  bali:      { name: 'Bali Wave Culture',    city: 'Bali',       meta: '🇮🇩 INDONESIA · ASIA',   days: 10, price: 1390, months: [4,5,6,7,8,9,10],     label: 'Apr – Oct',
    description: 'Explore Bali’s tropical coastline, discover new surf spots and experience the island’s unique surf lifestyle with local guides.',
    level: 'Advance', waves: 'Reef breaks', stay: 'Tropical surf villa', included: 'Surf coaching, accommodation, equipment and local transfers' },
  costarica: { name: 'Pacific Wild',         city: 'Costa Rica', meta: '🇨🇷 COSTA RICA · AMERICAS', days: 9, price: 1250, months: [12,1,2,3,4],       label: 'Dec – Apr',
    description: 'Surf warm Pacific waters, explore lush landscapes and discover the laid-back lifestyle of Costa Rica’s coastline.',
    level: 'All levels', waves: 'Beach breaks', stay: 'Eco surf lodge', included: 'Surf sessions, accommodation, breakfast and local transport' },
  srilanka:  { name: 'Island Flow',          city: 'Sri Lanka',  meta: '🇱🇰 SRI LANKA · ASIA',   days: 8,  price: 1090, months: [11,12,1,2,3,4],      label: 'Nov – Apr',
    description: 'Escape to Sri Lanka for warm water, palm-lined beaches and welcoming local surf communities. A tropical trip designed to enjoy every moment.',
    level: 'Beginner', waves: 'Beach breaks', stay: 'Beachside surf hotel', included: 'Surf lessons, accommodation, breakfast and equipment' }
};

const euro = (n) => '€' + n.toLocaleString('en-GB');

function makeModal(modal, closeBtn) {
  let lastFocus = null;
  const close = () => {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastFocus && lastFocus.focus();
  };
  const open = (from) => {
    lastFocus = from || null;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn && closeBtn.focus();
  };
  closeBtn && closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) close();
  });
  return { open, close };
}

const fact = (cls, label, value) => {
  const wrap = document.createElement('div');
  wrap.className = cls;
  const h = document.createElement('strong'); h.textContent = label;
  const s = document.createElement('span');   s.textContent = value;
  wrap.append(h, s);
  return wrap;
};

let bookTrip = () => {};   
(() => {
  const toggle = $('menuToggle'), links = $('navLinks'), nav = document.querySelector('.nav');
  if (!toggle || !links || !nav) return;

  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  nav.appendChild(overlay);

  const set = (open) => {
    links.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    toggle.textContent = open ? '✕' : '☰';
  };

  toggle.addEventListener('click', () => set(!links.classList.contains('open')));
  overlay.addEventListener('click', () => set(false));
  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => set(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  window.matchMedia('(max-width: 900px)').addEventListener('change', (e) => { if (!e.matches) set(false); });
})();









(() => {
  const tabs = document.querySelectorAll('.trips .tap');
  const cards = document.querySelectorAll('.trips .trip-card');

  tabs.forEach((tab) => tab.addEventListener('click', () => {
    tabs.forEach((t) => { t.classList.remove('active'); t.setAttribute('aria-pressed', 'false'); });
    tab.classList.add('active');
    tab.setAttribute('aria-pressed', 'true');
    const f = tab.dataset.tripFilter;
    cards.forEach((c) => { c.hidden = !(f === 'all' || c.dataset.tripRegion === f); });
  }));

  const modal = $('tripModal');
  if (!modal) return;
  const { open, close } = makeModal(modal, $('tripClose'));
  let selected = null;

  document.querySelectorAll('.trip-detail').forEach((link) => link.addEventListener('click', (e) => {
    e.preventDefault();
    const key = link.dataset.trip, t = TRIPS[key];
    if (!t) return;
    selected = key;

    const img = link.closest('.trip-card').querySelector('.trip-image img');
    $('tripModalImage').src = img.getAttribute('src');
    $('tripModalImage').alt = t.name;
    $('tripModalMeta').textContent = t.meta;
    $('tripModalName').textContent = t.name;
    $('tripModalDescription').textContent = t.description;
    $('tripModalPrice').textContent = euro(t.price) + ' / person';
    $('tripModalFacts').replaceChildren(
      fact('trip-modal-fact', 'Duration', `${t.days} days / ${t.days - 1} nights`),
      fact('trip-modal-fact', 'Surf season', t.label),
      fact('trip-modal-fact', 'Surf level', t.level),
      fact('trip-modal-fact', 'Wave type', t.waves),
      fact('trip-modal-fact', 'Accommodation', t.stay),
      fact('trip-modal-fact', 'Included', t.included)
    );
    open(link);
  }));

  $('tripBook').addEventListener('click', () => {
    if (!selected) return;
    const key = selected;
    close();
    bookTrip(key);
    $('booking').scrollIntoView({ behavior: 'smooth' });
  });
})();

const CREW = {
  ines:     { meta: '🇵🇹 PORTUGAL · BEGINNER COACH', bio: 'Inês has taught over a thousand first-timers to stand up, then to love it. Calm in the water, loud on the beach.',
              langs: 'Portuguese, English, Spanish, French', cert: 'ISA Level 2 · Lifeguard certified', base: 'Ericeira, Portugal', best: 'First waves & longboarding' },
  philippe: { meta: '🇫🇷 FRANCE · TECHNICAL COACH', bio: 'Born on France’s Atlantic coast, Philippe knows every sandbank, tide and hidden peak. He helps you build confidence from your first whitewater waves to the lineup.',
              langs: 'French, English, Spanish', cert: 'ISA Level 2 · Surf rescue', base: 'Biarritz, France', best: 'Beach breaks & technical coaching' },
  youssef:  { meta: '🇲🇦 MOROCCO · POINT-BREAK GUIDE', bio: 'Ali grew up on Morocco’s long right-handers. He coaches line choice, speed and timing for confident surfers.',
              langs: 'Arabic, French, English, Spanish', cert: 'ISA Level 3 · First aid', base: 'Taghazout, Morocco', best: 'Point breaks & turns' },
  jake:     { meta: '🇦🇺 AUSTRALIA · HEAD COACH', bio: 'A former competitor from Victoria, Jake films every session so you can see exactly what to fix, then fix it.',
              langs: 'English, Spanish, Portuguese', cert: 'ISA Level 3 · Video coaching', base: 'All trips', best: 'Video analysis & performance' }
};

(() => {
  const tabs = document.querySelectorAll('.crew-tab');
  const cards = document.querySelectorAll('.crew-card');

  tabs.forEach((tab) => tab.addEventListener('click', () => {
    tabs.forEach((t) => { t.classList.remove('active'); t.setAttribute('aria-pressed', 'false'); });
    tab.classList.add('active');
    tab.setAttribute('aria-pressed', 'true');
    const f = tab.dataset.crewFilter;
    cards.forEach((c) => { c.hidden = !(f === 'all' || c.dataset.level === f); });
  }));

  const modal = $('crewModal');
  if (!modal) return;
  const { open, close } = makeModal(modal, $('crewClose'));
  $('crewBook').addEventListener('click', close);

  document.querySelectorAll('.crew-detail').forEach((link) => link.addEventListener('click', (e) => {
    e.preventDefault();
    const c = CREW[link.dataset.crew];
    if (!c) return;
    const card = link.closest('.crew-card');
    const img = card.querySelector('img');            // photo + name come from the card → always match
    $('crewImage').src = img.getAttribute('src');
    $('crewImage').alt = img.alt;
    $('crewMeta').textContent = c.meta;
    $('crewName').textContent = img.alt;
    $('crewBio').textContent = c.bio;
    $('crewFacts').replaceChildren(
      fact('crew-fact', 'Languages', c.langs),
      fact('crew-fact', 'Certifications', c.cert),
      fact('crew-fact', 'Based in', c.base),
      fact('crew-fact', 'Best for', c.best)
    );
    open(link);
  }));
})();

(() => {
  const track = $('galleryTrack');
  if (!track) return;
  const step = () => (track.querySelector('.gallery-slide')?.offsetWidth || 300) + 14;
  $('prevSlide').addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  $('nextSlide').addEventListener('click', () => track.scrollBy({ left:  step(), behavior: 'smooth' }));
})();

(() => {
  const grid = $('shopGrid');
  if (!grid) return;
  const KEY = 'waveroom-cart';
  const money = (v) => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(v);

  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch (_) { cart = []; }

  const drawer = $('cartDrawer'), overlay = $('cartOverlay');
  const setCart = (open) => {
    drawer.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  $('cartToggle').addEventListener('click', () => setCart(true));
  $('cartClose').addEventListener('click', () => setCart(false));
  overlay.addEventListener('click', () => setCart(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && drawer.classList.contains('open')) setCart(false); });

  function render() {
    const count = cart.reduce((n, i) => n + i.quantity, 0);
    const total = cart.reduce((n, i) => n + i.price * i.quantity, 0);
    $('cartCount').textContent = count;
    $('drawerCount').textContent = `(${count})`;
    $('cartSubtotal').textContent = money(total);
    try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (_) {}

    $('cartItems').innerHTML = cart.length ? cart.map((i) => `
      <div class="cart-item" data-id="${i.id}">
        <img src="${i.image}" alt="${i.name}">
        <div>
          <h4>${i.name}</h4>
          <span class="cart-item-price">${money(i.price)}</span>
          <div class="cart-item-actions">
            <button type="button" class="quantity-btn decrease" aria-label="Decrease quantity">−</button>
            <span class="cart-quantity">${i.quantity}</span>
            <button type="button" class="quantity-btn increase" aria-label="Increase quantity">+</button>
            <button type="button" class="remove-item">Remove</button>
          </div>
        </div>
        <strong>${money(i.price * i.quantity)}</strong>
      </div>`).join('') : '<p class="cart-empty">Your bag is currently empty.</p>';
  }

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-cart');
    if (!btn) return;
    const p = btn.closest('.shop-card');
    const found = cart.find((i) => i.id === p.dataset.id);
    if (found) found.quantity++;
    else cart.push({ id: p.dataset.id, name: p.dataset.name, price: Number(p.dataset.price),
                     image: p.querySelector('img').getAttribute('src'), quantity: 1 });
    btn.textContent = 'ADDED ✓';
    btn.classList.add('added');
    setTimeout(() => { btn.textContent = 'ADD TO BAG +'; btn.classList.remove('added'); }, 900);
    render();
  });

  $('cartItems').addEventListener('click', (e) => {
    const row = e.target.closest('.cart-item');
    if (!row) return;
    const item = cart.find((i) => i.id === row.dataset.id);
    if (!item) return;
    if (e.target.closest('.increase')) item.quantity++;
    if (e.target.closest('.decrease')) item.quantity--;
    if (e.target.closest('.remove-item')) item.quantity = 0;
    cart = cart.filter((i) => i.quantity > 0);
    render();
  });

  const filters = document.querySelectorAll('.filter-btn');
  filters.forEach((b) => b.addEventListener('click', () => {
    filters.forEach((x) => x.classList.remove('active'));
    b.classList.add('active');
    let n = 0;
    document.querySelectorAll('.shop-card').forEach((c) => {
      const show = b.dataset.filter === 'all' || c.dataset.category === b.dataset.filter;
      c.style.display = show ? '' : 'none';
      if (show) n++;
    });
    $('shopResults').textContent = `${n} PRODUCTS`;
  }));

  $('checkoutBtn').addEventListener('click', () => {
    alert(cart.length ? 'Thanks for shopping with WAVEROOM! Checkout is not connected yet.'
                      : 'Your bag is empty. Add a product first!');
  });

  render();
})();

(() => {
  const items = document.querySelectorAll('.faq-item');
  items.forEach((item) => {
    const q = item.querySelector('.faq-question');
    q.addEventListener('click', () => {
      const wasOpen = item.classList.contains('active');
      items.forEach((f) => {
        f.classList.remove('active');
        f.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) { item.classList.add('active'); q.setAttribute('aria-expanded', 'true'); }
    });
  });
})();

(() => {
  if (!$('bookingForm')) return;

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const state = { trip: 'ericeira', start: null, guests: 1, year: today.getFullYear(), month: today.getMonth() };

  const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const sameDay = (a, b) => !!(a && b && a.getTime() === b.getTime());
  const fmt = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const trip = () => TRIPS[state.trip];
  const inSeason = (d) => trip().months.includes(d.getMonth() + 1);
  const endDate = () => (state.start ? addDays(state.start, trip().days - 1) : null);

  function canStart(d) {
    if (d < today) return false;
    for (let i = 0; i < trip().days; i++) if (!inSeason(addDays(d, i))) return false;
    return true;
  }

  function goToFirstBookableMonth() {
    let d = new Date(today);
    for (let i = 0; i < 730; i++, d = addDays(d, 1)) {
      if (canStart(d)) { state.year = d.getFullYear(); state.month = d.getMonth(); return; }
    }
    state.year = today.getFullYear(); state.month = today.getMonth();
  }

  function renderTrips() {
    $('bkTrips').innerHTML = Object.entries(TRIPS).map(([id, t]) =>
      `<button type="button" class="tap${id === state.trip ? ' active' : ''}" data-trip="${id}" aria-pressed="${id === state.trip}">${t.city}</button>`
    ).join('');
  }

  function renderSeason() {
    const t = trip();
    $('bkSeason').innerHTML = `<strong>${t.name}</strong> · ${t.days} days · surf season <strong>${t.label}</strong>. Your whole trip must fall inside the season.`;
  }

  function renderCalendar() {
    const { year, month } = state;
    $('bkMonthLabel').textContent = `${MONTHS[month]} ${year}`;
    $('bkPrev').disabled = year === today.getFullYear() && month <= today.getMonth();

    const offset = (new Date(year, month, 1).getDay() + 6) % 7;  
    const total = new Date(year, month + 1, 0).getDate();
    const end = endDate();
    let html = '<span></span>'.repeat(offset);

    for (let day = 1; day <= total; day++) {
      const d = new Date(year, month, day);
      const ok = canStart(d);
      const cls = ['bk-day'];
      if (!inSeason(d)) cls.push('is-off');
      if (state.start && d >= state.start && d <= end) cls.push('in-range');
      if (sameDay(d, state.start)) cls.push('is-start');
      if (sameDay(d, end)) cls.push('is-end');
      html += `<button type="button" class="${cls.join(' ')}" data-date="${year}-${month}-${day}"` +
              `${ok ? '' : ' disabled'} aria-label="${fmt(d)}${ok ? '' : ', unavailable'}"` +
              `${sameDay(d, state.start) ? ' aria-pressed="true"' : ''}>${day}</button>`;
    }
    $('bkDays').innerHTML = html;
  }

  function renderSummary() {
    const t = trip(), end = endDate();
    $('sumTrip').textContent = t.name;
    $('sumStart').textContent = state.start ? fmt(state.start) : 'Pick a date';
    $('sumEnd').textContent = end ? fmt(end) : '—';
    $('sumGuests').textContent = state.guests;
    $('bkGuests').textContent = state.guests;
    $('sumTotal').textContent = euro(t.price * state.guests);
  }

  const renderAll = () => { renderTrips(); renderSeason(); renderCalendar(); renderSummary(); };

  function selectTrip(id) {
    if (!TRIPS[id]) return;
    state.trip = id;
    state.start = null;
    $('bkDateError').textContent = '';
    goToFirstBookableMonth();
    renderAll();
  }
  bookTrip = selectTrip;   

  $('bkTrips').addEventListener('click', (e) => {
    const b = e.target.closest('[data-trip]');
    if (b) selectTrip(b.dataset.trip);
  });

  $('bkDays').addEventListener('click', (e) => {
    const b = e.target.closest('.bk-day');
    if (!b || b.disabled) return;
    const [y, m, d] = b.dataset.date.split('-').map(Number);
    state.start = new Date(y, m, d);
    $('bkDateError').textContent = '';
    renderCalendar();
    renderSummary();
  });

  $('bkPrev').addEventListener('click', () => {
    if (--state.month < 0) { state.month = 11; state.year--; }
    renderCalendar();
  });
  $('bkNext').addEventListener('click', () => {
    if (++state.month > 11) { state.month = 0; state.year++; }
    renderCalendar();
  });
  $('bkMinus').addEventListener('click', () => { state.guests = Math.max(1, state.guests - 1); renderSummary(); });
  $('bkPlus').addEventListener('click',  () => { state.guests = Math.min(8, state.guests + 1); renderSummary(); });

  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function setError(id, msg) {
    $(id).classList.toggle('invalid', !!msg);
    document.querySelector(`.bk-error[data-for="${id}"]`).textContent = msg;
  }

  $('bookingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('bkName').value.trim(), email = $('bkEmail').value.trim();
    setError('bkName', name ? '' : 'Enter your full name.');
    setError('bkEmail', EMAIL.test(email) ? '' : 'Enter a valid email address.');
    if (!state.start) $('bkDateError').textContent = 'Pick a start date inside the surf season.';
    if (!name || !EMAIL.test(email) || !state.start) return;

    const t = trip();
    $('okName').textContent = name.split(' ')[0];
    $('okText').textContent =
      `${t.name}, ${fmt(state.start)} to ${fmt(endDate())}, for ${state.guests} ` +
      `${state.guests === 1 ? 'traveller' : 'travellers'} (${euro(t.price * state.guests)}). ` +
      `We’ll email ${email} to confirm availability.`;
    $('bookingForm').hidden = true;
    $('bkSuccess').hidden = false;
    $('bkSuccess').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  $('bkAgain').addEventListener('click', () => {
    $('bookingForm').reset();
    state.guests = 1;
    selectTrip('ericeira');
    $('bkSuccess').hidden = true;
    $('bookingForm').hidden = false;
  });

  goToFirstBookableMonth();
  renderAll();
})();



//INNIT//

if (window.Typed && $('typed')) {
  new Typed('#typed', {
   strings:  ['Find your wave. Find your people.', 'Explore more. Surf further.', 'Go beyond the shoreline.','Good vibes. Better tides.', 'Ride more. Connect more.'],
    loop: true, 
    typeSpeed: 90, 
    backSpeed: 80, 
    backDelay: 700, 
  });
}


if (window.AOS) {
  AOS.init({
    duration: 2000,
    once: true, 
    offset: 100,
  });
}
 

//SIMPLEPARLOCO//

 var image = document.getElementsByClassName('thumbnail');
new SimpleParallax(image);
