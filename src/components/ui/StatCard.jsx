export default function StatCard({ icon, value, label, tone = 'default', children }) {
  const toneClass = {
    default: 'text-ink',
    sprout: 'text-sprout-600',
    coin: 'text-coin-600',
    xp: 'text-xp-600',
    streak: 'text-streak-500',
  }[tone] || 'text-ink'

  return (
    <div className="card p-3 text-center flex flex-col items-center justify-center gap-0.5">
      {children ?? (
        <>
          {icon && <div className="mb-0.5">{icon}</div>}
          <p className={`text-stat-value ${toneClass}`}>{value}</p>
          <p className="text-stat-label">{label}</p>
        </>
      )}
    </div>
  )
}
