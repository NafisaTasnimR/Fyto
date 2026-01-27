import React, { useState } from 'react';
import './ExtraChallenges.css';

const ExtraChallenges = () => {
  const [completedChallenges, setCompletedChallenges] = useState([]);


  const challenges = [
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
  ];





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
            <img src="/trophy.png" alt="trophy" className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">{completedChallenges.length}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
          <div className="stat-card">
            <img src="/hourglass.png" alt="hourglass" className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">
                {challenges.filter(c => c.status === 'in-progress').length}
              </span>
              <span className="stat-label">In Progress</span>
            </div>
          </div>
          <div className="stat-card">
            <img src="/star.png" alt="star" className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">247</span>
              <span className="stat-label">Total Points</span>
            </div>
          </div>
        </div>
      </div>

      <div className="challenges-list">
        {challenges.map(challenge => {
          const isCompleted = challenge.progress >= challenge.total;
          const progressPercent = calculateProgress(challenge.progress, challenge.total);
          const statusBadge = getStatusBadge(isCompleted ? 'completed' : challenge.status);

          return (
            <div key={challenge.id} className={`challenge-list-item ${isCompleted ? 'completed' : ''}`}>
              <img src={`/${challenge.id}.png`} alt={challenge.title} className="challenge-sticker" />
              <div className="challenge-list-content">
                <div className="challenge-info">
                  <h3 className="challenge-title">{challenge.title}</h3>
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
                </div>
              </div>
              <div className="challenge-stats">
                <span className={`status-badge ${statusBadge.class}`}>
                  {statusBadge.text}
                </span>
                <div className="points-badge">
                  <img src="/Extra-Challenge-point.png" alt="points" className="points-icon" />
                  <span className="points-value">{challenge.points}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExtraChallenges;