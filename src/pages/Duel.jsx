import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'
import { db } from '../firebase/config'
import { doc, setDoc, onSnapshot, updateDoc, deleteDoc, collection, query, where } from 'firebase/firestore'
import '../styles/Duel.css'
import { getRank, RANKS } from '../ranks'

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
  { question: 'What is the derivative of x²?', options: ['x', '2x', '2', 'x³'], answer: '2x' },
  { question: 'Factor: x² - 9', options: ['(x-3)(x+3)', '(x-9)(x+1)', '(x-3)²', 'cant factor'], answer: '(x-3)(x+3)' },
  { question: 'What is 2/3 + 1/3?', options: ['1', '2/6', '3/6', '2/3'], answer: '1' },
  { question: 'What is the mean of 2, 4, 6, 8, 10?', options: ['5', '6', '7', '8'], answer: '6' },
  { question: 'Solve: 5(x - 2) = 15', options: ['x = 5', 'x = 3', 'x = 7', 'x = 1'], answer: 'x = 5' },
  { question: 'What is 40% of 150?', options: ['50', '55', '60', '65'], answer: '60' },
  { question: 'What is the perimeter of a square with side 7?', options: ['14', '21', '28', '49'], answer: '28' },
  { question: 'Solve: x² = 81', options: ['x = 9', 'x = -9', 'x = ±9', 'x = 81'], answer: 'x = ±9' },
  { question: 'What is the slope of y = -2x + 5?', options: ['5', '-2', '2', '-5'], answer: '-2' },
  { question: 'What is P(heads) when flipping a coin?', options: ['1/4', '1/3', '1/2', '2/3'], answer: '1/2' },
]

function Duel() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { profile, updateProfile } = useProfile(user)

  const opponent = location.state?.opponent

  const [phase, setPhase] = useState('waiting')
  const [countdown, setCountdown] = useState(3)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [myScore, setMyScore] = useState(0)
  const [theirScore, setTheirScore] = useState(0)
  const [duelId, setDuelId] = useState(null)
  const [winner, setWinner] = useState(null)
  const [matchMode, setMatchMode] = useState('casual')
  const [mmTimer, setMmTimer] = useState(0)

  const TARGET = 7

  useEffect(() => {
    if (!user || !opponent || phase !== 'waiting') return

    const id = [user.uid, opponent.uid].sort().join('_')
    setDuelId(id)

    async function setupDuel() {
      const duelRef = doc(db, 'duels', id)
      await setDoc(duelRef, {
        players: {
          [user.uid]: { name: profile?.username ?? user.displayName, score: 0 },
          [opponent.uid]: { name: opponent.name, score: 0 }
        },
        status: 'active',
        startedAt: new Date().toISOString()
      }, { merge: true })
    }

    setupDuel()
    setPhase('countdown')
  }, [user, opponent])

  useEffect(() => {
    if (!duelId) return
    const unsub = onSnapshot(doc(db, 'duels', duelId), (snap) => {
      if (!snap.exists()) return
      const data = snap.data()
      const opponentUid = opponent?.uid
      if (opponentUid) {
        const theirData = data.players?.[opponentUid]
        if (theirData) setTheirScore(theirData.score ?? 0)
      }
      if (data.status === 'finished') {
        setWinner(data.winner)
        setPhase('finished')
      }
    })
    return () => unsub()
  }, [duelId])

  useEffect(() => {
    if (phase !== 'countdown') return
    let count = 3
    setCountdown(3)
    const interval = setInterval(() => {
      count--
      setCountdown(count)
      if (count === 0) {
        clearInterval(interval)
        setPhase('playing')
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [phase])

  async function startQuickMatch(mode) {
    setMatchMode(mode)
    setPhase('matchmaking')
    let seconds = 0

    const timer = setInterval(() => {
      seconds++
      setMmTimer(seconds)
    }, 1000)

    try {
      const queueRef = doc(db, 'matchmaking', user.uid)
    await setDoc(queueRef, {
  uid: user.uid,
  name: profile?.username ?? user.displayName,
  mode,
  xp: profile?.xp ?? 0,
  joinedAt: new Date().toISOString()
})

// Small delay to let write complete
await new Promise(resolve => setTimeout(resolve, 1000))

const q = query(collection(db, 'matchmaking'), where('mode', '==', mode))
      const unsub = onSnapshot(q, async (snap) => {
       const others = snap.docs
  .map(d => ({ id: d.id, ...d.data() }))
  .filter(p => p.uid !== user.uid && p.mode === mode)

if (others.length > 0) {
          clearInterval(timer)
          unsub()
          const found = others[0]
          await deleteDoc(doc(db, 'matchmaking', user.uid))
          await deleteDoc(doc(db, 'matchmaking', found.uid))

          const id = [user.uid, found.uid].sort().join('_')
          setDuelId(id)
          await setDoc(doc(db, 'duels', id), {
            players: {
              [user.uid]: { name: profile?.username ?? user.displayName, score: 0 },
              [found.uid]: { name: found.name, score: 0 }
            },
            status: 'active',
            mode,
            startedAt: new Date().toISOString()
          })
          setPhase('countdown')
        }
      })

      setTimeout(async () => {
        clearInterval(timer)
        await deleteDoc(doc(db, 'matchmaking', user.uid)).catch(() => {})
        setPhase('waiting')
      }, 45000)

    } catch (err) {
      clearInterval(timer)
      setPhase('waiting')
    }
  }

  async function handleAnswer(option) {
    if (selected || phase !== 'playing') return
    setSelected(option)

    if (option === questions[current].answer) {
      const newScore = myScore + 1
      setMyScore(newScore)

      if (duelId) {
        await updateDoc(doc(db, 'duels', duelId), {
          [`players.${user.uid}.score`]: newScore
        })
      }

    if (newScore >= TARGET) {
  if (duelId) {
    await updateDoc(doc(db, 'duels', duelId), {
      status: 'finished',
      winner: user.uid
    })
  }
  const xpReward = matchMode === 'ranked' ? 200 : 75
  const newXP = (profile?.xp ?? 0) + xpReward
  const newRank = getRank(newXP)
  await updateProfile({
    xp: newXP,
    rank: newRank.name,
  })
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

  // Mode selection screen
  if (phase === 'waiting') {
    return (
      <div className="duel">
        <div className="container">
          <div className="duel-header">
            <button className="btn-secondary" onClick={() => navigate('/dashboard')}>← Back</button>
            <h2 className="duel-title">⚔️ Duel</h2>
          </div>

          <div className="duel-modes">
            <p className="section-title">Choose Mode</p>

            <div className="mode-card" onClick={() => navigate('/friends')}>
              <span>👥</span>
              <div className="mode-info">
                <strong>Challenge a Friend</strong>
                <span>Pick someone from your friends list</span>
              </div>
              <span className="mode-arrow">→</span>
            </div>

          <div className="mode-card" onClick={() => navigate('/casual')}>
              <span>🎮</span>
              <div className="mode-info">
                <strong>Casual Match</strong>
                <span>Play for fun, no rank on the line</span>
              </div>
              <span className="mode-arrow">→</span>
            </div>

         <div className="mode-card ranked" onClick={() => navigate('/ranked')}>
              <span>🏆</span>
              <div className="mode-info">
                <strong>Ranked Match</strong>
                <span>Compete for rank and XP</span>
              </div>
              <span className="mode-arrow">→</span>

              <p className="section-title" style={{marginTop: '20px'}}>Rank Ladder</p>
<div className="rank-ladder">
  {RANKS.map(r => (
    <div key={r.name} className="rank-ladder-row">
      <span className="rl-icon">{r.icon}</span>
      <span className="rl-name" style={{color: r.color}}>{r.name}</span>
      <span className="rl-xp">{r.minXP === 0 ? '0' : r.minXP.toLocaleString()} — {r.maxXP === Infinity ? '∞' : r.maxXP.toLocaleString()} XP</span>
    </div>
  ))}
</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  

  // Matchmaking screen
  if (phase === 'matchmaking') {
    return (
      <div className="duel">
        <div className="matchmaking">
          <div className="mm-radar">🔍</div>
          <h2>Finding an opponent...</h2>
          <p className="mm-mode">{matchMode === 'ranked' ? '🏆 Ranked' : '🎮 Casual'}</p>
          <div className="mm-dots">
            <span></span><span></span><span></span>
          </div>
          <p className="mm-timer">Searching... {mmTimer}s</p>
          <button className="btn-secondary" onClick={() => {
            deleteDoc(doc(db, 'matchmaking', user.uid)).catch(() => {})
            setPhase('waiting')
          }}>
            Cancel
          </button>
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
            <span>{profile?.username ?? user.displayName}</span>
            <span className="vs-text">VS</span>
            <span>{opponent?.name ?? 'Opponent'}</span>
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
                <div className="rs-name">{opponent?.name ?? 'Opponent'}</div>
              </div>
            </div>
            {iWon && <p className="xp-reward">+{matchMode === 'ranked' ? 200 : 150} XP earned! ⚡</p>}
            <button className="btn-primary" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </button>
            <button className="btn-secondary" onClick={() => setPhase('waiting')}>
              Play Again
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
          <h2 className="duel-title">⚔️ {matchMode === 'ranked' ? 'RANKED' : 'CASUAL'}</h2>
        </div>

        <div className="duel-scoreboard">
          <div className="ds-player">
            <div className="ds-name">You</div>
            <div className="ds-score me">{myScore}</div>
          </div>
          <div className="ds-target">First to {TARGET}</div>
          <div className="ds-player">
            <div className="ds-name">{opponent?.name ?? 'Opponent'}</div>
            <div className="ds-score them">{theirScore}</div>
          </div>
        </div>

        <div className="duel-bars">
          <div className="duel-bar-wrap">
            <div className="duel-bar me" style={{ width: `${(myScore / TARGET) * 100}%` }}></div>
          </div>
          <div className="duel-bar-wrap">
            <div className="duel-bar them" style={{ width: `${(theirScore / TARGET) * 100}%` }}></div>
          </div>
        </div>

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