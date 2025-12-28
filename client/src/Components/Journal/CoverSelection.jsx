import React from 'react';
import './CoverSelection.css';

const MenuIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CoverSelection = ({ onCoverSelect }) => {
  const covers = [
    {
      id: 1,
      name: 'Sage Garden',
      bgColor: '#f5f3f0',
      accentColor: '#6b7c5e',
      primaryColor: '#d4e5d3',
      secondaryColor: '#b8cbb5'
    },
    {
      id: 2,
      name: 'Lavender Meadow',
      bgColor: '#faf8f5',
      accentColor: '#8b7d91',
      primaryColor: '#e8dce8',
      secondaryColor: '#d6c4d6'
    },
    {
      id: 3,
      name: 'Peach Blossom',
      bgColor: '#fff9f5',
      accentColor: '#b88873',
      primaryColor: '#f5e5db',
      secondaryColor: '#e8d1c3'
    }
  ];

  return (
    <div className="cover-selection-wrapper">
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

      <div className="cover-selection-container">
        <div className="welcome-banner">
          <h1 className="welcome-title">Welcome to Fyto Journaling</h1>
          <p className="welcome-subtitle">Begin your plant journey</p>
        </div>

        <p className="cover-instruction">Please select the cover page for your journal</p>

        <div className="covers-grid">
          {covers.map((cover) => (
            <div
              key={cover.id}
              className="cover-card"
              onClick={() => onCoverSelect(cover)}
            >
              <div 
                className="cover-preview" 
                style={{ 
                  background: `linear-gradient(135deg, ${cover.primaryColor} 0%, ${cover.secondaryColor} 100%)`
                }}
              >
                <div className="cover-content">
                  <div className="cover-decorative-circle" style={{ background: cover.accentColor }}></div>
                  <div className="cover-decorative-line" style={{ background: cover.accentColor }}></div>
                  
                  <div className="cover-title-section">
                    <h2 className="cover-journal-title" style={{ color: cover.accentColor }}>
                      Fyto Journal
                    </h2>
                    <div className="cover-divider" style={{ background: cover.accentColor }}></div>
                    <p className="cover-subtitle-text" style={{ color: cover.accentColor }}>
                      My Plant Journey
                    </p>
                  </div>

                  <div className="cover-leaf-decoration">
                    <svg viewBox="0 0 100 100" className="leaf-svg" style={{ fill: cover.accentColor, opacity: 0.15 }}>
                      <path d="M50,10 Q70,30 70,50 Q70,70 50,90 Q30,70 30,50 Q30,30 50,10 Z" />
                      <line x1="50" y1="20" x2="50" y2="80" stroke={cover.accentColor} strokeWidth="1" opacity="0.3"/>
                      <path d="M35,35 Q50,40 65,35" stroke={cover.accentColor} strokeWidth="1" fill="none" opacity="0.3"/>
                      <path d="M35,50 Q50,55 65,50" stroke={cover.accentColor} strokeWidth="1" fill="none" opacity="0.3"/>
                      <path d="M35,65 Q50,70 65,65" stroke={cover.accentColor} strokeWidth="1" fill="none" opacity="0.3"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="cover-name" style={{ color: cover.accentColor }}>{cover.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoverSelection;