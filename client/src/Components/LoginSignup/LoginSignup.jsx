import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utils/Firebase';
import axios from 'axios';
import './LoginSignup.css';

const LoginSignup = ({ mode = 'login', onClose, onModeChange }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    setIsLogin(mode === 'login');
  }, [mode]);

  const getPasswordStrength = (password) => {
    if (!password) return { strength: '', text: '' };

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);

    const criteria = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;

    if (password.length < 4) return { strength: 'weak', text: 'Password strength is Weak' };
    if (criteria <= 2 || password.length < 8) return { strength: 'weak', text: 'Password strength is Weak' };
    if (criteria === 3) return { strength: 'medium', text: 'Password strength is Medium' };
    return { strength: 'strong', text: 'Password strength is Strong' };
  };

  const passwordStrengthData = !isLogin ? getPasswordStrength(formData.password) : { strength: '', text: '' };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Frontend validation
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
    }

    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const url = `${process.env.REACT_APP_API_URL}${endpoint}`;
      const body = isLogin
        ? { email: formData.email, password: formData.password }
        : {
          name: formData.name,
          email: formData.email,
          username: formData.username,
          password: formData.password
        };

      const response = await axios.post(url, body);

      const data = response.data;

      if (data.success) {
        if (isLogin) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userEmail', data.data.email);
          setSuccessMessage('Login successful!');

          setTimeout(() => {
            onClose && onClose();
            navigate('/social');
          }, 1500);
        } else {
          setSuccessMessage('Account created successfully! Please login.');
          setTimeout(() => {
            toggleMode();
          }, 2000);
        }
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to connect to server. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    const newMode = !isLogin;
    setIsLogin(newMode);
    setFormData({ name: '', email: '', username: '', password: '', confirmPassword: '' });
    setError('');
    setSuccessMessage('');
    if (onModeChange) {
      onModeChange(newMode ? 'login' : 'signup');
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Sanitize username to be alphanumeric only
      const displayName = user.displayName || user.email.split('@')[0];
      const sanitizedUsername = displayName.replace(/[^a-zA-Z0-9]/g, '') + Math.floor(Math.random() * 1000);

      // Use Google UID as password for consistent authentication
      const googlePassword = user.uid;

      const endpoint = isLogin ? "/login" : "/register";
      let body;
      if (!isLogin) {
        body = {
          name: displayName,
          email: user.email,
          username: sanitizedUsername,
          password: googlePassword
        };
      } else {
        body = {
          email: user.email,
          password: googlePassword
        };
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth${endpoint}`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const data = response.data;

      if (data.success) {
        if (isLogin) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userEmail', data.data.email);
          setSuccessMessage('Google login successful!');

          setTimeout(() => {
            onClose && onClose();
            navigate('/social');
          }, 1500);
        } else {
          setSuccessMessage('Account created successfully! Please login.');
          setTimeout(() => {
            toggleMode();
          }, 2000);
        }
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Google sign-in failed. Please try again.');
      } else {
        setError('Google sign-in failed. Please try again.');
      }
      console.error('Google Sign-In error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="login-signup-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>&times;</button>
        <div className="form-wrapper">
          <div className="logo-header">
            <img src="/2.png" alt="Fyto Logo" className="logo-image" />
            <span className="logo-text">Fyto</span>
          </div>
          <h2>{isLogin ? 'Login' : 'Sign In'}</h2>

          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                />
              </div>
            )}
            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </div>
            {!isLogin && (
              <div className="form-group">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  required
                />
              </div>
            )}
            <div className="form-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img
                  src={showPassword ? "/view.png" : "/eyebrow.png"}
                  alt="toggle password visibility"
                />
              </span>
            </div>
            {!isLogin && formData.password && (
              <>
                <div className="password-criteria">
                  <span className={formData.password && /[a-z]/.test(formData.password) ? 'active' : ''}>Lower</span>
                  <span className={formData.password && /[A-Z]/.test(formData.password) ? 'active' : ''}>Upper</span>
                  <span className={formData.password && /[0-9]/.test(formData.password) ? 'active' : ''}>Number</span>
                  <span className={formData.password && /[^a-zA-Z0-9]/.test(formData.password) ? 'active' : ''}>Symbol</span>
                </div>
                {passwordStrengthData.text && (
                  <div className={`password-strength ${passwordStrengthData.strength}`}>
                    {passwordStrengthData.text}
                  </div>
                )}
              </>
            )}
            {!isLogin && (
              <div className="form-group password-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  required
                />
                <span
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <img
                    src={showConfirmPassword ? "/view.png" : "/eyebrow.png"}
                    alt="toggle password visibility"
                  />
                </span>
              </div>
            )}
            <button type="submit" className="submit-btn1" disabled={isLoading}>
              {isLoading ? 'Please wait...' : 'Submit'}
            </button>
          </form>
          <div className="divider">
            <span>OR</span>
          </div>
          <button onClick={handleGoogleLogin} className="google-btn">
            <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {isLogin ? 'Log in with Google' : 'Sign up with Google'}
          </button>
          <p className="toggle-text">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span onClick={toggleMode} className="toggle-link">
              {isLogin ? 'Sign In' : 'Login'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;