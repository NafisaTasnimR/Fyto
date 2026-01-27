import React, { useState } from 'react';
import Header from '../Shared/Header';
import DailyChallenge from './DailyChallenge';
import MonthlyTournament from './MonthlyTournament';
import ExtraChallenges from './ExtraChallenges';
import './Challenges.css';

const Challenges = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(true);

  // Calendar component for daily challenges
  const CalendarView = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0)); // January 2026

    const getDaysInMonth = (date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();

      return { daysInMonth, startingDayOfWeek, year, month };
    };

    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);

    // Mock completed challenges (days with checkmarks)
    const completedDays = [1, 3, 4]; // January 1st, 3rd, 4th completed

    const handleDateClick = (day) => {
      const clickedDate = new Date(year, month, day);
      const dateString = clickedDate.toISOString().split('T')[0];
      setSelectedDate(dateString);
      setShowCalendar(false);
    };

    const handlePrevMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const handleNextMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const today = new Date();
    const isToday = (day) => {
      return day === today.getDate() && 
             month === today.getMonth() && 
             year === today.getFullYear();
    };

    return (
      <div className="calendar-container">
        <div className="calendar-header">
          <div className="current-date-display">
            <span className="day-name">{dayNames[today.getDay()]}</span>
            <span className="day-number">{today.getDate()}</span>
          </div>
          <div className="month-year-display">
            <span className="month-name">{monthNames[month]}</span>
            <span className="year-number">{year}</span>
          </div>
        </div>

        <div className="calendar-controls">
          <button className="year-selector">{year} ▼</button>
          <div className="month-navigation">
            <button className="nav-arrow" onClick={handlePrevMonth}>◀</button>
            <span className="current-month">{monthNames[month]} ▼</span>
            <button className="nav-arrow" onClick={handleNextMonth}>▶</button>
          </div>
          <button className="start-day-selector">Start Day ▼</button>
          <button className="today-button">Today</button>
        </div>

        <div className="calendar-grid">
          <div className="calendar-weekdays">
            {dayNames.map(day => (
              <div key={day} className="weekday-label">{day}</div>
            ))}
          </div>

          <div className="calendar-days">
            {[...Array(startingDayOfWeek)].map((_, i) => (
              <div key={`empty-${i}`} className="calendar-day empty"></div>
            ))}

            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const isCompleted = completedDays.includes(day);
              const isTodayDate = isToday(day);

              return (
                <div
                  key={day}
                  className={`calendar-day ${isTodayDate ? 'today' : ''} ${isCompleted ? 'completed' : ''}`}
                  onClick={() => handleDateClick(day)}
                >
                  <span className="day-number">{day}</span>
                  {isCompleted && <span className="checkmark">✓</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="challenges-page">
      <Header />
      
      <div className="challenges-content">
        <div className="challenges-tabs">
          <button 
            className={`challenge-tab ${activeTab === 'daily' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('daily');
              setShowCalendar(true);
              setSelectedDate(null);
            }}
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
          {activeTab === 'daily' && (
            <>
              {showCalendar ? (
                <CalendarView />
              ) : (
                <div className="daily-challenge-wrapper">
                  <button 
                    className="back-to-calendar"
                    onClick={() => {
                      setShowCalendar(true);
                      setSelectedDate(null);
                    }}
                  >
                    ← Back to Calendar
                  </button>
                  <DailyChallenge selectedDate={selectedDate} />
                </div>
              )}
            </>
          )}

          {activeTab === 'monthly' && <MonthlyTournament />}
          
          {activeTab === 'extra' && <ExtraChallenges />}
        </div>
      </div>
    </div>
  );
};

export default Challenges;