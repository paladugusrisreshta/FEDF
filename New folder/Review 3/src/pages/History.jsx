// History.jsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { roomThemes } from '../data/themeData';
import { 
  Search, Calendar, Trash2, Eye, X, SlidersHorizontal, 
  ChevronRight, Sparkles, AlertCircle, ShoppingBag 
} from 'lucide-react';
import './History.css';

export default function History() {
  const { submissions, deleteSubmission, clearAllHistory } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest
  const [selectedSub, setSelectedSub] = useState(null); // Details modal active submission

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getThemeImage = (themeId) => {
    const theme = roomThemes.find(t => t.id === themeId);
    return theme ? theme.image : 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80';
  };

  // Filter and sort
  const processedSubmissions = submissions
    .filter(sub => {
      const roomThemeName = sub.roomThemeName || sub.customisation?.roomThemeName || '';
      const pillowType = sub.pillowType || sub.customisation?.pillowType || '';
      const specialRequests = sub.specialRequests || sub.customisation?.specialRequests || '';
      const roomTheme = sub.roomTheme || sub.customisation?.roomTheme || '';

      const matchesSearch = 
        roomThemeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pillowType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        specialRequests.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sub.roomTypeName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sub.eventName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sub.id || '').toLowerCase().includes(searchQuery.toLowerCase());
        
      const themeObj = roomThemes.find(t => t.id === roomTheme);
      const matchesCategory = selectedCategory === 'All' || themeObj?.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
    });

  return (
    <div className="history-page page-fade-in">
      <div className="history-container">
        
        {/* Header */}
        <div className="history-header">
          <div>
            <span className="section-subtitle">ARCHIVE RECORDS</span>
            <h1 className="section-title text-left">Customisation History</h1>
          </div>
          {submissions.length > 0 && (
            <button 
              className="luxury-btn luxury-btn-secondary clear-all-btn"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all history records?')) {
                  clearAllHistory();
                }
              }}
            >
              <Trash2 size={15} /> Clear All
            </button>
          )}
        </div>
        <div className="section-divider text-left m-0 mb-40"></div>

        {/* Toolbar */}
        <div className="history-toolbar glass-card">
          <div className="search-bar-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search history by keyword..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="toolbar-input"
            />
          </div>

          <div className="filters-row-group">
            <div className="filter-wrapper">
              <SlidersHorizontal size={16} className="filter-icon" />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="toolbar-select"
              >
                <option value="All">All Categories</option>
                <option value="Nature Themes">Nature Themes</option>
                <option value="Royal Themes">Royal Themes</option>
                <option value="Modern Themes">Modern Themes</option>
                <option value="Futuristic Themes">Futuristic Themes</option>
                <option value="Artistic Themes">Artistic Themes</option>
                <option value="Signature Hotel Themes">Signature Hotel Themes</option>
              </select>
            </div>

            <div className="filter-wrapper">
              <Calendar size={16} className="filter-icon" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="toolbar-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* List table */}
        {processedSubmissions.length === 0 ? (
          <div className="glass-card empty-history text-center">
            <AlertCircle size={44} className="gold-icon mb-16" />
            <h2 className="empty-title">No History Entries Found</h2>
            <p className="empty-desc">There are no records matching your active filters or searches.</p>
          </div>
        ) : (
          <div className="history-list-wrapper glass-card">
            <div className="history-table-header">
              <span className="col-header col-date">Date & Time</span>
              <span className="col-header col-theme">Selected Theme</span>
              <span className="col-header col-pillow">Pillow Type</span>
              <span className="col-header col-temp">Temp</span>
              <span className="col-header col-actions">Actions</span>
            </div>
            
            <div className="history-table-body">
              {processedSubmissions.map(sub => (
                <div key={sub.id} className="history-row">
                  <div className="col-data col-date">
                    <Calendar size={14} className="row-date-icon" />
                    <span>{formatDate(sub.date)}</span>
                  </div>
                  
                  <div className="col-data col-theme">
                    <span className="history-theme-label">
                      {sub.type === 'Banquet' ? (sub.hallTypeName || 'Banquet Event') : (sub.roomThemeName || sub.customisation?.roomThemeName || 'N/A')}
                    </span>
                  </div>
                  
                  <div className="col-data col-pillow">
                    <span>{sub.type === 'Banquet' ? 'N/A' : (sub.pillowType || sub.customisation?.pillowType || 'N/A')}</span>
                  </div>
                  
                  <div className="col-data col-temp">
                    <span>
                      {sub.type === 'Banquet' ? 'N/A' : (sub.temperature !== undefined ? `${sub.temperature}°C` : (sub.customisation?.temperature !== undefined ? `${sub.customisation.temperature}°C` : 'N/A'))}
                    </span>
                  </div>
                  
                  <div className="col-data col-actions">
                    <button 
                      className="history-action-btn view-btn"
                      onClick={() => setSelectedSub(sub)}
                      title="View Details"
                    >
                      <Eye size={14} /> View
                    </button>
                    <button 
                      className="history-action-btn delete-btn"
                      onClick={() => {
                        if (window.confirm('Delete this history record?')) {
                          deleteSubmission(sub.id);
                        }
                      }}
                      title="Delete Entry"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Details Modal */}
      {selectedSub && (
        <div className="modal-backdrop" onClick={() => setSelectedSub(null)}>
          <div className="modal-card glass-card slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Customisation Details</h2>
              <button className="modal-close-btn" onClick={() => setSelectedSub(null)}>
                <X size={18} />
              </button>
            </div>
            
            <div className="modal-body">
              {selectedSub.type === 'Banquet' ? (
                <>
                  <div className="modal-banner-wrapper">
                    <img src={selectedSub.image || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80'} alt={selectedSub.hallTypeName || 'Banquet Hall'} className="modal-banner-img" />
                    <div className="modal-banner-overlay"></div>
                    <div className="modal-banner-title">
                      <span className="modal-date">{formatDate(selectedSub.date)}</span>
                      <h3>{selectedSub.hallTypeName || 'Banquet Hall'} Reservation</h3>
                    </div>
                  </div>

                  <div className="modal-details-grid">
                    <div className="modal-detail-item">
                      <span className="detail-label">Event Name</span>
                      <span className="detail-value">{selectedSub.eventName || 'N/A'}</span>
                    </div>
                    <div className="modal-detail-item">
                      <span className="detail-label">Event Date</span>
                      <span className="detail-value">{selectedSub.eventDate ? new Date(selectedSub.eventDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="modal-detail-item">
                      <span className="detail-label">Guest Count</span>
                      <span className="detail-value">{selectedSub.guestCount || 0} guests</span>
                    </div>
                  </div>

                  <div className="modal-section">
                    <span className="detail-label">Included Services</span>
                    <div className="modal-chips-row">
                      {selectedSub.cateringRequired && <span className="modal-chip"><ShoppingBag size={10} /> 5-Star Catering</span>}
                      {selectedSub.decorationRequired && <span className="modal-chip"><Sparkles size={10} /> Luxury Floral Decor</span>}
                      {selectedSub.soundSystemRequired && <span className="modal-chip"><Music size={10} /> Professional Sound System</span>}
                      {!selectedSub.cateringRequired && !selectedSub.decorationRequired && !selectedSub.soundSystemRequired && (
                        <span className="modal-chip-empty">Base hall rental only (No add-ons)</span>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="modal-banner-wrapper">
                    <img src={getThemeImage(selectedSub.roomTheme || selectedSub.customisation?.roomTheme)} alt={selectedSub.roomThemeName || selectedSub.customisation?.roomThemeName} className="modal-banner-img" />
                    <div className="modal-banner-overlay"></div>
                    <div className="modal-banner-title">
                      <span className="modal-date">{formatDate(selectedSub.date)}</span>
                      <h3>{selectedSub.roomThemeName || selectedSub.customisation?.roomThemeName || 'Standard'} Layout</h3>
                    </div>
                  </div>

                  <div className="modal-details-grid">
                    <div className="modal-detail-item">
                      <span className="detail-label">Pillow comfort</span>
                      <span className="detail-value">{selectedSub.pillowType || selectedSub.customisation?.pillowType || 'N/A'}</span>
                    </div>
                    <div className="modal-detail-item">
                      <span className="detail-label">Climate Target</span>
                      <span className="detail-value">
                        {selectedSub.temperature !== undefined ? `${selectedSub.temperature}°C` : (selectedSub.customisation?.temperature !== undefined ? `${selectedSub.customisation.temperature}°C` : 'N/A')}
                      </span>
                    </div>
                    <div className="modal-detail-item">
                      <span className="detail-label">Acoustics Profile</span>
                      <span className="detail-value">{selectedSub.musicMood || selectedSub.customisation?.musicMood || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="modal-section">
                    <span className="detail-label">Stocked Minibar Items</span>
                    <div className="modal-chips-row">
                      {(selectedSub.minibarItems || selectedSub.customisation?.minibarItems || []).length > 0 ? (
                        (selectedSub.minibarItems || selectedSub.customisation?.minibarItems).map(item => (
                          <span key={item} className="modal-chip"><ShoppingBag size={10} /> {item}</span>
                        ))
                      ) : (
                        <span className="modal-chip-empty">Standard Minibar setup (No additions requested)</span>
                      )}
                    </div>
                  </div>

                  {(selectedSub.specialRequests || selectedSub.customisation?.specialRequests) && (
                    <div className="modal-section">
                      <span className="detail-label">Special Accommodations Request</span>
                      <p className="modal-request-quote">"{selectedSub.specialRequests || selectedSub.customisation?.specialRequests}"</p>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="modal-footer">
              <button className="luxury-btn luxury-btn-secondary w-full" onClick={() => setSelectedSub(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
