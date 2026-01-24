import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useConfirmedPosts } from '../Context/ConfirmedPostsContext';
import './Store.css';
import Header from '../Shared/Header';

const Store = () => {
  // Preserve active tab from localStorage or default to 'For you'
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('storeActiveTab') || 'For you';
  });
  const [visibleProjects, setVisibleProjects] = useState(8);
  const [searchQuery, setSearchQuery] = useState('');
  const [marketplacePosts, setMarketplacePosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

      // Apply filtering based on active tab
      if (activeTab !== 'For you' && activeTab !== 'Favourites') {
        // Map tab names to postType values
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
        setMarketplacePosts(response.data.posts || []);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching marketplace posts:', err);
      setError('Failed to load marketplace posts');
      setLoading(false);
    }
  };

  // Tree-related projects array with category
  const allProjects = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&h=400&fit=crop',
      title: 'Japanese Maple Tree',
      author: 'Sarah Johnson',
      likes: 378,
      views: '2.8K',
      category: 'Buy',
      price: 450,
      tags: ['maple', 'japanese', 'tree', 'ornamental']
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&h=400&fit=crop',
      title: 'Cherry Blossom Sapling',
      author: 'Michael Chen',
      likes: 157,
      views: '344',
      category: 'Buy',
      price: 120,
      tags: ['cherry', 'blossom', 'sapling', 'flowering']
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&h=400&fit=crop',
      title: 'Pine Tree Collection',
      author: 'Garden Masters',
      likes: 545,
      views: '8.4K',
      category: 'Exchange',
      tags: ['pine', 'evergreen', 'collection', 'conifer']
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&h=400&fit=crop',
      title: 'Oak Tree - Mature',
      author: 'David Martinez',
      likes: 892,
      views: '12K',
      category: 'Buy',
      price: 1200,
      tags: ['oak', 'mature', 'hardwood', 'shade']
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
      title: 'Birch Tree Duo',
      author: 'Emma Wilson',
      likes: 234,
      views: '1.2K',
      category: 'Buy',
      price: 300,
      tags: ['birch', 'white', 'duo', 'decorative']
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=600&h=400&fit=crop',
      title: 'Willow Tree - Young',
      author: 'Robert Green',
      likes: 456,
      views: '3.1K',
      category: 'Donate',
      tags: ['willow', 'young', 'weeping', 'water']
    },
    {
      id: 7,
      image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=600&h=400&fit=crop',
      title: 'Magnolia Tree',
      author: 'Lisa Park',
      likes: 678,
      views: '5.6K',
      category: 'Buy',
      price: 680,
      tags: ['magnolia', 'flowering', 'fragrant', 'spring']
    },
    {
      id: 8,
      image: 'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=600&h=400&fit=crop',
      title: 'Palm Tree - Tropical',
      author: 'James Rodriguez',
      likes: 321,
      views: '2.1K',
      category: 'Buy',
      price: 550,
      tags: ['palm', 'tropical', 'exotic', 'coastal']
    },
    {
      id: 9,
      image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&h=400&fit=crop',
      title: 'Evergreen Collection',
      author: 'Rachel Brown',
      likes: 445,
      views: '3.5K',
      category: 'Exchange',
      tags: ['evergreen', 'collection', 'year-round', 'green']
    },
    {
      id: 10,
      image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&h=400&fit=crop',
      title: 'Red Maple Tree',
      author: 'Alex Turner',
      likes: 567,
      views: '4.2K',
      category: 'Buy',
      price: 400,
      tags: ['maple', 'red', 'autumn', 'colorful']
    },
    {
      id: 11,
      image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&h=400&fit=crop',
      title: 'Flowering Plum Tree',
      author: 'Maria Santos',
      likes: 289,
      views: '1.8K',
      category: 'Buy',
      price: 180,
      tags: ['plum', 'flowering', 'spring', 'pink']
    },
    {
      id: 12,
      image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&h=400&fit=crop',
      title: 'Ancient Oak',
      author: 'Tom Anderson',
      likes: 398,
      views: '2.9K',
      category: 'Buy',
      price: 2500,
      tags: ['oak', 'ancient', 'heritage', 'large']
    },
    {
      id: 13,
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
      title: 'White Birch Tree',
      author: 'Lisa Chen',
      likes: 512,
      views: '4.7K',
      category: 'Buy',
      price: 280,
      tags: ['birch', 'white', 'bark', 'elegant']
    },
    {
      id: 14,
      image: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=600&h=400&fit=crop',
      title: 'Weeping Willow',
      author: 'Mark Wilson',
      likes: 423,
      views: '3.3K',
      category: 'Buy',
      price: 850,
      tags: ['willow', 'weeping', 'graceful', 'pond']
    },
    {
      id: 15,
      image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=600&h=400&fit=crop',
      title: 'Pink Magnolia',
      author: 'Jessica Park',
      likes: 334,
      views: '2.4K',
      category: 'Donate',
      tags: ['magnolia', 'pink', 'blooming', 'beautiful']
    },
    {
      id: 16,
      image: 'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=600&h=400&fit=crop',
      title: 'Coconut Palm Tree',
      author: 'Chris Martin',
      likes: 601,
      views: '5.8K',
      category: 'Buy',
      price: 620,
      tags: ['palm', 'coconut', 'tropical', 'beach']
    }
  ];

  // Filter projects based on active tab and search query
  const getFilteredProjects = () => {
    let filtered = marketplacePosts;

    // Already filtered by backend for Buy/Exchange/Donate tabs
    // Additional client-side filtering for search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.treeName.toLowerCase().includes(query) ||
        post.treeType.toLowerCase().includes(query) ||
        post.offering.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query)
      );
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
    localStorage.setItem('storeActiveTab', tab); // Save active tab to localStorage
    setVisibleProjects(8); // Reset visible projects when changing tabs
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setVisibleProjects(12); // Reset visible projects when searching
  };

  const handleFilterClick = () => {
    // Implement filter modal/dropdown here
    alert('Filter options coming soon!');
  };

  return (
    <div className="portfolio-container">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo-container">
            <svg className="logo-icon" width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#2E7D32" />
              <path d="M20 8C20 8 16 14 16 18C16 20.21 17.79 22 20 22C22.21 22 24 20.21 24 18C24 14 20 8 20 8Z" fill="#81C784" />
              <path d="M20 18L23 22C23 22 21.5 24 20 24C18.5 24 17 22 17 22L20 18Z" fill="#A5D6A7" />
              <rect x="19" y="22" width="2" height="10" rx="1" fill="#6D4C41" />
              <circle cx="20" cy="32" r="4" fill="#4CAF50" />
            </svg>
            <h1 className="logo">Fyto</h1>
          </div>
        </div>

        <div className="header-right">
          <button className="menu-icon">☰</button>
        </div>
      </header>

      {/* Tabs Navigation with Search and Filter */}
      <nav className="tabs-nav">
        <div className="tabs-left">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="tabs-right">
          <div className="search-container">
            <svg className="search-icon-left" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search trees, plants..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button className="filter-btn-inside" onClick={handleFilterClick} title="Filter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6" strokeLinecap="round" />
                <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" />
                <line x1="4" y1="18" x2="20" y2="18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Projects Grid */}
      <div className="projects-grid">
        {loading ? (
          <div className="loading-message">Loading marketplace posts...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : displayedProjects.length > 0 ? (
          displayedProjects.map((post) => (
            <div
              key={post._id}
              className="project-card"
              onClick={() => handleProjectClick(post._id)}
            >
              <div className="project-image-container">
                <img
                  src={post.photos && post.photos.length > 0 ? post.photos[0] : '/tree-placeholder.png'}
                  alt={post.treeName}
                  className="project-image"
                />
                <div className="project-category-badge">
                  {post.postType.charAt(0).toUpperCase() + post.postType.slice(1)}
                </div>
              </div>

              <div className="project-info">
                <div className="info-row title-row">
                  <div className="project-title">{post.treeName} - {post.treeType}</div>
                  {post.postType === 'sell' && post.price > 0 && (
                    <span className="price">৳{post.price.toLocaleString()}</span>
                  )}
                </div>
                <div className="info-row author-row">
                  <span className="author-name">{post.userId?.username || 'Anonymous'}</span>
                </div>
                <div className="info-row offering-row">
                  <span className="offering-text">{post.offering}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No marketplace posts found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="load-more-container">
          <button className="load-more-btn" onClick={loadMore}>
            Load More
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fab-container">
        <button className="new-post-fab" title="Create new post" onClick={handleNewPost}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Store;