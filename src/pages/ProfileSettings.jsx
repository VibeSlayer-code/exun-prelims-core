import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileSettings.css";

function ProfileSettings() {
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
    bannerColor: "#8654D8",
  });

  useEffect(() => {
    const saved = localStorage.getItem("profileData");
    if (saved) {
      setProfileData(JSON.parse(saved));
    } else {
      const userName = localStorage.getItem("userName") || "";
      const userImage = localStorage.getItem("userImage") || null;
      setProfileData((prev) => ({
        ...prev,
        fullName: userName,
        profilePic: userImage,
      }));
    }
  }, []);

  const handleImageSelect = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileData((prev) => ({
          ...prev,
          [type]: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleColorChange = (color) => {
    setProfileData((prev) => ({
      ...prev,
      bannerColor: color,
    }));
  };

  const addSkill = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault();
      const newSkill = e.target.value.trim();
      if (!profileData.skills.includes(newSkill)) {
        setProfileData((prev) => ({
          ...prev,
          skills: [...prev.skills, newSkill],
        }));
      }
      e.target.value = "";
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const removeProfilePic = () => {
    setProfileData((prev) => ({
      ...prev,
      profilePic: null,
    }));
  };

  const saveProfile = (e) => {
    localStorage.setItem("profileData", JSON.stringify(profileData));
    if (profileData.fullName) {
      localStorage.setItem("userName", profileData.fullName);
    }
    if (profileData.profilePic) {
      localStorage.setItem("userImage", profileData.profilePic);
    }
    const btn = e.currentTarget;
    btn.disabled = true;
    const originalContent = btn.innerHTML;
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Saved!`;
    btn.style.backgroundColor = "#10b981";
    setTimeout(() => {
      btn.innerHTML = originalContent;
      btn.style.backgroundColor = "";
      btn.disabled = false;
    }, 2000);
  };

  const resetForm = () => {
    if (window.confirm("Are you sure you want to reset all changes?")) {
      localStorage.removeItem("profileData");
      window.location.reload();
    }
  };

  const logout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.clear();
      navigate("/");
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const adjustColor = (color, amount) => {
    const num = parseInt(color.replace("#", ""), 16);
    const r = Math.min(255, (num >> 16) + amount);
    const g = Math.min(255, ((num >> 8) & 0x00ff) + amount);
    const b = Math.min(255, (num & 0x0000ff) + amount);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const bannerStyle = profileData.banner
    ? {
        backgroundImage: `url(${profileData.banner})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        background: `linear-gradient(135deg, ${
          profileData.bannerColor
        } 0%, ${adjustColor(profileData.bannerColor, 20)} 100%)`,
      };

  return (
    <div className="profile-settings-container">
      <div className="profile-settings-header">
        <div className="header-content">
          <h1>Profile Settings</h1>
          <p>Manage your profile information and customize your appearance</p>
        </div>
        <div className="header-actions">
          <button className="action-btn back-btn" onClick={goBack}>
            <div className="btn-icon">
              <svg viewBox="0 0 512 512">
                <path d="M256 504C119 504 8 393 8 256S119 8 256 8s248 111 248 248-111 248-248 248zM217 320c-8.5 0-16.6-3.4-22.6-9.4l-80-80c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L216 242.7V128c0-17.7 14.3-32 32-32s32 14.3 32 32v114.7l59.3-59.3c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-80 80c-6 6-14.1 9.4-22.6 9.4H217z" />
              </svg>
            </div>
            <div className="btn-text">Back</div>
          </button>
          <button className="action-btn logout-btn" onClick={logout}>
            <div className="btn-icon">
              <svg viewBox="0 0 512 512">
                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
              </svg>
            </div>
            <div className="btn-text">Logout</div>
          </button>
        </div>
      </div>

      <div className="settings-section">
        <div className="section-title">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          Profile Picture
        </div>
        <div className="profile-upload">
          <div className="profile-pic-container">
            <div className="settings-profile-pic">
              {profileData.profilePic ? (
                <img src={profileData.profilePic} alt="Profile" />
              ) : (
                <svg
                  width="56"
                  height="56"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#666"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              )}
            </div>
          </div>
          <div className="upload-controls">
            <p>
              Upload a profile picture to personalize your account.
              <br />
              Recommended size: 400x400px
            </p>
            <div className="upload-buttons">
              <input
                type="file"
                id="profilePicInput"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleImageSelect(e, "profilePic")}
              />
              <button
                className="settings-btn btn-primary"
                onClick={() =>
                  document.getElementById("profilePicInput").click()
                }
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                Upload Photo
              </button>
              <button
                className="settings-btn btn-danger"
                onClick={removeProfilePic}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="section-title">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          Banner
        </div>
        <input
          type="file"
          id="bannerInput"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => handleImageSelect(e, "banner")}
        />
        <div
          className={`banner-upload ${profileData.banner ? "has-image" : ""}`}
          style={bannerStyle}
          onClick={() => document.getElementById("bannerInput").click()}
        >
          {!profileData.banner && (
            <div className="banner-placeholder">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <span>Click to upload banner image</span>
              <span>Recommended: 1200x300px</span>
            </div>
          )}
        </div>
        <div className="settings-form-group">
          <label>Or choose a banner color</label>
          <div className="color-picker-wrapper">
            <div className="color-preview">
              <div
                className="color-display"
                style={{ background: profileData.bannerColor }}
              ></div>
              <input
                type="color"
                value={profileData.bannerColor}
                onChange={(e) => handleColorChange(e.target.value)}
              />
            </div>
            <input
              type="text"
              value={profileData.bannerColor}
              onChange={(e) => handleColorChange(e.target.value)}
              placeholder="#8654D8"
            />
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="section-title">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          Basic Information
        </div>
        <div className="settings-form-row">
          <div className="settings-form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={profileData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          <div className="settings-form-group">
            <label>Username</label>
            <input
              type="text"
              value={profileData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="@username"
            />
          </div>
        </div>
        <div className="settings-form-row">
          <div className="settings-form-group">
            <label>Location</label>
            <input
              type="text"
              value={profileData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="City, Country"
            />
          </div>
          <div className="settings-form-group">
            <label>Role</label>
            <input
              type="text"
              value={profileData.role}
              onChange={(e) => handleInputChange("role", e.target.value)}
              placeholder="Your role or title"
            />
          </div>
        </div>
        <div className="settings-form-group full">
          <label>Bio</label>
          <textarea
            value={profileData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            placeholder="Tell us about yourself..."
          ></textarea>
        </div>
      </div>

      <div className="settings-section">
        <div className="section-title">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
          </svg>
          Skills & Interests
        </div>
        <div className="settings-form-group">
          <label>Add your skills (press Enter to add)</label>
          <div className="skills-input">
            {profileData.skills.map((skill, index) => (
              <div key={index} className="skill-item">
                <span>{skill}</span>
                <button onClick={() => removeSkill(skill)}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))}
            <div className="skill-input-wrapper">
              <input
                type="text"
                placeholder="Type and press Enter..."
                onKeyPress={addSkill}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="settings-save-section">
        <button className="settings-btn btn-secondary" onClick={resetForm}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="1 4 1 10 7 10"></polyline>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
          </svg>
          Reset
        </button>
        <button className="settings-btn btn-primary" onClick={saveProfile}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default ProfileSettings;
