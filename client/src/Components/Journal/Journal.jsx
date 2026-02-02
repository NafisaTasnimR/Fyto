import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Journal.css';
import Header from '../Shared/Header';
import Sidebar from './Sidebar';
import JournalPage from './JournalPage';
import CoverSelection from './CoverSelection';
import * as journalService from '../../services/journalService';

const defaultPreferences = {
  pageColor: '#ffffff',
  textColor: '#000000',
  fontSize: 16,
  fontFamily: 'Arial, sans-serif',
  lineHeight: 1.6,
  textAlign: 'left',
  pageWidth: 800,
  pageHeight: 1000,
  padding: 40
};

// Warning Modal Component
const UnsavedWarningModal = ({ onCancel, onLeave }) => {
  return (
    <div className="journal-unsaved-warning-modal-overlay-m">
      <div className="journal-unsaved-warning-modal-m">
        <div className="journal-unsaved-warning-icon-container-m">
          <img 
            src="/journal-leave-warning.png" 
            alt="Warning" 
            className="journal-unsaved-warning-icon-m"
          />
        </div>
        <h2 className="journal-unsaved-warning-title-m">Unsaved Changes</h2>
        <p className="journal-unsaved-warning-message-m">
          You have unsaved changes on this page. Are you sure you want to leave? All your changes will be lost.
        </p>
        <div className="journal-unsaved-warning-actions-m">
          <button 
            onClick={onCancel} 
            className="journal-unsaved-warning-btn-m journal-unsaved-warning-btn-cancel-m"
          >
            Stay
          </button>
          <button 
            onClick={onLeave} 
            className="journal-unsaved-warning-btn-m journal-unsaved-warning-btn-leave-m"
          >
            Leave Anyway
          </button>
        </div>
      </div>
    </div>
  );
};

function Journal() {
  const location = useLocation();
  const navigate = useNavigate();
  const isNewJournal = location.pathname === '/journal/new';
  const isContinue = location.pathname === '/journal/continue';

  const [showCoverSelection, setShowCoverSelection] = useState(isNewJournal);
  const [selectedCover, setSelectedCover] = useState(null);
  const [currentJournal, setCurrentJournal] = useState(null);
  const [pages, setPages] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [draggedElement, setDraggedElement] = useState(null);
  const [resizingElement, setResizingElement] = useState(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loadingJournals, setLoadingJournals] = useState(isContinue);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedState, setLastSavedState] = useState(null);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [journalTitle, setJournalTitle] = useState('My Fyto Journal');

  const currentPage = pages[currentPageIndex];

  // Load existing journals for "Continue" mode
  useEffect(() => {
    if (isContinue && !currentJournal) {
      loadExistingJournals();
    }
  }, [isContinue]);

  const loadExistingJournals = async () => {
    try {
      setLoadingJournals(true);
      const token = localStorage.getItem('token');

      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await journalService.getJournals();
      const journals = response.data.journals || [];

      if (journals.length > 0) {
        setCurrentJournal(journals[0]);
      } else {
        alert('No journals found. Please create a new journal first.');
        navigate('/journal');
      }
      setLoadingJournals(false);
    } catch (error) {
      console.error('Error loading journals:', error);
      setLoadingJournals(false);
    }
  };

  const loadJournalPages = useCallback(async () => {
    if (!currentJournal) return;

    try {
      const response = await journalService.getJournalPages(currentJournal._id);
      const pagesData = response.data || [];

      const transformedPages = await Promise.all(
        pagesData.map(async (page, index) => {
          const blocksResponse = await journalService.getPageBlocks(page._id);
          const blocks = blocksResponse.data || [];

          const textBlocks = blocks.filter(b => b.type === 'text');
          const imageBlocks = blocks.filter(b => b.type === 'image');

          const content = textBlocks.map(b => b.text).join('<br>');
          const wordCount = textBlocks.reduce((count, block) => {
            const words = (block.text || '').trim().split(/\s+/).filter(w => w.length > 0);
            return count + words.length;
          }, 0);

          return {
            id: page._id,
            backendId: page._id,
            elements: imageBlocks.map(b => ({
              id: b._id,
              type: 'image',
              x: b.position.x,
              y: b.position.y,
              width: b.image?.width || 200,
              height: b.image?.height || 200,
              imageUrl: b.image?.url
            })),
            content: content,
            pageNumber: index + 1,
            date: new Date(page.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            }),
            preferences: {
              ...defaultPreferences,
              pageColor: page.backgroundColor || selectedCover?.bgColor || '#ffffff',
              pageWidth: page.pageSize?.width || 800,
              pageHeight: page.pageSize?.height || 1000
            },
            wordCount: wordCount,
            lastSaved: new Date(page.updatedAt),
            textBlocks: textBlocks
          };
        })
      );

      if (transformedPages.length > 0 && transformedPages[0]) {
        setJournalTitle(currentJournal.title);
      }

      setPages(transformedPages.length > 0 ? transformedPages : []);
      setCurrentPageIndex(0);
      setLastSavedState(JSON.stringify(transformedPages));
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error loading journal pages:', error);
    }
  }, [currentJournal, selectedCover]);

  useEffect(() => {
    if (currentJournal) {
      loadJournalPages();
    }
  }, [currentJournal, loadJournalPages]);

  // Track unsaved changes
  useEffect(() => {
    if (pages.length > 0 && lastSavedState) {
      const currentState = JSON.stringify(pages);
      setHasUnsavedChanges(currentState !== lastSavedState);
    }
  }, [pages, lastSavedState]);

  // Browser back/refresh warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleCoverSelect = (cover) => {
    setSelectedCover(cover);

    const initialPage = {
      id: Date.now(),
      backendId: null,
      elements: [],
      content: '',
      pageNumber: 1,
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      preferences: {
        ...defaultPreferences,
        pageColor: cover.bgColor || '#FFFFFF'
      },
      wordCount: 0,
      lastSaved: null,
      textBlocks: []
    };

    setPages([initialPage]);
    setCurrentPageIndex(0);
    setShowCoverSelection(false);
    setLastSavedState(JSON.stringify([initialPage]));
    setHasUnsavedChanges(false);
  };

  const handleBackButton = () => {
    if (hasUnsavedChanges) {
      setPendingNavigation(() => () => {
        if (showCoverSelection) {
          navigate('/journal');
        } else if (isNewJournal) {
          setShowCoverSelection(true);
        } else {
          navigate('/journal');
        }
      });
      setShowWarningModal(true);
    } else {
      if (showCoverSelection) {
        navigate('/journal');
      } else if (isNewJournal) {
        setShowCoverSelection(true);
      } else {
        navigate('/journal');
      }
    }
  };

  const handlePageChange = (newIndex) => {
    setCurrentPageIndex(newIndex);
  };

  const confirmLeave = () => {
    setShowWarningModal(false);
    setHasUnsavedChanges(false);
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
  };

  const cancelLeave = () => {
    setShowWarningModal(false);
    setPendingNavigation(null);
  };

  const saveJournal = async () => {
    if (!selectedCover || pages.length === 0) {
      alert('Please create some content before saving.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You need to be logged in to save a journal. Redirecting to login page...');
      window.location.href = '/login';
      return;
    }

    try {
      setSaving(true);

      const firstPage = pages[0];

      const journalData = {
        title: journalTitle || 'My Fyto Journal',
        coverImage: {
          url: selectedCover.imageUrl || 'https://via.placeholder.com/800x600',
          width: 800,
          height: 600
        },
        firstPage: {
          backgroundColor: firstPage.preferences.pageColor,
          pageSize: {
            width: firstPage.preferences.pageWidth,
            height: firstPage.preferences.pageHeight
          },
          blocks: []
        }
      };

      if (firstPage.content) {
        journalData.firstPage.blocks.push({
          type: 'text',
          text: firstPage.content,
          position: { x: 0, y: 0 },
          styles: {
            fontFamily: firstPage.preferences.fontFamily,
            fontSize: firstPage.preferences.fontSize,
            color: firstPage.preferences.textColor,
            alignment: firstPage.preferences.textAlign,
            lineHeight: firstPage.preferences.lineHeight
          }
        });
      }

      for (const element of firstPage.elements) {
        if (element.imageUrl) {
          journalData.firstPage.blocks.push({
            type: 'image',
            position: { x: element.x, y: element.y },
            image: {
              url: element.imageUrl,
              width: element.width,
              height: element.height
            }
          });
        }
      }

      const journalResponse = await journalService.createJournal(journalData);
      const newJournal = journalResponse.data;

      console.log('Journal created:', newJournal);

      // Defensive check for journal
      if (!newJournal || !newJournal._id) {
        throw new Error('Invalid journal response from server');
      }

      const updatedPages = [...pages];
      
      // The backend doesn't return pages array on creation, so we'll set it after fetching
      // For now, just mark first page as having a journal
      updatedPages[0] = {
        ...updatedPages[0],
        lastSaved: new Date()
      };

      for (let i = 1; i < pages.length; i++) {
        const page = pages[i];
        try {
          const pageData = {
            backgroundColor: page.preferences.pageColor,
            pageSize: {
              width: page.preferences.pageWidth,
              height: page.preferences.pageHeight
            }
          };

          const pageResponse = await journalService.createPage(newJournal._id, pageData);
          const savedPage = pageResponse.data;

          updatedPages[i] = {
            ...page,
            backendId: savedPage._id,
            lastSaved: new Date()
          };

          if (page.content) {
            await journalService.createBlock(savedPage._id, {
              type: 'text',
              text: page.content,
              position: { x: 0, y: 0 },
              styles: {
                fontFamily: page.preferences.fontFamily,
                fontSize: page.preferences.fontSize,
                color: page.preferences.textColor,
                alignment: page.preferences.textAlign,
                lineHeight: page.preferences.lineHeight
              }
            });
          }

          for (const element of page.elements) {
            if (element.imageUrl) {
              await journalService.createBlock(savedPage._id, {
                type: 'image',
                position: { x: element.x, y: element.y },
                image: {
                  url: element.imageUrl,
                  width: element.width,
                  height: element.height
                }
              });
            }
          }
        } catch (pageError) {
          console.error(`Error saving page ${i + 1}:`, pageError);
          throw new Error(`Failed to save page ${i + 1}: ${pageError.message}`);
        }
      }

      // Update word count (non-critical operation)
      try {
        await journalService.updateWordCount(newJournal._id);
      } catch (wcError) {
        console.warn('Word count update failed, but journal was saved:', wcError);
      }

      // Fetch the journal pages to get backend IDs
      try {
        const pagesResponse = await journalService.getJournalPages(newJournal._id);
        const fetchedPages = pagesResponse.data || [];
        
        // Update pages with backend IDs
        fetchedPages.forEach((fetchedPage, index) => {
          if (updatedPages[index]) {
            updatedPages[index] = {
              ...updatedPages[index],
              backendId: fetchedPage._id
            };
          }
        });
      } catch (fetchError) {
        console.warn('Could not fetch page IDs, but journal was saved:', fetchError);
      }

      setPages(updatedPages);
      setLastSavedState(JSON.stringify(updatedPages));
      setHasUnsavedChanges(false);
      setCurrentJournal(newJournal);

      alert('Journal saved successfully!');
    } catch (error) {
      console.error('Error saving journal:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      if (error.response?.status === 401 || error.response?.data?.message?.includes('token')) {
        alert('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        alert(`Failed to save journal. Error: ${error.message || 'Unknown error'}. Check console for details.`);
      }
    } finally {
      setSaving(false);
    }
  };

  const updatePage = (updates) => {
    const updatedPages = pages.map((page, idx) =>
      idx === currentPageIndex ? { ...page, ...updates } : page
    );
    setPages(updatedPages);
  };

  // Each page has independent preferences
  const updatePreferences = (newPrefs) => {
    updatePage({
      preferences: { ...currentPage.preferences, ...newPrefs }
    });
  };

  const addNewPage = () => {
    const pageNumber = pages.length + 1;
    
    const newPage = {
      id: Date.now(),
      backendId: null,
      elements: [],
      content: '',
      pageNumber: pageNumber,
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      // Each page gets its own independent preferences
      preferences: { 
        ...defaultPreferences,
        pageColor: '#ffffff'
      },
      wordCount: 0,
      lastSaved: null,
      textBlocks: []
    };

    setPages([...pages, newPage]);
    setCurrentPageIndex(pages.length);
  };

  const deletePage = () => {
    if (pages.length > 1) {
      const confirmDelete = window.confirm('Are you sure you want to delete this page?');
      if (!confirmDelete) return;

      const newPages = pages.filter((_, idx) => idx !== currentPageIndex);
      setPages(newPages);
      setCurrentPageIndex(Math.min(currentPageIndex, newPages.length - 1));
    }
  };

  const addElement = () => {
    const newElement = {
      id: Date.now(),
      type: 'image',
      x: 100,
      y: 200,
      width: 200,
      height: 200,
      imageUrl: null
    };

    const updatedElements = [...currentPage.elements, newElement];
    setPages(pages.map((page, idx) =>
      idx === currentPageIndex ? { ...page, elements: updatedElements } : page
    ));

    setActiveDropdown(null);
  };

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  // Render warning modal
  if (showWarningModal) {
    return (
      <UnsavedWarningModal 
        onCancel={cancelLeave}
        onLeave={confirmLeave}
      />
    );
  }

  // Render cover selection
  if (showCoverSelection) {
    return (
      <>
        <button onClick={handleBackButton} className="back-button-cover">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <CoverSelection onCoverSelect={handleCoverSelect} saving={saving} />
      </>
    );
  }

  // Loading state
  if (loadingJournals) {
    return (
      <div className="journal-app-container">
        <Header />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 60px)',
          fontSize: '18px',
          color: '#2f6b48',
          fontFamily: 'Poppins, sans-serif'
        }}>
          Loading your journals...
        </div>
      </div>
    );
  }

  // No pages state
  if (!currentPage) {
    return (
      <div className="journal-app-container">
        <Header />
        <button onClick={handleBackButton} className="back-button-cover">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'calc(100vh - 60px)',
          fontSize: '18px',
          color: '#2f6b48',
          fontFamily: 'Poppins, sans-serif'
        }}>
          No pages found. Please create a new journal.
        </div>
      </div>
    );
  }

  return (
    <div className="journal-app-container">
      <Header />

      <button 
        onClick={handleBackButton} 
        className="back-button-journal"
        style={{ left: sidebarOpen ? '300px' : '80px' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {!currentJournal && selectedCover && pages.length > 0 && (
        <button
          onClick={saveJournal}
          disabled={saving}
          title={saving ? 'Saving...' : 'Save Journal'}
          className="journal-save-button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
        </button>
      )}

      <div className="journal-main-layout">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          pages={pages}
          currentPageIndex={currentPageIndex}
          setCurrentPageIndex={handlePageChange}
          addNewPage={addNewPage}
        />

        <main className="journal-content-area">
          <JournalPage
            currentPage={currentPage}
            currentPageIndex={currentPageIndex}
            pagesLength={pages.length}
            updatePage={updatePage}
            editingTitle={editingTitle}
            setEditingTitle={setEditingTitle}
            draggedElement={draggedElement}
            setDraggedElement={setDraggedElement}
            resizingElement={resizingElement}
            setResizingElement={setResizingElement}
            setCurrentPageIndex={handlePageChange}
            updatePreferences={updatePreferences}
            addElement={addElement}
            deletePage={deletePage}
            activeDropdown={activeDropdown}
            toggleDropdown={toggleDropdown}
            saving={saving}
            currentJournal={currentJournal}
            hasUnsavedChanges={hasUnsavedChanges}
            journalTitle={journalTitle}
            setJournalTitle={setJournalTitle}
          />
        </main>
      </div>
    </div>
  );
}

export default Journal;