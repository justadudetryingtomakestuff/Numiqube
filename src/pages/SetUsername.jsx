import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'
import { db } from '../firebase/config'
import { collection, query, where, getDocs } from 'firebase/firestore'
import '../styles/SetUsername.css'

function normalize(str) {
  return str
    .toLowerCase()
    .replace(/4/g, 'a')
    .replace(/@/g, 'a')
    .replace(/3/g, 'e')
    .replace(/1/g, 'i')
    .replace(/!/g, 'i')
    .replace(/0/g, 'o')
    .replace(/5/g, 's')
    .replace(/\$/g, 's')
    .replace(/7/g, 't')
    .replace(/\+/g, 't')
    .replace(/\*/g, '')
    .replace(/_/g, '')
    .replace(/-/g, '')
}

const BADWORDS = [
  'fuck', 'shit', 'bitch', 'dick', 'pussy', 'cock', 'cunt',
  'nigger', 'nigga', 'faggot', 'retard', 'ass', 'damn', 'hell'
]

function checkBadWords(str) {
  const normalized = normalize(str)
  return BADWORDS.some(w => normalized.includes(w))
}

function SetUsername() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { updateProfile } = useProfile(user)

  const [username, setUsername] = useState('')
  const [checking, setChecking] = useState(false)
  const [taken, setTaken] = useState(false)
  const [saving, setSaving] = useState(false)

  const tooShort = username.length > 0 && username.length < 3
  const tooLong = username.length > 20
  const invalidChars = username.length > 0 && !/^[a-zA-Z0-9]+$/.test(username)
  const hasBadWord = checkBadWords(username)
  const isValid = username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9]+$/.test(username) && !hasBadWord && !taken

  async function checkAvailability() {
    if (!isValid) return
    setChecking(true)
    const q = query(collection(db, 'users'), where('username', '==', username))
    const snap = await getDocs(q)
    setTaken(!snap.empty)
    setChecking(false)
  }

  async function handleSave() {
  if (!isValid || taken) return
  setSaving(true)
  const now = new Date()
  const currentYear = now.getFullYear()
  const lastChangeYear = profile?.usernameChangeYear ?? 0
  const changes = lastChangeYear === currentYear ? (profile?.usernameChanges ?? 0) : 0

  if (changes >= 3) {
    alert('You have used all 3 username changes for this year!')
    setSaving(false)
    return
  }

  await updateProfile({
    username,
    name: username,
    usernameChanges: changes + 1,
    usernameChangeYear: currentYear
  })
  navigate('/dashboard')
}

  const requirements = [
    { label: '3-20 characters', met: username.length >= 3 && username.length <= 20 },
    { label: 'Letters and numbers only', met: username.length > 0 && /^[a-zA-Z0-9]+$/.test(username) },
    { label: 'No inappropriate words', met: username.length > 0 && !hasBadWord },
    { label: 'Username available', met: username.length >= 3 && !taken && !checking },

    <p className="su-changes">
  {(() => {
    const year = new Date().getFullYear()
    const changes = profile?.usernameChangeYear === year ? (profile?.usernameChanges ?? 0) : 0
    return `${changes}/3 username changes used this year`
  })()}
</p>
  ]

  

  return (
    <div className="set-username">
      <div className="su-card">
        <div className="su-logo">
          <div className="logo-cube">
            <div className="cube-face face-front">N</div>
            <div className="cube-face face-back">Q</div>
            <div className="cube-face face-right">M</div>
            <div className="cube-face face-left">U</div>
            <div className="cube-face face-top">I</div>
            <div className="cube-face face-bottom">B</div>
          </div>
        </div>

        <h2 className="su-title">Pick your username</h2>
        <p className="su-sub">This is how other players will see you. Choose wisely!</p>

        <div className="su-input-wrap">
          <input
            className={`su-input ${username.length >= 3 && !invalidChars && !hasBadWord ? isValid && !taken ? 'valid' : 'invalid' : ''}`}
            type="text"
            placeholder="Enter username..."
            value={username}
            maxLength={20}
            onChange={e => {
              setUsername(e.target.value)
              setTaken(false)
            }}
            onBlur={checkAvailability}
          />
          <span className="su-char-count">{username.length}/20</span>
        </div>

        {/* Requirements list */}
        <div className="su-requirements">
          {requirements.map((req, i) => (
            <div key={i} className={`su-req ${username.length === 0 ? '' : req.met ? 'met' : 'unmet'}`}>
              <span className="su-req-icon">
                {username.length === 0 ? '○' : req.met ? '✅' : '❌'}
              </span>
              <span>{req.label}</span>
            </div>
          ))}
        </div>

        {taken && (
          <div className="su-error">❌ That username is already taken!</div>
        )}

        {checking && (
          <div className="su-checking">Checking availability...</div>
        )}

        <button
          className="btn-primary"
          onClick={handleSave}
          disabled={!isValid || taken || saving || checking}
        >
          {saving ? 'Saving...' : 'Set Username 🚀'}
        </button>

        <button className="su-skip" onClick={() => navigate('/dashboard')}>
          Skip for now
        </button>
      </div>
    </div>
  )
}

export default SetUsername