
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'
import { db } from '../firebase/config'
import { doc, setDoc, onSnapshot, deleteDoc, collection, query, getDocs } from 'firebase/firestore'
import { getRank, getNextRank, getRankProgress, RANKS } from '../ranks'
import '../styles/Queue.css'
import { useState, useEffect, useRef } from 'react'
import { doc, setDoc, onSnapshot, deleteDoc, collection, query, where, runTransaction } from 'firebase/firestore'

const TOPICS = ['Algebra', 'Geometry', 'Arithmetic', 'Statistics', 'Calculus']

function RankedQueue() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { profile } = useProfile(user)

  const [selectedTopics, setSelectedTopics] = useState([])
  const [queuing, setQueuing] = useState(false)
  const [timer, setTimer] = useState(0)
  const [rankCounts, setRankCounts] = useState({})
  const [totalPlayers, setTotalPlayers] = useState(0)

  const xp = profile?.xp ?? 0
  const rank = getRank(xp)
  const nextRank = getNextRank(xp)
  const progress = getRankProgress(xp)

  // Load rank distribution
  useEffect(() => {
    async function loadRanks() {
      const snap = await getDocs(collection(db, 'users'))
      const players = snap.docs.map(d => d.data())
      const total = players.length
      setTotalPlayers(total)

      const counts = {}
      RANKS.forEach(r => {
        counts[r.name] = players.filter(p => {
          const playerXP = p.xp ?? 0
          return playerXP >= r.minXP && (r.maxXP === Infinity || playerXP <= r.maxXP)
        }).length
      })
      setRankCounts(counts)
    }
    loadRanks()
  }, [])

  function toggleTopic(topic) {
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    )
  }

  async function startQueue() {
    if (selectedTopics.length === 0) {
      alert('Please select at least one topic!')
      return
    }

    setQueuing(true)
    let seconds = 0
    const interval = setInterval(() => {
      seconds++
      setTimer(seconds)
    }, 1000)

    try {
      const queueRef = doc(db, 'matchmaking', user.uid)
      await setDoc(queueRef, {
        uid: user.uid,
        name: profile?.username ?? user.displayName,
        mode: 'ranked',
        topics: selectedTopics,
        xp: profile?.xp ?? 0,
        rank: rank.name,
        joinedAt: new Date().toISOString()
      })

      await new Promise(resolve => setTimeout(resolve, 1000))

      const q = query(collection(db, 'matchmaking'))
      const unsub = onSnapshot(q, async (snap) => {
        const others = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(p => p.uid !== user.uid)
          .filter(p => p.mode === 'ranked')
          .filter(p => p.topics?.some(t => selectedTopics.includes(t)))

       if (others.length > 0) {
  cleanup()
  const found = others[0]

  try {
    const myRef = doc(db, 'matchmaking', user.uid)
    const theirRef = doc(db, 'matchmaking', found.uid)

    await runTransaction(db, async (transaction) => {
      const theirDoc = await transaction.get(theirRef)
      if (!theirDoc.exists()) {
        throw new Error('opponent already matched')
      }
      transaction.delete(myRef)
      transaction.delete(theirRef)
    })

    const sharedTopics = found.topics.filter(t => selectedTopics.includes(t))
    const topic = sharedTopics[Math.floor(Math.random() * sharedTopics.length)]
    const id = [user.uid, found.uid].sort().join('_')

    await setDoc(doc(db, 'duels', id), {
      players: {
        [user.uid]: { name: user.displayName, score: 0 },
        [found.uid]: { name: found.name, score: 0 }
      },
      status: 'active',
      mode: 'casual',
      topic,
      startedAt: new Date().toISOString()
    })

    navigate('/duel', {
      state: {
        opponent: { uid: found.uid, name: found.name },
        duelId: id,
        topic,
        mode: 'casual'
      }
    })
  } catch (err) {
    console.log('Match already claimed, waiting...')
  }
}
      })

      setTimeout(async () => {
        clearInterval(interval)
        await deleteDoc(doc(db, 'matchmaking', user.uid)).catch(() => {})
        setQueuing(false)
        setTimer(0)
      }, 45000)

    } catch (err) {
      clearInterval(interval)
      setQueuing(false)
    }
  }

  async function cancelQueue() {
    await deleteDoc(doc(db, 'matchmaking', user.uid)).catch(() => {})
    setQueuing(false)
    setTimer(0)
  }

  return (
    <div className="queue-page">
      <div className="container">
        <div className="queue-header">
          <button className="btn-secondary" onClick={() => navigate('/duel')}>← Back</button>
          <h2 className="queue-title">🏆 Ranked Match</h2>
        </div>

        {/* Your rank card */}
        <div className="rank-card" style={{ borderColor: rank.color }}>
          <div className="rank-icon" style={{ color: rank.color }}>{rank.icon}</div>
          <div className="rank-info">
            <strong style={{ color: rank.color }}>{rank.name}</strong>
            <span>{xp} XP</span>
          </div>
          {nextRank && (
            <div className="rank-progress-wrap">
              <div className="rank-progress-bar" style={{ width: `${progress}%`, background: rank.color }}></div>
            </div>
          )}
          {nextRank
            ? <span className="rank-next">Next: {nextRank.icon} {nextRank.name}</span>
            : <span className="rank-next" style={{ color: rank.color }}>Max Rank!</span>
          }
        </div>

        {/* Rank distribution */}
        <p className="section-title">Rank Distribution</p>
        <div className="rank-dist">
          {RANKS.map(r => {
            const count = rankCounts[r.name] ?? 0
            const pct = totalPlayers > 0 ? Math.round((count / totalPlayers) * 100) : 0
            const isMe = r.name === rank.name
            return (
              <div key={r.name} className={`rank-dist-row ${isMe ? 'me' : ''}`}>
                <span className="rd-icon">{r.icon}</span>
                <span className="rd-name">{r.name}</span>
                <div className="rd-bar-wrap">
                  <div className="rd-bar" style={{ width: `${pct}%`, background: r.color }}></div>
                </div>
                <span className="rd-pct">{pct}%</span>
                {isMe && <span className="rd-you">YOU</span>}
              </div>
            )
          })}
        </div>

        {!queuing ? (
          <>
            <p className="section-title">Select Topics</p>
            <p className="queue-sub">Pick topics you want to be quizzed on!</p>
            <div className="topic-select-grid">
              {TOPICS.map(t => (
                <button
                  key={t}
                  className={`topic-select-btn ${selectedTopics.includes(t) ? 'active' : ''}`}
                  onClick={() => toggleTopic(t)}
                >
                  {t === 'Algebra' ? '📐' : t === 'Geometry' ? '📏' : t === 'Arithmetic' ? '🔢' : t === 'Statistics' ? '📊' : '∫'} {t}
                  {selectedTopics.includes(t) && <span className="topic-check">✓</span>}
                </button>
              ))}
            </div>

            <button
              className="btn-primary ranked-btn"
              onClick={startQueue}
              disabled={selectedTopics.length === 0}
            >
              Find Ranked Match 🏆
            </button>
          </>
        ) : (
          <div className="queuing-screen">
            <div className="queue-radar">🏆</div>
            <h3>Finding ranked opponent...</h3>
            <p className="queue-topics-label">Topics: {selectedTopics.join(', ')}</p>
            <div className="mm-dots">
              <span></span><span></span><span></span>
            </div>
            <p className="mm-timer">Searching... {timer}s</p>
            {timer >= 20 && (
              <p className="queue-hint">💡 Tip: Select more topics to find matches faster!</p>
            )}
            <button className="btn-secondary" onClick={cancelQueue}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default RankedQueue