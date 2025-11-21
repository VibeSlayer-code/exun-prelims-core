import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const loginStatus = localStorage.getItem('login') === 'true';
    setIsLoggedIn(loginStatus);

    const storedImage = localStorage.getItem('userImage');
    const defaultImage = "public\assets\Home\default.png";

    setUserImage(storedImage && storedImage !== "undefined" ? storedImage : defaultImage);
    setUserName(localStorage.getItem('userName') || "Agent");
  }, []);

  const handleSignOut = () => {
    localStorage.clear();
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
              <li><Link to="/" className="navigation-link active">Home</Link></li>
              <li><span className="navigation-separator">/</span></li>
              <li><Link to="/services" className="navigation-link">Jobs</Link></li>
              <li><span className="navigation-separator">/</span></li>
              <li><Link to="/search" className="navigation-link">Search</Link></li>
              <li><span className="navigation-separator">/</span></li>
              <li><Link to="/map" className="navigation-link">3d Map</Link></li>
              <li><span className="navigation-separator">/</span></li>
              <li><Link to="/library" className="navigation-link">Library</Link></li>
            </ul>
          </div>

          {!isLoggedIn ? (
            <button className="login-button" onClick={() => navigate('/login')}>LOG IN</button>
          ) : (
            <div className="profile-pill">
              <div className="profile-data">

                <img
                  src={userImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                  alt="User"
                  className="nav-profile-img"
                />
                <span className="nav-username">Hi, {userName}</span>
              </div>
              <button className="mini-signout-btn" onClick={handleSignOut} title="Sign Out">
                ✕
              </button>
            </div>
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
            Mobilizing a highly specialized workforce for critical objectives where conventional intervention is impossible. Discover the profound efficacy of scale optimization.
          </p>
        </section>

        <div className="spacing-section"></div>

        <div className="services-section">
          <div className="reviews-container">

            <Link to="/map" className="review-card tilt1">
              <div className="card-arrow">↗</div>
              <div className="card-content-wrapper">
                <h2 className="review-title">
                  The<br />Catacomb<br />Atlas.
                </h2>
                <ul className="review-list">
                  <li>Interactive 3D underground city map</li>
                  <li>Safety zones & travel routes</li>
                </ul>
              </div>
            </Link>

            <Link to="/services" className="review-card tilt2">
              <div className="card-arrow">↗</div>
              <div className="card-content-wrapper">
                <h2 className="review-title">
                  Optimized<br />Service<br />Portal.
                </h2>
                <ul className="review-list">
                  <li>Spy & Missing Person Finder</li>
                  <li>Forensics & Investigations</li>
                </ul>
              </div>
            </Link>

            <Link to="/search" className="review-card tilt3">
              <div className="card-arrow">↗</div>
              <div className="card-content-wrapper">
                <h2 className="review-title">
                  Neural<br />Search<br />Engine.
                </h2>
                <ul className="review-list">
                  <li>AI-powered tiny human research</li>
                  <li>Medicine dosages & surgery</li>
                </ul>
              </div>
            </Link>

            <Link to="/knowledge" className="review-card tilt4">
              <div className="card-arrow">↗</div>
              <div className="card-content-wrapper">
                <h2 className="review-title">
                  The<br />Archive<br />Of Origin.
                </h2>
                <ul className="review-list">
                  <li>Dr. Tai Ni's digitized notes</li>
                  <li>Microexperiences tourism</li>
                </ul>
              </div>
            </Link>

          </div>
        </div>

        <section className="testimonials-section">
          <div className="section-header">
            <h2 className="section-title">Satisfied Customers</h2>
            <p className="section-subtitle">
              See our satisfied customers </p>


          </div>
          <div className="testimonials-grid">

            <div className="grid-column">
              <div className="testimonial-card rating-card">

                <div className="rating-top">
                  <span className="big-score">4.8</span>
                  <p className="rating-sub">
                    We've delivered <span className="text-white">100+ Items</span> that help the smallest of our customers!
                  </p>
                </div>

                <div className="rating-bottom">
                  <div className="brand-block">
                    <h2 className="nixun-brand">Nixun<span className="copyright">©</span></h2>
                    <div className="trust-row">
                      <div className="avatars-group">
                        <img src="assets/Home/pfp 1.png" alt="" />
                        <img src="assets/Home/pfp 2.png" alt="" />
                        <img src="assets/Home/pfp 3.png" alt="" />
                      </div>

                      <div className="trust-info">
                        <div className="purple-stars small">★★★★★</div>
                        <p className="trusted-label">Trusted by clients worldwide</p>
                      </div>
                    </div>
                  </div>
                  <button className="leave-review-btn">Leave a review</button>
                </div>

              </div>
            </div>

            <div className="grid-column">
              <div className="testimonial-card profile-card">
                <div className="profile-row">
                  <img src="assets/Home/pfp 2.png" alt="Jyotsna" className="profile-img" />
                  <div>
                    <h3 className="profile-name">Jyotsna Arora</h3>
                    <p className="profile-role">Coreisus</p>
                  </div>
                </div>
                <span className="dots">...</span>
              </div>

              <div className="testimonial-card text-card middle-text-card">
                <div className="card-top-row">
                  <span className="purple-stars">★★★★★</span>
                  <span className="dots">...</span>
                </div>
                <p className="review-body">
                  I'm embarrassed I waited this long. Everything that felt monumental before now seems manageable. The clarity is startling, and frankly, a bit unfair to everyone else.
                </p>
              </div>
            </div>

            <div className="grid-column">
              <div className="testimonial-card text-card align-top">
                <h3 className="headline-review">
                  Incredible Service! Absolutely shrunk all the problems I had.
                </h3>
                <div className="card-bottom-row">
                  <span className="purple-stars">★★★★☆</span>
                  <span className="dots">...</span>
                </div>
              </div>

              <div className="testimonial-card profile-card">
                <div className="profile-row">
                  <img src="assets/Home/pfp 1.png" alt="Aditya" className="profile-img" />
                  <div>
                    <h3 className="profile-name">Aditya Das</h3>
                    <p className="profile-role">Exun Clan</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        <section className="featured-section">
          <div className="featured-image">
            <div className="featured-image">
              <img
                src="/assets/Home/mine.png"
                alt="Resource Extraction"
              />
              <div className="featured-overlay">WARNING: HIGH MASS</div>
            </div>
          </div>
          <div className="featured-content">
            <h2 className="featured-title">
              Today's Highlight: <span className="brand-highlight">Resource Extraction</span>
            </h2>
            <p className="featured-description">
              Standard contract for moving high-mass objects (AA Batteries, Bottle Caps, Raw Ore) from the Surface to the Catacombs. Requires a coordinated team to bypass physics constraints. Hazard pay applies for active zones.

            </p>
            <Link to="/services"><button className="action-button">See more</button></Link>
          </div>
        </section>
        <div style={{ height: '2px', width: '100%' }}></div>

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
