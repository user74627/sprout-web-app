import { isDemoMode } from '../../lib/isDemoMode'

export default function DemoBanner() {
  if (!isDemoMode) return null

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs text-amber-900">
      <span className="font-semibold">Demo</span>
      {' — '}
      No login. Your pet & tasks are saved in <em>this</em> browser only (not shared with other visitors).
    </div>
  )
}
