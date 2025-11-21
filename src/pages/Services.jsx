import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { servicesList } from './servicesData'; 
import './Services.css';

function Services() {
  const navigate = useNavigate();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [userName, setUserName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    document.body.style.zoom = "100%";
    const loggedInStatus = localStorage.getItem('login') === 'true';
    setIsLoggedIn(loggedInStatus);
    if (loggedInStatus) {
      setUserImage(localStorage.getItem('userImage'));
      setUserName(localStorage.getItem('userName') || "Agent");
    }
  }, []);

  const handleSignOut = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.location.reload();
  };

  const openRequestModal = () => setIsModalOpen(true);
  const closeRequestModal = () => setIsModalOpen(false);

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    alert("Contract transmitted to the Guild.");
    closeRequestModal();
  };

  return (
    <div className="services-page">
      <div className="hero-bg"></div>

      <nav className="navigation-bar">
        <div className="brand-section">
            <div className="brand-icon">
              <img src="assets/Global/logo.png" alt="Nixun Logo" />
            </div>
            <div className="brand-name">Nixun</div>
        </div>

        <div className="navigation-menu-container">
            <ul className="navigation-menu">
              <li><Link to="/" className="navigation-link">Home</Link></li>
              <li><span className="navigation-separator">/</span></li>
              <li><Link to="/services" className="navigation-link active">Jobs</Link></li>
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

      <header className="svc-hero">
        <h1>Explore our services</h1>
        <p>
          Navigate the sub-perceptual economy. We facilitate the exchange of mass for memory, 
          offering specialized contracts for those willing to shrink their footprint to expand their reach.
        </p>
        <button className="svc-cta-btn" onClick={openRequestModal}>REQUEST A SERVICE</button>
      </header>

      <div className="svc-grid">
        {servicesList.map((service, index) => (
          <div 
            key={service.id} 
            className={`svc-card ${index === 0 || index === 3 || index === 4 ? 'wide-card' : ''}`}
            onClick={() => navigate(`/service/${service.id}`)}
          >
            <div className="svc-card-img">
                {service.image ? <img src={service.image} alt={service.title} /> : <div className="img-placeholder"></div>}
                <div className="svc-overlay"></div>
            </div>
            
            <div className="svc-card-footer">
                <h3>{service.title}</h3>
                <div className="split-pill">
                    <span className="tag-part">{service.tag}</span>
                    <span className="price-part">{service.price}</span>
                </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeRequestModal}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Initiate Contract</h2>
                    <button className="close-modal-btn" onClick={closeRequestModal}>×</button>
                </div>
                <form className="modal-form" onSubmit={handleSubmitRequest}>
                    <button type="submit" className="modal-submit-btn">TRANSMIT REQUEST</button>
                </form>
            </div>
        </div>
      )}

    </div>
  );
}

export default Services;