import KpiCard from './KpiCard'

export default function StatCard({ icon, value, label, unit, tone = 'default', trend, trendValue, children }) {
  if (children) {
    return (
      <KpiCard className="items-center text-center py-3">
        {icon && <div className="mb-1">{icon}</div>}
        {children}
      </KpiCard>
    )
  }

  return (
    <KpiCard
      title={label}
      value={value}
      unit={unit}
      tone={tone}
      trend={trend}
      trendValue={trendValue}
    />
  )
}
