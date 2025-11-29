import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* FIXED HEADER */}
      <header className="fixed-header">
        <div className="header-content">
          <div className="logo">Fyto</div>
          <nav className="nav-buttons">
            <button className="nav-btn" onClick={() => navigate('/login')}>Login</button>
            <button className="nav-btn signup-btn" onClick={() => navigate('/signup')}>Signup</button>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
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

    </div>
  );
}
