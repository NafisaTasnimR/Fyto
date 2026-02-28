import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoginSignup from '../LoginSignup/LoginSignup';
import './PreviewMarketplace.css';

const PreviewMarketplace = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('signup');

  useEffect(() => {
    fetchMarketplaceItems();
  }, []);

  const fetchMarketplaceItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/marketplace`,
        token ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        } : {}
      );

      if (response.data.success && response.data.posts) {
        const limitedItems = response.data.posts.slice(0, 5);
        setItems(limitedItems);
        setError(null);
      } else {
        setError('No marketplace items available');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching preview marketplace:', err);
      setError('Failed to load marketplace items. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <div className="preview-marketplace-page">
      {showModal && <LoginSignup mode={modalMode} onClose={() => setShowModal(false)} />}

      <header className="fixed-header preview-header">
        <div className="header-content">
          <div className="logo">
            <img src="/2.png" alt="Fyto logo" className="site-logo" />
            <span>Fyto</span>
          </div>
          
          <div className="preview-page-title-container">
            <h1>Marketplace</h1>
          </div>
          
          <div className="preview-header-right">
            <button className="preview-login-btn" onClick={() => { setModalMode('login'); setShowModal(true); }}>
              Login
            </button>
            <button className="preview-signup-btn" onClick={() => { setModalMode('signup'); setShowModal(true); }}>
              Sign In
            </button>
          </div>
        </div>
      </header>

      <button className="back-button-preview" onClick={() => navigate('/')} title="Back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
      </button>

      <div className="preview-marketplace-container">
      <div className="preview-marketplace-header">
        <h2>Plant Marketplace</h2>
        <p>Discover plants, seeds, pots, and more from our community</p>
      </div>

      {loading ? (
        <div className="preview-marketplace-loading">
          <p>Loading marketplace items...</p>
        </div>
      ) : error ? (
        <div className="preview-marketplace-error">
          <p>{error}</p>
        </div>
      ) : items.length > 0 ? (
        <>
          <div className="preview-marketplace-grid">
            {items.map((item) => (
              <div key={item._id} className="preview-marketplace-card">
                <div className="preview-item-image-wrapper">
                  <img
                    src={item.photos && item.photos.length > 0 ? item.photos[0] : '/tree-placeholder.png'}
                    alt={item.treeName}
                    className="preview-item-image"
                  />
                  <span className="preview-item-badge">
                    {item.postType === 'sell'
                      ? 'Buy'
                      : item.postType === 'exchange'
                      ? 'Exchange'
                      : item.postType === 'donate'
                      ? 'Donate'
                      : 'Buy'}
                  </span>
                </div>

                <div className="preview-item-info">
                  <h4>{item.treeName}</h4>
                  <p className="preview-item-type">{item.treeType}</p>
                  <p className="preview-item-seller">{item.userId?.username || 'Seller'}</p>

                  {item.postType === 'sell' && item.price > 0 && (
                    <p className="preview-item-price">৳{item.price.toLocaleString()}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="preview-marketplace-cta">
            <h3>Ready to buy or sell plants?</h3>
            <p>Join our marketplace to find exclusive plants, tools, and connect with fellow plant enthusiasts!</p>
            <button className="preview-marketplace-btn-cta" onClick={() => { setModalMode('signup'); setShowModal(true); }}>
              Sign In Now
            </button>
          </div>
        </>
      ) : (
        <div className="preview-marketplace-empty">
          <p>No marketplace items yet. Check back soon!</p>
        </div>
      )}
    </div>
    </div>
  );
};

export default PreviewMarketplace;
