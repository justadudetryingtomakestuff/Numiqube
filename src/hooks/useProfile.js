import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

export function useProfile(user) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    async function loadProfile() {
      const ref = doc(db, 'users', user.uid)
      const snap = await getDoc(ref)

      if (snap.exists()) {
        setProfile(snap.data())
      } else {
        const newProfile = {
          name: user.displayName,
          avatar: user.photoURL,
          xp: 0,
          level: 1,
          streak: 0,
          solved: 0,
          rank: 'Beginner',
          lastStudied: null,
          studiedDays: [],
          createdAt: new Date().toISOString()
        }
        await setDoc(ref, newProfile)
        setProfile(newProfile)
      }
      setLoading(false)
    }

    loadProfile()
  }, [user])

  async function updateProfile(updates) {
    if (!user) return
    const ref = doc(db, 'users', user.uid)
    await setDoc(ref, updates, { merge: true })
    setProfile(prev => ({ ...prev, ...updates }))
  }

 async function recordStudyDay(stats = {}) {
    if (!user || !profile) return

    const today = new Date().toISOString().split('T')[0]
    const lastStudied = profile.lastStudied
    const studiedDays = profile.studiedDays ?? []
    const dayStats = profile.dayStats ?? {}

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    const newStreak = lastStudied === yesterdayStr
      ? (profile.streak ?? 0) + 1
      : 1

    const existingStats = dayStats[today] ?? { xp: 0, solved: 0, duels: 0, studyTime: 0 }
    const updatedDayStats = {
      ...dayStats,
      [today]: {
        xp: (existingStats.xp ?? 0) + (stats.xp ?? 0),
        solved: (existingStats.solved ?? 0) + (stats.solved ?? 0),
        duels: (existingStats.duels ?? 0) + (stats.duels ?? 0),
        studyTime: (existingStats.studyTime ?? 0) + (stats.studyTime ?? 0)
      }
    }

    const updates = {
      streak: newStreak,
      lastStudied: today,
      studiedDays: studiedDays.includes(today) ? studiedDays : [...studiedDays, today],
      dayStats: updatedDayStats
    }

    await updateProfile(updates)
  }

  return { profile, loading, updateProfile, recordStudyDay }
}