// Rooms.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Thermometer, Eye, Calendar, Sparkles, Check, Users, ArrowRight } from 'lucide-react';
import './Rooms.css';

export default function Rooms() {
  const navigate = useNavigate();
  const { rooms, updateCustomization } = useApp();
  const { currentUser } = useAuth();

  const [selectedRoom, setSelectedRoom] = useState('executive');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [numGuests, setNumGuests] = useState(1);
  const [numRooms, setNumRooms] = useState(1);
  
  const [checkInSlot, setCheckInSlot] = useState('Morning (8 AM – 12 PM)');
  const [checkOutSlot, setCheckOutSlot] = useState('Morning');
  
  const [validationError, setValidationError] = useState('');

  // Date stay calculator
  const calculateStay = () => {
    if (!checkIn || !checkOut) return { days: 0, nights: 0 };
    const date1 = new Date(checkIn);
    const date2 = new Date(checkOut);
    
    if (date2 <= date1) return { days: 0, nights: 0 };
    
    const diffTime = Math.abs(date2 - date1);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { days: nights + 1, nights: nights };
  };

  const stay = calculateStay();

  const handleBooking = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!checkIn || !checkOut) {
      setValidationError('Please select check-in and check-out dates.');
      return;
    }

    const date1 = new Date(checkIn);
    const date2 = new Date(checkOut);
    if (date2 <= date1) {
      setValidationError('Check-out date must be after check-in date.');
      return;
    }

    // Capacity verification
    const roomObj = rooms.find(r => r.id === selectedRoom);
    const capacityLimit = roomObj ? roomObj.capacity * numRooms : 2;
    if (numGuests > capacityLimit) {
      setValidationError(`Maximum guest capacity for ${numRooms} ${roomObj?.name}(s) is ${capacityLimit} guests.`);
      return;
    }

    // Save temporary booking parameters in customization context
    updateCustomization({
      tempBooking: {
        type: 'Room',
        roomType: selectedRoom,
        roomTypeName: roomObj?.name,
        checkIn,
        checkOut,
        checkInSlot,
        checkOutSlot,
        numGuests,
        numRooms,
        nights: stay.nights,
        days: stay.days
      }
    });

    // Navigate to Customize Room Wizard
    navigate('/customize');
  };

  return (
    <div className="rooms-page page-fade-in">
      <div className="rooms-container">
        
        {/* Header */}
        <div className="rooms-header text-center">
          <span className="section-subtitle">OUR SANCTUARIES</span>
          <h1 className="section-title">Rooms & Suites Catalog</h1>
          <div className="section-divider"></div>
        </div>

        <div className="rooms-booking-layout">
          
          {/* Room Classes Catalog */}
          <div className="rooms-catalog-list">
            {rooms.map(room => {
              const isSelected = selectedRoom === room.id;
              return (
                <div 
                  key={room.id} 
                  className={`glass-card room-catalog-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedRoom(room.id)}
                >
                  <img src={room.image} alt={room.name} className="room-catalog-img" />
                  <div className="room-catalog-body">
                    <div className="room-title-price-row">
                      <h3 className="room-catalog-name">{room.name}</h3>
                      <span className="room-catalog-price">₹{room.price}<small>/night</small></span>
                    </div>
                    
                    <div className="room-capacity-badge">
                      <Users size={12} />
                      <span>Capacity: {room.capacity} Guests</span>
                    </div>
                    
                    <div className="room-amenities-row">
                      {room.amenities.map(a => (
                        <span key={a} className="room-amenity-badge">{a}</span>
                      ))}
                    </div>
                    
                    <div className="room-select-action-indicator">
                      {isSelected ? (
                        <span className="selected-indicator-pill"><Check size={12} /> Active Selection</span>
                      ) : (
                        <span className="select-indicator-pill">Select Suite</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Booking checkout panel */}
          <div className="glass-card rooms-booking-form-panel">
            <h2 className="panel-title mb-24">Reservations Checkout</h2>
            
            {validationError && (
              <div className="booking-error-banner mb-24">
                <AlertCircle size={16} /> <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleBooking} className="booking-form-layout">
              
              <div className="form-group">
                <label className="form-label">Sanctuary Type</label>
                <select 
                  value={selectedRoom} 
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="luxury-input"
                >
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>{r.name} - ₹{r.price}/night</option>
                  ))}
                </select>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="checkIn">Check-In Date</label>
                  <input 
                    type="date" 
                    id="checkIn"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="luxury-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="checkOut">Check-Out Date</label>
                  <input 
                    type="date" 
                    id="checkOut"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="luxury-input"
                    required
                  />
                </div>
              </div>

              {/* Slot booking preferences */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Check-In Time Slot</label>
                  <select 
                    value={checkInSlot}
                    onChange={(e) => setCheckInSlot(e.target.value)}
                    className="luxury-input"
                  >
                    <option>Morning (8 AM – 12 PM)</option>
                    <option>Afternoon (12 PM – 4 PM)</option>
                    <option>Evening (4 PM – 8 PM)</option>
                    <option>Night (8 PM – 12 AM)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Check-Out Time Slot</label>
                  <select 
                    value={checkOutSlot}
                    onChange={(e) => setCheckOutSlot(e.target.value)}
                    className="luxury-input"
                  >
                    <option>Morning</option>
                    <option>Afternoon</option>
                    <option>Evening</option>
                    <option>Night</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="guests">Guests Count</label>
                  <input 
                    type="number" 
                    id="guests"
                    min="1" 
                    max="10"
                    value={numGuests}
                    onChange={(e) => setNumGuests(parseInt(e.target.value))}
                    className="luxury-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="roomsCount">Rooms Count</label>
                  <input 
                    type="number" 
                    id="roomsCount"
                    min="1" 
                    max="5"
                    value={numRooms}
                    onChange={(e) => setNumRooms(parseInt(e.target.value))}
                    className="luxury-input"
                    required
                  />
                </div>
              </div>

              {stay.nights > 0 && (
                <div className="stay-calculation-feedback">
                  <Calendar size={16} className="text-gold" />
                  <span>Calculated Stay: <strong>{stay.days} Days / {stay.nights} Nights</strong></span>
                </div>
              )}

              <button type="submit" className="luxury-btn luxury-btn-primary w-full checkout-submit-btn">
                Reserve & Customise Suite <ArrowRight size={15} />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}

// Inline alert helper
function AlertCircle({ size }) {
  return <Users size={size} />;
}
