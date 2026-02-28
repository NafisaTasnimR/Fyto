import React from 'react';
import ColorPicker from './ColorPicker';

function Toolbar({ 
  currentPage, 
  updatePreferences, 
  addElement, 
  deletePage, 
  pagesLength,
  activeDropdown,
  toggleDropdown,
  contentRef
}) {
  const [hasTextSelected, setHasTextSelected] = React.useState(false);

  React.useEffect(() => {
    const checkSelection = () => {
      const selection = window.getSelection();
      const hasSelection = selection && selection.toString().trim().length > 0;
      setHasTextSelected(hasSelection);
    };

    document.addEventListener('selectionchange', checkSelection);
    return () => document.removeEventListener('selectionchange', checkSelection);
  }, []);

  const fontOptions = [
    'Arial, sans-serif',
    'Georgia, serif',
    '"Times New Roman", serif',
    'Verdana, sans-serif',
    '"Courier New", monospace',
    '"Comic Sans MS", cursive',
    'Impact, sans-serif',
    '"Trebuchet MS", sans-serif',
    'Garamond, serif',
    '"Palatino Linotype", serif',
    '"Brush Script MT", cursive',
    'Consolas, monospace'
  ];

  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
  const lineHeights = [1, 1.15, 1.5, 2, 2.5, 3];
  const textAlignOptions = ['left', 'center', 'right', 'justify'];
  const pageSizes = [
    { label: 'Small', width: 400, height: 600 },
    { label: 'Medium', width: 600, height: 800 },
    { label: 'Large', width: 800, height: 1000 },
    { label: 'Extra Large', width: 900, height: 1200 },
    { label: 'Wide', width: 1000, height: 600 },
    { label: 'Letter', width: 816, height: 1056 },
    { label: 'A4', width: 794, height: 1123 }
  ];
  const paddingSizes = [0, 20, 40, 60, 80, 100];

  const applyTextFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    if (contentRef && contentRef.current) {
      contentRef.current.focus();
    }
  };

  const handleTextColorChange = (color) => {
    const selection = window.getSelection();
    const hasSelection = selection && selection.toString().trim().length > 0;
    
    if (hasSelection && contentRef && contentRef.current && contentRef.current.contains(selection.anchorNode)) {
      const range = selection.getRangeAt(0);
      const selectedText = range.extractContents();
      const span = document.createElement('span');
      span.style.color = color;
      span.appendChild(selectedText);
      range.insertNode(span);
      
      if (contentRef.current) {
        const event = new Event('input', { bubbles: true });
        contentRef.current.dispatchEvent(event);
        contentRef.current.focus();
        
        const newRange = document.createRange();
        newRange.setStartAfter(span);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    } else {
      updatePreferences({ textColor: color });
    }
  };

  return (
    <div className="journal-page-toolbar-m">
      <div className="journal-toolbar-left-m">
        <div className="journal-toolbar-item-m">
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Crect x='3' y='4' width='18' height='18' rx='2'/%3E%3Cpath d='M16 2v4M8 2v4M3 10h18'/%3E%3C/svg%3E" alt="Date" className="journal-toolbar-icon-m" />
          <span className="journal-toolbar-date-m">{currentPage.date}</span>
        </div>
        <div className="journal-toolbar-item-m">
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/%3E%3Cpath d='M14 2v6h6M16 13H8M16 17H8M10 9H8'/%3E%3C/svg%3E" alt="Words" className="journal-toolbar-icon-m" />
          <span className="journal-toolbar-word-count-m">{currentPage.wordCount} words</span>
        </div>
      </div>

      <div className="journal-toolbar-right-m">
        {/* Text Formatting Buttons */}
        <button 
          onClick={() => applyTextFormat('bold')}
          className="journal-toolbar-icon-btn-m"
          title="Bold (Ctrl+B)"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
          </svg>
        </button>

        <button 
          onClick={() => applyTextFormat('italic')}
          className="journal-toolbar-icon-btn-m"
          title="Italic (Ctrl+I)"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="4" x2="10" y2="4"></line>
            <line x1="14" y1="20" x2="5" y2="20"></line>
            <line x1="15" y1="4" x2="9" y2="20"></line>
          </svg>
        </button>

        <button 
          onClick={() => applyTextFormat('underline')}
          className="journal-toolbar-icon-btn-m"
          title="Underline (Ctrl+U)"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
            <line x1="4" y1="21" x2="20" y2="21"></line>
          </svg>
        </button>

        <button 
          onClick={() => applyTextFormat('strikeThrough')}
          className="journal-toolbar-icon-btn-m"
          title="Strikethrough"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 4H9a3 3 0 0 0-2.83 4"></path>
            <path d="M14 12a4 4 0 0 1 0 8H6"></path>
            <line x1="4" y1="12" x2="20" y2="12"></line>
          </svg>
        </button>

        <div className="journal-toolbar-divider-m"></div>

        {/* Font Family Dropdown */}
        <div className="journal-toolbar-dropdown-m">
          <button 
            className="journal-toolbar-icon-btn-m"
            onClick={() => toggleDropdown('font')}
            title="Font Family"
          >
            <img src="/font-style.png" alt="Font" className="journal-toolbar-icon-m" />
          </button>
          {activeDropdown === 'font' && (
            <div className="journal-dropdown-panel-m">
              <div className="journal-dropdown-header-with-close-m">
                <span className="journal-dropdown-header-text-m">Font Family</span>
                <button onClick={() => toggleDropdown(null)} className="journal-dropdown-close-btn-m" title="Close">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              {fontOptions.map(font => (
                <button
                  key={font}
                  onClick={() => {
                    updatePreferences({ fontFamily: font });
                    toggleDropdown(null);
                  }}
                  className={`journal-dropdown-option-m ${currentPage.preferences.fontFamily === font ? 'active' : ''}`}
                  style={{ fontFamily: font }}
                >
                  {font.split(',')[0].replace(/"/g, '')}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Font Size Dropdown */}
        <div className="journal-toolbar-dropdown-m">
          <button 
            className="journal-toolbar-icon-btn-m"
            onClick={() => toggleDropdown('size')}
            title="Font Size"
          >
            <img src="/font-size.png" alt="Size" className="journal-toolbar-icon-m" />
          </button>
          {activeDropdown === 'size' && (
            <div className="journal-dropdown-panel-m">
              <div className="journal-dropdown-header-with-close-m">
                <span className="journal-dropdown-header-text-m">Font Size</span>
                <button onClick={() => toggleDropdown(null)} className="journal-dropdown-close-btn-m" title="Close">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div className="journal-size-grid-m">
                {fontSizes.map(size => (
                  <button
                    key={size}
                    onClick={() => {
                      updatePreferences({ fontSize: size });
                      toggleDropdown(null);
                    }}
                    className={`journal-size-option-m ${currentPage.preferences.fontSize === size ? 'active' : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Text Color Picker */}
        <div className="journal-toolbar-dropdown-m">
          <button 
            className="journal-toolbar-icon-btn-m"
            onClick={() => toggleDropdown('textColor')}
            title={hasTextSelected ? "Color selected text" : "Change default text color"}
            style={{ 
              position: 'relative',
              backgroundColor: hasTextSelected ? '#e0f2fe' : '',
              borderColor: hasTextSelected ? '#3498db' : ''
            }}
          >
            <img src="/text-color.png" alt="Text Color" className="journal-toolbar-icon-m" />
            <div style={{
              position: 'absolute',
              bottom: '2px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '16px',
              height: '3px',
              backgroundColor: currentPage.preferences.textColor,
              borderRadius: '1px'
            }}></div>
          </button>
          {activeDropdown === 'textColor' && (
            <div>
              {hasTextSelected && (
                <div className="journal-text-color-indicator-m">
                  Coloring selected text
                </div>
              )}
              <ColorPicker
                color={currentPage.preferences.textColor}
                onChange={handleTextColorChange}
                onClose={() => toggleDropdown(null)}
              />
            </div>
          )}
        </div>

        {/* Page Color Picker */}
        <div className="journal-toolbar-dropdown-m">
          <button 
            className="journal-toolbar-icon-btn-m"
            onClick={() => toggleDropdown('pageColor')}
            title="Page Background Color"
          >
            <img src="/paper.png" alt="Page Color" className="journal-toolbar-icon-m" />
          </button>
          {activeDropdown === 'pageColor' && (
            <ColorPicker
              color={currentPage.preferences.pageColor}
              onChange={(color) => updatePreferences({ pageColor: color })}
              onClose={() => toggleDropdown(null)}
            />
          )}
        </div>

        {/* Formatting Dropdown */}
        <div className="journal-toolbar-dropdown-m">
          <button 
            className="journal-toolbar-icon-btn-m"
            onClick={() => toggleDropdown('formatting')}
            title="Text Formatting"
          >
            <img src="/text-format.png" alt="Format" className="journal-toolbar-icon-m" />
          </button>
          {activeDropdown === 'formatting' && (
            <div className="journal-dropdown-panel-m">
              <div className="journal-dropdown-header-with-close-m">
                <span className="journal-dropdown-header-text-m">Text Formatting</span>
                <button onClick={() => toggleDropdown(null)} className="journal-dropdown-close-btn-m" title="Close">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div className="journal-dropdown-section-m">
                <div className="journal-dropdown-subheader-m">Line Height</div>
                <div className="journal-format-options-m">
                  {lineHeights.map(height => (
                    <button
                      key={height}
                      onClick={() => updatePreferences({ lineHeight: height })}
                      className={`journal-format-option-m ${currentPage.preferences.lineHeight === height ? 'active' : ''}`}
                    >
                      {height}
                    </button>
                  ))}
                </div>
              </div>
              <div className="journal-dropdown-section-m">
                <div className="journal-dropdown-subheader-m">Text Align</div>
                <div className="journal-format-options-m">
                  {textAlignOptions.map(align => (
                    <button
                      key={align}
                      onClick={() => updatePreferences({ textAlign: align })}
                      className={`journal-format-option-m ${currentPage.preferences.textAlign === align ? 'active' : ''}`}
                    >
                      {align.charAt(0).toUpperCase() + align.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Layout Dropdown */}
        <div className="journal-toolbar-dropdown-m">
          <button 
            className="journal-toolbar-icon-btn-m"
            onClick={() => toggleDropdown('layout')}
            title="Page Layout"
          >
            <img src="/paper-size.png" alt="Layout" className="journal-toolbar-icon-m" />
          </button>
          {activeDropdown === 'layout' && (
            <div className="journal-dropdown-panel-m">
              <div className="journal-dropdown-header-with-close-m">
                <span className="journal-dropdown-header-text-m">Page Layout</span>
                <button onClick={() => toggleDropdown(null)} className="journal-dropdown-close-btn-m" title="Close">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div className="journal-dropdown-section-m">
                <div className="journal-dropdown-subheader-m">Page Size</div>
                {pageSizes.map(size => (
                  <button
                    key={size.label}
                    onClick={() => {
                      updatePreferences({ pageWidth: size.width, pageHeight: size.height });
                    }}
                    className={`journal-dropdown-option-m ${
                      currentPage.preferences.pageWidth === size.width && 
                      currentPage.preferences.pageHeight === size.height ? 'active' : ''
                    }`}
                  >
                    {size.label} ({size.width}×{size.height})
                  </button>
                ))}
              </div>
              <div className="journal-dropdown-section-m">
                <div className="journal-dropdown-subheader-m">Padding</div>
                <div className="journal-format-options-m">
                  {paddingSizes.map(padding => (
                    <button
                      key={padding}
                      onClick={() => updatePreferences({ padding })}
                      className={`journal-format-option-m ${currentPage.preferences.padding === padding ? 'active' : ''}`}
                    >
                      {padding}px
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add Photo Button */}
        <button 
          onClick={addElement} 
          className="journal-toolbar-icon-btn-m"
          title="Add Photo"
        >
          <img src="/image.png" alt="Add Photo" className="journal-toolbar-icon-m" />
        </button>

        {/* Delete Page Button */}
        {pagesLength > 1 && (
          <button 
            onClick={deletePage} 
            className="journal-toolbar-icon-btn-m journal-delete-btn-m"
            title="Delete Page"
          >
            <img src="/cancel.png" alt="Delete" className="journal-toolbar-icon-m" />
          </button>
        )}
      </div>
    </div>
  );
}

export default Toolbar;