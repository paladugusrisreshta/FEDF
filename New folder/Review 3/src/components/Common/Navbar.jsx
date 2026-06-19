// Navbar.jsx
import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Sun, Moon, Bell, Menu, X, Award, LogOut, LogIn } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { notifications } = useApp();
  const { darkMode, toggleDarkMode } = useTheme();
  const { currentUser, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getLoyaltyBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'platinum': return 'badge-platinum';
      case 'gold': return 'badge-gold';
      case 'silver': return 'badge-silver';
      default: return 'badge-default';
    }
  };

  const handleLogout = () => {
    logoutUser();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="glass-nav sticky-nav">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={() => setMobileMenuOpen(false)}>
          <span className="logo-brand">LUXURY STAY</span>
          <span className="logo-sub">PORTAL</span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-menu-desktop">
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            Home
          </NavLink>
          <NavLink to="/rooms" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            Rooms
          </NavLink>
          <NavLink to="/banquet" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            Banquet Booking
          </NavLink>
          <NavLink to="/customize" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            Room Customisation
          </NavLink>
          {currentUser && (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                Dashboard
              </NavLink>
              <NavLink to="/history" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                Booking History
              </NavLink>
              <NavLink to="/notifications" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <div className="notification-icon-wrapper">
                  Notifications
                  {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                </div>
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                Profile
              </NavLink>
            </>
          )}
          <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            Admin
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            Contact
          </NavLink>
        </div>

        {/* Right side actions */}
        <div className="nav-actions">
          {/* Loyalty Badge if Logged In */}
          {currentUser ? (
            <div className={`loyalty-pill ${getLoyaltyBadgeColor(currentUser.loyaltyStatus)}`}>
              <Award className="icon-gold" size={14} />
              <span>{currentUser.loyaltyStatus}</span>
            </div>
          ) : (
            <Link to="/login" className="login-nav-btn">
              <LogIn size={14} /> <span>Sign In</span>
            </Link>
          )}

          {/* Theme Toggle */}
          <button 
            className="action-btn theme-toggle-btn" 
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={18} className="sun-icon" /> : <Moon size={18} className="moon-icon" />}
          </button>

          {/* Bell Icon Shortcut */}
          {currentUser && (
            <Link to="/notifications" className="action-btn bell-btn" aria-label="Notifications">
              <Bell size={18} />
              {unreadCount > 0 && <span className="bell-badge"></span>}
            </Link>
          )}

          {/* Logout if Logged In */}
          {currentUser && (
            <button className="action-btn logout-nav-btn" onClick={handleLogout} title="Sign Out">
              <LogOut size={16} />
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="action-btn mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer slide-up">
          <div className="mobile-drawer-links">
            <NavLink to="/" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/rooms" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
              Rooms
            </NavLink>
            <NavLink to="/banquet" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
              Banquet Booking
            </NavLink>
            <NavLink to="/customize" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
              Room Customisation
            </NavLink>
            {currentUser ? (
              <>
                <NavLink to="/dashboard" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </NavLink>
                <NavLink to="/history" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                  Booking History
                </NavLink>
                <NavLink to="/notifications" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                  Notifications {unreadCount > 0 && `(${unreadCount})`}
                </NavLink>
                <NavLink to="/profile" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </NavLink>
                <button className="mobile-nav-item text-left logout-action-btn-mobile" onClick={handleLogout}>
                  Sign Out
                </button>
              </>
            ) : (
              <NavLink to="/login" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                Sign In / Register
              </NavLink>
            )}
            <NavLink to="/admin" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
              Admin Panel
            </NavLink>
            <NavLink to="/contact" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}
