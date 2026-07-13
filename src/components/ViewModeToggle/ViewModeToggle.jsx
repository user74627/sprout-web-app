import { useEffect, useState } from 'react'
import { isDemoMode } from '../../lib/isDemoMode'

export default function ViewModeToggle() {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('sprout-view-mode')
    return saved === 'website' ? 'website' : 'app'
  })

  useEffect(() => {
    localStorage.setItem('sprout-view-mode', mode)
    document.documentElement.dataset.viewMode = mode
  }, [mode])

  if (!isDemoMode) return null

  const nextMode = mode === 'app' ? 'website' : 'app'
  const label = `Switch to ${nextMode === 'app' ? 'mobile app' : 'desktop website'} view`

  return (
    <button
      type="button"
      onClick={() => setMode(nextMode)}
      className="fixed bottom-20 right-4 z-40 bg-surface-elevated border border-line-subtle rounded-full px-3 py-2 shadow-card text-caption font-semibold text-ink"
      title={label}
      aria-label={label}
    >
      {mode === 'app' ? '📱' : '🖥️'}
    </button>
  )
}
