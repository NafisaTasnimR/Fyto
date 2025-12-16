import React, { useState } from 'react';
import LoginSignup from '../LoginSignup/LoginSignup';
import './LandingPage.css';

export default function LandingPage() {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('login');

  const openModal = (mode) => {
    setModalMode(mode);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="landing-container">
      {/* FIXED HEADER */}
      <header className="fixed-header">
        <div className="header-content">
          <div className="logo">Fyto</div>
          <nav className="nav-buttons">
            <button className="nav-btn" onClick={() => openModal('login')}>Login</button>
            <button className="nav-btn signup-btn" onClick={() => openModal('signup')}>Signup</button>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      {/* TOP HERO - new banner above main hero (large centered header with search + CTAs) */}
      <section className="top-hero">
        <div className="top-hero-content">
          <div className="top-hero-visuals scroller">
            <div className="scroller-track">
              <div className="polaroid p1">
                <img src="/c2.png" alt="plant" />
              </div>
              <div className="polaroid p2">
                <img src="/p2.jpg" alt="plant" />
              </div>
              <div className="polaroid p3">
                <img src="/p1.jpg" alt="plant" />
              </div>
              <div className="polaroid p4">
                <img src="/p3.jpg" alt="plant" />
              </div>
              <div className="polaroid p5 portrait">
                <img src="/AfricanViolet.png" alt="plant" />
              </div>
              <div className="polaroid p6 portrait">
                <img src="/c2.png" alt="plant" />
              </div>

              {/* duplicate for seamless scroll */}
              <div className="polaroid p1">
                <img src="/p2.jpg" alt="plant" />
              </div>
              <div className="polaroid p2">
                <img src="/p1.jpg" alt="plant" />
              </div>
              <div className="polaroid p3">
                <img src="/c2.png" alt="plant" />
              </div>
              <div className="polaroid p4">
                <img src="/p3.jpg" alt="plant" />
              </div>
              <div className="polaroid p5 portrait">
                <img src="/AfricanViolet.png" alt="plant" />
              </div>
              <div className="polaroid p6 portrait">
                <img src="/p1.jpg" alt="plant" />
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

      {/* FEATURES / HOW IT WORKS HERO (new) */}
      <section className="features-hero">
        <div className="features-inner">
          <h2>Explore Fyto</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌿</div>
              <h3>Profile & Garden Showcase</h3>
              <p>Show your gardening journey, badges, activity.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Community Feed & Posts</h3>
              <p>Share stories, ask questions, learn from others.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🛒</div>
              <h3>Marketplace</h3>
              <p>Donate • Exchange • Sell plants, seeds, pots.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📔</div>
              <h3>Digital Plant Journal</h3>
              <p>Track watering, growth, and plant health.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🏅</div>
              <h3>Challenges & Badges</h3>
              <p>Join fun gardening missions and earn badges.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Plant Care </h3>
              <p>Search thousands of plants with sunlight, water, and care info.</p>
            </div>
          </div>
        </div>
      </section>
      
      

      {/* SECONDARY SECTION */}
      <section className="secondary-hero">
        <div className="secondary-image" style={{
          backgroundImage: 'url(/bg4.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}></div>
        <div className="secondary-content">
          <h2>Join Our Growing Community</h2>
          <p>Connect with plant enthusiasts, share your green journey, and discover new species.</p>
          <button className="secondary-btn">Get Started</button>
        </div>
      </section>


      {/* LOGIN/SIGNUP MODAL */}
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
