import { useState, useEffect } from 'react'
import { auth, provider } from '../firebase/config'
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  function login() {
    return signInWithPopup(auth, provider)
  }

  function logout() {
    return signOut(auth)
  }

  return { user, loading, login, logout }
}