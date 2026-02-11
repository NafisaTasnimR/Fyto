import React, { useState, useEffect, useRef } from 'react';
import LoginSignup from '../LoginSignup/LoginSignup';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('login');

  const openModal = (mode) => {
    setModalMode(mode);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return Boolean(localStorage.getItem('fytoAuth'));
    } catch (err) {
      return false;
    }
  });

  useEffect(() => {
    const onAuthChange = () => {
      try {
        setIsAuthenticated(Boolean(localStorage.getItem('fytoAuth')));
      } catch (err) {
        setIsAuthenticated(false);
      }
    };

    window.addEventListener('fytoAuthChange', onAuthChange);
    window.addEventListener('storage', onAuthChange);
    return () => {
      window.removeEventListener('fytoAuthChange', onAuthChange);
      window.removeEventListener('storage', onAuthChange);
    };
  }, []);

  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);
  useEffect(() => {
    const onDocClick = (e) => {
      if (!showProfileMenu) return;
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [showProfileMenu]);

  

  return (
    <div className="landing-container">
      
      <header className="fixed-header">
        <div className="header-content">
          <div className="logo">
            <img src="/2.png" alt="Fyto logo" className="site-logo" />
            <span>Fyto</span>
          </div>
          
          {!isAuthenticated && (
            <nav className="center-nav-landing">
              <button 
                className="nav-link-landing"
                onClick={() => navigate('/preview-social')}
              >
                Social
              </button>
              <button 
                className="nav-link-landing"
                onClick={() => navigate('/preview-marketplace')}
              >
                Marketplace
              </button>
              <button 
                className="nav-link-landing"
              >
                Plant Info
              </button>
            </nav>
          )}
          
          {isAuthenticated ? (
            <div className="profile-section" ref={profileRef}>
              <button className="profile-button" onClick={() => setShowProfileMenu((s) => !s)}>
                <div className="profile-avatar">U</div>
                <span className="profile-name">You</span>
              </button>
              {showProfileMenu && (
                <div className="profile-menu">
                  <a href="/profile" className="profile-menu-item">Profile</a>
                  <button
                    className="profile-menu-item"
                    onClick={() => {
                      try {
                        localStorage.removeItem('fytoAuth');
                        window.dispatchEvent(new Event('fytoAuthChange'));
                        setIsAuthenticated(false);
                        setShowProfileMenu(false);
                      } catch (err) {
                        console.warn('Logout failed', err);
                      }
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <nav className="nav-buttons">
              <button className="nav-btn1" onClick={() => { setModalMode('login'); setShowModal(true); }}>Login</button>
              <button className="nav-btn1 signup-btn1" onClick={() => { setModalMode('signup'); setShowModal(true); }}>Sign In</button>
            </nav>
          )}
        </div>
      </header>

      
      <section className="top-hero">
        <div className="top-hero-content">
          <div className="top-hero-visuals scroller">
            <div className="scroller-track">
              <div className="polaroid p1">
                <img src="/q1.png" alt="plant" />
              </div>
              <div className="polaroid p2">
                <img src="/q2.png" alt="plant" />
              </div>
              <div className="polaroid p3">
                <img src="/q3.png" alt="plant" />
              </div>
              <div className="polaroid p4">
                <img src="/q4.png" alt="plant" />
              </div>
              <div className="polaroid p5 portrait">
                <img src="/q5.png" alt="plant" />
              </div>
              <div className="polaroid p6 portrait">
                <img src="/q6.png" alt="plant" />
              </div>

              
              <div className="polaroid p1">
                <img src="/q1.png" alt="plant" />
              </div>
              <div className="polaroid p2">
                <img src="/q7.png" alt="plant" />
              </div>
              <div className="polaroid p3">
                <img src="/q2.png" alt="plant" />
              </div>
              <div className="polaroid p4">
                <img src="/q3.png" alt="plant" />
              </div>
              <div className="polaroid p5 portrait">
                <img src="/q4.png" alt="plant" />
              </div>
              <div className="polaroid p6 portrait">
                <img src="/q6.png" alt="plant" />
              </div>
            </div>
          </div>

          <div className="top-hero-inner">
            <h1>Grow. Share. Connect.</h1>
            <p className="top-sub">A community-driven platform for plant lovers.</p>
            <div className="top-ctas">
              <button className="cta primary" onClick={() => openModal('signup')}>Join Community</button>
              <button className="cta secondary" onClick={() => { window.scrollTo({ top: document.body.scrollHeight/4, behavior: 'smooth' }); }}>Explore Plants</button>
            </div>
          </div>

        </div>
      </section>

      
      <section className="features-hero">
        <div className="features-inner">
          <h2>Explore Fyto</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><img src="/tea.png" alt="profile" /></div>
              <h3>Profile & Garden Showcase</h3>
              <p>Show your gardening journey, badges, activity.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon"><img src="/community.png" alt="community" /></div>
              <h3>Community Feed & Posts</h3>
              <p>Share stories, ask questions, learn from others.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon"><img src="/shopping.png" alt="marketplace" /></div>
              <h3>Marketplace</h3>
              <p>Donate • Exchange • Sell plants, seeds, pots.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon"><img src="/writting.png" alt="journal" /></div>
              <h3>Digital Plant Journal</h3>
              <p>Track watering, growth, and plant health.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon"><img src="/challenge.png" alt="challenges" /></div>
              <h3>Challenges & Badges</h3>
              <p>Join fun gardening missions and earn badges.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon"><img src="/find.png" alt="plant care" /></div>
              <h3>Plant Information </h3>
              <p>Search thousands of plants information.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="secondary-hero">
        <div className="secondary-image" style={{
          backgroundColor: '#f0f7ef'
        }}>
          <img src="/cat.png" alt="cat" className="secondary-image-item cat-img" />
          <img src="/champion.png" alt="champion" className="secondary-image-item champion-img" />
          
          <img src="/help.png" alt="help" className="secondary-image-item help-img" />
        </div>
        <div className="secondary-content">
          <h2>From Seed to Story — Grow Together on Fyto</h2>
          <p>Track your plants, share milestones, ask for help, and celebrate growth — all in one place.</p>
          <button className="secondary-btn">Get Started</button>
        </div>
      </section>


      
      {showModal && (
        <LoginSignup 
          mode={modalMode} 
          onClose={closeModal}
          onModeChange={setModalMode}
        />
      )}
    </div>
  );
}
