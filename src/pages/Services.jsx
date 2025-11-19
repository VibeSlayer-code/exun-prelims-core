import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

function Services() {
  const [modalActive, setModalActive] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', details: '' });

  const openModal = (service) => {
    setModalTitle(service);
    setModalActive(true);
  };

  const closeModal = () => {
    setModalActive(false);
    setFormData({ name: '', email: '', details: '' });
  };

  const handleSubmit = () => {
    if (formData.name && formData.email && formData.details) {
      alert('Request submitted successfully!');
      closeModal();
    } else {
      alert('Please fill all fields');
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  return (
    <div className="services-container">
      <div className="container">
        <div className="header">
          <h1>Services Portal</h1>
          <p>How etinuXe Generates Resources</p>
        </div>

        <div className="services-grid">
          <div className="service-card" onClick={() => openModal('Spy Services')}>
            <h2>Spy Services</h2>
            <p>Upload a person you're looking for. Our tiny operatives access places others can't.</p>
            <button className="service-button">Request Service</button>
          </div>

          <div className="service-card" onClick={() => openModal('Missing Person Finder')}>
            <h2>Missing Person Finder</h2>
            <p>AI extracts missing people and pet rewards from newspapers and online sources.</p>
            <button className="service-button">Search Now</button>
          </div>

          <div className="service-card" onClick={() => openModal('Pest Investigations')}>
            <h2>Pest Investigations</h2>
            <p>Expert extermination services. We understand pests like no one else.</p>
            <button className="service-button">Contact</button>
          </div>

          <div className="service-card" onClick={() => openModal('Forensics Services')}>
            <h2>Forensics Services</h2>
            <p>Bank safes, currency notes, microdust patterns, and microprint reading specialists.</p>
            <button className="service-button">Inquire</button>
          </div>

          <div className="service-card" onClick={() => openModal('Ore Detector')}>
            <h2>Ore Detector</h2>
            <p>On-hire consultants locate metal ores, gemstones, and petroleum with insect friends.</p>
            <button className="service-button">Hire Consultant</button>
          </div>

          <div className="service-card" onClick={() => openModal('Vigilante Justice')}>
            <h2>Vigilante Justice</h2>
            <p>Free service - our mission to help those who can't help themselves.</p>
            <button className="service-button">Report Case</button>
          </div>
        </div>

        <Link to="/" className="back-button">← Back to Home</Link>
      </div>

      <div id="modal" className={`modal ${modalActive ? 'active' : ''}`}>
        <div className="modal-content">
          <span className="close-btn" onClick={closeModal}>×</span>
          <h2 id="modalTitle">{modalTitle}</h2>
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-group">
            <label>Details</label>
            <textarea
              id="details"
              rows="4"
              placeholder="Describe your requirements"
              value={formData.details}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <button className="service-button" onClick={handleSubmit}>Submit Request</button>
        </div>
      </div>
    </div>
  );
}

export default Services;
