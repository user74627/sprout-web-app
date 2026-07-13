import { motion, AnimatePresence } from 'framer-motion'

export default function Toast({ show, tone = 'success', children }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="toast"
          role="status"
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ type: 'spring', damping: 24, stiffness: 380 }}
          className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-xl shadow-lg
                      flex items-center gap-2 text-sm font-medium max-w-[90vw] text-center
                      ${tone === 'error'
                        ? 'bg-danger-600 text-white'
                        : 'bg-soil-800 text-white'
                      }`}
          style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function RewardToastContent({ health, coins, xp }) {
  return (
    <span className="flex items-center gap-2 tabular">
      <span className="text-sprout-300">+{health} HP</span>
      <span className="text-soil-500">·</span>
      <span className="text-coin-400">+{coins} 🪙</span>
      <span className="text-soil-500">·</span>
      <span className="text-coin-400">+{xp} XP</span>
    </span>
  )
}
