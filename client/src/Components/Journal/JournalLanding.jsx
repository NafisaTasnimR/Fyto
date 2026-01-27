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
              
              <img src="/create-journal.png" alt="Create Journal" />
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
              
              <img src="/view-journal.png" alt="View Journals" />
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
        </div>
      
    </div>
  );
};

export default JournalLanding;