import React from 'react';
import './EmptyState.css';

/**
 * EmptyState Component
 * Displays when there are no posts/items available
 * 
 * @param {Object} props
 * @param {string} props.title - Title for the empty state (default: 'No Posts Available')
 * @param {string} props.message - Description message
 * @param {string} props.iconSrc - Path to the icon image (default: placeholder for cat icon)
 * @param {JSX} props.actionButton - Optional action button to display below message
 */
const EmptyState = ({
  title = 'No Posts Available',
  message = 'Looks like there are no posts here yet. Start by creating one!',
  iconSrc = '/alert.png', // Placeholder - user will update this
  actionButton = null
}) => {
  return (
    <div className="empty-state-container">
      <div className="empty-state-content">
        <img 
          src={iconSrc} 
          alt="Empty state" 
          className="empty-state-icon"
        />
        <h2 className="empty-state-title">{title}</h2>
        <p className="empty-state-message">{message}</p>
        {actionButton && <div className="empty-state-action">{actionButton}</div>}
      </div>
    </div>
  );
};

export default EmptyState;
