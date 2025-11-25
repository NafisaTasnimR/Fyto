import React, { useState } from 'react';
import './Store.css';

const Store = () => {
  const [activeTab, setActiveTab] = useState('For you');
  const [visibleProjects, setVisibleProjects] = useState(8);

  const tabs = [<button className="filter-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="4" y1="6" x2="20" y2="6" strokeWidth="2" strokeLinecap="round"/>
              <line x1="4" y1="12" x2="20" y2="12" strokeWidth="2" strokeLinecap="round"/>
              <line x1="4" y1="18" x2="20" y2="18" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="filter-text">Filter</span>
          </button>,'For you', 'Buy', 'Exchange', 'Donate', 'Favourites'];

  // Extended projects array with more items
  const allProjects = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
      title: 'COTTA - Brand Identity',
      author: 'Luis Brands',
      likes: 378,
      views: '2.8K'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop',
      title: 'Personal & Commercial Illustrations',
      author: 'Anastasia Kirsanova',
      likes: 157,
      views: '344'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&h=400&fit=crop',
      title: 'MEET',
      author: 'Multiple Owners',
      likes: 545,
      views: '8.4K'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=400&fit=crop',
      title: 'Creative Photography',
      author: 'John Smith',
      likes: 892,
      views: '12K'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&h=400&fit=crop',
      title: 'Modern UI Design',
      author: 'Sarah Johnson',
      likes: 234,
      views: '1.2K'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&h=400&fit=crop',
      title: 'Brand Strategy',
      author: 'Mike Chen',
      likes: 456,
      views: '3.1K'
    },
    {
      id: 7,
      image: 'https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3?w=600&h=400&fit=crop',
      title: 'Digital Art Collection',
      author: 'Emma Wilson',
      likes: 678,
      views: '5.6K'
    },
    {
      id: 8,
      image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600&h=400&fit=crop',
      title: 'Abstract Concepts',
      author: 'David Lee',
      likes: 321,
      views: '2.1K'
    },
    {
      id: 9,
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
      title: 'Team Collaboration',
      author: 'Rachel Green',
      likes: 445,
      views: '3.5K'
    },
    {
      id: 10,
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop',
      title: 'Tech Innovation',
      author: 'Alex Turner',
      likes: 567,
      views: '4.2K'
    },
    {
      id: 11,
      image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600&h=400&fit=crop',
      title: 'Coffee Shop Branding',
      author: 'Maria Santos',
      likes: 289,
      views: '1.8K'
    },
    {
      id: 12,
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop',
      title: 'Workspace Design',
      author: 'Tom Anderson',
      likes: 398,
      views: '2.9K'
    },
    {
      id: 13,
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
      title: 'Coding Projects',
      author: 'Lisa Chen',
      likes: 512,
      views: '4.7K'
    },
    {
      id: 14,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      title: 'Data Visualization',
      author: 'Mark Wilson',
      likes: 423,
      views: '3.3K'
    },
    {
      id: 15,
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=400&fit=crop',
      title: 'Fitness App Design',
      author: 'Jessica Park',
      likes: 334,
      views: '2.4K'
    },
    {
      id: 16,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
      title: 'Mountain Adventures',
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
          <button className="new-post-btn" title="New post">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  </button>
        </div>
      </header>

      {/* Tabs Navigation */}
      <nav className="tabs-nav">
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
          <div key={project.id} className="project-card">
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