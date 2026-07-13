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
      className="fixed bottom-20 right-4 z-40 bg-white/90 backdrop-blur-sm border border-soil-200/50 rounded-full px-3 py-2 shadow-sm text-xs font-medium text-soil-600 transition-colors duration-150 hover:bg-soil-50 focus-visible:ring-2 focus-visible:ring-sprout-400"
      title={label}
      aria-label={label}
    >
      {mode === 'app' ? '📱' : '🖥️'}
    </button>
  )
}
