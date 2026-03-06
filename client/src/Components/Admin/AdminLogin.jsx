import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
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
        localStorage.setItem('token', response.data.token);
        navigate('/admin-dashboard');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      {/* Left – Form */}
      <div className="admin-login-left">
        <div className="admin-form-wrapper">
          <h1 className="admin-heading">Admin Login</h1>

          {error && <div className="admin-error-message">{error}</div>}

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
