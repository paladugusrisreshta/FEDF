// Dashboard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { roomThemes } from '../data/themeData';
import { jsPDF } from 'jspdf';
import { 
  Edit3, Trash2, RefreshCw, Thermometer, Music, ShoppingBag, 
  Feather, Sparkles, CheckCircle2, AlertTriangle, Search, 
  SlidersHorizontal, Download, Compass, CreditCard, Award, DollarSign,
  Calendar
} from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { 
    submissions, 
    cancelBooking,
    deleteBooking,
    updateCustomization, 
    syncStatus, 
    isSyncing,
    calculateCosts
  } = useApp();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Filter bookings belonging to this guest
  const guestBookings = submissions.filter(sub => 
    sub.guestEmail?.toLowerCase() === (currentUser?.email || 'guest@luxury.com').toLowerCase()
  );

  // Statistics calculation
  const amountSpent = guestBookings
    .filter(b => b.status === 'Confirmed')
    .reduce((sum, b) => sum + (b.costs?.grandTotal || 0), 0);

  const loyaltyPoints = Math.round(amountSpent * 0.1); // 1 point per ₹10 spent

  const now = new Date();

  const activeBookingsCount = guestBookings.filter(b => {
    if (b.status !== 'Confirmed') return false;
    const start = new Date(b.checkIn || b.eventDate);
    const end = new Date(b.checkOut || b.eventDate);
    return start <= now && end >= now;
  }).length;

  const upcomingBookingsCount = guestBookings.filter(b => {
    if (b.status !== 'Confirmed') return false;
    const start = new Date(b.checkIn || b.eventDate);
    return start > now;
  }).length;

  const completedBookingsCount = guestBookings.filter(b => {
    if (b.status === 'Cancelled') return false;
    const end = new Date(b.checkOut || b.eventDate);
    return end < now;
  }).length;

  const handleEdit = (sub) => {
    // Load preference values back into customization form context
    updateCustomization({
      ...sub.customisation,
      tempBooking: {
        id: sub.id,
        type: sub.type,
        roomType: sub.roomType,
        roomTypeName: sub.roomTypeName,
        checkIn: sub.checkIn,
        checkOut: sub.checkOut,
        checkInSlot: sub.checkInSlot,
        checkOutSlot: sub.checkOutSlot,
        numGuests: sub.numGuests,
        numRooms: sub.numRooms,
        nights: sub.nights,
        days: sub.days
      }
    });
    // Redirect to wizard
    navigate('/customize');
  };

  const handleRebook = (sub) => {
    updateCustomization({
      ...sub.customisation,
      tempBooking: {
        type: sub.type,
        roomType: sub.roomType,
        roomTypeName: sub.roomTypeName,
        checkIn: '', // Clear dates for new booking
        checkOut: '',
        checkInSlot: sub.checkInSlot,
        checkOutSlot: sub.checkOutSlot,
        numGuests: sub.numGuests,
        numRooms: sub.numRooms
      }
    });
    navigate('/rooms');
  };

  // Filter by search/types
  const filteredBookings = guestBookings.filter(b => {
    const nameMatch = 
      (b.roomTypeName || b.hallTypeName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());
      
    let matchesFilter = true;
    const checkNow = new Date();
    
    if (selectedFilter === 'Room') {
      matchesFilter = b.type === 'Room';
    } else if (selectedFilter === 'Banquet') {
      matchesFilter = b.type === 'Banquet';
    } else if (selectedFilter === 'Confirmed') {
      matchesFilter = b.status === 'Confirmed';
    } else if (selectedFilter === 'Cancelled') {
      matchesFilter = b.status === 'Cancelled';
    } else if (selectedFilter === 'Active') {
      const start = new Date(b.checkIn || b.eventDate);
      const end = new Date(b.checkOut || b.eventDate);
      matchesFilter = b.status === 'Confirmed' && start <= checkNow && end >= checkNow;
    } else if (selectedFilter === 'Upcoming') {
      const start = new Date(b.checkIn || b.eventDate);
      matchesFilter = b.status === 'Confirmed' && start > checkNow;
    } else if (selectedFilter === 'Completed') {
      const end = new Date(b.checkOut || b.eventDate);
      matchesFilter = b.status !== 'Cancelled' && end < checkNow;
    }
    
    return nameMatch && matchesFilter;
  });

  const getThemeImage = (themeId) => {
    const theme = roomThemes.find(t => t.id === themeId);
    return theme ? theme.image : 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80';
  };

  const getThemeAccentColor = (themeId) => {
    const theme = roomThemes.find(t => t.id === themeId);
    return theme ? theme.accentColor : '#C5A880';
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const downloadInvoicePDF = (booking) => {
    const doc = new jsPDF();
    const goldColor = [197, 168, 128];
    doc.setDrawColor(230, 220, 205);
    doc.rect(5, 5, 200, 287);

    // Header
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.text('GRAND STERLING HOTEL', 20, 30);

    doc.setFontSize(8);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('742 Premium Avenue, Belgravia, London, SW1X 8NY | +44 (20) 7946 0921', 20, 36);

    doc.setDrawColor(197, 168, 128);
    doc.line(20, 42, 190, 42);

    doc.setFontSize(14);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text('INVOICE / BOOKING CONFIRMATION', 20, 52);

    doc.setFontSize(10);
    doc.setFont('Helvetica', 'normal');
    doc.text(`Booking ID: ${booking.id}`, 20, 62);
    doc.text(`Date of Issue: ${new Date(booking.date).toLocaleDateString()}`, 20, 68);
    doc.text(`Guest Name: ${booking.guestName}`, 20, 74);
    doc.text(`Email: ${booking.guestEmail}`, 20, 80);

    doc.setFont('Helvetica', 'bold');
    doc.text('RESERVATION DETAILS:', 20, 92);
    doc.setFont('Helvetica', 'normal');

    if (booking.type === 'Room') {
      doc.text(`Sanctuary: ${booking.roomTypeName} (${booking.numRooms} Room/s)`, 20, 100);
      doc.text(`Stay Duration: ${booking.days} Days / ${booking.nights} Nights`, 20, 106);
      doc.text(`Check-In: ${booking.checkIn} [Slot: ${booking.checkInSlot}]`, 20, 112);
      doc.text(`Check-Out: ${booking.checkOut} [Slot: ${booking.checkOutSlot}]`, 20, 118);
      
      // Customisations details
      doc.setFont('Helvetica', 'bold');
      doc.text('SUITE CUSTOMISATIONS:', 20, 130);
      doc.setFont('Helvetica', 'normal');
      doc.text(`Pillow Type: ${booking.customisation.pillowType}`, 20, 138);
      doc.text(`Soundscape: ${booking.customisation.musicMood}`, 20, 144);
      doc.text(`Ambient Theme: ${booking.customisation.roomThemeName}`, 20, 150);
      doc.text(`Balcony Setup: ${booking.customisation.balconyType} (${booking.customisation.balconySeating})`, 20, 156);
      doc.text(`Dining: ${booking.customisation.balconyDining}`, 20, 162);
      doc.text(`Pre-stocked Minibar: ${booking.customisation.minibarItems.join(', ') || 'None'}`, 20, 168);
    } else {
      doc.text(`Hall Rental: ${booking.hallTypeName}`, 20, 100);
      doc.text(`Occasion Name: ${booking.eventName}`, 20, 106);
      doc.text(`Booking Date: ${booking.eventDate}`, 20, 112);
      doc.text(`Guest Count: ${booking.guestCount}`, 20, 118);
    }

    doc.setFont('Helvetica', 'bold');
    doc.text('PAYMENT SUMMARY:', 20, 184);
    doc.setFont('Helvetica', 'normal');
    doc.text(`Method: ${booking.payment.method}`, 20, 192);
    doc.text(`Transaction Reference: ${booking.payment.transactionId}`, 20, 198);
    doc.text(`Status: ${booking.payment.status}`, 20, 204);

    doc.line(20, 214, 190, 214);

    doc.setFontSize(11);
    if (booking.type === 'Room') {
      doc.text(`Suite Rental Cost Subtotal:`, 20, 224);
      doc.text(`₹${booking.costs.roomSubtotal.toFixed(2)}`, 150, 224);
      doc.text(`Suite Customisation Subtotal:`, 20, 230);
      doc.text(`₹${booking.costs.customSubtotal.toFixed(2)}`, 150, 230);
    } else {
      doc.text(`Banquet Hall Rental Cost Subtotal:`, 20, 224);
      doc.text(`₹${booking.costs.banquetSubtotal.toFixed(2)}`, 150, 224);
    }

    doc.text(`Taxation Levy (18% GST):`, 20, 240);
    doc.text(`₹${booking.costs.gst.toFixed(2)}`, 150, 240);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(`Grand Total Paid Amount:`, 20, 252);
    doc.text(`₹${booking.costs.grandTotal.toFixed(2)}`, 150, 252);

    doc.setFontSize(10);
    doc.setFont('Helvetica', 'italic');
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for choosing Grand Sterling Hotel. Have a pleasant stay.', 20, 275);

    doc.save(`invoice-${booking.id}.pdf`);
  };

  return (
    <div className="dashboard-page page-fade-in">
      <div className="dashboard-container">
        
        {/* Dashboard Header */}
        <div className="dashboard-header-row">
          <div>
            <span className="section-subtitle">GUEST PORTAL</span>
            <h1 className="section-title text-left">Welcome Back, {currentUser?.name}</h1>
          </div>
          <div className="sync-status-indicator glass-card">
            {isSyncing ? (
              <><RefreshCw size={14} className="animate-spin text-gold" /><span>Syncing...</span></>
            ) : syncStatus === 'synced' ? (
              <><CheckCircle2 size={14} className="text-success" /><span>Cloud Synced</span></>
            ) : (
              <><AlertTriangle size={14} className="text-danger" /><span>Offline Mode</span></>
            )}
          </div>
        </div>

        <div className="section-divider text-left m-0 mb-40"></div>

        {/* Guest Stats Dashboard (Spent, Loyalty points, Bookings) */}
        <div className="guest-stats-row-grid mb-40">
          <div className="glass-card stat-metric-box">
            <DollarSign size={20} className="stat-metric-icon text-gold" />
            <div>
              <span className="stat-label">Total Amount Spent</span>
              <span className="stat-value">₹{amountSpent.toFixed(2)}</span>
            </div>
          </div>

          <div className="glass-card stat-metric-box">
            <Award size={20} className="stat-metric-icon text-gold" />
            <div>
              <span className="stat-label">Loyalty Points Earned</span>
              <span className="stat-value">{loyaltyPoints} PTS</span>
            </div>
          </div>

          <div className="glass-card stat-metric-box">
            <CheckCircle2 size={20} className="stat-metric-icon text-gold" />
            <div>
              <span className="stat-label">Active Bookings</span>
              <span className="stat-value">{activeBookingsCount} Stays</span>
            </div>
          </div>

          <div className="glass-card stat-metric-box">
            <Calendar size={20} className="stat-metric-icon text-gold" />
            <div>
              <span className="stat-label">Upcoming Bookings</span>
              <span className="stat-value">{upcomingBookingsCount} Stays</span>
            </div>
          </div>

          <div className="glass-card stat-metric-box">
            <Sparkles size={20} className="stat-metric-icon text-gold" />
            <div>
              <span className="stat-label">Completed Bookings</span>
              <span className="stat-value">{completedBookingsCount} Stays</span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="dashboard-toolbar glass-card">
          <div className="search-bar-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search bookings by room/id..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="toolbar-input"
            />
          </div>

          <div className="filter-wrapper">
            <SlidersHorizontal size={16} className="filter-icon" />
            <select 
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="toolbar-select"
            >
              <option value="All">All Bookings</option>
              <option value="Room">Rooms Bookings</option>
              <option value="Banquet">Banquets Bookings</option>
              <option value="Active">Active Bookings</option>
              <option value="Upcoming">Upcoming Bookings</option>
              <option value="Completed">Completed Bookings</option>
              <option value="Cancelled">Cancelled Bookings</option>
            </select>
          </div>
        </div>

        {/* Bookings Grid */}
        {filteredBookings.length === 0 ? (
          <div className="glass-card empty-dashboard text-center">
            <Sparkles size={48} className="gold-icon mb-16" />
            <h2 className="empty-title">No Bookings Found</h2>
            <p className="empty-desc">You have no active or completed bookings matching your filters.</p>
            <button className="luxury-btn luxury-btn-primary" onClick={() => navigate('/rooms')}>
              Reserve Room Now
            </button>
          </div>
        ) : (
          <div className="dashboard-cards-grid">
            {filteredBookings.map(booking => {
              const isRoom = booking.type === 'Room';
              const isCancelled = booking.status === 'Cancelled';
              const accentColor = isRoom ? getThemeAccentColor(booking.customisation?.roomTheme) : '#9F86C0'; // Lavender for banquets

              return (
                <div 
                  key={booking.id} 
                  className={`dashboard-card glass-card ${isCancelled ? 'cancelled-booking-card' : ''}`}
                  style={{ '--card-accent': accentColor }}
                >
                  <div className="active-tag" style={{ backgroundColor: isCancelled ? 'var(--color-danger)' : 'var(--gold)' }}>
                    {booking.status}
                  </div>

                  <div className="dash-card-image-wrapper">
                    <img 
                      src={isRoom ? getThemeImage(booking.customisation?.roomTheme) : 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80'} 
                      alt="Booking Type" 
                      className="dash-card-img" 
                    />
                    <div className="dash-card-overlay"></div>
                    <div className="dash-card-title-block">
                      <span className="dash-card-date">{booking.id} | Invoiced</span>
                      <h3 className="dash-card-theme-title">
                        {isRoom ? `${booking.roomTypeName} (${booking.numRooms} Room/s)` : booking.hallTypeName}
                      </h3>
                    </div>
                  </div>

                  <div className="dash-card-body">
                    <div className="metrics-column">
                      
                      {isRoom ? (
                        <>
                          <div className="dash-metric-item">
                            <Calendar size={16} className="metric-icon" />
                            <div>
                              <span className="metric-label">Dates / Stay Duration</span>
                              <span className="metric-value">{formatDate(booking.checkIn)} – {formatDate(booking.checkOut)} ({booking.nights} nights)</span>
                            </div>
                          </div>

                          <div className="dash-metric-item">
                            <Compass size={16} className="metric-icon" />
                            <div>
                              <span className="metric-label">Balcony Deck Selected</span>
                              <span className="metric-value">{booking.customisation?.balconyType || 'No Balcony'}</span>
                            </div>
                          </div>

                          <div className="dash-metric-item">
                            <Feather size={16} className="metric-icon" />
                            <div>
                              <span className="metric-label">Sleeping Pillows</span>
                              <span className="metric-value">{booking.customisation?.pillowType}</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="dash-metric-item">
                            <Calendar size={16} className="metric-icon" />
                            <div>
                              <span className="metric-label">Event Date / Occasion</span>
                              <span className="metric-value">{formatDate(booking.eventDate)} ({booking.eventName})</span>
                            </div>
                          </div>

                          <div className="dash-metric-item">
                            <Award size={16} className="metric-icon" />
                            <div>
                              <span className="metric-label">Attendees Guest Count</span>
                              <span className="metric-value">{booking.guestCount} guests</span>
                            </div>
                          </div>
                        </>
                      )}

                      <div className="dash-metric-item">
                        <DollarSign size={16} className="metric-icon" />
                        <div>
                          <span className="metric-label">Total Paid Amount (GST incl.)</span>
                          <span className="metric-value">₹{booking.costs?.grandTotal}</span>
                        </div>
                      </div>

                    </div>

                    {/* Actions toolbar */}
                    <div className="dash-card-actions">
                      {!isCancelled && (
                        <>
                          <button 
                            className="luxury-btn luxury-btn-secondary dash-action-btn"
                            onClick={() => handleEdit(booking)}
                            title="Edit booking preferences"
                          >
                            <Edit3 size={14} /> Edit
                          </button>
                          <button 
                            className="luxury-btn luxury-btn-secondary dash-action-btn delete-btn"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to cancel booking ${booking.id}?`)) {
                                cancelBooking(booking.id);
                              }
                            }}
                            title="Cancel Booking"
                          >
                            <Trash2 size={14} /> Cancel
                          </button>
                        </>
                      )}
                      
                      {isCancelled && (
                        <button 
                          className="luxury-btn luxury-btn-secondary dash-action-btn"
                          onClick={() => handleRebook(booking)}
                        >
                          <RefreshCw size={14} /> Rebook Room
                        </button>
                      )}

                      <button 
                        className="luxury-btn luxury-btn-secondary dash-action-btn"
                        onClick={() => downloadInvoicePDF(booking)}
                        title="Download Invoice PDF"
                      >
                        <Download size={14} /> Invoice
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
