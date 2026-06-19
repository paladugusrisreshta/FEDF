// Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="luxury-footer">
      <div className="footer-container">
        {/* Info Column */}
        <div className="footer-col info-col">
          <Link to="/" className="footer-logo">
            <span className="logo-brand">LUXURY STAY</span>
            <span className="logo-sub">PORTAL</span>
          </Link>
          <p className="footer-desc">
            Experience the height of luxury at our award-winning locations. Pre-customise your suite elements for a tailored check-in experience.
          </p>
          <div className="social-icons">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
          </div>
        </div>

        {/* Links Column */}
        <div className="footer-col links-col">
          <h4 className="footer-heading">Navigation</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/customize">Customize Room</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/history">Customization History</Link></li>
            <li><Link to="/profile">Guest Profile</Link></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="footer-col contact-col">
          <h4 className="footer-heading">Grand Sterling Hotel</h4>
          <ul className="contact-details">
            <li>
              <MapPin size={16} className="contact-icon" />
              <span>742 Premium Avenue, Belgravia, London, SW1X 8NY</span>
            </li>
            <li>
              <Phone size={16} className="contact-icon" />
              <a href="tel:+442079460921">+44 (20) 7946 0921</a>
            </li>
            <li>
              <Mail size={16} className="contact-icon" />
              <a href="mailto:concierge@grandsterlinghotel.com">concierge@grandsterlinghotel.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Grand Sterling Hotel Group. All rights reserved. Designed for elite hospitality.</p>
      </div>
    </footer>
  );
}
