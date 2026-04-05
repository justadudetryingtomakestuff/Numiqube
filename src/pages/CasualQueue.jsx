import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'
import { db } from '../firebase/config'
import { getRank } from '../ranks'
import '../styles/Queue.css'
import { doc, setDoc, onSnapshot, deleteDoc, collection, query, where, runTransaction } from 'firebase/firestore'

const TOPICS = ['Algebra', 'Geometry', 'Arithmetic', 'Statistics', 'Calculus']

function CasualQueue() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { profile } = useProfile(user)

  const [selectedTopics, setSelectedTopics] = useState([])
  const [queuing, setQueuing] = useState(false)
  const [timer, setTimer] = useState(0)

  const unsubRef = useRef(null)
  const timeoutRef = useRef(null)
  const intervalRef = useRef(null)

  const rank = getRank(profile?.xp ?? 0)

  function toggleTopic(topic) {
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    )
  }

  function cleanup() {
    if (unsubRef.current) { unsubRef.current(); unsubRef.current = null }
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null }
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
  }

  async function cancelQueue() {
    cleanup()
    await deleteDoc(doc(db, 'matchmaking', user.uid)).catch(() => {})
    setQueuing(false)
    setTimer(0)
  }

  async function startQueue() {
    if (selectedTopics.length === 0) {
      alert('Please select at least one topic!')
      return
    }

    setQueuing(true)
    setTimer(0)

    // Start timer display
    let seconds = 0
    intervalRef.current = setInterval(() => {
      seconds++
      setTimer(seconds)
    }, 1000)

    // Write to matchmaking queue
    const queueRef = doc(db, 'matchmaking', user.uid)
    await setDoc(queueRef, {
      uid: user.uid,
      name: profile?.username ?? user.displayName,
      mode: 'casual',
      topics: selectedTopics,
      xp: profile?.xp ?? 0,
      joinedAt: new Date().toISOString()
    })

    // Wait before listening so our own doc doesn't trigger
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Listen for other players
    const q = query(collection(db, 'matchmaking'), where('mode', '==', 'casual'))
    unsubRef.current = onSnapshot(q, async (snap) => {
      const others = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(p => p.uid !== user.uid)
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

    // Cancel after 60 seconds if no match found
    timeoutRef.current = setTimeout(async () => {
      cleanup()
      await deleteDoc(doc(db, 'matchmaking', user.uid)).catch(() => {})
      setQueuing(false)
      setTimer(0)
      alert('No opponents found! Try again or select more topics.')
    }, 60000)
  }

  return (
    <div className="queue-page">
      <div className="container">
        <div className="queue-header">
          <button className="btn-secondary" onClick={() => queuing ? cancelQueue() : navigate('/duel')}>← Back</button>
          <h2 className="queue-title">🎮 Casual Match</h2>
        </div>

        <div className="queue-info-card">
          <div className="qi-row">
            <span className="qi-icon">🎮</span>
            <div>
              <strong>Casual Mode</strong>
              <p>Play for fun! No rank changes. Win to earn +75 XP.</p>
            </div>
          </div>
          <div className="qi-row">
            <span className="qi-icon">{rank.icon}</span>
            <div>
              <strong>Your Rank</strong>
              <p style={{color: rank.color}}>{rank.name}</p>
            </div>
          </div>
        </div>

        {!queuing ? (
          <>
            <p className="section-title">Select Topics</p>
            <p className="queue-sub">Pick topics you want to be quizzed on. You'll be matched with someone who shares at least one!</p>
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
            <button className="btn-primary" onClick={startQueue} disabled={selectedTopics.length === 0}>
              Find Match 🎮
            </button>
          </>
        ) : (
          <div className="queuing-screen">
            <div className="queue-radar">🎮</div>
            <h3>Finding opponent...</h3>
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

export default CasualQueue