import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'
import '../styles/Profile.css'

function Profile() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { profile } = useProfile(user)

  const level = Math.floor((profile?.xp ?? 0) / 500) + 1
  const xpIntoLevel = (profile?.xp ?? 0) % 500
  const xpPercent = (xpIntoLevel / 500) * 100

  return (
    <div className="profile">
      <div className="container">

        <div className="profile-header">
          <button className="btn-secondary" onClick={() => navigate('/dashboard')}>← Back</button>
          <h2 className="profile-title">👤 Profile</h2>
        </div>

        {/* Avatar + Name */}
        <div className="profile-card">
          <div className="profile-avatar">
            {user?.photoURL
              ? <img src={user.photoURL} alt="avatar" />
              : <span>🧊</span>
            }
          </div>
          <h2 className="profile-name">{user?.displayName ?? 'Numiqube Player'}</h2>
          <p className="profile-email">{user?.email}</p>
          <div className="profile-rank">{profile?.rank ?? 'Beginner'}</div>
        </div>

        {/* Level Progress */}
        <div className="level-card">
          <div className="level-header">
            <span className="level-label">Level {level}</span>
            <span className="level-xp">{xpIntoLevel} / 500 XP</span>
          </div>
          <div className="level-bar-wrap">
            <div className="level-bar" style={{ width: `${xpPercent}%` }}></div>
          </div>
          <p className="level-sub">{500 - xpIntoLevel} XP until Level {level + 1}</p>
        </div>

        {/* Stats Grid */}
        <p className="section-title">Stats</p>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">⚡</span>
            <div className="stat-num">{profile?.xp ?? 0}</div>
            <div className="stat-label">Total XP</div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">✅</span>
            <div className="stat-num">{profile?.solved ?? 0}</div>
            <div className="stat-label">Solved</div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🔥</span>
            <div className="stat-num">{profile?.streak ?? 0}</div>
            <div className="stat-label">Streak</div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🏆</span>
            <div className="stat-num">{level}</div>
            <div className="stat-label">Level</div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Profile