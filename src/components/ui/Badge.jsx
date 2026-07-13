const VARIANTS = {
  easy: 'badge-easy',
  medium: 'badge-medium',
  hard: 'badge-hard',
  sprout: 'badge bg-sprout-100 text-sprout-700',
  thriving: 'badge-mood badge-mood-thriving',
  content: 'badge-mood badge-mood-content',
  droopy: 'badge-mood badge-mood-droopy',
  sad: 'badge-mood badge-mood-sad',
  default: 'badge bg-soil-100 text-soil-600',
}

export default function Badge({ variant = 'default', children, className = '' }) {
  const base = VARIANTS[variant] || VARIANTS.default
  return (
    <span className={`${base} ${className}`}>
      {children}
    </span>
  )
}
