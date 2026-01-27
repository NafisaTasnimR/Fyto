import React, { useState, useEffect } from 'react';
import './MonthlyTournament.css';

const MonthlyTournament = () => {
  const [activeTab, setActiveTab] = useState('challenges');
  const [daysRemaining, setDaysRemaining] = useState(5);
  const [currentRank, setCurrentRank] = useState(8);

  // Current month tournament data
  const tournamentData = {
    month: 'January 2026',
    theme: 'New Year, New Growth',
    description: 'Starting fresh with plant care resolutions',
    totalPoints: 400,
    bonusPoints: 100,
    daysRemaining: 5
  };

  // Tournament challenges
  const challenges = [
    {
      id: 'tc1',
      title: 'Start 3 new plants from seeds/cuttings',
      points: 100,
      status: 'completed',
      progress: 3,
      total: 3,
      completedDate: '2026-01-15'
    },
    {
      id: 'tc2',
      title: 'Create a plant care schedule and share it',
      points: 50,
      status: 'completed',
      progress: 1,
      total: 1,
      completedDate: '2026-01-18'
    },
    {
      id: 'tc3',
      title: 'Identify 20 winter-hardy plants',
      points: 100,
      status: 'in-progress',
      progress: 14,
      total: 20,
      completedDate: null
    },
    {
      id: 'tc4',
      title: 'Journal your plant goals for the year',
      points: 40,
      status: 'available',
      progress: 0,
      total: 1,
      completedDate: null
    },
    {
      id: 'tc5',
      title: 'Help 5 community members with winter plant care advice',
      points: 60,
      status: 'in-progress',
      progress: 2,
      total: 5,
      completedDate: null
    }
  ];

  // Bonus challenge
  const bonusChallenge = {
    title: 'Complete all challenges within first 15 days',
    points: 100,
    deadline: '2026-01-15',
    status: 'expired'
  };

  // Leaderboard data
  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, username: 'PlantMaster99', avatar: '🌻', points: 380, completedChallenges: 5, badge: 'gold' },
    { rank: 2, username: 'GreenThumbPro', avatar: '🌿', points: 350, completedChallenges: 5, badge: 'gold' },
    { rank: 3, username: 'BotanicalBella', avatar: '🌺', points: 310, completedChallenges: 5, badge: 'silver' },
    { rank: 4, username: 'FernFanatic', avatar: '🍃', points: 290, completedChallenges: 4, badge: 'silver' },
    { rank: 5, username: 'SucculentSage', avatar: '🌵', points: 270, completedChallenges: 4, badge: 'bronze' },
    { rank: 6, username: 'CactusKing', avatar: '🌵', points: 250, completedChallenges: 4, badge: 'bronze' },
    { rank: 7, username: 'OrchidOracle', avatar: '🌸', points: 220, completedChallenges: 3, badge: 'bronze' },
    { rank: 8, username: 'You', avatar: '👤', points: 200, completedChallenges: 3, badge: null, isCurrentUser: true },
    { rank: 9, username: 'MossyMike', avatar: '🌱', points: 180, completedChallenges: 3, badge: null },
    { rank: 10, username: 'LeafyLaura', avatar: '🍀', points: 160, completedChallenges: 2, badge: null }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update some user points (simulate competition)
      setLeaderboard(prev => {
        const updated = [...prev];
        const randomIndex = Math.floor(Math.random() * updated.length);
        if (!updated[randomIndex].isCurrentUser) {
          updated[randomIndex].points += Math.floor(Math.random() * 10);
        }
        return updated.sort((a, b) => b.points - a.points).map((user, index) => ({
          ...user,
          rank: index + 1
        }));
      });
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const calculateTotalPoints = () => {
    return challenges
      .filter(c => c.status === 'completed')
      .reduce((sum, c) => sum + c.points, 0);
  };

  const calculateProgress = (progress, total) => {
    return Math.min((progress / total) * 100, 100);
  };

  const getBadgeEmoji = (badge) => {
    const badges = {
      gold: '🥇',
      silver: '🥈',
      bronze: '🥉'
    };
    return badges[badge] || '';
  };

  const getRankClass = (rank) => {
    if (rank <= 3) return 'top-three';
    if (rank <= 10) return 'top-ten';
    return '';
  };

  return (
    <div className="monthly-tournament-container">
      <div className="tournament-header">
        <div className="tournament-banner">
          <div className="tournament-title-section">
            <h1>Monthly Tournament</h1>
            <div className="tournament-theme">{tournamentData.theme}</div>
            <p className="tournament-description">{tournamentData.description}</p>
          </div>
          
          <div className="tournament-stats">
            <div className="stat-box">
              <span className="stat-icon">📅</span>
              <div className="stat-content">
                <span className="stat-value">{daysRemaining}</span>
                <span className="stat-label">Days Left</span>
              </div>
            </div>
            <div className="stat-box">
              <span className="stat-icon">🏆</span>
              <div className="stat-content">
                <span className="stat-value">#{currentRank}</span>
                <span className="stat-label">Your Rank</span>
              </div>
            </div>
            <div className="stat-box">
              <span className="stat-icon">⭐</span>
              <div className="stat-content">
                <span className="stat-value">{calculateTotalPoints()}</span>
                <span className="stat-label">Your Points</span>
              </div>
            </div>
          </div>
        </div>

        <div className="tournament-progress-overview">
          <div className="progress-header">
            <span>Tournament Progress</span>
            <span className="progress-percentage">
              {Math.round((calculateTotalPoints() / tournamentData.totalPoints) * 100)}%
            </span>
          </div>
          <div className="tournament-progress-bar">
            <div 
              className="tournament-progress-fill"
              style={{ width: `${(calculateTotalPoints() / tournamentData.totalPoints) * 100}%` }}
            >
              <span className="progress-points">{calculateTotalPoints()}/{tournamentData.totalPoints}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="tournament-tabs">
        <button 
          className={`tab-btn ${activeTab === 'challenges' ? 'active' : ''}`}
          onClick={() => setActiveTab('challenges')}
        >
          <span className="tab-icon">📋</span>
          Challenges
        </button>
        <button 
          className={`tab-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          <span className="tab-icon">🏆</span>
          Leaderboard
        </button>
        <button 
          className={`tab-btn ${activeTab === 'rewards' ? 'active' : ''}`}
          onClick={() => setActiveTab('rewards')}
        >
          <span className="tab-icon">🎁</span>
          Rewards
        </button>
      </div>

      <div className="tournament-content">
        {activeTab === 'challenges' && (
          <div className="challenges-section">
            <div className="challenges-list">
              {challenges.map((challenge, index) => {
                const progressPercent = calculateProgress(challenge.progress, challenge.total);
                
                return (
                  <div key={challenge.id} className={`tournament-challenge-card ${challenge.status}`}>
                    <div className="challenge-number">{index + 1}</div>
                    
                    <div className="challenge-main-content">
                      <div className="challenge-header-row">
                        <h3 className="challenge-title">{challenge.title}</h3>
                        <div className="challenge-points-badge">
                          <span className="points-number">{challenge.points}</span>
                          <span className="points-text">pts</span>
                        </div>
                      </div>

                      <div className="challenge-progress-section">
                        <div className="progress-details">
                          <span className="progress-text">
                            {challenge.progress} / {challenge.total}
                          </span>
                          <span className="progress-percent-text">
                            {Math.round(progressPercent)}%
                          </span>
                        </div>
                        <div className="challenge-progress-bar">
                          <div 
                            className="challenge-progress-fill"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      {challenge.status === 'completed' && (
                        <div className="completion-badge">
                          <span className="completion-icon">✓</span>
                          Completed on {new Date(challenge.completedDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bonus-challenge-card">
              <div className="bonus-header">
                <span className="bonus-icon">⚡</span>
                <h3>Bonus Challenge</h3>
              </div>
              <p className="bonus-title">{bonusChallenge.title}</p>
              <div className="bonus-info">
                <span className="bonus-points">+{bonusChallenge.points} points</span>
                <span className={`bonus-status ${bonusChallenge.status}`}>
                  {bonusChallenge.status === 'expired' ? '❌ Expired' : `⏰ Deadline: ${bonusChallenge.deadline}`}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="leaderboard-section">
            <div className="leaderboard-header">
              <h2>Live Rankings</h2>
              <div className="live-indicator">
                <span className="live-dot"></span>
                <span>Live Updates</span>
              </div>
            </div>

            <div className="leaderboard-table">
              <div className="leaderboard-table-header">
                <span className="col-rank">Rank</span>
                <span className="col-user">User</span>
                <span className="col-challenges">Completed</span>
                <span className="col-points">Points</span>
              </div>

              <div className="leaderboard-body">
                {leaderboard.map(user => (
                  <div 
                    key={user.rank} 
                    className={`leaderboard-row ${getRankClass(user.rank)} ${user.isCurrentUser ? 'current-user' : ''}`}
                  >
                    <div className="col-rank">
                      <span className="rank-number">{user.rank}</span>
                      {user.badge && <span className="badge-emoji">{getBadgeEmoji(user.badge)}</span>}
                    </div>
                    
                    <div className="col-user">
                      <span className="user-avatar">{user.avatar}</span>
                      <span className="username">
                        {user.username}
                        {user.isCurrentUser && <span className="you-tag">You</span>}
                      </span>
                    </div>
                    
                    <div className="col-challenges">
                      <span className="challenges-count">{user.completedChallenges}/5</span>
                    </div>
                    
                    <div className="col-points">
                      <span className="points-count">{user.points}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="leaderboard-footer">
              <p>Rankings update in real-time as participants complete challenges</p>
            </div>
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="rewards-section">
            <div className="rewards-grid">
              <div className="reward-card gold">
                <div className="reward-rank">
                  <span className="rank-medal">🥇</span>
                  <h3>1st Place</h3>
                </div>
                <ul className="reward-list">
                  <li><span className="reward-icon">⭐</span> 500 Bonus Points</li>
                  <li><span className="reward-icon">🏆</span> Gold Trophy Badge</li>
                  <li><span className="reward-icon">✨</span> Featured Profile (1 month)</li>
                  <li><span className="reward-icon">👑</span> Tournament Champion Title</li>
                </ul>
              </div>

              <div className="reward-card silver">
                <div className="reward-rank">
                  <span className="rank-medal">🥈</span>
                  <h3>2nd Place</h3>
                </div>
                <ul className="reward-list">
                  <li><span className="reward-icon">⭐</span> 300 Bonus Points</li>
                  <li><span className="reward-icon">🏆</span> Silver Trophy Badge</li>
                  <li><span className="reward-icon">✨</span> Featured Profile (2 weeks)</li>
                </ul>
              </div>

              <div className="reward-card bronze">
                <div className="reward-rank">
                  <span className="rank-medal">🥉</span>
                  <h3>3rd Place</h3>
                </div>
                <ul className="reward-list">
                  <li><span className="reward-icon">⭐</span> 150 Bonus Points</li>
                  <li><span className="reward-icon">🏆</span> Bronze Trophy Badge</li>
                  <li><span className="reward-icon">✨</span> Featured Profile (1 week)</li>
                </ul>
              </div>

              <div className="reward-card participant">
                <div className="reward-rank">
                  <span className="rank-medal">🌟</span>
                  <h3>Top 10</h3>
                </div>
                <ul className="reward-list">
                  <li><span className="reward-icon">⭐</span> 50 Bonus Points</li>
                  <li><span className="reward-icon">🏅</span> Participant Badge</li>
                  <li><span className="reward-icon">🎖️</span> Tournament Veteran Tag</li>
                </ul>
              </div>
            </div>

            <div className="rewards-info">
              <h3>How Rewards Work</h3>
              <p>Complete tournament challenges to earn points and climb the leaderboard. Rewards are distributed automatically at the end of each month based on final rankings. All participants who complete at least one challenge receive a participation badge!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyTournament;