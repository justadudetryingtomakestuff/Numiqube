import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'
import { db } from '../firebase/config'
import { doc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import '../styles/Duel.css'

const questions = [
  { question: 'Solve: 3x + 6 = 18', options: ['x = 4', 'x = 3', 'x = 6', 'x = 2'], answer: 'x = 4' },
  { question: 'What is 12²?', options: ['144', '124', '132', '156'], answer: '144' },
  { question: 'Simplify: 4x + 2x - x', options: ['5x', '6x', '7x', '4x'], answer: '5x' },
  { question: 'Area of rectangle 6×9?', options: ['54', '30', '45', '63'], answer: '54' },
  { question: 'What is 15% of 80?', options: ['12', '10', '15', '8'], answer: '12' },
  { question: 'Solve: 2x - 4 = 10', options: ['x = 7', 'x = 6', 'x = 8', 'x = 5'], answer: 'x = 7' },
  { question: 'What is √144?', options: ['12', '14', '11', '13'], answer: '12' },
  { question: 'Expand: (x+2)(x+3)', options: ['x²+5x+6', 'x²+6x+5', 'x²+5x+5', 'x²+6x+6'], answer: 'x²+5x+6' },
  { question: 'What is 3³?', options: ['27', '9', '18', '24'], answer: '27' },
  { question: 'Solve: x/4 = 5', options: ['x = 20', 'x = 15', 'x = 25', 'x = 9'], answer: 'x = 20' },
]

function Duel() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { profile, updateProfile } = useProfile(user)

  const opponent = location.state?.opponent

  const [phase, setPhase] = useState('waiting') // waiting, countdown, playing, finished
  const [countdown, setCountdown] = useState(3)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [myScore, setMyScore] = useState(0)
  const [theirScore, setTheirScore] = useState(0)
  const [duelId, setDuelId] = useState(null)
  const [winner, setWinner] = useState(null)

  const TARGET = 7

  // Create or join duel
  useEffect(() => {
    if (!user || !opponent) return

    const id = [user.uid, opponent.uid].sort().join('_')
    setDuelId(id)

    async function setupDuel() {
      const duelRef = doc(db, 'duels', id)
      await setDoc(duelRef, {
        players: {
          [user.uid]: { name: user.displayName, score: 0 },
          [opponent.uid]: { name: opponent.name, score: 0 }
        },
        status: 'active',
        startedAt: new Date().toISOString()
      }, { merge: true })
    }

    setupDuel()

    // Listen for duel updates
    const unsub = onSnapshot(doc(db, 'duels', id), (snap) => {
      if (!snap.exists()) return
      const data = snap.data()
      const theirData = data.players?.[opponent.uid]
      if (theirData) setTheirScore(theirData.score ?? 0)

      if (data.status === 'finished') {
        setWinner(data.winner)
        setPhase('finished')
      }
    })

    return () => unsub()
  }, [user, opponent])

  // Countdown
  useEffect(() => {
    if (phase !== 'waiting' || !duelId) return
    setPhase('countdown')
    let count = 3
    const interval = setInterval(() => {
      count--
      setCountdown(count)
      if (count === 0) {
        clearInterval(interval)
        setPhase('playing')
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [duelId])

  async function handleAnswer(option) {
    if (selected || phase !== 'playing') return
    setSelected(option)

    if (option === questions[current].answer) {
      const newScore = myScore + 1
      setMyScore(newScore)

      // Update Firestore
      await updateDoc(doc(db, 'duels', duelId), {
        [`players.${user.uid}.score`]: newScore
      })

      // Check win condition
      if (newScore >= TARGET) {
        await updateDoc(doc(db, 'duels', duelId), {
          status: 'finished',
          winner: user.uid
        })
        await updateProfile({ xp: (profile?.xp ?? 0) + 150 })
        setWinner(user.uid)
        setPhase('finished')
        return
      }
    }

    setTimeout(() => {
      setCurrent(c => (c + 1) % questions.length)
      setSelected(null)
    }, 800)
  }

  // No opponent selected
  if (!opponent) {
    return (
      <div className="duel">
        <div className="container">
          <div className="duel-header">
            <button className="btn-secondary" onClick={() => navigate('/dashboard')}>← Back</button>
            <h2 className="duel-title">⚔️ Duel</h2>
          </div>
          <div className="empty-state">
            <span>⚔️</span>
            <p>Go to Friends to challenge someone!</p>
            <button className="btn-primary" onClick={() => navigate('/friends')}>
              👥 Go to Friends
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Countdown screen
  if (phase === 'countdown') {
    return (
      <div className="duel">
        <div className="duel-countdown">
          <div className="countdown-vs">
            <span>{user.displayName}</span>
            <span className="vs-text">VS</span>
            <span>{opponent.name}</span>
          </div>
          <div className="countdown-num">{countdown}</div>
          <p>GET READY!</p>
        </div>
      </div>
    )
  }

  // Finished screen
  if (phase === 'finished') {
    const iWon = winner === user.uid
    return (
      <div className="duel">
        <div className="container">
          <div className="duel-result">
            <span className="result-crown">{iWon ? '🏆' : '😔'}</span>
            <h2>{iWon ? 'You Win!' : 'You Lose!'}</h2>
            <div className="result-scores">
              <div className="result-score-box me">
                <div className="rs-num">{myScore}</div>
                <div className="rs-name">You</div>
              </div>
              <div className="rs-vs">VS</div>
              <div className="result-score-box">
                <div className="rs-num">{theirScore}</div>
                <div className="rs-name">{opponent.name}</div>
              </div>
            </div>
            {iWon && <p className="xp-reward">+150 XP earned! ⚡</p>}
            <button className="btn-primary" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Playing screen
  const q = questions[current]
  return (
    <div className="duel">
      <div className="container">

        <div className="duel-header">
          <button className="btn-secondary" onClick={() => navigate('/dashboard')}>✕ Quit</button>
          <h2 className="duel-title">⚔️ DUEL</h2>
        </div>

        {/* Scoreboard */}
        <div className="duel-scoreboard">
          <div className="ds-player">
            <div className="ds-name">You</div>
            <div className="ds-score me">{myScore}</div>
          </div>
          <div className="ds-target">First to {TARGET}</div>
          <div className="ds-player">
            <div className="ds-name">{opponent.name}</div>
            <div className="ds-score them">{theirScore}</div>
          </div>
        </div>

        {/* Progress bars */}
        <div className="duel-bars">
          <div className="duel-bar-wrap">
            <div className="duel-bar me" style={{ width: `${(myScore / TARGET) * 100}%` }}></div>
          </div>
          <div className="duel-bar-wrap">
            <div className="duel-bar them" style={{ width: `${(theirScore / TARGET) * 100}%` }}></div>
          </div>
        </div>

        {/* Question */}
        <div className="question-card">
          <p className="question-text">{q.question}</p>
          <div className="options-grid">
            {q.options.map((option, i) => (
              <button
                key={i}
                className={`opt-btn
                  ${selected === option ? option === q.answer ? 'correct' : 'wrong' : ''}
                  ${selected && option === q.answer ? 'correct' : ''}
                `}
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Duel