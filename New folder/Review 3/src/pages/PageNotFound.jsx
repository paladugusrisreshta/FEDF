// PageNotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import './PageNotFound.css';

export default function PageNotFound() {
  return (
    <div className="notfound-page page-fade-in">
      <div className="notfound-card glass-card text-center">
        <HelpCircle size={48} className="gold-icon mb-16 animate-bounce" />
        <h1 className="notfound-title">Suite Lost in Transit</h1>
        <span className="notfound-code">404 - Registry Entry Not Located</span>
        <p className="notfound-desc">
          We apologize, but the guest-room customisation route you are attempting to access does not exist on our servers.
        </p>
        <Link to="/" className="luxury-btn luxury-btn-primary return-btn">
          <ArrowLeft size={16} /> Return to Lobby
        </Link>
      </div>
    </div>
  );
}
