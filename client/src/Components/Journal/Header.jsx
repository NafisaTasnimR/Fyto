import React from 'react';

const MenuIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

function Header() {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo-container">
          <div className="logo-icon-space"></div>
          <h1 className="app-title">Fyto</h1>
        </div>
      </div>
      <div className="header-right">
        <button className="icon-button">
          <MenuIcon />
        </button>
      </div>
    </header>
  );
}

export default Header;