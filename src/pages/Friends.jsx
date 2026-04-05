import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'
import { db } from '../firebase/config'
import {
  collection, query, where, getDocs,
  doc, setDoc, getDoc, onSnapshot
} from 'firebase/firestore'
import '../styles/Friends.css'

function Friends() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { profile } = useProfile(user)

  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [friends, setFriends] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)

  // Load friends and requests
  useEffect(() => {
    if (!user) return

    const friendsRef = collection(db, 'users', user.uid, 'friends')
    const unsubFriends = onSnapshot(friendsRef, (snap) => {
      setFriends(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })

    const requestsRef = collection(db, 'users', user.uid, 'friendRequests')
    const unsubRequests = onSnapshot(requestsRef, (snap) => {
      setRequests(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })

    return () => { unsubFriends(); unsubRequests() }
  }, [user])

  async function searchPlayers() {
    if (!searchTerm.trim()) return
    setLoading(true)

    const q = query(
      collection(db, 'users'),
      where('name', '>=', searchTerm),
      where('name', '<=', searchTerm + '\uf8ff')
    )
    const snap = await getDocs(q)
    const results = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(p => p.id !== user.uid)

    setSearchResults(results)
    setLoading(false)
  }

  async function sendFriendRequest(toUser) {
    const reqRef = doc(db, 'users', toUser.id, 'friendRequests', user.uid)
    await setDoc(reqRef, {
      from: user.uid,
      name: profile?.username ?? user.displayName,
      avatar: user.photoURL ?? '',
      status: 'pending'
    })
    alert(`Friend request sent to ${toUser.name}!`)
  }

  async function acceptRequest(req) {
    // Add to each other's friends list
    await setDoc(doc(db, 'users', user.uid, 'friends', req.from), {
      name: req.name,
      avatar: req.avatar,
      uid: req.from
    })
    await setDoc(doc(db, 'users', req.from, 'friends', user.uid), {
      name: profile?.username ?? user.displayName,
      avatar: user.photoURL ?? '',
      uid: user.uid
    })
    // Remove request
    await setDoc(doc(db, 'users', user.uid, 'friendRequests', req.from), {
      ...req, status: 'accepted'
    })
    setRequests(prev => prev.filter(r => r.from !== req.from))
  }

  return (
    <div className="friends">
      <div className="container">

        <div className="friends-header">
          <button className="btn-secondary" onClick={() => navigate('/dashboard')}>← Back</button>
          <h2 className="friends-title">👥 Friends</h2>
        </div>

        {/* Friend Requests */}
        {requests.filter(r => r.status === 'pending').length > 0 && (
          <>
            <p className="section-title">Friend Requests</p>
            {requests.filter(r => r.status === 'pending').map(req => (
              <div key={req.from} className="friend-row">
                <div className="friend-avatar">{req.avatar ? <img src={req.avatar} alt="" /> : '🧊'}</div>
                <div className="friend-info">
                  <strong>{req.name}</strong>
                  <span>wants to be your friend!</span>
                </div>
                <button className="accept-btn" onClick={() => acceptRequest(req)}>✅ Accept</button>
              </div>
            ))}
          </>
        )}

        {/* Friends List */}
        <p className="section-title">My Friends ({friends.length})</p>
        {friends.length === 0 ? (
          <div className="empty-state">
            <span>😔</span>
            <p>No friends yet — search for players below!</p>
          </div>
        ) : (
          friends.map(friend => (
            <div key={friend.id} className="friend-row">
              <div className="friend-avatar">
                {friend.avatar ? <img src={friend.avatar} alt="" /> : '🧊'}
              </div>
              <div className="friend-info">
                <strong>{friend.name}</strong>
                <span>Friend</span>
              </div>
              <button className="duel-btn" onClick={() => navigate('/duel', { state: { opponent: friend } })}>
                ⚔️ Duel
              </button>
            </div>
          ))
        )}

        {/* Search */}
        <p className="section-title">Find Players</p>
        <div className="search-row">
          <input
            className="search-input"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && searchPlayers()}
          />
          <button className="btn-primary" onClick={searchPlayers}>
            {loading ? '...' : '🔍 Search'}
          </button>
        </div>

        {searchResults.map(player => (
          <div key={player.id} className="friend-row">
            <div className="friend-avatar">
              {player.avatar ? <img src={player.avatar} alt="" /> : '🧊'}
            </div>
            <div className="friend-info">
              <strong>{player.name}</strong>
              <span>⚡ {player.xp ?? 0} XP</span>
            </div>
            <button className="add-btn" onClick={() => sendFriendRequest(player)}>
              ➕ Add
            </button>
          </div>
        ))}

      </div>
    </div>
  )
}

export default Friends