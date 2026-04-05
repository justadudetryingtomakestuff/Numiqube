import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'
import { db } from '../firebase/config'
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore'
import { getRank } from '../ranks'
import '../styles/Leaderboard.css'

function Leaderboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { profile } = useProfile(user)
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('xp')

  useEffect(() => {
    async function loadPlayers() {
      setLoading(true)
      const q = query(collection(db, 'users'), orderBy(tab === 'xp' ? 'xp' : 'streak', 'desc'), limit(50))
      const snap = await getDocs(q)
      setPlayers(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }
    loadPlayers()
  }, [tab])

  const myRank = players.findIndex(p => p.id === user?.uid) + 1

  return (
    <div className="leaderboard">
      <div className="container">
        <div className="lb-header">
          <button className="btn-secondary" onClick={() => navigate('/dashboard')}>← Back</button>
          <h2 className="lb-title">🏅 Leaderboard</h2>
        </div>

        {/* Your position */}
        {myRank > 0 && (
          <div className="lb-you">
            <span>Your position:</span>
            <strong>#{myRank}</strong>
            <span>out of {players.length} players</span>
          </div>
        )}

        {/* Tabs */}
        <div className="lb-tabs">
          <button className={`lb-tab ${tab === 'xp' ? 'active' : ''}`} onClick={() => setTab('xp')}>
            ⚡ XP
          </button>
          <button className={`lb-tab ${tab === 'streak' ? 'active' : ''}`} onClick={() => setTab('streak')}>
            🔥 Streak
          </button>
        </div>

        {loading ? (
          <div className="lb-loading">Loading players...</div>
        ) : players.length === 0 ? (
          <div className="empty-state">
            <span>🏅</span>
            <p>No players yet — be the first!</p>
          </div>
        ) : (
          <div className="lb-list">
            {players.map((player, i) => {
              const rank = getRank(player.xp ?? 0)
              const isMe = player.id === user?.uid
              return (
                <div key={player.id} className={`lb-row ${i < 3 ? 'top-three' : ''} ${isMe ? 'is-me' : ''}`}>
                  <div className="lb-rank">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                  </div>
                  <div className="lb-avatar">
                    {player.avatar
                      ? <img src={player.avatar} alt="" referrerPolicy="no-referrer" />
                      : <span>{player.name?.[0] ?? '?'}</span>
                    }
                  </div>
                  <div className="lb-info">
                    <strong>{player.name ?? 'Unknown'} {isMe ? '(You)' : ''}</strong>
                    <span style={{color: rank.color}}>{rank.icon} {rank.name}</span>
                  </div>
                  <div className="lb-xp">
                    {tab === 'xp'
                      ? `⚡ ${(player.xp ?? 0).toLocaleString()} XP`
                      : `🔥 ${player.streak ?? 0} days`
                    }
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Leaderboard