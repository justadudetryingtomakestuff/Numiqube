import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'
import '../styles/Settings.css'

function Settings() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { profile, updateProfile } = useProfile(user)

  return (
    <div className="settings">
      <div className="container">

        <div className="settings-header">
          <button className="btn-secondary" onClick={() => navigate('/dashboard')}>← Back</button>
          <h2 className="settings-title">⚙️ Settings</h2>
        </div>

        {/* Profile Section */}
        <p className="section-title">Profile</p>
        <div className="setting-row">
          <div>
            <div className="setting-label">Name</div>
            <div className="setting-sub">{user?.displayName ?? 'Not set'}</div>
          </div>
        </div>
        <div className="setting-row">
          <div>
            <div className="setting-label">Email</div>
            <div className="setting-sub">{user?.email ?? 'Not set'}</div>
          
          <div className="setting-row">
  <div>
    <div className="setting-label">Username</div>
    <div className="setting-sub">
      {profile?.username ?? 'Not set'} · {(() => {
        const year = new Date().getFullYear()
        const changes = profile?.usernameChangeYear === year ? (profile?.usernameChanges ?? 0) : 0
        return `${3 - changes} changes remaining this year`
      })()}
    </div>
  </div>
  <button className="btn-secondary" onClick={() => navigate('/set-username')}>
    Change
  </button>
</div>
          
          </div>

          
        </div>

        {/* Preferences */}
        <p className="section-title">Preferences</p>
        <div className="setting-row">
          <div>
            <div className="setting-label">🔊 Sound Effects</div>
            <div className="setting-sub">Play sounds on correct/wrong answers</div>
          </div>
          <button
            className={`toggle ${profile?.soundOn ? 'on' : ''}`}
            onClick={() => updateProfile({ soundOn: !profile?.soundOn })}
          />
        </div>
        <div className="setting-row">
          <div>
            <div className="setting-label">🌙 Dark Mode</div>
            <div className="setting-sub">Currently always on — light mode coming soon</div>
          </div>
          <button className="toggle on" disabled />
        </div>

        {/* Stats */}
        <p className="section-title">Your Stats</p>
        <div className="setting-row">
          <div className="setting-label">Total XP</div>
          <div className="setting-value">⚡ {profile?.xp ?? 0}</div>
        </div>
        <div className="setting-row">
          <div className="setting-label">Questions Solved</div>
          <div className="setting-value">✅ {profile?.solved ?? 0}</div>
        </div>
        <div className="setting-row">
          <div className="setting-label">Current Streak</div>
          <div className="setting-value">🔥 {profile?.streak ?? 0} days</div>
        </div>

        {/* Account */}
        <p className="section-title">Account</p>
        <button className="danger-btn" onClick={() => { logout(); navigate('/') }}>
          Sign Out 👋
        </button>

      </div>
    </div>
  )
}

export default Settings