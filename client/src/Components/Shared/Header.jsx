import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../LandingPage/LandingPage.css';

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [showPlantDropdown, setShowPlantDropdown] = useState(false);
  const location = useLocation();

  const isPlantActive = location.pathname === '/plant-info' || location.pathname === '/plant-care';

  return (
    <>
      <header className="fixed-header">
        <div className="header-content">
          <div className="logo">
            <img src="/2.png" alt="Fyto logo" className="site-logo" />
            <span>Fyto</span>
          </div>

          <div className="center-nav">
            <NavLink end to="/social" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Social</NavLink>
            <NavLink end to="/store" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Marketplace</NavLink>
            <NavLink end to="/journal" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Journal</NavLink>
            <NavLink end to="/challenges" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Challenges</NavLink>
            
            <div
              className="plant-dropdown-container"
              onMouseEnter={() => setShowPlantDropdown(true)}
              onMouseLeave={() => setShowPlantDropdown(false)}
            >
              <span className={`nav-link ${isPlantActive ? 'active' : ''}`}>
                Plant
                <img src="/down-arrow.png" alt="dropdown" className="dropdown-arrow" />
              </span>
              {showPlantDropdown && (
                <div className="plant-dropdown">
                  <NavLink to="/plant-info" className="plant-option" onClick={() => setShowPlantDropdown(false)}>
                    Plant Info
                  </NavLink>
                  <NavLink to="/plant-care" className="plant-option" onClick={() => setShowPlantDropdown(false)}>
                    Plant Care
                  </NavLink>
                </div>
              )}
            </div>
          </div>

          <div className="menu-section">
            <button
              className="menu-button"
              onClick={() => setShowMenu(!showMenu)}
            >
              <img src="/more.png" alt="Menu" className="menu-icon" />
            </button>

            {showMenu && (
              <div className="menu-dropdown">
                <NavLink to="/profile" className="menu-item" onClick={() => setShowMenu(false)}>
                  <img src="/user.png" alt="Profile" className="menu-item-icon" />
                  <span>Profile</span>
                </NavLink>
                <NavLink to="/" className="menu-item" onClick={() => setShowMenu(false)}>
                  <img src="/exit.png" alt="Logout" className="menu-item-icon" />
                  <span>Logout</span>
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
