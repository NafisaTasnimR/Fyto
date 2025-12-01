import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Store.css';

const Store = () => {
  const [activeTab, setActiveTab] = useState('For you');
  const [visibleProjects, setVisibleProjects] = useState(8);
  const navigate = useNavigate();

  const tabs = ['For you', 'Buy', 'Exchange', 'Donate', 'Favourites'];

  // Tree-related projects array
  const allProjects = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&h=400&fit=crop',
      title: 'Japanese Maple Tree',
      author: 'Sarah Johnson',
      likes: 378,
      views: '2.8K'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&h=400&fit=crop',
      title: 'Cherry Blossom Sapling',
      author: 'Michael Chen',
      likes: 157,
      views: '344'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&h=400&fit=crop',
      title: 'Pine Tree Collection',
      author: 'Garden Masters',
      likes: 545,
      views: '8.4K'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&h=400&fit=crop',
      title: 'Oak Tree - Mature',
      author: 'David Martinez',
      likes: 892,
      views: '12K'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
      title: 'Birch Tree Duo',
      author: 'Emma Wilson',
      likes: 234,
      views: '1.2K'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=600&h=400&fit=crop',
      title: 'Willow Tree - Young',
      author: 'Robert Green',
      likes: 456,
      views: '3.1K'
    },
    {
      id: 7,
      image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=600&h=400&fit=crop',
      title: 'Magnolia Tree',
      author: 'Lisa Park',
      likes: 678,
      views: '5.6K'
    },
    {
      id: 8,
      image: 'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=600&h=400&fit=crop',
      title: 'Palm Tree - Tropical',
      author: 'James Rodriguez',
      likes: 321,
      views: '2.1K'
    },
    {
      id: 9,
      image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&h=400&fit=crop',
      title: 'Evergreen Collection',
      author: 'Rachel Brown',
      likes: 445,
      views: '3.5K'
    },
    {
      id: 10,
      image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&h=400&fit=crop',
      title: 'Red Maple Tree',
      author: 'Alex Turner',
      likes: 567,
      views: '4.2K'
    },
    {
      id: 11,
      image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&h=400&fit=crop',
      title: 'Flowering Plum Tree',
      author: 'Maria Santos',
      likes: 289,
      views: '1.8K'
    },
    {
      id: 12,
      image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&h=400&fit=crop',
      title: 'Ancient Oak',
      author: 'Tom Anderson',
      likes: 398,
      views: '2.9K'
    },
    {
      id: 13,
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
      title: 'White Birch Tree',
      author: 'Lisa Chen',
      likes: 512,
      views: '4.7K'
    },
    {
      id: 14,
      image: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=600&h=400&fit=crop',
      title: 'Weeping Willow',
      author: 'Mark Wilson',
      likes: 423,
      views: '3.3K'
    },
    {
      id: 15,
      image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=600&h=400&fit=crop',
      title: 'Pink Magnolia',
      author: 'Jessica Park',
      likes: 334,
      views: '2.4K'
    },
    {
      id: 16,
      image: 'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=600&h=400&fit=crop',
      title: 'Coconut Palm Tree',
      author: 'Chris Martin',
      likes: 601,
      views: '5.8K'
    }
  ];

  const displayedProjects = allProjects.slice(0, visibleProjects);
  const hasMore = visibleProjects < allProjects.length;

  const loadMore = () => {
    setVisibleProjects(prev => Math.min(prev + 8, allProjects.length));
  };

  const handleProjectClick = (projectId) => {
    navigate(`/product/${projectId}`);
  };

  const handleNewPost = () => {
    navigate('/new-post');
  };

  return (
    <div className="portfolio-container">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo-container">
            <svg className="logo-icon" width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#2E7D32"/>
              <path d="M20 8C20 8 16 14 16 18C16 20.21 17.79 22 20 22C22.21 22 24 20.21 24 18C24 14 20 8 20 8Z" fill="#81C784"/>
              <path d="M20 18L23 22C23 22 21.5 24 20 24C18.5 24 17 22 17 22L20 18Z" fill="#A5D6A7"/>
              <rect x="19" y="22" width="2" height="10" rx="1" fill="#6D4C41"/>
              <circle cx="20" cy="32" r="4" fill="#4CAF50"/>
            </svg>
            <h1 className="logo">Fyto</h1>
          </div>
        </div>
        
        <div className="header-right">
          <button className="menu-icon">☰</button>
          <button className="new-post-btn" title="New post" onClick={handleNewPost}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Tabs Navigation */}
      <nav className="tabs-nav">
        <button className="filter-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="4" y1="6" x2="20" y2="6" strokeWidth="2" strokeLinecap="round"/>
            <line x1="4" y1="12" x2="20" y2="12" strokeWidth="2" strokeLinecap="round"/>
            <line x1="4" y1="18" x2="20" y2="18" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="filter-text">Filter</span>
        </button>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Projects Grid */}
      <div className="projects-grid">
        {displayedProjects.map((project) => (
          <div 
            key={project.id} 
            className="project-card"
            onClick={() => handleProjectClick(project.id)}
          >
            <div className="project-image-container">
              <img 
                src={project.image} 
                alt={project.title}
                className="project-image"
              />
            </div>
            
            <div className="project-info">
              <h3 className="project-title">{project.title}</h3>
              <div className="project-meta">
                <div className="author-info">
                  <span className="author-name">{project.author}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="load-more-container">
          <button className="load-more-btn" onClick={loadMore}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Store;