import React, { useRef } from 'react';
import Toolbar from './Toolbar';
import * as journalService from '../../services/journalService';
import { compressImage, validateImageFile } from '../../utils/imageUtils';

const XIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
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

function JournalPage({
  currentPage,
  currentPageIndex,
  pagesLength,
  updatePage,
  editingTitle,
  setEditingTitle,
  draggedElement,
  setDraggedElement,
  resizingElement,
  setResizingElement,
  setCurrentPageIndex,
  updatePreferences,
  addElement,
  deletePage,
  activeDropdown,
  toggleDropdown,
  saving,
  currentJournal,
  hasUnsavedChanges,
  journalTitle,
  setJournalTitle
}) {
  const canvasRef = useRef(null);
  const contentRef = useRef(null);

  const handleContentChange = (e) => {
    const content = e.currentTarget.innerHTML;
    const text = e.currentTarget.innerText || e.currentTarget.textContent || '';
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    updatePage({
      content: content,
      wordCount: text.trim() === '' ? 0 : words
    });
  };

  React.useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== currentPage.content) {
      const selection = window.getSelection();
      const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      const startOffset = range ? range.startOffset : 0;
      const startContainer = range ? range.startContainer : null;

      contentRef.current.innerHTML = currentPage.content || '';

      if (startContainer && contentRef.current.contains(startContainer)) {
        try {
          const newRange = document.createRange();
          newRange.setStart(startContainer, Math.min(startOffset, startContainer.length));
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        } catch (e) {
          // Silently handle cursor restoration errors
        }
      }
    }
  }, [currentPageIndex, currentPage.content]);

  const deleteElement = async (elementId) => {
    updatePage({
      elements: currentPage.elements.filter(el => el.id !== elementId)
    });

    try {
      await journalService.deleteBlock(elementId);
    } catch (error) {
      console.error('Error deleting block:', error);
    }
  };

  const updateElement = async (elementId, updates) => {
    updatePage({
      elements: currentPage.elements.map(el =>
        el.id === elementId ? { ...el, ...updates } : el
      )
    });

    if (updates.x !== undefined || updates.y !== undefined) {
      try {
        await journalService.updateBlockPosition(elementId, {
          x: updates.x,
          y: updates.y
        });
      } catch (error) {
        console.error('Error updating block position:', error);
      }
    }

    if (updates.width !== undefined || updates.height !== undefined) {
      try {
        const element = currentPage.elements.find(el => el.id === elementId);
        if (element && element.type === 'image') {
          await journalService.updateBlock(elementId, {
            image: {
              url: element.imageUrl || updates.imageUrl,
              width: updates.width || element.width,
              height: updates.height || element.height
            }
          });
        }
      } catch (error) {
        console.error('Error updating block dimensions:', error);
      }
    }
  };

  const handleDragStart = (e, element) => {
    if (resizingElement) return;
    const rect = e.target.getBoundingClientRect();
    setDraggedElement({
      ...element,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedElement || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(
      e.clientX - rect.left - draggedElement.offsetX,
      currentPage.preferences.pageWidth - draggedElement.width
    ));
    const y = Math.max(0, Math.min(
      e.clientY - rect.top - draggedElement.offsetY,
      currentPage.preferences.pageHeight - draggedElement.height
    ));

    updateElement(draggedElement.id, { x, y });
    setDraggedElement(null);
  };

  const handleResizeStart = (e, element) => {
    e.stopPropagation();
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = element.width;
    const startHeight = element.height;

    setResizingElement(element);

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      const newWidth = Math.max(50, Math.min(startWidth + deltaX, currentPage.preferences.pageWidth - element.x));
      const newHeight = Math.max(50, Math.min(startHeight + deltaY, currentPage.preferences.pageHeight - element.y));

      updateElement(element.id, { width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setResizingElement(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleImageUpload = async (elementId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    try {
      const compressedImage = await compressImage(file, 800, 800, 0.85);
      updateElement(elementId, { imageUrl: compressedImage });

      if (currentPage?.backendId) {
        const element = currentPage.elements.find(el => el.id === elementId);
        if (element) {
          await journalService.updateBlock(elementId, {
            image: {
              url: compressedImage,
              width: element.width,
              height: element.height
            }
          });
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    }
  };

  const getSaveStatus = () => {
    if (saving) {
      return <span className="save-status">Saving...</span>;
    }
    
    if (hasUnsavedChanges) {
      return <span className="save-status unsaved">Not saved</span>;
    }
    
    if (currentPage.lastSaved) {
      const now = new Date();
      const diff = Math.floor((now - currentPage.lastSaved) / 1000 / 60);
      if (diff < 1) return <span className="save-status saved">Saved just now</span>;
      if (diff < 60) return <span className="save-status saved">Saved {diff} minute{diff > 1 ? 's' : ''} ago</span>;
      const hours = Math.floor(diff / 60);
      return <span className="save-status saved">Saved {hours} hour{hours > 1 ? 's' : ''} ago</span>;
    }
    
    return <span className="save-status unsaved">Not saved</span>;
  };

  return (
    <>
      <div
        className="journal-page"
        style={{
          backgroundColor: currentPage.preferences.pageColor,
          width: currentPage.preferences.pageWidth,
          height: currentPage.preferences.pageHeight,
          color: currentPage.preferences.textColor,
          fontFamily: currentPage.preferences.fontFamily,
          fontSize: currentPage.preferences.fontSize
        }}
      >
        <div className="page-header">
          <div className="page-title-section">
            {editingTitle ? (
              <input
                type="text"
                value={journalTitle}
                onChange={(e) => setJournalTitle(e.target.value)}
                onBlur={() => setEditingTitle(false)}
                onKeyPress={(e) => e.key === 'Enter' && setEditingTitle(false)}
                className="title-input"
                autoFocus
                placeholder="Journal Title"
              />
            ) : (
              <h2 className="page-title" onClick={() => setEditingTitle(true)}>
                {journalTitle}
              </h2>
            )}
            {getSaveStatus()}
          </div>
        </div>

        <Toolbar
          currentPage={currentPage}
          updatePreferences={updatePreferences}
          addElement={addElement}
          deletePage={deletePage}
          pagesLength={pagesLength}
          activeDropdown={activeDropdown}
          toggleDropdown={toggleDropdown}
          contentRef={contentRef}
        />

        <div
          ref={canvasRef}
          className="canvas-area1"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          style={{
            padding: currentPage.preferences.padding
          }}
        >
          <div
            ref={contentRef}
            className="page-content1"
            contentEditable
            suppressContentEditableWarning
            onInput={handleContentChange}
            data-placeholder="Start writing your journal entry..."
            dir="ltr"
            style={{
              color: currentPage.preferences.textColor,
              fontFamily: currentPage.preferences.fontFamily,
              fontSize: `${currentPage.preferences.fontSize}px`,
              lineHeight: currentPage.preferences.lineHeight,
              textAlign: currentPage.preferences.textAlign
            }}
          ></div>

          {currentPage.elements.map((element) => (
            <div
              key={element.id}
              className="canvas-element"
              draggable
              onDragStart={(e) => handleDragStart(e, element)}
              style={{
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height
              }}
            >
              <button onClick={() => deleteElement(element.id)} className="delete-button">
                <XIcon size={14} />
              </button>

              <div className="image-element">
                {element.imageUrl ? (
                  <img src={element.imageUrl} alt="Uploaded" className="uploaded-image" />
                ) : (
                  <label className="image-upload-label">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                      <path d="M3 16l5-5 3 3 5-5 5 5" />
                    </svg>
                    <span className="upload-text">Upload photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(element.id, e)}
                      className="file-input"
                    />
                  </label>
                )}
              </div>

              <div className="resize-handle" onMouseDown={(e) => handleResizeStart(e, element)} />
            </div>
          ))}

          <div className="page-number">
            Page {currentPageIndex + 1} of {pagesLength}
          </div>
        </div>
      </div>

      {pagesLength > 1 && (
        <div className="page-navigation">
          <button
            onClick={() => setCurrentPageIndex(currentPageIndex - 1)}
            disabled={currentPageIndex === 0}
            className="nav-btn"
          >
            <ChevronLeftIcon /> Previous
          </button>
          <button
            onClick={() => setCurrentPageIndex(currentPageIndex + 1)}
            disabled={currentPageIndex === pagesLength - 1}
            className="nav-btn"
          >
            Next <ChevronRightIcon />
          </button>
        </div>
      )}
    </>
  );
}

export default JournalPage;