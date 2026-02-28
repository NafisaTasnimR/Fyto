import React from 'react';
import './CoverSelection.css';
import Header from '../Shared/Header';

const CoverSelection = ({ onCoverSelect, saving }) => {
  const covers = [
    {
      id: 1,
      name: 'Sage Garden',
      bgColor: '#f5f3f0',
      accentColor: '#6b7c5e',
      primaryColor: '#d4e5d3',
      secondaryColor: '#b8cbb5',
      imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800'
    },
    {
      id: 2,
      name: 'Lavender Meadow',
      bgColor: '#faf8f5',
      accentColor: '#8b7d91',
      primaryColor: '#e8dce8',
      secondaryColor: '#d6c4d6',
      imageUrl: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=800'
    },
    {
      id: 3,
      name: 'Peach Blossom',
      bgColor: '#fff9f5',
      accentColor: '#b88873',
      primaryColor: '#f5e5db',
      secondaryColor: '#e8d1c3',
      imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800'
    }
  ];

  return (
    <div className="journal-cover-selection-wrapper-m">
      <Header />

      <div className="journal-cover-selection-container-m">
        <div className="journal-cover-welcome-banner-m">
          <h1 className="journal-cover-welcome-title-m">Welcome to Fyto Journaling</h1>
          <p className="journal-cover-welcome-subtitle-m">Begin your plant journey</p>
        </div>

        <p className="journal-cover-instruction-m">Please select the cover page for your journal</p>

        <div className="journal-covers-grid-m">
          {covers.map((cover) => (
            <div
              key={cover.id}
              className="journal-cover-card-m"
              onClick={() => !saving && onCoverSelect(cover)}
              style={{ cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}
            >
              <div
                className="journal-cover-preview-m"
                style={{
                  background: `linear-gradient(135deg, ${cover.primaryColor} 0%, ${cover.secondaryColor} 100%)`
                }}
              >
                <div className="journal-cover-content-m">
                  <div className="journal-cover-decorative-circle-m" style={{ background: cover.accentColor }}></div>
                  <div className="journal-cover-decorative-line-m" style={{ background: cover.accentColor }}></div>

                  <div className="journal-cover-title-section-m">
                    <h2 className="journal-cover-journal-title-m" style={{ color: cover.accentColor }}>
                      Fyto Journal
                    </h2>
                    <div className="journal-cover-divider-m" style={{ background: cover.accentColor }}></div>
                    <p className="journal-cover-subtitle-text-m" style={{ color: cover.accentColor }}>
                      My Plant Journey
                    </p>
                  </div>

                  <div className="journal-cover-leaf-decoration-m">
                    <svg viewBox="0 0 100 100" className="journal-cover-leaf-svg-m" style={{ fill: cover.accentColor, opacity: 0.15 }}>
                      <path d="M50,10 Q70,30 70,50 Q70,70 50,90 Q30,70 30,50 Q30,30 50,10 Z" />
                      <line x1="50" y1="20" x2="50" y2="80" stroke={cover.accentColor} strokeWidth="1" opacity="0.3" />
                      <path d="M35,35 Q50,40 65,35" stroke={cover.accentColor} strokeWidth="1" fill="none" opacity="0.3" />
                      <path d="M35,50 Q50,55 65,50" stroke={cover.accentColor} strokeWidth="1" fill="none" opacity="0.3" />
                      <path d="M35,65 Q50,70 65,65" stroke={cover.accentColor} strokeWidth="1" fill="none" opacity="0.3" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="journal-cover-name-m" style={{ color: cover.accentColor }}>{cover.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoverSelection;