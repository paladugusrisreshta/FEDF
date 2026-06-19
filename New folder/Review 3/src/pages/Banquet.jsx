// Banquet.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Calendar, Users, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import './Banquet.css';

export default function Banquet() {
  const navigate = useNavigate();
  const { banquetHalls, updateCustomization } = useApp();
  const { currentUser } = useAuth();

  const [selectedHall, setSelectedHall] = useState('wedding');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [guestCount, setGuestCount] = useState(100);
  
  const [catering, setCatering] = useState(false);
  const [decoration, setDecoration] = useState(false);
  const [soundSystem, setSoundSystem] = useState(false);
  
  const [validationError, setValidationError] = useState('');

  const handleBooking = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!eventName || !eventDate) {
      setValidationError('Please specify event name and date.');
      return;
    }

    const today = new Date();
    const selectedDate = new Date(eventDate);
    if (selectedDate <= today) {
      setValidationError('Event date must be in the future.');
      return;
    }

    // Capacity verification
    const hallObj = banquetHalls.find(h => h.id === selectedHall);
    if (guestCount > (hallObj?.capacity || 500)) {
      setValidationError(`Selected hall exceeds capacity. Maximum limit is ${hallObj?.capacity} guests.`);
      return;
    }

    // Save temporary booking parameters in customization context
    updateCustomization({
      tempBooking: {
        type: 'Banquet',
        hallType: selectedHall,
        hallTypeName: hallObj?.name,
        eventName,
        eventDate,
        guestCount,
        cateringRequired: catering,
        decorationRequired: decoration,
        soundSystemRequired: soundSystem
      }
    });

    // Banquet bookings go straight to payment page!
    navigate('/payment');
  };

  return (
    <div className="banquet-page page-fade-in">
      <div className="banquet-container">
        
        {/* Header */}
        <div className="banquet-header text-center">
          <span className="section-subtitle">CELEBRATIONS & EVENTS</span>
          <h1 className="section-title">Luxury Banquet Halls</h1>
          <div className="section-divider"></div>
        </div>

        <div className="banquet-layout-grid">
          
          {/* Hall Selection List */}
          <div className="halls-catalog-list">
            {banquetHalls.map(hall => {
              const isSelected = selectedHall === hall.id;
              return (
                <div 
                  key={hall.id} 
                  className={`glass-card hall-catalog-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedHall(hall.id)}
                >
                  <img src={hall.image} alt={hall.name} className="hall-catalog-img" />
                  <div className="hall-catalog-body">
                    <div className="hall-title-price-row">
                      <h3 className="hall-catalog-name">{hall.name}</h3>
                      <span className="hall-catalog-price">₹{hall.price}<small>/booking</small></span>
                    </div>

                    <div className="hall-capacity-row">
                      <Users size={14} className="text-gold" />
                      <span>Accommodates up to: <strong>{hall.capacity} guests</strong></span>
                    </div>

                    <div className="hall-select-indicator">
                      {isSelected ? (
                        <span className="selected-indicator-pill"><ShieldCheck size={12} /> Active Hall Selection</span>
                      ) : (
                        <span className="select-indicator-pill">Select Banquet Hall</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Booking checkout form */}
          <div className="glass-card banquet-booking-form-panel">
            <h2 className="panel-title mb-24">Event Reservation</h2>
            
            {validationError && (
              <div className="booking-error-banner mb-24">
                <HelpCircle size={16} /> <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleBooking} className="banquet-form-layout">
              
              <div className="form-group">
                <label htmlFor="eventName" className="form-label">Event Name / Occasion</label>
                <input 
                  type="text" 
                  id="eventName"
                  placeholder="e.g. Sterling Wedding / Tech Summit 2026"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="luxury-input"
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="eventDate" className="form-label">Event Date</label>
                  <input 
                    type="date" 
                    id="eventDate"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="luxury-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="guestCount" className="form-label">Guest Count</label>
                  <input 
                    type="number" 
                    id="guestCount"
                    min="10" 
                    max="1000"
                    value={guestCount}
                    onChange={(e) => setGuestCount(parseInt(e.target.value))}
                    className="luxury-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Hall Configuration</label>
                <select 
                  value={selectedHall} 
                  onChange={(e) => setSelectedHall(e.target.value)}
                  className="luxury-input"
                >
                  {banquetHalls.map(h => (
                    <option key={h.id} value={h.id}>{h.name} (Max {h.capacity} Guests)</option>
                  ))}
                </select>
              </div>

              {/* Extras checklist */}
              <div className="extras-checklist-section">
                <h4 className="checklist-section-title">Add-On Event Arrangements</h4>
                
                <label className="checklist-item-row">
                  <input 
                    type="checkbox" 
                    checked={catering}
                    onChange={(e) => setCatering(e.target.checked)}
                    className="luxury-checkbox"
                  />
                  <div>
                    <span className="checkbox-title">Professional Catering (Veg/Non-Veg)</span>
                    <span className="checkbox-desc">Premium buffet setup, ₹35 per head guest count.</span>
                  </div>
                </label>

                <label className="checklist-item-row">
                  <input 
                    type="checkbox" 
                    checked={decoration}
                    onChange={(e) => setDecoration(e.target.checked)}
                    className="luxury-checkbox"
                  />
                  <div>
                    <span className="checkbox-title">Theme Florals & Banquet Decoration</span>
                    <span className="checkbox-desc">Custom stage, flower structures, and premium table sheets. Flat ₹450.</span>
                  </div>
                </label>

                <label className="checklist-item-row">
                  <input 
                    type="checkbox" 
                    checked={soundSystem}
                    onChange={(e) => setSoundSystem(e.target.checked)}
                    className="luxury-checkbox"
                  />
                  <div>
                    <span className="checkbox-title">Concert Audio & Sound Systems</span>
                    <span className="checkbox-desc">Surround sound, microphones, DJ stand, and stage lights. Flat ₹250.</span>
                  </div>
                </label>
              </div>

              <button type="submit" className="luxury-btn luxury-btn-primary w-full checkout-submit-btn">
                Reserve Hall & Proceed to Pay <ArrowRight size={15} />
              </button>

            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
