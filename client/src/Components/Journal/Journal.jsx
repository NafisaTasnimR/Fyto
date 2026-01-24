import React, { useState, useEffect, useCallback } from 'react';
import './Journal.css';
import Header from './Header';
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
  pageHeight: 600,
  padding: 40
};

function Journal() {
  const [showCoverSelection, setShowCoverSelection] = useState(true);
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

  const currentPage = pages[currentPageIndex];

  const loadJournalPages = useCallback(async () => {
    if (!currentJournal) return;

    try {
      const response = await journalService.getJournalPages(currentJournal._id);
      const pagesData = response.data || [];

      // Transform backend pages to frontend format
      const transformedPages = await Promise.all(
        pagesData.map(async (page) => {
          // Get blocks for this page
          const blocksResponse = await journalService.getPageBlocks(page._id);
          const blocks = blocksResponse.data || [];

          // Separate text and image blocks
          const textBlocks = blocks.filter(b => b.type === 'text');
          const imageBlocks = blocks.filter(b => b.type === 'image');

          // Combine text content
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
            title: currentJournal.title,
            date: new Date(page.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            }),
            preferences: {
              ...defaultPreferences,
              pageColor: page.backgroundColor,
              pageWidth: page.pageSize?.width || 800,
              pageHeight: page.pageSize?.height || 1000
            },
            wordCount: wordCount,
            lastSaved: new Date(page.updatedAt),
            textBlocks: textBlocks // Keep reference to text blocks
          };
        })
      );

      setPages(transformedPages.length > 0 ? transformedPages : []);
      setCurrentPageIndex(0);
    } catch (error) {
      console.error('Error loading journal pages:', error);
    }
  }, [currentJournal]);

  // Load journal data when currentJournal changes
  useEffect(() => {
    if (currentJournal) {
      loadJournalPages();
    }
  }, [currentJournal, loadJournalPages]);

  const handleCoverSelect = (cover) => {
    setSelectedCover(cover);

    // Create initial page in local state (not saved to backend yet)
    const initialPage = {
      id: Date.now(),
      backendId: null,
      elements: [],
      content: '',
      title: 'My Fyto Journal',
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
  };

  const saveJournal = async () => {
    if (!selectedCover || pages.length === 0) {
      alert('Please create some content before saving.');
      return;
    }

    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You need to be logged in to save a journal. Redirecting to login page...');
      window.location.href = '/login';
      return;
    }

    try {
      setSaving(true);

      const firstPage = pages[0];

      // Create the journal and its first page in one go
      const journalData = {
        title: firstPage.title || 'My Fyto Journal',
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
          content: firstPage.content,
          elements: firstPage.elements,
          styles: {
            fontFamily: firstPage.preferences.fontFamily,
            fontSize: firstPage.preferences.fontSize,
            color: firstPage.preferences.textColor,
            alignment: firstPage.preferences.textAlign,
            lineHeight: firstPage.preferences.lineHeight
          }
        }
      };

      const response = await journalService.createJournalWithFirstPage(journalData);
      const { journal: newJournal, page: savedFirstPage } = response.data;

      setCurrentJournal(newJournal);

      // Update the first page in local state with its new backend ID
      const updatedPages = [...pages];
      updatedPages[0].backendId = savedFirstPage._id;

      // If there are more pages, save them now
      if (pages.length > 1) {
        for (let i = 1; i < pages.length; i++) {
          const page = pages[i];

          const pageData = {
            backgroundColor: page.preferences.pageColor,
            pageSize: {
              width: page.preferences.pageWidth,
              height: page.preferences.pageHeight
            }
          };

          const pageResponse = await journalService.createPage(newJournal._id, pageData);
          const savedPage = pageResponse.data;
          updatedPages[i].backendId = savedPage._id;

          // Save blocks for the additional pages
          if (page.content && page.content.trim()) {
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
        }
      }

      // Update word count for the whole journal
      await journalService.updateWordCount(newJournal._id);

      setPages(updatedPages);

      alert('Journal saved successfully!');
    } catch (error) {
      console.error('Error saving journal:', error);

      // Check if it's an authentication error
      if (error.response?.status === 401 || error.response?.data?.message?.includes('token')) {
        alert('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        alert('Failed to save journal. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const updatePage = (updates) => {
    const updatedPages = pages.map((page, idx) =>
      idx === currentPageIndex ? { ...page, ...updates, lastSaved: new Date() } : page
    );
    setPages(updatedPages);
  };

  const updatePreferences = (newPrefs) => {
    updatePage({
      preferences: { ...currentPage.preferences, ...newPrefs }
    });
  };

  const addNewPage = () => {
    const newPage = {
      id: Date.now(),
      backendId: null,
      elements: [],
      content: '',
      title: currentPage?.title || 'My Fyto Journal',
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      preferences: { ...defaultPreferences },
      wordCount: 0,
      lastSaved: null,
      textBlocks: []
    };

    setPages([...pages, newPage]);
    setCurrentPageIndex(pages.length);
  };

  const deletePage = () => {
    if (pages.length > 1) {
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

  if (showCoverSelection) {
    return <CoverSelection onCoverSelect={handleCoverSelect} saving={saving} />;
  }

  if (!currentPage) {
    return (
      <div className="app-container">
        <Header />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '18px',
          color: '#6b7c5e'
        }}>
          No pages found. Please create a new journal.
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header />

      {/* Floating Save Button */}
      {!currentJournal && selectedCover && pages.length > 0 && (
        <button
          onClick={saveJournal}
          disabled={saving}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            padding: '15px 30px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: saving ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            opacity: saving ? 0.7 : 1,
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            if (!saving) {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          {saving ? 'Saving...' : 'Save Journal'}
        </button>
      )}

      <div className="main-layout">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          pages={pages}
          currentPageIndex={currentPageIndex}
          setCurrentPageIndex={setCurrentPageIndex}
          addNewPage={addNewPage}
        />

        <main className="main-content-area">
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
            setCurrentPageIndex={setCurrentPageIndex}
            updatePreferences={updatePreferences}
            addElement={addElement}
            deletePage={deletePage}
            activeDropdown={activeDropdown}
            toggleDropdown={toggleDropdown}
            saving={saving}
            currentJournal={currentJournal}
          />
        </main>
      </div>
    </div>
  );
}

export default Journal;