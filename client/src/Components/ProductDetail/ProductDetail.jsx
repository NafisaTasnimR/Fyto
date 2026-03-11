import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useConfirmedPosts } from '../Context/ConfirmedPostsContext';
import './ProductDetail.css';
import Header from '../Shared/Header.jsx';
import Loader from '../Shared/Loader';

const ProductDetail = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [showContactCard, setShowContactCard] = useState(false);
  const [showSaveCard, setShowSaveCard] = useState(false);
  const [savedToFavourites, setSavedToFavourites] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const { isPostConfirmed } = useConfirmedPosts(); // confirmPost removed — no longer needed

  useEffect(() => {
    fetchProductDetail();
    checkIfFavourited();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/marketplace/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) setPost(response.data.post);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching product details:', err);
      setError('Failed to load product details');
      setLoading(false);
    }
  };

  // ── Favourites — backed by /api/marketplace/:postId/save ───────────────
  const checkIfFavourited = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/marketplace/${id}/saved`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) setSavedToFavourites(response.data.isSaved);
    } catch { /* ignore */ }
  };

  const saveToFavourites = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/marketplace/${id}/save`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) setSavedToFavourites(response.data.isSaved);
    } catch (err) {
      console.error('Error saving post:', err);
    }
  };
  // ────────────────────────────────────────────────────────────────────────

  const handleConfirm = async () => {
    if (!selectedOption) { alert('Please select an option'); return; }

    if (selectedOption === 'contact') {
      // Show contact card — post stays available, nothing changes on backend
      setShowContactCard(true);
    } else if (selectedOption === 'save') {
      await saveToFavourites();
      setShowSaveCard(true);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-container">
        <Loader size="medium" message="Loading product details..." />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="product-detail-container">
        <div className="error-message">
          <p>{error || 'Product not found'}</p>
          <button onClick={() => navigate('/store')} className="back-button">Back to Store</button>
        </div>
      </div>
    );
  }

  const isBackendUnavailable = post.status === 'confirmed' || post.status === 'sold' || post.status === 'unavailable';
  const isContextConfirmed = isPostConfirmed(id);
  const isUnavailable = isBackendUnavailable || isContextConfirmed;

  const imageUrl = post.photos && post.photos.length > 0 ? post.photos[0] : '/tree-placeholder.png';

  return (
    <div className="product-detail-container">
      <Header />

      <main className="product-main">
        <button className="back-button" onClick={() => navigate('/store')} title="Back to Store">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Image — slightly smaller, click to fullscreen */}
        <div className="product-image-section" onClick={() => setShowImageViewer(true)} title="Click to view full image">
          <img src={imageUrl} alt={post.treeName} className="product-detail-image" />
        </div>

        {/* Info */}
        <div className="product-info-section">
          <h2 className="product-detail-title">{post.treeName} - {post.treeType}</h2>

          <div className="post-type-badge-container">
            <span className={`post-type-badge ${post.postType}`}>
              {post.postType === 'sell' ? (
                <><span style={{ fontSize: '16px', fontWeight: 700 }}>৳</span>For Sale</>
              ) : post.postType === 'exchange' ? (
                <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 3l4 4-4 4"/><path d="M20 7H4"/><path d="M8 21l-4-4 4-4"/><path d="M4 17h16"/></svg>For Exchange</>
              ) : (
                <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>Free - Donation</>
              )}
            </span>
            {post.postType === 'sell' && post.price > 0 && (
              <span className="price-display">৳{post.price.toLocaleString()}</span>
            )}
          </div>

          <div className="product-meta-info">
            <div className="meta-item">
              <span className="meta-label">Tree Type:</span>
              <span className="meta-value">{post.treeType}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Offering:</span>
              <span className="meta-value">{post.offering}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Owner:</span>
              <span className="meta-value">{post.userId?.username || 'Anonymous'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Status:</span>
              <span className="meta-value">{isUnavailable ? '✗ Not Available' : '✓ Available'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Contact Type:</span>
              <span className="meta-value">{post.contactType === 'phone' ? 'Phone Number' : 'Email Address'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Contact:</span>
              <span className="meta-value contact-link">
                {post.contactType === 'phone'
                  ? <a href={`tel:${post.contactInfo}`}>{post.contactInfo}</a>
                  : <a href={`mailto:${post.contactInfo}`}>{post.contactInfo}</a>}
              </span>
            </div>
          </div>

          <div className="condition-section">
            <h3 className="section-title">Status</h3>
            <div className="condition-badge">{isUnavailable ? 'Not Available' : post.status}</div>
          </div>

          {post.postType === 'exchange' && (
            <div className="exchange-section">
              <h3 className="section-title">Looking for in Exchange</h3>
              <div className="exchange-info">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 3l4 4-4 4"/><path d="M20 7H4"/><path d="M8 21l-4-4 4-4"/><path d="M4 17h16"/>
                </svg>
                <span>Check description for exchange details</span>
              </div>
            </div>
          )}

          <div className="description-section">
            <h3 className="section-title">Description</h3>
            <p className="description-text">{post.description}</p>
          </div>

          <div className="options-section">
            <h3 className="section-title">Select Option</h3>
            {isUnavailable ? (
              <div className="confirmed-message-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div>
                  <p className="confirmed-title">This post has been confirmed</p>
                  <p className="confirmed-subtitle">This item is no longer available</p>
                </div>
              </div>
            ) : (
              <div className="options-list">
                <label className="option-item">
                  <input type="radio" name="product-option" value="contact"
                    checked={selectedOption === 'contact'}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  />
                  <span className="option-label">Contact Seller</span>
                </label>
                <label className="option-item">
                  <input type="radio" name="product-option" value="save"
                    checked={selectedOption === 'save'}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  />
                  <span className="option-label">
                    Save for Later
                    {savedToFavourites && <span className="already-saved"> ★ Already in Favourites</span>}
                  </span>
                </label>
              </div>
            )}
          </div>

          <div className="action-section">
            <button
              className="confirm-btn"
              onClick={handleConfirm}
              disabled={isUnavailable}
              style={{ opacity: isUnavailable ? 0.5 : 1, cursor: isUnavailable ? 'not-allowed' : 'pointer' }}
            >
              {isUnavailable ? 'No Longer Available' : 'Confirm Selection'}
            </button>
          </div>
        </div>
      </main>

      {/* ── Full-screen image viewer ─────────────────────────────────────── */}
      {showImageViewer && (
        <div className="pd-image-viewer-overlay" onClick={() => setShowImageViewer(false)}>
          <button className="pd-image-viewer-close" onClick={() => setShowImageViewer(false)}>✕</button>
          <div className="pd-image-viewer-content" onClick={(e) => e.stopPropagation()}>
            <img src={imageUrl} alt={post.treeName} className="pd-image-viewer-img" />
          </div>
        </div>
      )}

      {/* ── Contact card modal ───────────────────────────────────────────── */}
      {showContactCard && (
        <div className="pd-contact-overlay" onClick={() => setShowContactCard(false)}>
          <div className="pd-contact-card" onClick={(e) => e.stopPropagation()}>
            <button className="pd-contact-close" onClick={() => setShowContactCard(false)}>✕</button>

            {/* ↓ Replace src with actual seller profile pic source when available */}
            <div className="pd-contact-avatar-wrap">
              <img
                src={post.userId?.profilePic || '/dp.png'}
                alt={post.userId?.username || 'Seller'}
                className="pd-contact-avatar"
                onError={(e) => { e.target.src = '/dp.png'; }}
              />
            </div>

            <h3 className="pd-contact-name">{post.userId?.username || 'Anonymous'}</h3>
            <p className="pd-contact-subtitle">Seller of <strong>{post.treeName}</strong></p>

            <div className="pd-contact-info-row">
              {post.contactType === 'phone' ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <a href={`tel:${post.contactInfo}`} className="pd-contact-value">{post.contactInfo}</a>
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <a href={`mailto:${post.contactInfo}`} className="pd-contact-value">{post.contactInfo}</a>
                </>
              )}
            </div>

            <button
              className="pd-contact-ok-btn"
              onClick={() => { setShowContactCard(false); navigate('/store'); }}
            >
              OK
            </button>
          </div>
        </div>
      )}
      {/* ── Save to Favourites card modal ────────────────────────────────── */}
      {showSaveCard && (
        <div className="pd-save-overlay" onClick={() => { setShowSaveCard(false); navigate('/store'); }}>
          <div className="pd-save-card" onClick={(e) => e.stopPropagation()}>
            <button className="pd-contact-close" onClick={() => { setShowSaveCard(false); navigate('/store'); }}>✕</button>

            <div className="pd-save-img-wrap">
              <img src="/added-favourites.png" alt="Saved" className="pd-save-img" />
            </div>

            <h3 className="pd-save-title">Added to Favourites!</h3>
            <p className="pd-save-subtitle">
              <strong>{post.treeName}</strong> has been saved.<br />
              You can find it in the Favourites tab.
            </p>

            <button
              className="pd-contact-ok-btn"
              onClick={() => { setShowSaveCard(false); navigate('/store'); }}
            >
              Go to Store
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;