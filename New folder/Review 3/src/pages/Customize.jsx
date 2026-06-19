// Customize.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { roomThemes } from '../data/themeData';
import { 
  ArrowLeft, ArrowRight, Save, Feather, Thermometer, Music, 
  ShoppingBag, Palette, MessageSquare, Check, Sparkles, AlertCircle, 
  Compass, Coffee, Utensils, Armchair, Paintbrush, HelpCircle 
} from 'lucide-react';
import './Customize.css';

export default function Customize() {
  const navigate = useNavigate();
  const { customization, updateCustomization, calculateCosts } = useApp();
  const { setActivePreviewTheme } = useTheme();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [validationError, setValidationError] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState(() => {
    const selectedThemeObj = roomThemes.find(t => t.id === (customization.roomTheme || 'maharaja-palace'));
    return selectedThemeObj ? selectedThemeObj.category : 'Royal Themes';
  });

  // Unified booking info checking
  const tempBooking = customization.tempBooking;

  // Sync active theme background preview to global ThemeContext
  useEffect(() => {
    const selectedThemeObj = roomThemes.find(t => t.id === customization.roomTheme);
    if (selectedThemeObj) {
      setActivePreviewTheme(selectedThemeObj.image);
    }
    return () => setActivePreviewTheme(null);
  }, [customization.roomTheme, setActivePreviewTheme]);

  // Steps definitions (9 Steps total)
  const steps = [
    { id: 1, name: "Pillows", icon: <Feather size={16} /> },
    { id: 2, name: "Climate", icon: <Thermometer size={16} /> },
    { id: 3, name: "Acoustics", icon: <Music size={16} /> },
    { id: 4, name: "Mini-Bar", icon: <ShoppingBag size={16} /> },
    { id: 5, name: "Balcony", icon: <Compass size={16} /> },
    { id: 6, name: "Furniture & Decor", icon: <Paintbrush size={16} /> },
    { id: 7, name: "Theme", icon: <Palette size={16} /> },
    { id: 8, name: "Dining", icon: <Utensils size={16} /> },
    { id: 9, name: "Requests", icon: <MessageSquare size={16} /> }
  ];

  // Options Definitions
  const pillows = [
    { id: 'Soft Pillow', name: 'Soft Pillow', desc: 'Cloud-soft down filling.', detail: '100% white goose down' },
    { id: 'Medium Pillow', name: 'Medium Pillow', desc: 'Balanced support and cushioning.', detail: '50/50 down/feather blend' },
    { id: 'Firm Pillow', name: 'Firm Pillow', desc: 'Structured spine alignment.', detail: 'Buckwheat and latex core' },
    { id: 'Memory Foam Pillow', name: 'Memory Foam Pillow', desc: 'Therapeutic contouring foam.', detail: 'Infused with cooling gel' }
  ];

  const acoustics = [
    { id: 'Classical', name: 'Classical Melodies', desc: 'Chopin nocturnes and Bach suites.' },
    { id: 'Jazz', name: 'Lounge Jazz', desc: 'Muted trumpet and soft upright bass.' },
    { id: 'Ambient', name: 'Celestial Ambience', desc: 'Shimmering synthesizers.' },
    { id: 'Nature', name: 'Nature Sounds', desc: 'Summer rain and morning birds.' },
    { id: 'No Music', name: 'Silent Sanctuary', desc: 'Active noise cancellation.' }
  ];

  const minibar = [
    { id: 'Water', name: 'Voss Still Water', price: '₹250' },
    { id: 'Soft Drinks', name: 'Artisanal Ginger Beer', price: '₹350' },
    { id: 'Snacks', name: 'Roasted Truffle Almonds', price: '₹450' },
    { id: 'Chocolate', name: 'Single-Origin Swiss Chocolate', price: '₹600' },
    { id: 'Wine', name: 'Grand Reserve Cabernet (Mock)', price: '₹2500' }
  ];

  // Balcony Selections
  const balconyTypes = ['No Balcony', 'Garden View Balcony', 'Pool View Balcony', 'City View Balcony', 'Mountain View Balcony', 'Sea View Balcony', 'Luxury Private Balcony'];
  const balconySeatings = ['Single Chair', 'Double Chair', 'Couple Seating', 'Luxury Sofa Seating', 'Swing Chair'];
  const balconyDecorations = ['Fresh Flowers', 'Romantic Decoration', 'Birthday Decoration', 'Anniversary Decoration', 'Candle Light Setup', 'Premium Luxury Setup'];
  const balconyLightings = ['Warm Lights', 'Fairy Lights', 'Lantern Lights', 'Smart RGB Lights'];
  const balconyDinings = ['No Dining Setup', 'Breakfast Setup', 'Evening Tea Setup', 'Candle Light Dinner', 'Private Dining Experience'];
  const balconyThemes = ['Nature Green Theme', 'Tropical Theme', 'Zen Garden Theme', 'Floral Theme', 'Modern Theme'];

  // Sofa & Lighting selections
  const sofaTypes = ['No Sofa', 'Single Sofa', 'Double Sofa', 'Luxury Sofa Set', 'Recliner Sofa'];
  const roomLightings = ['Warm Lighting', 'Cool Lighting', 'Romantic Lighting', 'Party Lighting', 'Smart RGB Lighting'];
  const wallColors = ['White', 'Beige', 'Grey', 'Lavender Purple', 'Sky Blue', 'Sage Green', 'Luxury Gold'];

  // Food Preferences
  const specialDiets = ['None', 'Vegan', 'Jain', 'Diabetic', 'Gluten-Free'];

  const themeCategories = [
    "Nature Themes",
    "Royal Themes",
    "Modern Themes",
    "Futuristic Themes",
    "Artistic Themes",
    "Signature Hotel Themes"
  ];

  const handleNext = () => {
    if (validateStep()) {
      setValidationError('');
      setCurrentStep(prev => Math.min(prev + 1, 9));
    }
  };

  const handlePrev = () => {
    setValidationError('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const validateStep = () => {
    if (currentStep === 1 && !customization.pillowType) {
      setValidationError('Please select sleep pillow support.');
      return false;
    }
    if (currentStep === 7 && !customization.roomTheme) {
      setValidationError('Please select room ambient theme.');
      return false;
    }
    return true;
  };

  const handleMinibarToggle = (itemId) => {
    const activeItems = [...customization.minibarItems];
    if (activeItems.includes(itemId)) {
      updateCustomization({ minibarItems: activeItems.filter(i => i !== itemId) });
    } else {
      updateCustomization({ minibarItems: [...activeItems, itemId] });
    }
  };

  const handleProceedToPayment = () => {
    if (!validateStep()) return;
    
    // Save all customization options and navigate to checkout billing page
    if (tempBooking) {
      updateCustomization({
        tempBooking: {
          ...tempBooking,
          customisation: { ...customization }
        }
      });
    }

    navigate('/payment');
  };

  const selectedThemeObj = roomThemes.find(t => t.id === customization.roomTheme);

  // Dynamic Thermostat Color Dial
  const getThermostatColor = (temp) => {
    const pct = (temp - 16) / (30 - 16);
    const r = Math.floor(100 + pct * 150);
    const g = Math.floor(140 - pct * 50);
    const b = Math.floor(220 - pct * 150);
    return `rgba(${r}, ${g}, ${b}, 0.15)`;
  };

  // Subtotal breakdown preview
  const previewCosts = calculateCosts({
    ...tempBooking,
    type: 'Room',
    nights: tempBooking?.nights || 1,
    numRooms: tempBooking?.numRooms || 1,
    roomType: tempBooking?.roomType || 'standard',
    customisation: customization
  });

  return (
    <div className="customize-page page-fade-in">
      <div className="customizer-container">
        
        {/* Header */}
        <div className="wizard-header text-center">
          <span className="section-subtitle">SUITE PRE-SELECTION WIZARD</span>
          <h1 className="section-title">Elevate Your Comfort</h1>
          <div className="section-divider"></div>
        </div>

        {/* Progress Bar (9 Nodes) */}
        <div className="wizard-progress-bar glass-card">
          <div className="progress-steps-row">
            {steps.map(step => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <div key={step.id} className={`step-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                  <div className="step-circle" onClick={() => step.id < currentStep && setCurrentStep(step.id)}>
                    {isCompleted ? <Check size={14} /> : step.icon}
                  </div>
                  <span className="step-label">{step.name}</span>
                </div>
              );
            })}
          </div>
          <div className="progress-line-container">
            <div className="progress-line-fill" style={{ width: `${((currentStep - 1) / 8) * 100}%` }}></div>
          </div>
        </div>

        {validationError && (
          <div className="validation-error-banner mb-24">
            <AlertCircle size={18} />
            <span>{validationError}</span>
          </div>
        )}

        <div className="wizard-body-layout">
          
          {/* Main Customizer Panel */}
          <div className="glass-card wizard-panel">
            
            {/* Step 1: Pillows */}
            {currentStep === 1 && (
              <div className="step-content animate-fade">
                <h2 className="step-title">Select Sleep Support</h2>
                <p className="step-subtitle">Sanitized hypoallergenic cotton covers, 1000-thread count.</p>
                <div className="pillows-grid">
                  {pillows.map(pillow => {
                    const isSelected = customization.pillowType === pillow.id;
                    return (
                      <div 
                        key={pillow.id} 
                        className={`pillow-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => updateCustomization({ pillowType: pillow.id })}
                      >
                        <div className="pillow-select-indicator">
                          {isSelected && <Check size={10} />}
                        </div>
                        <Feather size={24} className="pillow-card-icon" />
                        <h3 className="pillow-name">{pillow.name}</h3>
                        <p className="pillow-desc">{pillow.desc}</p>
                        <span className="pillow-detail">{pillow.detail}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Temperature */}
            {currentStep === 2 && (
              <div className="step-content animate-fade">
                <h2 className="step-title">Thermostat Control</h2>
                <p className="step-subtitle">Pre-set room temperature. Automation executes 30 minutes before arrival.</p>
                <div className="thermostat-wrapper" style={{ backgroundColor: getThermostatColor(customization.temperature) }}>
                  <div className="thermostat-dial">
                    <span className="temp-display">{customization.temperature}°C</span>
                    <span className="temp-status">
                      {customization.temperature <= 19 ? 'Cool Climate' : 
                       customization.temperature <= 22 ? 'Optimal Comfort' : 'Warm Atmosphere'}
                    </span>
                  </div>
                </div>
                <div className="slider-container">
                  <div className="slider-limits"><span>16°C</span><span>30°C</span></div>
                  <input 
                    type="range" min="16" max="30" 
                    value={customization.temperature} 
                    onChange={(e) => updateCustomization({ temperature: parseInt(e.target.value) })}
                    className="luxury-slider"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Music */}
            {currentStep === 3 && (
              <div className="step-content animate-fade">
                <h2 className="step-title">Entry Soundscape</h2>
                <p className="step-subtitle">Acoustic background melody activated upon your check-in.</p>
                <div className="acoustics-list">
                  {acoustics.map(a => {
                    const isSelected = customization.musicMood === a.id;
                    return (
                      <div 
                        key={a.id} 
                        className={`acoustic-row ${isSelected ? 'selected' : ''}`}
                        onClick={() => updateCustomization({ musicMood: a.id })}
                      >
                        <div className="acoustic-icon-block">
                          {isSelected && a.id !== 'No Music' ? (
                            <div className="audio-wave-anim"><span className="bar bar1"></span><span className="bar bar2"></span><span className="bar bar3"></span></div>
                          ) : <Music size={16} />}
                        </div>
                        <div className="acoustic-details">
                          <h3 className="acoustic-name">{a.name}</h3>
                          <p className="acoustic-desc">{a.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Minibar */}
            {currentStep === 4 && (
              <div className="step-content animate-fade">
                <h2 className="step-title">Minibar Pre-stock</h2>
                <p className="step-subtitle">Add item configurations to your suite pantry. Charged only on usage.</p>
                <div className="minibar-table">
                  {minibar.map(item => {
                    const isSelected = customization.minibarItems.includes(item.id);
                    return (
                      <div 
                        key={item.id} 
                        className={`minibar-row ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleMinibarToggle(item.id)}
                      >
                        <div className="minibar-checkbox">{isSelected && <Check size={12} />}</div>
                        <div className="minibar-info">
                          <h3 className="minibar-name">{item.name}</h3>
                        </div>
                        <strong>{item.price}</strong>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 5: Balcony customisation */}
            {currentStep === 5 && (
              <div className="step-content animate-fade">
                <h2 className="step-title">Balcony Customisation</h2>
                <p className="step-subtitle">Configure views, seating layouts, and candlelight dinner tables.</p>
                
                <div className="customizer-options-scrollable">
                  <div className="form-group mb-16">
                    <label className="form-label">Balcony Deck View Type</label>
                    <select 
                      value={customization.balconyType}
                      onChange={(e) => updateCustomization({ balconyType: e.target.value })}
                      className="luxury-input"
                    >
                      {balconyTypes.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>

                  <div className="form-grid-2 mb-16">
                    <div className="form-group">
                      <label className="form-label">Seating Furniture</label>
                      <select 
                        value={customization.balconySeating}
                        onChange={(e) => updateCustomization({ balconySeating: e.target.value })}
                        className="luxury-input"
                      >
                        {balconySeatings.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Balcony Theme</label>
                      <select 
                        value={customization.balconyTheme}
                        onChange={(e) => updateCustomization({ balconyTheme: e.target.value })}
                        className="luxury-input"
                      >
                        {balconyThemes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="form-grid-2 mb-16">
                    <div className="form-group">
                      <label className="form-label">Theme Decoration</label>
                      <select 
                        value={customization.balconyDecoration}
                        onChange={(e) => updateCustomization({ balconyDecoration: e.target.value })}
                        className="luxury-input"
                      >
                        {balconyDecorations.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Aesthetic Lighting</label>
                      <select 
                        value={customization.balconyLighting}
                        onChange={(e) => updateCustomization({ balconyLighting: e.target.value })}
                        className="luxury-input"
                      >
                        {balconyLightings.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Balcony Dining Settings</label>
                    <select 
                      value={customization.balconyDining}
                      onChange={(e) => updateCustomization({ balconyDining: e.target.value })}
                      className="luxury-input"
                    >
                      {balconyDinings.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Sofa, lighting and Wall colors */}
            {currentStep === 6 && (
              <div className="step-content animate-fade">
                <h2 className="step-title">Furniture & Decor Details</h2>
                <p className="step-subtitle">Configure room sofa layouts, lighting modes, and wall color schemes.</p>
                
                <div className="form-group mb-16">
                  <label className="form-label">Sofa Selections</label>
                  <select 
                    value={customization.sofaType}
                    onChange={(e) => updateCustomization({ sofaType: e.target.value })}
                    className="luxury-input"
                  >
                    {sofaTypes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="form-group mb-16">
                  <label className="form-label">Lighting Ambience Selection</label>
                  <select 
                    value={customization.roomLighting}
                    onChange={(e) => updateCustomization({ roomLighting: e.target.value })}
                    className="luxury-input"
                  >
                    {roomLightings.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Wall Paint Shade Color</label>
                  <select 
                    value={customization.wallColor}
                    onChange={(e) => updateCustomization({ wallColor: e.target.value })}
                    className="luxury-input"
                  >
                    {wallColors.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* Step 7: Room Theme selection */}
            {currentStep === 7 && (
              <div className="step-content animate-fade">
                <h2 className="step-title">Ambient Room Theme</h2>
                <p className="step-subtitle">30 curated luxury themes adjusting visual profiles and scents.</p>
                <div className="themes-tab-nav">
                  {themeCategories.map(cat => (
                    <button 
                      key={cat} type="button" 
                      className={`tab-nav-btn ${activeCategoryTab === cat ? 'active' : ''}`}
                      onClick={() => setActiveCategoryTab(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="themes-select-grid">
                  {roomThemes
                    .filter(t => t.category === activeCategoryTab)
                    .map(theme => {
                      const isSelected = customization.roomTheme === theme.id;
                      const isRecommended = theme.id === 'maharaja-palace' || theme.id === 'business-executive';
                      return (
                        <div 
                          key={theme.id} 
                          className={`theme-select-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => updateCustomization({ roomTheme: theme.id, roomThemeName: theme.name })}
                          style={{ '--accent-color': theme.accentColor }}
                        >
                          <div className="theme-card-img-wrapper">
                            <img src={theme.image} alt={theme.name} className="theme-card-img" />
                            {isSelected && <div className="theme-selected-badge"><Check size={12} /> Selected</div>}
                            {isRecommended && <div className="theme-recommended-badge"><Sparkles size={10} /> Recommended</div>}
                          </div>
                          <div className="theme-card-body">
                            <h4 className="theme-card-name">{theme.name}</h4>
                            <p className="theme-card-desc">{theme.description}</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Step 8: Dining Preference */}
            {currentStep === 8 && (
              <div className="step-content animate-fade">
                <h2 className="step-title">Dining Preferences</h2>
                <p className="step-subtitle">Pre-set breakfast, lunch, and dinner preferences. Includes special diets.</p>
                
                <div className="form-grid-2 mb-16">
                  <div className="form-group">
                    <label className="form-label">Breakfast Choice</label>
                    <select 
                      value={customization.breakfastType}
                      onChange={(e) => updateCustomization({ breakfastType: e.target.value })}
                      className="luxury-input"
                    >
                      <option value="Veg">Vegetarian - ₹500/day</option>
                      <option value="Non-Veg">Non-Vegetarian - ₹700/day</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Lunch Choice</label>
                    <select 
                      value={customization.lunchType}
                      onChange={(e) => updateCustomization({ lunchType: e.target.value })}
                      className="luxury-input"
                    >
                      <option value="Veg">Vegetarian - ₹1200/day</option>
                      <option value="Non-Veg">Non-Vegetarian - ₹1500/day</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid-2 mb-16">
                  <div className="form-group">
                    <label className="form-label">Dinner Choice</label>
                    <select 
                      value={customization.dinnerType}
                      onChange={(e) => updateCustomization({ dinnerType: e.target.value })}
                      className="luxury-input"
                    >
                      <option value="Veg">Vegetarian - ₹1500/day</option>
                      <option value="Non-Veg">Non-Vegetarian - ₹2000/day</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Special Dietary Needs</label>
                    <select 
                      value={customization.specialDiet}
                      onChange={(e) => updateCustomization({ specialDiet: e.target.value })}
                      className="luxury-input"
                    >
                      {specialDiets.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 9: Special requests */}
            {currentStep === 9 && (
              <div className="step-content animate-fade">
                <h2 className="step-title">Special Accommodations</h2>
                <p className="step-subtitle">State any additional details (extra cribs, flowers, etc.)</p>
                <div className="requests-form-group">
                  <textarea 
                    value={customization.specialRequests}
                    onChange={(e) => updateCustomization({ specialRequests: e.target.value })}
                    placeholder="Enter details..."
                    className="luxury-textarea"
                    rows="6"
                  ></textarea>
                </div>
              </div>
            )}

            {/* Step Controls */}
            <div className="step-controls">
              {currentStep > 1 && (
                <button className="luxury-btn luxury-btn-secondary" onClick={handlePrev}>
                  <ArrowLeft size={16} /> Back
                </button>
              )}
              {currentStep < 9 ? (
                <button className="luxury-btn luxury-btn-primary ms-auto" onClick={handleNext}>
                  Next <ArrowRight size={16} />
                </button>
              ) : (
                <button 
                  className="luxury-btn luxury-btn-primary ms-auto" 
                  onClick={handleProceedToPayment}
                >
                  Proceed to Payment <ArrowRight size={16} />
                </button>
              )}
            </div>

          </div>

          {/* Right Live Preview & Billing Panel */}
          <div className="glass-card live-preview-panel">
            <h2 className="preview-panel-title">Your Suite Config</h2>
            
            <div className="preview-card">
              <div className="preview-card-bg-wrapper">
                <img src={selectedThemeObj?.image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'} alt="Room Preview" className="preview-card-bg" />
                <div className="preview-card-overlay"></div>
              </div>
              <div className="preview-card-body">
                <div className="preview-theme-badge">
                  <Sparkles size={12} />
                  <span>Theme: {selectedThemeObj?.name || 'Standard'}</span>
                </div>
                
                <div className="preview-metrics">
                  <div className="metric-badge"><Feather size={12} /> <span>Pillow: {customization.pillowType}</span></div>
                  <div className="metric-badge"><Thermometer size={12} /> <span>Temp: {customization.temperature}°C</span></div>
                  <div className="metric-badge"><Music size={12} /> <span>Acoustic: {customization.musicMood}</span></div>
                </div>

                <div className="preview-balcony-details mt-10">
                  <div className="preview-label">Balcony & Decor:</div>
                  <span className="item-badge">{customization.balconyType}</span>
                  <span className="item-badge">{customization.sofaType}</span>
                  <span className="item-badge">Walls: {customization.wallColor}</span>
                </div>

                {tempBooking && (
                  <div className="preview-billing-card mt-16 pt-10 border-top-l">
                    <div className="preview-label">Estimated Bill (18% GST incl.):</div>
                    <div className="flex-row-sb">
                      <span>Stay Duration:</span>
                      <strong>{tempBooking.nights} Night(s)</strong>
                    </div>
                    <div className="flex-row-sb grand-total-line">
                      <span>Total Amount:</span>
                      <strong className="text-gold">₹{previewCosts.grandTotal}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
