export const PET_HEALTH_MAX = 100
export const PET_DECAY_PER_HOUR = 3
export const XP_PER_LEVEL = 100

export function clampHealth(value) {
  return Math.max(0, Math.min(PET_HEALTH_MAX, Number(value) || 0))
}

export function getPetState(health) {
  const safeHealth = clampHealth(health)
  if (safeHealth >= 75) return 'thriving'
  if (safeHealth >= 45) return 'content'
  if (safeHealth >= 20) return 'droopy'
  return 'sad'
}

export function getPetLevel(xp = 0) {
  return Math.floor((Number(xp) || 0) / XP_PER_LEVEL) + 1
}

export function getLevelProgress(xp = 0) {
  return (Number(xp) || 0) % XP_PER_LEVEL
}

export function applyHealthReward(health, rewardHealth) {
  return clampHealth((Number(health) || 0) + (Number(rewardHealth) || 0))
}

export function calculateHealthDecay(lastUpdatedMs, nowMs = Date.now()) {
  const elapsedHours = Math.max(0, (nowMs - (Number(lastUpdatedMs) || nowMs)) / 3_600_000)
  return Math.floor(elapsedHours * PET_DECAY_PER_HOUR)
}

export function applyHealthDecay(user, nowMs = Date.now()) {
  const decay = calculateHealthDecay(user?.lastUpdated, nowMs)
  if (decay <= 0) return { user, decay: 0 }

  return {
    decay,
    user: {
      ...user,
      petHealth: clampHealth((user?.petHealth ?? PET_HEALTH_MAX) - decay),
      lastUpdated: nowMs,
    },
  }
}

