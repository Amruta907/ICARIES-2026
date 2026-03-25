/* ===== ICARIES 2026 — app.js ===== */

const CACHE = {};
async function load(key, path) {
  if (CACHE[key]) return CACHE[key];
  const r = await fetch(path);
  CACHE[key] = await r.json();
  return CACHE[key];
}

/* ── Icons ─────────────────────────────────────────── */
const I = {
  loc:  `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  cal:  `<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  arr:  `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  mail: `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  glob: `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  info: `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  user: `<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
};

/* ── Router ─────────────────────────────────────────── */
function getHash() { return location.hash.replace(/^#\/?/, ''); }
let navObserver;
let selectedSectionId = '';

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;

  if (id === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const nav = document.getElementById('navbar');
  const navOffset = (nav ? nav.offsetHeight : 0) + 16;
  const top = el.getBoundingClientRect().top + window.scrollY - navOffset;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

// Navigate to a subpage (changes hash)
function goPage(page) {
  selectedSectionId = '';
  disconnectScrollSpy();
  setActive(page || 'home');
  location.hash = page ? '#/' + page : '#/';
}

// Scroll to a section on the home page
function goSection(id) {
  selectedSectionId = id;
  setActive(id);
  const currentHash = getHash();
  // If on a subpage, go home first then scroll
  if (currentHash === 'committee' || currentHash === 'author-guidelines') {
    location.hash = '#/';
    setTimeout(() => {
      initScrollSpy();
      scrollToSection(id);
    }, 450);
  } else {
    initScrollSpy();
    scrollToSection(id);
  }
  closeMob();
}

function closeMob() {
  setMobState(false);
}

function toggleMob() {
  const mobileNav = document.getElementById('mobile-nav');
  setMobState(!mobileNav.classList.contains('open'));
}

function setMobState(isOpen) {
  const mobileNav = document.getElementById('mobile-nav');
  const hamburger = document.querySelector('.hamburger');
  mobileNav?.classList.toggle('open', isOpen);
  hamburger?.classList.toggle('open', isOpen);
  hamburger?.setAttribute('aria-expanded', String(isOpen));
}

window.addEventListener('hashchange', route);
window.addEventListener('load', route);

let homeRendered = false; // avoid re-rendering home on section scroll

async function route() {
  const h = getHash();
  const app = document.getElementById('app');

  if (h === 'committee') {
    homeRendered = false;
    await committeePage(app);
    document.documentElement.scrollTop = 0;
    disconnectScrollSpy();
    selectedSectionId = '';
    setActive('committee');
  } else if (h === 'author-guidelines') {
    homeRendered = false;
    await authorsPage(app);
    document.documentElement.scrollTop = 0;
    disconnectScrollSpy();
    selectedSectionId = '';
    setActive('author-guidelines');
  } else if (h === 'payment') {
  homeRendered = false;
  await paymentPage(app);
  document.documentElement.scrollTop = 0;
  disconnectScrollSpy();
  selectedSectionId = '';
  setActive('payment');
} 
  else {
    // Home page — only re-render if not already showing home
    if (!homeRendered) {
      await homePage(app);
      homeRendered = true;
    }
    initScrollSpy();
    // If hash points to a section (e.g. #/about), scroll to it
    if (h && h !== 'home') {
      setTimeout(() => {
        scrollToSection(h);
      }, 80);
    }
    if (!selectedSectionId) {
      setActive('');
    }
  }

  initReveal();
  closeMob();
}

function setActive(target) {
  document.querySelectorAll('[data-nav]').forEach(a => {
    a.classList.toggle('active', a.dataset.nav === target);
  });
}

function disconnectScrollSpy() {
  if (navObserver) {
    navObserver.disconnect();
    navObserver = null;
  }
}

function initScrollSpy() {
  disconnectScrollSpy();
  if (!selectedSectionId) return;

  const section = document.getElementById(selectedSectionId);
  if (!section) return;

  navObserver = new IntersectionObserver((entries) => {
    const entry = entries[0];
    setActive(entry.isIntersecting ? selectedSectionId : '');
  }, {
    threshold: 0.01,
    rootMargin: '0px'
  });

  navObserver.observe(section);
}

/* ── Scroll Reveal ──────────────────────────────────── */
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('vis'), i * 60);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.07 });
  document.querySelectorAll('.reveal, .g-item').forEach(el => obs.observe(el));
}

/* ══════════════════════════════════════════════════════
   HOME PAGE  (all sections in one scroll)
══════════════════════════════════════════════════════ */
async function homePage(app) {
  const dData = await load('dates', 'data/dates.json');

  app.innerHTML = `

  <!-- HERO -->
  <section id="home" class="section" style="padding-top:3.5rem;padding-bottom:3.5rem;text-align:center;background:var(--bg)">
    <div class="hero-inner section-inner">
      <h1 class="hero-title">
        International Conference on Automation<br>and Resilient Innovative Expert System
        <span class="blue">ICARIES 2026</span>
      </h1>
      <p class="hero-sponsored">Hosted by Prof. Ram Meghe Institute of Technology &amp; Research, Badnera</p>
      <div class="hero-meta">
        <div class="hero-meta-item">${I.cal} Date - comming soon </div>
        <div class="hero-meta-item">${I.loc} PRMITR&amp;R, Amravati – INDIA</div>
      </div>
      <div class="hero-btns">
        <button class="btn btn-blue" onclick="goPage('author-guidelines')">${I.arr} Call for Papers</button>
        <button class="btn btn-outline-blue" onclick="goPage('payment')">Submit Paper ${I.arr}</button>
      </div>
    </div>
  </section>

  <!-- ABOUT -->
  <section id="about" class="section alt">
    <div class="section-inner">
      <div class="welcome-grid">
        <div>
          <span class="sec-eyebrow">About the Conference</span>
          <h2 class="sec-title">Welcome To ICARIES Conference 2026</h2>
          <div class="sec-bar"></div>
          <div class="welcome-text">
            <p>We are delighted to invite you to the 2<sup>nd</sup> International Conference on Intelligent Computing and Sustainable Innovation in Technology (ICARIES), scheduled to take place from September 8th to 10th, 2026. Hosted by Silicon University in Odisha, India, this conference promises to be a pivotal event for professionals and enthusiasts in the fields of technology, engineering, and innovation.</p>
            <p>ICARIES provides a dynamic platform for researchers, academics, industry professionals, and policymakers to exchange ideas, present their latest research findings, and explore innovative solutions in the realms of intelligent computing and sustainable technology. This interdisciplinary conference aims to foster collaboration and knowledge sharing across a range of specialized tracks.</p>
            <p>ICARIES 2026 is organized in hybrid mode, bolstering the global presence of the event. Delegates will be able to decide whether to attend physically or virtually. We look forward to meeting you at Silicon University, Odisha or virtually.</p>
            <div class="welcome-quote">All accepted and presented papers will be submitted for inclusion in the <strong>ICARIES Xplore</strong> digital library subject to meeting ICARIES Xplore's standards for scope and/or quality requirements.</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- DATES -->
  <section id="dates" class="section">
    <div class="section-inner">
      <div style="text-align:center">
        <span class="sec-eyebrow">Mark Your Calendar</span>
        <h2 class="sec-title">Important <span class="blue">Dates</span></h2>
        <div class="sec-bar center"></div>
      </div>
      <div class="dates-grid" style="margin-top:2.5rem">
        ${dData.dates.map(d => `
          <div class="date-card reveal">
            <div class="date-label">${d.label}</div>
            <div class="date-val">${d.date}</div>
          </div>`).join('')}
      </div>
    </div>
  </section>

  <!-- SPEAKERS -->
  <section id="speakers" class="section alt">
    <div class="section-inner">
      <div style="text-align:center">
        <span class="sec-eyebrow">Keynote Speakers</span>
        <h2 class="sec-title">Distinguished <span class="blue">Speakers</span></h2>
        <div class="sec-bar center"></div>
        <p class="sec-sub" style="margin:0 auto">Leading minds in Automation &amp; Intelligent Expert Systems</p>
      </div>
      <div class="speakers-grid">
        ${[1,2,3].map(() => `
          <div class="spk-card reveal">
            <div class="spk-photo">${I.user}</div>
            <div class="spk-info">
              <span class="spk-badge">Keynote Speaker</span>
              <div class="spk-name">Coming Soon</div>
            </div>
          </div>`).join('')}
      </div>
    </div>
  </section>

  <!-- ABOUT PRMITR -->
  <section id="venue" class="section alt">
    <div class="section-inner">
      <div class="venue-copy">
        <div>
          <h2 class="sec-title">About PRMITR Badnera</h2>
          <div class="sec-bar"></div>
          <div class="about-text">
            <p>The Vidarbha Youth Welfare Society's Prof. Ram Meghe Institute of Technology &amp; Research, Badnera-Amravati (an Autonomous Institute and formerly well known as College of Engineering Badnera), is a leading technological institute from Vidarbha. Established in the year 1983, the institute has a prestigious standing amongst the topmost Technical Institutes of Maharashtra.</p>
            <p>PRMITR has a legacy of 43 years in terms of research collaboration and student engagement in multiple UG courses like Computer Science and Engineering, Civil Engineering, Information Technology, Electronics and Telecommunication Engineering, Artificial Intelligence and Data Science, Computer Science and Engineering-IOT and Mechanical Engineering. The institute is approved by AICTE, New Delhi, accredited by National Assessment and Accreditation Council (NAAC), Bangalore with Grade 'A+' and some of its UG programmes are accredited thrice (03) by the National Board of Accreditation (NBA), New Delhi.</p>
            <p>The institute is recognized by Directorate of Technical Education (DTE Mumbai), Govt. of Maharashtra and affiliated to Sant Gadge Baba Amravati University, Amravati and is offering UG, PG and Ph.D courses. We have a strong backbone of 25,000 students completed graduation from our institute. For better nurturing, we have 21 acre of land area, built-up academic development area of about 50,000 sqft, and 53 laboratories for different courses with state-of-the-art equipment.</p>
          </div>
        </div>
        <div>
          <h2 class="sec-title">About Amravati City</h2>
          <div class="sec-bar"></div>
          <div class="about-text">
            <p>Amravati, often called the cultural capital of Vidarbha, is a significant city in Maharashtra. It is renowned for its historical temples, particularly the Ambadevi Temple, and serves as an educational hub with several universities and colleges.</p>
            <p>The city holds a rich heritage and is a gateway to Melghat Tiger Reserve, offering both urban amenities and proximity to natural beauty.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  `;
}

/* ══════════════════════════════════════════════════════
   COMMITTEE PAGE
══════════════════════════════════════════════════════ */
async function committeePage(app) {
  const data = await load('committee', 'data/committee.json');

  const cards = (list, showRole = false) => list.map(m => `
    <div class="member-card reveal">
      ${showRole ? `<span class="member-role">${m.role}</span>` : ''}
      <div class="member-name">${m.name}</div>
      ${m.org ? `<div class="member-org">${m.org}</div>` : ''}
    </div>`).join('');

  app.innerHTML = `
  <div class="subpage-hero">
    <div class="subpage-hero-inner">
      <span class="sec-eyebrow">ICARIES 2026</span>
      <h1 class="sec-title" style="font-size:clamp(1.6rem,4vw,2.8rem)">Technical Program Committee</h1>
      <div class="sec-bar"></div>
    </div>
  </div>

  <div class="section">
    <div class="section-inner">
      <div class="group-label">International Committee</div>
      <div class="members-grid">${cards(data.international)}</div>
      <div class="divider"></div>
      <div class="group-label">National Committee</div>
      <div class="members-grid">${cards(data.national)}</div>
    </div>
  </div>

  <div class="banner-dark">
    <h2>Organizing <span>Team</span></h2>
  </div>

  <div class="section">
    <div class="section-inner">
      <div class="group-label">Organizing Committee</div>
      <div class="members-grid" style="grid-template-columns:repeat(3,1fr)">${cards(data.organizing, true)}</div>
      <div class="divider"></div>
      <div class="group-label">Chair Persons &amp; Publication Chairs</div>
      <div class="members-grid">${cards(data.chairs, true)}</div>
    </div>
  </div>`;
}

/* ══════════════════════════════════════════════════════
   AUTHOR GUIDELINES PAGE
══════════════════════════════════════════════════════ */
async function authorsPage(app) {
  const [aData, dData] = await Promise.all([
    load('authors', 'data/authors.json'),
    load('dates',   'data/dates.json'),
  ]);

  app.innerHTML = `
  <div class="subpage-hero">
    <div class="subpage-hero-inner">
      <span class="sec-eyebrow">For Researchers</span>
      <h1 class="sec-title" style="font-size:clamp(1.6rem,4vw,2.8rem)">Author Guidelines</h1>
      <div class="sec-bar"></div>
      <p style="color:rgba(255,255,255,.5);font-size:.9rem;margin-top:.3rem">Please follow these instructions carefully to ensure your submission is processed correctly.</p>
    </div>
  </div>

  <div class="section">
    <div class="authors-wrap">
      <ul class="g-list">
        ${aData.guidelines.map((g, i) => `
          <li class="g-item">
            <div class="g-num">${i + 1}</div>
            <div class="g-text">${g}</div>
          </li>`).join('')}
      </ul>

      <div class="notes-box">
        <div class="notes-title">${I.info} Important Notes</div>
        <ul class="notes-list">
          ${aData.notes.map(n => `<li class="${n.highlight ? 'hl' : ''}">${n.text}</li>`).join('')}
        </ul>
      </div>

      <div style="margin:2.5rem 0">
        <div class="dtable-title">Important Dates</div>
        <table class="dtable">
          ${dData.dates.map(d => `<tr><td>${d.label}</td><td>${d.date}</td></tr>`).join('')}
        </table>
      </div>

      <div class="submit-box">
        <div class="submit-title">Submit Research Paper</div>
        <p class="submit-desc">Authors are invited to submit their original and unpublished research papers in the prescribed format. All submissions will undergo a peer-review process.</p>
        <ul class="submit-list">
          ${aData.submitPoints.map(p => `<li>${p}</li>`).join('')}
        </ul>
        <div class="submit-btns">
          <button class="btn btn-blue">Submit Paper ${I.arr}</button>
          <button class="btn btn-outline-blue">Download Template</button>
        </div>
      </div>
    </div>
  </div>`;
}

/* ══════════════════════════════════════════════════════
   payment section
══════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════
   PAYMENT PAGE
══════════════════════════════════════════════════════ */
async function paymentPage(app) {
  app.innerHTML = `
  <div class="subpage-hero">
    <div class="subpage-hero-inner">
      <span class="sec-eyebrow">ICARIES 2026</span>
      <h1 class="sec-title">Payment Section</h1>
      <div class="sec-bar"></div>
    </div>
  </div>

  <div class="section">
    <div class="section-inner">

      <h2>Registration Payment Details</h2>

      <div class="members-grid" style="grid-template-columns:1fr 1fr">

        <div class="member-card">
          <div class="member-name">Bank Details</div>
          <div class="member-org">Account Name: ICARIES 2026</div>
          <div class="member-org">Account Number: XXXXXXXX</div>
          <div class="member-org">IFSC Code: XXXXX</div>
        </div>

        <div class="member-card">
          <div class="member-name">UPI Payment</div>
          <div class="member-org">UPI ID: example@upi</div>
          <div class="member-org">Scan QR Code (to be added)</div>
        </div>

      </div>

    </div>
  </div>`;
}

/* ══════════════════════════════════════════════════════
   NAV + FOOTER
══════════════════════════════════════════════════════ */
document.getElementById('navbar').innerHTML = `
  <div class="nav-inner">
    <div class="nav-brand" onclick="goSection('home')" style="cursor:pointer">
      <div class="nav-logo-wrap"><img src="assets/logo.jpeg" alt="PRMITR"></div>
      <div>
        <span class="nav-brand-name">ICARIES 2026</span>
        <span class="nav-brand-sub">PRMITR Badnera</span>
      </div>
    </div>
    <ul class="nav-links">
      <li><a href="#home" data-nav="home" onclick="event.preventDefault(); goSection('home')">Home</a></li>
      <li><a href="#about" data-nav="about" onclick="event.preventDefault(); goSection('about')">About</a></li>
      <li><a href="#/committee" data-nav="committee" onclick="event.preventDefault(); goPage('committee')">Committee</a></li>
      <li><a href="#/author-guidelines" data-nav="author-guidelines" onclick="event.preventDefault(); goPage('author-guidelines')">For Authors</a></li>
      <li><a href="#dates" data-nav="dates" onclick="event.preventDefault(); goSection('dates')">Program</a></li>
      <li><a href="#venue" data-nav="venue" onclick="event.preventDefault(); goSection('venue')">Venue</a></li>
      <li><a href="#site-footer" data-nav="contact" onclick="event.preventDefault(); goSection('site-footer')">Contact</a></li>
    </ul>
    <div class="hamburger" onclick="toggleMob()" aria-controls="mobile-nav" aria-expanded="false" aria-label="Toggle navigation">
      <span></span><span></span><span></span>
    </div>
  </div>`;

/* Mobile nav */
const mn = document.createElement('div');
mn.id = 'mobile-nav';
mn.innerHTML = `<ul>
  <li><a href="#home" data-nav="home" onclick="event.preventDefault(); goSection('home'); closeMob()">Home</a></li>
  <li><a href="#about" data-nav="about" onclick="event.preventDefault(); goSection('about'); closeMob()">About</a></li>
  <li><a href="#/committee" data-nav="committee" onclick="event.preventDefault(); goPage('committee'); closeMob()">Committee</a></li>
  <li><a href="#/author-guidelines" data-nav="author-guidelines" onclick="event.preventDefault(); goPage('author-guidelines'); closeMob()">For Authors</a></li>
  <li><a href="#dates" data-nav="dates" onclick="event.preventDefault(); goSection('dates'); closeMob()">Program</a></li>
  <li><a href="#venue" data-nav="venue" onclick="event.preventDefault(); goSection('venue'); closeMob()">Venue</a></li>
  <li><a href="#site-footer" data-nav="contact" onclick="event.preventDefault(); goSection('site-footer'); closeMob()">Contact</a></li>
</ul>`;
document.body.insertBefore(mn, document.getElementById('app'));

/* Footer */
document.getElementById('site-footer').innerHTML = `
  <div class="footer-inner">
    <div class="footer-grid">
      <div>
        <div class="footer-logo-wrap">
          <span class="footer-brand-name">ICARIES 2026</span>
        </div>
        <p class="footer-desc">International Conference on Automation and Resilient Innovative Expert System ICARIES</p>
      </div>
      <div class="footer-col">
        <h4>Quick Links</h4>
        <ul>
          <li><a onclick="goPage('')">Home</a></li>
          <li><a onclick="goPage('committee')">Committee</a></li>
          <li><a onclick="goPage('author-guidelines')">For Authors</a></li>
          <li><a onclick="goSection('dates')">Program</a></li>
          <li><a onclick="goSection('venue')">Venue</a></li>
          <li><a onclick="goSection('site-footer')">Contact</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Contact</h4>
        <div class="footer-c-item">${I.loc} PRMITR Amravati, Maharashtra, India</div>
        <div class="footer-c-item">${I.mail} info@ICARIES.in</div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 ICARIES. All rights reserved. | PRMITR Badnera, India</span>
    </div>
  </div>`;

/* Navbar scroll shadow */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 10);
  document.getElementById('scroll-top-btn')?.classList.toggle('show', window.scrollY > 300);
});

document.getElementById('scroll-top-btn')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
