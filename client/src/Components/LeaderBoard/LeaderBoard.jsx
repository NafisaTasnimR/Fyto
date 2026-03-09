import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LeaderBoard.css';
import { getProfilePic } from '../../utils/imageUtils';
import Loader from '../Shared/Loader';

const LeaderBoard = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const [dailyUsers, setDailyUsers] = useState([]);
  const [overallUsers, setOverallUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [dailyRes, overallRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/gamification/leaderboard?type=daily`, { headers }),
          axios.get(`${process.env.REACT_APP_API_URL}/api/gamification/leaderboard?type=total`, { headers }),
        ]);

        setDailyUsers(dailyRes.data?.data?.leaderboard || []);
        setOverallUsers(overallRes.data?.data?.leaderboard || []);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const currentUsers = activeTab === 'daily' ? dailyUsers : overallUsers;
  const topThree = currentUsers.slice(0, 3);
  const restUsers = currentUsers.slice(3);

  if (loading) {
    return (
      <div className="leaderboard">
        <Loader size="small" message="Loading..." />
      </div>
    );
  }

  return (
    <div className="leaderboard">
      <div className="leaderboard-title">
        <h2>LEADERBOARD</h2>
        <p className="subtitle">
          {activeTab === 'daily' ? 'DAILY STREAK' : 'OVERALL CHALLENGES'}
        </p>
      </div>

      <div className="podium-container">
        <div className="podium-item second">
          <img src="/2nd.png" alt="2nd place" className="podium-medal-img" />
          <img src={getProfilePic(topThree[1]?.profilePic)} alt={topThree[1]?.username} className="podium-avatar" />
          <div className="podium-name">{topThree[1]?.username || '-'}</div>
          <div className="podium-points">
            {activeTab === 'daily'
              ? (topThree[1]?.currentStreak ?? '-')
              : (topThree[1]?.score ?? '-')}
          </div>
        </div>

        <div className="podium-item first">
          <img src="/1st.png" alt="1st place" className="podium-medal-img" />
          <img src={getProfilePic(topThree[0]?.profilePic)} alt={topThree[0]?.username} className="podium-avatar" />
          <div className="podium-name">{topThree[0]?.username || '-'}</div>
          <div className="podium-points">
            {activeTab === 'daily'
              ? (topThree[0]?.currentStreak ?? '-')
              : (topThree[0]?.score ?? '-')}
          </div>
        </div>

        <div className="podium-item third">
          <img src="/3rd.png" alt="3rd place" className="podium-medal-img" />
          <img src={getProfilePic(topThree[2]?.profilePic)} alt={topThree[2]?.username} className="podium-avatar" />
          <div className="podium-name">{topThree[2]?.username || '-'}</div>
          <div className="podium-points">
            {activeTab === 'daily'
              ? (topThree[2]?.currentStreak ?? '-')
              : (topThree[2]?.score ?? '-')}
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
          className={`tab-button ${activeTab === 'overall' ? 'active' : ''}`}
          onClick={() => setActiveTab('overall')}
        >
          Overall
        </button>
      </div>

      <div className="leaderboard-list">
        {restUsers.length > 0 ? (
          restUsers.map((user) => (
            <div key={user.userId} className="leaderboard-item">
              <div className="rank-number">{user.rank}</div>
              <div className="user-avatar-wrapper">
                <img src={getProfilePic(user.profilePic)} alt={user.username} className="user-avatar-img" />
              </div>
              <div className="user-info">
                <div className="user-name">{user.username}</div>
                <div className="user-points">
                  {activeTab === 'daily'
                    ? `${user.currentStreak} days`
                    : `${user.score} pts`}
                </div>
              </div>
              <img src="/medal.png" alt="medal" className="medal-icon" />
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', padding: '0.5rem', color: '#888', fontSize: '0.85rem' }}>
            No data yet
          </p>
        )}
      </div>
    </div>
  );
};

export default LeaderBoard;
