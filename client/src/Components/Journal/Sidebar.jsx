import React from 'react';

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

function Sidebar({ sidebarOpen, setSidebarOpen, pages, currentPageIndex, setCurrentPageIndex, addNewPage }) {
  return (
    <aside className={`left-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <button 
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </button>
        {sidebarOpen && (
          <button onClick={addNewPage} className="new-entry-btn">
            <PlusIcon />
            <span>New Entry</span>
          </button>
        )}
      </div>

      {sidebarOpen && (
        <div className="entries-list">
          <div className="entries-header">All Entries</div>
          {pages.map((page, idx) => (
            <div
              key={page.id}
              onClick={() => setCurrentPageIndex(idx)}
              className={`entry-item ${idx === currentPageIndex ? 'active' : ''}`}
            >
              <div className="entry-title">{page.title}</div>
              <div className="entry-date">{page.date}</div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}

export default Sidebar;