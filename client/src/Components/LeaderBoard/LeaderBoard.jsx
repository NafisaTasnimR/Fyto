import React, { useState } from 'react';
import './LeaderBoard.css';

const LeaderBoard = () => {
  const [activeTab, setActiveTab] = useState('daily');

  const dailyTopUsers = [
    { id: 1, rank: 1, username: 'plant_master', avatar: '/g.png', streak: 45 },
    { id: 2, rank: 2, username: 'garden_guru', avatar: '/m.png', streak: 38 },
    { id: 3, rank: 3, username: 'green_thumb', avatar: '/g1.jpg', streak: 32 },
    { id: 4, rank: 4, username: 'plant_lover', avatar: '/g2.jpg', streak: 28 },
    { id: 5, rank: 5, username: 'succulent_fan', avatar: '/g3.jpg', streak: 24 },
    { id: 6, rank: 6, username: 'veggie_pro', avatar: '/boy.png', streak: 21 },
    { id: 7, rank: 7, username: 'flower_power', avatar: '/girl.png', streak: 18 },
  ];

  const monthlyTopUsers = [
    { id: 1, rank: 1, username: 'garden_guru', avatar: '/m.png', points: 12500 },
    { id: 2, rank: 2, username: 'plant_master', avatar: '/g.png', points: 11800 },
    { id: 3, rank: 3, username: 'veggie_pro', avatar: '/boy.png', points: 10900 },
    { id: 4, rank: 4, username: 'green_thumb', avatar: '/g1.jpg', points: 9800 },
    { id: 5, rank: 5, username: 'flower_power', avatar: '/girl.png', points: 8900 },
    { id: 6, rank: 6, username: 'succulent_fan', avatar: '/g3.jpg', points: 8200 },
    { id: 7, rank: 7, username: 'plant_lover', avatar: '/g2.jpg', points: 7600 },
  ];

  const currentUsers = activeTab === 'daily' ? dailyTopUsers : monthlyTopUsers;
  const topThree = currentUsers.slice(0, 3);
  const restUsers = currentUsers.slice(3);

  return (
    <div className="leaderboard">
      <div className="leaderboard-title">
        <h2>LEADERBOARD</h2>
        <p className="subtitle">
          {activeTab === 'daily' ? 'DAILY STREAK' : 'MONTHLY CHALLENGES'}
        </p>
      </div>

      <div className="podium-container">
        <div className="podium-item second">
          <img src="/2nd.png" alt="2nd place" className="podium-medal-img" />
          <img src={topThree[1]?.avatar} alt={topThree[1]?.username} className="podium-avatar" />
          <div className="podium-name">{topThree[1]?.username}</div>
          <div className="podium-points">
            {activeTab === 'daily' ? topThree[1]?.streak : topThree[1]?.points}
          </div>
        </div>

        <div className="podium-item first">
          <img src="/1st.png" alt="1st place" className="podium-medal-img" />
          <img src={topThree[0]?.avatar} alt={topThree[0]?.username} className="podium-avatar" />
          <div className="podium-name">{topThree[0]?.username}</div>
          <div className="podium-points">
            {activeTab === 'daily' ? topThree[0]?.streak : topThree[0]?.points}
          </div>
        </div>

        <div className="podium-item third">
          <img src="/3rd.png" alt="3rd place" className="podium-medal-img" />
          <img src={topThree[2]?.avatar} alt={topThree[2]?.username} className="podium-avatar" />
          <div className="podium-name">{topThree[2]?.username}</div>
          <div className="podium-points">
            {activeTab === 'daily' ? topThree[2]?.streak : topThree[2]?.points}
          </div>
        </div>
      </div>

      <div className="leaderboard-tabs">
        <button
          className={`tab-button ${activeTab === 'daily' ? 'active' : ''}`}
          onClick={() => setActiveTab('daily')}
        >
          Daily
        </button>
        <button
          className={`tab-button ${activeTab === 'monthly' ? 'active' : ''}`}
          onClick={() => setActiveTab('monthly')}
        >
          Monthly
        </button>
      </div>

      <div className="leaderboard-list">
        {restUsers.map((user) => (
          <div key={user.id} className="leaderboard-item">
            <div className="rank-number">{user.rank}</div>
            <div className="user-avatar-wrapper">
              <img src={user.avatar} alt={user.username} className="user-avatar-img" />
            </div>
            <div className="user-info">
              <div className="user-name">{user.username}</div>
              <div className="user-points">
                {activeTab === 'daily' 
                  ? `${user.streak} days` 
                  : `${user.points} pts`}
              </div>
            </div>
            <img src="/medal.png" alt="medal" className="medal-icon" />
          </div>
        ))}
      </div>
    </div>
  );
};

const getAvatarColor = (rank) => {
  const colors = ['#48C9B0', '#9B59B6', '#E74C3C', '#3498DB', '#F39C12'];
  return colors[(rank - 4) % colors.length];
};

export default LeaderBoard;
