export function startOfDayMs(date = new Date()) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export function isSameDay(a, b = new Date()) {
  const first = new Date(a)
  const second = new Date(b)
  return startOfDayMs(first) === startOfDayMs(second)
}

export function daysBetween(a, b = Date.now()) {
  return Math.floor((startOfDayMs(b) - startOfDayMs(a)) / 86_400_000)
}

export function updateStreak({ lastCompletedAt, currentStreak = 0, now = Date.now() }) {
  if (!lastCompletedAt) {
    return { currentStreak: 1, bestStreak: 1, lastCompletedAt: now }
  }

  const gap = daysBetween(lastCompletedAt, now)
  const nextStreak = gap === 0 ? currentStreak : gap === 1 ? currentStreak + 1 : 1

  return {
    currentStreak: nextStreak,
    bestStreak: nextStreak,
    lastCompletedAt: now,
  }
}

