import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DailyChallenge.css';

const API = process.env.REACT_APP_API_URL;

const DailyChallenge = () => {
  const [quiz, setQuiz] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alreadyParticipated, setAlreadyParticipated] = useState(false);
  const [participationHistory, setParticipationHistory] = useState(null);
  const [streakData, setStreakData] = useState({ currentStreak: 0, completedDates: [] });
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch today's quiz
        const quizRes = await axios.get(`${API}/api/gamification/quiz/daily`, { headers });
        if (quizRes.data.success) {
          setQuiz(quizRes.data.quiz);
          setAlreadyParticipated(quizRes.data.alreadyParticipated);
          if (quizRes.data.alreadyParticipated && quizRes.data.participationData) {
            const pd = quizRes.data.participationData;
            setParticipationHistory({
              isCorrect: pd.wasCorrect,
              pointsEarned: pd.pointsEarned,
              participatedAt: pd.participatedAt
            });
          }
        }

        // Fetch gamification stats for streak
        const statsRes = await axios.get(`${API}/api/gamification/stats`, { headers });
        if (statsRes.data.success) {
          const streaks = statsRes.data.data.streaks;
          setStreakData(prev => ({ ...prev, currentStreak: streaks.currentStreak || 0 }));
        }

        // Fetch daily participation history for calendar
        const histRes = await axios.get(
          `${API}/api/gamification/history?challengeType=daily&limit=100`,
          { headers }
        );
        if (histRes.data.success) {
          const participations = histRes.data.data.participations || [];
          const dates = participations.map(p =>
            new Date(p.participatedAt).toISOString().split('T')[0]
          );
          setStreakData(prev => ({ ...prev, completedDates: dates }));
        }
      } catch (err) {
        console.error('Error loading daily challenge:', err);
        setError('Failed to load today\'s challenge. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleCloseModal = () => {
    setIsSubmitted(false);
    setSelectedOption(null);
    setResult(null);
  };

  const determineIsCorrect = (selectedOptionText) => {
    if (!quiz) return false;
    if (quiz.type === 'image-quiz' && quiz.plantName) {
      // Compare selected option text against plantName (ignore parenthetical notes)
      const basePlantName = quiz.plantName.split('(')[0].trim().toLowerCase();
      const optionText = selectedOptionText.toLowerCase();
      return optionText.includes(basePlantName) || basePlantName.includes(optionText);
    }
    // For riddle-quiz we cannot determine correctness without correctAnswer
    return false;
  };

  const handleSubmit = async () => {
    if (selectedOption === null || submitting || alreadyParticipated) return;
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const selectedOptionText = quiz.options[selectedOption];
      const isCorrect = determineIsCorrect(selectedOptionText);

      const res = await axios.post(
        `${API}/api/gamification/daily`,
        {
          challengeId: quiz.quizId,
          challengeSubType: quiz.type || 'riddle-quiz',
          isCorrect,
          metadata: { selectedAnswer: selectedOptionText }
        },
        { headers }
      );

      if (res.data.success) {
        const data = res.data.data;
        setIsSubmitted(true);
        setAlreadyParticipated(true);
        setResult({
          isCorrect: data.pointsEarned > 0,
          pointsEarned: data.pointsEarned,
          serverMessage: res.data.message
        });
        setStreakData(prev => ({
          ...prev,
          currentStreak: data.currentStreak,
          completedDates: [
            ...prev.completedDates,
            new Date().toISOString().split('T')[0]
          ]
        }));
      }
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.message?.includes('already participated')) {
        setAlreadyParticipated(true);
      } else {
        console.error('Submit error:', err);
        setError('Failed to submit answer. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };





  const StreakCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    return (
      <div className="streak-calendar">
        <div className="streak-header">
          <span className="streak-label">STREAK</span>
          <div className="streak-count-container">
            <span className="streak-count">{streakData.currentStreak} days</span>
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
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isCompleted = streakData.completedDates.includes(dateStr);
              
              return (
                <div 
                  key={day} 
                  className={`day-mini ${isCompleted ? 'completed' : ''}`}
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

  const quizType = quiz?.type || 'riddle-quiz';
  const isRiddle = quizType === 'riddle-quiz';
  const questionText = isRiddle ? (quiz?.riddle || quiz?.question) : quiz?.question;
  const imageUrl = !isRiddle ? (quiz?.imageUrl || quiz?.image) : null;

  if (loading) {
    return <div className="daily-challenge-container">Loading today's challenge...</div>;
  }

  if (error) {
    return <div className="daily-challenge-container" style={{ color: '#e74c3c', padding: '2rem' }}>{error}</div>;
  }

  if (!quiz) {
    return <div className="daily-challenge-container">No challenge available today.</div>;
  }

  return (
    <div className="daily-challenge-container">
      <div className="challenge-layout">
        
        <div className="challenge-main">
          <div className="challenge-type-badge">
            <span className={`type-pill ${quizType}`}>
              <img 
                src={isRiddle ? '/riddle.png' : '/imageChallenge-icon.png'} 
                alt={quizType}
                className="challenge-type-icon"
              />
              {isRiddle ? 'Riddle Challenge' : 'Image Challenge'}
            </span>
          </div>

          {!isRiddle && imageUrl && (
            <div className="challenge-image-container">
              <img
                src={imageUrl}
                alt="Plant identification challenge"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://static.inaturalist.org/photos/10534833/medium.jpeg';
                }}
              />
              <div className="image-label">Plant identification challenge</div>
            </div>
          )}

          <div className="question-section">
            <div className="question-box-container">
              <div className="question-box">
                <p className="question-text">{questionText}</p>
              </div>
              <img 
                src="/thinking.png" 
                alt="Thinking cat" 
                className="question-cat-mascot"
              />
            </div>
          </div>

          {alreadyParticipated && !isSubmitted && (
            <div className="already-participated-banner">
              <img src="/feedback.png" alt="done" className="already-participated-icon" />
              <div className="already-participated-text">
                <h3>You've already completed today's challenge!</h3>
                {participationHistory && (
                  <p>
                    {participationHistory.isCorrect
                      ? `Great job! You earned ${participationHistory.pointsEarned} points.`
                      : 'Better luck tomorrow!'}
                  </p>
                )}
                <p className="already-participated-sub">Come back tomorrow for a new challenge.</p>
              </div>
            </div>
          )}

          {!alreadyParticipated && !isSubmitted ? (
            <>
              <div className="answer-section">
                <label className="answer-label">Your Answer:</label>
                
                <div className="options-list">
                  {(quiz.options || []).map((option, index) => (
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
                  disabled={selectedOption === null || submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Answer'}
                </button>
              </div>
            </>
          ) : null}

          {isSubmitted && result && (
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
                  {result.serverMessage || (result.isCorrect 
                    ? `Great job! You've earned ${result.pointsEarned} points!`
                    : `Keep trying! Your streak continues.`
                  )}
                </p>
                
                {result.isCorrect && result.pointsEarned > 0 && (
                  <div className="result-modal-points">
                    +{result.pointsEarned} points
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="challenge-sidebar">
          <StreakCalendar />
        </div>
      </div>
    </div>
  );
};

export default DailyChallenge;
