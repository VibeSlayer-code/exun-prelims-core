import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { servicesList } from './servicesData'; 
import './Services.css';
import toast from 'react-hot-toast';

function Services() {
  const navigate = useNavigate();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [massValue, setMassValue] = useState(5);
  const [targetObject, setTargetObject] = useState("");
  const [selectedHazards, setSelectedHazards] = useState({});

  useEffect(() => {
    document.body.style.zoom = "100%";
    
    const loggedInStatus = localStorage.getItem('login') === 'true';
    setIsLoggedIn(loggedInStatus);
    
    if (loggedInStatus) {
      setUserImage(localStorage.getItem('userImage'));
      setUserName(localStorage.getItem('userName') || "Agent");
      setUserEmail(localStorage.getItem('userEmail'));
    }
  }, []);

  const handleSignOut = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.location.reload();
  };

  const toggleHazard = (hazard) => {
    setSelectedHazards(prev => ({
        ...prev,
        [hazard]: !prev[hazard]
    }));
  };

  const openRequestModal = () => setIsModalOpen(true);
  const closeRequestModal = () => setIsModalOpen(false);

  const handleSubmitRequest = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
        toast.error("Access Denied. Login Required.");
        return;
    }

    const squadSize = Math.ceil(massValue / 5);
    const estimatedCost = 10 + (massValue * 5);
    const hazardsList = Object.keys(selectedHazards).filter(k => selectedHazards[k]).join(', ') || "None";

    const templateParams = {
        to_email: userEmail,
        to_name: userName,
        service_name: "CUSTOM MISSION ARCHITECT",
        cost: `$${estimatedCost}`,
        specifications: `
          TARGET: ${targetObject}
          MASS: ${massValue} grams
          HAZARDS DETECTED: ${hazardsList}
          REQUIRED SQUAD: ${squadSize} Units
          WARNING: ${massValue > 30 ? "HEAVY LIFT PROTOCOL" : "STANDARD"}
        `
    };

    const toastId = toast.loading("Transmitting to Guild...");

    emailjs.send(
        'service_jtc96ia',     
        'template_gfukewt',
        templateParams, 
        'c7IUhteuvXVvMlGqF' 
    )
    .then(() => {
        toast.success(`MISSION UPLOADED.\nTarget: ${targetObject}`, { id: toastId }, `Check your mail.`);
        
        closeRequestModal();
        setTargetObject("");
        setMassValue(5);
        setSelectedHazards({});
    }, (error) => {
        console.error(error);
        toast.error("Transmission Failed.", { id: toastId });
    });
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
                <button className="mini-signout-btn" onClick={handleSignOut} title="Sign Out">✕</button>
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
                    <h2>Architect New Mission</h2>
                    <button className="close-modal-btn" onClick={closeRequestModal}>×</button>
                </div>
                
                <form className="modal-form" onSubmit={handleSubmitRequest}>
                    
                    <div className="form-group">
                        <label>Target Object / Obstacle</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Dead Rat, AA Battery, Water Puddle" 
                            required 
                            value={targetObject}
                            onChange={(e) => setTargetObject(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label style={{display:'flex', justifyContent:'space-between'}}>
                            <span>Estimated Mass</span>
                            <span style={{color:'#8654d8'}}>{massValue} grams</span>
                        </label>
                        <input 
                            type="range" 
                            min="1" max="50" 
                            value={massValue} 
                            className="range-slider"
                            onChange={(e) => setMassValue(e.target.value)}
                        />
                        <div className="range-labels">
                            <span>Feather</span>
                            <span>Coin</span>
                            <span>Battery</span>
                            <span>Rock</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Environmental Hazards</label>
                        <div className="hazard-grid">
                            {['Insect', 'Water', 'Electricity', 'Height'].map(h => (
                                <div key={h} className="hazard-checkbox" onClick={() => toggleHazard(h)}>
                                    <input 
                                        type="checkbox" 
                                        checked={!!selectedHazards[h]} 
                                        readOnly 
                                    />
                                    <label>{h}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="squad-estimator">
                        <div className="est-row">
                            <span>Required Operatives:</span>
                            <strong>{Math.ceil(massValue / 5)} Units</strong>
                        </div>
                        <div className="est-row">
                            <span>Est. Resource Cost:</span>
                            <strong>${10 + (massValue * 5)}</strong>
                        </div>
                        <div className="est-warning">
                            {massValue > 30 ? "⚠ WARNING: HIGH MASS. PULLEY SYSTEM REQUIRED." : "Standard Gravity Parameters."}
                        </div>
                    </div>

                    <button type="submit" className="modal-submit-btn">INITIATE CONTRACT</button>
                </form>
            </div>
        </div>
      )}

    </div>
  );
}

export default Services;