import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useConfirmedPosts } from '../Context/ConfirmedPostsContext';
import './ProductDetail.css';
import header from '../Shared/Header.jsx';
import Header from '../Shared/Header.jsx';

const ProductDetail = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { confirmPost, isPostConfirmed } = useConfirmedPosts();

  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/marketplace/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setPost(response.data.post);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching product details:', err);
      setError('Failed to load product details');
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedOption) {
      // Confirm the post in context
      confirmPost(id, selectedOption);

      // Show success message
      alert(`Success! You have confirmed: ${selectedOption} for ${post.treeName}\n\nYou will now be redirected to the store.`);

      // Navigate back to store
      navigate('/store');
    } else {
      alert('Please select an option');
    }
  };

  const handleBack = () => {
    navigate('/store');
  };

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="loading-message">Loading product details...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="product-detail-container">
        <div className="error-message">
          <p>{error || 'Product not found'}</p>
          <button onClick={handleBack} className="back-button">
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  // Check if post is unavailable - check BOTH backend status AND context
  const isBackendUnavailable = post.status === 'confirmed' || 
                               post.status === 'sold' || 
                               post.status === 'unavailable';
  const isContextConfirmed = isPostConfirmed(id);
  const isUnavailable = isBackendUnavailable || isContextConfirmed;

  return (
    <div className="product-detail-container">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="product-main">
        <button 
          className="back-button" 
          onClick={() => navigate('/store')}
          title="Back to Store"
        >
          <span className="back-arrow">←</span>
        </button>
        {/* Product Image */}
        <div className="product-image-section">
          <img
            src={post.photos && post.photos.length > 0 ? post.photos[0] : '/tree-placeholder.png'}
            alt={post.treeName}
            className="product-detail-image"
          />
        </div>

        {/* Product Info */}
        <div className="product-info-section">
          <h2 className="product-detail-title">{post.treeName} - {post.treeType}</h2>

          {/* Post Type Badge */}
          <div className="post-type-badge-container">
            <span className={`post-type-badge ${post.postType}`}>
              {post.postType === 'sell' ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  For Sale
                </>
              ) : post.postType === 'exchange' ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 3l4 4-4 4" />
                    <path d="M20 7H4" />
                    <path d="M8 21l-4-4 4-4" />
                    <path d="M4 17h16" />
                  </svg>
                  For Exchange
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  Free - Donation
                </>
              )}
            </span>
            {post.postType === 'sell' && post.price > 0 && (
              <span className="price-display">৳{post.price.toLocaleString()}</span>
            )}
          </div>

          {/* Tree Information Grid */}
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
              <span className="meta-label">Age:</span>
              <span className="meta-value">{post.treeAge ? `${post.treeAge} years` : 'Not specified'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Condition:</span>
              <span className="meta-value">{post.condition}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Owner:</span>
              <span className="meta-value">{post.userId?.username || 'Anonymous'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Status:</span>
              <span className="meta-value">
                {isUnavailable ? '✗ Not Available' : '✓ Available'}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Contact Type:</span>
              <span className="meta-value">{post.contactType === 'phone' ? 'Phone Number' : 'Email Address'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Contact:</span>
              <span className="meta-value contact-link">
                {post.contactType === 'phone' ? (
                  <a href={`tel:${post.contactInfo}`}>{post.contactInfo}</a>
                ) : (
                  <a href={`mailto:${post.contactInfo}`}>{post.contactInfo}</a>
                )}
              </span>
            </div>
          </div>

          {/* Condition */}
          <div className="condition-section">
            <h3 className="section-title">Status</h3>
            <div className="condition-badge">{isUnavailable ? 'Not Available' : post.status}</div>
          </div>

          {/* Exchange For (only for exchange posts) */}
          {post.postType === 'exchange' && (
            <div className="exchange-section">
              <h3 className="section-title">Looking for in Exchange</h3>
              <div className="exchange-info">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 3l4 4-4 4" />
                  <path d="M20 7H4" />
                  <path d="M8 21l-4-4 4-4" />
                  <path d="M4 17h16" />
                </svg>
                <span>Check description for exchange details</span>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="description-section">
            <h3 className="section-title">Description</h3>
            <p className="description-text">{post.description}</p>
          </div>

          {/* Selection Options */}
          <div className="options-section">
            <h3 className="section-title">Select Option</h3>
            {isUnavailable ? (
              <div className="confirmed-message-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <div>
                  <p className="confirmed-title">This post has been confirmed</p>
                  <p className="confirmed-subtitle">This item is no longer available</p>
                </div>
              </div>
            ) : (
              <>
                <div className="options-list">
                  <label className="option-item">
                    <input
                      type="radio"
                      name="product-option"
                      value="contact"
                      checked={selectedOption === 'contact'}
                      onChange={(e) => setSelectedOption(e.target.value)}
                    />
                    <span className="option-label">Contact Seller</span>
                  </label>
                  <label className="option-item">
                    <input
                      type="radio"
                      name="product-option"
                      value="save"
                      checked={selectedOption === 'save'}
                      onChange={(e) => setSelectedOption(e.target.value)}
                    />
                    <span className="option-label">Save for Later</span>
                  </label>
                </div>
              </>
            )}
          </div>

          {/* Confirm Button */}
          <div className="action-section">
            <button
              className="confirm-btn"
              onClick={handleConfirm}
              disabled={isUnavailable}
              style={{
                opacity: isUnavailable ? 0.5 : 1,
                cursor: isUnavailable ? 'not-allowed' : 'pointer'
              }}
            >
              {isUnavailable ? 'No Longer Available' : 'Confirm Selection'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;