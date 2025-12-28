import React, { useState } from 'react';
import './Journal.css';
import Header from './Header';
import Toolbar from './Toolbar';
import JournalPage from './JournalPage';
import Sidebar from './SideBar';

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
  const [pages, setPages] = useState([
    {
      id: Date.now(),
      elements: [],
      content: '',
      title: 'My Fyto Journal',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      preferences: { ...defaultPreferences },
      wordCount: 0,
      lastSaved: new Date()
    }
  ]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [draggedElement, setDraggedElement] = useState(null);
  const [resizingElement, setResizingElement] = useState(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const currentPage = pages[currentPageIndex];

  const updatePage = (updates) => {
    setPages(prev => prev.map((page, idx) =>
      idx === currentPageIndex ? { ...page, ...updates, lastSaved: new Date() } : page
    ));
  };

  const updatePreferences = (newPrefs) => {
    updatePage({
      preferences: { ...currentPage.preferences, ...newPrefs }
    });
  };

  const addNewPage = () => {
    const untitledCount = pages.filter(p => p.title === 'My Fyto Journal' || /^My Fyto Journal \d+$/.test(p.title)).length;
    const newTitle = untitledCount > 0 ? `My Fyto Journal ${untitledCount + 1}` : 'My Fyto Journal';
    
    const newPage = {
      id: Date.now(),
      elements: [],
      content: '',
      title: newTitle,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      preferences: { ...defaultPreferences },
      wordCount: 0,
      lastSaved: new Date()
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
    updatePage({
      elements: [...currentPage.elements, newElement]
    });
    setActiveDropdown(null);
  };

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  return (
    <div className="app-container">
      <Header />

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
          />
        </main>
      </div>
    </div>
  );
}

export default Journal;