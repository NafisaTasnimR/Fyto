import React, { useState, useEffect } from 'react';
import * as journalService from '../../services/journalService';
import Header from '../Shared/Header';
import './JournalsList.css';

const JournalsList = ({ onSelectJournal, onBack }) => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJournal, setSelectedJournal] = useState(null);

  useEffect(() => {
    loadJournals();
  }, []);

  const loadJournals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await journalService.getUserJournals();
      const journalsData = response.data || [];
      setJournals(journalsData);

      if (journalsData.length === 0) {
        setError('No journals found. Create a new journal to get started!');
      }
    } catch (err) {
      console.error('Error loading journals:', err);
      setError('Failed to load journals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectJournal = (journal) => {
    setSelectedJournal(journal._id);
    console.log('Selected journal:', journal);
    onSelectJournal(journal);
  };

  const handleDeleteJournal = async (journalId, e) => {
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this journal? This action cannot be undone.')) {
      return;
    }

    try {
      await journalService.deleteJournal(journalId);
      setJournals(journals.filter(j => j._id !== journalId));
      alert('Journal deleted successfully');
    } catch (err) {
      console.error('Error deleting journal:', err);
      alert('Failed to delete journal');
    }
  };

  if (loading) {
    return (
      <div className="journals-list-container">
        <Header />
        <button onClick={onBack} className="journals-list-back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
        <div className="journals-list-loading">
          <p>Loading your journals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="journals-list-container">
      <Header />
      
      <button onClick={onBack} className="journals-list-back-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </button>

      <div className="journals-list-content">
        <div className="journals-list-header">
          <h1 className="journals-list-title">Your Journals</h1>
          <p className="journals-list-subtitle">Select a journal to continue writing or edit your entries</p>
        </div>

        {error && journals.length === 0 ? (
          <div className="journals-list-empty">
            <div className="journals-list-empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <p className="journals-list-empty-text">{error}</p>
          </div>
        ) : (
          <div className="journals-list-grid">
            {journals.map((journal) => (
              <div
                key={journal._id}
                className={`journal-card ${selectedJournal === journal._id ? 'selected' : ''}`}
                onClick={() => handleSelectJournal(journal)}
              >
                <div className="journal-card-image-container">
                  {journal.coverImage?.url ? (
                    <img 
                      src={journal.coverImage.url} 
                      alt={journal.title}
                      className="journal-card-image"
                    />
                  ) : (
                    <div className="journal-card-placeholder">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                      </svg>
                    </div>
                  )}
                </div>

                <div className="journal-card-content">
                  <h3 className="journal-card-title">{journal.title}</h3>
                  
                  <div className="journal-card-meta">
                    <span className="journal-card-date">
                      Created: {new Date(journal.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    {journal.totalWordCount > 0 && (
                      <span className="journal-card-words">
                        {journal.totalWordCount} words
                      </span>
                    )}
                  </div>

                  <div className="journal-card-actions">
                    <button 
                      className="journal-card-open-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectJournal(journal);
                      }}
                    >
                      Open
                    </button>
                    <button 
                      className="journal-card-delete-btn"
                      onClick={(e) => handleDeleteJournal(journal._id, e)}
                      title="Delete journal"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalsList;
