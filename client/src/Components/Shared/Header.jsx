import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
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

          <div className="center-nav">
              <NavLink end to="/social" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Social</NavLink>
              <NavLink end to="/store" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Marketplace</NavLink>
              <NavLink end to="/journal" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Journal</NavLink>
              <NavLink end to="/challenges" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Challenges</NavLink>
          </div>

          <div className="profile-section">
            <NavLink to="/profile" className="profile-button">
              <img src="/user.png" alt="Profile" className="profile-avatar" />
            </NavLink>
          </div>
        </div>
      </header>
    </>
  );
}
