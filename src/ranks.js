export const RANKS = [
  { name: 'Integer', icon: '🔢', minXP: 0, maxXP: 499, color: '#a0a0a0' },
  { name: 'Variable', icon: '📐', minXP: 500, maxXP: 1499, color: '#4cc9f0' },
  { name: 'Function', icon: '📊', minXP: 1500, maxXP: 2999, color: '#06d6a0' },
  { name: 'Polynomial', icon: '🔷', minXP: 3000, maxXP: 5999, color: '#ffd166' },
  { name: 'Sigma', icon: '∑', minXP: 6000, maxXP: 9999, color: '#c77dff' },
  { name: 'Absolute', icon: '⚡', minXP: 10000, maxXP: Infinity, color: '#f72585' },
]

export function getRank(xp) {
  return RANKS.find(r => xp >= r.minXP && xp <= r.maxXP) ?? RANKS[0]
}

export function getNextRank(xp) {
  const current = getRank(xp)
  const index = RANKS.indexOf(current)
  return RANKS[index + 1] ?? null
}

export function getRankProgress(xp) {
  const rank = getRank(xp)
  if (rank.maxXP === Infinity) return 100
  const progress = ((xp - rank.minXP) / (rank.maxXP - rank.minXP)) * 100
  return Math.min(100, Math.round(progress))
}