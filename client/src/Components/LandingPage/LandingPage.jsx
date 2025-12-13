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
              <button className="cta primary">Join Community</button>
              <button className="cta secondary">Explore Plants</button>
            </div>
          </div>
        </div>
      </section>
      <section 
        className="hero"
        style={{
          backgroundImage: 'url(/bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <h1>Grow. Share. Connect.</h1>
        <p>Buy, sell, exchange, or donate plants, seeds & bulbs.</p>
        <button className="hero-btn">Explore Plants</button>
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

      {/* THIRD SECTION - PRODUCT CARDS */}
      <section className="third-hero">
        <div className="product-card">
          <div className="product-image" style={{
            backgroundImage: 'url(/c2.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}></div>
          <div className="product-info">
            <p className="product-label">Big Sale Products</p>
            <h3 className="product-title">Plants<br />For Interior</h3>
          </div>
        </div>

        <div className="product-card">
          <div className="product-image" style={{
            backgroundImage: 'url(/AfricanViolet.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}></div>
          <div className="product-info">
            <p className="product-label">Top Products</p>
            <h3 className="product-title">Plants<br />For Healthy</h3>
          </div>
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
