import { isDemoMode } from '../../lib/isDemoMode'

export default function DemoBanner() {
  if (!isDemoMode) return null

  return (
    <div className="bg-sprout-100 border-b border-sprout-200 text-sprout-800 text-xs text-center py-2 px-4">
      <span aria-hidden="true">🌱 </span>
      <span className="font-semibold">Demo mode</span>
      {' — '}
      Your pet &amp; tasks stay in this browser only.
    </div>
  )
}
