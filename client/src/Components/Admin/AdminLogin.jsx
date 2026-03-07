import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [deniedMessage, setDeniedMessage] = useState(
    location.state?.accessDenied ? 'You do not have admin privileges to access this panel.' : ''
  );
  const [showDeniedPopup, setShowDeniedPopup] = useState(
    !!location.state?.accessDenied
  );

  const decodeToken = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setDeniedMessage('Please fill in both email and password.');
      setShowDeniedPopup(true);
      return;
    }

    setIsLoading(true);

    try {
      const url = `${process.env.REACT_APP_API_URL}/api/auth/login`;
      const response = await axios.post(url, {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        const decoded = decodeToken(response.data.token);
        if (!decoded?.isAdmin) {
          setDeniedMessage('You do not have admin privileges to access this panel.');
          setShowDeniedPopup(true);
          return;
        }
        localStorage.setItem('token', response.data.token);
        navigate('/admin-dashboard');
      }
    } catch (err) {
      setDeniedMessage('You do not have admin privileges to access this panel.');
      setShowDeniedPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      {showDeniedPopup && (
        <div className="admin-denied-overlay">
          <div className="admin-denied-modal">
            <div className="admin-denied-icon">
              <img src="/stop.png" alt="denied" onError={(e) => { e.target.style.display='none'; }} />
              <span className="admin-denied-emoji">⛔</span>
            </div>
            <h2>Access Denied</h2>
            <p>{deniedMessage}</p>
            <div className="admin-denied-actions">
              <button className="admin-denied-dismiss" onClick={() => setShowDeniedPopup(false)}>
                Dismiss
              </button>
              <button className="admin-denied-home" onClick={() => navigate('/')}>
                Go to Home
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Left – Form */}
      <div className="admin-login-left">
        <div className="admin-form-wrapper">
          <h1 className="admin-heading">Admin Login</h1>

          {/* ── No inline error message; popup handles all errors ── */}

          <form onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label htmlFor="admin-email">Email address</label>
              <input
                id="admin-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="admin-form-group admin-password-group">
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <span
                className="admin-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img
                  src={showPassword ? '/view.png' : '/eyebrow.png'}
                  alt="toggle password visibility"
                />
              </span>
            </div>

            <button
              type="submit"
              className="admin-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Please wait...' : 'Login'}
            </button>
          </form>

          <p className="admin-back-text">
            <a href="/">&larr; Back to Fyto</a>
          </p>
        </div>
      </div>

      {/* Right – Image */}
      <div className="admin-login-right">
        <img src="/adminP.jpg" alt="Plants" />
      </div>
    </div>
  );
};

export default AdminLogin;
