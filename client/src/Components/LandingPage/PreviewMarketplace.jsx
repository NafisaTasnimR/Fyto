import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoginSignup from '../LoginSignup/LoginSignup';
import Loader from '../Shared/Loader';
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

      <header className="fixed-header">
        <div className="header-content">
          <div className="logo" onClick={() => navigate('/')}>
            <img src="/2.png" alt="Fyto logo" className="site-logo" />
            <span>Fyto</span>
          </div>

          <nav className="center-nav-landing">
            <button
              className="nav-link-landing"
              onClick={() => navigate('/preview-social')}
            >
              Social
            </button>
            <button
              className="nav-link-landing active"
              onClick={() => navigate('/preview-marketplace')}
            >
              Marketplace
            </button>
            <button 
               className="nav-link-landing"
              onClick={() => navigate('/preview-plant-info')}
              >
              Plant Info
            </button>
            
          </nav>

          <nav className="nav-buttons">
            <button className="nav-btn1" onClick={() => { setModalMode('login'); setShowModal(true); }}>Login</button>
            <button className="nav-btn1 signup-btn1" onClick={() => { setModalMode('signup'); setShowModal(true); }}>Sign In</button>
          </nav>
        </div>
      </header>

      <div className="preview-marketplace-container">
      <div className="preview-marketplace-header">
        <h2>Plant Marketplace</h2>
        <p>Discover plants, seeds, pots, and more from our community</p>
      </div>

      {loading ? (
        <Loader size="large" message="Loading marketplace items..." />
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