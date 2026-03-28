import { useEffect, useRef, useState } from 'react';
import authorsData from '../data/authors.json';
import committeeData from '../data/committee.json';
import datesData from '../data/dates.json';
import prmitr from '../assets/prmitr.webp';
import ambadevi from '../assets/ambadevi.jpg';
import chikhaldara from '../assets/chikhaldara.png';
import melghat from '../assets/melghat.png';
import upperwardha from '../assets/upperwardha.png';
import shegao from '../assets/shegao.jpg';
// import dharkhora from '../assets/dharkhora.webp';
import semadoh from '../assets/semadoh.jpg';
import connectivity from '../assets/connectivity.png';
import logo from '../assets/logo.jpeg';

const icons = {
  loc: (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  cal: (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  arr: (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  mail: (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  info: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  user: (
    <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

const pageRoutes = new Set(['committee', 'author-guidelines', 'payment','venue']);

function getHashRoute() {
  return window.location.hash.replace(/^#\/?/, '');
}

function buildGoogleMapUrl(query) {
  const params = new URLSearchParams({
    api: '1',
    query,
  });
  return `https://www.google.com/maps/search/?${params.toString()}`;
}

function App() {
  const [route, setRoute] = useState(() => getHashRoute());
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navbarRef = useRef(null);

  const currentPage = pageRoutes.has(route) ? route : 'home';

  useEffect(() => {
    const onHashChange = () => setRoute(getHashRoute());
    const onScroll = () => {
      setNavScrolled(window.scrollY > 10);
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('scroll', onScroll);
    onScroll();

    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);

    if (currentPage !== 'home') {
      setSelectedSectionId('');
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    const targetSection = route && route !== 'home' ? route : selectedSectionId;
    if (!targetSection) {
      return;
    }

    const timer = window.setTimeout(() => {
      scrollToSection(targetSection, navbarRef.current);
    }, 80);

    return () => window.clearTimeout(timer);
  }, [currentPage, route, selectedSectionId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('vis');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.07 }
    );

    const elements = document.querySelectorAll('.reveal, .g-item');
    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [currentPage]);

  useEffect(() => {
    if (currentPage !== 'home' || !selectedSectionId) {
      return undefined;
    }

    const section = document.getElementById(selectedSectionId);
    if (!section) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRoute(selectedSectionId);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [currentPage, selectedSectionId]);

  const activeNav = currentPage === 'home' ? (selectedSectionId || (route && route !== 'home' ? route : '')) : currentPage;

  function goPage(page) {
    setSelectedSectionId('');
    window.location.hash = page ? `#/${page}` : '#/';
  }

  function goSection(id) {
    setSelectedSectionId(id);

    if (currentPage !== 'home') {
      window.location.hash = '#/';
      return;
    }

    setRoute(id);
    scrollToSection(id, navbarRef.current);
  }

  return (
    <>
      <Navbar
        activeNav={activeNav}
        mobileOpen={mobileOpen}
        navScrolled={navScrolled}
        logo={logo}
        navbarRef={navbarRef}
        onGoPage={goPage}
        onGoSection={goSection}
        onToggleMobile={() => setMobileOpen((open) => !open)}
      />
      <main id="app">
        {currentPage === 'home' && <HomePage onGoPage={goPage} onImageClick={(img) => setSelectedImage(img)} />}
        {currentPage === 'committee' && <CommitteePage />}
        {currentPage === 'author-guidelines' && <AuthorsPage />}
        {currentPage === 'payment' && <PaymentPage />}
        {currentPage === 'venue' && <VenuePage />}
      </main>

      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedImage(null)} aria-label="Close modal">×</button>
            <img src={selectedImage.src} alt={selectedImage.alt} />
            <div className="modal-caption">{selectedImage.alt}</div>
          </div>
        </div>
      )}

      <SiteFooter onGoPage={goPage} onGoSection={goSection} />
      <button
        id="scroll-top-btn"
        aria-label="Scroll to top"
        className={showScrollTop ? 'show' : ''}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 19V7"></path>
          <path d="M6.5 12.5 12 7l5.5 5.5"></path>
        </svg>
      </button>
    </>
  );
}

function Navbar({ activeNav, logo, mobileOpen, navScrolled, navbarRef, onGoPage, onGoSection, onToggleMobile }) {
  return (
    <>
      <nav id="navbar" className={navScrolled ? 'scrolled' : ''} ref={navbarRef}>
        <div className="nav-inner">
          <div className="nav-brand" onClick={() => onGoSection('home')} role="button" tabIndex={0}>
            <div className="nav-logo-wrap"><img src={logo} alt="PRMITR" /></div>
            <div>
              <span className="nav-brand-name">ICARIES 2026</span>
              <span className="nav-brand-sub">PRMITR Badnera</span>
            </div>
          </div>
          <ul className="nav-links">
            <li><NavLink activeNav={activeNav} navKey="home" onClick={() => onGoSection('home')}>Home</NavLink></li>
            <li className="nav-dropdown">
              <NavLink activeNav={activeNav} navKey="about-conference" onClick={() => onGoSection('about-conference')}>About</NavLink>
              <ul className="dropdown-menu">
                <li><NavLink activeNav={activeNav} navKey="about-conference" onClick={() => onGoSection('about-conference')}>About Conference</NavLink></li>
                <li><NavLink activeNav={activeNav} navKey="about-institute" onClick={() => onGoSection('about-institute')}>About Institute</NavLink></li>
                <li><NavLink activeNav={activeNav} navKey="about-city" onClick={() => onGoSection('about-city')}>About City</NavLink></li>
              </ul>
            </li>
            <li><NavLink activeNav={activeNav} navKey="committee" onClick={() => onGoPage('committee')}>Committee</NavLink></li>
            <li><NavLink activeNav={activeNav} navKey="author-guidelines" onClick={() => onGoPage('author-guidelines')}>For Authors</NavLink></li>
            <li><NavLink activeNav={activeNav} navKey="dates" onClick={() => onGoSection('dates')}>Program</NavLink></li>
            <li ><NavLink activeNav={activeNav} navKey="venue" onClick={() => onGoPage('venue')}>Venue</NavLink></li>
            <li><NavLink activeNav={activeNav} navKey="contact" onClick={() => onGoSection('site-footer')}>Contact</NavLink></li>
          </ul>
          <button className={`hamburger ${mobileOpen ? 'open' : ''}`} onClick={onToggleMobile} aria-controls="mobile-nav" aria-expanded={mobileOpen} aria-label="Toggle navigation">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>
      <div id="mobile-nav" className={mobileOpen ? 'open' : ''}>
        <ul>
          <li><NavLink activeNav={activeNav} navKey="home" onClick={() => onGoSection('home')}>Home</NavLink></li>
          <li className="mobile-nav-group">
            <span className="mobile-nav-label">About</span>
            <ul className="mobile-submenu">
              <li><NavLink activeNav={activeNav} navKey="about-conference" onClick={() => onGoSection('about-conference')}>About Conference</NavLink></li>
              <li><NavLink activeNav={activeNav} navKey="about-institute" onClick={() => onGoSection('about-institute')}>About Institute</NavLink></li>
              <li><NavLink activeNav={activeNav} navKey="about-city" onClick={() => onGoSection('about-city')}>About City</NavLink></li>
            </ul>
          </li>
          <li><NavLink activeNav={activeNav} navKey="committee" onClick={() => onGoPage('committee')}>Committee</NavLink></li>
          <li><NavLink activeNav={activeNav} navKey="author-guidelines" onClick={() => onGoPage('author-guidelines')}>For Authors</NavLink></li>
          <li><NavLink activeNav={activeNav} navKey="dates" onClick={() => onGoSection('dates')}>Program</NavLink></li>
          <li><NavLink activeNav={activeNav} navKey="venue" onClick={() => onGoPage('venue')}>Venue</NavLink></li>
          <li><NavLink activeNav={activeNav} navKey="contact" onClick={() => onGoSection('site-footer')}>Contact</NavLink></li>
        </ul>
      </div>
    </>
  );
}

function NavLink({ activeNav, children, navKey, onClick }) {
  return (
    <a
      href="/"
      data-nav={navKey}
      className={activeNav === navKey ? 'active' : ''}
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  );
}

function HomePage({ onGoPage, onImageClick }) {
  const cityPlaces = [
    { src: ambadevi, alt: "Ambadevi Temple", desc: "A historic Hindu temple dedicated to Goddess Amba.", mapQuery: 'Ambadevi Temple, Amravati, Maharashtra' },
    { src: chikhaldara, alt: "Chikhaldara Hill Station", desc: "Scenic hill station renowned as the only hill station in the Vidarbha region.", mapQuery: 'Chikhaldara Hill Station, Chikhaldara, Maharashtra' },
    { src: melghat, alt: "Melghat Tiger Reserve", desc: "Among the first nine tiger reserves of India to be notified in 1973 under Project Tiger.", mapQuery: 'Melghat Tiger Reserve, Amravati, Maharashtra' },
    { src: upperwardha, alt: "Upper Wardha Dam", desc: "known as Nal Damayanti Sagar, is a major earthfill gravity dam on the Wardha River ", mapQuery: 'Upper Wardha Dam, Amravati, Maharashtra' },
    { src: shegao, alt: "Shri Gajanan Maharaj Mandir", desc: "A highly revered pilgrimage site and the Samadhi shrine of the 19th-century saint Shri Gajanan Maharaj.", mapQuery: 'Shri Gajanan Maharaj Mandir, Shegaon, Maharashtra' },
    // { src: dharkhora, alt: "Dharkhora Waterfall", desc: "Dharkhora Waterfall is a scenic, monsoon-fed waterfall", mapQuery: 'Dharkhora Waterfall, Amravati, Maharashtra' },
    { src: semadoh, alt: "Semadoh Elephant Ride", desc: "It offers elephant safari rides, allowing tourists to explore the dense Satpura forest and observe wildlife", mapQuery: 'Semadoh, Melghat, Maharashtra' },
  ];

  function handleOpenMap(event, place) {
    event.stopPropagation();
    window.open(buildGoogleMapUrl(place.mapQuery), '_blank', 'noopener,noreferrer');
  }

  return (
    <>
      <section id="home" className="section" style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem', textAlign: 'center', background: 'var(--bg)' }}>
        <div className="hero-inner section-inner">
          <h1 className="hero-title">
            International Conference on Automation<br />and Resilient Innovative Expert System
            <span className="blue">ICARIES 2026</span>
          </h1>
          <p className="hero-sponsored">Hosted by Prof. Ram Meghe Institute of Technology &amp; Research, Badnera</p>
          <div className="hero-meta">
            <div className="hero-meta-item">{icons.cal} Date - coming soon</div>
            <div className="hero-meta-item">{icons.loc} PRMITR&amp;R, Amravati - INDIA</div>
          </div>
          <div className="hero-btns">
            <button className="btn btn-blue" onClick={() => onGoPage('author-guidelines')}>{icons.arr} Call for Papers</button>
            <button className="btn btn-outline-blue" onClick={() => onGoPage('payment')}>Submit Paper {icons.arr}</button>
          </div>
        </div>
      </section>

      <section id="about-conference" className="section alt">
        <div className="section-inner">
          <div className="welcome-grid">
            <div>
              <span className="sec-eyebrow">About the Conference</span>
              <h2 className="sec-title">Welcome To ICARIES Conference 2026</h2>
              <div className="sec-bar"></div>
              <div className="welcome-text">
                <p>We are delighted to invite you to the 2nd International Conference on Intelligent Computing and Sustainable Innovation in Technology (ICARIES), scheduled to take place from September 8th to 10th, 2026. Hosted by Silicon University in Odisha, India, this conference promises to be a pivotal event for professionals and enthusiasts in the fields of technology, engineering, and innovation.</p>
                <p>ICARIES provides a dynamic platform for researchers, academics, industry professionals, and policymakers to exchange ideas, present their latest research findings, and explore innovative solutions in the realms of intelligent computing and sustainable technology. This interdisciplinary conference aims to foster collaboration and knowledge sharing across a range of specialized tracks.</p>
                <p>ICARIES 2026 is organized in hybrid mode, bolstering the global presence of the event. Delegates will be able to decide whether to attend physically or virtually. We look forward to meeting you at Silicon University, Odisha or virtually.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="dates" className="section">
        <div className="section-inner">
          <div style={{ textAlign: 'center' }}>
            <span className="sec-eyebrow">Mark Your Calendar</span>
            <h2 className="sec-title">Important <span className="blue">Dates</span></h2>
            <div className="sec-bar center"></div>
          </div>
          <div className="dates-grid" style={{ marginTop: '2.5rem' }}>
            {datesData.dates.map((date) => (
              <div className="date-card reveal" key={date.label}>
                <div className="date-label">{date.label}</div>
                <div className="date-val">{date.date}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="speakers" className="section alt">
        <div className="section-inner">
          <div style={{ textAlign: 'center' }}>
            <span className="sec-eyebrow">Keynote Speakers</span>
            <h2 className="sec-title">Distinguished <span className="blue">Speakers</span></h2>
            <div className="sec-bar center"></div>
            <p className="sec-sub" style={{ margin: '0 auto' }}>Leading minds in Automation &amp; Intelligent Expert Systems</p>
          </div>
          <div className="speakers-grid">
            {[1, 2, 3].map((speaker) => (
              <div className="spk-card reveal" key={speaker}>
                <div className="spk-photo">{icons.user}</div>
                <div className="spk-info">
                  <span className="spk-badge">Keynote Speaker</span>
                  <div className="spk-name">Coming Soon</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about-institute" className="section alt">
        <div className="section-inner">
          <div className="about-grid">
            <div className="reveal">
              <span className="sec-eyebrow">About the Institute</span>
              <h2 className="sec-title">Prof. Ram Meghe Institute of Technology and Research (PRMITR)</h2>
              <div className="sec-bar"></div>
              <div className="about-text">
                <p>The Vidarbha Youth Welfare Society's Prof. Ram Meghe Institute of Technology &amp; Research, Badnera-Amravati (an Autonomous Institute and formerly well known as College of Engineering Badnera), is a leading technological institute from Vidarbha. Established in the year 1983, the institute has a prestigious standing amongst the topmost Technical Institutes of Maharashtra.</p>
                <p>PRMITR has a legacy of 43 years in terms of research collaboration and student engagement in multiple UG courses like Computer Science and Engineering, Civil Engineering, Information Technology, Electronics and Telecommunication Engineering, Artificial Intelligence and Data Science, Computer Science and Engineering-IOT and Mechanical Engineering.</p>
                <p>The institute is approved by AICTE, New Delhi, accredited by National Assessment and Accreditation Council (NAAC), Bangalore with Grade 'A+' and some of its UG programmes are accredited thrice (03) by the National Board of Accreditation (NBA), New Delhi. The institute is recognized by Directorate of Technical Education (DTE Mumbai), Govt. of Maharashtra and affiliated to Sant Gadge Baba Amravati University, Amravati.</p>
              </div>
            </div>
            <div className="about-img reveal">
              <img src={prmitr} alt="PRMITR Campus" />
            </div>
          </div>
        </div>
      </section>

      <section id="venue" className="section">
        <div className="section-inner">
          <div className="venue-copy">
            <div id="about-city">
              <span className="sec-eyebrow">The Host City</span>
              <h2 className="sec-title">About Amravati City</h2>
              <div className="sec-bar"></div>
              <div className="about-text">
                <p>Amravati, often called the cultural capital of Vidarbha, is a significant city in Maharashtra. It is renowned for its historical temples, particularly the Ambadevi Temple, and serves as an educational hub with several universities and colleges.</p>
                <p>The city holds a rich heritage and is a gateway to Melghat Tiger Reserve, offering both urban amenities and proximity to natural beauty. Amravati is strategically located and well-connected, making it an ideal venue for international intellectual gatherings.</p>
              </div>

              <div className="city-highlights">
                {[
                  { title: "Historical Legacy", text: "Rich in history, known as the 'Indrapuri' with monuments dating back centuries.", img: shegao },
                  { title: "Connectivity", text: "Excellent rail (Badnera Junction) and road links, with Nagpur airport nearby.", img: connectivity },
                  { title: "Pleasant Climate", text: "June - Jully offers a wonderful monsoon chill and lush green landscapes.", img: chikhaldara }
                ].map((h, i) => (
                  <div className="city-highlight-card reveal" key={i}>
                    {h.img ? <img src={h.img} alt={h.title} className="highlight-img" /> : <div className="highlight-icon">{h.icon}</div>}
                    <div className="highlight-info">
                      <h4>{h.title}</h4>
                      <p>{h.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="city-gallery-title">Explore Beautiful <span className="blue">Amravati</span></div>
              <div className="city-gallery">
                {cityPlaces.map((place, idx) => (
                  <div className="city-card reveal" key={idx} onClick={() => onImageClick(place)}>
                    <div className="city-thumb">
                      <img src={place.src} alt={place.alt} />
                      <div className="city-overlay">
                        <span className="expand-icon">+</span>
                      </div>
                    </div>
                    <div className="city-info">
                      <h3>{place.alt}</h3>
                      <p>{place.desc}</p>
                      <div className="city-actions">
                        <button
                          type="button"
                          className="map-btn map-btn-primary"
                          onClick={(event) => handleOpenMap(event, place)}
                        >
                          Map
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function CommitteePage() {
  return (
    <>
      <div className="subpage-hero">
        <div className="subpage-hero-inner">
          <span className="sec-eyebrow">ICARIES 2026</span>
          <h1 className="sec-title" style={{ fontSize: 'clamp(1.6rem,4vw,2.8rem)' }}>Technical Program Committee</h1>
          <div className="sec-bar"></div>
        </div>
      </div>

      <div className="section">
        <div className="section-inner">
          <div className="group-label">International Committee</div>
          <div className="members-grid">{renderMemberCards(committeeData.international)}</div>
          <div className="divider"></div>
          <div className="group-label">National Committee</div>
          <div className="members-grid">{renderMemberCards(committeeData.national)}</div>
        </div>
      </div>

      <div className="banner-dark">
        <h2>Organizing <span>Team</span></h2>
      </div>

      <div className="section">
        <div className="section-inner">
          <div className="group-label">Organizing Committee</div>
          <div className="members-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>{renderMemberCards(committeeData.organizing, true)}</div>
          <div className="divider"></div>
          <div className="group-label">Chair Persons &amp; Publication Chairs</div>
          <div className="members-grid">{renderMemberCards(committeeData.chairs, true)}</div>
        </div>
      </div>
    </>
  );
}

function renderMemberCards(list, showRole = false) {
  return list.map((member) => (
    <div className="member-card reveal" key={`${member.name}-${member.role || 'member'}`}>
      {showRole ? <span className="member-role">{member.role}</span> : null}
      <div className="member-name">{member.name}</div>
      {member.org ? <div className="member-org">{member.org}</div> : null}
    </div>
  ));
}

function AuthorsPage() {
  return (
    <>
      <div className="subpage-hero">
        <div className="subpage-hero-inner">
          <span className="sec-eyebrow">For Researchers</span>
          <h1 className="sec-title" style={{ fontSize: 'clamp(1.6rem,4vw,2.8rem)' }}>Author Guidelines</h1>
          <div className="sec-bar"></div>
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '.9rem', marginTop: '.3rem' }}>Please follow these instructions carefully to ensure your submission is processed correctly.</p>
        </div>
      </div>

      <div className="section">
        <div className="authors-wrap">
          <ul className="g-list">
            {authorsData.guidelines.map((guideline, index) => (
              <li className="g-item" key={guideline}>
                <div className="g-num">{index + 1}</div>
                <div className="g-text">{guideline}</div>
              </li>
            ))}
          </ul>

          <div className="notes-box">
            <div className="notes-title">{icons.info} Important Notes</div>
            <ul className="notes-list">
              {authorsData.notes.map((note) => (
                <li className={note.highlight ? 'hl' : ''} key={note.text}>{note.text}</li>
              ))}
            </ul>
          </div>

          <div style={{ margin: '2.5rem 0' }}>
            <div className="dtable-title">Important Dates</div>
            <table className="dtable">
              <tbody>
                {datesData.dates.map((date) => (
                  <tr key={date.label}>
                    <td>{date.label}</td>
                    <td>{date.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="submit-box">
            <div className="submit-title">Submit Research Paper</div>
            <p className="submit-desc">Authors are invited to submit their original and unpublished research papers in the prescribed format. All submissions will undergo a peer-review process.</p>
            <ul className="submit-list">
              {authorsData.submitPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="submit-btns">
              <button className="btn btn-blue">Submit Paper {icons.arr}</button>
              <button className="btn btn-outline-blue">Download Template</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function PaymentPage() {
  return (
    <>
      <div className="subpage-hero">
        <div className="subpage-hero-inner">
          <span className="sec-eyebrow">ICARIES 2026</span>
          <h1 className="sec-title">Payment Section</h1>
          <div className="sec-bar"></div>
        </div>
      </div>

      <div className="section">
        <div className="section-inner">
          <h2>Registration Payment Details</h2>
          <div className="members-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="member-card">
              <div className="member-name">Bank Details</div>
              <div className="member-org">Account Name: ICARIES 2026</div>
              <div className="member-org">Account Number: XXXXXXXX</div>
              <div className="member-org">IFSC Code: XXXXX</div>
            </div>

            <div className="member-card">
              <div className="member-name">UPI Payment</div>
              <div className="member-org">UPI ID: example@upi</div>
              <div className="member-org">Scan QR Code (to be added)</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function VenuePage() {
  return (
    <>
      <div className="subpage-hero">
        <div className="subpage-hero-inner">
          <span className="sec-eyebrow">Visit PRMITR</span>
          <h1 className="sec-title" style={{ fontSize: 'clamp(1.6rem,4vw,2.8rem)' }}>
            Venue Information
          </h1>
          <div className="sec-bar"></div>
        </div>
      </div>

      <section className="section">
        <div className="section-inner">
          <span className="sec-eyebrow">Section 1</span>
          <h2 className="sec-title">Location</h2>
          <div className="sec-bar"></div>
          <p>Address, map, and campus details here.</p>
        </div>
      </section>

      <section className="section alt">
        <div className="section-inner">
          <span className="sec-eyebrow">Section 2</span>
          <h2 className="sec-title">Accommodation</h2>
          <div className="sec-bar"></div>
          <p>Hotels, guest houses, room types, contact info here.</p>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <span className="sec-eyebrow">Section 3</span>
          <h2 className="sec-title">Transportation Modes</h2>
          <div className="sec-bar"></div>
          <p>Rail, road, airport, cab, bus details here.</p>
        </div>
      </section>
    </>
  );
}


function SiteFooter({ onGoPage, onGoSection }) {
  return (
    <footer id="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <div className="footer-logo-wrap">
              <img src={logo} alt="ICARIES 2026" className="footer-logo-img" />
              <div>
                <span className="footer-brand-name">ICARIES 2026</span>
                <span className="footer-brand-tag">PRMITR, Badnera</span>
              </div>
            </div>
            <p className="footer-desc">
              2nd International Conference on Automation and Resilient Innovative Expert System. 
              A flagship event fostering global innovation in intelligent systems and sustainable technology.
            </p>
            <div className="footer-socials">
              {['fb', 'tw', 'ln', 'ig'].map(s => (
                <span key={s} className="social-icon"></span>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h4>Conference</h4>
            <ul>
              <li><a href="/" onClick={(e) => { e.preventDefault(); onGoSection('about-conference'); }}>About Conference</a></li>
              <li><a href="/" onClick={(e) => { e.preventDefault(); onGoSection('speakers'); }}>Keynote Speakers</a></li>
              <li><a href="/" onClick={(e) => { e.preventDefault(); onGoSection('dates'); }}>Important Dates</a></li>
              <li><a href="/" onClick={(e) => { e.preventDefault(); onGoPage('committee'); }}>Committees</a></li>
              <li><a href="/" onClick={(e) => { e.preventDefault(); onGoSection('venue'); }}>Venue & Travel</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>For Authors</h4>
            <ul>
              <li><a href="/" onClick={(e) => { e.preventDefault(); onGoPage('author-guidelines'); }}>Call for Papers</a></li>
              <li><a href="/" onClick={(e) => { e.preventDefault(); onGoPage('author-guidelines'); }}>Submission Guidelines</a></li>
              <li><a href="/" onClick={(e) => { e.preventDefault(); onGoPage('payment'); }}>Registration Fees</a></li>
              <li><a href="/" onClick={(e) => { e.preventDefault(); onGoPage('payment'); }}>Payment Portal</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Us</h4>
            <div className="footer-c-item">
              {icons.loc}
              <span>Prof. Ram Meghe Institute of Technology and Research, Badnera-Amravati, MH, India</span>
            </div>
            <div className="footer-c-item">
              {icons.mail}
              <span>info@icaries.in</span>
            </div>
            <div className="footer-c-item">
               <svg style={{width:'14px', height:'14px'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.81 12.81 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
               <span></span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-inner">
            <div>
              <span>© 2026 ICARIES. Hosted with excellence by PRMITR-Badnera.</span>
              <div style={{ fontSize: '0.75rem', marginTop: '0.3rem', opacity: '0.6' }}>
                Developed by Shweta Rathod & Amruta Topale
              </div>
            </div>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function scrollToSection(id, navbar) {
  const element = document.getElementById(id);
  if (!element) {
    return;
  }

  if (id === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const navOffset = (navbar?.offsetHeight || 0) + 16;
  const top = element.getBoundingClientRect().top + window.scrollY - navOffset;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

export default App;
