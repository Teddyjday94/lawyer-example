/* Ashby & Vale: site interactions. No dependencies. */

const CONFIG = {
  // Set to a form backend URL (Formspree, Basin, your own API) to receive JSON posts.
  // Left empty, the case review opens the visitor's email app with everything filled in.
  formEndpoint: '',
  intakeEmail: 'intake@ashbyvale.com',
  phone: '(225) 555-0142',
  timeZone: 'America/Chicago',
  officeHours: { days: [1, 2, 3, 4, 5], open: 8, close: 18 }
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- data ---------- */
const SITUATIONS = {
  auto: {
    title: 'After a car or truck wreck',
    fee: 'No fee unless we win',
    steps: ['Get checked by a doctor, even if you feel fine. Some injuries show up days later.', 'Photograph the vehicles, the scene and your injuries. Keep every receipt.', 'Don\'t give a recorded statement to the other driver\'s insurer before you talk to us.'],
    matter: 'Car or truck wreck', practice: 'injury'
  },
  work: {
    title: 'If you were hurt on the job',
    fee: 'No fee unless we win',
    steps: ['Report the injury to your supervisor in writing, today if you can.', 'See a doctor and tell them it happened at work.', 'Write down who saw it and what equipment was involved before details fade.'],
    matter: 'Hurt at work', practice: 'work'
  },
  criminal: {
    title: 'If you or a family member was arrested',
    fee: 'Flat-fee options available',
    steps: ['Say clearly: "I want to speak with a lawyer," then stop answering questions.', 'Don\'t discuss the case by phone or text. Jail calls are recorded.', 'Call us. We can often speak with the client and address bond quickly.'],
    matter: 'Arrested or charged', practice: 'criminal'
  },
  divorce: {
    title: 'If you\'re facing a divorce',
    fee: 'Flat-fee consultations',
    steps: ['Gather recent tax returns, pay stubs, account statements and debts.', 'Keep a private record of anything about the children that worries you.', 'Avoid moving out or moving money until you understand your rights.'],
    matter: 'Divorce', practice: 'family'
  },
  custody: {
    title: 'In a custody dispute',
    fee: 'Flat-fee consultations',
    steps: ['Keep following any current order, even one you disagree with.', 'Keep messages with the other parent short, calm and in writing.', 'Track school, medical and daily routines. Courts weigh stability heavily.'],
    matter: 'Custody dispute', practice: 'family'
  },
  death: {
    title: 'After losing someone you love',
    fee: 'No fee unless we win',
    steps: ['Take the time you need with your family. We\'ll handle the legal timeline.', 'Keep any letters from insurers or employers, unsigned.', 'When you\'re ready, a partner will speak with you personally.'],
    matter: 'Wrongful death', practice: 'death'
  }
};

const PRACTICES = [
  { id: 'injury', name: 'Personal injury',
    blurb: 'Wrecks, falls and dangerous products. We take on insurers who count on you settling fast and cheap.',
    cases: ['Car accidents', '18-wheeler crashes', 'Motorcycle', 'Rideshare', 'Slip and fall', 'Dog bites', 'Defective products'],
    first: 'We send preservation letters for dash cams, black-box data and store footage before it is overwritten.',
    fee: 'No fee unless we win' },
  { id: 'criminal', name: 'Criminal defense',
    blurb: 'From a first DWI to a felony indictment. Former prosecutors who know how the other side builds a case.',
    cases: ['DWI', 'Drug charges', 'Assault', 'Theft', 'Weapons', 'Federal crimes', 'Expungement'],
    first: 'We contact the client, address bond, and start pulling bodycam footage and police reports.',
    fee: 'Flat-fee options available' },
  { id: 'family', name: 'Family law',
    blurb: 'Divorce and custody handled with discretion, and with the children kept at the center of every decision.',
    cases: ['Divorce', 'Custody', 'Child support', 'Spousal support', 'Property division', 'Protective orders'],
    first: 'We file for temporary orders where needed so your home, kids and finances are protected right away.',
    fee: 'Flat-fee consultations' },
  { id: 'work', name: 'Workplace injury',
    blurb: 'Plant, refinery, offshore and construction injuries. Comp claims and the third-party lawsuits most firms miss.',
    cases: ['Workers\' comp', 'Denied claims', 'Refinery and plant', 'Offshore and maritime', 'Construction', 'Scaffolding falls'],
    first: 'We make sure your benefits start, and look for every party beyond your employer who may be responsible.',
    fee: 'No fee unless we win' },
  { id: 'death', name: 'Wrongful death',
    blurb: 'When a loss was preventable, families deserve answers and accountability. A partner leads every one of these cases.',
    cases: ['Fatal crashes', 'Workplace deaths', 'Medical negligence', 'Nursing home neglect', 'Unsafe property'],
    first: 'We handle insurers and the paperwork so your family can grieve, and we secure evidence quickly.',
    fee: 'No fee unless we win' }
];

// Portraits: `photo` shows a headshot; remove it to fall back to initials.
// Current photos are AI-generated placeholders. Replace with the attorneys' real headshots.
const TEAM = [
  { name: 'Marguerite Ashby', role: 'Founding partner, trial lawyer', initials: 'MA', lead: true, photo: 'images/marguerite-ashby.jpg',
    bio: 'Marguerite has tried more than 120 cases to verdict over three decades, most against national insurers and trucking companies. She leads the firm\'s wrongful death practice personally.',
    edu: 'LSU Paul M. Hebert Law Center', bar: 'Louisiana, U.S. Fifth Circuit', focus: 'Trucking, wrongful death', since: 'Practicing since 1995' },
  { name: 'Julien Vale', role: 'Founding partner', initials: 'JV', photo: 'images/julien-vale.jpg',
    bio: 'A former assistant district attorney, Julien now defends people facing the same system he once worked inside. He knows where a prosecution\'s case is weakest.',
    edu: 'Tulane University Law School', bar: 'Louisiana, U.S. Middle District', focus: 'Felony and federal defense', since: 'Practicing since 1997' },
  { name: 'Renée Boudreaux', role: 'Partner, family law', initials: 'RB', photo: 'images/renee-boudreaux.jpg',
    bio: 'Renée is a certified family law specialist and trained mediator. She resolves most cases outside court, and is ready when one needs a judge.',
    edu: 'Loyola University New Orleans College of Law', bar: 'Louisiana', focus: 'Divorce, custody', since: 'Practicing since 2006' },
  { name: 'Marcus Tillery', role: 'Partner, criminal defense', initials: 'MT', photo: 'images/marcus-tillery.jpg',
    bio: 'Marcus handles DWI and drug cases across the parishes surrounding Baton Rouge, and answers his own phone more often than not.',
    edu: 'Southern University Law Center', bar: 'Louisiana', focus: 'DWI, drug charges', since: 'Practicing since 2010' },
  { name: 'Theo Landry', role: 'Associate, workplace injury', initials: 'TL', photo: 'images/theo-landry.jpg',
    bio: 'Theo grew up in a refinery family and worked summers on a plant crew. He handles comp claims and third-party injury suits for industrial workers.',
    edu: 'LSU Paul M. Hebert Law Center', bar: 'Louisiana', focus: 'Plant and offshore injuries', since: 'Practicing since 2018' }
];

const FAQS = [
  { q: 'How much does a consultation cost?', a: 'Nothing. Case reviews are free for every practice area, and there is no obligation to hire us afterward.' },
  { q: 'How do your fees work on injury cases?', a: 'Injury, workplace and wrongful death cases are handled on contingency. You pay nothing upfront, and our fee is a percentage of what we recover. If we don\'t recover anything, you owe us no fee.' },
  { q: 'Should I talk to the other driver\'s insurance company?', a: 'Be polite, but don\'t give a recorded statement or sign anything before speaking with a lawyer. Adjusters are trained to find reasons to pay less.' },
  { q: 'How long do I have to file a claim?', a: 'Deadlines vary by case type and can be short. Louisiana recently changed several of them. Contact us as soon as possible so no deadline passes while you decide.' },
  { q: 'Can you help get someone out of jail on bail?', a: 'Yes. We can often speak with the person quickly and ask the court to set or reduce bond. Call us directly for anything urgent, day or night.' },
  { q: 'Will my case go to trial?', a: 'Most cases settle. We prepare every case as if it will be tried, because insurers and prosecutors offer more to lawyers they know will go to court.' },
  { q: 'Do you handle cases outside Baton Rouge?', a: 'Yes. We represent clients across Louisiana, and we can meet by video or travel to you if you\'re injured.' },
  { q: 'What should I bring to my first meeting?', a: 'Anything you have: police reports, photos, medical records, insurance letters, court papers. If you don\'t have them, that\'s fine. Gathering them is our job.' }
];

/* ---------- nav ---------- */
const nav = $('#nav');
const navToggle = $('#navToggle');
navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', open);
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  navToggle.querySelector('.nav__toggle-label').textContent = open ? 'Close' : 'Menu';
});
$$('#navLinks a').forEach((a) => a.addEventListener('click', () => {
  nav.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open menu');
  navToggle.querySelector('.nav__toggle-label').textContent = 'Menu';
}));

// Solid nav + mobile action bar once the hero headline leaves the viewport.
const hero = $('.hero');
const mbar = $('#mbar');
new IntersectionObserver(([e]) => {
  nav.classList.toggle('is-solid', e.intersectionRatio < 0.92);
  mbar.classList.toggle('is-on', !e.isIntersecting);
}, { threshold: [0, 0.92] }).observe($('.hero__copy'));

// Hide mobile bar when the form is on screen (it already has the CTA).
new IntersectionObserver(([e]) => {
  mbar.style.visibility = e.isIntersecting ? 'hidden' : '';
}, { threshold: 0.15 }).observe($('#wizard'));

// Current section highlight in nav.
const navLinks = new Map($$('#navLinks a').map((a) => [a.getAttribute('href').slice(1), a]));
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    navLinks.forEach((a) => a.classList.remove('is-current'));
    navLinks.get(e.target.id)?.classList.add('is-current');
  });
}, { rootMargin: '-45% 0px -50% 0px' });
['top', ...navLinks.keys(), 'review'].forEach((id) => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});

/* ---------- office status (real time, Central) ---------- */
(function officeStatus() {
  const el = $('#status');
  const text = $('#statusText');
  try {
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
      timeZone: CONFIG.timeZone, weekday: 'short', hour: 'numeric', hourCycle: 'h23'
    }).formatToParts(new Date()).map((p) => [p.type, p.value]));
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday);
    const hour = Number(parts.hour);
    const { days, open, close } = CONFIG.officeHours;
    const isOpen = days.includes(day) && hour >= open && hour < close;
    text.textContent = isOpen
      ? `Office open until ${close - 12} PM`
      : 'Office closed. Phones answered 24/7';
    el.classList.toggle('is-closed', !isOpen);
  } catch (_) { /* keep default text */ }
})();

/* ---------- hero spotlight on the ampersand ---------- */
(function spotlight() {
  const glyph = $('.hero__glyph');
  if (reduceMotion || !glyph || matchMedia('(hover: none)').matches) return;
  let raf = 0, x = 0, y = 0;
  hero.addEventListener('pointermove', (e) => {
    const r = glyph.getBoundingClientRect();
    x = ((e.clientX - r.left) / r.width) * 100;
    y = ((e.clientY - r.top) / r.height) * 100;
    if (!raf) raf = requestAnimationFrame(() => {
      glyph.style.setProperty('--mx', x + '%');
      glyph.style.setProperty('--my', y + '%');
      raf = 0;
    });
  });
})();

/* ---------- situation picker ---------- */
const chips = $$('.chip');
const answer = $('#pickerAnswer');
chips.forEach((chip) => chip.addEventListener('click', () => selectSituation(chip.dataset.matter)));
// Arrow keys move through the radio group.
$('.picker__chips').addEventListener('keydown', (e) => {
  const i = chips.indexOf(document.activeElement);
  if (i < 0 || !['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) return;
  e.preventDefault();
  const next = chips[(i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : chips.length - 1)) % chips.length];
  next.focus();
  selectSituation(next.dataset.matter);
});

function selectSituation(key) {
  const s = SITUATIONS[key];
  chips.forEach((c) => c.setAttribute('aria-checked', String(c.dataset.matter === key)));
  answer.innerHTML = `
    <div class="ans">
      <h3>${esc(s.title)}</h3>
      <span class="ans__fee">${esc(s.fee)}</span>
      <ol>${s.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>
      <div class="ans__actions">
        <a class="btn btn--accent btn--sm" href="#review" data-start="${key}">Free case review</a>
        <a class="textlink" href="#practice" data-practice="${s.practice}">How we handle it</a>
      </div>
    </div>`;
}
answer.addEventListener('click', (e) => {
  const start = e.target.closest('[data-start]');
  const prac = e.target.closest('[data-practice]');
  if (start) presetMatter(SITUATIONS[start.dataset.start].matter);
  if (prac) showPractice(prac.dataset.practice);
});

/* ---------- reveal ---------- */
const revealIO = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
}), { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
$$('[data-reveal]').forEach((el) => revealIO.observe(el));

/* ---------- practice tabs ---------- */
const tabsEl = $('#practiceTabs');
const panelEl = $('#practicePanel');
tabsEl.innerHTML = PRACTICES.map((p, i) => `
  <button class="ptab" role="tab" id="tab-${p.id}" aria-controls="practicePanel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-id="${p.id}">
    <span class="ptab__index" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>${esc(p.name)}
  </button>`).join('');
const tabs = $$('.ptab', tabsEl);

function renderPractice(p) {
  const index = String(PRACTICES.indexOf(p) + 1).padStart(2, '0');
  panelEl.setAttribute('aria-labelledby', 'tab-' + p.id);
  panelEl.innerHTML = `
    <div class="pp">
      <span class="pp__index" aria-hidden="true">${index} / 05</span>
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.blurb)}</p>
      <div class="pp__cols">
        <div><h4>Cases we take</h4><ul class="pp__cases">${p.cases.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div>
        <div><h4>What we do in the first 72 hours</h4><p class="pp__first">${esc(p.first)}</p></div>
      </div>
      <div class="pp__foot">
        <span class="pp__fee">${esc(p.fee)}</span>
        <a class="btn btn--accent btn--sm" href="#review">Free case review</a>
      </div>
    </div>`;
}
function showPractice(id, focus = false) {
  const p = PRACTICES.find((x) => x.id === id) || PRACTICES[0];
  tabs.forEach((t) => {
    const on = t.dataset.id === p.id;
    t.setAttribute('aria-selected', on);
    t.tabIndex = on ? 0 : -1;
    if (on) {
      if (focus) t.focus();
      t.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  });
  renderPractice(p);
}
tabs.forEach((t) => t.addEventListener('click', () => showPractice(t.dataset.id)));
tabsEl.addEventListener('keydown', (e) => {
  const i = tabs.indexOf(document.activeElement);
  if (i < 0) return;
  const map = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
  if (!(e.key in map)) return;
  e.preventDefault();
  showPractice(tabs[(i + map[e.key] + tabs.length) % tabs.length].dataset.id, true);
});
renderPractice(PRACTICES[0]);

/* ---------- results carousel ---------- */
const track = $('#resTrack');
const step = () => (track.querySelector('.result')?.offsetWidth || 340) + (parseFloat(getComputedStyle(track).columnGap) || 0);
$('#resPrev').addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
$('#resNext').addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
// Drag to scroll with a mouse; touch uses native scrolling.
(function dragScroll() {
  let down = false, startX = 0, startLeft = 0, moved = false;
  track.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    down = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft;
  });
  window.addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4 && !moved) { moved = true; track.classList.add('is-drag'); }
    if (moved) track.scrollLeft = startLeft - dx;
  });
  window.addEventListener('pointerup', () => {
    if (!down) return;
    down = false;
    if (moved) {
      // Let snapping settle on the nearest card after a drag.
      const left = track.scrollLeft;
      track.classList.remove('is-drag');
      track.scrollLeft = left;
    }
  });
})();
// Cursor spotlight on each card.
track.addEventListener('pointermove', (e) => {
  const card = e.target.closest('.result');
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty('--x', e.clientX - r.left + 'px');
  card.style.setProperty('--y', e.clientY - r.top + 'px');
});
track.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') { e.preventDefault(); track.scrollBy({ left: step(), behavior: 'smooth' }); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); track.scrollBy({ left: -step(), behavior: 'smooth' }); }
});

/* ---------- team bento + bios ---------- */
const teamGrid = $('#team-grid');
teamGrid.innerHTML = TEAM.map((t, i) => `
  <button class="atty${t.lead ? ' atty--lead' : ''}" data-i="${i}" aria-haspopup="dialog">
    <span class="atty__photo">
      ${t.photo ? `<img src="${esc(t.photo)}" alt="" loading="lazy">` : `<span class="atty__initials" aria-hidden="true">${esc(t.initials)}</span>`}
      <span class="atty__more" aria-hidden="true">+</span>
    </span>
    <span class="atty__meta">
      <span class="atty__name">${esc(t.name)}</span>
      <span class="atty__role">${esc(t.role)}</span>
    </span>
  </button>`).join('');

const bio = $('#bio');
const bioBody = $('#bioBody');
let lastFocus = null;
teamGrid.addEventListener('click', (e) => {
  const card = e.target.closest('.atty');
  if (!card) return;
  const t = TEAM[Number(card.dataset.i)];
  lastFocus = card;
  bioBody.innerHTML = `
    <div class="bio__head">
      ${t.photo ? `<img class="bio__photo" src="${esc(t.photo)}" alt="Portrait of ${esc(t.name)}">` : ''}
      <div><h3 id="bioName">${esc(t.name)}</h3><p>${esc(t.role)}</p></div>
    </div>
    <div class="bio__content">
      <p>${esc(t.bio)}</p>
      <dl class="bio__facts">
        <div><dt>Focus</dt><dd>${esc(t.focus)}</dd></div>
        <div><dt>Experience</dt><dd>${esc(t.since)}</dd></div>
        <div><dt>Education</dt><dd>${esc(t.edu)}</dd></div>
        <div><dt>Bar admissions</dt><dd>${esc(t.bar)}</dd></div>
      </dl>
      <a class="btn btn--accent" href="#review" id="bioCta">Free case review</a>
    </div>`;
  bio.showModal();
});
const closeBio = () => bio.close();
$('#bioClose').addEventListener('click', closeBio);
bio.addEventListener('click', (e) => {
  if (e.target === bio) closeBio(); // backdrop
  if (e.target.closest('#bioCta')) closeBio();
});
bio.addEventListener('close', () => lastFocus?.focus({ preventScroll: true }));

/* ---------- case review wizard ---------- */
const form = $('#wizard');
const wsteps = $$('.wstep', form);
const bar = $('#wizBar');
const count = $('#wizCount');
const back = $('#wizBack');
const next = $('#wizNext');
const formErr = $('#formErr');
let cur = 1;
const TOTAL = wsteps.length;

function presetMatter(value) {
  const input = $$('input[name="matter"]', form).find((i) => i.value === value);
  if (input) input.checked = true;
  if (cur === 1 && input) setTimeout(() => goTo(2), reduceMotion ? 0 : 650);
}

function showErr(key, on) {
  const el = $(`[data-err="${key}"]`, form);
  if (el) el.classList.toggle('is-on', on);
  const field = form.elements[key];
  if (field && field.closest) field.closest('.field')?.classList.toggle('has-err', on);
  if (field && field.setAttribute) field.setAttribute('aria-invalid', on);
}

function validate(n) {
  const f = form.elements;
  let ok = true;
  const check = (key, cond) => { showErr(key, !cond); if (!cond && ok) { ok = false; focusField(key); } };
  if (n === 1) check('matter', !!form.querySelector('input[name="matter"]:checked'));
  if (n === 2) check('when', !!form.querySelector('input[name="when"]:checked'));
  if (n === 4) {
    check('name', f.name.value.trim().length > 1);
    check('phone', f.phone.value.replace(/\D/g, '').replace(/^1/, '').length === 10);
    check('email', !f.email.value.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.value.trim()));
    check('consent', f.consent.checked);
  }
  return ok;
}
function focusField(key) {
  const el = form.elements[key];
  const target = el instanceof RadioNodeList ? el[0] : el;
  target?.focus?.({ preventScroll: false });
}

function goTo(n) {
  cur = Math.max(1, Math.min(TOTAL, n));
  wsteps.forEach((s) => s.classList.toggle('is-active', Number(s.dataset.step) === cur));
  bar.style.width = (cur / TOTAL) * 100 + '%';
  count.textContent = `Question ${cur} of ${TOTAL}`;
  back.disabled = cur === 1;
  next.textContent = cur === TOTAL ? 'Send my request' : 'Continue';
  formErr.textContent = '';
  const legend = $('.wstep.is-active legend', form);
  if (legend) { legend.tabIndex = -1; legend.focus({ preventScroll: true }); }
  const top = form.getBoundingClientRect().top;
  if (top < 60) form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

next.addEventListener('click', () => {
  if (!validate(cur)) return;
  if (cur < TOTAL) goTo(cur + 1); else submit();
});
back.addEventListener('click', () => goTo(cur - 1));
form.addEventListener('submit', (e) => { e.preventDefault(); next.click(); });
form.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'BUTTON') { e.preventDefault(); next.click(); }
});
// Auto-advance on the single-choice question; clear errors as people fix them.
form.addEventListener('change', (e) => {
  if (e.target.name === 'matter') { showErr('matter', false); setTimeout(() => cur === 1 && goTo(2), reduceMotion ? 0 : 280); }
  if (e.target.name === 'when') showErr('when', false);
  if (e.target.name === 'consent') showErr('consent', false);
});
form.addEventListener('input', (e) => {
  if (['name', 'phone', 'email'].includes(e.target.name)) showErr(e.target.name, false);
  if (e.target.name === 'phone') {
    const d = e.target.value.replace(/\D/g, '').replace(/^1/, '').slice(0, 10);
    e.target.value = d.length > 6 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : d.length > 3 ? `(${d.slice(0, 3)}) ${d.slice(3)}` : d;
  }
});
$('#details').addEventListener('input', (e) => { $('#detailsCount').textContent = e.target.value.length; });

async function submit() {
  const f = form.elements;
  const data = {
    matter: form.querySelector('input[name="matter"]:checked')?.value,
    when: form.querySelector('input[name="when"]:checked')?.value,
    contactedBy: form.querySelector('input[name="contacted"]:checked')?.value,
    details: f.details.value.trim(),
    name: f.name.value.trim(),
    phone: f.phone.value.trim(),
    email: f.email.value.trim(),
    method: f.method.value,
    time: f.time.value,
    ref: 'AV-' + Date.now().toString(36).toUpperCase().slice(-6)
  };

  form.classList.add('is-sending');
  next.textContent = 'Sending…';
  let viaEmail = !CONFIG.formEndpoint;

  if (!viaEmail) {
    try {
      const res = await fetch(CONFIG.formEndpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(res.status);
    } catch (_) {
      form.classList.remove('is-sending');
      next.textContent = 'Try again';
      formErr.textContent = `We couldn't send that. Please try again, or call ${CONFIG.phone}.`;
      return;
    }
  } else {
    const body = [
      `Reference: ${data.ref}`, `Matter: ${data.matter}`, `When: ${data.when}`, `Contacted by others: ${data.contactedBy}`,
      '', `Name: ${data.name}`, `Phone: ${data.phone}`, `Email: ${data.email || 'Not given'}`, `Reach me by: ${data.method}, ${data.time.toLowerCase()}`,
      '', 'What happened:', data.details || 'Not given'
    ].join('\n');
    location.href = `mailto:${CONFIG.intakeEmail}?subject=${encodeURIComponent(`Case review request: ${data.matter} (${data.ref})`)}&body=${encodeURIComponent(body)}`;
  }

  const first = data.name.split(/\s+/)[0];
  const how = { 'Phone call': 'call you', 'Text message': 'text you', 'Email': 'email you' }[data.method];
  const when = data.time === 'As soon as possible' ? 'as soon as possible' : `in the ${data.time.toLowerCase()}`;
  $('#doneTitle').textContent = `Thank you, ${first}.`;
  $('#doneText').textContent = viaEmail
    ? `Your email app should have opened with everything filled in. Press send, and we'll ${how} ${when}.`
    : `An attorney will review your request, and we'll ${how} ${when}.`;
  $('#doneRef').textContent = data.ref;

  wsteps.forEach((s) => s.classList.remove('is-active'));
  $('#wizActions').hidden = true;
  count.hidden = true;
  bar.style.width = '100%';
  form.classList.remove('is-sending');
  const done = $('#wdone');
  done.hidden = false;
  done.focus({ preventScroll: true });
}

/* ---------- FAQ with search ---------- */
const faqList = $('#faqList');
const faqEmpty = $('#faqEmpty');
function renderFaq(term = '') {
  const t = term.trim().toLowerCase();
  const hl = (s) => {
    const safe = esc(s);
    if (!t) return safe;
    const re = new RegExp(`(${esc(t).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return safe.replace(re, '<mark>$1</mark>');
  };
  const items = FAQS.filter((f) => !t || (f.q + ' ' + f.a).toLowerCase().includes(t));
  faqList.innerHTML = items.map((f, i) => `
    <details class="qa"${t && i === 0 ? ' open' : ''}>
      <summary>${hl(f.q)}<span class="qa__toggle" aria-hidden="true">+</span></summary>
      <div class="qa__a"><p>${hl(f.a)}</p></div>
    </details>`).join('');
  faqEmpty.hidden = items.length > 0;
}
let faqTimer;
$('#faqSearch').addEventListener('input', (e) => { clearTimeout(faqTimer); faqTimer = setTimeout(() => renderFaq(e.target.value), 120); });
// Only one answer open at a time keeps the list scannable.
faqList.addEventListener('toggle', (e) => {
  if (e.target.open) $$('.qa[open]', faqList).forEach((d) => d !== e.target && (d.open = false));
}, true);
renderFaq();

$('#year').textContent = new Date().getFullYear();
