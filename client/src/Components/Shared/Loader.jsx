import React from 'react';
import './Loader.css';

/**
 * Loader Component
 * A reusable loading spinner that can be used across all pages
 * 
 * @param {Object} props
 * @param {string} props.size - Size of the loader: 'small', 'medium', 'large' (default: 'medium')
 * @param {string} props.message - Optional loading message to display below the spinner
 */
const Loader = ({ size = 'medium', message = 'Loading...' }) => {
  return (
    <div className={`loader-container loader-${size}`}>
      <div className="spinner"></div>
      {message && <p className="loader-message">{message}</p>}
    </div>
  );
};

export default Loader;
