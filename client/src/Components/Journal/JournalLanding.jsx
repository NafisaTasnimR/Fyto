import React from 'react';
import { useNavigate } from 'react-router-dom';
import './JournalLanding.css';
import Header from '../Shared/Header';

const JournalLanding = () => {
  const navigate = useNavigate();

  const handleCreateNew = () => {
    navigate('/journal/new');
  };

  const handleViewJournals = () => {
    navigate('/journal/continue');
  };

  return (
    <div className="journal-landing-container">
      <Header />

      <div className="journal-landing-content">
        <div className="journal-landing-header">
          <h1 className="journal-landing-title">Welcome to Your Journal</h1>
          <p className="journal-landing-subtitle">Document your plant journey and memories</p>
        </div>

        <div className="journal-options-container">
          <div className="journal-option-card" onClick={handleCreateNew}>
            <div className="journal-option-icon create-icon">
              {/* Replace with your PNG: <img src="/create-journal.png" alt="Create Journal" /> */}
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="journal-option-title">Create New Journal</h2>
            <p className="journal-option-description">
              Start a fresh journal with beautiful cover designs and capture your plant experiences
            </p>
            <button className="journal-option-button create-button">
              Start Writing
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="journal-option-card" onClick={handleViewJournals}>
            <div className="journal-option-icon view-icon">
              {/* Replace with your PNG: <img src="/view-journal.png" alt="View Journals" /> */}
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
            <h2 className="journal-option-title">Continue Writing</h2>
            <p className="journal-option-description">
              Continue your existing journals and add new entries to your ongoing story
            </p>
            <button className="journal-option-button view-button">
              Open My Journals
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="journal-landing-features">
          <div className="feature-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            <span>Rich Text Editing</span>
          </div>
          <div className="feature-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span>Add Photos</span>
          </div>
          <div className="feature-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            <span>Save Journals</span>
          </div>
          <div className="feature-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            <span>Export & Share</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalLanding;