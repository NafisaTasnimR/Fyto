import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ExtraChallenges.css';

const API = process.env.REACT_APP_API_URL;

const ExtraChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [stats, setStats] = useState({ totalCompleted: 0, totalPoints: 0, currentBatch: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [challengesRes, statsRes] = await Promise.all([
          axios.get(`${API}/api/extra-challenges`, { headers }),
          axios.get(`${API}/api/extra-challenges/stats`, { headers })
        ]);

        if (challengesRes.data.success) {
          setChallenges(challengesRes.data.data.challenges || []);
        }
        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }
      } catch (err) {
        console.error('Error loading extra challenges:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateProgress = (current, total) => {
    return Math.min((current / total) * 100, 100);
  };

  const getStatusBadge = (challenge) => {
    if (challenge.isCompleted) return { text: 'Completed', class: 'status-completed' };
    if (challenge.currentProgress > 0) return { text: 'In Progress', class: 'status-progress' };
    return { text: 'Available', class: 'status-available' };
  };

  const inProgressCount = challenges.filter(c => !c.isCompleted && c.currentProgress > 0).length;

  const challengeImages = ['mp1', 'mp4', 'mp3', 'mp9', 'mp8'];

  return (
    <div className="extra-challenges-container">
      <div className="challenges-header">
        <h1>Extra Challenges</h1>
        <p className="subtitle">Complete long-term achievements and earn bonus points</p>
        
        <div className="stats-overview">
          <div className="stat-card">
            <img src="/champion.png" alt="trophy" className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">{loading ? '...' : stats.totalCompleted}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
          <div className="stat-card">
            <img src="/hourglass.png" alt="hourglass" className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">{loading ? '...' : inProgressCount}</span>
              <span className="stat-label">In Progress</span>
            </div>
          </div>
          <div className="stat-card">
            <img src="/star.png" alt="star" className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">{loading ? '...' : stats.totalPoints}</span>
              <span className="stat-label">Total Points</span>
            </div>
          </div>
        </div>
      </div>

      <div className="challenges-list">
        {loading ? (
          <p style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>Loading challenges...</p>
        ) : challenges.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>No challenges available yet.</p>
        ) : challenges.map((challenge, index) => {
          const progressPercent = calculateProgress(challenge.currentProgress, challenge.targetCount);
          const statusBadge = getStatusBadge(challenge);
          const imgName = challengeImages[index % challengeImages.length];

          return (
            <div key={challenge.id} className={`challenge-list-item ${challenge.isCompleted ? 'completed' : ''}`}>
              <img src={`/${imgName}.png`} alt={challenge.title} className="challenge-sticker" />
              <div className="challenge-list-content">
                <div className="challenge-info">
                  <h3 className="challenge-title">{challenge.title}</h3>
                  <p className="challenge-description">{challenge.description}</p>
                  <div className="progress-section">
                    <div className="progress-info">
                      <span className="progress-text">
                        {challenge.currentProgress} / {challenge.targetCount}
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