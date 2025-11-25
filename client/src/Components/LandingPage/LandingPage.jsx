import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const posts = [
    { img: "./plant1.jpg", text: "Beautiful Monstera" },
    { img: "./plant1.jpg", text: "Snake Plant Care Tips" },
    { img: "./plant1.jpg", text: "Free Basil Seeds Giveaway" },
    { img: "./plant1.jpg", text: "Looking for Money Plant Cuttings" },
    { img: "./plant1.jpg", text: "Outdoor Succulent Collection" },
    { img: "./plant1.jpg", text: "How to Save Dying Pothos?" },
  ];

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
      <section className="hero">
        <h1>Grow. Share. Connect.</h1>
        <p>Buy, sell, exchange, or donate plants, seeds & bulbs.</p>
        <button className="hero-btn">Explore Plants</button>
      </section>

      {/* MASONRY GRID */}
      <section className="masonry">
        {posts.map((post, index) => (
          <div className="card" key={index}>
            <img src={post.img} alt={post.text} />
            <p>{post.text}</p>
          </div>
        ))}
      </section>

    </div>
  );
}
