import { useState } from 'react'

export function useXP() {
  const [xp, setXp] = useState(0)
  const [level, setLevel] = useState(1)

  function addXP(amount) {
    setXp(prev => {
      const newXP = prev + amount
      setLevel(Math.floor(newXP / 500) + 1)
      return newXP
    })
  }

  return { xp, level, addXP }
}