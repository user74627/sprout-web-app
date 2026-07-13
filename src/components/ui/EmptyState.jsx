import { motion } from 'framer-motion'

function SproutSpot({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="#e6f2dc" />
      <ellipse cx="32" cy="54" rx="14" ry="4" fill="rgba(74,63,50,0.06)" />
      <path d="M32 46 Q31.5 36 32 28" stroke="#489234" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M30 34 C24 30 18 26 17 20 C23 22 28 28 30.5 33 Z" fill="#7bc462" />
      <path d="M34 30 C40 26 46 22 47 16 C41 18 36 24 33.5 29 Z" fill="#5aad42" />
      <circle cx="32" cy="22" r="10" fill="#7bc462" />
      <circle cx="28" cy="21" r="1.5" fill="#2d5e1f" />
      <circle cx="36" cy="21" r="1.5" fill="#2d5e1f" />
      <path d="M28 25 Q32 28 36 25" stroke="#2d5e1f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export default function EmptyState({ illustration, title, message, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="card-flat text-center py-10 px-5 flex flex-col items-center gap-3"
    >
      <div className="mb-1">{illustration ?? <SproutSpot />}</div>
      <p className="text-card-heading">{title}</p>
      {message && (
        <p className="text-sm text-soil-600 max-w-[260px] leading-relaxed">{message}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </motion.div>
  )
}

export { SproutSpot }
