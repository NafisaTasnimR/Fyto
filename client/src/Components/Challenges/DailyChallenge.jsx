import React, { useState, useEffect } from 'react';
import './DailyChallenge.css';

const DailyChallenge = ({ selectedDate }) => {
  const [challenge, setChallenge] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [showHint, setShowHint] = useState(false);

  // Sample challenges - in production, fetch from backend
  const challenges = {
    '2026-01-01': {
      type: 'riddle',
      question: 'I sleep by day and bloom by night, my flowers are white and fragrant bright. What am I?',
      hint: 'This flower is popular in tropical gardens and releases its strongest scent after sunset.',
      answer: ['night blooming jasmine', 'night jasmine', 'cestrum nocturnum'],
      points: 15,
      image: null
    },
    '2026-01-02': {
      type: 'image',
      question: 'Identify this plant from the close-up image of its leaves:',
      hint: 'This plant is known for its heart-shaped leaves and is a popular indoor plant.',
      answer: ['monstera', 'monstera deliciosa', 'swiss cheese plant'],
      points: 12,
      image: '/api/placeholder/400/300' // Replace with actual image URL
    },
    '2026-01-03': {
      type: 'riddle',
      question: 'My leaves can number three or more, touch me wrong and you\'ll be sore. What am I?',
      hint: 'Found commonly in forests and known for causing an itchy rash.',
      answer: ['poison ivy', 'toxicodendron radicans'],
      points: 15,
      image: null
    },
    '2026-01-26': {
      type: 'image',
      question: 'What plant species does this flower belong to?',
      hint: 'This vibrant flower is often used in leis and comes in many colors.',
      answer: ['hibiscus', 'hibiscus rosa-sinensis', 'rose of sharon'],
      points: 12,
      image: '/api/placeholder/400/300'
    }
  };

  useEffect(() => {
    // Load challenge for selected date
    const dateKey = selectedDate || '2026-01-26';
    const todayChallenge = challenges[dateKey] || challenges['2026-01-26'];
    setChallenge(todayChallenge);
    setIsSubmitted(false);
    setUserAnswer('');
    setResult(null);
    setShowHint(false);
  }, [selectedDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    const normalizedAnswer = userAnswer.toLowerCase().trim();
    const isCorrect = challenge.answer.some(ans => 
      normalizedAnswer.includes(ans.toLowerCase())
    );

    setIsSubmitted(true);
    setResult({
      isCorrect,
      correctAnswer: challenge.answer[0],
      pointsEarned: isCorrect ? challenge.points : 0
    });
  };

  const handleTryAgain = () => {
    setUserAnswer('');
    setIsSubmitted(false);
    setResult(null);
  };

  if (!challenge) {
    return <div className="daily-challenge-container">Loading challenge...</div>;
  }

  return (
    <div className="daily-challenge-container">
      <div className="challenge-header">
        <h2>Daily Plant Challenge</h2>
        <div className="challenge-date">
          {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }) : 'Today'}
        </div>
        <div className="challenge-points">
          <span className="points-badge">🌟 {challenge.points} Points</span>
        </div>
      </div>

      <div className="challenge-content">
        <div className="challenge-type-indicator">
          <span className={`type-badge ${challenge.type}`}>
            {challenge.type === 'riddle' ? '🧩 Riddle Challenge' : '📸 Image Challenge'}
          </span>
        </div>

        {challenge.type === 'image' && challenge.image && (
          <div className="challenge-image">
            <img src={challenge.image} alt="Plant identification challenge" />
          </div>
        )}

        <div className="challenge-question">
          <h2>{challenge.question}</h2>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="challenge-form">
            <div className="input-group">
              <label htmlFor="plant-answer">Your Answer:</label>
              <input
                type="text"
                id="plant-answer"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter plant name..."
                className="answer-input"
                autoComplete="off"
              />
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => setShowHint(!showHint)}
                className="hint-button"
              >
                {showHint ? '🙈 Hide Hint' : '💡 Need a Hint?'}
              </button>
              <button 
                type="submit" 
                className="submit-button"
                disabled={!userAnswer.trim()}
              >
                Submit Answer
              </button>
            </div>

            {showHint && (
              <div className="hint-box">
                <span className="hint-icon">💡</span>
                <p>{challenge.hint}</p>
              </div>
            )}
          </form>
        ) : (
          <div className={`result-container ${result.isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="result-icon">
              {result.isCorrect ? '🎉' : '😅'}
            </div>
            <h3 className="result-title">
              {result.isCorrect ? 'Correct!' : 'Not Quite Right'}
            </h3>
            <p className="result-message">
              {result.isCorrect 
                ? `Great job! You've earned ${result.pointsEarned} points!`
                : `The correct answer is: ${result.correctAnswer}`
              }
            </p>
            
            {result.isCorrect && (
              <div className="points-earned-animation">
                +{result.pointsEarned} Points! 🌟
              </div>
            )}

            <div className="result-actions">
              {!result.isCorrect && (
                <button onClick={handleTryAgain} className="try-again-button">
                  Try Again
                </button>
              )}
              <button onClick={() => window.history.back()} className="back-button">
                Back to Calendar
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="challenge-footer">
        <div className="challenge-stats">
          <div className="stat-item">
            <span className="stat-label">Completion Rate</span>
            <span className="stat-value">78%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Attempts Today</span>
            <span className="stat-value">1,234</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyChallenge;