import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('login') === 'true');
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('login');
    setIsLoggedIn(false);
    window.location.reload();
  };

  useEffect(() => {
    const animateCards = () => {
      const cards = document.querySelectorAll('.service-card');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect().top;
        const windowHeight = window.innerHeight - 120;
        if (rect < windowHeight) {
          card.classList.add('showww');
        }
      });
    };

    window.addEventListener('scroll', animateCards);
    animateCards();

    return () => window.removeEventListener('scroll', animateCards);
  }, []);

  return (
    <div className="home-page-wrapper">
      <div className="background-rectangle"></div>
      <div className="content-wrapper">
        <nav className="navigation-bar">
          <div className="brand-section">
            <div className="brand-icon">
              <img src="assets/Global/logo.png" alt="Nixun Logo" />
            </div>
            <div className="brand-name">Nixun</div>
          </div>
          <div className="navigation-menu-container">
            <ul className="navigation-menu">
              <li><a href="#home" className="navigation-link active">Home</a></li>
              <li><span className="navigation-separator">/</span></li>
              <li><a href="#services" className="navigation-link">Our Services</a></li>
              <li><span className="navigation-separator">/</span></li>
              <li><a href="#about" className="navigation-link">About</a></li>
            </ul>
          </div>
          {!isLoggedIn ? (
            <button className="login-button" onClick={() => navigate('/login')}>Log In</button>
          ) : (
            <button className="signout-button" onClick={handleSignOut}>Sign Out</button>
          )}
        </nav>

        <section className="hero-section" id="home">
          <div className="hero-title-container">
            <div className="hero-title-background"></div>
            <h1 className="hero-title">
              Welcome to <span className="brand-highlight">Nixun</span>, where<br />
              even the smallest jobs matter.
            </h1>
          </div>
          <p className="hero-subtitle">
            We connect ideas, people, and purpose—transforming small moments into meaningful outcomes that shape something bigger.
          </p>
        </section>

        <div className="spacing-section"></div>

        <div className="services-section">
          <div className="reviews-container">
            <div className="review-card tilt1">
              <div className="review-content">
                <h2 className="review-title">The Catacomb Map</h2>
                <ul className="review-list">
                  <li>Interactive 3D underground city map</li>
                  <li>Safety zones & travel routes</li>
                </ul>
                <Link to="/map"><button className="review-button">Explore Map</button></Link>
              </div>
            </div>

            <div className="review-card tilt2">
              <div className="review-content">
                <h2 className="review-title">Services Portal</h2>
                <ul className="review-list">
                  <li>Spy & Missing Person Finder</li>
                  <li>Forensics & Investigations</li>
                </ul>
                <Link to="/services"><button className="review-button">Open Portal</button></Link>
              </div>
            </div>

            <div className="review-card tilt3">
              <div className="review-content">
                <h2 className="review-title">Search Engine</h2>
                <ul className="review-list">
                  <li>AI-powered tiny human research</li>
                  <li>Medicine dosages & surgery</li>
                </ul>
                <Link to="/search"><button className="review-button">Search Now</button></Link>
              </div>
            </div>

            <div className="review-card tilt4">
              <div className="review-content">
                <h2 className="review-title">Knowledge Portal</h2>
                <ul className="review-list">
                  <li>Dr. Tai Ni's digitized notes</li>
                  <li>Microexperiences tourism</li>
                </ul>
                <Link to="/knowledge"><button className="review-button">Learn More</button></Link>
              </div>
            </div>
          </div>
        </div>

        <section className="testimonials-section">
          <div className="section-header">
            <h2 className="section-title">Satisfied Customers</h2>
            <p className="section-subtitle">
              See our satisfied customers </p>

            
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card rating-card" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
              <div className="rating-section">
                <div className="rating-score">4.8</div>
                <p className="rating-description">
                  We've delivered <span className="highlight">00+ Items</span> that
                  help no one with anything so yeah lmao fr.
                </p>
                <div className="company-info">
                  <div className="company-name">Nixun <p style={{ fontSize: '30px', position: 'absolute', top: '2650px', left: '284px' }}>©</p></div>
                  <div className="trust-indicators">
                    <div className="trust-avatars">
                      <div className="trust-avatar">
                        <img src="assets/Home/pfp 1.png" alt="Client" />
                      </div>
                      <div className="trust-avatar">
                        <img src="assets/Home/pfp 2.png" alt="Client" />
                      </div>
                      <div className="trust-avatar">
                        <img src="assets/Home/pfp 3.png" alt="Client" />
                      </div>
                    </div>
                    <div className="trust-text">Trusted by clients worldwide</div>
                  </div>
                  <div className="star-rating">
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                  </div>
                </div>
              </div>
              <button className="cta-button">Leave a review</button>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <img src="assets/Home/pfp 2.png" alt="Jyotsna Arora" />
                </div>
                <div className="testimonial-author">
                  <div className="author-name">Jyotsna Arora</div>
                  <div className="author-role">Coreisus</div>
                </div>
                <div className="three-dots">...</div>
              </div>
              <div className="testimonial-content">
                <div className="star-rating">
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                </div>
                <p className="testimonial-text" style={{ height: '490px' }}>
                  Incredible Service! They delivered exactly what we didn't need,
                  late, and under expectations.
                </p>
              </div>
            </div>

            <div className="testimonial-card" style={{ height: '820px' }}>
              <div className="testimonial-content">
                <div className="star-rating">
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                </div>
                <p className="testimonial-text">
                  Incredible Service! They delivered exactly what we didn't need,
                  late, and under expectations.
                </p>
              </div>
              <br />
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <img src="assets/Home/pfp 1.png" alt="Jyotsna Arora" />
                </div>
                <div className="testimonial-author">
                  <div className="author-name">Aditya Das</div>
                  <div className="author-role">ExunClan</div>
                </div>
                <div className="three-dots">...</div>
              </div>
            </div>
          </div>
        </section>

        <section className="featured-section">
          <div className="featured-image"></div>
          <div className="featured-content">
            <h2 className="featured-title">
              Highlighted <span className="brand-highlight">Feature One.</span>
            </h2>
            <p className="featured-description">
              This neutral, flexible, sans-serif typeface is the system font for
              Apple platforms. SF Pro features nine weights, variable optical
              sizes for optimal legibility, four widths, and includes a rounded
              variant. SF Pro supports over 150 languages across Latin, Greek, and
              Cyrillic scripts.
            </p>
            <button className="action-button">start hiring</button>
          </div>
        </section>

        <footer className="footer">
          <ul className="footer-links">
            <li><a href="#help" className="footer-link">Help</a></li>
            <li><span className="footer-separator">/</span></li>
            <li><a href="#terms" className="footer-link">Terms</a></li>
            <li><span className="footer-separator">/</span></li>
            <li><a href="#privacy" className="footer-link">Privacy</a></li>
          </ul>
        </footer>
      </div>
    </div>
  );
}

export default Home;
