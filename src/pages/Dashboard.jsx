import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import '../styles/Dashboard.css'
import { useProfile } from '../hooks/useProfile'
import StreakCalendar from '../components/StreakCalendar'

function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { profile } = useProfile(user)


  return (
    <div className="dashboard">
      <div className="container">

        {/* Nav */}
        <div className="dash-nav">
          <span className="nav-logo">Numiqube 🧊</span>
          <div className="nav-right">
            <button className="nav-icon-btn" onClick={() => navigate('/')}>🏠</button>
            {user && (
              <img src={user.photoURL} alt="avatar" className="nav-avatar" />

              
            )}
            <button className="nav-icon-btn" onClick={() => navigate('/settings')}>⚙️</button>
     
          </div>
        </div>

        {/* Welcome */}
        {user && (
          <div className="welcome-banner">
            <span>👋 Welcome back, <strong>{user.displayName}</strong>!</span>
          </div>
        )}

        {/* Stats */}
        <div className="dash-grid">
          <div className="dash-card">
            <span className="dc-icon">⚡</span>
           <div className="dc-num">{profile?.xp ?? 0}</div>
            <div className="dc-label">XP</div>
          </div>
          <div className="dash-card">
            <span className="dc-icon">🔥</span>
        <div className="dc-num">{profile?.streak ?? 0}</div>
            <div className="dc-label">Streak</div>
          </div>
          <div className="dash-card">
            <span className="dc-icon">🏆</span>
         <div className="dc-num">{profile?.rank ?? '—'}</div>
            <div className="dc-label">Rank</div>
          </div>
          <div className="dash-card">
            <span className="dc-icon">✅</span>
        <div className="dc-num">{profile?.solved ?? 0}</div>
            <div className="dc-label">Solved</div>
          </div>
        </div>

        {/* Quick Actions */}
    <StreakCalendar
  studiedDays={profile?.studiedDays ?? []}
  streak={profile?.streak ?? 0}
  dayStats={profile?.dayStats ?? {}}
/>

        <p className="section-title">Quick Actions</p>
       <div className="quick-grid">
  <button className="quick-btn" onClick={() => navigate('/study')}>
    <span>📚</span>
    <strong>Study</strong>
    <span>Practice questions</span>
  </button>
  <button className="quick-btn" onClick={() => navigate('/duel')}>
    <span>⚔️</span>
    <strong>Duel</strong>
    <span>Challenge someone</span>
  </button>
  <button className="quick-btn" onClick={() => navigate('/leaderboard')}>
    <span>🏅</span>
    <strong>Leaderboard</strong>
    <span>Top players</span>
  </button>
  <button className="quick-btn" onClick={() => navigate('/friends')}>
    <span>👥</span>
    <strong>Friends</strong>
    <span>Add & challenge</span>
  </button>
  <button className="quick-btn" onClick={() => navigate('/profile')}>
    <span>👤</span>
    <strong>Profile</strong>
    <span>Your stats</span>
  </button>
  <button className="quick-btn" onClick={() => navigate('/settings')}>
    <span>⚙️</span>
    <strong>Settings</strong>
    <span>Preferences</span>
  </button>
</div>

      </div>
    </div>
  )
}

export default Dashboard