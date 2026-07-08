import { motion } from 'framer-motion'

/** Small decorative sprout illustration to keep empty states on-brand. */
function SproutSpot({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" aria-hidden="true">
      <circle cx="28" cy="28" r="26" fill="#dcfce7" />
      <path d="M28 40 Q27.5 32 28 25" stroke="#16a34a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M27 30 C21 26 16 22 15 16 C21 18 26 24 27.5 29 Z" fill="#22c55e" />
      <path d="M29 26 C35 22 40 18 41 12 C35 14 30 20 28.5 25 Z" fill="#16a34a" />
      <ellipse cx="28" cy="42" rx="9" ry="2.5" fill="#bbf7d0" />
    </svg>
  )
}

export default function EmptyState({ illustration, title, message, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card text-center py-10 flex flex-col items-center"
    >
      <div className="mb-4">{illustration ?? <SproutSpot />}</div>
      <p className="text-card-heading">{title}</p>
      {message && <p className="text-caption text-ink-muted mt-1 max-w-[240px]">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  )
}

export { SproutSpot }
