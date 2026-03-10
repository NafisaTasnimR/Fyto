import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../LandingPage/LandingPage.css';

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [showPlantDropdown, setShowPlantDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const location = useLocation();

  const isPlantActive = location.pathname === '/plant-info' || location.pathname === '/plant-care';

  // Handle window resize to toggle mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
      // Close menu when resizing to desktop
      if (window.innerWidth > 900) {
        setShowMenu(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menu when location changes
  useEffect(() => {
    setShowMenu(false);
  }, [location]);

  const handleNavClick = () => {
    setShowMenu(false);
  };

  return (
    <>
      <header className="fixed-header">
        <div className="header-content">
          <div className="logo">
            <img src="/2.png" alt="Fyto logo" className="site-logo" />
            <span>Fyto</span>
          </div>

          {/* Desktop Navigation */}
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

          {/* Menu Button */}
          <div className="menu-section">
            <button
              className="menu-button"
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Toggle menu"
            >
              <img src="/more.png" alt="Menu" className="menu-icon" />
            </button>

            {showMenu && (
              <div className="menu-dropdown">
                {/* Mobile Navigation */}
                {isMobile && (
                  <div className="mobile-nav-group">
                    <NavLink 
                      end 
                      to="/social" 
                      className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'}
                      onClick={handleNavClick}
                    >
                      Social
                    </NavLink>
                    <NavLink 
                      end 
                      to="/store" 
                      className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'}
                      onClick={handleNavClick}
                    >
                      Marketplace
                    </NavLink>
                    <NavLink 
                      end 
                      to="/journal" 
                      className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'}
                      onClick={handleNavClick}
                    >
                      Journal
                    </NavLink>
                    <NavLink 
                      end 
                      to="/challenges" 
                      className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'}
                      onClick={handleNavClick}
                    >
                      Challenges
                    </NavLink>
                    <NavLink 
                      to="/plant-info" 
                      className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'}
                      onClick={handleNavClick}
                    >
                      Plant Info
                    </NavLink>
                    <NavLink 
                      to="/plant-care" 
                      className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'}
                      onClick={handleNavClick}
                    >
                      Plant Care
                    </NavLink>
                    <div style={{ borderBottom: '1px solid #f5f5f5' }}></div>
                  </div>
                )}
                
                {/* Profile/Logout Menu */}
                <NavLink to="/profile" className="menu-item" onClick={handleNavClick}>
                  <img src="/user.png" alt="Profile" className="menu-item-icon" />
                  <span>Profile</span>
                </NavLink>
                <NavLink to="/" className="menu-item" onClick={handleNavClick}>
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
