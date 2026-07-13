import { TrendingUp, TrendingDown, Flame } from 'lucide-react'

export default function KpiCard({
  title,
  value,
  unit,
  trend,
  trendValue,
  tone = 'default',
  children,
  className = '',
}) {
  const isPositive = trend === 'up'
  const toneClass = {
    default: 'text-soil-800',
    sprout: 'text-sprout-600',
    coin: 'text-coin-600',
    xp: 'text-coin-500',
    streak: 'text-streak-500',
  }[tone] || 'text-soil-800'

  const isStreakActive = tone === 'streak' && Number(value) > 0

  return (
    <div className={`kpi-card ${isStreakActive ? 'kpi-card-streak-active' : ''} ${className}`}>
      {children ?? (
        <>
          <div className="kpi-card-header">
            <span className="kpi-card-title flex items-center gap-1">
              {isStreakActive && <Flame size={12} className="text-streak-500" aria-hidden="true" />}
              {title}
            </span>
            {trend && trendValue && (
              <div className={`kpi-card-trend ${isPositive ? 'positive' : 'negative'}`}>
                {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          <div className="kpi-card-value-row">
            <span className={`text-kpi-value ${toneClass}`}>{value}</span>
            {unit && <span className="text-kpi-unit">{unit}</span>}
          </div>
        </>
      )}
    </div>
  )
}
