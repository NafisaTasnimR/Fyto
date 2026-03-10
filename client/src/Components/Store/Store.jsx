import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Store.css';
import Header from '../Shared/Header';
import Loader from '../Shared/Loader';
import EmptyState from '../Shared/EmptyState';
import { useConfirmedPosts } from '../Context/ConfirmedPostsContext';

const Store = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('storeActiveTab') || 'For you';
  });
  const [visibleProjects, setVisibleProjects] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [marketplacePosts, setMarketplacePosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);


  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [reportModal, setReportModal] = useState({ open: false, postId: null });
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [showReportSuccess, setShowReportSuccess] = useState(false);

  const navigate = useNavigate();
  const { isPostConfirmed } = useConfirmedPosts();

  const tabs = ['For you', 'Buy', 'Exchange', 'Donate', 'Favourites'];

  // Close dropdown on outside click
  useEffect(() => {
    const close = () => setOpenMenuId(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  useEffect(() => {
    if (activeTab === 'Favourites') {
      fetchSavedPosts();
    } else {
      fetchMarketplacePosts(activeTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchMarketplacePosts = async (tab = activeTab) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Please login to view marketplace');
        setLoading(false);
        return;
      }

      let url = `${process.env.REACT_APP_API_URL}/api/marketplace`;

      if (tab !== 'For you' && tab !== 'Favourites') {
        const tabToPostTypeMap = {
          'Buy': 'sell',
          'Exchange': 'exchange',
          'Donate': 'donate'
        };
        const postType = tabToPostTypeMap[tab];
        url = `${process.env.REACT_APP_API_URL}/api/marketplace/search?postType=${postType}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const posts = response.data.posts || [];
        setMarketplacePosts(posts);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching marketplace posts:', err);
      setError('Failed to load marketplace posts');
      setLoading(false);
    }
  };

  const fetchSavedPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) { setError('Please login to view favourites'); setLoading(false); return; }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/marketplace/saved`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const posts = response.data.posts || [];
        setMarketplacePosts(posts);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching saved posts:', err);
      setError('Failed to load saved posts');
      setLoading(false);
    }
  };

  const getFilteredProjects = () => {
    let filtered = marketplacePosts;


    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.treeName?.toLowerCase().includes(query) ||
        post.treeType?.toLowerCase().includes(query) ||
        post.offering?.toLowerCase().includes(query) ||
        post.description?.toLowerCase().includes(query)
      );
    }


    if (priceRange.min !== '' || priceRange.max !== '') {
      filtered = filtered.filter(post => {
        const price = post.price || 0;
        const min = priceRange.min !== '' ? parseFloat(priceRange.min) : 0;
        const max = priceRange.max !== '' ? parseFloat(priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }


    if (availabilityFilter === 'available') {
      filtered = filtered.filter(post => {

        const isBackendUnavailable = post.status === 'confirmed' ||
          post.status === 'sold' ||
          post.status === 'unavailable';
        const isContextConfirmed = isPostConfirmed(post._id);

        return !isBackendUnavailable && !isContextConfirmed;
      });
    } else if (availabilityFilter === 'unavailable') {
      filtered = filtered.filter(post => {

        const isBackendUnavailable = post.status === 'confirmed' ||
          post.status === 'sold' ||
          post.status === 'unavailable';
        const isContextConfirmed = isPostConfirmed(post._id);

        return isBackendUnavailable || isContextConfirmed;
      });
    }

    return filtered;
  };

  const filteredProjects = getFilteredProjects();
  const displayedProjects = filteredProjects.slice(0, visibleProjects);
  const hasMore = visibleProjects < filteredProjects.length;

  const loadMore = () => {
    setVisibleProjects(prev => Math.min(prev + 12, filteredProjects.length));
  };

  const handleProjectClick = (projectId) => {
    navigate(`/product/${projectId}`);
  };

  const handleNewPost = () => {
    navigate('/new-post');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('storeActiveTab', tab);
    setVisibleProjects(12);
    setMarketplacePosts([]);
    setError(null);
    if (tab === 'Favourites') {
      fetchSavedPosts();
    } else {
      fetchMarketplacePosts(tab);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setVisibleProjects(12);
  };

  const handleFilterClick = () => {
    setShowFilterModal(!showFilterModal);
  };

  const handleApplyFilters = () => {
    setShowFilterModal(false);
    setVisibleProjects(12);
  };

  const handleClearFilters = () => {
    setPriceRange({ min: '', max: '' });
    setAvailabilityFilter('all');
    setVisibleProjects(12);
  };

  const handleReportOpen = (e, postId) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setReportModal({ open: true, postId });
    setReportReason('');
  };

  const handleReportSubmit = async () => {
    if (!reportReason.trim()) return;
    setReportSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/reports/${reportModal.postId}`,
        { reason: reportReason, postType: 'marketplace' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReportSubmitting(false);
      setReportModal({ open: false, postId: null });
      setReportReason('');
      setShowReportSuccess(true);
    } catch (err) {
      setReportSubmitting(false);
      console.error('Report error:', err);
      alert(err.response?.data?.message || 'Failed to submit report. Please try again.');
    }
  };

  return (
    <div className="store-page">
      <Header />


      <div className="marketplace-navbar-wrapper">
        <div className="marketplace-tabs-container">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`marketplace-tab-button ${activeTab === tab ? 'marketplace-tab-active' : ''}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="marketplace-search-wrapper">
          <svg className="marketplace-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="marketplace-search-input"
            placeholder="Search trees, plants..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button className="marketplace-filter-btn" onClick={handleFilterClick} title="Filter">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6" strokeLinecap="round" />
              <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" />
              <line x1="4" y1="18" x2="20" y2="18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>


      <div className="store-content">
        {loading ? (
          <Loader size="medium" message="Loading marketplace posts..." />
        ) : error ? (
          <EmptyState
            title="Error Loading Posts"
            message={error}
            iconSrc="/images/no-posts-cat.png"
          />
        ) : displayedProjects.length > 0 ? (
          <>
            <div className="store-grid">
              {displayedProjects.map((post) => {

                const isBackendUnavailable = post.status === 'confirmed' ||
                  post.status === 'sold' ||
                  post.status === 'unavailable';
                const isContextConfirmed = isPostConfirmed(post._id);
                const isConfirmed = isBackendUnavailable || isContextConfirmed;

                return (
                  <div
                    key={post._id}
                    className={`store-card ${isConfirmed ? 'confirmed' : ''}`}
                    onClick={() => !isConfirmed && handleProjectClick(post._id)}
                  >
                    <div className="store-card-image-wrapper">
                      <img
                        src={post.photos && post.photos.length > 0 ? post.photos[0] : '/tree-placeholder.png'}
                        alt={post.treeName}
                        className="store-card-image"
                      />
                      <div className="store-card-top-right" onClick={e => e.stopPropagation()}>
                        <div className="store-card-menu-wrap">
                          <button
                            className="store-card-menu-btn"
                            onClick={e => { e.stopPropagation(); setOpenMenuId(openMenuId === post._id ? null : post._id); }}
                          >
                            <span /><span /><span />
                          </button>
                          {openMenuId === post._id && (
                            <div className="store-card-dropdown">
                              <button onClick={e => handleReportOpen(e, post._id)}>Report</button>
                            </div>
                          )}
                        </div>
                        <span className="store-card-badge">
                          {post.postType === 'sell' ? 'Buy' :
                            post.postType === 'exchange' ? 'Exchange' :
                              post.postType === 'donate' ? 'Donate' : 'Buy'}
                        </span>
                      </div>

                      {isConfirmed && (
                        <div className="confirmed-overlay">

                          <div className="unavailable-text">NO LONGER AVAILABLE</div>
                        </div>
                      )}
                    </div>

                    <div className="store-card-info">
                      <div className="store-card-title-row">
                        <h3 className="store-card-title">{post.treeName} - {post.treeType}</h3>
                        {post.postType === 'sell' && post.price > 0 && (
                          <span className="store-card-price">৳{post.price.toLocaleString()}</span>
                        )}
                      </div>
                      <p className="store-card-author">{post.userId?.username || 'Anonymous'}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {hasMore && (
              <div className="store-load-more-container">
                <button className="store-load-more-button" onClick={loadMore}>
                  Load More
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="No Marketplace Posts"
            message="No marketplace posts found matching your criteria. Try adjusting your filters or search!"
            iconSrc="/alert.png"
          />
        )}
      </div>


      <button className="store-fab" onClick={handleNewPost} title="Create new post">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>


      {showFilterModal && (
        <div className="filter-modal-overlay" onClick={() => setShowFilterModal(false)}>
          <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
            <div className="filter-modal-header">
              <h3>Filters</h3>
              <button className="close-modal-btn" onClick={() => setShowFilterModal(false)}>×</button>
            </div>

            <div className="filter-modal-content">

              <div className="filter-section">
                <h4>Price Range (৳)</h4>
                <div className="price-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="price-input"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="price-input"
                  />
                </div>
              </div>


              <div className="filter-section">
                <h4>Availability</h4>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="availability"
                      value="all"
                      checked={availabilityFilter === 'all'}
                      onChange={(e) => setAvailabilityFilter(e.target.value)}
                    />
                    All Posts
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="availability"
                      value="available"
                      checked={availabilityFilter === 'available'}
                      onChange={(e) => setAvailabilityFilter(e.target.value)}
                    />
                    Available Only
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="availability"
                      value="unavailable"
                      checked={availabilityFilter === 'unavailable'}
                      onChange={(e) => setAvailabilityFilter(e.target.value)}
                    />
                    Unavailable Only
                  </label>
                </div>
              </div>
            </div>

            <div className="filter-modal-footer">
              <button className="clear-filters-btn" onClick={handleClearFilters}>Clear All</button>
              <button className="apply-filters-btn" onClick={handleApplyFilters}>Apply Filters</button>
            </div>
          </div>
        </div>
      )}
      {reportModal.open && (
        <div className="report-modal-overlay" onClick={() => setReportModal({ open: false, postId: null })}>
          <div className="report-modal" onClick={e => e.stopPropagation()}>
            <div className="report-modal-header">
              <h3>Report Post</h3>
              <button className="report-modal-close" onClick={() => setReportModal({ open: false, postId: null })}>×</button>
            </div>
            <div className="report-modal-body">
              <p>Why are you reporting this post?</p>
              <textarea
                className="report-textarea"
                placeholder="Please provide a reason for reporting this post..."
                value={reportReason}
                onChange={e => setReportReason(e.target.value)}
              />
            </div>
            <div className="report-modal-footer">
              <button className="report-cancel-btn" onClick={() => setReportModal({ open: false, postId: null })}>Cancel</button>
              <button className="report-submit-btn" onClick={handleReportSubmit} disabled={reportSubmitting || !reportReason.trim()}>
                {reportSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showReportSuccess && (
        <div className="report-success-overlay" onClick={() => setShowReportSuccess(false)}>
          <div className="report-success-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="report-success-close"
              onClick={() => setShowReportSuccess(false)}
              title="Close"
            >
              ✕
            </button>
            <div className="report-success-content">
              <div className="report-success-icon-container">
                <img src="/reportIcon.png" alt="report icon" className="report-success-icon" />
              </div>
              <h2 className="report-success-title">Report Submitted</h2>
              <p className="report-success-message">Thank you for reporting. We'll review it shortly.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;