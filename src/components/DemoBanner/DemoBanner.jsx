import { isDemoMode } from '../../lib/isDemoMode'

export default function DemoBanner() {
  if (!isDemoMode) return null

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs text-amber-900">
      <span className="font-semibold">Demo mode</span>
      {' — '}
      No account needed. Progress is saved in this browser only.
    </div>
  )
}
