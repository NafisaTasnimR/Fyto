import React, { useState } from 'react';
import '../LandingPage/LandingPage.css';

export default function Header() {
  // simple profile button (no dropdown)
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <>
      <header className="fixed-header">
        <div className="header-content">
          <div className="logo">
            <img src="/2.png" alt="Fyto logo" className="site-logo" />
            <span>Fyto</span>
          </div>

          <div className="profile-section">
            <button className="profile-button" onClick={() => setShowProfileMenu((s) => !s)}>
              <img src="/user.png" alt="Profile" className="profile-avatar" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
