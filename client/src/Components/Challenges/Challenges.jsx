import React from 'react';
import Header from '../Shared/Header';
import DailyChallenge from './DailyChallenge';
import MonthlyTournament from './MonthlyTournament';
import ExtraChallenges from './ExtraChallenges';
import './Challenges.css';

const Challenges = () => {
  const [activeTab, setActiveTab] = React.useState('daily');

  return (
    <div className="challenges-page">
      <Header />
      
      <div className="challenges-content">
        <div className="challenges-tabs">
          <button 
            className={`challenge-tab ${activeTab === 'daily' ? 'active' : ''}`}
            onClick={() => setActiveTab('daily')}
          >
            Daily
          </button>
          <button 
            className={`challenge-tab ${activeTab === 'monthly' ? 'active' : ''}`}
            onClick={() => setActiveTab('monthly')}
          >
            Monthly
          </button>
          <button 
            className={`challenge-tab ${activeTab === 'extra' ? 'active' : ''}`}
            onClick={() => setActiveTab('extra')}
          >
            Extra Challenges
          </button>
        </div>

        <div className="challenge-content-area">
          {activeTab === 'daily' && <DailyChallenge />}
          {activeTab === 'monthly' && <MonthlyTournament />}
          {activeTab === 'extra' && <ExtraChallenges />}
        </div>
      </div>
    </div>
  );
};

export default Challenges;