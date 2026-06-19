// Contact.jsx
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    
    // Simulate API request to concierge inbox
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1000);
  };

  return (
    <div className="contact-page page-fade-in">
      <div className="contact-container">
        
        {/* Header */}
        <div className="contact-header text-center">
          <span className="section-subtitle">CONCIERGE DESK</span>
          <h1 className="section-title">Connect With Us</h1>
          <div className="section-divider"></div>
        </div>

        <div className="contact-layout-grid">
          
          {/* Left Column: Info Card & Map */}
          <div className="contact-info-panel">
            <div className="glass-card info-card-nested">
              <h2 className="info-panel-title">Grand Sterling Hotel</h2>
              <p className="info-panel-desc">
                For urgent suite pre-selection changes or customized concierge assistance, please connect with our 24/7 reception desk.
              </p>

              <div className="info-list-group">
                <div className="info-item-row">
                  <MapPin className="info-icon" size={18} />
                  <div>
                    <span className="info-label">Address</span>
                    <span className="info-val">742 Premium Avenue, Belgravia, London, SW1X 8NY</span>
                  </div>
                </div>

                <div className="info-item-row">
                  <Phone className="info-icon" size={18} />
                  <div>
                    <span className="info-label">Direct Dial</span>
                    <a href="tel:+442079460921" className="info-val info-link">+44 (20) 7946 0921</a>
                  </div>
                </div>

                <div className="info-item-row">
                  <Mail className="info-icon" size={18} />
                  <div>
                    <span className="info-label">Concierge Email</span>
                    <a href="mailto:concierge@grandsterlinghotel.com" className="info-val info-link">concierge@grandsterlinghotel.com</a>
                  </div>
                </div>
              </div>

              <div className="contact-social-icons">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg></a>
              </div>
            </div>

            {/* Google Map Iframe (Premium Styled) */}
            <div className="glass-card map-card-nested">
              <iframe 
                title="Grand Sterling Hotel Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.4735233633633!2d-0.1554558!3d51.498877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4876051515151515%3A0x1515151515151515!2sBelgravia%2C%20London%2C%20UK!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s" 
                width="100%" 
                height="220" 
                style={{ border: 0, borderRadius: '8px' }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="glass-card contact-form-panel">
            <h2 className="panel-title mb-24">Concierge Inquiry</h2>
            
            {submitSuccess && (
              <div className="form-success-banner">
                <CheckCircle2 size={16} /> Inquiry sent successfully. A butler will respond to your registered email shortly.
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form-body">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Lady Genevieve Sterling"
                  className="luxury-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. genevieve.sterling@regency.com"
                  className="luxury-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">Inquiry Message</label>
                <textarea 
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please state how we can elevate your upcoming stay..."
                  className="luxury-textarea"
                  rows="6"
                  required
                ></textarea>
              </div>

              <button type="submit" className="luxury-btn luxury-btn-primary w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending inquiry...' : 'Send Inquiry Message'} <Send size={15} />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
