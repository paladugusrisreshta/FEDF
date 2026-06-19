// Home.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, Thermometer, Music, ShoppingBag, Palette, 
  Feather, Compass, CheckCircle, ShieldCheck, Heart, Star, 
  MapPin, Phone, Mail, Award, MessageSquare 
} from 'lucide-react';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const { reviews, submitReview } = useApp();
  const { currentUser } = useAuth();

  // Review form states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const features = [
    {
      icon: <Compass className="gold-icon" size={24} />,
      title: "Hotel Room Booking",
      description: "Book Standard, Deluxe, Executive, or Presidential suites with customized stay slots."
    },
    {
      icon: <ShoppingBag className="gold-icon" size={24} />,
      title: "Banquet Hall Booking",
      description: "Reserve Wedding, Reception, Birthday, Conference, or Corporate halls with catering, audio, and decor."
    },
    {
      icon: <Compass className="gold-icon" size={24} />,
      title: "Balcony Customisation",
      description: "Choose private decks, garden or sea views, seating chairs, and candlelight dinner tables."
    },
    {
      icon: <Palette className="gold-icon" size={24} />,
      title: "Room Theme Selection",
      description: "Intelligent lighting vectors and scent diffusions curated across 30 luxury themes."
    },
    {
      icon: <Feather className="gold-icon" size={24} />,
      title: "Smart Room Preferences",
      description: "Select soft down, buckwheat core, or therapeutic memory foam sleep support."
    },
    {
      icon: <ShieldCheck className="gold-icon" size={24} />,
      title: "Secure Online Payments",
      description: "Pay securely via Credit Cards, UPI, or cash, and download formal billing invoices instantly."
    }
  ];

  const benefits = [
    { icon: <Compass size={20} />, title: "Personalized Luxury Experience", description: "All room settings are automatically configured before you arrive." },
    { icon: <CheckCircle size={20} />, title: "Smart Hotel Automation", description: "Digital climate control and welcome soundscapes sync instantly." },
    { icon: <ShieldCheck size={20} />, title: "Premium Hospitality", description: "Enjoy five-star luxury services and dedicated butler assist." },
    { icon: <Sparkles size={20} />, title: "Digital Check-In", description: "Skip reception lines and check-in directly through the portal." },
    { icon: <Award size={20} />, title: "Luxury Facilities", description: "Access world-class spas, infinity pools, and fine dining." },
    { icon: <MessageSquare size={20} />, title: "24/7 Customer Support", description: "Our virtual concierge and live desks are available at any hour." }
  ];

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    submitReview(currentUser?.name || 'Anonymous Guest', rating, comment);
    setComment('');
    setRating(5);
    setReviewSuccess(true);

    setTimeout(() => {
      setReviewSuccess(false);
    }, 4000);
  };

  // Only display approved reviews
  const approvedReviews = reviews.filter(r => r.approved);
  const averageRating = approvedReviews.length > 0
    ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="home-page page-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="hero-badge slide-up">WELCOME TO THE GRAND STERLING</span>
          <h1 className="hero-title slide-up">Personalize Your Stay Before You Arrive</h1>
          <p className="hero-subtext slide-up">Design your comfort, mood and luxury experience</p>
          <div className="hero-actions slide-up">
            <Link to="/rooms" className="luxury-btn luxury-btn-primary">
              Book Now <Sparkles size={16} />
            </Link>
            <Link to="/banquet" className="luxury-btn luxury-btn-secondary">
              Book Banquet Hall
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-subtitle">OUR CAPABILITIES</span>
          <h2 className="section-title">Design Your Perfect Sanctuary</h2>
          <div className="section-divider"></div>
        </div>

        <div className="features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className="glass-card feature-card">
              <div className="feature-icon-wrapper">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-section">
        <div className="why-container">
          <div className="why-image-panel">
            <img 
              src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80" 
              alt="Luxury Suite Room" 
              className="why-img"
            />
            <div className="why-img-overlay">
              <div className="glass-card image-badge">
                <Heart className="heart-icon animate-pulse" size={20} />
                <span>Voted World's Best Tailored Stay 2025</span>
              </div>
            </div>
          </div>
          
          <div className="why-content-panel">
            <span className="section-subtitle">THE EXPERIENCE</span>
            <h2 className="section-title text-left">Why Pre-configure Your Suite?</h2>
            <p className="why-text-desc">
              Hospitality shouldn't be standardized. Our digital customisation portal links directly with automated in-room smart features, pre-stocking bars and configuring climates so that your room matches your expectations from the first second.
            </p>

            <div className="benefits-list">
              {benefits.map((b, idx) => (
                <div key={idx} className="benefit-item">
                  <div className="benefit-icon">
                    {b.icon}
                  </div>
                  <div className="benefit-info">
                    <h4 className="benefit-title">{b.title}</h4>
                    <p className="benefit-desc">{b.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-header">
          <span className="section-subtitle">GUEST JOURNAL</span>
          <h2 className="section-title font-serif">Reflections of Comfort</h2>
          <div className="average-rating-badge mb-16" style={{ marginTop: '12px', fontSize: '0.95rem', color: 'var(--gold-dark)' }}>
            <span className="star" style={{ marginRight: '6px' }}>★</span>
            <strong>{averageRating} / 5.0</strong> rating based on verified guest feedback
          </div>
          <div className="section-divider"></div>
        </div>

        <div className="testimonials-grid">
          {approvedReviews.map(r => (
            <div key={r.id} className="glass-card testimonial-card">
              <div className="star-rating">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <span key={i} className="star">&#9733;</span>
                ))}
              </div>
              <p className="testimonial-quote">"{r.comment}"</p>
              <div className="testimonial-guest">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(r.guestName)}&background=C5A880&color=fff&bold=true`} 
                  alt={r.guestName} 
                  className="guest-avatar" 
                />
                <div className="guest-info">
                  <h4 className="guest-name">{r.guestName}</h4>
                  <span className="guest-status">Verified Guest | {new Date(r.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Guest Review Submission Form */}
        {currentUser ? (
          <div className="glass-card home-review-form-panel mt-32">
            <h3 className="panel-title text-center mb-16"><MessageSquare size={16} className="text-gold mr-8" /> Write a Review</h3>
            {reviewSuccess && (
              <div className="form-success-banner mb-16">
                <CheckCircle size={16} /> Review submitted. It will appear on the guest journal upon administrator approval.
              </div>
            )}
            <form onSubmit={handleReviewSubmit} className="home-review-form">
              <div className="form-group mb-16">
                <label className="form-label">Rating Value</label>
                <select value={rating} onChange={e=>setRating(parseInt(e.target.value))} className="luxury-input">
                  <option value="5">5 Stars - Exceptional</option>
                  <option value="4">4 Stars - Excellent</option>
                  <option value="3">3 Stars - Standard</option>
                  <option value="2">2 Stars - Fair</option>
                  <option value="1">1 Star - Poor</option>
                </select>
              </div>
              <div className="form-group mb-16">
                <label className="form-label">Review / Comment</label>
                <textarea 
                  value={comment} onChange={e=>setComment(e.target.value)} 
                  placeholder="Share details of your customized suite stay..." 
                  className="luxury-textarea" rows="3" required
                ></textarea>
              </div>
              <button type="submit" className="luxury-btn luxury-btn-primary w-full">Submit Feedback</button>
            </form>
          </div>
        ) : (
          <div className="glass-card home-review-form-panel text-center mt-32">
            <p className="text-muted">Registered guest? <Link to="/login" className="text-gold">Log in</Link> to share your review on our guest journal.</p>
          </div>
        )}
      </section>
    </div>
  );
}
