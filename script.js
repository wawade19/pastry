(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* Nav border on scroll */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 10);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Phone menu */
  const burger = $('#burger'), links = $('#navLinks');
  const setMenu = open => {
    links.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
  };
  burger.addEventListener('click', () => setMenu(!links.classList.contains('is-open')));
  $$('a', links).forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* Menu filter */
  const tabs = $$('.tab'), cards = $$('.card');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    const f = tab.dataset.filter;
    tabs.forEach(t => {
      const on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on);
    });
    cards.forEach(c => {
      const show = f === 'all' || c.dataset.category === f;
      c.classList.toggle('is-hidden', !show);
      c.classList.remove('is-showing');
      if (show) { void c.offsetWidth; c.classList.add('is-showing'); }
    });
  }));

  /* Pop-up message */
  const toast = $('#toast');
  let toastTimer;
  const notify = msg => {
    toast.textContent = msg;
    toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-on'), 2800);
  };

  /* Escape key closes mobile menu */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { setMenu(false); }
  });

  /* Pickup order */
  const count = $('#orderCount'), pill = $('#orderPill');
  let n = 0;
  $$('.add').forEach(b => b.addEventListener('click', () => {
    n++; count.textContent = n;
    pill.classList.add('bump'); setTimeout(() => pill.classList.remove('bump'), 300);
    notify(`Added ${b.closest('.card').querySelector('h3').textContent} to your order`);
  }));
  pill.addEventListener('click', () => notify(n ? `${n} item${n > 1 ? 's' : ''} in your pickup order` : 'Your pickup order is empty'));

  /* Scroll reveal */
  const items = $$('.card, .steps li, .locs > div, .journal > *, .closing > *');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { threshold: .15 });
    items.forEach(el => { el.classList.add('reveal'); io.observe(el); });
  }

  /* Newsletter */
  const form = $('#newsForm'), email = $('#email'), msg = $('#newsMsg');
  const valid = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const v = email.value.trim();
    if (!valid(v)) {
      email.classList.add('invalid');
      msg.className = 'news__msg error';
      msg.textContent = 'Enter a valid email address, like you@example.com.';
      email.focus();
      return;
    }
    email.classList.remove('invalid');
    msg.className = 'news__msg';
    msg.textContent = `You're subscribed. The next bake note goes to ${v}.`;
    notify('Subscribed to the weekly bake note');
    form.reset();
  });
  email.addEventListener('input', () => email.classList.remove('invalid'));
})();