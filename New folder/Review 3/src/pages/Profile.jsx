// Profile.jsx
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Award, User, Mail, Phone, Calendar, Compass, ShieldCheck, Save, Edit2, Upload, MapPin } from 'lucide-react';
import './Profile.css';

export default function Profile() {
  const { addNotification } = useApp();
  const { currentUser, updateUserProfile } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize form data when currentUser is loaded
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || ''
      });
    }
  }, [currentUser]);

  if (!currentUser) return null;

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      alert('Please fill out all fields.');
      return;
    }

    updateUserProfile({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address
    });

    setIsEditing(false);
    setSaveSuccess(true);
    addNotification('Your guest profile has been updated successfully.', 'success');
    
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Base64 file uploader
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUserProfile({ avatar: reader.result });
        addNotification('Profile picture uploaded successfully.', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const getLoyaltyBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'platinum':
        return {
          class: 'tier-platinum',
          desc: 'Enjoy unlimited spa access, priority suite upgrades, and 24/7 dedicated butler service.'
        };
      case 'gold':
        return {
          class: 'tier-gold',
          desc: 'Enjoy complimentary late check-outs, welcome champagne flutes, and standard customisation priorities.'
        };
      case 'silver':
      default:
        return {
          class: 'tier-silver',
          desc: 'Enjoy complimentary high-speed WiFi, pre-arrival pillow choices, and priority notification alerts.'
        };
    }
  };

  const loyaltyDetails = getLoyaltyBadge(currentUser.loyaltyStatus);

  return (
    <div className="profile-page page-fade-in">
      <div className="profile-container">
        
        {/* Header */}
        <div className="profile-header text-center">
          <span className="section-subtitle">GUEST PORTRAIT</span>
          <h1 className="section-title">Your Profile</h1>
          <div className="section-divider"></div>
        </div>

        <div className="profile-layout-grid">
          
          {/* Left Column: Loyalty Card & Avatar */}
          <div className="glass-card loyalty-card-panel">
            <div className={`loyalty-banner ${loyaltyDetails.class}`}>
              <div className="profile-avatar-container mb-16">
                <img 
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'} 
                  alt="Guest Avatar" 
                  className="profile-avatar-img" 
                />
                <label className="avatar-upload-label" htmlFor="avatar-file">
                  <Upload size={14} />
                  <input 
                    type="file" 
                    id="avatar-file" 
                    accept="image/*" 
                    onChange={handleAvatarUpload} 
                    className="hidden-file-input" 
                  />
                </label>
              </div>
              <h2 className="loyalty-title">{currentUser.loyaltyStatus} Status</h2>
              <span className="loyalty-subtitle">GRAND STERLING ELITE MEMBER</span>
            </div>
            
            <div className="loyalty-body">
              <p className="loyalty-perks-desc">{loyaltyDetails.desc}</p>
              
              <div className="perk-bullets">
                <div className="perk-row">
                  <ShieldCheck size={16} className="text-gold" />
                  <span>Complimentary Valet Parking</span>
                </div>
                <div className="perk-row">
                  <ShieldCheck size={16} className="text-gold" />
                  <span>Suite Minibar Complementary setup</span>
                </div>
                <div className="perk-row">
                  <ShieldCheck size={16} className="text-gold" />
                  <span>Custom Room Theme Pre-configurations</span>
                </div>
              </div>

              <div className="room-allocation-block">
                <Compass size={20} className="compass-icon text-gold" />
                <div>
                  <span className="room-label">Allocated Sanctuary</span>
                  <span className="room-val">{currentUser.roomNumber}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Details / Editing Form */}
          <div className="glass-card profile-details-panel">
            <div className="details-panel-header">
              <h2 className="panel-title">Guest Registry Details</h2>
              {!isEditing && (
                <button 
                  className="luxury-btn luxury-btn-secondary edit-profile-toggle"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 size={14} /> Edit Registry
                </button>
              )}
            </div>

            {saveSuccess && (
              <div className="profile-success-message">
                <ShieldCheck size={16} /> Profile changes saved and synced with hotel mainframe.
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSave} className="profile-edit-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Full Guest Name</label>
                  <div className="input-wrapper">
                    <User size={16} className="input-icon" />
                    <input 
                      type="text" 
                      id="name"
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange}
                      className="luxury-input profile-field-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address</label>
                  <div className="input-wrapper">
                    <Mail size={16} className="input-icon" />
                    <input 
                      type="email" 
                      id="email"
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange}
                      className="luxury-input profile-field-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Contact Number</label>
                  <div className="input-wrapper">
                    <Phone size={16} className="input-icon" />
                    <input 
                      type="tel" 
                      id="phone"
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange}
                      className="luxury-input profile-field-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="address">Residential Address</label>
                  <div className="input-wrapper">
                    <MapPin size={16} className="input-icon" />
                    <input 
                      type="text" 
                      id="address"
                      name="address" 
                      value={formData.address} 
                      onChange={handleChange}
                      className="luxury-input profile-field-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="luxury-btn luxury-btn-secondary" 
                    onClick={() => {
                      setFormData({
                        name: currentUser.name,
                        email: currentUser.email,
                        phone: currentUser.phone,
                        address: currentUser.address
                      });
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="luxury-btn luxury-btn-primary">
                    Save Changes <Save size={16} />
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-details-display">
                <div className="display-row">
                  <div className="display-icon-block">
                    <User size={18} />
                  </div>
                  <div>
                    <span className="display-label">Full Guest Name</span>
                    <span className="display-value">{currentUser.name}</span>
                  </div>
                </div>

                <div className="display-row">
                  <div className="display-icon-block">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="display-label">Email Address</span>
                    <span className="display-value">{currentUser.email}</span>
                  </div>
                </div>

                <div className="display-row">
                  <div className="display-icon-block">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="display-label">Contact Number</span>
                    <span className="display-value">{currentUser.phone}</span>
                  </div>
                </div>

                <div className="display-row">
                  <div className="display-icon-block">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="display-label">Residential Address</span>
                    <span className="display-value">{currentUser.address}</span>
                  </div>
                </div>

                <div className="display-row">
                  <div className="display-icon-block">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <span className="display-label">Registered Since</span>
                    <span className="display-value">December 2024</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
