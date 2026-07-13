import { motion } from 'framer-motion'

const FILL_CLASS = {
  health: 'progress-fill-health',
  xp: 'progress-fill-xp',
  droopy: 'progress-fill-droopy',
  sad: 'progress-fill-sad',
  thriving: 'progress-fill-health',
  content: 'progress-fill-health',
}

export default function ProgressBar({
  value = 0,
  max = 100,
  variant = 'health',
  size = 'md',
  className = '',
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  const fillClass = FILL_CLASS[variant] || FILL_CLASS.health
  const trackClass = size === 'sm' ? 'progress-track-sm' : 'progress-track'

  return (
    <div className={`${trackClass} ${className}`}>
      <div className="progress-track-inner" aria-hidden="true" />
      <motion.div
        className={`progress-fill ${fillClass}`}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="progress-shine" aria-hidden="true" />
      </motion.div>
    </div>
  )
}
