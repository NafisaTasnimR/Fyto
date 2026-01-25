import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Store.css';
import Header from '../Shared/Header';
import { useConfirmedPosts } from '../Context/ConfirmedPostsContext'; // Add this import

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
  
  // Filter states
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  
  const navigate = useNavigate();
  const { isPostConfirmed } = useConfirmedPosts(); 

  const tabs = ['For you', 'Buy', 'Exchange', 'Donate', 'Favourites'];

  useEffect(() => {
    fetchMarketplacePosts();
  }, [activeTab]);

  const fetchMarketplacePosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Please login to view marketplace');
        setLoading(false);
        return;
      }

      let url = `${process.env.REACT_APP_API_URL}/api/marketplace`;

      if (activeTab !== 'For you' && activeTab !== 'Favourites') {
        const tabToPostTypeMap = {
          'Buy': 'sell',
          'Exchange': 'exchange',
          'Donate': 'donate'
        };
        const postType = tabToPostTypeMap[activeTab];
        url = `${process.env.REACT_APP_API_URL}/api/marketplace/search?postType=${postType}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const posts = response.data.posts || [];
        // Remove the temporary test code that was setting posts[0].status
        setMarketplacePosts(posts);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching marketplace posts:', err);
      setError('Failed to load marketplace posts');
      setLoading(false);
    }
  };

  const getFilteredProjects = () => {
    let filtered = marketplacePosts;

    // Search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.treeName?.toLowerCase().includes(query) ||
        post.treeType?.toLowerCase().includes(query) ||
        post.offering?.toLowerCase().includes(query) ||
        post.description?.toLowerCase().includes(query)
      );
    }

    // Price filter
    if (priceRange.min !== '' || priceRange.max !== '') {
      filtered = filtered.filter(post => {
        const price = post.price || 0;
        const min = priceRange.min !== '' ? parseFloat(priceRange.min) : 0;
        const max = priceRange.max !== '' ? parseFloat(priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Availability filter
    if (availabilityFilter === 'available') {
      filtered = filtered.filter(post => {
        // Check both backend status AND context confirmation
        const isBackendUnavailable = post.status === 'confirmed' || 
                                     post.status === 'sold' || 
                                     post.status === 'unavailable';
        const isContextConfirmed = isPostConfirmed(post._id);
        
        return !isBackendUnavailable && !isContextConfirmed;
      });
    } else if (availabilityFilter === 'unavailable') {
      filtered = filtered.filter(post => {
        // Check both backend status AND context confirmation
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

  return (
    <div className="store-page">
      <Header />

      {/* Tabs and Search Navigation */}
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

      {/* Main Content */}
      <div className="store-content">
        {loading ? (
          <div className="store-message">Loading marketplace posts...</div>
        ) : error ? (
          <div className="store-message">{error}</div>
        ) : displayedProjects.length > 0 ? (
          <>
            <div className="store-grid">
              {displayedProjects.map((post) => {
                // Check BOTH backend status AND context confirmation
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
                      <span className="store-card-badge">
                        {post.postType === 'sell' ? 'Buy' : 
                         post.postType === 'exchange' ? 'Exchange' : 
                         post.postType === 'donate' ? 'Donate' : 'Buy'}
                      </span>
                      
                      {isConfirmed && (
                        <div className="confirmed-overlay">
                          <div className="confirmed-badge">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            Confirmed
                          </div>
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
          <div className="store-message">No marketplace posts found matching your criteria.</div>
        )}
      </div>

      {/* Floating Action Button */}
      <button className="store-fab" onClick={handleNewPost} title="Create new post">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="filter-modal-overlay" onClick={() => setShowFilterModal(false)}>
          <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
            <div className="filter-modal-header">
              <h3>Filters</h3>
              <button className="close-modal-btn" onClick={() => setShowFilterModal(false)}>×</button>
            </div>

            <div className="filter-modal-content">
              {/* Price Range Filter */}
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

              {/* Availability Filter */}
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
    </div>
  );
};

export default Store;