import React from 'react';
import './LeaderBoard.css';

const LeaderBoard = () => {
  const topUsers = [
    { id: 1, rank: 1, username: 'plant_master', avatar: '/g.png', points: 2500, badge: '🥇' },
    { id: 2, rank: 2, username: 'garden_guru', avatar: '/m.png', points: 2300, badge: '🥈' },
    { id: 3, rank: 3, username: 'green_thumb', avatar: '/g1.jpg', points: 2100, badge: '🥉' },
    { id: 4, rank: 4, username: 'plant_lover', avatar: '/g2.jpg', points: 1800 },
    { id: 5, rank: 5, username: 'succulent_fan', avatar: '/g3.jpg', points: 1600 },
    { id: 6, rank: 6, username: 'veggie_pro', avatar: '/boy.png', points: 1400 },
    { id: 7, rank: 7, username: 'flower_power', avatar: '/girl.png', points: 1200 },
  ];

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h3>🏆 Top Growers</h3>
      </div>
      <div className="leaderboard-list">
        {topUsers.map((user) => (
          <div key={user.id} className="leaderboard-item">
            <div className="rank-badge">
              {user.badge || `#${user.rank}`}
            </div>
            <img src={user.avatar} alt={user.username} className="leaderboard-avatar" />
            <div className="leaderboard-info">
              <div className="leaderboard-username">{user.username}</div>
              <div className="leaderboard-points">{user.points.toLocaleString()} pts</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderBoard;
