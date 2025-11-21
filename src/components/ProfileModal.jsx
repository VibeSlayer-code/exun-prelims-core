import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileModal.css';

function ProfileModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    fullName: "",
    username: "",
    location: "",
    role: "",
    bio: "",
    skills: [],
    profilePic: null,
    banner: null,
    bannerColor: "#4a5568",
  });

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem("profileData");
      if (saved) {
        setProfileData(JSON.parse(saved));
      } else {
        setProfileData({
          fullName: localStorage.getItem('userName') || "",
          username: "",
          location: "",
          role: "",
          bio: "",
          skills: [],
          profilePic: localStorage.getItem('userImage') || null,
          banner: null,
          bannerColor: "#4a5568",
        });
      }
    }
  }, [isOpen]);

  const handleEditProfile = () => {
    navigate('/profile-settings');
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (!isOpen) return null;

  const bannerStyle = profileData.banner
    ? {
        backgroundImage: `url(${profileData.banner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    : {
        background: `linear-gradient(135deg, ${profileData.bannerColor} 0%, #2d3748 100%)`
      };

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="profile-header" style={bannerStyle}>
          <div className="profile-edit-icon" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8654D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-avatar-container">
            <div className="profile-avatar">
              {profileData.profilePic ? (
                <img src={profileData.profilePic} alt="Profile" />
              ) : (
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <circle cx="12" cy="8" r="5"/>
                  <path d="M20 21a8 8 0 1 0-16 0"/>
                </svg>
              )}
            </div>
          </div>

          <div className="profile-section">
            <div className="profile-info">
              <h1>{profileData.fullName || "User"}</h1>
              {profileData.username && <div className="profile-location">{profileData.username}</div>}
              {profileData.location && <div className="profile-city">{profileData.location}</div>}
              <div className="profile-buttons">
                <button className="profile-btn profile-btn-primary" onClick={handleEditProfile}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"/>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                  Edit Profile
                </button>
                <button className="profile-btn profile-btn-secondary" onClick={handleLogout}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Log out
                </button>
              </div>
            </div>
          </div>

          <div className="profile-info-section">
            {profileData.role && (
              <div className="profile-info-box">
                <div className="profile-info-label">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <span>Current role</span>
                </div>
                <div className="profile-info-value">{profileData.role}</div>
              </div>
            )}
            {profileData.skills && profileData.skills.length > 0 && (
              <div className="profile-info-box">
                <div className="profile-info-label">
                  <span>Skills</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                <div className="profile-skills">
                  {profileData.skills.map((skill, index) => (
                    <span key={index} className="profile-skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {profileData.bio && (
            <div className="profile-cards">
              <div className="profile-card">
                <div className="profile-card-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
                <h3>Bio</h3>
                <p>{profileData.bio}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
