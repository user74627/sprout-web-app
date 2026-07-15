import { useEffect, useState } from 'react'
import { Monitor, Smartphone } from 'lucide-react'
import { isDemoMode } from '../../lib/isDemoMode'

function initialMode() {
  const saved = localStorage.getItem('sprout-view-mode')
  if (saved === 'website' || saved === 'app') return saved
  return window.matchMedia?.('(min-width: 1024px)').matches ? 'website' : 'app'
}

export default function ViewModeToggle() {
  const [mode, setMode] = useState(initialMode)

  useEffect(() => {
    localStorage.setItem('sprout-view-mode', mode)
    document.documentElement.dataset.viewMode = mode
  }, [mode])

  if (!isDemoMode) return null

  const nextMode = mode === 'app' ? 'website' : 'app'
  const label = `Switch to ${nextMode === 'app' ? 'mobile app' : 'desktop website'} view`

  return (
    <button type="button" onClick={() => setMode(nextMode)} className="garden-view-toggle" title={label} aria-label={label}>
      {mode === 'app' ? <Smartphone size={17} aria-hidden="true" /> : <Monitor size={17} aria-hidden="true" />}
      <span>{mode === 'app' ? 'App view' : 'Website view'}</span>
    </button>
  )
}
