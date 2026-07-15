import { motion } from 'framer-motion'
import { Leaf } from 'lucide-react'

export default function GardenProgress({ completed = 0, total = 0, size = 104 }) {
  const safeTotal = Math.max(1, total)
  const progress = Math.min(1, completed / safeTotal)
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - progress)
  const done = total > 0 && completed === total

  return (
    <div className="garden-progress" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle className="garden-progress-track" cx="50" cy="50" r={radius} />
        <motion.circle
          className={done ? 'garden-progress-fill is-done' : 'garden-progress-fill'}
          cx="50"
          cy="50"
          r={radius}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      <div className="garden-progress-copy">
        {done && <Leaf size={17} aria-hidden="true" />}
        <strong>{completed}<span>/{total}</span></strong>
        <small>today</small>
      </div>
    </div>
  )
}
