import { useState } from 'react'
import '../styles/StreakCalendar.css'

function StreakCalendar({ studiedDays = [], streak = 0, dayStats = {} }) {
  const [selectedDay, setSelectedDay] = useState(null)
  const today = new Date()

  const days = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(today.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
    const dayNum = date.getDate()
    const month = date.toLocaleDateString('en-US', { month: 'short' })
    const isToday = i === 0
    const studied = studiedDays.includes(dateStr)
    const stats = dayStats[dateStr] ?? null

    days.push({ dateStr, dayName, dayNum, month, isToday, studied, stats })
  }

  return (
    <div className="streak-calendar">
      <div className="sc-header">
        <span className="sc-title">📅 This Week</span>
        <span className="sc-streak">🔥 {streak} day streak</span>
      </div>

      <div className="sc-week">
        {days.map((day) => (
          <div
            key={day.dateStr}
            className={`sc-day ${day.studied ? 'studied' : ''} ${day.isToday ? 'today' : ''} ${selectedDay?.dateStr === day.dateStr ? 'selected' : ''}`}
            onClick={() => setSelectedDay(selectedDay?.dateStr === day.dateStr ? null : day)}
          >
            <span className="sc-day-name">{day.dayName}</span>
            <span className="sc-day-num">{day.dayNum}</span>
            <span className="sc-day-month">{day.month}</span>
            {day.studied && <span className="sc-dot">●</span>}
          </div>
        ))}
      </div>

      {selectedDay && (
        <div className="sc-popup">
          <div className="sc-popup-header">
            <strong>{selectedDay.dayName}, {selectedDay.month} {selectedDay.dayNum}</strong>
            <button className="sc-popup-close" onClick={() => setSelectedDay(null)}>✕</button>
          </div>
          {selectedDay.studied && selectedDay.stats ? (
            <div className="sc-popup-stats">
              <div className="sc-stat">
                <span>⚡</span>
                <div>
                  <strong>{selectedDay.stats.xp ?? 0} XP</strong>
                  <span>earned</span>
                </div>
              </div>
              <div className="sc-stat">
                <span>✅</span>
                <div>
                  <strong>{selectedDay.stats.solved ?? 0}</strong>
                  <span>questions solved</span>
                </div>
              </div>
              <div className="sc-stat">
                <span>⚔️</span>
                <div>
                  <strong>{selectedDay.stats.duels ?? 0}</strong>
                  <span>duels played</span>
                </div>
              </div>
              <div className="sc-stat">
                <span>📚</span>
                <div>
                  <strong>{selectedDay.stats.studyTime ?? 0}</strong>
                  <span>questions attempted</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="sc-popup-empty">
              {selectedDay.isToday ? '📖 Study today to log your stats!' : '😴 No activity this day'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default StreakCalendar