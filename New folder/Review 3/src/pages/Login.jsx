// Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useAuth();
  
  // Destination after login
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validations
    if (!email || !password) {
      setError('Please fill in all credentials.');
      return;
    }

    const res = loginUser(email, password);
    if (res.success) {
      setSuccess('Authorization granted. Welcoming you to your sanctuary...');
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="auth-page-wrapper page-fade-in">
      <div className="auth-card glass-card">
        <div className="auth-card-header">
          <span className="logo-brand">LUXURY STAY</span>
          <span className="logo-sub">GUEST PORTAL</span>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to manage and configure your suite reservations.</p>
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

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="auth-input-wrapper">
              <Mail size={16} className="auth-input-icon" />
              <input 
                type="email" 
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="luxury-input auth-field-input"
                placeholder="guest@luxury.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="label-row">
              <label className="form-label" htmlFor="password">Password</label>
              <a href="#forgot" className="forgot-password-link" onClick={() => alert('Password reset directions sent to your email.')}>Forgot?</a>
            </div>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-input-icon" />
              <input 
                type={showPassword ? "text" : "password"} 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>

          <div className="checkbox-row-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="luxury-checkbox"
              />
              <span>Remember Me</span>
            </label>
          </div>

          <button type="submit" className="luxury-btn luxury-btn-primary auth-submit-btn">
            Log In to Sanctuary
          </button>
        </form>

        <div className="auth-footer-link">
          <span>First time staying with us? </span>
          <Link to="/register" state={{ from: location.state?.from }}>Create Guest Account</Link>
        </div>
      </div>
    </div>
  );
}
