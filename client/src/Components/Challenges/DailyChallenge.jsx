import React, { useState, useEffect } from 'react';
import './DailyChallenge.css';

const DailyChallenge = ({ selectedDate }) => {
  const [challenge, setChallenge] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  // Streak calendar data - streak only counts consecutive days from today backwards
  const [streakData, setStreakData] = useState({
    currentStreak: 4, // Only consecutive days from today (27) backwards: 24,25,26,27
    completedDates: ['2026-01-24', '2026-01-25', '2026-01-26', '2026-01-27', '2026-01-01', '2026-01-03', '2026-01-15'] // Can have random completed dates
  });

  // Calculate streak - only consecutive days from today backwards
  const calculateStreak = (completedDates) => {
    const today = new Date('2026-01-27'); // Current date
    let streak = 0;
    let checkDate = new Date(today);
    
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (completedDates.includes(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1); // Go back one day
      } else {
        break; // Streak broken
      }
    }
    
    return streak;
  };

  // Sample challenges with MCQ format - in production, fetch from backend
  const challenges = {
    '2026-01-01': {
      type: 'riddle',
      question: 'I sleep by day and bloom by night, my flowers are white and fragrant bright. What am I?',
      options: [
        'Night Blooming Jasmine',
        'Morning Glory',
        'Moonflower',
        'Evening Primrose'
      ],
      correctAnswer: 0,
      points: 10,
      image: null
    },
    '2026-01-02': {
      type: 'image',
      question: 'What plant species does this flower belong to?',
      options: [
        'Pothos',
        'Monstera Deliciosa',
        'Philodendron',
        'Anthurium'
      ],
      correctAnswer: 1,
      points: 10,
      image: '/challenge-images/jan-02.jpg' // Add your challenge image here
    },
    '2026-01-27': {
      type: 'image',
      question: 'What plant species does this flower belong to?',
      options: [
        'Hibiscus',
        'Rose',
        'Plumeria',
        'Bougainvillea'
      ],
      correctAnswer: 0,
      points: 10,
      image: '/challenge-images/jan-27.jpg' // Add your challenge image here
    }
  };

  const [viewingDate, setViewingDate] = useState(selectedDate || '2026-01-27');

  const handleDateClick = (dateStr) => {
    setViewingDate(dateStr);
    setIsSubmitted(false);
    setSelectedOption(null);
    setResult(null);
  };

  const handleCloseModal = () => {
    setIsSubmitted(false);
    setSelectedOption(null);
    setResult(null);
  };

  useEffect(() => {
    const dateKey = viewingDate;
    const todayChallenge = challenges[dateKey] || challenges['2026-01-27'];
    setChallenge(todayChallenge);
    setIsSubmitted(false);
    setSelectedOption(null);
    setResult(null);
  }, [viewingDate]);

  const handleSubmit = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === challenge.correctAnswer;

    setIsSubmitted(true);
    setResult({
      isCorrect,
      correctAnswer: challenge.options[challenge.correctAnswer],
      pointsEarned: isCorrect ? challenge.points : 0
    });
  };

  // Mini calendar component
  const StreakCalendar = ({ onDateClick }) => {
    const currentDate = new Date(2026, 0); // January 2026
    const daysInMonth = new Date(2026, 1, 0).getDate();
    const firstDay = new Date(2026, 0, 1).getDay();
    
    const actualStreak = calculateStreak(streakData.completedDates);

    const handleDateClick = (day) => {
      const dateStr = `2026-01-${day.toString().padStart(2, '0')}`;
      if (onDateClick) {
        onDateClick(dateStr);
      }
    };

    return (
      <div className="streak-calendar">
        <div className="streak-header">
          <span className="streak-label">STREAK</span>
          <div className="streak-count-container">
            <span className="streak-count">{actualStreak} days</span>
            <img src="/streak-icon.png" alt="Streak" className="streak-icon" />
          </div>
        </div>
        
        <div className="mini-calendar">
          <div className="calendar-weekdays-mini">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="weekday-mini">{day}</div>
            ))}
          </div>
          
          <div className="calendar-days-mini">
            {[...Array(firstDay)].map((_, i) => (
              <div key={`empty-${i}`} className="day-mini empty"></div>
            ))}
            
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const dateStr = `2026-01-${day.toString().padStart(2, '0')}`;
              const isCompleted = streakData.completedDates.includes(dateStr);
              
              return (
                <div 
                  key={day} 
                  className={`day-mini ${isCompleted ? 'completed' : ''} ${isCompleted ? 'clickable' : ''}`}
                  onClick={() => isCompleted && handleDateClick(day)}
                >
                  {isCompleted ? '✓' : day}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  if (!challenge) {
    return <div className="daily-challenge-container">Loading challenge...</div>;
  }

  return (
    <div className="daily-challenge-container">
      <div className="challenge-layout">
        {/* Main Challenge Area */}
        <div className="challenge-main">
          <div className="challenge-type-badge">
            <span className={`type-pill ${challenge.type}`}>
              <img 
                src={challenge.type === 'riddle' ? '/riddle.png' : '/imageChallenge-icon.png'} 
                alt={challenge.type}
                className="challenge-type-icon"
              />
              {challenge.type === 'riddle' ? 'Riddle Challenge' : 'Image Challenge'}
            </span>
          </div>

          {challenge.type === 'image' && challenge.image && (
            <div className="challenge-image-container">
              <img src={challenge.image} alt="Plant identification challenge" />
              <div className="image-label">Plant identification challenge</div>
            </div>
          )}

          <div className="question-section">
            <div className="question-box-container">
              <div className="question-box">
                <p className="question-text">{challenge.question}</p>
              </div>
              <img 
                src="/thinking.png" 
                alt="Thinking cat" 
                className="question-cat-mascot"
              />
            </div>
          </div>

          {!isSubmitted ? (
            <>
              <div className="answer-section">
                <label className="answer-label">Your Answer:</label>
                
                <div className="options-list">
                  {challenge.options.map((option, index) => (
                    <button
                      key={index}
                      className={`option-button ${selectedOption === index ? 'selected' : ''}`}
                      onClick={() => setSelectedOption(index)}
                    >
                      <span className="option-radio">
                        {selectedOption === index && <span className="radio-dot"></span>}
                      </span>
                      <span className="option-text">{option}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="action-buttons">
                <button 
                  onClick={handleSubmit} 
                  className="submit-button-capsule"
                  disabled={selectedOption === null}
                >
                  Submit Answer
                </button>
              </div>
            </>
          ) : null}

          {/* Result Modal */}
          {isSubmitted && (
            <div className="result-modal-overlay">
              <div className="result-modal">
                <button 
                  className="result-modal-close-button"
                  onClick={handleCloseModal}
                  aria-label="Close modal"
                >
                  ×
                </button>
                
                <img 
                  src={result.isCorrect ? '/feedback.png' : '/wrong-answer.png'} 
                  alt={result.isCorrect ? 'Correct' : 'Incorrect'}
                  className="result-modal-icon"
                />
                
                <h3 className="result-modal-title">
                  {result.isCorrect ? 'Correct Answer!' : 'Wrong Answer'}
                </h3>
                
                <p className="result-modal-message">
                  {result.isCorrect 
                    ? `Great job! You've earned ${result.pointsEarned} points!`
                    : `The correct answer is: ${result.correctAnswer}`
                  }
                </p>
                
                {result.isCorrect && (
                  <div className="result-modal-points">
                    +{result.pointsEarned} points
                  </div>
                )}

               
              </div>
            </div>
          )}
        </div>

        {/* Sidebar with mini calendar */}
        <div className="challenge-sidebar">
          <StreakCalendar onDateClick={handleDateClick} />
        </div>
      </div>
    </div>
  );
};

export default DailyChallenge;