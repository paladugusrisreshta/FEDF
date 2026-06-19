// Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Lock, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import './Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { registerUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Password strength calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-gray' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: 'strength-weak' };
    if (score <= 4) return { score, label: 'Medium', color: 'strength-medium' };
    return { score, label: 'Strong', color: 'strength-strong' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validations
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.password || !formData.confirmPassword) {
      setError('Please complete all form fields.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please provide a valid email format.');
      return;
    }

    // Mobile validation (simple digits check)
    const phoneRegex = /^\+?[0-9\s\-()]{7,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please provide a valid contact number.');
      return;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (strength.label === 'Weak') {
      setError('Password is too weak. Please include letters, numbers, and symbols.');
      return;
    }

    const res = registerUser({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      password: formData.password
    });

    if (res.success) {
      setSuccess('Your luxury guest registry has been created! Redirecting to login...');
      setTimeout(() => {
        navigate('/login', { state: { from: location.state?.from } });
      }, 1500);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="auth-page-wrapper page-fade-in">
      <div className="auth-card glass-card">
        <div className="auth-card-header">
          <span className="logo-brand">LUXURY STAY</span>
          <span className="logo-sub">GUEST REGISTRY</span>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join our elite loyalty registry for a customized experience.</p>
        </div>

        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="auth-success-banner">
            <ShieldCheck size={16} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <div className="auth-input-wrapper">
              <User size={16} className="auth-input-icon" />
              <input 
                type="text" 
                id="name"
                name="name"
                value={formData.name} 
                onChange={handleChange}
                className="luxury-input auth-field-input"
                placeholder="e.g. Lady Genevieve Sterling"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="auth-input-wrapper">
              <Mail size={16} className="auth-input-icon" />
              <input 
                type="email" 
                id="email"
                name="email"
                value={formData.email} 
                onChange={handleChange}
                className="luxury-input auth-field-input"
                placeholder="e.g. guest@luxury.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">Mobile Number</label>
            <div className="auth-input-wrapper">
              <Phone size={16} className="auth-input-icon" />
              <input 
                type="tel" 
                id="phone"
                name="phone"
                value={formData.phone} 
                onChange={handleChange}
                className="luxury-input auth-field-input"
                placeholder="e.g. +1 (555) 728-9321"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="address">Residential Address</label>
            <div className="auth-input-wrapper">
              <MapPin size={16} className="auth-input-icon" />
              <input 
                type="text" 
                id="address"
                name="address"
                value={formData.address} 
                onChange={handleChange}
                className="luxury-input auth-field-input"
                placeholder="e.g. London, SW1X 8NY"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-input-icon" />
              <input 
                type={showPassword ? "text" : "password"} 
                id="password"
                name="password"
                value={formData.password} 
                onChange={handleChange}
                className="luxury-input auth-field-input"
                placeholder="••••••••"
                required
              />
              <button 
                type="button"
                className="show-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle Password Visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Password strength meter */}
            {formData.password && (
              <div className="password-strength-meter-wrapper">
                <div className="strength-bar-bg">
                  <div className={`strength-bar-fill ${strength.color}`} style={{ width: `${(strength.score / 5) * 100}%` }}></div>
                </div>
                <span className="strength-label">Password Strength: {strength.label}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-input-icon" />
              <input 
                type={showPassword ? "text" : "password"} 
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword} 
                onChange={handleChange}
                className="luxury-input auth-field-input"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="luxury-btn luxury-btn-primary auth-submit-btn">
            Create Guest Registry
          </button>
        </form>

        <div className="auth-footer-link">
          <span>Already registered? </span>
          <Link to="/login" state={{ from: location.state?.from }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}
