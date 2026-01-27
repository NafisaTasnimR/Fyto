import React, { useState } from 'react';
import './ExtraChallenges.css';

const ExtraChallenges = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [completedChallenges, setCompletedChallenges] = useState([]);

  // Challenge data organized by category
  const challenges = {
    marketplace: [
      { id: 'mp1', title: 'Green Thumb Trader', description: 'Buy 10 plants from marketplace', points: 20, progress: 3, total: 10, status: 'in-progress' },
      { id: 'mp2', title: 'Plant Parent Provider', description: 'Sell 5 plants on marketplace', points: 25, progress: 0, total: 5, status: 'available' },
      { id: 'mp3', title: 'Generous Gardener', description: 'Donate 3 plants to community members', points: 30, progress: 1, total: 3, status: 'in-progress' },
      { id: 'mp4', title: 'Exchange Expert', description: 'Complete 5 plant exchanges', points: 25, progress: 2, total: 5, status: 'in-progress' },
      { id: 'mp5', title: 'Rare Collector', description: 'Purchase a rare or exotic plant species', points: 40, progress: 0, total: 1, status: 'available' },
      { id: 'mp6', title: 'Market Maven', description: 'List 10 different plant varieties for sale', points: 30, progress: 4, total: 10, status: 'in-progress' },
      { id: 'mp7', title: 'Supporting Sustainability', description: 'Buy 5 locally-sourced plants', points: 25, progress: 0, total: 5, status: 'available' },
      { id: 'mp8', title: 'Deal Hunter', description: 'Purchase plants from 10 different sellers', points: 35, progress: 5, total: 10, status: 'in-progress' },
      { id: 'mp9', title: 'Diversity Champion', description: 'Own plants from 5 different plant families', points: 30, progress: 3, total: 5, status: 'in-progress' },
      { id: 'mp10', title: 'Marketplace Veteran', description: 'Complete 50 total marketplace transactions', points: 50, progress: 12, total: 50, status: 'in-progress' }
    ],
    social: [
      { id: 'sc1', title: 'Social Butterfly', description: 'Make 10 posts in a month', points: 30, progress: 6, total: 10, status: 'in-progress' },
      { id: 'sc2', title: 'Engaged Community Member', description: 'Receive 100 reactions on posts', points: 35, progress: 47, total: 100, status: 'in-progress' },
      { id: 'sc3', title: 'Conversation Starter', description: 'Get 50 comments across your posts', points: 30, progress: 28, total: 50, status: 'in-progress' },
      { id: 'sc4', title: 'Helping Hand', description: 'Comment helpful advice on 20 posts', points: 25, progress: 12, total: 20, status: 'in-progress' },
      { id: 'sc5', title: 'Inspiration Station', description: 'Share 5 plant transformation posts', points: 25, progress: 2, total: 5, status: 'in-progress' },
      { id: 'sc6', title: 'Photography Pro', description: 'Post 10 high-quality plant photos', points: 30, progress: 0, total: 10, status: 'available' },
      { id: 'sc7', title: 'Knowledge Sharer', description: 'Create 5 educational posts', points: 35, progress: 1, total: 5, status: 'in-progress' },
      { id: 'sc8', title: 'Community Builder', description: 'Follow 50 plant enthusiasts', points: 20, progress: 23, total: 50, status: 'in-progress' },
      { id: 'sc9', title: 'Trending Topic', description: 'Create a post that gets 200+ reactions', points: 45, progress: 0, total: 1, status: 'available' },
      { id: 'sc10', title: 'Monthly Contributor', description: 'Post at least once every week for a month', points: 40, progress: 0, total: 4, status: 'available' }
    ],
    journal: [
      { id: 'jr1', title: 'Dedicated Diarist', description: 'Journal for 7 consecutive days', points: 25, progress: 4, total: 7, status: 'in-progress' },
      { id: 'jr2', title: 'Monthly Chronicler', description: 'Complete 30 journal entries', points: 40, progress: 15, total: 30, status: 'in-progress' },
      { id: 'jr3', title: 'Growth Tracker', description: 'Document growth progress of 5 different plants', points: 30, progress: 2, total: 5, status: 'in-progress' },
      { id: 'jr4', title: 'Photo Journalist', description: 'Add photos to 10 journal entries', points: 25, progress: 6, total: 10, status: 'in-progress' },
      { id: 'jr5', title: 'Detailed Documenter', description: 'Write journal entries over 200 words (5 times)', points: 30, progress: 1, total: 5, status: 'in-progress' },
      { id: 'jr6', title: 'Problem Solver', description: 'Document and resolve a plant health issue', points: 35, progress: 0, total: 1, status: 'available' },
      { id: 'jr7', title: 'Seasonal Observer', description: 'Journal through all four seasons', points: 50, progress: 1, total: 4, status: 'in-progress' },
      { id: 'jr8', title: 'Propagation Logger', description: 'Track propagation journey from cutting to plant', points: 35, progress: 0, total: 1, status: 'available' },
      { id: 'jr9', title: 'Care Routine Master', description: 'Log care routines for 10 different plants', points: 30, progress: 3, total: 10, status: 'in-progress' },
      { id: 'jr10', title: 'Reflective Gardener', description: 'Journal monthly reflections for 6 months', points: 45, progress: 0, total: 6, status: 'available' }
    ],
    multifeature: [
      { id: 'mf1', title: 'Complete Enthusiast', description: 'Use all features (marketplace, journal, social) in one week', points: 40, progress: 0, total: 1, status: 'available' },
      { id: 'mf2', title: 'Platform Ambassador', description: 'Achieve 500 total points across all challenges', points: 100, progress: 247, total: 500, status: 'in-progress' },
      { id: 'mf3', title: 'Monthly Active User', description: 'Log in for 25 days in a month', points: 35, progress: 18, total: 25, status: 'in-progress' },
      { id: 'mf4', title: 'Helper Hero', description: 'Help 10 people through posts, comments, or donations', points: 45, progress: 4, total: 10, status: 'in-progress' },
      { id: 'mf5', title: 'Ecosystem Explorer', description: 'Interact with 100 different users', points: 40, progress: 32, total: 100, status: 'in-progress' }
    ]
  };

  const categories = [
    { id: 'all', label: 'All Challenges', icon: '🌟' },
    { id: 'marketplace', label: 'Marketplace', icon: '🛒' },
    { id: 'social', label: 'Social Media', icon: '💬' },
    { id: 'journal', label: 'Journal', icon: '📔' },
    { id: 'multifeature', label: 'Multi-Feature', icon: '🎯' }
  ];

  const getFilteredChallenges = () => {
    if (selectedCategory === 'all') {
      return Object.values(challenges).flat();
    }
    return challenges[selectedCategory] || [];
  };

  const handleClaim = (challengeId) => {
    // In production, make API call to claim challenge
    setCompletedChallenges([...completedChallenges, challengeId]);
    console.log('Claiming challenge:', challengeId);
  };

  const handleNavigate = (challengeId, category) => {
    // Navigate to relevant feature
    console.log('Navigating to:', category, challengeId);
  };

  const calculateProgress = (progress, total) => {
    return Math.min((progress / total) * 100, 100);
  };

  const getStatusBadge = (status) => {
    const badges = {
      'available': { text: 'Available', class: 'status-available' },
      'in-progress': { text: 'In Progress', class: 'status-progress' },
      'completed': { text: 'Completed', class: 'status-completed' }
    };
    return badges[status] || badges['available'];
  };

  return (
    <div className="extra-challenges-container">
      <div className="challenges-header">
        <h1>Extra Challenges</h1>
        <p className="subtitle">Complete long-term achievements and earn bonus points</p>
        
        <div className="stats-overview">
          <div className="stat-card">
            <span className="stat-icon">🏆</span>
            <div className="stat-info">
              <span className="stat-value">{completedChallenges.length}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">⏳</span>
            <div className="stat-info">
              <span className="stat-value">
                {getFilteredChallenges().filter(c => c.status === 'in-progress').length}
              </span>
              <span className="stat-label">In Progress</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🌟</span>
            <div className="stat-info">
              <span className="stat-value">247</span>
              <span className="stat-label">Total Points</span>
            </div>
          </div>
        </div>
      </div>

      <div className="category-filter">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>

      <div className="challenges-grid">
        {getFilteredChallenges().map(challenge => {
          const isCompleted = challenge.progress >= challenge.total;
          const progressPercent = calculateProgress(challenge.progress, challenge.total);
          const statusBadge = getStatusBadge(isCompleted ? 'completed' : challenge.status);

          return (
            <div key={challenge.id} className={`challenge-card ${isCompleted ? 'completed' : ''}`}>
              <div className="challenge-card-header">
                <div className="challenge-title-section">
                  <h3 className="challenge-title">{challenge.title}</h3>
                  <span className={`status-badge ${statusBadge.class}`}>
                    {statusBadge.text}
                  </span>
                </div>
                <div className="challenge-points">
                  <span className="points-value">{challenge.points}</span>
                  <span className="points-label">pts</span>
                </div>
              </div>

              <p className="challenge-description">{challenge.description}</p>

              <div className="progress-section">
                <div className="progress-info">
                  <span className="progress-text">
                    {challenge.progress} / {challenge.total}
                  </span>
                  <span className="progress-percent">
                    {Math.round(progressPercent)}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="challenge-actions">
                {isCompleted ? (
                  <button 
                    className="claim-button"
                    onClick={() => handleClaim(challenge.id)}
                  >
                    ✓ Claim Reward
                  </button>
                ) : (
                  <button 
                    className="go-button"
                    onClick={() => handleNavigate(challenge.id, selectedCategory)}
                  >
                    Go →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExtraChallenges;