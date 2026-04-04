import { useNavigate } from 'react-router-dom'
import '../styles/Leaderboard.css'

const mockPlayers = [
  { rank: 1, name: 'MathWizard', xp: 4200, streak: 14, avatar: '🧙' },
  { rank: 2, name: 'AlgebraKing', xp: 3800, streak: 9, avatar: '👑' },
  { rank: 3, name: 'PImaster', xp: 3100, streak: 7, avatar: '🥧' },
  { rank: 4, name: 'Numiqube_Pro', xp: 2700, streak: 5, avatar: '🧊' },
  { rank: 5, name: 'CalcHero', xp: 2200, streak: 3, avatar: '⚡' },
  { rank: 6, name: 'YoungEuler', xp: 1900, streak: 2, avatar: '📐' },
  { rank: 7, name: 'XPgrinder', xp: 1500, streak: 1, avatar: '💪' },
]

function Leaderboard() {
  const navigate = useNavigate()

  return (
    <div className="leaderboard">
      <div className="container">

        <div className="lb-header">
          <button className="btn-secondary" onClick={() => navigate('/dashboard')}>← Back</button>
          <h2 className="lb-title">🏅 Leaderboard</h2>
        </div>

        <div className="lb-list">
          {mockPlayers.map((player) => (
            <div key={player.rank} className={`lb-row ${player.rank <= 3 ? 'top-three' : ''}`}>
              <div className="lb-rank">
                {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : `#${player.rank}`}
              </div>
              <div className="lb-avatar">{player.avatar}</div>
              <div className="lb-info">
                <strong>{player.name}</strong>
                <span>🔥 {player.streak} day streak</span>
              </div>
              <div className="lb-xp">⚡ {player.xp.toLocaleString()} XP</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Leaderboard