import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { servicesList } from './servicesData';
import './ServiceDetail.css';
import VideoUplink from '../components/VideoUplink';

function ServiceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const service = servicesList.find(s => s.id === parseInt(id)) || servicesList[0];

    const [activeSelections, setActiveSelections] = useState({});

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userImage, setUserImage] = useState(null);
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");

    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    useEffect(() => {
        document.body.style.zoom = "100%";
        window.scrollTo(0, 0);

        const loggedInStatus = localStorage.getItem('login') === 'true';
        setIsLoggedIn(loggedInStatus);

        if (loggedInStatus) {
            setUserImage(localStorage.getItem('userImage'));
            setUserName(localStorage.getItem('userName') || "Agent");
            setUserEmail(localStorage.getItem('userEmail') || "");
        }

        if (service.options) {
            const defaults = {};
            service.options.forEach(opt => {
                defaults[opt.label] = opt.choices[0];
            });
            setActiveSelections(defaults);
        }
    }, [service]);

    const handleSelection = (label, choice) => {
        setActiveSelections(prev => ({ ...prev, [label]: choice }));
    };

    const handleSignOut = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        window.location.reload();
    };

    const handleBookService = () => {
        if (!isLoggedIn) {
            alert("Access Denied: Please Log In to the Network.");
            navigate('/login');
            return;
        }

        const templateParams = {
            to_email: userEmail,
            to_name: userName,
            service_name: service.title,
            specifications: Object.entries(activeSelections).map(([key, val]) => `${key}: ${val}`).join(', '),
            cost: service.price
        };

        emailjs.send('service_jtc96ia', 'template_gfukewt', templateParams, 'c7IUhteuvXVvMlGqF')
            .then(() => {
                alert(`CONTRACT CONFIRMED. \n\nTarget: ${service.title}\nSpecs: ${templateParams.specifications}\n\nConfirmation sent to ${userEmail}.`);
            }, (error) => {
                console.error('FAILED...', error.text);
                alert("Network Error: Contract failed to transmit.");
            });
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();

        const templateParams = {
            to_email: userEmail,
            to_name: userName,
            message: "Review received. Your feedback helps the Guild grow stronger.",
            review_content: reviewText
        };

        emailjs.send('service_jtc96ia', 'template_nshvqss', templateParams, 'c7IUhteuvXVvMlGqF')
            .then(() => {
                alert("Review Uploaded to the Archive.");
                setIsReviewOpen(false);
                setReviewText("");
            });
    };

    return (
        <div className="detail-page">

            <nav className="navigation-bar">
                <div className="brand-section">
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                        <div className="brand-icon">
                            <img src="/assets/Global/logo.png" alt="Nixun Logo" />
                        </div>
                        <div className="brand-name">Nixun</div>
                    </Link>
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

            <div className="detail-container">
                <div className="detail-image-section">
                    <img src={service.image} alt={service.title} className="dither-img" />
                    <div className="img-overlay"></div>
                </div>

                <div className="detail-content">
                    <h1 className="detail-title">{service.title}</h1>
                    <div className="detail-line"></div>

                    <p className="detail-desc">
                        {service.description}
                        <br /><br />
                        <span className="warning-text">Hazard pay applies for active zones. Ensure bio-rhythms are calibrated.</span>
                    </p>

                    <div className="options-container">
                        {service.options && service.options.map((opt, index) => (
                            <div key={index} className="selection-group">
                                <label>{opt.label}:</label>
                                <div className="pills">
                                    {opt.choices.map((choice) => (
                                        <button
                                            key={choice}
                                            className={`pill ${activeSelections[opt.label] === choice ? 'active' : ''}`}
                                            onClick={() => handleSelection(opt.label, choice)}
                                        >
                                            {choice}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="action-area">
                        <p className="review-link" onClick={() => setIsReviewOpen(true)}>LEAVE A REVIEW</p>
                        <div className="button-stack">
                            <button 
                                className="outline-btn" 
                                onClick={() => setIsVideoOpen(true)}
                            >
                                Speak with person
                            </button>
                            <button className="book-btn" onClick={handleBookService}>Book Service</button>
                        </div>
                    </div>
                </div>
            </div>

            {isReviewOpen && (
                <div className="modal-overlay" onClick={() => setIsReviewOpen(false)}>
                    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Leave a Record</h2>
                            <button className="close-modal-btn" onClick={() => setIsReviewOpen(false)}>×</button>
                        </div>
                        <form className="modal-form" onSubmit={handleSubmitReview}>
                            <div className="form-group">
                                <label>Experience Log</label>
                                <textarea
                                    rows="4"
                                    placeholder="Describe your experience with this service..."
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="modal-submit-btn">ARCHIVE REVIEW</button>
                        </form>
                    </div>
                </div>
            )}
            {isVideoOpen && (
                <VideoUplink 
                    onClose={() => setIsVideoOpen(false)} 
                    serviceName={service.title} 
                />
            )}

        </div> // <--- This is the end of the "detail-page" div
    );
}
export default ServiceDetail;